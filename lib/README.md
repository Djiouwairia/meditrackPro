# Documentation du Dossier `lib`

Le dossier `lib` (abréviation de "library") est une collection de modules, de fonctions et de configurations réutilisables qui sont partagés à travers l'application front-end.

## Fichiers

-   `api-client.ts`: Ce fichier centralise la communication avec l'API back-end. Il contient probablement une instance pré-configurée d'un client HTTP (comme `fetch` ou `axios`) et des fonctions pour chaque point de terminaison de l'API. Cela permet de garder la logique de communication réseau propre et centralisée.

-   `auth-context.tsx`: Ce fichier implémente un [React Context](https://react.dev/learn/passing-data-deeply-with-context) pour la gestion de l'authentification. Il expose l'état de l'utilisateur connecté (par exemple, les informations de l'utilisateur, s'il est authentifié ou non) et les fonctions pour se connecter (`login`) et se déconnecter (`logout`). Les composants qui ont besoin d'accéder à l'état d'authentification peuvent utiliser ce contexte.

-   `creneaux-service.ts`: "Créneaux" signifie "plages horaires". Ce service contient la logique métier liée à la gestion des disponibilités et des rendez-vous. Il peut inclure des fonctions pour récupérer les créneaux disponibles, vérifier les conflits, ou formater les données de rendez-vous.

-   `mock-data.ts`: Ce fichier contient des données factices (mock data) qui sont utilisées pour le développement et les tests. C'est utile pour construire et tester des composants d'interface utilisateur sans avoir besoin que le back-end soit en cours d'exécution.

-   `types.ts`: Ce fichier contient les définitions de types et d'interfaces [TypeScript](https://www.typescriptlang.org/) partagées dans l'ensemble du projet. Centraliser les types ici aide à maintenir la cohérence et la sécurité des types dans la base de code.

-   `utils.ts`: Un fichier fourre-tout pour les petites fonctions utilitaires réutilisables. Un exemple courant est la fonction `cn`, qui est utilisée pour fusionner de manière conditionnelle les classes [Tailwind CSS](https://tailwindcss.com/).
