"""Site available Api."""
from rest_framework.routers import DefaultRouter
from vacancies.viewsets import VacancyListViewSet, CitiesListViewSet
from questions.viewsets import QuestionCategoryListViewSet


router = DefaultRouter()

router.register(r'vacancies', VacancyListViewSet, 'vacancies')
router.register(r'cities', CitiesListViewSet, 'cities')

router.register(r'question_categories', QuestionCategoryListViewSet)
