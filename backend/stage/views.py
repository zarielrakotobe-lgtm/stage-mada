
from rest_framework import generics ,serializers
from .models import *
from .serializer import *
from rest_framework.decorators import api_view ,permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated,BasePermission
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from django.utils import timezone

class EstAdmin(BasePermission):
    def has_permission(self,request,view):
        return request.user.is_authenticated and request.user.role =='admin'
class EstEtudiant(BasePermission):
    def has_permission(self,request,view):
        return request.user.is_authenticated and request.user.role =='etudiant'
class EstEntreprise(BasePermission):
    def has_permission(self,request,view):
        return request.user.is_authenticated and request.user.role =='entreprise'

def creer_notification(user,message):
    Notifications.objects.create(user=user,message=message)

class Inscriptions(generics.CreateAPIView):
    serializer_class=InscriptionSerializers
    permission_classes=[AllowAny]

@api_view(['POST'])
@permission_classes([AllowAny])
def connexion(request):
    identifiant=(request.data.get('email') or '').strip()
    password=request.data.get('password') or ''
    candidats=User.objects.filter(Q(username__iexact=identifiant)|Q(email__iexact=identifiant))
    user=None
    for candidat in candidats:
        if candidat.check_password(password):
            if not candidat.is_active:
                return Response({'detail':'Votre compte a ete banni'},status=403)
            user=candidat
            break
    if user is None:
        return Response({'detail':'Email ou mot de passe incorrect'},status=400)

    if user.role == 'etudiant' and hasattr(user,'etudiant'):
        nom = f"{user.etudiant.prenom} {user.etudiant.nom}"
    elif user.role=='entreprise' and hasattr(user,'entreprise'):
        nom = user.entreprise.nom
    else:
        nom=user.username
    token =RefreshToken.for_user(user)
    return Response ({
        'access':str(token.access_token),
        'refresh':str(token),
        'role':user.role,
        'nom':nom,
    })

class listeOffres(generics.ListAPIView):
    serializer_class=OffreSerializers
    permission_classes=[AllowAny]

    def get_queryset(self):
        Offre.objects.filter(statut='ouverte',Date_limite__lt=timezone.localdate()).update(statut='expiree')
        offres=Offre.objects.filter(statut='ouverte').order_by('-ref_off')
        recherche = self.request.query_params.get('q')
        if recherche:
            offres = offres.filter(
                Q(titre__icontains=recherche) |
                Q(description__icontains=recherche) |
                Q(entreprise__nom__icontains=recherche)
            )
        return offres

class detailOffre(generics.RetrieveAPIView):
    queryset=Offre.objects.all()
    serializer_class = OffreSerializers
    permission_classes= [AllowAny]

class mesOffre(generics.ListCreateAPIView):
    serializer_class = OffreSerializers
    permission_classes = [EstEntreprise]
    
    def get_queryset(self):
        return Offre.objects.filter(entreprise = self.request.user.entreprise).order_by('-ref_off')
    
    def perform_create(self,serializer):
        serializer.save(entreprise=self.request.user.entreprise)

class monOffre(generics.RetrieveUpdateDestroyAPIView):
    serializer_class=OffreSerializers
    permission_classes=[EstEntreprise]

    def get_queryset(self):
        return Offre.objects.filter(entreprise=self.request.user.entreprise)

class postuler(generics.CreateAPIView):
    serializer_class=CandidatureSerializers
    permission_classes=[EstEtudiant]
    def perform_create(self,serializer):
        etudiant =self.request.user.etudiant
        offre=serializer.validated_data['offre']

        if offre.statut != 'ouverte':
            raise serializers.ValidationError("cette offre n'est plus ouverte")
        if offre.Date_limite < timezone.localdate():
            raise serializers.ValidationError("La date limite de cette offre est depassee.")
        if Candidature.objects.filter(etudiant=etudiant, offre=offre).exists():
            raise serializers.ValidationError("Vous avez deja postuler a cette offre.")

        serializer.save(etudiant=etudiant)

        creer_notification(offre.entreprise.user,f"Nouvelle candidature de {etudiant} pour {offre.titre}.")

