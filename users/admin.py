from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _


class UserAdminSmyt(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_groups', 'is_staff')

    def user_groups(self, user):
        group_names = user.groups.values_list('name', flat=True)
        groups = ", ".join(group_names)
        return groups

    user_groups.allow_tags = True
    user_groups.short_description = _('Groups')

admin.site.unregister(User)
admin.site.register(User, UserAdminSmyt)
