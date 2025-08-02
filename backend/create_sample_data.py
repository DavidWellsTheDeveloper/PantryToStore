#!/usr/bin/env python
"""
Script to create sample recipe data for testing the application.
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from recipeApp.models import Recipe, Ingredient

def create_sample_data():
    print("Creating sample data...")
    
    # Get or create admin user
    admin_user, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@example.com',
            'is_staff': True,
            'is_superuser': True
        }
    )
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        print("Created admin user")
    
    # Create a test user
    test_user, created = User.objects.get_or_create(
        username='testuser',
        defaults={
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User'
        }
    )
    if created:
        test_user.set_password('test123')
        test_user.save()
        print("Created test user")
    
    # Sample recipes data
    recipes_data = [
        {
            'title': 'Classic Chocolate Chip Cookies',
            'description': 'Delicious homemade chocolate chip cookies that are crispy on the outside and chewy on the inside.',
            'instructions': '''1. Preheat oven to 375°F (190°C).
2. In a large bowl, cream together butter and sugars until light and fluffy.
3. Beat in eggs one at a time, then vanilla extract.
4. In a separate bowl, whisk together flour, baking soda, and salt.
5. Gradually mix dry ingredients into wet ingredients.
6. Stir in chocolate chips.
7. Drop rounded tablespoons of dough onto ungreased baking sheets.
8. Bake for 9-11 minutes or until golden brown.
9. Cool on baking sheet for 2 minutes before transferring to wire rack.''',
            'is_public': True,
            'created_by': admin_user,
            'ingredients': [
                {'name': 'All-purpose flour', 'quantity': 2.25, 'unit': 'cups'},
                {'name': 'Baking soda', 'quantity': 1, 'unit': 'tsp'},
                {'name': 'Salt', 'quantity': 1, 'unit': 'tsp'},
                {'name': 'Butter', 'quantity': 1, 'unit': 'cup'},
                {'name': 'Granulated sugar', 'quantity': 0.75, 'unit': 'cup'},
                {'name': 'Brown sugar', 'quantity': 0.75, 'unit': 'cup'},
                {'name': 'Vanilla extract', 'quantity': 1, 'unit': 'tsp'},
                {'name': 'Large eggs', 'quantity': 2, 'unit': 'pieces'},
                {'name': 'Chocolate chips', 'quantity': 2, 'unit': 'cups'},
            ]
        },
        {
            'title': 'Spaghetti Carbonara',
            'description': 'A classic Italian pasta dish with eggs, cheese, and pancetta.',
            'instructions': '''1. Cook spaghetti according to package directions.
2. While pasta cooks, fry pancetta until crispy.
3. In a bowl, whisk together eggs, Parmesan cheese, and black pepper.
4. Drain pasta, reserving 1 cup pasta water.
5. Add hot pasta to pancetta in the pan.
6. Remove from heat and quickly toss with egg mixture.
7. Add pasta water as needed to create a creamy sauce.
8. Serve immediately with extra Parmesan and pepper.''',
            'is_public': True,
            'created_by': test_user,
            'ingredients': [
                {'name': 'Spaghetti', 'quantity': 400, 'unit': 'g'},
                {'name': 'Pancetta', 'quantity': 200, 'unit': 'g'},
                {'name': 'Large eggs', 'quantity': 3, 'unit': 'pieces'},
                {'name': 'Parmesan cheese', 'quantity': 100, 'unit': 'g'},
                {'name': 'Black pepper', 'quantity': 1, 'unit': 'tsp'},
                {'name': 'Salt', 'quantity': 1, 'unit': 'tsp'},
            ]
        },
        {
            'title': 'Avocado Toast',
            'description': 'Simple and delicious avocado toast perfect for breakfast or lunch.',
            'instructions': '''1. Toast bread slices until golden brown.
2. Mash avocado in a bowl with lime juice and salt.
3. Spread mashed avocado on toast.
4. Sprinkle with red pepper flakes and black pepper.
5. Optional: top with a fried egg or cherry tomatoes.
6. Serve immediately.''',
            'is_public': False,
            'created_by': test_user,
            'ingredients': [
                {'name': 'Bread slices', 'quantity': 2, 'unit': 'pieces'},
                {'name': 'Ripe avocado', 'quantity': 1, 'unit': 'piece'},
                {'name': 'Lime juice', 'quantity': 1, 'unit': 'tbsp'},
                {'name': 'Salt', 'quantity': 0.5, 'unit': 'tsp'},
                {'name': 'Red pepper flakes', 'quantity': 0.25, 'unit': 'tsp'},
                {'name': 'Black pepper', 'quantity': 0.25, 'unit': 'tsp'},
            ]
        },
        {
            'title': 'Chicken Stir Fry',
            'description': 'Quick and healthy chicken stir fry with vegetables.',
            'instructions': '''1. Cut chicken into bite-sized pieces and season with salt and pepper.
2. Heat oil in a large wok or skillet over high heat.
3. Add chicken and cook until browned, about 5-6 minutes.
4. Add garlic and ginger, stir for 30 seconds.
5. Add vegetables and stir fry for 3-4 minutes.
6. Mix soy sauce, oyster sauce, and cornstarch in a bowl.
7. Pour sauce over chicken and vegetables.
8. Stir fry for another 2 minutes until sauce thickens.
9. Serve over rice.''',
            'is_public': True,
            'created_by': admin_user,
            'ingredients': [
                {'name': 'Chicken breast', 'quantity': 500, 'unit': 'g'},
                {'name': 'Mixed vegetables', 'quantity': 300, 'unit': 'g'},
                {'name': 'Garlic cloves', 'quantity': 3, 'unit': 'pieces'},
                {'name': 'Fresh ginger', 'quantity': 1, 'unit': 'tbsp'},
                {'name': 'Vegetable oil', 'quantity': 2, 'unit': 'tbsp'},
                {'name': 'Soy sauce', 'quantity': 3, 'unit': 'tbsp'},
                {'name': 'Oyster sauce', 'quantity': 2, 'unit': 'tbsp'},
                {'name': 'Cornstarch', 'quantity': 1, 'unit': 'tsp'},
                {'name': 'Salt', 'quantity': 0.5, 'unit': 'tsp'},
                {'name': 'Black pepper', 'quantity': 0.25, 'unit': 'tsp'},
            ]
        }
    ]
    
    # Create recipes
    created_count = 0
    for recipe_data in recipes_data:
        ingredients_data = recipe_data.pop('ingredients')
        
        # Check if recipe already exists
        if not Recipe.objects.filter(title=recipe_data['title']).exists():
            recipe = Recipe.objects.create(**recipe_data)
            
            # Create ingredients
            for ingredient_data in ingredients_data:
                Ingredient.objects.create(recipe=recipe, **ingredient_data)
            
            created_count += 1
            print(f"Created recipe: {recipe.title}")
    
    print(f"\nSample data creation completed!")
    print(f"Created {created_count} new recipes")
    print(f"Total recipes in database: {Recipe.objects.count()}")
    print(f"Public recipes: {Recipe.objects.filter(is_public=True).count()}")
    print(f"Private recipes: {Recipe.objects.filter(is_public=False).count()}")

if __name__ == '__main__':
    create_sample_data() 