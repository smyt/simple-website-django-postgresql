from django import template

from seo_pages.mixins import SeoDefaultPage

register = template.Library()


@register.inclusion_tag('seo_pages/includes/seo_head.html', takes_context=True)
def generate_seo(context):
    seo_data = context.get('seo')
    if seo_data is None:
        # set main page's seo for page without seo
        seo_page = SeoDefaultPage()
        seo_data = seo_page.get_seo_data()
    return {
        'seo': seo_data
    }
