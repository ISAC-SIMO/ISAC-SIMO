import base64
import json
import os
import uuid
import filetype
from importlib import reload
from zipfile import ZipFile

import requests
from django.conf import settings
from watson_developer_cloud import VisualRecognitionV3
from PIL import Image
import isac_simo.classifier_list as classifier_list

def reload_classifier_list():
    try:
        reload(classifier_list)
    except Exception as e:
        print('--------- [ERROR] FAILED TO RELOAD CLASSIFIER LIST MODULE [ERROR:OOPS] --------')

###################
## Detect Object ##
###################
def detect_image(image_file):
    # Find Image Path (used to open)
    file_url = str(os.path.abspath(os.path.dirname(__name__))) + image_file.file.url
    if not os.path.exists(file_url):
        file_url = os.environ.get('PROJECT_FOLDER','') + image_file.file.url
    
    # IF OS Path to Image exists + IBM KEY is provided + classifier list exists
    print('Detecting Image Object...')
    if os.path.exists(file_url) and settings.IBM_API_KEY and classifier_list.detect_object_model_id:
        # Authenticate the IBM Watson API
        api_token = str(settings.IBM_API_KEY)
        post_data = {'collection_ids': classifier_list.detect_object_model_id, 'threshold': '0.6', 'features':'objects'}
        auth_base = 'Basic '+str(base64.b64encode(bytes('apikey:'+api_token, 'utf-8')).decode('utf-8'))
        print(auth_base)

        post_header = {'Accept':'application/json','Authorization':auth_base}
        
        # Temporary Resized Image (basewidth x calcheight)(save_to_path from param comes if looped through)
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
        response = requests.post('https://gateway.watsonplatform.net/visual-recognition/api/v4/analyze?version=2019-02-11', files=post_files, headers=post_header, data=post_data)
        status = response.status_code
        try:
            content = response.json()
        except ValueError:
            # IBM Response is BAD
            print('IBM Response was BAD (During Detect) - (e.g. image too large)')
            return False
        
        print(status)
        print(content)
        # If success save the data
        if(status == 200 or status == '200' or status == 201 or status == '201'):
            if "collections" in content['images'][0]['objects']:
                if(content['images'][0]['objects']['collections'][0]['objects']):
                    sorted_by_score = sorted(content['images'][0]['objects']['collections'][0]['objects'], key=lambda k: k['score'], reverse=True)
                    print(sorted_by_score)
                    if(sorted_by_score and sorted_by_score[0]): # Set Score
                        image_file.object_type = sorted_by_score[0]['object']
                        image_file.save()
                        print(sorted_by_score[0]['object'])
                        resized_image_open.close()
                        
                        # Return Object detected type
                        return {
                            'object_type': sorted_by_score[0]['object'].lower(),
                            'image_file': image_file,
                            'temp_image': saveto,
                        }
        
        resized_image_open.close()
        os.remove(saveto)
        print('Object Detect False, either bad response, no index, bad format array, sorted score empty etc.')
        return False
    else:
        os.remove(saveto)
        print('FAILED TO Detect Object - Check Token, Object Detect Model id and file existence.')
        return False

####################
### CALL AI TEST ###
####################
# Default on 1st Image Test check Classifier Ids 1
# If result is nogo/nogos then run test again with classifier ids 2
def test_image(image_file, title=None, description=None, save_to_path=None, classifier_index=0, detected_as=None):
    if not detected_as:
        detected_as = detect_image(image_file)
    
    if not detected_as:
        if save_to_path:
            os.remove(save_to_path)
        return False
    
    object_type = detected_as.get('object_type')
    image_file = detected_as.get('image_file')
    save_to_path = detected_as.get('temp_image')
    
    print('Trying ' + str(classifier_index) + ' No. Classifier for ' + object_type)
    # IF OS Path to Image exists + IBM KEY is provided + classifier list exists
    if ( os.path.exists(save_to_path) and settings.IBM_API_KEY 
        and classifier_index < len(classifier_list.data().get(object_type,[]))
        and classifier_list.data().get(object_type)[classifier_index] ):

        # Authenticate the IBM Watson API
        api_token = str(settings.IBM_API_KEY)
        classifier_ids = classifier_list.data().get(object_type)[classifier_index]
        post_data = {'classifier_ids': classifier_ids, 'threshold': '0.6'}
        auth_base = 'Basic '+str(base64.b64encode(bytes('apikey:'+api_token, 'utf-8')).decode('utf-8'))
        print(auth_base)

        post_header = {'Accept':'application/json','Authorization':auth_base}
        
        # Open the Temporarily Resized Image (save_to_path from param comes if looped through - NOTE: now comes from detected_at directly)
        if save_to_path: # Comes from param on next recursion
            resized_image_open = open(save_to_path, 'rb')
        
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
                # NOTE: later classifier_list.py shall contain the recursion_list to hold results that might require re test
                # e.g. if recursion_list.get('wall',[]) has nogo/nogos etc. then retest it etc...
                if sorted_by_score[0]['class'].lower() == 'nogo' or sorted_by_score[0]['class'].lower() == 'nogos':
                    if classifier_index + 1 < len(classifier_list.data().get(object_type,[])):
                        print('NOGOS CLASS - PASSING THROUGH NEW MODEL CLASSIFIER #'+str(classifier_index + 1))
                        test_image(image_file, title, description, save_to_path, classifier_index + 1, detected_as) #save_to_path=temp file

                if(classifier_index <= 0):
                    resized_image_open.close()
                    os.remove(save_to_path)
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

