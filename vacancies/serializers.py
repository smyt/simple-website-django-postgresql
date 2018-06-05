from django.utils.text import format_lazy
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.reverse import reverse

from smyt_careers import settings
from vacancies.messages import FIO_ERRORS_MESSAGES, EMAIL_ERRORS_MESSAGES, SKYPE_ERRORS_MESSAGES, \
    PHONE_ERRORS_MESSAGES, FILE_ERROR_TEXT, UPLOADED_FILE_ERROR_TEXT
from vacancies.models import Vacancy, Country, City, Profile, Experience
from vacancies.options import ALL_CITIES
from vacancies.utils import get_text_count_cities
from vacancies.validators import phone_validator, skype_validator


class VacancySearchSerializer(serializers.Serializer):
    country = serializers.SlugRelatedField(queryset=Country.objects.all(), required=False, allow_null=True,
                                           label=_('Country'),
                                           slug_field='slug',
                                           style={'template': 'forms/fields/select.html',
                                                  'empty_label': _('All countries')})
    cities = serializers.SlugRelatedField(queryset=City.objects.none(), required=False, allow_null=True,
                                          label=_('City'),
                                          slug_field='slug',
                                          style={'template': 'forms/fields/select.html',
                                                 'empty_label': ALL_CITIES})
    profile = serializers.SlugRelatedField(queryset=Profile.objects.all(), required=False, allow_null=True,
                                           label=_('Profile'),
                                           slug_field='slug',
                                           style={'template': 'forms/fields/select.html',
                                                  'empty_label': _('Any profile')})
    experience = serializers.SlugRelatedField(queryset=Experience.objects.all(), required=False, allow_null=True,
                                              label=_('Level experience'),
                                              slug_field='slug',
                                              style={'template': 'forms/fields/select.html',
                                                     'empty_label': _('Any experience')})

    def _filter_cities(self, request):
        country = request.query_params.get('country', None)
        if country:
            self.fields['cities'].queryset = City.objects.filter(country__slug=country)

    def __init__(self, request, *args, **kwargs):
        self._filter_cities(request)

        super().__init__(*args, **kwargs)
        url = reverse('cities-list')
        self.fields['cities'].style.update({'data_load_url': str(url)})

    def validate(self, attrs):
        # if not all form fields in request.GET we need to set default value, otherwise we will get render field error
        for key in self.fields.keys():
            if key not in attrs:
                attrs[key] = None
        return attrs


class ComplaintSerializer(serializers.Serializer):
    fio = serializers.CharField(label=_('Name and surname'), min_length=3, error_messages=FIO_ERRORS_MESSAGES,
                                style={'template': 'forms/fields/input.html',
                                       'constraints': '@Name @Required'})
    email = serializers.EmailField(label=_('E-mail'), error_messages=EMAIL_ERRORS_MESSAGES,
                                   style={'template': 'forms/fields/input.html',
                                          'constraints': '@Email @Required'})
    comment = serializers.CharField(label=_('Write question here'),
                                    style={'template': 'forms/fields/textarea.html', 'constraints': '@Required'})

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        for label, value in self.fields.items():
            self.fields[label].style.update({'form_name': str(self.__class__.__name__).lower()})

        if 'style' in kwargs:
            self.fields['comment'].style.update(kwargs['style'])


class QuestionSerializer(ComplaintSerializer):
    pass


class ResumeSerializer(ComplaintSerializer):
    ALLOWED_CONTENT_TYPES = ['application/msword', 'application/pdf', 'text/rtf',
                             'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

    file = serializers.FileField(label=_('Resume'), required=False,
                                 style={'template': 'forms/fields/file.html',
                                        'data_link_field': 'link',
                                        'constraints': format_lazy(
                                            '@ProfileFileExt(extensions="doc,docx,rtf,pdf") @FileSize(maxFileSize={max_size}) @Together(message="{message}")',
                                            max_size=settings.FILE_UPLOAD_MAX_MEMORY_SIZE, message=_('Attach file'))})
    link = serializers.CharField(label=_('or paste link'), required=False,
                                 style={'template': 'forms/fields/input.html',
                                        'data_link_field': 'file',
                                        'constraints': format_lazy('@Http @Together(message="{message}")',
                                                                   message=_('or paste link to CV'))
                                        })
    skype = serializers.CharField(label=_('Skype'), min_length=3, error_messages=SKYPE_ERRORS_MESSAGES,
                                  validators=[skype_validator], required=False,
                                  style={'template': 'forms/fields/input.html', 'constraints': '@Skype'})
    phone = serializers.CharField(label=_('Phone'), min_length=6, max_length=20, error_messages=PHONE_ERRORS_MESSAGES,
                                  validators=[phone_validator], style={'template': 'forms/fields/input.html',
                                                                       'constraints': '@Phone @Required'})
    position = serializers.CharField(label='Write appropriate position', required=False,
                                     style={'template': 'forms/fields/input.html'})

    def __init__(self, position=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if position:
            self.fields['position'].initial = position
            self.fields['position'].style['input_type'] = 'hidden'
        self.fields['phone'].label = _('Format phone number +78123097284')
        self.fields['comment'].required = False
        self.fields['comment'].label = _('Comment')
        self.fields['comment'].style.update({'constraints': ''})

    def validate_file(self, value):
        if value.content_type not in self.ALLOWED_CONTENT_TYPES:
            raise serializers.ValidationError(FILE_ERROR_TEXT)
        elif value.size > settings.FILE_UPLOAD_MAX_MEMORY_SIZE:
            raise serializers.ValidationError(UPLOADED_FILE_ERROR_TEXT)
        return value


class ResumePagesSerializer(ResumeSerializer):
    """
    For form resume on all site pages
    """
    pass


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ('slug', 'name',)


class VacancySerializer(serializers.ModelSerializer):
    text_count_cities = serializers.SerializerMethodField()
    country = serializers.StringRelatedField()
    profile = serializers.StringRelatedField()
    url = serializers.HyperlinkedIdentityField(view_name='vacancy-detail', read_only=True, lookup_field='slug')
    cities = CitySerializer(many=True)

    class Meta:
        model = Vacancy
        fields = ('name', 'country', 'slug', 'profile', 'is_main', 'text_count_cities', 'url', 'text_main', 'cities',)

    @staticmethod
    def get_text_count_cities(obj):
        count = obj.cities.all().count()
        # if only one city, then get and output this
        city = obj.cities.all().first().name if count == 1 else None
        return get_text_count_cities(count, city)
