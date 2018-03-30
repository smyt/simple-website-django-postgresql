from fabric.api import env, run, cd, prefix, sudo

CONFIG = {
    'host': 'remote_host',
    'port': 'remote_port',
    'username': 'smyt',
    'project_dir': '~/smyt_careers/',
    'virtualenv_dir': '~/.envs/smyt_careers/',
    'pid': '/tmp/career.pid'
}

env.hosts = ['{0}@{1}:{2}'.format(CONFIG['username'], CONFIG['host'], CONFIG['port'])]
env.forward_agent = True


def restart():
    run("{}bin/uwsgi --reload {}".format(CONFIG['virtualenv_dir'], CONFIG['pid']))
    sudo("service smyt_careers_rq restart")


def deploy():
    with cd(CONFIG['project_dir']):
        run('git pull origin master')
        with prefix('source {}bin/activate'.format(CONFIG['virtualenv_dir'])):
            run('pip install -r requirements.pip')
            run('python manage.py check')
            run('python manage.py migrate --noinput')
            run('python manage.py collectstatic --noinput')
            run('python manage.py compress')
        restart()