#################################################
# ZIP and Pass Images to IBM watson for re-training
# Funcion receives the image file list, object(wall,rebar,etc.) and result(go,nogo,etc.)
def retrain_image(image_file_list, object_type, result, media_folder='image', classifier=None):
    zipObj = None
    zipPath = None
    try:
        # ZIP THE IMAGES #
        filename = '{}.{}'.format(uuid.uuid4().hex, 'zip')
        zipPath = os.path.join('media/temp/', filename)
        zipObj = ZipFile(zipPath, 'w')
        # Add multiple files to the zip
        for image_file in image_file_list:
            zipObj.write(os.path.join(settings.BASE_DIR ,settings.MEDIA_ROOT,media_folder,os.path.basename(image_file)), os.path.basename(image_file))
        # close the Zip File
        zipObj.close()
    except Exception as e:
        print(e)
        if zipObj and zipPath:
            zipObj.close()
            os.remove(zipPath)
        return False
    
    zipObj.close()
    # IF OS Path to Image exists + IBM KEY is provided + classifier list exists
    if ( os.path.exists(zipPath) and settings.IBM_API_KEY 
        and classifier_list.data().get(object_type,False) ):

        # Authenticate the IBM Watson API
        api_token = str(settings.IBM_API_KEY)
        auth_base = 'Basic '+str(base64.b64encode(bytes('apikey:'+api_token, 'utf-8')).decode('utf-8'))
        print(auth_base)
        post_header = {'Accept':'application/json','Authorization':auth_base}
        zipObj = open(zipPath, 'rb')
        post_files = {}

        if result.lower() == 'negative':
            post_files = {
                'negative_examples': zipObj,
            }
        else:
            post_files = {
                result+'_positive_examples': zipObj,
            }

        passed = 0

        for classifier_ids in classifier_list.data().get(object_type,[]):
            # Check if specific classifier to re-train on (and continue if not equal to it)
            if(classifier and classifier != 'all'):
                if(classifier_ids != classifier):
                    continue

            # Call the API
            response = requests.post('https://gateway.watsonplatform.net/visual-recognition/api/v3/classifiers/'+classifier_ids+'?version=2018-03-19', files=post_files, headers=post_header)
            status = response.status_code
            try:
                content = response.json()
            except ValueError:
                # IBM Response is BAD
                print('IBM Response was BAD - (e.g. zip might be too large)')
            
            print(status)
            print(content)
            # If success save the data
            if(status == 200 or status == '200' or status == 201 or status == '201'):
                passed += 1
        
        zipObj.close()
        os.remove(zipPath)
        if(passed > 0):
            return True
        else:
            return False
    else:
        print('FAILED TO TEST - Check Token, Classifier ids and file existence.')
        return False

