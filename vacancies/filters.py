from django.db.models import Q
from django_filters import rest_framework as filters

from .models import Vacancy, City, Country, Profile, Experience


class CityFilter(filters.ModelChoiceFilter):
    def filter(self, qs, value):
        if value:
            qs = qs.filter(Q(cities__name=value) | Q(cities__isnull=True))
        return qs


class VacancyListFilter(filters.FilterSet):
    country = filters.ModelChoiceFilter(queryset=Country.objects.all(), to_field_name='slug')
    profile = filters.ModelChoiceFilter(queryset=Profile.objects.all(), to_field_name='slug')
    experience = filters.ModelChoiceFilter(queryset=Experience.objects.all(), to_field_name='slug')
    cities = CityFilter(queryset=City.objects.all(), to_field_name='slug')

    class Meta:
        model = Vacancy
        fields = ('is_main', 'country', 'cities', 'profile', 'experience',)


class CityListFilter(filters.FilterSet):
    country = filters.ModelChoiceFilter(queryset=Country.objects.all(), to_field_name='slug')

    class Meta:
        model = City
        fields = ('country',)
