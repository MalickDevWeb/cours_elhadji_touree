# INSTRUCTIONS CRITIQUES POUR LES MODÈLES DE LANGAGE (GEMINI)

Vous devez obligatoirement :
1. Lire le fichier `/skils.md` à la racine avant toute modification de code.
2. Respecter la contrainte absolue de **105 lignes maximum par fichier** pour tous les fichiers `.tsx` et `.ts` (les fichiers de mocks/fixtures statiques purs peuvent faire jusqu'à **200 lignes**).
3. Structurer tout nouveau module ou refactorisation selon l'**Architecture Hexagonale** définie dans `/skils.md`.
4. Éviter d'accumuler de la logique et du rendu dans `src/App.tsx`. `src/App.tsx` doit être un simple routeur ou conteneur d'assemblage d'une taille de moins de 105 lignes.
