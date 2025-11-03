🧵 Projet Backend — Gestion Atelier Meubles & Décoration

(Spring Boot + PostgreSQL + React.js Frontend)

🚀 Description

Ce backend Spring Boot constitue la partie serveur du projet de gestion d’atelier de meubles et décoration.
Il permet de gérer :

Les produits (canapés, tissus, accessoires, etc.)

Les catégories et stocks (matières premières et produits finis)

Les devis, commandes, factures et livraisons

Les rôles utilisateurs (Boss, Couturière, Community Manager, Comptable, Assistant)

Les notifications email pour certaines actions (ex : confirmation de commande)

La visualisation 3D connectée via le frontend React

🧩 Stack technique
Composant	Version	Description
Java	19	Langage principal pour le backend
Spring Boot	3.4.11	Framework backend
Maven	3.9+	Gestionnaire de dépendances
PostgreSQL	15+	Base de données relationnelle
React.js (Frontend)	18+	Interface utilisateur connectée via API REST
Node.js	18.20.8	Nécessaire pour le frontend React
npm	10.8.2	Gestionnaire de paquets du frontend
📦 Dépendances utilisées (Maven)
Dépendance	Description
Spring Web	Création d’API REST pour communication avec le frontend
Spring Data JPA	Gestion de la persistance et mapping objet-relationnel (ORM)
PostgreSQL Driver	Connexion à la base PostgreSQL
Spring Boot DevTools	Outils de développement (reload rapide)
Java Mail Sender	Envoi d’emails automatiques (notifications au boss)
Spring Security	Gestion de l’authentification et des rôles utilisateurs



⚙️ Installation et configuration
1. Cloner le projet
git clone https://github.com/mssninah/oligestion
cd projet-atelier-backend

2. Créer la base de données PostgreSQL

Dans pgAdmin ou psql :

CREATE DATABASE atelierdb;

3. Configurer application.properties

Fichier : src/main/resources/application.properties

spring.datasource.url=jdbc:postgresql://localhost:5432/atelierdb
spring.datasource.username=postgres
spring.datasource.password=ton_mot_de_passe
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Configuration du mail
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=ton_email@gmail.com
spring.mail.password=ton_mot_de_passe
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

🏗️ Structure du projet
src/
 ├─ main/
 │   ├─ java/com/atelier/backend/
 │   │   ├─ controller/      # API REST (produits, commandes, etc.)
 │   │   ├─ model/           # Entités JPA (Product, Category, User, etc.)
 │   │   ├─ repository/      # Interfaces JPA (DAO)
 │   │   ├─ service/         # Logique métier
 │   │   ├─ security/        # Configuration Spring Security et gestion des rôles
 │   │   └─ dto/             # Objets de transfert de données (optionnel)
 │   └─ resources/
 │       ├─ application.properties
 │       └─ static/          # (si fichiers statiques nécessaires)
 └─ test/                    # Tests unitaires et d’intégration

🔑 Authentification et rôles

Spring Security gère les connexions et autorisations.

Les rôles disponibles :

ROLE_BOSS

ROLE_ASSISTANT

ROLE_COUTURIERE

ROLE_COMPTABLE

ROLE_COMMUNITY_MANAGER

Chaque page frontend ou endpoint backend pourra être protégée selon le rôle.
Exemple :

@PreAuthorize("hasRole('BOSS') or hasRole('ASSISTANT')")
@GetMapping("/users")
public List<User> getAllUsers() { ... }

✉️ Notifications email

Lorsqu’une commande est confirmée, un email automatique est envoyé au boss grâce à JavaMailSender.

🧪 Lancer l’application
mvn spring-boot:run


L’API sera disponible sur :
👉 http://localhost:8080/api

🔄 Lien avec le frontend React

Le frontend React (dossier séparé) consommera les endpoints REST exposés par ce backend.
L’authentification sera gérée via JWT Token échangé entre le backend et le frontend.