class MesCandidature(generics.ListAPIView):

    serializer_class=CandidatureSerializers
    permission_classes=[EstEtudiant]
    
    def get_queryset(self):
        return Candidature.objects.filter(etudiant=self.request.user.etudiant).order_by('-Code_can')

class CandidatureDeOffre(generics.ListAPIView):
    serializer_class=CandidatureSerializers
    permission_classes=[EstEntreprise]
    
    def get_queryset(self):
        return Candidature.objects.filter(
            offre=self.kwargs['pk'],
            offre__entreprise=self.request.user.entreprise
        )

@api_view(['PATCH'])
@permission_classes([EstEntreprise])
def changerStatut(request,pk):
    try:
        cand =Candidature.objects.get(pk=pk,offre__entreprise=request.user.entreprise)
    except Candidature.DoesNotExist:
        return Response({'detail':'Candidature introuvable'},status=404)
    
    statut = request.data.get('statut')
    if statut not in ('acceptee','refusee'):
        return Response({'detail':'Statut invalid'},status=400)

    cand.statut= statut
    cand.save()

    mot = "acceptee" if statut =='acceptee' else "refuse"
    creer_notification(cand.etudiant.user,f"Votre candidature pour {cand.offre.titre} a ete {mot} par {cand.offre.entreprise}")
    return Response(CandidatureSerializers(cand,context={'request':request}).data)

class mesNotifications(generics.ListAPIView):
    serializer_class=NotificationSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        return Notifications.objects.filter(user=self.request.user).order_by('-code_n')[:30]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toutLire(request):
    Notifications.objects.filter(user=request.user,lue=False).update(lue=True)
    return Response({'ok':True})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def notificationlue(request,pk):
    Notifications.objects.filter(pk=pk,user=request.user).update(lue=True)

    return Response({'ok':True})

class listeEtudiant(generics.ListAPIView):
    
    serializer_class=EtudiantSerializer
    permission_classes=[EstAdmin]
    queryset= Etudiant.objects.all().order_by('-code_et')

class listeEntreprise(generics.ListAPIView):
    
    serializer_class=EntrepriseSerializer
    permission_classes=[EstAdmin]
    queryset=Entreprise.objects.all().order_by('-Code_ent')

@api_view(['DELETE'])
@permission_classes([EstAdmin])
def supprimerUtilisateur(request,id):
    try:
        user = User.objects.get(id=id)
    except User.DoesNotExist:
        return Response({'detail':'Utilisateur introuvable'},status=404)
    if user.role == 'admin':
        return Response({'detail':'Impossible de supprimer un admin'},status=400)
    Offre.objects.filter(entreprise__user=user).delete()
    user.delete()
    return Response({'message':'supprime'})

@api_view(['PATCH'])
@permission_classes([EstAdmin])
def bannirUtilisateur(request,id):
    try:
        user = User.objects.get(id=id)
    except User.DoesNotExist:
        return Response({'detail':'Utilisateur introuvable'},status=404)
    if user.role == 'admin':
        return Response({'detail':'Impossible de bannir un admin'},status=400)
    user.is_active = not user.is_active
    user.save()
    if user.is_active:
        return Response({'message':'reactive','actif':True})
    return Response({'message':'banni','actif':False})

@api_view(['GET'])
@permission_classes([EstAdmin])
def tableauDeBord(request):
    return Response({
        'nb_etudiants':User.objects.filter(role='etudiant').count(),
        'nb_entreprises':User.objects.filter(role='entreprise').count(),
        'nb_bannis':User.objects.filter(is_active=False).count(),
        'nb_offres':Offre.objects.count(),
        'nb_offres_ouvertes':Offre.objects.filter(statut='ouverte').count(),
        'nb_candidatures':Candidature.objects.count(),
    })
