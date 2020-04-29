import io
import json
import os
import uuid
from datetime import datetime
from http.client import HTTPResponse
from importlib import reload

import streetview
from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import HttpResponse, HttpResponseRedirect
from django.http.response import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from requests_toolbelt import user_agent

import isac_simo.classifier_list as classifier_list
from api.helpers import test_temp_images
from main import authorization
from main.authorization import *
from main.models import User
from projects.models import Projects
from api.models import Classifier, OfflineModel


def reload_classifier_list():
    try:
        reload(classifier_list)
    except Exception as e:
        print('--------- [ERROR] FAILED TO RELOAD CLASSIFIER LIST MODULE [ERROR:OOPS] --------')

# ADMIN MAP CHECK
@user_passes_test(is_admin, login_url=login_url)
def check(request):
    if request.method == "GET":
        GOOGLE_MAP_STREET_API = settings.GOOGLE_MAP_STREET_API
        GOOGLE_MAP_API = settings.GOOGLE_MAP_API
        PROJECT_FOLDER = os.environ.get('PROJECT_FOLDER','')
        default_object_model = classifier_list.detect_object_model_id
        projects = Projects.objects.all().values('detect_model','project_name','id','offline_model').distinct()
        return render(request, 'check.html', {
            'GOOGLE_MAP_STREET_API':GOOGLE_MAP_STREET_API,'PROJECT_FOLDER':PROJECT_FOLDER,'GOOGLE_MAP_API':GOOGLE_MAP_API,
            'default_object_model':default_object_model,'projects':projects
        })
    else:
        messages.error(request, 'Invalid Map Request')
        redirect('dasboard')

# API TO FETCH (PUBLIC / NO AUTH)
@login_required
def fetch(request):
    if request.method == "POST":
        latlng = request.POST.get('latlng', False)

        if not latlng:
            return JsonResponse({'status':'error','message':'Latitude, Longitude Not Provided Properly'}, status=404)

        if not settings.GOOGLE_MAP_STREET_API:
            print("NO GOOGLE MAP STREET API IN SERVER")
            return JsonResponse({'status':'error','message':'No Google Map API Available'}, status=404)
        
        saveto = None
        if not os.path.exists(os.path.join('media/street_view_images')):
            saveto = os.environ.get('PROJECT_FOLDER','') + '/media/street_view_images'
        else:
            saveto = os.path.join('media/street_view_images')

        filelist = []
        latlngList = []
        panoFileLatLngList = []
        panoIdsList = []
        
        try:
            # If Map Polygon points array arrives
            latlngList = json.loads(latlng)
        except Exception as e:
            # If Point of string lat,lng arrives
            latlngList = [x.strip() for x in latlng.split(',')]
            latlngList = [{"lat":latlngList[0], "lng":latlngList[1]}]
        
        count = 0
        max_fetch = 200
        if settings.DEBUG:
            max_fetch = 5

        for coords in latlngList:
            if not coords.get('lat', False) or not coords.get('lng', False):
                continue # If lat, lng does not exists some how
            print('Trying to fetch streetview image at: ' + str(coords.get('lat')) + ',' + str(coords.get('lng')))

            if (count > max_fetch):
                break

            panoids = streetview.panoids(lat=str(coords.get('lat')), lon=str(coords.get('lng')))
            # print(panoids)
            for pano in panoids:
                if (count < max_fetch):
                    # IF panoroma is older then 2018 ignore it
                    if pano.get('year', False) and pano.get('year') < 2018:
                        continue

                    if pano.get('panoid') in panoIdsList:
                        continue

                    panoIdsList = panoIdsList + [pano.get('panoid')]
                    
                    # GET ALL Tiles images info
                    # print(streetview.tiles_info(pano.get('panoid')))
                    
                    # heading recommendation: 0, 90, 180, or 270
                    for heading in [30, 220, 0, 90, 180, 270]:
                        file = None
                        try:
                            file = streetview.api_download(pano.get('panoid'), heading, saveto, settings.GOOGLE_MAP_STREET_API, year=pano.get('year','now'))
                        except Exception as e:
                            print('Failed to download this streetview image')

                        if file:
                            filelist.append(file)
                            panoFileLatLngList.append(str(pano.get('lat'))+','+str(pano.get('lon')))
                            count += 1
                else:
                    messages.info(request, 'Max Street View Images ('+str(max_fetch)+') was fetched earlier.')
                    break

        return JsonResponse({'status':'ok','message':'Images Saved','data':filelist,'coords':panoFileLatLngList}, status=200)
    else:
        return JsonResponse({'status':'error','message':'Invalid Request'}, status=404)

# ADMIN TEST IMAGES saved from streetview
@user_passes_test(is_admin, login_url=login_url)
def test(request):
    images = request.POST.get('image_list', False)
    detect_model = request.POST.get('detect_model', None)
    project = request.POST.get('project', False)
    if not images:
        return JsonResponse({'status':'error','message':'No Saved Images Found'}, status=404)

    if not project:
        return JsonResponse({'status':'error','message':'Unable to verify project'}, status=404)

    image_list = json.loads(images)
    data = []
    offline = False
    # print(image_list)
    project = Projects.objects.filter(id=request.POST.get('project')).get()
    try:
        offline_model = OfflineModel.objects.filter(id=detect_model).get()
        if offline_model:
            offline = True
            detect_model = offline_model
    except:
        offline = False
    
    for image in image_list:
        response = test_temp_images(image, detect_model=detect_model, project=project.unique_name(), offline=offline)
        if not response:
            data.append({
                'image': image,
                'result': '',
                'score': '',
                'pipeline_status': {}
            })
        else:
            data.append({
                'image': image,
                'result': response.get('result',''),
                'score': response.get('score',''),
                'pipeline_status': response.get('pipeline_status',{})
            })
    
    # print(data)
    return JsonResponse({'status':'ok','message':'Tested','data':data}, safe=True)