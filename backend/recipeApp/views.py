from rest_framework import status, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework import generics
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import Q
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db import connection
from .models import Recipe, GroceryList
from .serializers import RecipeSerializer, GroceryListSerializer, UserSerializer, RecipeListSerializer

# Authentication Views
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not username or not email or not password:
            return Response({'error': 'Username, email, and password are required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        
        login(request, user)
        
        return Response({
            'message': 'User created successfully',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({'error': 'Username and password are required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            login(request, user)
            return Response({
                'message': 'Login successful',
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, 
                          status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        return Response({
            'user': UserSerializer(request.user).data
        }, status=status.HTTP_200_OK)

class CSRFTokenView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        return Response({'csrfToken': get_token(request)})

# Recipe ViewSet with public/private logic
class RecipeViewSet(viewsets.ModelViewSet):
    serializer_class = RecipeSerializer
    
    def get_queryset(self):
        if self.action == 'list':
            # Show public recipes + user's private recipes (if authenticated)
            if self.request.user.is_authenticated:
                return Recipe.objects.filter(
                    Q(is_public=True) | Q(created_by=self.request.user)
                ).order_by('-created_at')
            else:
                return Recipe.objects.filter(is_public=True).order_by('-created_at')
        return Recipe.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return RecipeListSerializer
        return RecipeSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    def get_object(self):
        obj = super().get_object()
        # For retrieve, update, delete - check permissions
        if self.action in ['retrieve']:
            # Allow access to public recipes or owned recipes
            if obj.is_public or (self.request.user.is_authenticated and obj.created_by == self.request.user):
                return obj
            else:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("You don't have permission to access this recipe.")
        elif self.action in ['update', 'partial_update', 'destroy']:
            # Only allow owner to modify
            if self.request.user.is_authenticated and obj.created_by == self.request.user:
                return obj
            else:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("You don't have permission to modify this recipe.")
        return obj

# My Recipes ViewSet (user's recipes only)
class MyRecipeViewSet(viewsets.ModelViewSet):
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Recipe.objects.filter(created_by=self.request.user).order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return RecipeListSerializer
        return RecipeSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

# Grocery List ViewSet
class GroceryListViewSet(viewsets.ModelViewSet):
    serializer_class = GroceryListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return GroceryList.objects.filter(created_by=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# Health Check View
class HealthCheckView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        """
        Health check endpoint for load balancer and monitoring
        """
        try:
            # Check database connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()
            
            return Response({
                'status': 'healthy',
                'database': 'connected',
                'timestamp': request.META.get('HTTP_DATE', 'unknown')
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'status': 'unhealthy',
                'database': 'disconnected',
                'error': str(e)
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
