from .base import *  # noqa
import os
from os import environ


ALLOWED_HOSTS = ['*']

BASE_ALLOWED_HOSTS =  [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8080',
]
# CORS
# CORS_ALLOWED_ORIGINS = BASE_ALLOWED_HOSTS
# CORS_ALLOW_HEADERS = ["*"]
# CSRF_TRUSTED_ORIGINS =  BASE_ALLOWED_HOSTS
# CORS_ALLOW_ALL_ORIGINS = True
# CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Redis
REDIS_HOST = environ.get("REDIS_HOST", "redis")
REDIS_CACHE_LOCATION = f"redis://{REDIS_HOST}:6379"

# Celery
# https://docs.celeryproject.org/en/stable/userguide/configuration.html#broker-settings
accept_content = ["pickle", "json"]
timezone = TIME_ZONE
broker_url = environ.get("CELERY_BROKER_URL", REDIS_CACHE_LOCATION)
result_backend = environ.get("CELERY_RESULT_BACKEND", REDIS_CACHE_LOCATION)
task_track_started = True
task_default_queue = "others"
task_reject_on_worker_lost = True
task_acks_late = True
beat_scheduler = "django_celery_beat.schedulers:DatabaseScheduler"
