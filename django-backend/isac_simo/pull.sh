#!/bin/sh
echo 'PULLING FROM MASTER'
git pull origin master

source env/bin/activate
pip install -r requirements.txt

python manage.py migrate
echo 'MIGRATE AND PULL DONE'
touch /var/www/buildchange_pythonanywhere_com_wsgi.py
echo 'Requested Reload'