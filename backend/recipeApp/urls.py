from django.urls import path, include
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
