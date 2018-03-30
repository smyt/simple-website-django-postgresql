from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.renderers import TemplateHTMLRenderer

from questions.pagination import QuestionListPagination
from seo_pages.consts import QUESTION_LIST
from seo_pages.mixins import SeoHelperMixin
from .models import Category
from .serializers import QuestionCategorySerializer


class QuestionCategoryListViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List categories with published questions for api
    """
    queryset = Category.published_questions.all()
    serializer_class = QuestionCategorySerializer
    pagination_class = QuestionListPagination


class QuestionCategoryInterfaceListViewSet(SeoHelperMixin, QuestionCategoryListViewSet):
    """
    List categories with published questions for site page - questions
    """
    template_name = 'questions/question_list.html'
    renderer_classes = [TemplateHTMLRenderer]
    permission_classes = [AllowAny, ]
    page_name_for_seo = QUESTION_LIST

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        response.data['seo'] = self.get_seo_data()
        return response
