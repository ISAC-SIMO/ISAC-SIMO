import glob
import io
import json
import os
import uuid
from datetime import datetime
from http.client import HTTPResponse
from importlib import reload

import numpy as np
import tensorflow as tf
import PIL.Image as PILImage

import filetype
from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core import serializers
from django.db.models import Q
from django.http import HttpResponse, HttpResponseRedirect
from django.http.response import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from requests_toolbelt import user_agent
from rest_framework import generics, mixins, viewsets
from rest_framework.decorators import permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response

import isac_simo.classifier_list as classifier_list
from api.forms import OfflineModelForm
from api.helpers import (classifier_detail, create_classifier, object_detail,
                         quick_test_image, retrain_image, test_image)
from api.models import Classifier, ObjectType, OfflineModel
from api.serializers import (ImageSerializer, UserSerializer,
                             VideoFrameSerializer)
from main import authorization
from main.authorization import *
from main.models import User
from projects.models import Projects

from .forms import ImageForm
from .models import Image, ImageFile


def reload_classifier_list():
    try:
        reload(classifier_list)
    except Exception as e:
        print('--------- [ERROR] FAILED TO RELOAD CLASSIFIER LIST MODULE [ERROR:OOPS] --------')

# View All Images
@login_required(login_url=login_url)
def images(request):
    if(is_admin(request.user)):
        images = Image.objects.order_by('-created_at').all().prefetch_related('image_files')
    elif(is_government(request.user)):
        # NOTE: SHOW IMAGES UPLOADED BY SELF OR LINKED TO PROJECT WHICH THIS USER IS PART OF
        projects = Projects.objects.filter(users__id=request.user.id)
        images = Image.objects.filter(Q(user_id=request.user.id) | Q(project__in=projects)).order_by('-created_at').prefetch_related('image_files').distinct()
    else:
        # NOTE: SHOW IMAGES UPLOADED BY SELF OR LINKED TO PROJECT WHICH THIS USER IS PART OF
        projects = Projects.objects.filter(users__id=request.user.id)
        images = Image.objects.filter(Q(user_id=request.user.id) | Q(project__in=projects)).order_by('-created_at').prefetch_related('image_files').distinct()
    return render(request, 'image.html',{'images':images})

# Add Image via Dashboard
@user_passes_test(is_admin, login_url=login_url)
def addImage(request, id = 0):
    if request.method == "GET":
        form = ImageForm()
        return render(request,"add_image.html",{'form':form})
    elif request.method == "POST":
        form = ImageForm(request.POST or None, request.FILES or None)
        files = request.FILES.getlist('image')
        if(len(files) <= 0):
            messages.error(request, "No Image Provided")
            return render(request,"add_image.html",{'form':form})

        if form.is_valid():
            instance = form.save(commit=False)
            if(request.POST.get('user') is None or request.POST.get('user') == ''):
                instance.user_id = request.user.id
            instance.save()

            project = None
            if request.POST.get('project', False):
                project = Projects.objects.filter(id=request.POST.get('project')).get()
            if not project:
                messages.error(request, "Invalid Project")
                return redirect("images")

            i = 0
            for f in files:
                i = i + 1
                photo = ImageFile(image=instance, file=f)
                photo.save()
                ################
                ### RUN TEST ###
                ################
                test_image(photo, request.POST.get('title'), request.POST.get('description'), detect_model=project.detect_model, project=project.unique_name())
                    
                if(i>=8):
                    break

            messages.success(request, str(i)+" Image(s) Uploaded Successfully!")
        else:
            messages.error(request, "Invalid Request")
            return render(request,"add_image.html",{'form':form}) 

    return redirect("images")

