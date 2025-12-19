# 🎓 Gestion Alumni – Application Full Stack (Spring Boot + Angular)

## 📌 Description générale

**Gestion Alumni** est une application web full stack développée dans le cadre d’un projet académique.  
Elle permet de gérer une plateforme d’échange et de suivi entre **étudiants**, **anciens élèves (alumni)**, **professeurs** et **administrateurs**.

L’application repose sur une architecture **client–serveur** :
- **Backend** : Spring Boot (REST API)
- **Frontend** : Angular

---

## 🏗️ Architecture du projet

Projet full stack (springboot + angular)
│
├── Backend/ # Application Spring Boot
│ ├── src/main/java
│ │ └── com.gestionAlumni.gestionAlumni
│ │ ├── Entities/ # Entités JPA (User, Student, Alumni, etc.)
│ │ └── GestionAlumniApplication.java
│ ├── src/main/resources
│ │ └── application.properties
│ ├── pom.xml
│ └── mvnw
│
├── Frontend/ # Application Angular
│ ├── src/app
│ │ ├── homepage/
│ │ ├── login/
│ │ ├── signup/
│ │ ├── profile/
│ │ ├── services/
│ │ └── models/
│ ├── angular.json
│ ├── package.json
│ └── proxy.conf.json
│
└── README.md

markdown
Copier le code

---

## ⚙️ Technologies utilisées

### Backend
- Java 17+
- Spring Boot
- Spring Data JPA
- Hibernate
- Maven
- Base de données relationnelle (MySQL / H2 selon configuration)

### Frontend
- Angular
- TypeScript
- HTML / CSS
- Angular Services & Components

### Outils
- Git & GitHub
- IntelliJ IDEA / VS Code
- Postman (tests API)

---

## 👥 Gestion des rôles

L’application gère plusieurs types d’utilisateurs :

- **Administrator**
  - Gestion globale de la plateforme
  - Validation et supervision des comptes

- **Student**
  - Inscription
  - Consultation des profils alumni

- **Alumni**
  - Création et mise à jour du profil
  - Interaction avec les étudiants

- **Professor**
  - Suivi académique
  - Interaction avec les alumni et étudiants

---

## 🧩 Backend – Spring Boot

### Entités principales
- `User` (classe mère)
- `Student`
- `Alumni`
- `Professor`
- `Administrator`

Chaque entité est mappée avec **JPA/Hibernate** et persistée en base de données.

### Configuration
Le fichier :
Backend/src/main/resources/application.properties

yaml
Copier le code
contient la configuration :
- base de données
- port serveur
- paramètres JPA

---

## 🎨 Frontend – Angular

### Fonctionnalités principales
- Page d’accueil
- Authentification (login / signup)
- Profils utilisateurs
- Tableau de bord
- Gestion des conversations et messages
- Interface responsive

### Communication avec le backend
- Services Angular
- DTOs (`user.dto.ts`, `message.dto.ts`, etc.)
- Proxy Angular pour éviter les problèmes CORS

---

## ▶️ Lancement du projet

### 1️⃣ Lancer le Backend

```bash
cd Backend
./mvnw spring-boot:run
Le backend démarre par défaut sur :

arduino
Copier le code
http://localhost:8080
2️⃣ Lancer le Frontend
bash
Copier le code
cd Frontend
npm install
ng serve
Le frontend est accessible sur :

arduino
Copier le code
http://localhost:4200
🧪 Tests
Tests unitaires Spring Boot (JUnit)

Tests Angular (*.spec.ts)

Tests API via Postman

📚 Objectifs pédagogiques
Maîtrise d’une architecture full stack

Séparation claire frontend / backend

Utilisation de Spring Boot et Angular

Gestion des rôles utilisateurs

Utilisation de Git et GitHub

Respect des bonnes pratiques de développement

👩‍💻 Auteur
Mayssa
Projet académique – Développement Full Stack
Spring Boot & Angular

