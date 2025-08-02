#!/bin/sh

# Combined container startup script
set -e

# Activate virtual environment
export PATH="/opt/venv/bin:$PATH"

echo "🚀 Starting PantryToStore combined container..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
python3 -c "
import os
import psycopg2
import time
import sys

max_attempts = 5  # Reduced for faster startup
attempt = 0

while attempt < max_attempts:
    try:
        conn = psycopg2.connect(
            host=os.environ.get('DB_HOST'),
            database=os.environ.get('DB_NAME'),
            user=os.environ.get('DB_USER'),
            password=os.environ.get('DB_PASSWORD'),
            port=os.environ.get('DB_PORT', '5432'),
            connect_timeout=10
        )
        conn.close()
        print('✅ Database connection successful!')
        break
    except psycopg2.OperationalError as e:
        attempt += 1
        print(f'⏳ Database connection attempt {attempt}/{max_attempts} failed: {e}')
        if attempt >= max_attempts:
            print('⚠️ Could not connect to database - continuing anyway for debugging')
            print('Django will handle database errors gracefully')
            break
        time.sleep(3)
"

# Collect static files
echo "📦 Collecting static files..."
python3 manage.py collectstatic --noinput

# Run Django migrations
echo "🔄 Running Django migrations..."
python3 manage.py migrate --noinput

# Create superuser if it doesn't exist
echo "👤 Creating superuser if needed..."
python3 manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('✅ Superuser created: admin/admin123')
else:
    print('✅ Superuser already exists')
" || echo "⚠️ Superuser creation skipped"

# Start Django in background
echo "🐍 Starting Django backend..."
python3 manage.py runserver 0.0.0.0:8000 &
DJANGO_PID=$!

# Wait a moment for Django to start
sleep 5

# Start Nginx in foreground
echo "🌐 Starting Nginx..."
nginx -g "daemon off;" &
NGINX_PID=$!

# Function to handle shutdown
shutdown() {
    echo "🛑 Shutting down services..."
    kill $DJANGO_PID 2>/dev/null || true
    kill $NGINX_PID 2>/dev/null || true
    exit 0
}

# Trap signals
trap shutdown SIGTERM SIGINT

# Wait for either process to exit
wait $NGINX_PID