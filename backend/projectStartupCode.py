import os
from django.core.management import execute_from_command_line

# 1. Initialize Django project
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
if not os.path.exists('manage.py'):
    execute_from_command_line(['django-admin', 'startproject', 'backend', '.'])
if not os.path.exists('recipeApp'):
    os.system('python manage.py startapp recipeApp')

# 2. Settings update (backend/settings.py)
settings_update = """# Append at the end of the settings file
INSTALLED_APPS += [
    'recipeApp',
    'rest_framework',
]

MIDDLEWARE += [

]

AUTH_USER_MODEL = 'auth.User'
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
"""
with open('backend/settings.py', 'a') as settings_file:
    settings_file.write(settings_update)

# 3. Models (recipeApp/models.py)
models_code = """from django.db import models
from django.contrib.auth.models import User

class Recipe(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    instructions = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipes')
    created_at = models.DateTimeField(auto_now_add=True)

class Ingredient(models.Model):
    name = models.CharField(max_length=255)
    unit = models.CharField(max_length=50)  # e.g., grams, cups
    quantity = models.FloatField()
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')

class GroceryList(models.Model):
    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='grocery_lists')
    created_at = models.DateTimeField(auto_now_add=True)

class GroceryItem(models.Model):
    name = models.CharField(max_length=255)
    unit = models.CharField(max_length=50)  # e.g., grams, cups
    quantity = models.FloatField()
    grocery_list = models.ForeignKey(GroceryList, on_delete=models.CASCADE, related_name='items')

class SharedGroceryList(models.Model):
    list = models.ForeignKey(GroceryList, on_delete=models.CASCADE, related_name='shared_with')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shared_lists')
    permissions = models.CharField(max_length=10, choices=[('edit', 'Edit'), ('view', 'View')])
"""
with open('recipeApp/models.py', 'w') as models_file:
    models_file.write(models_code)

# 4. Make Migrations
os.system('python manage.py makemigrations recipeApp')
os.system('python manage.py migrate')

# 5. Create Admin Interface (recipeApp/admin.py)
admin_code = """from django.contrib import admin
from .models import Recipe, Ingredient, GroceryList, GroceryItem, SharedGroceryList

admin.site.register(Recipe)
admin.site.register(Ingredient)
admin.site.register(GroceryList)
admin.site.register(GroceryItem)
admin.site.register(SharedGroceryList)
"""
with open('recipeApp/admin.py', 'w') as admin_file:
    admin_file.write(admin_code)

# 6. Create URL routes (recipeApp/urls.py)
urls_code = """from django.urls import path, include
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('recipes/', views.RecipeListView.as_view(), name='recipe-list'),
    path('recipes/<int:pk>/', views.RecipeDetailView.as_view(), name='recipe-detail'),
    path('grocery-lists/', views.GroceryListView.as_view(), name='grocery-list'),
    path('grocery-lists/<int:pk>/', views.GroceryListDetailView.as_view(), name='grocery-list-detail'),
    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
]
"""
with open('recipeApp/urls.py', 'w') as urls_file:
    urls_file.write(urls_code)

# 7. Create Views (recipeApp/views.py)
views_code = """from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Recipe, GroceryList

class RecipeListView(APIView):
    def get(self, request):
        recipes = list(Recipe.objects.values())
        return Response(recipes, status=status.HTTP_200_OK)

class RecipeDetailView(APIView):
    def get(self, request, pk):
        recipe = get_object_or_404(Recipe, pk=pk)
        return Response({
            'title': recipe.title,
            'description': recipe.description,
            'instructions': recipe.instructions
        }, status=status.HTTP_200_OK)

class GroceryListView(APIView):
    def get(self, request):
        lists = list(GroceryList.objects.values())
        return Response(lists, status=status.HTTP_200_OK)

class GroceryListDetailView(APIView):
    def get(self, request, pk):
        grocery_list = get_object_or_404(GroceryList, pk=pk)
        items = list(grocery_list.items.values())
        return Response({
            'name': grocery_list.name,
            'items': items
        }, status=status.HTTP_200_OK)
"""
with open('recipeApp/views.py', 'w') as views_file:
    views_file.write(views_code)

print("Django project updated with Django REST framework and session-based authentication. Run 'python manage.py createsuperuser' to create an admin user.")
