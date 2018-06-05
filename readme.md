# Career site SMYT company
### Prerequisites:
Python version: 3

To use this application, you will need:
* Nginx
* Postgresql
* Redis
* virtualenvwrapper

Required packages can be install by typing:
```
sudo apt-get update
sudo apt-get install python3-pip python3-dev libpq-dev postgresql postgresql-contrib nginx redis-server 
```
Detailed instructions for installing virtualenvwrapper you can find here:

[virtualenvwrapper](http://virtualenvwrapper.readthedocs.io/en/latest/install.html)-full manual

If the project deploy in a virtual environment, then it is necessary
install a virtual environment with python3 support, for example:
```
For MacOS: mkvirtualenv --python=/usr/local/bin/python3 smyt_careers
For Linux: mkvirtualenv --python=/usr/bin/python3 smyt_careers 
```
This site uses google-captcha, so you need to get access keys,
more details how to get described here: 
* [Google-captcha](https://developers.google.com/recaptcha/intro)
* [Manage keys](https://www.google.com/recaptcha/admin#list)

Used version: **reCAPTCHA V2**

You need to register your site and get two keys: your site key, specifying the correct domain name and secret key for working with google.

###Deploy instruction:
Directory project has a directory, named conf, it's directory with configuration files.
```
nginx.conf.sample - config file for nginx
uwsgi.ini.sample - config file for uwsgi
systemd.conf.sample - service, creating concrete uwsgi for the site
systemd_rq.conf.sample - service, creating concrete redis queue for the site

```
*All files need to be renamed, removing the postfix .sample*

Install all requirements for project:
```
pip install -r requirements.pip
```
Copy file settings into the project:
```
cp ./settings/local_settings.py.sample ./settings/local_settings.py
```
Set required settings:
```
SECRET_KEY = 'secret key for site'
DEBUG = False # disable debug mode
ALLOWED_HOSTS = [] # list of names, addresses that will have access
GR_CAPTCHA_SITE_KEY = 'google captcha key for site'
GR_CAPTCHA_SECRET_KEY = 'secret google captcha key for site'
In the ADMINS section, specify the list of site administrators following the example from the file 
Specify the necessary settings for the operation of mail according to the example from the file
```
It's suppose to use the postgresql database system, for this in the settings, in the DATABASE section specify the following parameters:
```
'NAME ': 'smyt_careers' # real database name
'USER': 'smyt',  # database username
'PASSWORD': 'password', # database user password
'HOST': 'localhost', # database host
'PORT': '5432', # database port
```
Create directories for media and static in root project:
```
mkdir ./media
mkdir ./static

```
Check project:
```
python manage.py check
```
Apply migrations:
```
python manage.py migrate
```
Collect static:
```
python manage.py collectstatic
```
Create minimized and common one js/css static file from other js/css static files:
```
python manage.py compress
```
Create site administrator:
```
python manage.py createsuperuser
```
###Multi language
Add your language into LANGUAGE section in settings/base.py:
```
...
('ua', _('Ukraine'))
...
```
Create messages for translation:
```
./manage.py makemessages -l ua
```
Make translations in file:
```
locale/ua/LC_MESSAGES/django.po
```
Compile file with translations:
```
./manage.py compilemessages
```
Create ua-templates with translations, following the example of other languages, in:
```
vacancies/templates/translations/about/ua/
```
###After deploy
After the site is already working, you need to specify a list of e-mail recipients of letters from the site in the django admin panel.

