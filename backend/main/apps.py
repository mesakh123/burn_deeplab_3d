from django.apps import AppConfig
from .utils.prediction import prediction_utils
global BURN_MODEL_NORMAL
global BURN_MODEL_DEEP
class MainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'

    def ready(self):
        global BURN_MODEL_NORMAL
        global BURN_MODEL_DEEP
        BURN_MODEL_NORMAL , BURN_MODEL_DEEP = prediction_utils.load_dl_model()
