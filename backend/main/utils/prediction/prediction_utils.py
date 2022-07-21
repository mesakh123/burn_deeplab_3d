import os
import torch
import segmentation_models_pytorch as sm
import numpy as np
import albumentations as albu
from PIL import Image
from io import BytesIO
import base64
import logging
import ssl
ssl._create_default_https_context = ssl._create_unverified_context

logger = logging.getLogger(__name__)

global burn_normal_preprocessor
global burn_deep_preprocessor
MODEL_FOLDER_PATH = os.path.abspath("/app/main/dlmodels") + "/"
BURN_NORMAL_PATH = os.path.abspath(MODEL_FOLDER_PATH + "best_model_burn_se_resnext101_32x4d_8902_full.pth")
BURN_DEEP_PATH = os.path.abspath(MODEL_FOLDER_PATH + "best_model_deep_burn_deeplabv3plus_full.pth")
DEVICE = torch.device("cpu")



def to_tensor(x, **kwargs):
    return x.transpose(2, 0, 1).astype('float32')

def get_preprocessing(preprocessing_fn):
    """Construct preprocessing transform

    Args:
        preprocessing_fn (callbale): data normalization function
            (can be specific for each pretrained neural network)
    Return:
        transform: albumentations.Compose

    """

    _transform = [
        albu.Lambda(image=preprocessing_fn),
        albu.Lambda(image=to_tensor, mask=to_tensor),
    ]
    return albu.Compose(_transform)


def load_dl_model():
    global burn_normal_preprocessor, burn_deep_preprocessor, BURN_NORMAL_PATH, BURN_DEEP_PATH
    logger.info(f"BURN_NORMAL_PATH : {BURN_NORMAL_PATH}")
    logger.info(f"BURN_DEEP_PATH : {BURN_DEEP_PATH}")
    BURN_NORMAL_ENCODER = 'se_resnext101_32x4d'
    BURN_DEEP_ENCODER = 'resnet101'
    ENCODER_WEIGHTS = 'imagenet'

    burn_normal_preprocess_input = sm.encoders.get_preprocessing_fn(BURN_NORMAL_ENCODER, ENCODER_WEIGHTS)
    burn_normal_preprocessor = get_preprocessing(burn_normal_preprocess_input)


    burn_deep_preprocess_input = sm.encoders.get_preprocessing_fn(BURN_DEEP_ENCODER, ENCODER_WEIGHTS)
    burn_deep_preprocessor = get_preprocessing(burn_deep_preprocess_input)

    if os.path.exists(BURN_NORMAL_PATH):
        model_burn_normal = torch.load(BURN_NORMAL_PATH,map_location=torch.device("cpu"))
        model_burn_normal.eval()
    else:
        logger.info(f"model_burn_normal is None")
        model_burn_normal = None

    if os.path.exists(BURN_DEEP_PATH):
        model_burn_deep = torch.load(BURN_DEEP_PATH,map_location=torch.device("cpu"))
        model_burn_deep.eval()
    else:
        logger.info(f"model_burn_deep is None")
        model_burn_deep = None

    return model_burn_normal, model_burn_deep

def apply_mask(image, mask, color, alpha=0.5):
    """Apply the given mask to the image.
    """
    for c in range(3):
        image[:, :, c] = np.where(mask == 1,
                                  image[:, :, c] *
                                  (1 - alpha) + alpha * color[c],
                                  image[:, :, c])
    return image

def predict(model,image,type="normal"):

    #preprocess
    if type == "normal":
        preprocess_image = burn_normal_preprocessor(image=image)['image']
    else:
        preprocess_image = burn_deep_preprocessor(image=image)['image']

    preprocess_image = torch.from_numpy(preprocess_image).to(DEVICE).unsqueeze(0)
    pr_mask = model.forward(preprocess_image).squeeze().cpu().detach().numpy().round()
    #pr_mask = np.transpose(pr_mask,(1,2,0))
    pixel_numbers = np.count_nonzero(pr_mask)

    return pr_mask,pixel_numbers
