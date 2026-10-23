from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(User)
admin.site.register(Etudiant)
admin.site.register(Entreprise)
admin.site.register(Offre)
admin.site.register(Candidature)
admin.site.register(Notifications)