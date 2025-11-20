# Documentation du Dossier `components`

Ce dossier contient tous les composants React réutilisables de l'application. Il est organisé en deux catégories principales : les composants métier spécifiques à l'application et les composants d'interface utilisateur génériques.

## Composants Métier

Ces composants sont spécifiques à la logique et aux fonctionnalités de l'application MediTrack Pro.

-   `appointment-calendar.tsx`: Affiche un calendrier interactif pour visualiser et gérer les rendez-vous.
-   `book-appointment-dialog.tsx`: Une boîte de dialogue modale qui permet aux patients de réserver un nouveau rendez-vous.
-   `consultation-detail-view.tsx`: Un composant qui affiche les détails complets d'une consultation.
-   `consultation-form.tsx`: Un formulaire utilisé pour créer ou modifier une consultation.
-   `dashboard-nav.tsx`: La barre de navigation latérale utilisée dans le tableau de bord. Elle contient les liens vers les différentes sections du tableau de bord.
-   `login-form.tsx`: Le formulaire de connexion utilisé sur la page `/login`.
-   `logo.tsx`: Un composant simple pour afficher le logo de l'application.
-   `theme-provider.tsx`: Un composant qui enveloppe l'application pour fournir la fonctionnalité de changement de thème (par exemple, clair/sombre).

## Composants d'Interface Utilisateur (`/ui`)

Le sous-dossier `ui` contient une collection de composants d'interface utilisateur de bas niveau, réutilisables et stylisés. Ces composants sont basés sur la bibliothèque [shadcn/ui](https://ui.shadcn.com/), qui fournit des primitives d'interface utilisateur accessibles et personnalisables construites sur [Radix UI](https://www.radix-ui.com/) et stylisées avec [Tailwind CSS](https://tailwindcss.com/).

Exemples de composants que vous trouverez dans ce dossier :

-   `button.tsx`
-   `card.tsx`
-   `dialog.tsx`
-   `input.tsx`
-   `table.tsx`
-   Et bien d'autres...

Ces composants sont les blocs de construction de base de l'interface utilisateur de l'application. Pour plus d'informations sur l'utilisation de chaque composant, veuillez vous référer à la documentation de [shadcn/ui](https://ui.shadcn.com/docs/components).
