import logging
import urllib
from urllib.parse import urlparse, parse_qs

import django_rq
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.utils.translation import gettext as _
from rest_framework.permissions import AllowAny
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from seo_pages.consts import MAIN_PAGE, VACANCY_PAGE, VACANCY_LIST
from seo_pages.mixins import SeoHelperMixin
from smyt_careers.utils import check_captcha, send_serializer_mail
from vacancies.messages import CAPTCHA_ERROR_TEXT, FORM_SUCCESS_TEXT, COMPLAINT_FORM_SUCCESS_TEXT
from vacancies.models import Vacancy
from vacancies.pagination import VacancyListPagination
from vacancies.serializers import ComplaintSerializer, QuestionSerializer, ResumeSerializer
from vacancies.utils import get_text_count_cities
from vacancies.viewsets import VacancyListWithPreviousViewSet

logger = logging.getLogger('smyt')


class SerializerHelperMixin:
    """
    Mixin for processing form(serializer)
    """
    serializer_class = ResumeSerializer
    text_subject = _('Site message')
    success_answer = FORM_SUCCESS_TEXT

    def post(self, request, slug=None):
        answer = {}
        serializer = self.serializer_class(data=request.data)
        is_error = True

        if serializer.is_valid():
            is_valid_captcha = check_captcha(request.data.get('g-recaptcha-response'))
            if not is_valid_captcha:
                answer.update({'success': False, 'errorText': {'captcha': [CAPTCHA_ERROR_TEXT, ]}})
            else:
                is_error = False
                answer.update({'success': True, 'messageText': self.success_answer})
                logger.info("sent form({}) with params: {}".format(self.text_subject, str(serializer.validated_data)))
                queue = django_rq.get_queue('default')
                queue.enqueue(send_serializer_mail, serializer, self.text_subject)
                # send_serializer_mail(serializer)
        else:
            answer.update({'success': False, 'errorText': serializer.errors})

        if request.is_ajax():
            status = 201 if not is_error else 400
            return JsonResponse(answer, status=status)

        return Response(answer)


class MainPageView(SerializerHelperMixin, SeoHelperMixin, APIView):
    """
    main page
    """
    template_name = 'vacancies/vacancies_main.html'
    renderer_classes = [TemplateHTMLRenderer]
    permission_classes = (AllowAny,)
    serializer_class = ResumeSerializer
    text_subject = _('Resume from vacancy site')
    page_name_for_seo = MAIN_PAGE

    def get(self, request):
        complaint_serializer = ComplaintSerializer(style={'label_text': _('Describe situation here')})
        question_serializer = QuestionSerializer(style={'label_text': _('Appeal text'), 'id': 'form-2-message'})

        return Response({
            'seo': self.get_seo_data(),
            'complaint_serializer': complaint_serializer,
            'question_serializer': question_serializer,
        })


class ComplaintApiView(SerializerHelperMixin, APIView):
    """
    Handler for complaint form(serializer)
    """
    serializer_class = ComplaintSerializer
    permission_classes = (AllowAny,)
    text_subject = _('Complaint from site visitor')
    success_answer = COMPLAINT_FORM_SUCCESS_TEXT


class QuestionApiView(ComplaintApiView):
    """
    Handler for question form(serializer)
    """
    serializer_class = QuestionSerializer
    text_subject = _('Question about company from site visitor')
    success_answer = FORM_SUCCESS_TEXT


class VacancyDetailView(SerializerHelperMixin, SeoHelperMixin, APIView):
    """
    Vacancy Page
    """
    template_name = 'vacancies/vacancy_detail.html'
    renderer_classes = [TemplateHTMLRenderer]
    permission_classes = [AllowAny]
    serializer_class = ResumeSerializer
    text_subject = _('Resume from vacancy site')
    page_name_for_seo = VACANCY_PAGE

    def get(self, request, slug=None):
        vacancy = get_object_or_404(Vacancy, slug=slug, is_published=True)
        answer = {}
        if vacancy:
            cities = list(vacancy.cities.all().values_list('name', flat=True))
            count = len(cities)
            is_all_cities = True if count == 0 else False
            city = cities[0] if count == 1 else None
            header_text_cities = get_text_count_cities(count, city)
            footer_text_cities = ', '.join(cities)

            answer.update({
                'object': vacancy,
                'seo': self.get_seo_data(country=vacancy.country.name, vacancy_name=vacancy.name,
                                         city=header_text_cities),
                'is_all_cities': is_all_cities,
                'header_text_cities': header_text_cities,
                'footer_text_cities': footer_text_cities,
                'serializer': self.serializer_class(position=vacancy.name)
            })

        return Response(answer)


class VacancyListInterfaceView(SerializerHelperMixin, SeoHelperMixin, APIView):
    """
    Page with vacancies
    """
    template_name = 'vacancies/vacancy_list.html'
    renderer_classes = [TemplateHTMLRenderer]
    permission_classes = [AllowAny, ]
    page_name_for_seo = VACANCY_LIST

    @staticmethod
    def _get_next_url(url=None):
        result_url = None
        if url:
            url_obj = urlparse(url)
            url_params = parse_qs(url_obj.query)
            page_name_param = VacancyListPagination.offset_query_param
            params = {page_name_param: url_params[page_name_param][0]}
            result_url = '{}?{}'.format(reverse('vacancies-list'), urllib.parse.urlencode(params))
        return result_url

    def get(self, request):
        response = VacancyListWithPreviousViewSet.as_view({'get': 'list'})(request)
        response_data = dict(response.data)
        next_url = response_data.get('next')
        next_url = self._get_next_url(next_url)

        results = response_data.get('results')
        results = [dict(item) for item in results] if results else None

        return Response({
            'seo': self.get_seo_data(),
            'results': results,
            'next_url': next_url
        })
