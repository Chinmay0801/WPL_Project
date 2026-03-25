from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import CustomUser
from .serializers import UserSerializer, RegisterSerializer


class RegisterView(generics.CreateAPIView):
    """Register a new user."""
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


@api_view(['GET'])
def profile(request):
    """Get the current user's profile."""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
