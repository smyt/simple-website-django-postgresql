from django.conf.urls import url

from questions.viewsets import QuestionCategoryInterfaceListViewSet

urlpatterns = [
    url(r'^$', QuestionCategoryInterfaceListViewSet.as_view({'get': 'list'}), name='question-list')
]
