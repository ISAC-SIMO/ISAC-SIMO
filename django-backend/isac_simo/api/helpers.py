import base64
import json
import os
import uuid
from importlib import reload
from zipfile import ZipFile

import filetype
import requests
from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image
from watson_developer_cloud import VisualRecognitionV3

import isac_simo.classifier_list as classifier_list
import cv2
import pathlib
import numpy as np
import random


def reload_classifier_list():
    try:
        reload(classifier_list)
    except Exception as e:
        print('--------- [ERROR] FAILED TO RELOAD CLASSIFIER LIST MODULE [ERROR:OOPS] --------')

def transform_image(img, ext, saveto, rotate, warp, inverse):
    all_unzipped_images_list = []
    # 0 = horizontal
    # 1 = vertical
    # -1 = both way aka inverse or mirror
    print('TRANSFORMING IMAGES---')
    for i in [0,1,-1]:
        t_image = cv2.flip( img, i )
        filename = '{}{}'.format(uuid.uuid4().hex, ext)
        cv2.imwrite(saveto + filename, t_image) # save frame as IMAGE file
        all_unzipped_images_list.append(saveto + filename) # add image to array (transformed)
    
    if rotate:
        print('ROTATING IMAGES---')
        for i in [30,60,-60,120]: # Rotate in these angles
            (h, w) = img.shape[:2]
            center = (w / 2, h / 2)
            # Perform the rotation
            M = cv2.getRotationMatrix2D(center, i, 1.0)
            rotated = cv2.warpAffine(img, M, (w, h), borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0)) # borderMode=cv2.BORDER_TRANSPARENT
            filename = '{}{}'.format(uuid.uuid4().hex, ext)
            cv2.imwrite(saveto + filename, rotated) # save frame as IMAGE file
            all_unzipped_images_list.append(saveto + filename) # add image to array (rotated)

    if warp:
        print('WARPING IMAGES---')
        h, w = img.shape[:2]
        rows, cols = img.shape[:2]
        src_points = np.float32([[0,0], [w-1,0], [0,h-1], [w-1,h-1]])
        des_points = np.float32([[0,0], [w-1,0], [0,h-1], [w-1,h-1]])
        for j in ['t','l','r','b']:
            if j == 't':
                des_points = np.float32([[1,0], [w-1,0], [int(0.2*w),h-1], [w-int(0.2*w),h-1]])
            elif j == 'l':
                des_points = np.float32([[0,0], [w-10,int(0.2*h)], [0,h], [w-10,h-int(0.2*h)]])
            elif j == 'r':
                des_points = np.float32([[10,int(0.20*h)], [w,0], [10,h-int(0.20*w)], [w,h]])
            elif j == 'b':
                des_points = np.float32([[int(0.2*w),10], [w-int(0.2*w),10], [0,h], [w,h]])

            if j:
                M = cv2.getPerspectiveTransform(src_points, des_points)
                out = cv2.warpPerspective(img, M, (w,h),flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0))
                filename = '{}{}'.format(uuid.uuid4().hex, ext)
                cv2.imwrite(saveto + filename, out) # save frame as IMAGE file
                all_unzipped_images_list.append(saveto + filename) # add image to array (rotated)

    if inverse:
        print('INVERTING IMAGES---')
        inverted = ~img # simple invert matrix (uninary)
        filename = '{}{}'.format(uuid.uuid4().hex, ext)
        cv2.imwrite(saveto + filename, inverted) # save frame as IMAGE file
        all_unzipped_images_list.append(saveto + filename) # add image to array (rotated)

        print('CANNY EDGE DETECT IN IMAGES---')
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) # convert to gray-ish
        canvas = cv2.Canny(gray, 30, 100) # threshold can be changes (lower gives more detail but also noise)
        filename = '{}{}'.format(uuid.uuid4().hex, ext)
        cv2.imwrite(saveto + filename, canvas) # save frame as IMAGE file
        all_unzipped_images_list.append(saveto + filename) # add image to array (rotated)

    return all_unzipped_images_list

