"""
Config package init — expose Celery app so it's loaded on Django start.
"""
from .celery import app as celery_app

__all__ = ('celery_app',)