# Update Image + Append File + PATCH
@user_passes_test(is_admin, login_url=login_url)
def updateImage(request, id=0):
    try:
        image = Image.objects.get(id=id)
        image_files = ImageFile.objects.filter(image_id=image.id)
        verified_list = {}
        can_retrain = False
        min_images_to_zip = 10
        if settings.DEBUG:
            min_images_to_zip = 2
        #NOTE: 10 minimum zipped images is required to re-train a go,nogo,etc.. model (calculated below)

        if request.method == "GET":
            for image_file in image_files:
                if image_file.verified and image_file.result and image_file.object_type and not image_file.retrained:
                    # TO CREATE STRUCTURE OF #
                    # {
                    #     "wall":{
                    #         "go": 10,
                    #         "nogo":5,
                    #     },
                    #     "rebar":{
                    #         "10mm": 10,
                    #         "20mm":5,
                    #     }
                    # }
                    verified_list[image_file.object_type.lower()] = verified_list.get(image_file.object_type.lower(),{})
                    verified_list.get(image_file.object_type.lower(),{})[image_file.result.lower()] = verified_list.get(image_file.object_type.lower(),{}).get(image_file.result.lower(),0) + 1
                    # print(verified_list)
                    if verified_list.get(image_file.object_type.lower(),{}).get(image_file.result.lower(),0) >= min_images_to_zip:
                        can_retrain = True

            form = ImageForm(instance=image)
            user_name = image.user.full_name
            user_id = image.user.id
            return render(request,"add_image.html",{'form':form, 'user_name':user_name, 'user_id':user_id, 'id':id, 'image_files':image_files, 'verified_list':verified_list, 'can_retrain':can_retrain})
        elif request.method == "POST":
            files = request.FILES.getlist('image')
            form = ImageForm(request.POST or None, request.FILES or None, instance=image)
            if form.is_valid():
                instance = form.save(commit=False)
                instance.save()

                project = None
                if request.POST.get('project', False):
                    project = Projects.objects.filter(id=request.POST.get('project')).get()
                if not project:
                    messages.error(request, "Invalid Project")
                    return redirect("images")

                i = 0
                for f in files:
                    i = i + 1
                    photo = ImageFile(image=instance, file=f)
                    photo.save()
                    ################
                    ### RUN TEST ###
                    ################
                    test_image(photo, request.POST.get('title'), request.POST.get('description'), detect_model=project.detect_model, project=project.unique_name())

                    if(i>=8):
                        break

                messages.success(request, "Image Details Edited Successfully!")
            else:
                messages.error(request, "Invalid Request")
                return render(request,"add_image.html",{'form':form, 'id':id, 'image_files':image_files}) 

        return redirect("images")
    except(Image.DoesNotExist):
        messages.error(request, "Invalid Image attempted to Edit")
        return redirect("images.add")

# Delete Image
@user_passes_test(is_admin, login_url=login_url)
def deleteImage(request, id=0):
    try:
        if request.method == "POST":
            image = Image.objects.get(id=id)
            for i in image.image_files.all():
                i.file.delete()
                i.delete()
            image.delete()
            messages.success(request, 'Image Data Deleted Successfully!')
            return redirect('images')
        else:
            messages.error(request, 'Failed to Delete!')
            return redirect('images')
    except(Image.DoesNotExist):
        messages.error(request, "Invalid Image attempted to Delete")
        return redirect("images")

# This is users image retrain - not from inside IBM watson sidebar menu
# Retrain Images files uploaded by API after checking verified status and then send zip to ibm
@user_passes_test(is_admin, login_url=login_url)
def retrainImage(request, id):
    try:
        image = Image.objects.get(id=id)
        image_files = ImageFile.objects.filter(image_id=image.id)
        verified_list = {}
        image_file_list = {}
        image_file_id_list = {}
        can_retrain = False
        min_images_to_zip = 10
        if settings.DEBUG:
            min_images_to_zip = 2
        #NOTE: 10 minimum zipped images is required to re-train a go,nogo,etc.. model (calculated below)

        if request.method != "POST":
            messages.error(request, "Re-Train Request was improperly sent")
            return HttpResponseRedirect(request.META.get('HTTP_REFERER','/'))
        elif request.method == "POST":
            for image_file in image_files:
                if image_file.verified and image_file.result and image_file.file and image_file.object_type:
                    verified_list[image_file.object_type.lower()] = verified_list.get(image_file.object_type.lower(),{})
                    verified_list.get(image_file.object_type.lower(),{})[image_file.result.lower()] = verified_list.get(image_file.object_type.lower(),{}).get(image_file.result.lower(),0) + 1
                    # print(verified_list)

                    image_file_list[image_file.object_type.lower()] = image_file_list.get(image_file.object_type.lower(),{})
                    image_file_list.get(image_file.object_type.lower(),{})[image_file.result.lower()] = image_file_list.get(image_file.object_type.lower(),{}).get(image_file.result.lower(),[]) + [image_file.file.url]
                    # print(image_file_list)
                    
                    image_file_id_list[image_file.object_type.lower()] = image_file_id_list.get(image_file.object_type.lower(),{})
                    image_file_id_list.get(image_file.object_type.lower(),{})[image_file.result.lower()] = image_file_id_list.get(image_file.object_type.lower(),{}).get(image_file.result.lower(),[]) + [image_file.id]
                    # print(image_file_id_list)

                    # verified_list[image_file.result.lower()] = verified_list.get(image_file.result.lower(),0) + 1
                    # image_file_list[image_file.result.lower()] = image_file_list.get(image_file.result.lower(),[]) + [image_file.file.url]
                    # image_file_id_list[image_file.result.lower()] = image_file_id_list.get(image_file.result.lower(),[]) + [image_file.id]
                    # print(image_file_list)
                    print(verified_list)

            for p_key, p_value in verified_list.items():
                # print(p_value)
                for key, value in p_value.items():
                    if value >= min_images_to_zip:
                        can_retrain = True
                        print(image_file_list.get(p_key,{}).get(key,[]))
                        # Image File List(arr), project, object_type, result
                        retrain_response = retrain_image(image_file_list.get(p_key,{}).get(key,[]), image.project.unique_name(), p_key, key, noIndexCheck=True)

                        if retrain_response:
                            messages.success(request, "Zipped and Sent for Re-Training")
                            # Use id list to update in db - the retrained boolean status
                            print(image_file_id_list.get(p_key,{}).get(key,[]))
                            for id in image_file_id_list.get(p_key,{}).get(key,[]):
                                image_file = ImageFile.objects.get(id=id)
                                image_file.retrained = True
                                image_file.save()
                        else:
                            messages.error(request, "Failed to Re-Train")
                            print('Failed to re-train')
        
        return HttpResponseRedirect(request.META.get('HTTP_REFERER','/'))
    except(Image.DoesNotExist):
        messages.error(request, "This Image Model probably does not exist")
        return redirect("images.add")

