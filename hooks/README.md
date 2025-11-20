# Documentation du Dossier `hooks`

Ce dossier contient des [hooks React](https://react.dev/reference/react) personnalisés qui encapsulent et réutilisent la logique avec état à travers différents composants de l'application.

## Hooks Disponibles

-   `use-mobile.ts`: Un hook simple qui détecte si l'application est actuellement affichée sur un appareil mobile. Il se base généralement sur la largeur de la fenêtre du navigateur.

-   `use-toast.ts`: Un hook qui fournit une fonction pour afficher des notifications de type "toast". Il est probablement utilisé en conjonction avec un composant de "toaster" (comme `sonner` ou `react-toastify`) pour afficher des messages d'information, de succès ou d'erreur à l'utilisateur.

-   `useMedecinProfile.ts`: Un hook personnalisé pour récupérer et gérer les données du profil d'un médecin. Il gère probablement l'état de chargement, les erreurs et les données du profil, et peut inclure des fonctions pour mettre à jour le profil.

-   `usePatientProfile.ts`: Similaire à `useMedecinProfile.ts`, ce hook est responsable de la récupération et de la gestion des données du profil d'un patient.
