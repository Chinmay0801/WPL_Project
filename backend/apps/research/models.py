from django.db import models
from django.conf import settings


class StockTicker(models.Model):
    """A stock ticker symbol."""
    symbol = models.CharField(max_length=10, unique=True, db_index=True)
    company_name = models.CharField(max_length=255)
    sector = models.CharField(max_length=100, blank=True)
    industry = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['symbol']

    def __str__(self):
        return f"{self.symbol} — {self.company_name}"


class ResearchReport(models.Model):
    """A generated research report."""

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reports',
    )
    ticker = models.ForeignKey(
        StockTicker,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reports',
    )
    query = models.TextField(
        help_text='Free-text research query, e.g. "Analyze tech stocks with high dividends"'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Report sections (populated by agents)
    summary = models.TextField(blank=True)
    fundamental_analysis = models.JSONField(default=dict, blank=True)
    sentiment_analysis = models.JSONField(default=dict, blank=True)
    risk_assessment = models.JSONField(default=dict, blank=True)
    valuation = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        label = self.ticker.symbol if self.ticker else self.query[:40]
        return f"Report: {label} ({self.status})"
