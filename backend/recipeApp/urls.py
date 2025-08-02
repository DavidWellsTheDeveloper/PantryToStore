from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for ViewSets
router = DefaultRouter()
router.register(r'recipes', views.RecipeViewSet, basename='recipe')
router.register(r'my-recipes', views.MyRecipeViewSet, basename='my-recipe')
router.register(r'grocery-lists', views.GroceryListViewSet, basename='grocery-list')

urlpatterns = [
    # Health check endpoint
    path('health/', views.HealthCheckView.as_view(), name='health-check'),
    
    # Auth endpoints
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    path('auth/user/', views.UserProfileView.as_view(), name='user-profile'),
    path('auth/csrf-token/', views.CSRFTokenView.as_view(), name='csrf-token'),
    
    # Include router URLs
    path('', include(router.urls)),
]
