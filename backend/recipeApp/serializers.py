from rest_framework import serializers
from .models import Recipe, GroceryList

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ['id', 'title', 'description', 'instructions', 'created_by', 'created_at']
        read_only_fields = ['created_at', 'created_by']  # created_at and created_by are read-only

class GroceryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryList
        fields = ['id', 'name', 'created_by', 'created_at']
        read_only_fields = ['created_at', 'created_by']  # created_at and created_by are read-only
