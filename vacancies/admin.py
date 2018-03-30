from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from settings import STATIC_URL
from vacancies.options import ALL_CITIES
from .models import Country, City, Profile, Experience, Vacancy


class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'priority')


class CityCreateForm(forms.ModelForm):
    class Meta:
        model = City
        fields = '__all__'


class CityAdmin(admin.ModelAdmin):
    form = CityCreateForm
    list_display = ('name', 'country', 'priority')
    list_filter = ('country',)
    search_fields = ('name',)


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'priority')


class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('name', 'priority')


class VacancyAdminForm(forms.ModelForm):
    class Meta:
        model = Vacancy
        fields = '__all__'

    class Media:
        # EditVacancy.js - bad solution for django-smart-select issue(doesn't show cities when form is editing)
        js = ('{0}vacancies/js/SelectFilter2.js'.format(STATIC_URL),
              '{0}vacancies/js/EditVacancy.js'.format(STATIC_URL),
              )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['cities'].label = 'Города'


class VacancyAdmin(admin.ModelAdmin):
    fields = ('name', 'slug', 'text_main', 'text_inner', 'text_experience', 'text_desc', 'text_qualifying', 'country',
              'cities', 'profile', 'experience', 'is_main', 'is_published', 'priority',)
    list_display = ('name', 'country', 'cities_list', 'profile', 'experience', 'is_published', 'is_main', 'priority',)
    list_filter = ('country', 'is_published', 'is_main', 'profile__name', 'experience__name', )
    search_fields = ('cities__name', 'country__name', 'name', 'profile__name', 'experience__name', 'text_main',
                     'text_inner', 'text_experience', 'text_desc', 'text_qualifying')
    prepopulated_fields = {"slug": ("name",)}
    form = VacancyAdminForm
    actions = ('make_published', 'make_unpublished', 'show_on_main', 'hide_on_main')
    list_editable = ('is_published', 'is_main', )

    def cities_list(self, obj):
        cities_names = [city.name for city in obj.cities.all()]
        cities = ", ".join(cities_names) if len(cities_names) > 0 else ALL_CITIES
        return cities

    cities_list.allow_tags = True
    cities_list.short_description = 'Города'

    def flash_message(self, request, count):
        self.message_user(request, 'Количество обновленных вакансий: {}.'.format(count))

    def make_published(self, request, queryset):
        row_updated = queryset.filter(is_published=False).update(is_published=True)
        self.flash_message(request, row_updated)
    make_published.short_description = 'Опубликовать выбранные'

    def make_unpublished(self, request, queryset):
        row_updated = queryset.filter(is_published=True).update(is_published=False)
        self.flash_message(request, row_updated)
    make_unpublished.short_description = 'Снять публикацию с выбранных'

    def show_on_main(self, request, queryset):
        row_updated = queryset.update(is_published=True, is_main=True)
        self.flash_message(request, row_updated)
    show_on_main.short_description = 'Разместить на главной'

    def hide_on_main(self, request, queryset):
        row_updated = queryset.update(is_main=False)
        self.flash_message(request, row_updated)
    hide_on_main.short_description = 'Скрыть на главной'

admin.site.register(Country, CountryAdmin)
admin.site.register(City, CityAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Experience, ExperienceAdmin)
admin.site.register(Vacancy, VacancyAdmin)