###################
## Detect Object ##
###################
def detect_image(image_file, detect_model):
    # Find Image Path (used to open)
    file_url = str(os.path.abspath(os.path.dirname(__name__))) + image_file.file.url
    if not os.path.exists(file_url):
        file_url = os.environ.get('PROJECT_FOLDER','') + image_file.file.url
    
    # IF OS Path to Image exists + IBM KEY is provided + classifier list exists
    print('Detecting Image Object...')
    saveto = None
    if os.path.exists(file_url) and settings.IBM_API_KEY and (classifier_list.detect_object_model_id or detect_model):
        object_id = classifier_list.detect_object_model_id
        if detect_model:
            object_id = detect_model

        # Authenticate the IBM Watson API
        api_token = str(settings.IBM_API_KEY)
        post_data = {'collection_ids': object_id, 'threshold': '0.6', 'features':'objects'}
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

        if not os.path.exists(os.path.join('media/temp/')):
            saveto = os.environ.get('PROJECT_FOLDER','') + '/media/temp/'+filename
        else:
            saveto = os.path.join('media/temp/', filename)

        print(saveto)
        
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
        if saveto:
            os.remove(saveto)
        print('FAILED TO Detect Object - Check Token, Object Detect Model id and file existence.')
        return False

####################
### CALL AI TEST ###
####################
# Default on 1st Image Test check Classifier Ids 1
# If result is nogo/nogos then run test again with classifier ids 2
def test_image(image_file, title=None, description=None, save_to_path=None, classifier_index=0, detected_as=None, detect_model=None, project=None):
    if not detected_as:
        detected_as = detect_image(image_file, detect_model)
    
    if not detected_as:
        if save_to_path:
            os.remove(save_to_path)
        return False
    
    object_type = detected_as.get('object_type')
    image_file = detected_as.get('image_file')
    save_to_path = detected_as.get('temp_image')
    
    print('Trying ' + str(classifier_index) + ' No. Classifier for ' + object_type)
    # IF OS Path to Image exists + IBM KEY is provided + classifier list exists
    check_and_get_classifier_ids = classifier_list.searchList(project,object_type,index=classifier_index)
    if ( os.path.exists(save_to_path) and settings.IBM_API_KEY 
        and classifier_index < classifier_list.lenList(project,object_type)
        and check_and_get_classifier_ids ):

        # Authenticate the IBM Watson API
        api_token = str(settings.IBM_API_KEY)
        classifier_ids = check_and_get_classifier_ids
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

                pipeline_status = {}
                try:
                    pipeline_status = json.loads(image_file.pipeline_status)
                except Exception as e:
                    pipeline_status = {}

                if(sorted_by_score and sorted_by_score[0]): # Set Score and Result/Class
                    image_file.score = sorted_by_score[0]['score']
                    image_file.result = sorted_by_score[0]['class']
                    pipeline_status[check_and_get_classifier_ids] = {
                        'score': sorted_by_score[0]['score'],
                        'result': sorted_by_score[0]['class']
                    }
                    image_file.pipeline_status = json.dumps(pipeline_status)
                
                image_file.tested = True
                image_file.save()

                # If nogo/nogos then run with next model pipe lopping through available classifier list
                # NOTE: later classifier_list.py shall contain the recursion_list to hold results that might require re test
                # e.g. if recursion_list.get('wall',[]) has nogo/nogos etc. then retest it etc...
                if sorted_by_score[0]['class'].lower() == 'nogo' or sorted_by_score[0]['class'].lower() == 'nogos':
                    if classifier_index + 1 < classifier_list.lenList(project,object_type):
                        print('NOGOS CLASS - PASSING THROUGH NEW MODEL CLASSIFIER #'+str(classifier_index + 1))
                        test_image(image_file, title, description, save_to_path, classifier_index + 1, detected_as, detect_model, project) #save_to_path=temp file
                    else:
                        print('No more Nogo pipeline')

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

def quick_test_image(image_file, classifier_ids):
    image_file_path = None
    if ( settings.IBM_API_KEY and classifier_ids and image_file):
        # Authenticate the IBM Watson API
        api_token = str(settings.IBM_API_KEY)
        post_data = {'classifier_ids': classifier_ids, 'threshold': '0.6'}
        auth_base = 'Basic '+str(base64.b64encode(bytes('apikey:'+api_token, 'utf-8')).decode('utf-8'))
        print(auth_base)

        post_header = {'Accept':'application/json','Authorization':auth_base}
        
        if type(image_file) is InMemoryUploadedFile:
            image_file_path = image_file.open()
        else:
            image_file_path = open(image_file.temporary_file_path(), 'rb')

        print(image_file_path)
        
        post_files = {
            'images_file': image_file_path,
        }

        # Call the API
        response = requests.post('https://gateway.watsonplatform.net/visual-recognition/api/v3/classify?version=2018-03-19', files=post_files, headers=post_header, data=post_data)
        status = response.status_code
        try:
            content = response.json()
        except ValueError:
            # IBM Response is BAD
            print('IBM Response was BAD - (e.g. image too large)')
            image_file_path.close()
            return False
        
        print(status)
        print(content)
        # If success save the data
        if(status == 200 or status == '200' or status == 201 or status == '201'):
            if(content['images'][0]['classifiers'][0]['classes']):
                sorted_by_score = sorted(content['images'][0]['classifiers'][0]['classes'], key=lambda k: k['score'], reverse=True)
                print(sorted_by_score)
                image_file_path.close()
                return {'data':sorted_by_score, 'score':sorted_by_score[0]['score'], 'result':sorted_by_score[0]['class']}
            else:
                print('NO DATA')
                image_file_path.close()
                return False
    else:
        print('FAILED TO TEST CLASSIFIER by Admin - Check Token, Classifier ids is ready and file existence is upload temp file.')
        return False

