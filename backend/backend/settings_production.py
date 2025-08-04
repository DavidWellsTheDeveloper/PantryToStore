"""
Production settings for PantryToStore Django backend
"""
import os
from .settings import *

# Security Settings
DEBUG = False
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
ALLOWED_HOSTS = [
    os.environ.get('DOMAIN_NAME', 'pantrytostore.com'),
    'www.pantrytostore.com',
    'd18fmaz7qqco39.cloudfront.net',  # CloudFront domain
    'pantrytostore-production-alb-308236472.us-east-1.elb.amazonaws.com',  # ALB
    'localhost',  # For health checks
    '127.0.0.1',  # For internal health checks
]

# Database - Use RDS PostgreSQL in production
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT', '5432'),
        'OPTIONS': {
            'sslmode': 'require',
        },
    }
}

# Static files (CSS, JavaScript, Images) - Use S3
STATIC_URL = f"https://{os.environ.get('S3_BUCKET_NAME')}.s3.amazonaws.com/static/"
STATIC_ROOT = '/tmp/static/'  # Temporary for collectstatic
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

# Media files - Use S3
MEDIA_URL = f"https://{os.environ.get('S3_BUCKET_NAME')}.s3.amazonaws.com/media/"
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

# AWS S3 Configuration
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.environ.get('S3_BUCKET_NAME')
AWS_S3_REGION_NAME = os.environ.get('AWS_REGION', 'us-east-1')
AWS_S3_CUSTOM_DOMAIN = f"{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com"
AWS_DEFAULT_ACL = None  # Disable ACLs for S3 buckets that don't support them
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}

# Security Headers
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# HTTPS Settings - CloudFront handles HTTPS termination
# Don't redirect to HTTPS since CloudFront already handles this
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
# Trust CloudFront's forwarded headers
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# CSRF Settings - Trust our domain for CSRF validation
CSRF_TRUSTED_ORIGINS = [
    'https://pantrytostore.com',
    'https://www.pantrytostore.com',
    f"https://{os.environ.get('DOMAIN_NAME', 'pantrytostore.com')}",
]

# CORS Settings for production
CORS_ALLOWED_ORIGINS = [
    f"https://{os.environ.get('FRONTEND_DOMAIN')}",
]
CORS_ALLOW_CREDENTIALS = True

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# Cache - Use database cache (no Redis needed)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
        'LOCATION': 'cache_table',
    }
}

# Session storage - use database
SESSION_ENGINE = 'django.contrib.sessions.backends.db'