# Delete Image Specific File
@user_passes_test(is_admin, login_url=login_url)
def deleteImageFile(request, id):
    try:
        if request.method == "POST":
            image_file = ImageFile.objects.get(id=id)
            image_file.file.delete()
            image_file.delete()
            messages.success(request, 'Image Deleted Successfully!')
            return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
        else:
            messages.error(request, 'Invalid Request!')
            return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
    except(ImageFile.DoesNotExist):
        messages.error(request, "Invalid Image File attempted to Delete")
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

# Re-Test Image Specific File
@user_passes_test(is_admin, login_url=login_url)
def retestImageFile(request, id):
    try:
        image_file = ImageFile.objects.get(id=id)
        project = image_file.image.project
        if not image_file.result or not image_file.score:
            test_status = test_image(image_file, detect_model=project.detect_model, project=project.unique_name())
            if test_status:
                messages.success(request, 'Image Tested Successfully.')
            else:
                messages.error(request, 'Testing Image Failed !!')
        else:
            messages.error(request, 'Image was already tested.')
        
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
    except(ImageFile.DoesNotExist):
        messages.error(request, "Invalid Image File attempted to Re-test")
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

# Re-Test Image Specific File
@user_passes_test(is_admin, login_url=login_url)
def verifyImageFile(request, id):
    try:
        image_file = ImageFile.objects.get(id=id)
        image_file.result = request.POST.get('test-result',image_file.result).lower()
        image_file.score = request.POST.get('test-score',image_file.score)
        image_file.object_type = request.POST.get('test-object-type',image_file.object_type).lower()
        if request.POST.get('test-verified',False):
            image_file.verified = True
        else:
            image_file.verified = False
        image_file.save()

        # NOW TODO: SEND Images to SPSS or continues or IBM AI model and retrain it or something like that

        messages.success(request, "Image File Updated - It is now " + ('verified' if image_file.verified else 'un-verified'))
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
    except(ImageFile.DoesNotExist):
        messages.error(request, "Invalid Image File attempted to Verify")
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

# Image Custom Train to IBM
# OR Retrain Image in uploaded by admin into ibm model selected
@user_passes_test(is_admin, login_url=login_url)
def watsonTrain(request):
    if request.method == "GET":
        return render(request, 'train.html',{'classifier_list':classifier_list.value()})
    elif request.method == "POST":
        zipped = 0
        image_file_list = []
        for image in request.FILES.getlist('images'):
            kind = filetype.guess(image)
            if kind is None:
                print('Cannot guess file type!')
            else:
                filename = '{}.{}'.format(uuid.uuid4().hex, kind.extension)
                destination = open(settings.MEDIA_ROOT + '/temp/' + filename, 'wb+')
                for chunk in image.chunks():
                    destination.write(chunk)
                destination.close()
                if not os.path.exists(os.path.join('media/temp/')):
                    image_file_list = image_file_list + [os.environ.get('PROJECT_FOLDER','') + '/media/temp/'+filename]
                else:
                    image_file_list = image_file_list + [os.path.join('media/temp/', filename)]
                zipped += 1
                # print(image_file_list)

        min_image_required = 10
        if settings.DEBUG:
            min_image_required = 2

        # we have "model" in request. If Model is all or not provided then all images are re-trained in all classifiers of object type given, else only on selected classifier (it is the last parameter in retrain function)
        if zipped >= min_image_required and image_file_list and request.POST.get('project', False) and request.POST.get('object', False) and request.POST.get('result', False):
            retrain_status = retrain_image(image_file_list, request.POST.get('project'), request.POST.get('object').lower(), request.POST.get('result').lower(), 'temp', request.POST.get('model', False), request.POST.get('process', False), request.POST.get('rotate', False), request.POST.get('warp', False), request.POST.get('inverse', False))
            print(retrain_status)
            if retrain_status:
                messages.success(request,str(zipped) + ' images zipped and was sent to retrain in ' + str(retrain_status) + ' classifier(s). (Retraining takes time)')
                messages.info(request,'Project: '+request.POST.get('project')+', Object: '+request.POST.get('object')+' , Classifier: '+request.POST.get('model')+' , Result: '+request.POST.get('result'))
            else:
                messages.error(request,str(zipped) + ' images zipped but failed to retrain')
        else:
            messages.error(request,str(zipped) + ' valid Image(s). At least 10 required. Or Invalid input.')

        print(str(len(image_file_list)) + ' original images...')
        for image_file in image_file_list:
            os.remove(image_file)
            pass

        reload_classifier_list()
        return redirect('watson.train')
    
    return redirect('dashboard')

