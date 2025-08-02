# Minimal Cost AWS Infrastructure for PantryToStore
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "pantrytostore"
}

variable "domain_name" {
  description = "Domain name for the application (disabled for cost optimization)"
  type        = string
  default     = ""
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

# VPC configuration is now in vpc.tf

# Security Groups
resource "aws_security_group" "alb" {
  name_prefix = "${var.app_name}-${var.environment}-alb-"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.app_name}-${var.environment}-alb-sg"
    Environment = var.environment
  }
}

resource "aws_security_group" "ecs" {
  name_prefix = "${var.app_name}-${var.environment}-ecs-"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 0
    to_port         = 65535
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.app_name}-${var.environment}-ecs-sg"
    Environment = var.environment
  }
}

resource "aws_security_group" "rds" {
  name_prefix = "${var.app_name}-${var.environment}-rds-"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
  }

  tags = {
    Name        = "${var.app_name}-${var.environment}-rds-sg"
    Environment = var.environment
  }
}

# S3 Bucket for static files (Very cheap)
resource "aws_s3_bucket" "static" {
  bucket = "${var.app_name}-${var.environment}-static-${random_string.bucket_suffix.result}"

  tags = {
    Name        = "${var.app_name}-${var.environment}-static"
    Environment = var.environment
  }
}

resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

resource "aws_s3_bucket_public_access_block" "static" {
  bucket = aws_s3_bucket.static.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "static" {
  bucket = aws_s3_bucket.static.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.static.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.static]
}

# RDS PostgreSQL (Minimal cost configuration)
resource "aws_db_instance" "main" {
  identifier = "${var.app_name}-${var.environment}-db"

  engine         = "postgres"
  engine_version = "15"
  instance_class = "db.t3.micro"   # Smallest available instance for cost optimization

  allocated_storage     = 10  # Absolute minimum
  max_allocated_storage = 20  # Further reduced for cost optimization
  storage_type          = "gp2"
  storage_encrypted     = false  # Disabled to save cost (enable for sensitive data)

  db_name  = "pantrytostore"
  username = "dbadmin"
  password = random_password.db_password.result

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  backup_retention_period = 1    # Minimum (was 7)
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  skip_final_snapshot = true
  deletion_protection = false  # Disabled for easy cleanup

  # Cost optimization settings
  multi_az               = false  # Single AZ (was multi-AZ)
  publicly_accessible    = false
  auto_minor_version_upgrade = true

  tags = {
    Name        = "${var.app_name}-${var.environment}-db"
    Environment = var.environment
  }
}

resource "random_password" "db_password" {
  length  = 16
  special = true
}

# Secrets Manager (for database password)
resource "aws_secretsmanager_secret" "django_secret" {
  name = "${var.app_name}-${var.environment}-django-secret-key"
  
  tags = {
    Name        = "${var.app_name}-${var.environment}-django-secret"
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "django_secret" {
  secret_id     = aws_secretsmanager_secret.django_secret.id
  secret_string = random_password.django_secret.result
}

resource "random_password" "django_secret" {
  length  = 50
  special = true
}

resource "aws_secretsmanager_secret" "db_password" {
  name = "${var.app_name}-${var.environment}-db-password"
  
  tags = {
    Name        = "${var.app_name}-${var.environment}-db-password"
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = random_password.db_password.result
}

# Outputs
output "rds_endpoint" {
  value = aws_db_instance.main.endpoint
}

output "s3_bucket_name" {
  value = aws_s3_bucket.static.bucket
}

output "db_password" {
  value     = random_password.db_password.result
  sensitive = true
}

output "alb_security_group_id" {
  value = aws_security_group.alb.id
}

output "ecs_security_group_id" {
  value = aws_security_group.ecs.id
}