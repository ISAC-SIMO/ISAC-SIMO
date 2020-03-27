# ISAC-SIMO
#### Django Backend Repository
---
#### Bash Script:
```sh
virtualenv -p python3 env
source env/bin/activate
pipenv install
pip install -r requirements.txt
```
```sh
python manage.py migrate
python manage.py createsuperuser
```

#### Procfile to Run In Root Port:
```sh
web: python manage.py runserver 0.0.0.0:$PORT
```

> Build Change