@user_passes_test(is_admin, login_url=login_url)
def watsonClassifierList(request):
    if request.GET.get('object_type', False):
        classifiers = Classifier.objects.order_by('-object_type').filter(object_type=request.GET.get('object_type')).order_by('order').all()
        object_type = ObjectType.objects.filter(id=request.GET.get('object_type')).get().name
    else:
        classifiers = Classifier.objects.order_by('-object_type').order_by('order').all()
        object_type = False
    
    return render(request, 'list_classifier.html',{'classifiers':classifiers,'object_type':object_type})

# Classifier Details of IBM
@user_passes_test(is_admin, login_url=login_url)
def watsonClassifier(request):
    if request.method != "POST":
        return render(request, 'classifiers.html',{'classifier_list':classifier_list.value()})
    elif request.method == "POST":
        detail = classifier_detail(request.POST.get('project', False), request.POST.get('object', False), request.POST.get('model', False))
        if detail:
            detail = json.dumps(detail, indent=4)
        else:
            detail = 'Could Not Fetch Classifier Detail'
        
        reload_classifier_list()
        return render(request, 'classifiers.html',{'classifier_list':classifier_list.value(), 'detail':detail, 'project':request.POST.get('project', False), 'object':request.POST.get('object', False), 'model':request.POST.get('model', False)})

# Create Custom Classifiers with zip data
@user_passes_test(is_admin, login_url=login_url)
def watsonClassifierCreate(request):
    if request.method == "GET":
        object_types = ObjectType.objects.order_by('-created_at').all()
        projects = Projects.objects.order_by('project_name').all()
        offlineModels = OfflineModel.objects.filter(model_type='CLASSIFIER').all()
        return render(request, 'create_classifier.html', {'object_types':object_types, 'projects':projects, 'offlineModels':offlineModels})
    elif request.method == "POST":
        print(request.FILES.getlist('zip'))
        if request.POST.get('justaddit', False) and request.POST.get('name'):
            if request.POST.get('offlineModel',False):
                created = {'data':{'classifier_id':request.POST.get('name'),'name':request.POST.get('name'),'offline_model':request.POST.get('offlineModel'),'classes':[]}}
            else:
                created = {'data':{'classifier_id':request.POST.get('name'),'name':request.POST.get('name'),'classes':[]}}
        else:
            created = create_classifier(request.FILES.getlist('zip'), request.FILES.get('negative', False), request.POST.get('name'), request.POST.get('object_type'), request.POST.get('process', False), request.POST.get('rotate', False), request.POST.get('warp', False), request.POST.get('inverse', False))
        
        bad_zip = 0
        if created:
            bad_zip = created.get('bad_zip', 0)
            name = created.get('data', {}).get('classifier_id','')
            given_name = created.get('data', {}).get('name',request.POST.get('name'))
            classes = str(created.get('data', {}).get('classes',[]))
            object_type = None
            project = None
            try:
                object_type = ObjectType.objects.get(id=request.POST.get('object_type'))
            except(ObjectType.DoesNotExist):
                messages.error(request, 'Object Was Invalid')

            try:
                project = Projects.objects.get(id=request.POST.get('project'))
            except(Projects.DoesNotExist):
                messages.error(request, 'Project Was Invalid')
            
            if name and given_name and classes and object_type:
                classifier = Classifier()
                classifier.name = name
                classifier.given_name = given_name
                classifier.classes = classes
                classifier.object_type = object_type
                classifier.project = project
                classifier.created_by = request.user
                classifier.order = request.POST.get('order',0)
                if request.POST.get('offlineModel',False):
                    offline_model = OfflineModel.objects.filter(id=request.POST.get('offlineModel')).get()
                    classifier.offline_model = offline_model
                    classifier.classes = json.loads(offline_model.offline_model_labels)
                classifier.save()
            
            created = json.dumps(created, indent=4)
        else:
            created = 'Could Not Create Classifier (Verify zip files are valid and try again)'
        
        reload_classifier_list()
        return render(request, 'create_classifier.html',{'created':created, 'bad_zip':bad_zip})

    messages.error(request, 'Invalid Request')
    return redirect('dashboard')

