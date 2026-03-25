from rest_framework import serializers
from .models import StockTicker, ResearchReport


class StockTickerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockTicker
        fields = '__all__'


class ResearchReportSerializer(serializers.ModelSerializer):
    ticker_symbol = serializers.CharField(source='ticker.symbol', read_only=True)

    class Meta:
        model = ResearchReport
        fields = [
            'id', 'user', 'ticker', 'ticker_symbol', 'query', 'status',
            'summary', 'fundamental_analysis', 'sentiment_analysis',
            'risk_assessment', 'valuation', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'user', 'status', 'summary', 'fundamental_analysis',
            'sentiment_analysis', 'risk_assessment', 'valuation',
            'created_at', 'updated_at',
        ]


class ResearchReportCreateSerializer(serializers.Serializer):
    """Simplified serializer to kick off a new research report."""
    ticker_symbol = serializers.CharField(max_length=10, required=False)
    query = serializers.CharField()
