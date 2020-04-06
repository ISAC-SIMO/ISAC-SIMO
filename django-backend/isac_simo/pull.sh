#!/bin/bash
cd /home/buildchange/isac
echo '==PULLING FROM MASTER=='
git pull origin master
pip3 install --user python-dotenv
pip3 install --user django

source env/bin/activate
pip install -r requirements.txt

python manage.py migrate
echo '==MIGRATE AND PULL DONE=='

deactivate
touch /var/www/buildchange_pythonanywhere_com_wsgi.py
echo '==REQUESTED RELOAD=='