# ISAC-SIMO
#### Django Backend Repository
---
#### Bash Script:
```sh
pip3 install --user python-dotenv
pip3 install --user django
virtualenv -p python3 env
source env/bin/activate
pip install -r requirements.txt
```
>If using pipenv (e.g. for windows) then use this:
```sh
pipenv install
```
```sh
python manage.py migrate
python manage.py createsuperuser
```
##### You can also use ``` bash pull.sh ``` script after updating the username inside the file to trigger reload

#### Procfile to Run In Root Port:
```sh
web: python manage.py runserver 0.0.0.0:$PORT
```

### Details for Pythonanywhere:
<details>
    <summary>Click to view</summary>

#### Useful .bashrc Alias for the project if hosted in Pythonanywhere:

<details>
    <summary>Click to view</summary>

```sh
alias toenv="cd /home/{{username}}/isac && source env/bin/activate"

alias server.log="cd /var/log && tail -f {{username}}.pythonanywhere.com.server.log"
alias error.log="cd /var/log && tail -f {{username}}.pythonanywhere.com.error.log"
alias access.log="cd /var/log && tail -f {{username}}.pythonanywhere.com.access.log"

alias server.up="toenv && sed -i 's/MAINTENANCE=True/MAINTENANCE=False/g' .env && touch /var/www/{{username}}_pythonanywhere_com_wsgi.py"
alias server.down="toenv && sed -i 's/MAINTENANCE=False/MAINTENANCE=True/g' .env && touch /var/www/{{username}}_pythonanywhere_com_wsgi.py"

alias reload="touch /var/www/{{username}}_pythonanywhere_com_wsgi.py"
```

</details>

#### Pythonanywhere wsgi.py:

<details>
    <summary>Click to view</summary>

```python
import os
import sys
from dotenv import load_dotenv

project_home = u'/home/{{username}}/isac'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

load_dotenv(os.path.join(project_home, '.env'))

os.environ['DJANGO_SETTINGS_MODULE'] = 'isac_simo.settings'

from django.core.wsgi import get_wsgi_application
from django.contrib.staticfiles.handlers import StaticFilesHandler
application = StaticFilesHandler(get_wsgi_application())
```

</details>

#### Static Files:

<details>
    <summary>Click to view</summary>

| URL           | Directory                      |
| ------------- |:------------------------------:|
| /static/      | /home/{{username}}/isac/static |
| /media/       | /home/{{username}}/isac/media  |

</details>

</details>

### Note:
- Create ``` .env ``` file using ``` .env.example ``` and fill as required
- ``` database_settings.py ``` needs to be updated (or use DATABASE_URL in ``` .env ``` file)


> Developed By: Build Change

> Supported By: IBM