import io
import json
import os
import uuid
import streetview
from datetime import datetime
from http.client import HTTPResponse
from importlib import reload

from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import HttpResponse, HttpResponseRedirect
from django.http.response import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from requests_toolbelt import user_agent

import isac_simo.classifier_list as classifier_list
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
        return render(request, 'check.html')
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
        if not os.path.exists(os.path.join('media/temp')):
            saveto = os.environ.get('PROJECT_FOLDER','') + '/media/temp'
        else:
            saveto = os.path.join('media/temp')

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
            file = streetview.api_download(pano.get('panoid'), 0, saveto, '', year=pano.get('year','now'))
            if file:
                filelist.append(file)

        return JsonResponse({'status':'ok','message':'Images Saved','data':filelist}, status=200)
    else:
        return JsonResponse({'status':'error','message':'Invalid Request'}, status=404)