#################################################
# ZIP and Pass Images to IBM watson for re-training
# Funcion receives the image file list, object(wall,rebar,etc.) and result(go,nogo,etc.)
def retrain_image(image_file_list, project, object_type, result, media_folder='image', classifier=None,  process=False, rotate=False, warp=False, inverse=False, noIndexCheck=False):
    zipObj = None
    zipPath = None
    all_transformed_image = []
    try:
        # ZIP THE IMAGES #
        filename = '{}.{}'.format(uuid.uuid4().hex, 'zip')
        zipPath = os.path.join('media/temp/', filename)

        if not os.path.exists(os.path.join('media/temp/')):
            zipPath = os.environ.get('PROJECT_FOLDER','') + '/media/temp/'+filename
        else:
            zipPath = os.path.join('media/temp/', filename)

        print(zipPath)
        zipObj = ZipFile(zipPath, 'w')

        ##############
        saveto = None # for transformed images
        if not os.path.exists(os.path.join('media/temp/')):
            saveto = os.environ.get('PROJECT_FOLDER','') + '/media/temp/'
        else:
            saveto = os.path.join('media/temp/')
        ##############

        # Add multiple files to the zip
        for image_file in image_file_list:
            #########PROCESS########
            # IF REQUEST CAME ALONG TO PROCESS THE IMAGES i.e. rotate h,v,-1 and zip them all
            if process:
                img = cv2.imread(image_file) # cv2 read image
                ext = pathlib.Path(image_file).suffix
                # print(img)
                print(ext)
                print('--CREATE CLASSIFIER PROCESS IMAGE AND RETURN LISTS')
                transformed_images = transform_image(img, ext, saveto, rotate, warp, inverse) # Call Transform Image function to do image processing with parameter options
                all_transformed_image = all_transformed_image + transformed_images # Transform IMAGES if requested
                for image in transformed_images:
                    zipObj.write(os.path.join(settings.BASE_DIR ,settings.MEDIA_ROOT,media_folder,os.path.basename(image)), os.path.basename(image))
                
            zipObj.write(os.path.join(settings.BASE_DIR ,settings.MEDIA_ROOT,media_folder,os.path.basename(image_file)), os.path.basename(image_file))
        
        # close the Zip File
        zipObj.close()
    except Exception as e:
        print(e)
        if zipObj and zipPath:
            zipObj.close()
            os.remove(zipPath)
        for image in all_transformed_image:
            os.remove(image)
        return False
    
    zipObj.close()
    # IF OS Path to Image exists + IBM KEY is provided + classifier list exists
    if ( os.path.exists(zipPath) and settings.IBM_API_KEY 
        and (classifier_list.searchList(project,object_type,classifier) or noIndexCheck) ):

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

        for classifier_ids in classifier_list.data().get(project,{}).get(object_type,[]):
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
                print(response)
                print('IBM Response was BAD - (e.g. zip might be too large)')
            
            print(status)
            print(content)
            # If success save the data
            if(status == 200 or status == '200' or status == 201 or status == '201'):
                passed += 1
        
        zipObj.close()
        os.remove(zipPath)
        print(str(len(all_transformed_image)) + ' transformed images...')
        for image in all_transformed_image:
            os.remove(image)
        
        # IF PASSED AT LEAST ONE CLASSIFIER THEN "OK"
        if(passed > 0):
            return passed
        else:
            return False
    else:
        print('FAILED TO TEST - Check Token, Classifier ids and file existence.')
        return False

