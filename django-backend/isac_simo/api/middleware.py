import os

from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.template.loader import get_template
from django.template.response import SimpleTemplateResponse

class MaintenanceMode(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if (hasattr(settings, 'MAINTENANACE') and settings.MAINTENANACE) or ("MAINTENANACE" in os.environ and os.getenv('MAINTENANACE') == 'True'):
            if '/api/' in str(request.build_absolute_uri()):
                return JsonResponse({'status':'false','message':'Maintenance Mode is active. Try later.'}, status=503)
            else:
                return SimpleTemplateResponse(get_template('master/maintenance.html'), status=503)

        return self.get_response(request)

    def process_exception(self, request, exception):
        return HttpResponse("in exception")
