import sys
from collections import OrderedDict

from rest_framework.pagination import LimitOffsetPagination, _positive_int
from rest_framework.response import Response
from rest_framework.utils.urls import replace_query_param


class AddSuccessToResponseMixin:
    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('success', True),
            ('count', self.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data)
        ]))


class VacancyListPagination(AddSuccessToResponseMixin, LimitOffsetPagination):
    default_limit = 20
    offset_query_param = 'page'


class CityListPagination(AddSuccessToResponseMixin, LimitOffsetPagination):
    default_limit = sys.maxsize


class VacancyListWithPreviousPagination(VacancyListPagination):
    """Custom Pagination with previous results.

    offset always is 0, because we want to get all results from beginning
    """
    def get_offset(self, request):
        return 0

    def _get_offset_from_request(self, request):
        try:
            offset = _positive_int(
                request.query_params[self.offset_query_param]
            )
        except (KeyError, ValueError):
            offset = 0
        if offset < 1:
            offset = 1
        return offset

    def get_limit(self, request):
        offset = self._get_offset_from_request(request)
        limit = self.default_limit * offset
        return limit

    def get_next_link(self):
        if self.offset + self.limit >= self.count:
            return None

        offset = self._get_offset_from_request(self.request)

        # make number of next page
        offset += 1

        url = self.request.build_absolute_uri()
        return replace_query_param(url, self.offset_query_param, offset)

    def get_previous_link(self):
        offset = self._get_offset_from_request(self.request)
        if offset <= 1:
            return None

        url = self.request.build_absolute_uri()

        # make number of previous page
        offset -= 1
        return replace_query_param(url, self.offset_query_param, offset)
