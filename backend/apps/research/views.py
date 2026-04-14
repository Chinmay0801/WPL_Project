from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
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
