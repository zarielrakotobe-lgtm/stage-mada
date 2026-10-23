from rest_framework import serializers
from .models import *
from django.utils import timezone
from django.db import transaction


class EtudiantSerializer(serializers.ModelSerializer):
    actif = serializers.BooleanField(source='user.is_active', read_only=True)

    class Meta:
        model = Etudiant
        fields = '__all__'


class EntrepriseSerializer(serializers.ModelSerializer):
    actif = serializers.BooleanField(source='user.is_active', read_only=True)

    class Meta:
        model = Entreprise
        fields = '__all__'


class InscriptionSerializers(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(choices=[('etudiant', 'Etudiant'), ('entreprise', 'Entreprise')])
    nom = serializers.CharField(write_only=True)
    prenom = serializers.CharField(write_only=True, required=False)
    Filiere = serializers.CharField(write_only=True, required=False)
    ville = serializers.CharField(write_only=True, required=False)
    Adresse = serializers.CharField(write_only=True, required=False)
    description = serializers.CharField(write_only=True, required=False, allow_blank=True)
    profile = serializers.ImageField(write_only=True, required=False)
    logo = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['email', 'password', 'role', 'nom', 'prenom', 'Filiere', 'ville', 'Adresse', 'description', 'profile', 'logo']

    def validate_email(self, valeur):
        if User.objects.filter(username__iexact=valeur).exists():
            raise serializers.ValidationError("Cet email est deja utilise.")
        return valeur

    def validate(self, data):
        if data['role'] == 'etudiant':
            manque = [c for c in ('prenom', 'Filiere') if not data.get(c)]
        else:
            manque = [c for c in ('ville', 'Adresse') if not data.get(c)]
        if manque:
            raise serializers.ValidationError({c: "Ce champ est obligatoire." for c in manque})
        return data

    @transaction.atomic
    def create(self, data):
        role = data['role']
        user = User(username=data['email'], email=data['email'], role=role)
        user.set_password(data['password'])
        user.save()

        if role == 'etudiant':
            Etudiant.objects.create(
                user=user,
                nom=data['nom'],
                prenom=data['prenom'],
                email=data['email'],
                Filiere=data['Filiere'],
                profile=data.get('profile') or '')
        else:
            Entreprise.objects.create(
                user=user,
                nom=data['nom'],
                email=data['email'],
                ville=data['ville'],
                Adresse=data['Adresse'],
                description=data.get('description', ''),
                logo=data.get('logo') or '')
        return user


class OffreSerializers(serializers.ModelSerializer):
    nom_ent = serializers.CharField(source='entreprise.nom', read_only=True)
    ville_ent = serializers.CharField(source='entreprise.ville', read_only=True)
    nb_candidatures = serializers.IntegerField(source='offres.count', read_only=True)

    class Meta:
        model = Offre
        fields = '__all__'
        read_only_fields = ['entreprise', 'Date_post']

    def validate_Date_limite(self, valeur):
        if valeur < timezone.localdate():
            raise serializers.ValidationError("La date limite doit etre dans le futur.")
        return valeur


class CandidatureSerializers(serializers.ModelSerializer):
    offre_titre = serializers.CharField(source='offre.titre', read_only=True)
    nom_ent = serializers.CharField(source='offre.entreprise.nom', read_only=True)
    etudiant_nom = serializers.SerializerMethodField()
    etudiant_email = serializers.CharField(source='etudiant.email', read_only=True)
    etudiant_Filiere = serializers.CharField(source='etudiant.Filiere', read_only=True)

    class Meta:
        model = Candidature
        fields = '__all__'
        read_only_fields = ['etudiant', 'statut', 'date']

    def get_etudiant_nom(self, obj):
        return f"{obj.etudiant.prenom} {obj.etudiant.nom}"


class NotificationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='code_n', read_only=True)

    class Meta:
        model = Notifications
        fields = ['id', 'message', 'lue', 'date_creation']