#################################################
# Create New classifier
# User uploades proper zip file with classifier name
def create_classifier(zip_file_list, negative_zip=False, name=False, object_type=False, process=False, rotate=False, warp=False, inverse=False):
    # IF IBM KEY is provided (also check zip_file_list is ok)
    if ( settings.IBM_API_KEY and zip_file_list and name and object_type ):
        # Authenticate the IBM Watson API
        api_token = str(settings.IBM_API_KEY)
        auth_base = 'Basic '+str(base64.b64encode(bytes('apikey:'+api_token, 'utf-8')).decode('utf-8'))
        print(auth_base)
        post_header = {'Accept':'application/json','Authorization':auth_base}
        post_files = {}
        bad_zip = 0
        all_unzipped_images = []
        all_zipped_image = []
        all_custom_zip = []
        files_left_to_close = []
        x = None # ZIP FILE OPEN VARIABLE

        for zip_file in zip_file_list:
            all_unzipped_images = []
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
                    if type(zip_file) is InMemoryUploadedFile:
                        x = zip_file.open()
                    else:
                        x = open(zip_file.temporary_file_path(), 'rb')
                    
                    #########PROCESS########
                    # IF REQUEST CAME ALONG TO PROCESS THE IMAGES i.e. rotate h,v,-1 and zip them all
                    if process:
                        print('--CREATE CLASSIFIER PROCESS IMAGE AND ZIP')
                        ######
                        z = ZipFile(x) # zipfile used
                        
                        for zipinfo in z.infolist(): # Loop on all zipfile info list content (assume zip file has image files alone)
                            ext = pathlib.Path(zipinfo.filename).suffix if pathlib.Path(zipinfo.filename).suffix else '.jpg' # get extension
                            filename = '{}{}'.format(uuid.uuid4().hex, ext) # generate filename

                            saveto = None
                            if not os.path.exists(os.path.join('media/temp/')):
                                saveto = os.environ.get('PROJECT_FOLDER','') + '/media/temp/'
                            else:
                                saveto = os.path.join('media/temp/')

                            zipinfo.filename = filename # replace filename
                            extracted = z.extract(zipinfo, saveto) # extract and save to temp

                            if extracted:
                                img = cv2.imread(saveto + filename) # cv2 read image
                                all_unzipped_images.append(saveto + filename) # add image to array (original image)
                                transformed_images = transform_image(img, ext, saveto, rotate, warp, inverse) # Call Transform Image function to do image processing with parameter options
                                all_unzipped_images = all_unzipped_images + transformed_images

                        # AFTER ALL ARE PROCESSED AND ZIP in ONE zip file
                        print(all_unzipped_images)
                        # IF PROCESSED IMAGES EXISTS THEN ZIP THEM AND SEND TO post_files
                        if all_unzipped_images and process:
                            zipObj = None
                            zipPath = None
                            try:
                                # ZIP THE IMAGES #
                                filename = '{}.{}'.format(uuid.uuid4().hex, 'zip')
                                zipPath = os.path.join('media/temp/', filename)

                                if not os.path.exists(os.path.join('media/temp/')):
                                    zipPath = os.environ.get('PROJECT_FOLDER','') + '/media/temp/'+filename
                                else:
                                    zipPath = os.path.join('media/temp/', filename)

                                print(zipPath)
                                zipObj = ZipFile(zipPath, 'w')
                                # Add multiple files to the zip
                                for image_file in all_unzipped_images:
                                    zipObj.write(os.path.join(settings.BASE_DIR ,settings.MEDIA_ROOT,'temp',os.path.basename(image_file)), os.path.basename(image_file))
                                # close the Zip File
                                zipObj.close()

                                x = open(zipPath, 'rb')
                                all_custom_zip.append(zipPath) # add zip to array (used later to delete from temp)
                                # add image to post files
                                post_files[zip_file.name.replace('.zip','')+'_positive_examples'] = x
                                files_left_to_close.append(x) # add files left to close to array (used later to close before deleting)
                            except Exception as e:
                                print(e)
                                if zipObj and zipPath:
                                    all_zipped_image = all_zipped_image + all_unzipped_images
                                    zipObj.close()
                                    os.remove(zipPath)
                                    x.close()
                                    for f in files_left_to_close:
                                        f.close()
                                    for image in all_zipped_image:
                                        os.remove(image)
                                    for zip in all_custom_zip:
                                        os.remove(zip)
                                return False
                            
                            if zipObj:
                                zipObj.close()

                            all_zipped_image = all_zipped_image + all_unzipped_images
                    else: # If process is not provided via admin just upload the zip given by user
                        post_files[zip_file.name.replace('.zip','')+'_positive_examples'] = x
        
        print(post_files)

        #######################
        # TO STOP FOR TESTING #
        # for f in files_left_to_close:
        #     f.close()
        # for image in all_zipped_image:
        #     os.remove(image)
        # for zip in all_custom_zip:
        #     os.remove(zip)
        # return False
        #######################

        if negative_zip:
            x = None
            if type(negative_zip) is InMemoryUploadedFile:
                x = negative_zip.open()
            else:
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
            print(response)
            print('IBM Response was BAD - (e.g. zip might be too large or similar problem)')
        
        print(status)
        print(content)

        x.close()
        for f in files_left_to_close:
            f.close()
        for image in all_zipped_image:
            os.remove(image)
        for zip in all_custom_zip:
            os.remove(zip)
        
        # If success save the data
        if(status == 200 or status == '200' or status == 201 or status == '201'):
            reload_classifier_list()
            return {'data': content, 'bad_zip': bad_zip}
        
        return False
    else:
        print('FAILED TO TEST - Check Token, Classifier Name, Zip files etc. exists or not')
        return False