# Watson Classifier Edit
@user_passes_test(is_admin, login_url=login_url)
def watsonClassifierEdit(request, id):
    if(request.method == "POST" and request.POST.get('object_type', False) 
        and request.POST.get('project', False)
        and request.POST.get('order', False)
    ):
        try:
            classifier = Classifier.objects.get(id=id)
            classifier.name = request.POST.get('name')
            classifier.object_type = ObjectType.objects.get(id=request.POST.get('object_type'))
            classifier.project = Projects.objects.get(id=request.POST.get('project'))
            if request.POST.get('offlineModel', False):
                offline_model = OfflineModel.objects.get(id=request.POST.get('offlineModel'))
                classifier.offline_model = offline_model
                classifier.classes = json.loads(offline_model.offline_model_labels)
            classifier.order = request.POST.get('order', 0)
            classifier.save()
            messages.success(request, 'Classifier Updated (Order set to: '+ str(request.POST.get('order', 0)) +')')
            reload_classifier_list()
            return redirect('watson.classifier.list')
        except(Classifier.DoesNotExist):
            messages.error(request, 'Classifier Not Found')
            return redirect('watson.classifier.list')
    elif(request.method == "GET"):
        classifier = Classifier.objects.get(id=id)
        object_types = ObjectType.objects.order_by('-created_at').all()
        projects = Projects.objects.order_by('project_name').all()
        offlineModels = OfflineModel.objects.filter(model_type='CLASSIFIER').all()
        return render(request, 'edit_classifier.html', {'classifier':classifier, 'object_types':object_types, 'projects':projects, 'offlineModels':offlineModels})
    else:
        messages.error(request, 'Classifier Not Edited Bad Request')
        return redirect('watson.classifier.list')

# Watson Classifier Delete
@user_passes_test(is_admin, login_url=login_url)
def watsonClassifierDelete(request, id):
    if(request.method == "POST"):
        try:
            classifier = Classifier.objects.get(id=id)
            classifier.delete()
            messages.success(request, 'Classifier Deleted (Images will not be passed through this again)')
            reload_classifier_list()
            return redirect('watson.classifier.list')
        except(Classifier.DoesNotExist):
            messages.success(request, 'Classifier Not Found')
            return redirect('watson.classifier.list')
    else:
        messages.success(request, 'Classifier Not Deleted')
        return redirect('watson.classifier.list')

# Watson Classifier Test - Simple image test
@user_passes_test(is_admin, login_url=login_url)
def watsonClassifierTest(request, id):
    if(request.method == "POST"):
        try:
            classifier = Classifier.objects.get(id=id)

            # IF THIS CLASSIFIER HAS OFFLINE MODEL THEN
            if classifier.offline_model:
                x = PILImage.open(request.FILES.get('file', False)).resize((150, 150))
                x = np.array(x)/255.0

                saved_model = None
                if not os.path.exists(os.path.join('media/offline_models/')):
                    saved_model = os.environ.get('PROJECT_FOLDER','') + '/media/offline_models/'+classifier.offline_model.filename()
                else:
                    saved_model = os.path.join('media/offline_models/', classifier.offline_model.filename())
                
                new_model = tf.keras.models.load_model(saved_model)
                result = new_model.predict(x[np.newaxis, ...]).tolist()
                data = []
                try:
                    offlineModelLabels = json.loads(classifier.offline_model.offline_model_labels)
                except Exception as e:
                    print(e)
                    offlineModelLabels = []
                
                i = 0
                for r in result[0]:
                    if len(offlineModelLabels) > i:
                        label = offlineModelLabels[i]
                    else:
                        label = 'No.'+str(i+1)

                    data.append({
                        "class": label,
                        "score": r
                    })
                    i += 1

                try:
                    result_type = offlineModelLabels[result[0].index(max(result[0]))].title()
                except:
                    result_type = 'No.'+str(result[0].index(max(result[0])) + 1)

                quick_test_image_result = {'data':data, 'score':max(result[0]), 'result':result_type}
            
            # ELSE ONLINE MODEL THEN
            else:
                quick_test_image_result = quick_test_image(request.FILES.get('file', False), classifier.name)
            
            if quick_test_image_result:
                request.session['test_result'] = json.dumps(quick_test_image_result.get('data','No Test Data'), indent=4)
                messages.success(request, 'Classifier Test Success.')
                messages.success(request, 'Score: '+str(quick_test_image_result.get('score','0'))+' | Class: '+quick_test_image_result.get('result','Not Found'))
            else:
                messages.error(request, 'Unable to Test (Make sure Classifier is valid and is in ready state)')

            return redirect('watson.classifier.test', id=id)
        except(Classifier.DoesNotExist):
            messages.success(request, 'Classifier Not Found')
            return redirect('watson.classifier.list')
        except Exception as e:
            print(e)
            messages.success(request, 'Classifier Test Failed')
            return redirect('watson.classifier.test', id=id)

    elif(request.method == "GET"):
        classifier = Classifier.objects.get(id=id)
        test_result = request.session.pop('test_result', False)
        return render(request, 'test_classifier.html', {'classifier':classifier, 'test_result':test_result})
    else:
        messages.success(request, 'Bad Request for CLassifier Test')
        return redirect('watson.classifier.test')

