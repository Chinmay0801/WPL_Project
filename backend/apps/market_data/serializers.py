from rest_framework import serializers
from .models import MarketDataSnapshot, NewsArticle


class MarketDataSnapshotSerializer(serializers.ModelSerializer):
    ticker_symbol = serializers.CharField(source='ticker.symbol', read_only=True)

    class Meta:
        model = MarketDataSnapshot
        fields = '__all__'


class NewsArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsArticle
        fields = '__all__'
