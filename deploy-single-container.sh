#!/bin/bash

# PantryToStore Single Container Deployment Script
set -e

echo "🚀 Starting Single Container PantryToStore deployment to AWS..."
echo "💰 Architecture: Combined Frontend + Backend + Nginx in one container"
echo "🔒 HTTPS: Via CloudFront + ACM"

# Configuration
AWS_REGION="us-east-1"
APP_NAME="pantrytostore"
ENVIRONMENT="production"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check prerequisites
log_step "Checking prerequisites..."
command -v aws >/dev/null 2>&1 || { log_error "AWS CLI is required but not installed. Aborting."; exit 1; }
command -v terraform >/dev/null 2>&1 || { log_error "Terraform is required but not installed. Aborting."; exit 1; }
command -v docker >/dev/null 2>&1 || { log_error "Docker is required but not installed. Aborting."; exit 1; }

# Verify AWS credentials
log_step "Verifying AWS credentials..."
aws sts get-caller-identity > /dev/null || { log_error "AWS credentials not configured. Run 'aws configure'. Aborting."; exit 1; }

# Deploy infrastructure
log_step "Deploying infrastructure with Terraform..."
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Plan deployment
log_info "Planning Terraform deployment..."
terraform plan -var="domain_name=pantrytostore.com"

# Apply infrastructure
log_info "Applying Terraform configuration..."
terraform apply -var="domain_name=pantrytostore.com" -auto-approve

# Get outputs
log_info "Getting infrastructure outputs..."
ECR_APP_URI=$(terraform output -raw app_ecr_repository_url)
CLOUDFRONT_DOMAIN=$(terraform output -raw cloudfront_domain_name)

cd ../..

# Build and push combined container
log_step "Building and pushing combined container..."

# Get ECR login token
log_info "Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_APP_URI

# Build combined image
log_info "Building combined container image..."
docker build -f Dockerfile.combined -t $APP_NAME-app:latest .

# Tag for ECR
docker tag $APP_NAME-app:latest $ECR_APP_URI:latest

# Push to ECR
log_info "Pushing image to ECR..."
docker push $ECR_APP_URI:latest

# Update ECS service
log_step "Updating ECS service..."
aws ecs update-service \
    --cluster $APP_NAME-$ENVIRONMENT \
    --service $APP_NAME-$ENVIRONMENT-app \
    --force-new-deployment \
    --region $AWS_REGION

# Wait for deployment
log_info "Waiting for ECS deployment to complete..."
aws ecs wait services-stable \
    --cluster $APP_NAME-$ENVIRONMENT \
    --services $APP_NAME-$ENVIRONMENT-app \
    --region $AWS_REGION

# Get ECS task public IP
log_step "Getting ECS task public IP..."
TASK_ARN=$(aws ecs list-tasks \
    --cluster $APP_NAME-$ENVIRONMENT \
    --service-name $APP_NAME-$ENVIRONMENT-app \
    --query 'taskArns[0]' \
    --output text \
    --region $AWS_REGION)

if [ "$TASK_ARN" != "None" ] && [ "$TASK_ARN" != "" ]; then
    PUBLIC_IP=$(aws ecs describe-tasks \
        --cluster $APP_NAME-$ENVIRONMENT \
        --tasks $TASK_ARN \
        --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' \
        --output text \
        --region $AWS_REGION)
    
    if [ "$PUBLIC_IP" != "" ]; then
        # Get actual public IP from network interface
        PUBLIC_IP=$(aws ec2 describe-network-interfaces \
            --network-interface-ids $PUBLIC_IP \
            --query 'NetworkInterfaces[0].Association.PublicIp' \
            --output text \
            --region $AWS_REGION)
    fi
fi

# Display deployment results
log_step "Deployment completed successfully! 🎉"
echo ""
echo "📋 Deployment Summary:"
echo "======================"
echo "🏗️  Architecture: Single Container (Frontend + Backend + Nginx)"
echo "💰 Estimated Cost: \$15-25/month (60-70% savings!)"
echo "🔒 HTTPS: Via CloudFront"
echo ""
echo "🌐 Access URLs:"
if [ "$PUBLIC_IP" != "" ] && [ "$PUBLIC_IP" != "None" ]; then
    echo "   Direct HTTP:  http://$PUBLIC_IP"
else
    echo "   Direct HTTP:  Check ECS console for task IP"
fi
echo "   CloudFront:   https://$CLOUDFRONT_DOMAIN"
if [ -n "$DOMAIN_NAME" ]; then
    echo "   Custom Domain: https://pantrytostore.com"
fi
echo ""
echo "🔧 Management:"
echo "   AWS Console: https://console.aws.amazon.com/ecs/home?region=$AWS_REGION#/clusters/$APP_NAME-$ENVIRONMENT"
echo "   CloudFront:  https://console.aws.amazon.com/cloudfront/home"
echo ""
echo "⚠️  Next Steps:"
echo "   1. Update CloudFront origin to point to ECS task IP"
echo "   2. Test application functionality"
echo "   3. Monitor costs in AWS Cost Explorer"
echo ""
log_info "Deployment script completed!"

# Manual CloudFront update instructions
if [ "$PUBLIC_IP" != "" ] && [ "$PUBLIC_IP" != "None" ]; then
    echo ""
    log_warn "MANUAL STEP REQUIRED:"
    echo "Update CloudFront distribution origin:"
    echo "1. Go to CloudFront console"
    echo "2. Edit the distribution"
    echo "3. Update origin domain name from 'placeholder.example.com' to '$PUBLIC_IP'"
    echo "4. Save changes and wait for deployment"
fi