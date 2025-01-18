from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from django.shortcuts import get_object_or_404
from .models import Recipe, GroceryList
from .serializers import RecipeSerializer, GroceryListSerializer

# Permission class to ensure the user is authenticated
class IsAuthenticatedOrCreate(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:  # GET, OPTIONS, HEAD are safe
            return True
        return request.user and request.user.is_authenticated  # Require login for all other methods

# 1. Recipe List View (GET, POST)
class RecipeListView(generics.ListCreateAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticatedOrCreate]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

# 2. Recipe Detail View (GET, PUT, DELETE)
class RecipeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticated]

# 3. Grocery List View (GET, POST)
class GroceryListView(generics.ListCreateAPIView):
    queryset = GroceryList.objects.all()
    serializer_class = GroceryListSerializer
    permission_classes = [IsAuthenticatedOrCreate]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

# 4. Grocery List Detail View (GET, PUT, DELETE)
class GroceryListDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GroceryList.objects.all()
    serializer_class = GroceryListSerializer
    permission_classes = [permissions.IsAuthenticated]
