
from rest_framework.routers import DefaultRouter
from .views import DataInfoViewSet, UploadViewSet

router = DefaultRouter()
router.register("upload", UploadViewSet)
router.register("datainfo",DataInfoViewSet)


app_name="api"
urlpatterns = router.urls