# Watson object detail fetch from ibm
@user_passes_test(is_admin, login_url=login_url)
def watsonObject(request):
    if request.method != "POST":
        default_object_model = classifier_list.detect_object_model_id
        projects = Projects.objects.all().values('detect_model','project_name').distinct()
        return render(request, 'objects_detail.html',{'default_object_model':default_object_model,'projects':projects})
    elif request.method == "POST":
        detail = None
        object_id = request.POST.get('object_id', False)
        try:
            detail = object_detail(object_id)
            if detail:
                detail = json.dumps(detail, indent=4)
            else:
                detail = 'Could Not Fetch List Object Detail Metadata'
        except:
            detail = 'Could Not Fetch List Object Detail Metadata (Server Error or Object Not Found)'
        finally:
            return render(request, 'objects.html',{'detail':detail,'object_id':object_id})

# Watson Object Type List
@user_passes_test(is_admin, login_url=login_url)
def watsonObjectList(request):
    if request.GET.get('project', False):
        object_types = ObjectType.objects.order_by('-created_at').filter(project=request.GET.get('project')).all()
        project_filter = Projects.objects.filter(id=request.GET.get('project')).get().project_name
    else:
        object_types = ObjectType.objects.order_by('-created_at').order_by('project').all()
        project_filter = False

    projects = Projects.objects.order_by('project_name').all()
    return render(request, 'create_objects.html', {'object_types':object_types, 'projects':projects, 'project_filter':project_filter})

# Watson Object Type Create local
@user_passes_test(is_admin, login_url=login_url)
def watsonObjectCreate(request):
    if(request.method == "POST" and request.POST.get('object_type', False) and request.POST.get('project', False)):
        check_unique = ObjectType.objects.filter(project=request.POST.get('project')).filter(name=request.POST.get('object_type').lower()).all()
        if not check_unique:
            object_type = ObjectType()
            object_type.name = request.POST.get('object_type').lower()
            object_type.project = Projects.objects.filter(id=request.POST.get('project')).get()
            object_type.created_by = request.user
            object_type.save()
            messages.success(request, 'Object Type Added')
            reload_classifier_list()
            return redirect('watson.object.list')
        else:
            messages.error(request, 'Object Not Added - Object Name already exists for this Project')
            return redirect('watson.object.list')
    else:
        messages.error(request, 'Object Not Added')
        return redirect('watson.object.list')

# Watson Object Type Delete
@user_passes_test(is_admin, login_url=login_url)
def watsonObjectDelete(request, id):
    if(request.method == "POST"):
        try:
            object_type = ObjectType.objects.get(id=id)
            object_type.delete()
            messages.success(request, 'Object Type Deleted (Related Classifier are now left without object types)')
            reload_classifier_list()
            return redirect('watson.object.list')
        except(ObjectType.DoesNotExist):
            messages.success(request, 'Object Not Found')
            return redirect('watson.object.list')
    else:
        messages.success(request, 'Object Not Deleted')
        return redirect('watson.object.list')

##################
# OFFLINE MODELS #
@user_passes_test(is_admin, login_url=login_url)
def offlineModel(request):
    models = OfflineModel.objects.all().order_by('name')
    return render(request, 'offline_model/list.html',{'models':models})

