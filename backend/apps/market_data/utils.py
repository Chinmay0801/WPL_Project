import yfinance as yf
from django.utils import timezone
from datetime import datetime
from decimal import Decimal
from .models import MarketDataSnapshot, NewsArticle
from apps.research.models import StockTicker

class MarketDataManager:
    """
    Utility class to fetch and persist market data using yfinance.
    """

    def __init__(self, ticker_symbol):
        self.symbol = ticker_symbol.upper()
        self.ticker = None
        self._set_ticker_instance()

    def _set_ticker_instance(self):
        """Ensures the StockTicker instance exists in the DB."""
        self.ticker, _ = StockTicker.objects.get_or_create(
            symbol=self.symbol,
            defaults={'company_name': self.symbol}
        )

    def fetch_data(self):
        """
        Fetches core data, history, and news from yfinance.
        Returns a dictionary of results.
        """
        yf_ticker = yf.Ticker(self.symbol)
        
        # 1. Basic Info
        info = yf_ticker.info
        
        # 2. History (last 5 days to get latest price action)
        hist = yf_ticker.history(period="5d")
        latest_price = Decimal(str(info.get('currentPrice', 0) or info.get('regularMarketPrice', 0) or 0))
        
        # 3. News
        news = yf_ticker.news

        return {
            'info': info,
            'latest_price': latest_price,
            'history': hist,
            'news': news
        }

    def save_to_db(self, data):
        """
        Saves a snapshot and news articles to the database.
        """
        info = data['info']
        
        # Save Snapshot
        snapshot = MarketDataSnapshot.objects.create(
            ticker=self.ticker,
            price=data['latest_price'],
            open_price=self._to_decimal(info.get('open')),
            high=self._to_decimal(info.get('dayHigh')),
            low=self._to_decimal(info.get('dayLow')),
            volume=info.get('volume'),
            market_cap=info.get('marketCap'),
            pe_ratio=self._to_decimal(info.get('trailingPE')),
            dividend_yield=self._to_decimal(info.get('dividendYield')),
            data_source='yahoo_finance'
        )

        # Save News (last 5 articles)
        for article in data['news'][:5]:
            # Convert timestamp (seconds) to datetime
            pub_date = datetime.fromtimestamp(article.get('providerPublishTime', 0))
            pub_date = timezone.make_aware(pub_date)

            NewsArticle.objects.get_or_create(
                ticker=self.ticker,
                url=article.get('link'),
                defaults={
                    'title': article.get('title', 'No Title'),
                    'source': article.get('publisher', 'Unknown'),
                    'published_at': pub_date,
                    'summary': article.get('summary', '')
                }
            )
        
        return snapshot

    def _to_decimal(self, value):
        if value is None:
            return None
        try:
            return Decimal(str(value))
        except (TypeError, ValueError):
            return None