# Fetch Classifier Details #
def classifier_detail(project, object_type, model):
    # IF IBM KEY is provided + classifier list exists
    if ( settings.IBM_API_KEY 
        and classifier_list.searchList(project, object_type, model) ):

        # Authenticate the IBM Watson API
        api_token = str(settings.IBM_API_KEY)
        auth_base = 'Basic '+str(base64.b64encode(bytes('apikey:'+api_token, 'utf-8')).decode('utf-8'))
        print(auth_base)
        post_header = {'Accept':'application/json','Authorization':auth_base}

        # Call the API
        try:
            response = requests.get('https://gateway.watsonplatform.net/visual-recognition/api/v3/classifiers/'+model+'?version=2018-03-19', headers=post_header)
            status = response.status_code
        except Exception as e:
            print(e)
            response = {}
            status = False
        
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
def object_detail(object_id):
    # IF IBM KEY is provided + classifier list exists
    if ( settings.IBM_API_KEY 
        and (classifier_list.detect_object_model_id or object_id) ):
        
        if not object_id:
            object_id = classifier_list.detect_object_model_id

        # Authenticate the IBM Watson API
        api_token = str(settings.IBM_API_KEY)
        auth_base = 'Basic '+str(base64.b64encode(bytes('apikey:'+api_token, 'utf-8')).decode('utf-8'))
        print(auth_base)
        post_header = {'Accept':'application/json','Authorization':auth_base}
        content = {}

        # Call the API
        try:
            response = requests.get('https://gateway.watsonplatform.net/visual-recognition/api/v4/collections/'+object_id+'?version=2019-02-11', headers=post_header)
            status = response.status_code
        except Exception as e:
            print(e)
            response = {}
            status = False

        try:
            content.update(response.json())
        except ValueError:
            # IBM Response is BAD
            print('IBM Response was BAD for collection info')

        # Call the API
        try:
            response = requests.get('https://gateway.watsonplatform.net/visual-recognition/api/v4/collections/'+object_id+'/objects?version=2019-02-11', headers=post_header)
            status = response.status_code
        except Exception as e:
            print(e)
            response = {}
            status = False

        try:
            content.update(response.json())
        except ValueError:
            # IBM Response is BAD
            print('IBM Response was BAD for objects')

        # Call the API for Images
        # response = requests.get('https://gateway.watsonplatform.net/visual-recognition/api/v4/collections/'+object_id+'/images?version=2019-02-11', headers=post_header)
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

##################################################
##################################################

