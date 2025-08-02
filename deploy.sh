#!/bin/bash

# PantryToStore AWS Deployment Script
set -e

echo "🚀 Starting PantryToStore deployment to AWS..."

# Configuration
AWS_REGION="us-east-1"
APP_NAME="pantrytostore"
ENVIRONMENT="production"
DOMAIN_NAME="your-domain.com"  # Replace with your domain
ALERT_EMAIL="admin@your-domain.com"  # Replace with your email

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! command -v terraform &> /dev/null; then
        log_error "Terraform is not installed. Please install it first."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured. Run 'aws configure' first."
        exit 1
    fi
    
    log_info "Prerequisites check passed ✅"
}

# Deploy infrastructure
deploy_infrastructure() {
    log_info "Deploying AWS infrastructure with Terraform..."
    
    cd infrastructure/terraform
    
    # Initialize Terraform
    terraform init
    
    # Plan deployment
    terraform plan \
        -var="aws_region=$AWS_REGION" \
        -var="app_name=$APP_NAME" \
        -var="environment=$ENVIRONMENT" \
        -var="domain_name=$DOMAIN_NAME" \
        -var="alert_email=$ALERT_EMAIL" \
        -out=tfplan
    
    # Apply deployment
    log_warn "About to deploy infrastructure. This will create AWS resources and incur costs."
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        terraform apply tfplan
        log_info "Infrastructure deployed successfully ✅"
    else
        log_info "Deployment cancelled."
        exit 0
    fi
    
    cd ../..
}

# Build and push Docker images
build_and_push_images() {
    log_info "Building and pushing Docker images..."
    
    # Get ECR login token
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com
    
    # Get ECR repository URLs
    BACKEND_ECR_URI=$(aws ecr describe-repositories --repository-names "$APP_NAME-$ENVIRONMENT-backend" --region $AWS_REGION --query 'repositories[0].repositoryUri' --output text)
    FRONTEND_ECR_URI=$(aws ecr describe-repositories --repository-names "$APP_NAME-$ENVIRONMENT-frontend" --region $AWS_REGION --query 'repositories[0].repositoryUri' --output text)
    
    # Build and push backend
    log_info "Building backend image..."
    cd backend
    docker build -t $BACKEND_ECR_URI:latest .
    docker push $BACKEND_ECR_URI:latest
    cd ..
    
    # Build and push frontend
    log_info "Building frontend image..."
    cd frontend
    docker build -t $FRONTEND_ECR_URI:latest .
    docker push $FRONTEND_ECR_URI:latest
    cd ..
    
    log_info "Docker images pushed successfully ✅"
}

# Update ECS services
update_services() {
    log_info "Updating ECS services..."
    
    # Update backend service
    aws ecs update-service \
        --cluster "$APP_NAME-$ENVIRONMENT" \
        --service "$APP_NAME-$ENVIRONMENT-backend" \
        --force-new-deployment \
        --region $AWS_REGION
    
    # Update frontend service
    aws ecs update-service \
        --cluster "$APP_NAME-$ENVIRONMENT" \
        --service "$APP_NAME-$ENVIRONMENT-frontend" \
        --force-new-deployment \
        --region $AWS_REGION
    
    log_info "Waiting for services to stabilize..."
    
    # Wait for services to be stable
    aws ecs wait services-stable \
        --cluster "$APP_NAME-$ENVIRONMENT" \
        --services "$APP_NAME-$ENVIRONMENT-backend" \
        --region $AWS_REGION
    
    aws ecs wait services-stable \
        --cluster "$APP_NAME-$ENVIRONMENT" \
        --services "$APP_NAME-$ENVIRONMENT-frontend" \
        --region $AWS_REGION
    
    log_info "ECS services updated successfully ✅"
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."
    
    # Get subnet and security group IDs
    SUBNET_ID=$(aws ec2 describe-subnets --filters "Name=tag:Type,Values=Private" --query "Subnets[0].SubnetId" --output text --region $AWS_REGION)
    SECURITY_GROUP_ID=$(aws ec2 describe-security-groups --filters "Name=tag:Name,Values=$APP_NAME-$ENVIRONMENT-ecs-sg*" --query "SecurityGroups[0].GroupId" --output text --region $AWS_REGION)
    
    # Run migration task
    aws ecs run-task \
        --cluster "$APP_NAME-$ENVIRONMENT" \
        --task-definition "$APP_NAME-$ENVIRONMENT-backend" \
        --overrides '{
            "containerOverrides": [{
                "name": "backend",
                "command": ["python", "manage.py", "migrate"]
            }]
        }' \
        --launch-type FARGATE \
        --network-configuration "{
            \"awsvpcConfiguration\": {
                \"subnets\": [\"$SUBNET_ID\"],
                \"securityGroups\": [\"$SECURITY_GROUP_ID\"],
                \"assignPublicIp\": \"DISABLED\"
            }
        }" \
        --region $AWS_REGION
    
    log_info "Database migrations completed ✅"
}

# Get deployment info
get_deployment_info() {
    log_info "Getting deployment information..."
    
    ALB_DNS=$(aws elbv2 describe-load-balancers --names "$APP_NAME-$ENVIRONMENT-alb" --query 'LoadBalancers[0].DNSName' --output text --region $AWS_REGION)
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "📋 Deployment Information:"
    echo "  • Application Load Balancer: https://$ALB_DNS"
    echo "  • Domain (when DNS propagates): https://$DOMAIN_NAME"
    echo "  • CloudWatch Dashboard: https://console.aws.amazon.com/cloudwatch/home?region=$AWS_REGION#dashboards:name=$APP_NAME-$ENVIRONMENT-dashboard"
    echo "  • ECS Cluster: https://console.aws.amazon.com/ecs/home?region=$AWS_REGION#/clusters/$APP_NAME-$ENVIRONMENT"
    echo ""
    echo "⚠️  Don't forget to:"
    echo "  1. Update your domain's DNS to point to the ALB"
    echo "  2. Set up GitHub Actions secrets for CI/CD"
    echo "  3. Monitor costs in AWS Cost Explorer"
    echo ""
}

# Main execution
main() {
    log_info "PantryToStore AWS Deployment Script"
    echo "This script will deploy your application to AWS using:"
    echo "  • ECS Fargate for container orchestration"
    echo "  • RDS PostgreSQL for database"
    echo "  • ElastiCache Redis for caching"
    echo "  • Application Load Balancer with SSL"
    echo "  • CloudWatch for monitoring"
    echo ""
    
    check_prerequisites
    deploy_infrastructure
    build_and_push_images
    update_services
    run_migrations
    get_deployment_info
}

# Run main function
main "$@"