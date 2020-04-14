import io
import json
import os
import uuid
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