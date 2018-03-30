from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ReadOnlyModelViewSet

from .filters import VacancyListFilter, CityListFilter
from .models import Vacancy, City
from .pagination import CityListPagination, VacancyListWithPreviousPagination
from .serializers import VacancySerializer, CitySerializer


class VacancyListViewSet(ReadOnlyModelViewSet):
    """
    Class for work with vacancies
    - Vacancy list for main page
    - Vacancy list for vacancies page with filters
    """
    queryset = Vacancy.published.all()
    serializer_class = VacancySerializer
    filter_class = VacancyListFilter
    pagination_class = VacancyListWithPreviousPagination
    permission_classes = [AllowAny, ]


class VacancyListWithPreviousViewSet(VacancyListViewSet):
    pagination_class = VacancyListWithPreviousPagination


class CitiesListViewSet(ReadOnlyModelViewSet):
    """
    List cities with country-filter
    """
    queryset = City.objects.all()
    serializer_class = CitySerializer
    filter_class = CityListFilter
    pagination_class = CityListPagination
    permission_classes = [AllowAny, ]

    def get_queryset(self):
        """
        no cities without country
        """
        if self.request.query_params.get('country'):
            return self.queryset
        return self.queryset.none()
