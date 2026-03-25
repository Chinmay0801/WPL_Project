from rest_framework import viewsets, permissions
from .models import AgentRun
from .serializers import AgentRunSerializer


class AgentRunViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve AI agent runs (read-only)."""
    serializer_class = AgentRunSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AgentRun.objects.filter(report__user=self.request.user)
