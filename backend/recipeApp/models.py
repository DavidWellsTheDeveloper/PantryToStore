from django.db import models
from django.contrib.auth.models import User

class Recipe(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    instructions = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipes')
    created_at = models.DateTimeField(auto_now_add=True)
    is_public = models.BooleanField(default=False)  # False = private, True = public

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
