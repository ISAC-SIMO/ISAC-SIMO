import base64
import json
import os

import requests
from django.conf import settings
from watson_developer_cloud import VisualRecognitionV3


####################
### CALL AI TEST ###
####################
def test_image(image_file, title=None, description=None):
    file_url = str(os.path.abspath(os.path.dirname(__name__))) + image_file.file.url
    if not os.path.exists(file_url):
        file_url = os.environ.get('PROJECT_FOLDER','') + image_file.file.url
    
    if os.path.exists(file_url) and settings.IBM_TOKEN and settings.CLASSIFIER_IDS:
        # post_data = {'title': title, 'description': description}
        # post_header = {'X-Do-Not-Track':'true'}
        # post_files = {
        #     'file': open(file_url, 'rb'),
        # }
        # response = requests.post('https://httpbin.org/anything', files=post_files, headers=post_header, data=post_data)
        # status = response.status_code
        # content = response.json()
        # print(status)
        # print(content)
        # # print(response.headers['date'])
        # # print(response.headers)
        # # print(response.request.body)
        # # print(type(response.headers))
        # if(status == 200 or status == '200' or status == 201 or status == '201'):
        #     image_file.tested = True
        #     image_file.save()
        #     return True

        api_token = str(settings.IBM_TOKEN)
        classifier_ids = str(settings.CLASSIFIER_IDS)
        post_data = {'classifier_ids': classifier_ids, 'threshold': '0.6'}
        auth_base = 'Basic '+str(base64.b64encode(bytes('apikey:'+api_token, 'utf-8')).decode('utf-8'))
        print(auth_base)
        post_header = {'Accept':'application/json','Authorization':auth_base}
        post_files = {
            'images_file': open(file_url, 'rb'),
        }
        response = requests.post('https://gateway.watsonplatform.net/visual-recognition/api/v3/classify?version=2018-03-19', files=post_files, headers=post_header, data=post_data)
        status = response.status_code
        content = response.json()
        print(status)
        print(content)
        if(status == 200 or status == '200' or status == 201 or status == '201'):
            if(content['images'][0]['classifiers'][0]['classes']):
                sorted_by_score = sorted(content['images'][0]['classifiers'][0]['classes'], key=lambda k: k['score'], reverse=True)
                print(sorted_by_score)
                if(sorted_by_score and sorted_by_score[0]): # Set Score
                    image_file.score = sorted_by_score[0]['score']
                if(sorted_by_score and sorted_by_score[0]): # Set Result/Class
                    image_file.result = sorted_by_score[0]['class']
                image_file.tested = True
                image_file.save()
                return True

        # visual_recognition = VisualRecognitionV3(
        #     '2018-03-19',
        #     iam_apikey='KEY_GOES_HERE'
        # )

        # with open(file_url, 'rb') as images_file:
        #     classes = visual_recognition.classify(
        #         images_file,
        #         threshold='0.6',
        #     classifier_ids='food').get_result()
        # print(type(classes))
        # print(classes['images'][0]['classifiers'][0]['classes'][0]['class'])
        # print(classes['images'][0]['classifiers'][0]['classes'][0]['score'])
        # print(json.dumps(classes, indent=2))

        # if classes:
        #     image_file.tested = True
        #     image_file.save()
        #     return True
    else:
        print('FAILED TO TEST - Check Token, Classifier ids and file existence.')
        return False
