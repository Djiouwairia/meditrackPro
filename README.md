# Documentation du Projet MediTrack Pro

Bienvenue dans la documentation du projet MediTrack Pro. Ce document fournit une vue d'ensemble du projet, de son architecture, et des instructions pour le faire fonctionner en local.

## À Propos du Projet

MediTrack Pro est une application web complète de gestion hospitalière. Elle permet de gérer les rendez-vous, les dossiers des patients, les disponibilités des médecins, et bien plus encore. L'application est conç'ue pour être intuitive et facile à utiliser, tant pour les patients que pour le personnel médical.

## Architecture

Le projet est divisé en deux parties principales :

-   **Front-end :** Une application web développée avec [Next.js](https://nextjs.org/), un framework React populaire pour le rendu côté serveur et la génération de sites statiques. L'interface utilisateur est construite avec [shadcn/ui](https://ui.shadcn.com/), une collection de composants d'interface utilisateur réutilisables, et stylisée avec [Tailwind CSS](https://tailwindcss.com/).
-   **Back-end :** Une API RESTful développée avec [Spring Boot](https://spring.io/projects/spring-boot), un framework Java qui simplifie la création d'applications robustes et performantes. Le back-end utilise [Spring Data JPA](https://spring.io/projects/spring-data-jpa) pour interagir avec une base de données [MySQL](https://www.mysql.com/).

## Démarrage Rapide

Suivez les instructions ci-dessous pour lancer le projet sur votre machine locale.

### Prérequis

Assurez-vous d'avoir les outils suivants installés :

-   [Node.js](https://nodejs.org/) (version 22 ou supérieure)
-   [npm](https://www.npmjs.com/) (généralement inclus avec Node.js)
-   [Java Development Kit (JDK)](https://www.oracle.com/java/technologies/downloads/) (version 17 ou supérieure)
-   [Maven](https://maven.apache.org/download.cgi)
-   [MySQL](https://dev.mysql.com/downloads/installer/)

### Installation et Lancement du Front-end

1.  **Naviguez vers la racine du projet** :
    ```bash
    cd chemin/vers/votre/projet
    ```

2.  **Installez les dépendances** :
    ```bash
    npm install
    ```

3.  **Lancez le serveur de développement** :
    ```bash
    npm run dev
    ```

    L'application front-end sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

### Installation et Lancement du Back-end

1.  **Naviguez vers le dossier du back-end** :
    ```bash
    cd backend
    ```

2.  **Configurez la base de données** :
    -   Créez une base de données MySQL nommée `meditrack_pro`.
    -   Mettez à jour les informations de connexion à la base de données dans le fichier `src/main/resources/application.properties` si nécessaire.

3.  **Exécutez les scripts SQL** :
    -   Importez les fichiers `sql/01-create-database.sql` et `sql/02-insert-test-data.sql` dans votre base de données pour initialiser le schéma et insérer des données de test.

4.  **Lancez l'application Spring Boot** :
    ```bash
    mvn spring-boot:run
    ```

    L'API back-end sera accessible à l'adresse [http://localhost:8080](http://localhost:8080). Vous pouvez consulter la documentation de l'API (Swagger UI) à l'adresse [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html).

## Structure du Projet

-   `/.next`: Fichiers de build de Next.js.
-   `/app`: Contient les pages et les layouts de l'application Next.js.
-   `/backend`: Contient le code source de l'application back-end Spring Boot.
-   `/components`: Contient les composants React réutilisables.
-   `/hooks`: Contient les hooks React personnalisés.
-   `/lib`: Contient les fonctions utilitaires, le client API, et le contexte d'authentification.
-   `/public`: Contient les fichiers statiques (images, icônes, etc.).
-   `/styles`: Contient les styles globaux de l'application.

Pour une documentation plus détaillée de chaque partie du projet, veuillez consulter les fichiers `README.md` présents dans les sous-dossiers respectifs.
