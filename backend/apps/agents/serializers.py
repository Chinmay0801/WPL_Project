from rest_framework import serializers
from .models import AgentRun


class AgentRunSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentRun
        fields = '__all__'
        read_only_fields = ['id', 'status', 'output_data', 'error_message',
                          'started_at', 'completed_at', 'created_at']
