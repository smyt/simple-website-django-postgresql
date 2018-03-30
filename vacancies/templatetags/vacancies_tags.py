from django import template

from vacancies.models import Vacancy
from vacancies.serializers import VacancySearchSerializer, VacancySerializer

register = template.Library()


@register.inclusion_tag('vacancies/tags/search_filter.html', takes_context=True)
def search_filter(context, ajax=None):
    """
    ajax - for different behavior
    1) search filter from main page redirects to page vacancies
    2) search filter from vacancies page send ajax query request
    """
    request = context['request']

    if not request.GET:
        serializer = VacancySearchSerializer(request=request)
    else:
        serializer = VacancySearchSerializer(request=request, data=request.GET)

        if serializer.is_valid():
            pass

    return {
        'serializer': serializer,
        'ajax': ajax
    }


@register.inclusion_tag('vacancies/tags/main_vacancies.html', takes_context=True)
def main_vacancies(context):
    request = context['request']
    vacancies = Vacancy.published.filter(is_main=True)
    vacancies_serialized = VacancySerializer(vacancies, many=True, context={'request': request})
    # list with orderdicts to list with dict
    vacancies = []
    for d in vacancies_serialized.data:
        vacancies.append(dict(d))

    return {
        'vacancies': vacancies,
    }


@register.simple_tag(takes_context=True)
def active_menu_item(context, url):
    request = context['request']

    if request.path and url and url != '/' and request.path.startswith(url):
        return "active"

    return ""
