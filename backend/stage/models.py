from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class User(AbstractUser):
    email=models.EmailField(max_length=200)
    ROLES=[
        ('admin','Admin'),
        ('etudiant','Etudiant'),
        ('entreprise','Entreprise'),
    ]
    role=models.CharField(max_length=200,choices=ROLES)
    #pour l'admin
    def save(self,*args,**kwargs):
        if self.is_superuser:
            self.role='admin'
        super().save(*args,**kwargs)

    def __str__(self):
        return self.email


class Etudiant(models.Model):
    user=models.OneToOneField("User",on_delete=models.CASCADE)
    code_et=models.AutoField(primary_key=True)
    nom=models.CharField(max_length=200)
    prenom=models.CharField(max_length=200)
    email=models.EmailField(max_length=200)
    Filiere=models.CharField(max_length=200)
    profile=models.ImageField(upload_to='photos/etudiant/',blank=True)

    def __str__(self):
        return self.nom 

class Entreprise(models.Model):
    user=models.OneToOneField("User",on_delete=models.CASCADE)
    Code_ent=models.AutoField(primary_key=True)
    logo=models.ImageField(upload_to='logos/')
    email=models.EmailField(max_length=200)
    nom=models.CharField(max_length=200)
    ville=models.CharField(max_length=200)
    Adresse=models.CharField(max_length=200)
    description=models.TextField()
    
    def __str__(self):
        return self.nom
   
class Offre(models.Model):
    ref_off=models.AutoField(primary_key=True)
    Duree=models.CharField()
    Date_limite=models.DateField()
    Date_post=models.DateField(auto_now_add=True)
    choisir_statut=[('ouverte','Ouverte'),('expiree','Expiree'),('pourvue','Pourvue')]
    statut=models.CharField(max_length=200,choices=choisir_statut,default='ouverte')
    titre=models.CharField(max_length=200)
    description=models.TextField(blank=False)
    entreprise=models.ForeignKey("Entreprise",on_delete=models.PROTECT,related_name="entre")

    def __str__(self):
        return self.titre

class Candidature(models.Model):
    Code_can=models.AutoField(primary_key=True)
    choisir=[('en_attente','En_attente'),('acceptee','Acceptee'),('refusee','Refusee')]
    statut=models.CharField(choices=choisir,default='en_attente')
    date=models.DateField(auto_now_add=True)
    cv=models.FileField(upload_to='cvs/')
    lm=models.FileField(upload_to='lms/')
    etudiant=models.ForeignKey("Etudiant",on_delete=models.CASCADE,related_name='Etude')
    offre=models.ForeignKey("Offre",on_delete=models.CASCADE,related_name='offres')
    
    def __str__(self):
        return f"{self.etudiant}->{self.offre}"

class Notifications(models.Model):
    code_n=models.AutoField(primary_key=True)
    message=models.CharField(max_length=200)
    lue=models.BooleanField(default=False)
    date_creation=models.DateField(auto_now_add=True)
    user=models.ForeignKey("User",on_delete=models.CASCADE,related_name='notif')

    def __str__(self):
        return self.message