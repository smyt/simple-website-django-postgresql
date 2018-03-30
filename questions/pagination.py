from rest_framework.pagination import LimitOffsetPagination


class QuestionListPagination(LimitOffsetPagination):
    default_limit = 20
    max_limit = default_limit
