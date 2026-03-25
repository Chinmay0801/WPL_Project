"""
Development-specific settings.
"""
DEBUG = True

ALLOWED_HOSTS = ['*']

# Use SQLite locally if PostgreSQL isn't running
# Comment these out if you're using Docker (PostgreSQL from docker-compose)
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',  # noqa: F821
#     }
# }

CORS_ALLOW_ALL_ORIGINS = True
