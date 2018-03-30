# Сайт вакансий компании SMYT
### Предварительные требования:
Версия python: 3

Для работы приложения потребуются:
* Nginx
* Postgresql
* Redis
* virtualenvwrapper

Необходимые пакеты можно поставить так:
```
sudo apt-get update
sudo apt-get install python3-pip python3-dev libpq-dev postgresql postgresql-contrib nginx redis-server 
```
Подробная инструкция по устаноке virtualenvwrapper находится тут:

[virtualenvwrapper](http://virtualenvwrapper.readthedocs.io/en/latest/install.html)-инструкция по установке и настройке

Если проект будет разворачиваться в виртуальном окружении, то необходимо
установить виртуальное окружение с поддержкой python3, например так:
```
Для MacOS: mkvirtualenv --python=/usr/local/bin/python3 smyt_careers
Для Linux: mkvirtualenv --python=/usr/bin/python3 smyt_careers 
```
На сайте используются google-captcha, поэтому необходимо получить ключи доступа,
подробнее как получить описано тут: 
* [Google-captcha](https://developers.google.com/recaptcha/intro)
* [Управление ключами](https://www.google.com/recaptcha/admin#list)

используемая версия: **reCAPTCHA V2**

Необходимо зарегистрировать свой сайт и получить 2 ключа: ваш ключ сайта, указав правильное имя домена и секретный ключ для работы с google.

###Инструкция по развертыванию:
В директории проекта есть каталог conf с конфигурационными файлами:
```
nginx.conf.sample - конфигурационный файл для nginx
uwsgi.ini.sample - конфигурационный файл для uwsgi
systemd.conf.sample - сервис, поднимающий uwsgi для сайта
systemd_rq.conf.sample - сервис, поднимающий очередь на основе redis для сайта 

```
*Все файлы нужно переименовать, убрав постфикс .sample*

Установить все зависимости для проекта:
```
pip install -r requirements.pip
```
Скопировать файл настроек в проект:
```
cp ./settings/local_settings.py.sample ./settings/local_settings.py
```
Указать нужные настройки для проекта:
```
SECRET_KEY = 'секртеный ключ для работы сайта'
DEBUG = False # отключаем отладочный режим
ALLOWED_HOSTS = [] # нужно перечислить список имен, адресов которые будут иметь доступ
GR_CAPTCHA_SITE_KEY = 'ключ сайта для каптчи, который был получен ранее'
GR_CAPTCHA_SECRET_KEY = 'секретный ключ для каптчи, который был получен ранее'
В разделе ADMINS указать список администраторов сайта по примеру из файла 
Указать необходимые настройки для работы почты по примеру из файла
```
Предполагается использование субд postgres, для этого в настройках, в разделе DATABASE укажите следующие параметры:
```
'NAME ': 'smyt_careers' # реальное имя базы данных на сервере
'USER': 'smyt',  # имя пользователя базы данных
'PASSWORD': 'password', # пароль пользователя базы данных
'HOST': 'localhost', # если субд будет на другом хосте, то следует это указать тут
'PORT': '5432', # порт на котором работает postgres на сервере
```
Создать в корне проекта каталоги для медии и статики:
```
mkdir ./media
mkdir ./static

```
Проверить все ли в порядке:
```
python manage.py check
```
Выполнить миграции:
```
python manage.py migrate
```
Собрать статику:
```
python manage.py collectstatic
```
Создать администратора сайта:
```
python manage.py createsuperuser
```
###После развертывания:
После того, как сайт уже работает, с помощью администратора сайта необходимо указать в админке джанги список e-mail получателей писем с сайта.