#########################
# OFFLINE MODELS CREATE #
@user_passes_test(is_admin, login_url=login_url)
def offlineModelCreate(request):
    if request.method == "GET":
        form = OfflineModelForm()
        offlineModelLabels = []
        return render(request,"offline_model/create.html",{'form':form,'offlineModelLabels':offlineModelLabels})
    elif request.method == "POST":
        form = OfflineModelForm(request.POST or None, request.FILES or None)
        if form.is_valid():
            instance = form.save(commit=False)
            instance.created_by = User.objects.get(id=request.user.id)
            instance.offline_model_labels = json.dumps(request.POST.getlist('offline_model_labels'))
            instance.save()
            messages.success(request, "New Offline Model Added")
        else:
            messages.error(request, "Invalid Request")
            return render(request,"offline_model/create.html",{'form':form})  

    return redirect("offline.model.list")

#######################
# OFFLINE MODELS EDIT #
@user_passes_test(is_admin, login_url=login_url)
def offlineModelEdit(request, id):
    try:
        offlineModel = OfflineModel.objects.filter(id=id).get()
        offlineModelFile = os.path.join(offlineModel.file.url.replace('/media/','media/'))

        if request.method == "GET":
            form = OfflineModelForm(instance=offlineModel)
            try:
                offlineModelLabels = json.loads(offlineModel.offline_model_labels)
            except Exception as e:
                offlineModelLabels = []
            return render(request,"offline_model/create.html",{'form':form, 'offlineModel':offlineModel,'offlineModelLabels':offlineModelLabels})
        elif request.method == "POST":
            form = OfflineModelForm(request.POST or None, request.FILES or None, instance=offlineModel)
            if form.is_valid():
                if request.FILES.get('file', False):
                    try:
                        if not os.path.exists(offlineModelFile):
                            os.remove(os.environ.get('PROJECT_FOLDER','') + offlineModelFile)
                        else:
                            os.remove(offlineModelFile)
                    except Exception as e:
                        print('Failed to remove old Offline Model File')
                        messages.info('Failed to remove old Offline Model File')

                instance = form.save(commit=False)
                instance.offline_model_labels = json.dumps(request.POST.getlist('offline_model_labels'))
                instance.save()
                messages.success(request, "Offline Model Updated Successfully!")
            else:
                messages.error(request, "Invalid Request")
                return render(request,"offline_model/create.html",{'form':form, 'offlineModel':offlineModel})

        return redirect("offline.model.list")
    except(Projects.DoesNotExist):
        messages.error(request, "Invalid Offline Model attempted to Edit")
        return redirect("offline.model.list")

#########################
# OFFLINE MODELS DELETE #
@user_passes_test(is_admin, login_url=login_url)
def offlineModelDelete(request, id):
    try:
        if request.method == "POST":
            offlineModel = OfflineModel.objects.get(id=id)
            offlineModel.file.delete()
            offlineModel.delete()
            messages.success(request, 'Offline Model Deleted Successfully!')
            return redirect('offline.model.list')
        else:
            messages.error(request, 'Failed to Delete!')
            return redirect('offline.model.list')
    except(Projects.DoesNotExist):
        messages.error(request, "Invalid Offline Model attempted to Delete")
        return redirect("offline.model.list")

#########################
# Clean Temporary Files #
@user_passes_test(is_admin, login_url=login_url)
def cleanTemp(request):
    files = []
    if not os.path.exists(os.path.join('media/temp/')):
        files = glob.glob(os.environ.get('PROJECT_FOLDER','') + '/media/temp/*')
    else:
        files = glob.glob(os.path.join('media/temp/*'))
    count = 0
    for f in files:
        if "temp" in f:
            os.remove(f)
            count += 1
    messages.success(request, str(count)+' Temporary File(s) removed')
    reload_classifier_list()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER','/'))

#################################
# Clean Street View Saved Images #
@user_passes_test(is_admin, login_url=login_url)
def cleanTempStreetView(request):
    files = []
    if not os.path.exists(os.path.join('media/street_view_images/')):
        files = glob.glob(os.environ.get('PROJECT_FOLDER','') + '/media/street_view_images/*')
    else:
        files = glob.glob(os.path.join('media/street_view_images/*'))
    count = 0
    for f in files:
        if "street_view_images" in f:
            os.remove(f)
            count += 1
    messages.success(request, str(count)+' Saved Street View Images removed')
    return HttpResponseRedirect(request.META.get('HTTP_REFERER','/'))

#########################
# Count Total Image Files #
@user_passes_test(is_admin, login_url=login_url)
def countImage(request):
    files = []
    if not os.path.exists(os.path.join('media/image/*')):
        files = glob.glob(os.environ.get('PROJECT_FOLDER','') + '/media/image/*')
    else:
        files = glob.glob(os.path.join('media/image/*'))
    count = 0
    for f in files:
        count += 1
    messages.success(request, str(count)+' Image File(s) exists in total')
    return HttpResponseRedirect(request.META.get('HTTP_REFERER','/'))

