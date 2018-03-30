from django.conf.urls import url

from vacancies.views import VacancyDetailView, ComplaintApiView, QuestionApiView, VacancyListInterfaceView

urlpatterns = [
    url(r'^$', VacancyListInterfaceView.as_view(), name='vacancy-list'),
    url(r'^(?P<slug>[\w-]+)/$', VacancyDetailView.as_view(), name='vacancy-detail'),
    url(r'^forms/complaint/$', ComplaintApiView.as_view(), name='complaint-form'),
    url(r'^forms/question/$', QuestionApiView.as_view(), name='question-form'),

]
