from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import random
import datetime
from .models import StockTicker, ResearchReport
from .serializers import (
    StockTickerSerializer,
    ResearchReportSerializer,
    ResearchReportCreateSerializer,
)


class StockTickerViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve stock tickers."""
    queryset = StockTicker.objects.all()
    serializer_class = StockTickerSerializer
    permission_classes = [permissions.IsAuthenticated]


class ResearchReportViewSet(viewsets.ModelViewSet):
    """CRUD for research reports. Creating a report triggers the agent pipeline."""
    serializer_class = ResearchReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ResearchReport.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        create_serializer = ResearchReportCreateSerializer(data=request.data)
        create_serializer.is_valid(raise_exception=True)

        # Create a ticker if a symbol was provided
        ticker = None
        symbol = create_serializer.validated_data.get('ticker_symbol')
        if symbol:
            ticker, _ = StockTicker.objects.get_or_create(
                symbol=symbol.upper(),
                defaults={'company_name': symbol.upper()},
            )

        report = ResearchReport.objects.create(
            user=request.user,
            ticker=ticker,
            query=create_serializer.validated_data['query'],
            status='pending',
        )

        # Kick off Celery task
        from apps.agents.tasks import run_research_pipeline
        run_research_pipeline.delay(report.id)

        serializer = ResearchReportSerializer(report)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def quick_demo_report(request):
    """
    A standalone endpoint specifically designed for local demonstrations.
    Receives { "ticker": "...", "query": "..." } and constructs the 
    massive mock JSON response exactly formatted for the React frontend.
    Does NOT require authentication or a PostgreSQL database to generate.
    """
    data = request.data
    ticker = data.get('ticker', 'AAPL').upper()
    query = data.get('query', f'Comprehensive analysis of {ticker}')

    companies = {
        'AAPL': {'name': 'Apple Inc.', 'sector': 'Technology', 'price': 198.45, 'pe': 32.1, 'high52': 237.23, 'low52': 164.08, 'diff1d': '+1.2%', 'diff1w': '+3.4%', 'mcap': '3.08T'},
        'MSFT': {'name': 'Microsoft Corp.', 'sector': 'Technology', 'price': 428.50, 'pe': 37.8, 'high52': 468.35, 'low52': 309.45, 'diff1d': '-0.5%', 'diff1w': '+1.8%', 'mcap': '3.18T'},
        'GOOGL': {'name': 'Alphabet Inc.', 'sector': 'Technology', 'price': 175.20, 'pe': 26.4, 'high52': 191.75, 'low52': 120.21, 'diff1d': '+2.1%', 'diff1w': '+4.0%', 'mcap': '2.17T'},
        'AMZN': {'name': 'Amazon.com Inc.', 'sector': 'Consumer Cyclical', 'price': 192.80, 'pe': 62.3, 'high52': 201.20, 'low52': 118.35, 'diff1d': '+0.8%', 'diff1w': '-1.2%', 'mcap': '2.01T'},
        'TSLA': {'name': 'Tesla Inc.', 'sector': 'Automotive', 'price': 248.90, 'pe': 72.5, 'high52': 299.29, 'low52': 138.80, 'diff1d': '-2.4%', 'diff1w': '-5.6%', 'mcap': '792B'},
        'NVDA': {'name': 'NVIDIA Corp.', 'sector': 'Technology', 'price': 875.30, 'pe': 68.2, 'high52': 974.00, 'low52': 298.06, 'diff1d': '+4.5%', 'diff1w': '+12.4%', 'mcap': '2.31T'},
        'TCS': {'name': 'Tata Consultancy Services', 'sector': 'Technology', 'price': 3950.20, 'pe': 30.5, 'high52': 4200.00, 'low52': 3100.00, 'diff1d': '+0.5%', 'diff1w': '+1.2%', 'mcap': '14.5T INR'},
        'INFY': {'name': 'Infosys Ltd.', 'sector': 'Technology', 'price': 1480.50, 'pe': 24.2, 'high52': 1730.00, 'low52': 1215.00, 'diff1d': '-1.2%', 'diff1w': '-0.8%', 'mcap': '6.1T INR'},
        'RELIANCE': {'name': 'Reliance Industries', 'sector': 'Conglomerate', 'price': 2950.80, 'pe': 28.4, 'high52': 3024.00, 'low52': 2220.00, 'diff1d': '+1.8%', 'diff1w': '+4.5%', 'mcap': '19.9T INR'},
    }

    if ticker in companies:
        info = companies[ticker]
    else:
        info = {
            'name': f'{ticker} Corp.',
            'sector': 'Mixed',
            'price': round(random.uniform(50, 550), 2),
            'pe': round(random.uniform(8, 48), 1),
            'high52': round(random.uniform(100, 700), 2),
            'low52': round(random.uniform(30, 230), 2),
            'diff1d': f"{'+' if random.random() > 0.5 else '-'}{round(random.uniform(0.1, 3.0), 1)}%",
            'diff1w': f"{'+' if random.random() > 0.5 else '-'}{round(random.uniform(0.5, 8.0), 1)}%",
            'mcap': f"{round(random.uniform(5, 100), 1)}B"
        }

    recommendation = 'HOLD' if info['pe'] > 40 else ('BUY' if info['pe'] < 25 else 'BUY')

    chart_data = []
    for i in range(30):
        chart_data.append({
            'name': f"Day {i + 1}",
            'price': round(info['price'] * (0.9 + random.uniform(0, 0.2)), 2)
        })

    response_payload = {
        'id': int(datetime.datetime.now().timestamp() * 1000),
        'ticker_symbol': ticker,
        'company_name': info['name'],
        'query': query,
        'status': 'completed',
        'created_at': datetime.datetime.now().isoformat(),
        'snapshot': {
            'price': info['price'],
            'mcap': info['mcap'],
            'pe': info['pe'],
            'diff1d': info['diff1d'],
            'diff1w': info['diff1w'],
            'recommendation': recommendation,
        },
        'summary': {
            'text': f"{info['name']} is showing steady performance in the {info['sector']} sector. Analysts note consistent growth with manageable risk levels.",
            'bullets': [
                f"Revenue Trend: 📈 Showing strong YoY growth of {round(random.uniform(5, 20), 1)}%",
                f"Profit Trend: {'📈 Margins are expanding' if float(info['pe']) < 30 else '→ Margins remain stable'}",
                "Risk Factors: Susceptible to macro headwinds and sector volatility.",
                "Growth Potential: Investing heavily in emerging technologies and R&D.",
            ]
        },
        'fundamental_analysis': {
            'summary': f"{info['name']} shows solid fundamentals with a P/E ratio of {info['pe']}. Revenue growth remains strong with healthy operating margins.",
            'strengths': [
                'Strong brand moat and market positioning',
                'Consistent revenue growth over the past 5 years',
                'Healthy cash flow generation and reserves',
                'Strategic investments in AI and emerging technologies',
            ],
            'weaknesses': [
                'Elevated P/E ratio relative to sector average',
                'Increasing regulatory scrutiny in key markets',
                'Dependency on single product line for majority revenue',
            ],
            'metrics': {
                'pe_ratio': float(info['pe']),
                'current_price': float(info['price']),
                '52w_high': float(info['high52']),
                '52w_low': float(info['low52']),
                'roi_estimate': f"{round(random.uniform(5, 20), 1)}%",
                'debt_to_equity': round(random.uniform(0.2, 1.7), 2),
            },
            'verdict': 'Hold' if float(info['pe']) > 35 else 'Buy',
        },
        'sentiment_analysis': {
            'sentiment_score': round(random.uniform(-0.2, 1.0), 2),
            'mood': 'Bullish' if random.random() > 0.4 else 'Cautiously Optimistic',
            'headlines': [
                {'text': f"{info['name']} beats quarterly earnings estimates, shares rally.", 'label': 'Positive', 'sentiment': 'positive'},
                {'text': f"Analysts upgrade {ticker} target price citing strong fundamental moat.", 'label': 'Positive', 'sentiment': 'positive'},
                {'text': f"Macro headwinds pose temporary challenge to {info['sector']} margins.", 'label': 'Neutral', 'sentiment': 'neutral'},
                {'text': f"Regulatory bodies hint at stricter compliance for {ticker}.", 'label': 'Negative', 'sentiment': 'negative'},
            ],
            'buzz_level': 'High' if random.random() > 0.5 else 'Medium',
            'summary': f"Market sentiment for {ticker} is predominantly positive, driven by strong earnings reports and strategic AI investments.",
        },
        'risk_assessment': {
            'risk_level': 'High' if float(info['pe']) > 50 else ('Low' if float(info['pe']) < 20 else 'Medium'),
            'warnings': [
                'Macroeconomic uncertainty may impact consumer spending',
                'Geopolitical risks in key supply chain regions',
                'Competitive pressure from emerging players',
                'Interest rate environment affecting growth valuations',
            ],
            'risk_summary': f"{ticker} carries {'high' if float(info['pe']) > 50 else 'moderate'} risk primarily driven by valuation concerns and macro headwinds.",
            'volatility_index': round(random.uniform(15, 45), 1),
        },
        'valuation': {
            'valuation_status': 'Slightly Overvalued' if float(info['pe']) > 40 else ('Undervalued' if float(info['pe']) < 15 else 'Fairly Valued'),
            'fair_price_estimate': f"${round(float(info['price']) * (0.9 + random.uniform(0, 0.3)), 2)} - ${round(float(info['price']) * (1.1 + random.uniform(0, 0.2)), 2)}",
            'reasoning': f"Based on DCF analysis and peer comparison, {ticker} appears to be {'trading at a premium' if float(info['pe']) > 40 else 'reasonably priced'} relative to its intrinsic value.",
        },
        'chart_data': chart_data,
    }

    return Response(response_payload)
