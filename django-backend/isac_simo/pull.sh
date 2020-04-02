#!/bin/sh
echo 'PULLING FROM MASTER'
git pull origin master
pip3 install --user python-dotenv

source env/bin/activate
pip install -r requirements.txt

python manage.py migrate
echo 'MIGRATE AND PULL DONE'

deactivate
touch /var/www/buildchange_pythonanywhere_com_wsgi.py
echo 'Requested Reload'