from django.urls import path

from .views import *

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("token", TokenObtainPairView.as_view(), name="token"),
    path("token/refresh", TokenRefreshView.as_view(), name="refresh"),
    path("generate", Generate.as_view(), name="generate"),
    path("generations", Generations.as_view(), name="generations"),
    path("generations/<int:pk>", Generations.as_view(), name="generation"),
    path("user", User.as_view(), name="users"),
    path("register", Register.as_view(), name="register"),
]