#################################################
# Create New classifier
# User uploades proper zip file with classifier name
def create_classifier(zip_file_list, negative_zip=False, name=False, object_type=False):
    # IF IBM KEY is provided (also check zip_file_list is ok)
    if ( settings.IBM_API_KEY and zip_file_list and name and object_type ):
        # Authenticate the IBM Watson API
        api_token = str(settings.IBM_API_KEY)
        auth_base = 'Basic '+str(base64.b64encode(bytes('apikey:'+api_token, 'utf-8')).decode('utf-8'))
        print(auth_base)
        post_header = {'Accept':'application/json','Authorization':auth_base}
        post_files = {}
        bad_zip = 0

        for zip_file in zip_file_list:
            kind = filetype.guess(zip_file)
            if kind is None or kind.extension != 'zip' :
                print(kind.extension)
                print('Cannot guess file type or is not a ZIP file!')
                bad_zip += 1
            else:
                if not zip_file.name:
                    print('Zip file has no name, weird but true!')
                    bad_zip += 1
                else:
                    x = open(zip_file.temporary_file_path(), 'rb')
                    post_files[zip_file.name.replace('.zip','')+'_positive_examples'] = x
        
        print(post_files)

        if negative_zip:
            x = open(negative_zip.temporary_file_path(), 'rb')
            post_files['negative_examples'] = x

        print(post_files)

        post_data = {'name': name}

        # Call the API
        response = requests.post('https://gateway.watsonplatform.net/visual-recognition/api/v3/classifiers?version=2018-03-19', files=post_files, headers=post_header, data=post_data)
        status = response.status_code
        try:
            content = response.json()
        except ValueError:
            # IBM Response is BAD
            print('IBM Response was BAD - (e.g. zip might be too large or similar problem)')
        
        print(status)
        print(content)
        # If success save the data
        if(status == 200 or status == '200' or status == 201 or status == '201'):
            reload_classifier_list()
            return {'data': content, 'bad_zip': bad_zip}
        
        return False
    else:
        print('FAILED TO TEST - Check Token, Classifier Name, Zip files etc. exists or not')
        return False

# Fetch Classifier Details #
def classifier_detail(object_type, model):
    # IF IBM KEY is provided + classifier list exists
    if ( settings.IBM_API_KEY 
        and classifier_list.data().get(object_type,False) and model ):

        # Authenticate the IBM Watson API
        api_token = str(settings.IBM_API_KEY)
        auth_base = 'Basic '+str(base64.b64encode(bytes('apikey:'+api_token, 'utf-8')).decode('utf-8'))
        print(auth_base)
        post_header = {'Accept':'application/json','Authorization':auth_base}

        # Call the API
        response = requests.get('https://gateway.watsonplatform.net/visual-recognition/api/v3/classifiers/'+model+'?version=2018-03-19', headers=post_header)
        status = response.status_code
        try:
            content = response.json()
        except ValueError:
            # IBM Response is BAD
            print('IBM Response was BAD')
        
        print(status)
        print(content)
        # If success save the data
        if(status == 200 or status == '200' or status == 201 or status == '201'):
            return content
        else:
            return False

# Fetch Object Detection Metadata Details #
def object_detail():
    # IF IBM KEY is provided + classifier list exists
    if ( settings.IBM_API_KEY 
        and classifier_list.detect_object_model_id ):

        # Authenticate the IBM Watson API
        api_token = str(settings.IBM_API_KEY)
        auth_base = 'Basic '+str(base64.b64encode(bytes('apikey:'+api_token, 'utf-8')).decode('utf-8'))
        print(auth_base)
        post_header = {'Accept':'application/json','Authorization':auth_base}
        content = {}

        # Call the API
        response = requests.get('https://gateway.watsonplatform.net/visual-recognition/api/v4/collections/'+classifier_list.detect_object_model_id+'?version=2019-02-11', headers=post_header)
        status = response.status_code
        try:
            content.update(response.json())
        except ValueError:
            # IBM Response is BAD
            print('IBM Response was BAD for collection info')

        # Call the API
        response = requests.get('https://gateway.watsonplatform.net/visual-recognition/api/v4/collections/'+classifier_list.detect_object_model_id+'/objects?version=2019-02-11', headers=post_header)
        status = response.status_code
        try:
            content.update(response.json())
        except ValueError:
            # IBM Response is BAD
            print('IBM Response was BAD for objects')

        # Call the API for Images
        # response = requests.get('https://gateway.watsonplatform.net/visual-recognition/api/v4/collections/'+classifier_list.detect_object_model_id+'/images?version=2019-02-11', headers=post_header)
        # status = response.status_code
        # try:
        #     content.update(response.json())
        # except ValueError:
        #     # IBM Response is BAD
        #     print('IBM Response was BAD for images')
        
        print(status)
        print(content)

        # If success save the data
        if(status == 200 or status == '200' or status == 201 or status == '201'):
            return content
            
    return False