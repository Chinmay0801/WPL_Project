from django.db import models
from django.conf import settings


class AgentRun(models.Model):
    """Tracks an individual AI agent run within a research pipeline."""

    AGENT_TYPES = [
        ('fundamental', 'Fundamental Analysis'),
        ('sentiment', 'Sentiment Analysis'),
        ('risk', 'Risk Assessment'),
        ('valuation', 'Valuation'),
        ('orchestrator', 'Orchestrator'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    report = models.ForeignKey(
        'research.ResearchReport',
        on_delete=models.CASCADE,
        related_name='agent_runs',
    )
    agent_type = models.CharField(max_length=20, choices=AGENT_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    input_data = models.JSONField(default=dict, blank=True)
    output_data = models.JSONField(default=dict, blank=True)
    error_message = models.TextField(blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.agent_type} — {self.status} (Report #{self.report_id})"
