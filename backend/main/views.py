from rest_framework.viewsets import ModelViewSet
from django.forms.models import model_to_dict
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.response import Response
import logging

from backend.mixins import ActionBasedSerializerClassMixin
from main.models import Dataset

from .serializers import UploadSerializer,UploadResponseSerializer

from .tasks import post_predict_dataset


logger = logging.getLogger(__name__)

class UploadViewSet(ActionBasedSerializerClassMixin,ModelViewSet):
    queryset = Dataset.objects.prefetch_related(*Dataset.PREFETCH_RELATED_FIELDS).all()
    base_serializer_class = UploadSerializer
    retrieve_serializer_class = UploadResponseSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        data = serializer.context['request'].data
        files = data.pop("files",list())
        post_predict_dataset.delay(
            dataset_id = instance.id
        )
