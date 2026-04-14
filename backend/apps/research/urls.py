from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'research'

router = DefaultRouter()
router.register('tickers', views.StockTickerViewSet, basename='ticker')
router.register('reports', views.ResearchReportViewSet, basename='report')

urlpatterns = [
    path('quick-demo/', views.quick_demo_report, name='quick-demo'),
    path('', include(router.urls)),
]
