from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'market_data'

router = DefaultRouter()
router.register('snapshots', views.MarketDataViewSet, basename='market-snapshot')
router.register('news', views.NewsArticleViewSet, basename='news-article')

urlpatterns = [
    path('', include(router.urls)),
]
