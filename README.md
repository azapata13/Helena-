# Elena

Elena est une application privée d’apprentissage hebdomadaire pour Helena. Elle transforme les devoirs de la semaine en petites activités tactiles, simples et positives.

## Lancer localement

```bash
npm install
npm run dev
```

La version de production statique se génère avec :

```bash
npm run build
```

Le dossier `dist/` pourra ensuite être téléversé dans le document root cPanel de `helena-z.ca`.

## Architecture

- `src/content/weeks/`: contenu hebdomadaire typé.
- `src/activities/`: moteurs d’activités réutilisables.
- `src/storage/progress.ts`: progression locale par semaine et activité.
- `src/services/voice.ts`: voix française avec `SpeechSynthesis`.
- `src/utils/`: génération déterministe de questions et choix.

## Ajouter une semaine

Voir `docs/ADDING_A_WEEK.md`. En pratique, la mise à jour hebdomadaire devrait surtout modifier les fichiers de contenu, pas la logique de l’application.

## cPanel

Cette V1 n’utilise pas de serveur Node, de base de données, d’authentification, d’analytique ni d’API payante. Elle est pensée pour un déploiement statique. Si des routes côté client sont ajoutées plus tard, ajoutez un fallback Apache dans `.htaccess`.
