from django.contrib import admin
from .models import Recipe, Ingredient, GroceryList, GroceryItem, SharedGroceryList

admin.site.register(Recipe)
admin.site.register(Ingredient)
admin.site.register(GroceryList)
admin.site.register(GroceryItem)
admin.site.register(SharedGroceryList)
