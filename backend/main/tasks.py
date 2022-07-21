from backend.celery import app
import logging
from datetime import timedelta
from django.db import transaction
from django.core.files.base import ContentFile, File
import numpy as np
from PIL import Image
from io import BytesIO
import skimage
import base64
from django.db import transaction
from celery.schedules import crontab
from django.utils import timezone
from django.core.files.uploadedfile import InMemoryUploadedFile
from .models import Datafile,Dataset, OperationStatus,Prediction
from main.utils.prediction.prediction_utils import apply_mask,predict
from main.apps import BURN_MODEL_DEEP,BURN_MODEL_NORMAL

logger = logging.getLogger(__name__)




@app.task(name="post_predict_dataset", queue="datasets")
def post_predict_dataset(dataset_id: int):
    logger.info("Post-predict dataset started")
    dataset = Dataset.objects.prefetch_related("file_set").get(id=dataset_id)
    if not BURN_MODEL_NORMAL or not BURN_MODEL_DEEP:
            raise ValueError("Burn models can't be None")

    texture_file = dataset.file_set.filter(type=Datafile.Type.TEXTURE).first()

    logger.info("Open file")
    with open(texture_file.file.path, 'rb') as f:
        data = f.read()
    if not data or not len(data):
        raise ValueError("Image can't be None")

    if not BURN_MODEL_NORMAL or not BURN_MODEL_DEEP:
        raise ValueError("Burn models can't be None")

    buffer = BytesIO(data)
    image = Image.open(buffer).convert("RGB")
    image = np.asarray(image).astype(np.uint8)
    predict_image = skimage.transform.resize(image,(1024,1024))


    logger.info("Start burn_normal_mask predictions")

    burn_normal_mask,burn_normal_pixels = predict(BURN_MODEL_NORMAL,predict_image)
    burn_normal_mask = skimage.transform.resize(burn_normal_mask,(image.shape[0],image.shape[1]))
    image = apply_mask(image,burn_normal_mask,(255,0,0))


    logger.info("Start burn_deep_mask predictions")
    burn_deep_mask,burn_deep_pixels = predict(BURN_MODEL_DEEP,predict_image)
    burn_deep_mask = skimage.transform.resize(burn_deep_mask,(image.shape[0],image.shape[1]))
    image = apply_mask(image,burn_deep_mask,(255,255,255))


    image = Image.fromarray(image)
    buffer = BytesIO()
    image.save(buffer, format='JPEG', quality=100)
    buffer.seek(0)

    prediction = Prediction(dataset=dataset)
    prediction.file.save("texture_output.jpg",InMemoryUploadedFile(
            buffer,                  # file
            None,                   # field_name
            "texture_output.jpg",   # file name
            'image/jpeg',           # content_type
            buffer.getbuffer().nbytes,             # size
            None                  # content_type_extra
        )
    )
    try:

        dataset.upload_status = OperationStatus.COMPLETED
        logger.error("Prediction successfully uploaded")
    except Exception as e:
        logger.error(f"Prediction error : {e}")
        dataset.upload_status = OperationStatus.FAILED
    dataset.save()
