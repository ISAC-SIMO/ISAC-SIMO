import base64
import json
import os

import requests
from django.conf import settings
from watson_developer_cloud import VisualRecognitionV3


####################
### CALL AI TEST ###
####################
# Default on 1st Image Test check Classifier Ids 1
# If result is nogo/nogos then run test again with classifier ids 2
def test_image(image_file, title=None, description=None, model='CLASSIFIER_IDS'):
    file_url = str(os.path.abspath(os.path.dirname(__name__))) + image_file.file.url
    if not os.path.exists(file_url):
        file_url = os.environ.get('PROJECT_FOLDER','') + image_file.file.url
    
    print(getattr(settings, model, '-- No CLASSIFIER ID --'))
    if os.path.exists(file_url) and settings.IBM_API_KEY and getattr(settings, model, False):
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

        # Authenticate the IBM Watson API
        api_token = str(settings.IBM_API_KEY)
        classifier_ids = str(getattr(settings, model, ''))
        post_data = {'classifier_ids': classifier_ids, 'threshold': '0.6'}
        auth_base = 'Basic '+str(base64.b64encode(bytes('apikey:'+api_token, 'utf-8')).decode('utf-8'))
        print(auth_base)
        post_header = {'Accept':'application/json','Authorization':auth_base}
        post_files = {
            'images_file': open(file_url, 'rb'),
        }
        # Call the API
        response = requests.post('https://gateway.watsonplatform.net/visual-recognition/api/v3/classify?version=2018-03-19', files=post_files, headers=post_header, data=post_data)
        status = response.status_code
        try:
            content = response.json()
        except ValueError:
            # IBM Response is BAD
            print('IBM Response was BAD - (e.g. image too large)')
            return False
        
        print(status)
        print(content)
        # If success save the data
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

                # If nogo/nogos then run with next model pipe (2)
                if sorted_by_score[0]['class'].lower() == 'nogo' or sorted_by_score[0]['class'].lower() == 'nogos':
                    if model != 'CLASSIFIER_IDS_2':
                        print('NOGOS CLASS - PASSING THROUGH NEW MODEL CLASSIFIER #2')
                        return test_image(image_file, title, description, 'CLASSIFIER_IDS_2')

                # Other pipe tests append here (before return True)

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
