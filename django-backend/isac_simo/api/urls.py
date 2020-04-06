from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Image & Image Files
    path('image', views.images, name="images"),
    path('image/add', views.addImage, name="images.add"),
    path('image/update/<int:id>', views.updateImage, name="images.update"),
    path('image/delete/<int:id>', views.deleteImage, name="images.delete"),
    path('image/send/to/retrain/<int:id>', views.retrainImage, name="images.retrain"),
    path('image/image_file/delete/<int:id>', views.deleteImageFile, name="images.image_file.delete"),
    path('image/image_file/retest/<int:id>', views.retestImageFile, name="images.image_file.retest"),
    path('image/image_file/verify/<int:id>', views.verifyImageFile, name="images.image_file.verify"),

    # Watson
    # -----------
    path('watson/classifier', views.watsonClassifierList, name="watson.classifier.list"),
    path('watson/classifier/create', views.watsonClassifierCreate, name="watson.classifier.create"),
    path('watson/classifier/delete/<int:id>', views.watsonClassifierDelete, name="watson.classifier.delete"),
    path('watson/classifier/edit/<int:id>', views.watsonClassifierEdit, name="watson.classifier.edit"),
    path('watson/classifier/test/<int:id>', views.watsonClassifierTest, name="watson.classifier.test"),
    path('watson/classifier/detail', views.watsonClassifier, name="watson.classifier"),
    path('watson/classifier/train', views.watsonTrain, name="watson.train"), # train or re-train
    # -----------
    path('watson/object/list', views.watsonObjectList, name="watson.object.list"),
    path('watson/object/create', views.watsonObjectCreate, name="watson.object.create"),
    path('watson/object/delete/<int:id>', views.watsonObjectDelete, name="watson.object.delete"),
    path('watson/object/detail', views.watsonObject, name="watson.object"), # fetch from ibm details

    # Other Misc. Actions
    path('misc/clean/temp', views.cleanTemp, name="watson.cleantemp"),
    path('misc/count/images', views.countImage, name="watson.countimage"),
    path('misc/dump/images', views.dumpImage, name="watson.dumpimage"),#dump json of image+image_file models
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)