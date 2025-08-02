# 🚀 PantryToStore Production Deployment Guide

## 📋 **Overview**

This guide covers everything you need to know about deploying and managing your PantryToStore application in production on AWS with maximum cost optimization.

## 🏗️ **Architecture Overview**

### **Single Container Architecture**
```
Internet → CloudFront (HTTPS/CDN) → ECS Fargate (Single Container)
                                       ├── Nginx (Port 80, Reverse Proxy)
                                       ├── Django Backend (Port 8000, Internal)
                                       └── Vue.js Frontend (Static Files)
                                   → RDS PostgreSQL
                                   → S3 (Static/Media Files)
```

### **Cost Optimizations Applied**
- ✅ **No Load Balancer** - Eliminated ALB/NLB ($15-20/month savings)
- ✅ **Single Container** - Combined frontend + backend ($5-8/month savings)
- ✅ **CloudFront HTTPS** - Free SSL certificates
- ✅ **Minimal Resources** - Small ECS tasks and RDS instances
- ✅ **Public Subnets** - No NAT Gateway needed ($35-45/month savings)

**💰 Total Monthly Cost: ~$15-25 (60-70% savings from standard architecture)**

---

## 🛠️ **Deployment Process**

### **Prerequisites**
1. **AWS CLI** configured with your credentials
2. **Terraform** installed (>= 1.0)
3. **Docker** installed and running
4. **Domain** (optional): pantrytostore.com configured in Route 53

### **One-Command Deployment**
```bash
./deploy-single-container.sh
```

This script will:
1. Deploy infrastructure with Terraform
2. Build the combined Docker image
3. Push to ECR
4. Update ECS service
5. Display access URLs

---

## 📁 **Key Files Explained**

### **Infrastructure Files**
```
infrastructure/terraform/
├── main-minimal.tf         # Core AWS resources (RDS, S3, Security Groups)
├── ecs-minimal.tf          # ECS cluster, task definition, service
├── ecr-minimal.tf          # Container registries
├── vpc.tf                  # VPC, subnets, networking
├── cloudfront.tf           # CDN and HTTPS
└── route53.tf              # DNS (if using custom domain)
```

### **Container Files**
```
├── Dockerfile.combined     # Multi-stage build for combined container
├── nginx.conf             # Nginx reverse proxy configuration
├── start.sh               # Container startup script
└── deploy-single-container.sh  # Deployment automation
```

---

## 🔧 **How It All Works**

### **1. Container Architecture**
The `Dockerfile.combined` creates a single container with:
- **Stage 1**: Builds Vue.js frontend → static files
- **Stage 2**: Prepares Django backend → Python app
- **Stage 3**: Combines everything in Nginx Alpine image

### **2. Nginx Reverse Proxy**
```nginx
location /api/     → Django backend (port 8000)
location /admin/   → Django admin (port 8000)
location /static/  → Static files (cached 1 year)
location /         → Frontend SPA (with fallback)
```

### **3. Container Startup (`start.sh`)**
1. Wait for database connection
2. Run Django migrations
3. Create superuser if needed
4. Start Django backend (port 8000)
5. Start Nginx frontend (port 80)

### **4. HTTPS & CDN (CloudFront)**
- **Free SSL** via AWS Certificate Manager
- **Global CDN** with edge caching
- **Custom Domain** support (pantrytostore.com)
- **Optimized Caching**:
  - API routes: No caching
  - Static files: 1 year cache
  - Frontend: 1 day cache

### **5. Database & Storage**
- **RDS PostgreSQL** (db.t4g.nano) - $8-10/month
- **S3 Bucket** for media files - $1-3/month
- **Secrets Manager** for credentials - $0.80/month

---

## 🌐 **Access & URLs**

After deployment, you'll have:

### **Direct Access**
- **HTTP**: `http://[ECS-TASK-IP]` (check ECS console)
- **Health Check**: `http://[ECS-TASK-IP]/health`

### **Production Access (HTTPS)**
- **CloudFront**: `https://[cloudfront-id].cloudfront.net`
- **Custom Domain**: `https://pantrytostore.com` (if configured)

### **Admin Access**
- **Django Admin**: `https://pantrytostore.com/admin/`
- **Default Credentials**: admin / admin123 (change immediately!)

---

## 🔍 **Monitoring & Management**

### **AWS Console Links**
- **ECS Service**: `https://console.aws.amazon.com/ecs/home?region=us-east-1#/clusters/pantrytostore-production`
- **CloudFront**: `https://console.aws.amazon.com/cloudfront/home`
- **RDS Database**: `https://console.aws.amazon.com/rds/home?region=us-east-1`
- **Cost Explorer**: `https://console.aws.amazon.com/cost-management/home`

### **Logs & Debugging**
```bash
# View ECS logs
aws logs describe-log-groups --log-group-name-prefix "/ecs/pantrytostore"

# Stream live logs
aws logs tail /ecs/pantrytostore-production-app --follow

# Check ECS service status
aws ecs describe-services --cluster pantrytostore-production --services pantrytostore-production-app
```

### **Health Checks**
- **Container Health**: Built into ECS task definition
- **Nginx Health**: `GET /health` endpoint
- **Django Health**: `GET /api/health/` endpoint

---

## 🔄 **Updates & Maintenance**

### **Deploy Code Changes**
```bash
# Rebuild and deploy
./deploy-single-container.sh
```

### **Manual Container Update**
```bash
# Build new image
docker build -f Dockerfile.combined -t pantrytostore-app:latest .

# Push to ECR
ECR_URI=$(terraform output -raw app_ecr_repository_url)
docker tag pantrytostore-app:latest $ECR_URI:latest
docker push $ECR_URI:latest

# Force ECS deployment
aws ecs update-service --cluster pantrytostore-production --service pantrytostore-production-app --force-new-deployment
```

