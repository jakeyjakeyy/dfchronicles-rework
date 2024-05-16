from django.contrib import admin

from .models import *

admin.site.register(Generation)
admin.site.register(Rating)
admin.site.register(Comment)
admin.site.register(Favorite)