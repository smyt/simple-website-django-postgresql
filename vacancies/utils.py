from django.utils.translation import ungettext

from vacancies.options import ALL_CITIES


def get_text_count_cities(count, city=None):
    if city:
        cities = city
    elif count == 0:
        cities = ALL_CITIES
    else:
        cities = ungettext(
            '%(counter)s city',
            '%(counter)s cities',
            count) % {
                     'counter': count,
                 }
    return cities
