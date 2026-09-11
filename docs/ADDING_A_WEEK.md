# Ajouter une semaine

Les semaines vivent dans `src/content/weeks/`. Pour ajouter une semaine, copiez `src/content/weeks/_template.ts`, renommez le fichier avec la date du lundi, puis exportez la semaine dans `src/content/index.ts`.

## Étapes

1. Créer `src/content/weeks/YYYY-MM-DD.ts`.
2. Remplir `id`, `title`, `startDate`, `endDate`, `summary`, `vocabulary` et `activities`.
3. Importer la nouvelle semaine dans `src/content/index.ts`.
4. Ajouter la semaine au tableau `weeks`.
5. Lancer `npm run build`.

## Types d’activités

- `reading`: lecture faite hors ligne avec bouton “J’ai terminé”.
- `writing`: écriture dans le cahier avec une liste de vérification.
- `missingLetters`: Helena choisit une lettre manquante.
- `listenChoose`: elle écoute un mot et choisit la bonne réponse.
- `buildWord`: elle reconstruit un mot avec des lettres.
- `findWord`: elle trouve un mot affiché.
- `miniDictee`: elle écoute et construit le mot.
- `alphabeticalOrder`: elle tape les mots dans l’ordre alphabétique.
- `nounSort`: elle choisit “Nom propre” ou “Nom commun”.
- `numberSequence`: elle complète une suite de nombres.
- `numberDictation`: elle écoute un nombre et le choisit.

Gardez les consignes courtes, les séries raisonnables et les mots adaptés à l’âge de Helena.
