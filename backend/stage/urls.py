from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from stage import views

urlpatterns = [
    path('inscription/', views.Inscriptions.as_view()),
    path('connexion/', views.connexion),
    path('token/refresh/', TokenRefreshView.as_view()),

    path('offre/', views.listeOffres.as_view(), name='listesOffre'),
    path('offre/<int:pk>/', views.detailOffre.as_view()),

    path('mes-offres/', views.mesOffre.as_view()),
    path('mes-offres/<int:pk>/', views.monOffre.as_view()),
    path('mes-offres/<int:pk>/candidatures/', views.CandidatureDeOffre.as_view()),

    path('candidature/', views.postuler.as_view()),
    path('mes-candidatures/', views.MesCandidature.as_view()),
    path('candidature/<int:pk>/statut/', views.changerStatut),

    path('notifications/', views.mesNotifications.as_view()),
    path('notifications/lire-tout/', views.toutLire),
    path('notifications/<int:pk>/lue/', views.notificationlue),

    path('liste-Etudiant/', views.listeEtudiant.as_view()),
    path('list-Entreprise/', views.listeEntreprise.as_view()),

    path('admin/tableau-de-bord/', views.tableauDeBord),
    path('admin/etudiants/', views.listeEtudiant.as_view()),
    path('admin/entreprises/', views.listeEntreprise.as_view()),
    path('admin/utilisateur/<int:id>/supprimer/', views.supprimerUtilisateur),
    path('admin/utilisateur/<int:id>/bannir/', views.bannirUtilisateur),
]
