import base64
import json
import os
import uuid

import requests
from django.conf import settings
from watson_developer_cloud import VisualRecognitionV3
from PIL import Image
from isac_simo.classifier_list import classifier_list

####################
### CALL AI TEST ###
####################
# Default on 1st Image Test check Classifier Ids 1
# If result is nogo/nogos then run test again with classifier ids 2
def test_image(image_file, title=None, description=None, save_to_path=None, classifier_index=0):
    # Find Image Path (used to open)
    file_url = str(os.path.abspath(os.path.dirname(__name__))) + image_file.file.url
    if not os.path.exists(file_url):
        file_url = os.environ.get('PROJECT_FOLDER','') + image_file.file.url
    
    print(str(classifier_index) + ' Classifier')
    # IF OS Path to Image exists + IBM KEY is provided + classifier list exists
    if os.path.exists(file_url) and settings.IBM_API_KEY and classifier_index < len(classifier_list) and classifier_list[classifier_index]:
        # Authenticate the IBM Watson API
        api_token = str(settings.IBM_API_KEY)
        classifier_ids = classifier_list[classifier_index]
        post_data = {'classifier_ids': classifier_ids, 'threshold': '0.6'}
        auth_base = 'Basic '+str(base64.b64encode(bytes('apikey:'+api_token, 'utf-8')).decode('utf-8'))
        print(auth_base)

        post_header = {'Accept':'application/json','Authorization':auth_base}
        
        # Temporary Resized Image (basewidth x calcheight)(save_to_path from param comes if looped through)
        if save_to_path: # Comes from param on next recursion
            resized_image_open = open(save_to_path, 'rb')
        else:
            basewidth = 300
            temp = Image.open(file_url)
            wpercent = (basewidth/float(temp.size[0]))
            hsize = int((float(temp.size[1])*float(wpercent)))
            temp = temp.resize((basewidth,hsize), Image.ANTIALIAS)
            ext = image_file.file.url.split('.')[-1]
            filename = '{}.{}'.format(uuid.uuid4().hex, ext)
            saveto = os.path.join('media/temp/', filename)
            temp.save(saveto)
            resized_image_open = open(saveto, 'rb')
        
        post_files = {
            'images_file': resized_image_open,
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

                # If nogo/nogos then run with next model pipe lopping through available classifier list
                if sorted_by_score[0]['class'].lower() == 'nogo' or sorted_by_score[0]['class'].lower() == 'nogos':
                    if classifier_index + 1 < len(classifier_list):
                        print('NOGOS CLASS - PASSING THROUGH NEW MODEL CLASSIFIER #'+str(classifier_index + 1))
                        test_image(image_file, title, description, saveto, classifier_index + 1) #saveto=temp file

                if(classifier_index <= 0):
                    resized_image_open.close()
                    os.remove(saveto)
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
