from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'agents'

router = DefaultRouter()
router.register('runs', views.AgentRunViewSet, basename='agent-run')

urlpatterns = [
    path('', include(router.urls)),
]
