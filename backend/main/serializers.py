import os
import uuid
from rest_framework import serializers
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import transaction

from django.conf import settings
from .models import Datafile, Dataset, Prediction
from .utils.validator import validate_request_files,FILE_TYPE


class DatafileSerializer(serializers.ModelSerializer):
    file = serializers.FileField( allow_empty_file=True, allow_null=True)
    class Meta:
        model = Datafile
        fields = "__all__"

class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = "__all__"

class PredictionSerializer(serializers.ModelSerializer):
    file = serializers.FileField( allow_empty_file=True, allow_null=True)
    class Meta:
        model = Prediction
        fields = "__all__"



class UploadResponseSerializer(DatasetSerializer):
    gt_files = DatafileSerializer(source="file_set",many=True)
    pt_files = DatafileSerializer(source="prediction_set",many=True)


class UploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields= "__all__"
    files = serializers.ListField(
        child=serializers.FileField(allow_empty_file=False),
        max_length=3,
        write_only=True,
    )
    def create(self, validated_data):
        files = validated_data.get("files",None)
        validated_data.pop("files",None)
        if len(files) < 3 :
            raise ValueError("There must be at least 3 files to created_at")

        if  not validate_request_files(files):
            raise ValueError("There must be an image, an obj file, and a mtl file required")


        validated_data["dataset_uuid"] = str(uuid.uuid4())

        dataset = None
        with transaction.atomic():
            dataset = super().create(validated_data)


        Datafile.objects.bulk_create(
            [
                Datafile(dataset=dataset,file=file,type=FILE_TYPE.get(os.path.splitext(file.name)[-1],Datafile.Type.TEXTURE))
                for file in files
            ]
        )

        return dataset