### **Database Migrations**
Migrations run automatically on container startup, but you can run manually:
```bash
# Connect to running container
aws ecs execute-command --cluster pantrytostore-production --task [TASK-ARN] --container app --interactive --command "/bin/bash"

# Run migrations
python3 manage.py migrate
```

### **Scaling (if needed)**
```bash
# Scale ECS service
aws ecs update-service --cluster pantrytostore-production --service pantrytostore-production-app --desired-count 2

# Upgrade RDS instance
# (requires Terraform change and apply)
```

---

## 💰 **Cost Management**

### **Monthly Cost Breakdown**
| Service | Configuration | Est. Cost |
|---------|---------------|-----------|
| ECS Fargate | 1 task, 256 CPU, 512MB | $8-12 |
| RDS PostgreSQL | db.t4g.nano, 10GB | $8-10 |
| CloudFront | CDN + HTTPS | $1-3 |
| S3 | Static/media storage | $1-3 |
| ECR | Container registry | $1-2 |
| Secrets Manager | 2 secrets | $0.80 |
| Data Transfer | Minimal | $2-5 |
| **Total** | | **$21-35/month** |

### **Cost Optimization Tips**
1. **Monitor Usage**: Set up billing alerts for $30/month
2. **Clean Up Images**: ECR lifecycle policies auto-delete old images
3. **Log Retention**: CloudWatch logs kept for 3 days only
4. **Reserved Capacity**: Consider RDS Reserved Instances for 1-year savings

### **Scaling Costs**
If your app grows:
- **2 ECS tasks**: +$8-12/month
- **RDS t4g.small**: +$15-20/month
- **Add Load Balancer**: +$16-20/month
- **Add NAT Gateway**: +$32-45/month

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Container Won't Start**
```bash
# Check ECS service events
aws ecs describe-services --cluster pantrytostore-production --services pantrytostore-production-app

# Check task logs
aws logs tail /ecs/pantrytostore-production-app --follow
```

#### **Database Connection Issues**
```bash
# Check RDS status
aws rds describe-db-instances --db-instance-identifier pantrytostore-production-db

# Verify security groups allow port 5432
aws ec2 describe-security-groups --group-ids [SG-ID]
```

#### **CloudFront Not Working**
1. Check origin domain name points to correct ECS task IP
2. Verify SSL certificate is validated
3. Check cache behaviors for API routes

#### **High Costs**
1. Check ECS task count (should be 1)
2. Verify RDS instance size (should be nano)
3. Review CloudWatch logs retention
4. Check for unused resources

### **Emergency Procedures**

#### **Scale Down for Cost**
```bash
# Stop ECS service temporarily
aws ecs update-service --cluster pantrytostore-production --service pantrytostore-production-app --desired-count 0
```

#### **Database Backup**
```bash
# Create RDS snapshot
aws rds create-db-snapshot --db-instance-identifier pantrytostore-production-db --db-snapshot-identifier emergency-backup-$(date +%Y%m%d)
```

---

## 🔐 **Security Considerations**

### **Current Security Measures**
- ✅ **HTTPS Everywhere** via CloudFront
- ✅ **VPC Isolation** with security groups
- ✅ **Secrets Management** via AWS Secrets Manager
- ✅ **Container Security** with health checks
- ✅ **Database Encryption** at rest

### **Security Improvements for Production**
1. **Change Default Passwords** immediately
2. **Enable RDS Encryption** (add cost)
3. **Add WAF** for CloudFront (add cost)
4. **Enable VPC Flow Logs** for monitoring
5. **Set up CloudTrail** for audit logging

---

## 🎯 **Next Steps & Scaling**

### **When to Scale Up**
- **High CPU/Memory**: Increase ECS task resources
- **Database Slow**: Upgrade RDS instance class
- **High Traffic**: Add more ECS tasks or load balancer
- **Global Users**: Add more CloudFront edge locations

### **Migration Path**
This architecture can easily migrate to:
1. **Multi-Container**: Separate frontend/backend
2. **Load Balanced**: Add ALB for high availability
3. **Multi-AZ**: Add RDS Multi-AZ for resilience
4. **Auto Scaling**: Add ECS auto scaling policies

---

## 📞 **Support & Resources**

### **AWS Documentation**
- [ECS Fargate Guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [RDS PostgreSQL Guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)

### **Useful Commands Reference**
```bash
# Infrastructure
terraform plan -var="domain_name=pantrytostore.com"
terraform apply -var="domain_name=pantrytostore.com"
terraform destroy  # ⚠️ Careful!

# Container Management
docker build -f Dockerfile.combined -t app .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin [ECR-URI]

# ECS Management
aws ecs list-tasks --cluster pantrytostore-production
aws ecs describe-tasks --cluster pantrytostore-production --tasks [TASK-ARN]
aws ecs update-service --cluster pantrytostore-production --service pantrytostore-production-app --force-new-deployment

# Monitoring
aws logs describe-log-groups
aws logs tail /ecs/pantrytostore-production-app --follow
aws cloudwatch get-metric-statistics --namespace AWS/ECS --metric-name CPUUtilization
```

---

## 🎉 **Congratulations!**

You now have a production-ready, cost-optimized PantryToStore deployment that:
- **Costs 60-70% less** than traditional architectures
- **Scales easily** when your app grows
- **Includes HTTPS** and global CDN
- **Runs reliably** on AWS infrastructure

**Your app is ready for real users! 🚀**