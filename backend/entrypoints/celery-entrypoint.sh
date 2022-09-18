#!/bin/bash
#celery -A backend worker -l info -Q datasets --pool=prefork --concurrency=${CELERY_WORKER_CONCURRENCY} -n datasets_worker@%h
celery -A backend worker -l info -Q datasets -P solo -n datasets_worker@%h
#celery -A visionai worker -l info -Q datasetmetadata --concurrency=${CELERY_WORKER_CONCURRENCY} -P threads -n datasetmetadata_worker@%h

# Format:
# celery -A visionai worker -l info -Q queue -n queue-worker@%h &