##########################
# Dump JSON of all Image #
@user_passes_test(is_admin, login_url=login_url)
def dumpImage(request):
    try:
        images = Image.objects.order_by('-created_at').all().prefetch_related('image_files')
        # messages.success(request, 'Image & Image File data dumped')
        data = {'data': [], 'status': 'success', 'dumped_at': datetime.today().strftime('%Y-%m-%d-%H:%M:%S'), 'dumped_by': request.user.full_name}
        for i in images:
            this_image = {
                'id': str(i.id),
                'title': str(i.title),
                'description': str(i.description),
                'user_id': str(i.user.id),
                'user_name': str(i.user.full_name),
                'lat': str(i.lat),
                'lng': str(i.lng),
                'created_at': str(i.created_at),
                'updated_at': str(i.updated_at),
                'image_files': [],
            }
            for j in i.image_files.all():
                this_image['image_files'] = this_image['image_files'] + [{
                    'file': 'http://'+request.get_host()+str(j.file.url),
                    'tested': str(j.tested).lower(),
                    'result': str(j.result),
                    'score': str(j.score),
                    'object_type': str(j.object_type),
                    'retrained': str(j.retrained).lower(),
                    'verified': str(j.verified).lower(),
                    'created_at': str(j.created_at),
                    'updated_at': str(j.updated_at),
                }]

            data['data'] = data['data'] + [this_image]
            # print(data)
        response = HttpResponse(json.dumps(data, indent=4), content_type="application/json")
        response['Content-Disposition'] = 'attachment; filename=' + 'image_and_image_files_dump_' + datetime.today().strftime('%Y-%m-%d-%H:%M:%S') + '.json'
        return response
        # return JsonResponse(data, safe=True)
    except Exception as e:
        print(e)
        messages.error(request,'Failed to Dump & Download Image and Image File Data')
        return HttpResponseRedirect(request.META.get('HTTP_REFERER','/'))


#######
# API #
#######

# Images API
class ImageView(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    # permission_classes = [IsAdminUser]

    # TO LIMIT WHAT USER CAN DO - EDIT,SEE,DELETE
    def get_queryset(self):
        if(self.request.user.is_authenticated and self.request.user.is_admin):
            return Image.objects.all()
        projects = Projects.objects.filter(users__id=self.request.user.id)
        return Image.objects.filter(Q(user_id=self.request.user.id) | Q(project__in=projects)).order_by('-created_at').distinct()

    # TO LIMIT PERMISSION - I CREATED CUSTOM PERMISSION IN main/authorization.py
    # Files contains checker for Authorization as well as passes test
    # def get_permissions(self):
    #     if self.action == 'list':
    #         self.permission_classes = [HasAdminPermission, ]
    #     elif self.action == 'retrieve':
    #         self.permission_classes = [HasAdminPermission]
    #     return super(self.__class__, self).get_permissions()

    def destroy(self, request, *args, **kwargs):
        image = self.get_object()
        for i in image.image_files.all():
            i.file.delete()
            i.delete()
        return super().destroy(request, *args, **kwargs)

class VideoFrameView(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = VideoFrameSerializer
    http_method_names = ['post', 'head', 'options']

    def get_queryset(self):
        if(self.request.user.is_authenticated and self.request.user.is_admin):
            return Image.objects.all()
        return Image.objects.filter(user_id=self.request.user.id)

    def destroy(self, request, *args, **kwargs):
        image = self.get_object()
        for i in image.image_files.all():
            i.file.delete()
            i.delete()
        return super().destroy(request, *args, **kwargs)

class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    http_method_names = ['post','options','patch','get']
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        if(self.request.method == "POST"):
            return User.objects.exclude(active__in=[True,False])
        return User.objects.filter(id=self.request.user.id)

    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [HasAdminPermission]
        elif self.action == 'retrieve':
            self.permission_classes = [IsAuthenticated]
        elif self.action == 'create':
            self.permission_classes = [HasGuestPermission]
        elif self.action == 'update':
            self.permission_classes = [IsAuthenticated]
        elif self.action == 'partial_update':
            self.permission_classes = [IsAuthenticated]
        elif self.action == 'destroy':
            self.permission_classes = [IsAuthenticated]
        return super(self.__class__, self).get_permissions()

class ProfileView(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.all()
    http_method_names = ['get']
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

    def list(self, request, *args, **kwargs):
        user = get_object_or_404(User, pk=self.request.user.id)
        return Response({
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "user_type": user.user_type,
            "image": request.scheme + '://' + request.META['HTTP_HOST'] + user.image.url,
            "projects": user.get_project_json()
        })
