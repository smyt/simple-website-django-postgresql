from seo_pages.consts import VACANCY_TITLE, CITY_NAME, COUNTRY_NAME, MAIN_PAGE
from seo_pages.models import SeoPage


class SeoHelperMixin:
    page_name_for_seo = None

    def get_seo_object(self):
        try:
            page = SeoPage.objects.get(type_page=self.page_name_for_seo)
        except SeoPage.DoesNotExist:
            page = None
        except SeoPage.MultipleObjectsReturned:
            page = None
        return page

    def get_seo_data(self, country=None, city=None, vacancy_name=None):
        if self.page_name_for_seo:
            page = self.get_seo_object()
            if page and country and city and vacancy_name:
                page.title = page.title.replace(VACANCY_TITLE, vacancy_name) \
                    .replace(COUNTRY_NAME, country) \
                    .replace(CITY_NAME, city)
            return page
        return None


class SeoDefaultPage(SeoHelperMixin):
    page_name_for_seo = MAIN_PAGE