# Similar to detect_image but from temp no need to deal with image_file model (used in e.g. google map image test detect)
def detect_temp_image(file_url, detect_model):
    # IF OS Path to Image exists + IBM KEY is provided + classifier list exists
    print('Detecting Image Object [TEMP Google Street Images]...')
    saveto = None
    if os.path.exists(file_url) and settings.IBM_API_KEY and (classifier_list.detect_object_model_id or detect_model):
        object_id = classifier_list.detect_object_model_id
        if detect_model:
            object_id = detect_model
        # Authenticate the IBM Watson API
        api_token = str(settings.IBM_API_KEY)
        post_data = {'collection_ids': object_id, 'threshold': '0.6', 'features':'objects'}
        auth_base = 'Basic '+str(base64.b64encode(bytes('apikey:'+api_token, 'utf-8')).decode('utf-8'))
        print(auth_base)

        post_header = {'Accept':'application/json','Authorization':auth_base}
        
        # Temporary Resized Image (basewidth x calcheight)(save_to_path from param comes if looped through)
        basewidth = 500
        temp = Image.open(file_url)
        wpercent = (basewidth/float(temp.size[0]))
        hsize = int((float(temp.size[1])*float(wpercent)))
        temp = temp.resize((basewidth,hsize), Image.ANTIALIAS)
        ext = file_url.split('.')[-1]
        filename = '{}.{}'.format(uuid.uuid4().hex, ext)

        if not os.path.exists(os.path.join('media/temp/')):
            saveto = os.environ.get('PROJECT_FOLDER','') + '/media/temp/'+filename
        else:
            saveto = os.path.join('media/temp/', filename)

        print(saveto)
        
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
                        resized_image_open.close()
                        # Return Object detected type
                        return {
                            'object_type': sorted_by_score[0]['object'].lower(),
                            'file_url': file_url,
                            'temp_image': saveto,
                        }
        
        resized_image_open.close()
        os.remove(saveto)
        print('Object Detect False, either bad response, no index, bad format array, sorted score empty etc. [Google Street Temp]')
        return False
    else:
        if saveto:
            os.remove(saveto)
        print('FAILED TO Detect Object - Check Token, Object Detect Model id and file existence. [Google Street Temp]')
        return False

# THESE ARE GLOBAL VAR FOR TEST TEMP IMAGE USED DURING RECURSION
score = None
result = None
pipeline_status = {}
# Pipeline Status Format
# {
# 	'classifier_name': {
# 		'result': 'nogo',
# 		'score': 0.8,
# 	},
# 	'second_classifier_name': {
# 		'result': 'nogo',
# 		'score': '0.95',
# 	}
# }
### SAME AS test_image BUT FOR TEMP IMAGES (no need to deal with models and other stuffs (used for e.g. in google map images testing))
def test_temp_images(image_file, save_to_path=None, classifier_index=0, detected_as=None, detect_model=None, project=None):
    global score, result, pipeline_status
    if not detected_as:
        detected_as = detect_temp_image(image_file, detect_model)
    
    if not detected_as:
        if save_to_path:
            os.remove(save_to_path)
        return False
    
    object_type = detected_as.get('object_type')
    image_file = detected_as.get('file_url')
    save_to_path = detected_as.get('temp_image')
    
    print('Trying ' + str(classifier_index) + ' No. Classifier for ' + object_type)
    # IF OS Path to Image exists + IBM KEY is provided + classifier list exists
    check_and_get_classifier_ids = classifier_list.searchList(project,object_type,index=classifier_index)
    if ( os.path.exists(save_to_path) and settings.IBM_API_KEY 
        and classifier_index < classifier_list.lenList(project,object_type)
        and check_and_get_classifier_ids ):

        # Authenticate the IBM Watson API
        api_token = str(settings.IBM_API_KEY)
        classifier_ids = check_and_get_classifier_ids
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
                score = sorted_by_score[0]['score']
                result = sorted_by_score[0]['class']

                if(sorted_by_score and sorted_by_score[0]): # Set Score and Result/Class
                    pipeline_status[check_and_get_classifier_ids] = {
                        'score': sorted_by_score[0]['score'],
                        'result': sorted_by_score[0]['class']
                    }

                # If nogo/nogos then run with next model pipe lopping through available classifier list
                # NOTE: later classifier_list.py shall contain the recursion_list to hold results that might require re test
                # e.g. if recursion_list.get('wall',[]) has nogo/nogos etc. then retest it etc...
                if sorted_by_score[0]['class'].lower() == 'nogo' or sorted_by_score[0]['class'].lower() == 'nogos':
                    if classifier_index + 1 < classifier_list.lenList(project,object_type):
                        print('NOGOS CLASS - PASSING THROUGH NEW MODEL CLASSIFIER #'+str(classifier_index + 1))
                        test_temp_images(image_file, save_to_path, classifier_index + 1, detected_as, detect_model, project) #save_to_path=temp file
                    else:
                        print('No more Nogo pipeline')

                pipeline_status_copy = pipeline_status.copy()
                score_copy = score
                result_copy = result
                if(classifier_index <= 0):
                    pipeline_status = {}
                    score = None
                    result = None
                    resized_image_open.close()
                    os.remove(save_to_path)
                return {'score': score_copy, 'result': result_copy, 'pipeline_status': pipeline_status_copy}
    else:
        print('FAILED TO TEST - Check Token, Classifier ids and file existence.')
        return False