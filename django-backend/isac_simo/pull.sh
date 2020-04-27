#!/bin/bash
cd /home/buildchange/isac
echo '==PULLING FROM MASTER=='
git pull origin master
pip3 install --user python-dotenv
pip3 install --user django

source env/bin/activate
pip install -r requirements.txt
# pip install tensorflow==2.1.0

python manage.py migrate
echo '==MIGRATE AND PULL DONE=='

deactivate
# touch /var/www/buildchange_pythonanywhere_com_wsgi.py
touch /var/www/www_isac-simo_net_wsgi.py
echo '==REQUESTED RELOAD=='