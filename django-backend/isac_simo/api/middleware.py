import os

from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.template.loader import get_template
from django.template.response import SimpleTemplateResponse
import datetime

class MaintenanceMode(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if (hasattr(settings, 'MAINTENANCE') and settings.MAINTENANCE) or ("MAINTENANCE" in os.environ and os.getenv('MAINTENANCE') == 'True'):
            if '/api/' in str(request.build_absolute_uri()):
                return JsonResponse({'status':'false','message':'Maintenance Mode is active. Try later.','time':datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}, status=503)
            else:
                return SimpleTemplateResponse(get_template('master/maintenance.html'), status=503)

        return self.get_response(request)

    # To ignore and throw default exception for any errpr
    # def process_exception(self, request, exception):
    #     return HttpResponse(exception)
