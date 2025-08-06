# 🍳 Pantry To Store

**A modern full-stack recipe management and grocery planning application designed to help users manage their entire kitchen in one place.**

![Architecture](https://img.shields.io/badge/Architecture-Full%20Stack-blue)
![Frontend](https://img.shields.io/badge/Frontend-Vue.js%20%2F%20Nuxt.js-green)
![Backend](https://img.shields.io/badge/Backend-Django%20REST%20Framework-orange)
![Deployment](https://img.shields.io/badge/Deployment-AWS%20%2F%20Docker-purple)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

---

## ✨ Features

### 🔐 **User Management**
- **User Registration & Authentication** - Secure account creation and login
- **Session-based Authentication** - Persistent login sessions
- **User Profiles** - Personal account management

### 📖 **Recipe Management**
- **Create Custom Recipes** - Add your own recipes with ingredients and instructions
- **Browse Public Recipes** - Discover recipes shared by other users
- **Private/Public Recipes** - Control recipe visibility (private by default)
- **My Recipes** - Personal recipe collection management
- **Recipe Editing** - Update and modify your existing recipes
- **Ingredient Management** - Structured ingredient lists with quantities and units

### 🛒 **Grocery Planning** *(In Development)*
- **Grocery Lists** - Create and manage shopping lists
- **Shared Lists** - Share grocery lists across household members
- **List Permissions** - Control edit/view access for shared lists
- **Recipe-to-Grocery Integration** - Generate shopping lists from recipes

### 🎨 **Modern UI/UX**
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern Interface** - Clean, intuitive design with Tailwind CSS
- **Real-time Updates** - Dynamic content loading and updates
- **Accessibility** - Built with accessibility best practices

---

## 🏗️ Architecture

### **Technology Stack**

#### **Frontend**
- **Framework:** Nuxt.js 3 (Vue.js)
- **State Management:** Pinia
- **Styling:** Tailwind CSS
- **Build:** Static Site Generation (SSG)
- **TypeScript:** Full type safety

#### **Backend**
- **Framework:** Django 5.0
- **API:** Django REST Framework
- **Database:** PostgreSQL (Production) / SQLite (Development)
- **Authentication:** Session-based authentication
- **File Storage:** AWS S3 (Production) / Local (Development)

#### **Infrastructure**
- **Containerization:** Docker (Multi-stage builds)
- **Orchestration:** AWS ECS Fargate
- **Database:** AWS RDS PostgreSQL
- **Storage:** AWS S3
- **CDN/HTTPS:** CloudFront + ACM SSL
- **DNS:** Route 53
- **Infrastructure as Code:** Terraform

### **Production Architecture**
```
Internet → CloudFront (HTTPS/CDN) → ECS Fargate (Single Container)
                                      ├── Nginx (Port 80, Reverse Proxy)
                                      ├── Django Backend (Port 8000, Internal)
                                      └── Vue.js Frontend (Static Files)
                                  → RDS PostgreSQL
                                  → S3 (Static/Media Files)
```

**Cost-Optimized Design:**
- ✅ **Single Container** - Frontend + Backend + Nginx combined
- ✅ **No Load Balancer** - Direct CloudFront → ECS integration
- ✅ **CloudFront HTTPS** - Free SSL certificates
- ✅ **Public Subnets** - No NAT Gateway required
- 💰 **Monthly Cost: ~$15-25** (60-70% savings vs standard architecture)

---

## 🚀 Getting Started

### **Prerequisites**
- **Node.js** 18+ 
- **Python** 3.11+
- **Docker** (for containerization)
- **AWS CLI** (for production deployment)
- **Terraform** (for infrastructure)

### **Development Setup**

#### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/PantryToStore.git
cd PantryToStore
```

#### **2. Backend Setup**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

#### **3. Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

#### **4. Access Application**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api/
- **Admin Panel:** http://localhost:8000/admin/
- **API Browser:** http://localhost:8000/api-auth/

---

## 🚢 Production Deployment

### **One-Command Deployment**
```bash
# Deploy complete infrastructure and application
./deploy-single-container.sh
```

This automated script will:
1. **Deploy AWS Infrastructure** (VPC, ECS, RDS, S3, CloudFront)
2. **Build Docker Container** (Combined frontend + backend)
3. **Push to ECR** (AWS Container Registry)
4. **Update ECS Service** (Rolling deployment)
5. **Configure HTTPS** (CloudFront + ACM SSL)

### **Manual Deployment Steps**

#### **1. Infrastructure Setup**
```bash
cd infrastructure/terraform
terraform init
terraform plan -var="domain_name=yourdomain.com"
terraform apply -var="domain_name=yourdomain.com" -auto-approve
```

#### **2. Container Build & Deploy**
```bash
# Build combined container
docker build -f Dockerfile.combined -t pantrytostore-app:latest .

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag pantrytostore-app:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/pantrytostore-production-app:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/pantrytostore-production-app:latest

# Update ECS service
aws ecs update-service --cluster pantrytostore-production --service pantrytostore-production-app --force-new-deployment
```

### **Production Environment Variables**
See `backend/env.example` and `frontend/env.example` for required environment variables.

---

## 📋 API Documentation

### **Authentication Endpoints**
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/user/` - Get current user profile
- `GET /api/auth/csrf-token/` - Get CSRF token

### **Recipe Endpoints**
- `GET /api/recipes/` - List public recipes (+ user's private if authenticated)
- `POST /api/recipes/` - Create new recipe (authenticated)
- `GET /api/recipes/{id}/` - Get recipe details
- `PUT /api/recipes/{id}/` - Update recipe (owner only)
- `DELETE /api/recipes/{id}/` - Delete recipe (owner only)
- `GET /api/my-recipes/` - List user's recipes (authenticated)

### **Grocery List Endpoints**
- `GET /api/grocery-lists/` - List user's grocery lists
- `POST /api/grocery-lists/` - Create grocery list
- `GET /api/grocery-lists/{id}/` - Get grocery list details
- `PUT /api/grocery-lists/{id}/` - Update grocery list
- `DELETE /api/grocery-lists/{id}/` - Delete grocery list

### **Utility Endpoints**
- `GET /api/health/` - Health check endpoint

---

## 🗂️ Project Structure

```
PantryToStore/
├── backend/                    # Django REST API
│   ├── backend/               # Django project settings
│   ├── recipeApp/            # Main application
│   │   ├── models.py         # Database models
│   │   ├── serializers.py    # API serializers
│   │   ├── views.py          # API views
│   │   └── urls.py           # URL routing
│   ├── requirements.txt      # Python dependencies
│   └── manage.py            # Django management
├── frontend/                  # Nuxt.js frontend
│   ├── components/           # Vue components
│   ├── pages/               # Route pages
│   ├── stores/              # Pinia state management
│   ├── services/            # API services
│   ├── layouts/             # Page layouts
│   ├── middleware/          # Route middleware
│   └── nuxt.config.ts       # Nuxt configuration
├── infrastructure/           # AWS Infrastructure
│   └── terraform/           # Terraform configurations
│       ├── main-minimal.tf  # Core resources
│       ├── ecs-minimal.tf   # Container orchestration
│       ├── vpc.tf           # Networking
│       ├── cloudfront.tf    # CDN & HTTPS
│       └── route53.tf       # DNS
├── Dockerfile.combined       # Production container
├── nginx.conf               # Nginx configuration
├── start.sh                 # Container startup script
└── deploy-single-container.sh # Deployment automation
```

---

## 🔧 Development

### **Available Scripts**

#### **Backend**
```bash
python manage.py runserver     # Start development server
python manage.py migrate       # Apply database migrations
python manage.py makemigrations # Create new migrations
python manage.py createsuperuser # Create admin user
python manage.py collectstatic  # Collect static files
```

#### **Frontend**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run generate   # Generate static site
npm run preview    # Preview production build
```

### **Code Quality**
- **Backend:** Django best practices, DRF conventions
- **Frontend:** Vue 3 Composition API, TypeScript
- **Styling:** Tailwind CSS utility classes
- **State Management:** Pinia stores with TypeScript

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎯 Roadmap

### **Phase 1 (Current)**
- ✅ User authentication and management
- ✅ Recipe CRUD operations
- ✅ Public/private recipe sharing
- ✅ Production deployment on AWS

### **Phase 2 (Planned)**
- 🔄 Enhanced grocery list functionality
- 🔄 Recipe-to-grocery list integration
- 🔄 Household sharing features
- 🔄 Recipe import from URLs
- 🔄 Mobile app (React Native)

### **Phase 3 (Future)**
- 🔮 Meal planning calendar
- 🔮 Nutritional information
- 🔮 Recipe recommendations
- 🔮 Pantry inventory tracking
- 🔮 Shopping list optimization

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/PantryToStore/issues)
- **Documentation:** [Wiki](https://github.com/yourusername/PantryToStore/wiki)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/PantryToStore/discussions)

---

**Built with ❤️ for home cooks and meal planners everywhere!**