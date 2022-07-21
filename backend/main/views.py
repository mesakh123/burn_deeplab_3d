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
    queryset = Dataset.objects.all()
    base_serializer_class = UploadSerializer
    retrieve_serializer_class = UploadResponseSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        data = serializer.context['request'].data
        files = data.pop("files",list())
        post_predict_dataset.delay(
            dataset_id = instance.id
        )

    @extend_schema(responses=UploadResponseSerializer)
    @action(detail=True,methods=["get"],)
    def datafiles(self, request, *args, **kwargs):
        dataset = self.get_object()
        data = { "dataset":model_to_dict(dataset), "files": {}}
        ground_truths = dataset.file_set.all().values()
        prediction = dataset.prediction_set.all().first()
        file_dict = dict()
        for gt in ground_truths:
            file_dict[gt["type"]] = gt
        if prediction:
            prediction_dict = model_to_dict(prediction)
            print(f"prediction_dict : {prediction_dict}")
            prediction_dict["file"]  = "" if "file" not in  prediction_dict else prediction_dict["file"].name
            file_dict['predictions'] = prediction_dict

        data["files"] = file_dict
        # try:

        # except Exception as e:
        #     logger.info(f"Error getting data : {e}  ")
        #     raise Exception("Error")

        return Response(data)
