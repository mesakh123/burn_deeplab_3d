
from rest_framework.routers import DefaultRouter
from .views import UploadViewSet

router = DefaultRouter()
router.register("upload", UploadViewSet)


app_name="api"
urlpatterns = router.urls
