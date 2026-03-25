"""
URL configuration for Agentic Stock Research Platform.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """API root — welcome endpoint."""
    return Response({
        'message': 'Welcome to the Agentic Stock Research API',
        'version': '1.0.0',
        'endpoints': {
            'admin': '/admin/',
            'users': '/api/users/',
            'research': '/api/research/',
            'agents': '/api/agents/',
            'market_data': '/api/market-data/',
        }
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/users/', include('apps.users.urls')),
    path('api/research/', include('apps.research.urls')),
    path('api/agents/', include('apps.agents.urls')),
    path('api/market-data/', include('apps.market_data.urls')),
]
