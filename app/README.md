# Documentation du Dossier `app`

Ce dossier contient le cœur de l'application front-end, en utilisant le [App Router](https://nextjs.org/docs/app) de Next.js. Chaque dossier représente un segment de route, et les fichiers `page.tsx` définissent le contenu de chaque page.

## Structure des Fichiers

-   `layout.tsx`: Le layout principal de l'application. Il englobe toutes les pages et est utilisé pour définir la structure globale de l'interface, comme la balise `<html>` et `<body>`.
-   `globals.css`: Contient les styles globaux de l'application.
-   `page.tsx`: La page d'accueil de l'application, accessible à la racine (`/`).

## Routage

Le routage est basé sur la structure des dossiers. Voici un aperçu des routes principales et de leur fonction :

### Routes Publiques

-   `/`: **Page d'accueil** (`app/page.tsx`)
    -   La page de destination principale pour les visiteurs.
-   `/login`: **Page de connexion** (`app/login/page.tsx`)
    -   Permet aux utilisateurs de se connecter à leur compte.
-   `/inscription`: **Page d'inscription** (`app/inscription/page.tsx`)
    -   Permet aux nouveaux utilisateurs de créer un compte.

### Routes du Tableau de Bord (`/dashboard`)

Le dossier `dashboard` contient toutes les pages accessibles après qu'un utilisateur se soit connecté. Le fichier `dashboard/layout.tsx` définit la structure commune de ces pages, incluant probablement une barre de navigation latérale et un en-tête.

-   `/dashboard`: **Tableau de bord principal** (`app/dashboard/page.tsx`)
    -   La page d'accueil du tableau de bord, affichant un aperçu des informations importantes.

-   `/dashboard/consultations`: **Gestion des consultations**
    -   `page.tsx`: Affiche la liste des consultations.
    -   `/nouvelle`: Page pour créer une nouvelle consultation.
    -   `/[id]`: Affiche les détails d'une consultation spécifique.
    -   `/[id]/edit`: Page pour modifier une consultation existante.

-   `/dashboard/disponibilites`: **Gestion des disponibilités**
    -   Permet aux médecins de gérer leur calendrier de disponibilités.

-   `/dashboard/dossier-medical`: **Dossiers médicaux**
    -   Affiche et gère les dossiers médicaux des patients.

-   `/dashboard/medecins`: **Liste des médecins**
    -   `page.tsx`: Affiche la liste de tous les médecins.
    -   `/[id]`: Affiche le profil public d'un médecin spécifique.
    -   `/profil`: Page où le médecin peut voir et modifier son propre profil.

-   `/dashboard/mes-patients`: **Mes patients**
    -   Permet aux médecins de voir la liste de leurs patients.

-   `/dashboard/mes-rendez-vous`: **Mes rendez-vous**
    -   Affiche la liste des rendez-vous à venir pour l'utilisateur connecté (patient ou médecin).

-   `/dashboard/parametres`: **Paramètres du compte**
    -   Permet à l'utilisateur de modifier les paramètres de son compte.

-   `/dashboard/profil`: **Profil utilisateur**
    -   Affiche et permet de modifier les informations du profil de l'utilisateur connecté.

-   `/dashboard/rendez-vous`: **Prise de rendez-vous**
    -   Permet aux patients de prendre un nouveau rendez-vous avec un médecin.

-   `/dashboard/statistiques`: **Statistiques**
    -   Affiche des statistiques sur l'activité de la clinique (nombre de rendez-vous, etc.).

-   `/dashboard/utilisateurs`: **Gestion des utilisateurs**
    -   Permet aux administrateurs de gérer les comptes utilisateurs.

## Fichiers Spéciaux de Next.js

-   `layout.tsx`: Fichier qui définit une interface utilisateur partagée pour un segment et ses enfants.
-   `page.tsx`: Fichier qui définit l'interface utilisateur unique d'une route.
-   `loading.tsx`: Fichier qui définit une interface utilisateur de chargement à afficher pendant le chargement d'une page ou d'un layout enfant.
