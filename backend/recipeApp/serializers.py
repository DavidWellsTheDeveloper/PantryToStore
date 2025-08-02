from rest_framework import serializers
from .models import Recipe, GroceryList, Ingredient, GroceryItem
from django.contrib.auth.models import User

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'unit', 'quantity']
        read_only_fields = ['id']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']

class RecipeSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True, required=False)
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Recipe
        fields = ['id', 'title', 'description', 'instructions', 'created_by', 'created_at', 'is_public', 'ingredients']
        read_only_fields = ['created_at', 'created_by']

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients', [])
        recipe = Recipe.objects.create(**validated_data)
        
        for ingredient_data in ingredients_data:
            Ingredient.objects.create(recipe=recipe, **ingredient_data)
        
        return recipe

    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop('ingredients', [])
        
        # Update recipe fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update ingredients (simple approach: delete all and recreate)
        if ingredients_data:
            instance.ingredients.all().delete()
            for ingredient_data in ingredients_data:
                Ingredient.objects.create(recipe=instance, **ingredient_data)
        
        return instance

class RecipeListSerializer(serializers.ModelSerializer):
    """Simplified serializer for recipe lists"""
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Recipe
        fields = ['id', 'title', 'description', 'created_by', 'created_at', 'is_public']
        read_only_fields = ['created_at', 'created_by']

class GroceryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryItem
        fields = ['id', 'name', 'unit', 'quantity']
        read_only_fields = ['id']

class GroceryListSerializer(serializers.ModelSerializer):
    items = GroceryItemSerializer(many=True, required=False)
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = GroceryList
        fields = ['id', 'name', 'created_by', 'created_at', 'items']
        read_only_fields = ['created_at', 'created_by']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        grocery_list = GroceryList.objects.create(**validated_data)
        
        for item_data in items_data:
            GroceryItem.objects.create(grocery_list=grocery_list, **item_data)
        
        return grocery_list

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', [])
        
        # Update grocery list fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update items (simple approach: delete all and recreate)
        if items_data:
            instance.items.all().delete()
            for item_data in items_data:
                GroceryItem.objects.create(grocery_list=instance, **item_data)
        
        return instance
