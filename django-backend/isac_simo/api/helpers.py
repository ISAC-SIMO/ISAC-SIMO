import os
import requests

####################
### CALL AI TEST ###
####################
def test_image(image_file, title, description):
    file_url = str(os.path.abspath(os.path.dirname(__name__))) + image_file.file.url
    if os.path.exists(file_url):
        post_data = {'title': title, 'description': description}
        post_header = {'X-Do-Not-Track':'true'}
        post_files = {
            'file': open(file_url, 'rb'),
        }
        response = requests.post('https://httpbin.org/anything', files=post_files, headers=post_header, data=post_data)
        status = response.status_code
        content = response.json()
        print(status)
        print(content)
        # print(response.headers['date'])
        # print(response.headers)
        # print(response.request.body)
        # print(type(response.headers))
        if(status == 200 or status == '200' or status == 201 or status == '201'):
            image_file.tested = True
            image_file.save()
            return True
    else:
        print('FAILED TO TEST')
        return False
