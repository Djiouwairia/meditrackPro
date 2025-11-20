# Documentation du Dossier `backend`

Ce dossier contient le code source de l'application back-end, une API RESTful développée avec [Spring Boot](https://spring.io/projects/spring-boot).

## Architecture

Le back-end suit une architecture en couches classique pour une application Spring Boot, ce qui permet une séparation claire des préoccupations et une meilleure maintenabilité.

-   **`config`**: Contient les classes de configuration de l'application.
    -   `CorsConfig.java`: Configure le partage des ressources entre origines (CORS) pour autoriser les requêtes provenant du front-end.
    -   `SecurityConfig.java`: Gère la configuration de la sécurité, comme l'authentification et les autorisations.

-   **`controller`**: La couche d'API. Ces classes sont responsables du traitement des requêtes HTTP entrantes, de l'appel des services appropriés et du renvoi des réponses HTTP. Chaque contrôleur gère les points de terminaison pour une ressource spécifique (par exemple, `/api/consultations`, `/api/patients`).

-   **`dto` (Data Transfer Object)**: Objets de transfert de données. Ces classes définissent la structure des données échangées entre le client et le serveur. Elles permettent de dissocier le modèle de données interne de l'API exposée.

-   **`entity`**: Les entités JPA. Ces classes sont des représentations des tables de la base de données. Elles sont utilisées par Spring Data JPA pour effectuer des opérations sur la base de données.

-   **`exception`**: Gestion des erreurs.
    -   `GlobalExceptionHandler.java`: Un gestionnaire d'exceptions global qui intercepte les exceptions lancées par l'application et les transforme en réponses HTTP claires et standardisées.

-   **`repository`**: Les dépôts Spring Data JPA. Ces interfaces fournissent une abstraction pour l'accès aux données. Elles offrent des méthodes CRUD (Create, Read, Update, Delete) prêtes à l'emploi et permettent de définir des requêtes personnalisées.

-   **`service`**: La couche de service. C'est ici que réside la logique métier de l'application. Les services coordonnent les opérations, en utilisant les dépôts pour interagir avec la base de données et en appliquant les règles métier.

-   **`MeditrackProApplication.java`**: Le point d'entrée principal de l'application Spring Boot.

-   **`resources/application.properties`**: Fichier de configuration principal de Spring Boot. Il contient les paramètres de l'application, notamment les informations de connexion à la base de données, la configuration du serveur, etc.

## API Endpoints

L'API expose plusieurs points de terminaison pour gérer les différentes ressources de l'application. Pour une liste complète et interactive des points de terminaison, ainsi que pour tester l'API, vous pouvez utiliser la documentation Swagger UI.

Une fois le back-end démarré, la documentation Swagger UI est disponible à l'adresse suivante :
[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## Base de Données

L'application est configurée pour utiliser une base de données **MySQL**. Les scripts SQL pour initialiser la base de données se trouvent dans le dossier `/sql` à la racine du projet.

-   `01-create-database.sql`: Contient les instructions pour créer le schéma de la base de données et les tables.
-   `02-insert-test-data.sql`: Contient des instructions pour insérer des données de test afin de peupler l'application.