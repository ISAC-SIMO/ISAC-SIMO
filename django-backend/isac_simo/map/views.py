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
        return render(request, 'check.html', {'GOOGLE_MAP_STREET_API':GOOGLE_MAP_STREET_API,'PROJECT_FOLDER':PROJECT_FOLDER,'GOOGLE_MAP_API':GOOGLE_MAP_API})
    elif request.method == "POST":
        redirect('dashboard')
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
        
        latlngList = [x.strip() for x in latlng.split(',')]
        panoids = streetview.panoids(lat=latlngList[0], lon=latlngList[1])
        print(panoids)
        for pano in panoids:
            # IF panoroma is older then 2015 ignore it
            if pano.get('year', False) and pano.get('year') < 2015:
                continue
            
            # GET ALL Tiles images info
            # print(streetview.tiles_info(pano.get('panoid')))
            
            # heading recommendation: 0, 90, 180, or 270
            file = streetview.api_download(pano.get('panoid'), 0, saveto, settings.GOOGLE_MAP_STREET_API, year=pano.get('year','now'))
            if file:
                filelist.append(file)

        return JsonResponse({'status':'ok','message':'Images Saved','data':filelist}, status=200)
    else:
        return JsonResponse({'status':'error','message':'Invalid Request'}, status=404)

# ADMIN TEST IMAGES saved from streetview
@user_passes_test(is_admin, login_url=login_url)
def test(request):
    images = request.POST.get('image_list', False)
    if not images:
        return JsonResponse({'status':'error','message':'No Saved Images Found'}, status=404)

    image_list = json.loads(images)
    data = []
    print(image_list)
    for image in image_list:
        response = test_temp_images(image)
        if not response:
            data.append({
                'image': image,
                'result': '',
                'score': ''
            })
        else:
            data.append({
                'image': image,
                'result': response.get('result',''),
                'score': response.get('score','')
            })
    
    print(data)
    return JsonResponse({'status':'ok','message':'Tested','data':data}, safe=True)