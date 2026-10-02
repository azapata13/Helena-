import type { WeekContent } from '../../types/content'

const revisionWords = [
  'canard', 'cour', 'cousin', 'cousine', 'ici', 'voici', 'porc',
  'froide', 'laide', 'froid', 'laid', 'tard', 'image', 'large', 'orange', 'sage',
  'basse', 'seule', 'suivre', 'seul', 'sortir', 'sur', 'amuser', 'rose', 'bas', 'bois',
  'autour', 'haute', 'tourner', 'vite',
]

export const week20261005: WeekContent = {
  id: '2026-10-05',
  title: 'Semaine du 5 au 9 octobre',
  startDate: '2026-10-05',
  endDate: '2026-10-09',
  status: 'current',
  summary: {
    reading: 'Lire de petits livres à la maison ou à la bibliothèque; rapporter les emprunts tous les jeudis.',
    vocabulary: 'Révision du bloc 1 en jeux : cette semaine, de « canard » à « vite ».',
    writing: 'Écrire deux phrases avec les mots à l’étude et y repérer les noms communs et les déterminants.',
    math: 'Nombres de 100 à 200, additions sans retenue et tables de + et − 1 à 6.',
    grammar: 'Trouver les déterminants et les noms qu’ils accompagnent.',
  },
  vocabulary: revisionWords,
  reminders: ['Journée pédagogique le 5 octobre.', 'Rapporter les livres de bibliothèque tous les jeudis.', 'Netmath : code de classe PIPUTO.', 'La semaine prochaine : révision de « bout » à « cent ».'],
  activities: [
    { id: 'lecture-petits-livres', type: 'reading', subject: 'lecture', title: 'Mon moment lecture', prompt: 'Choisis un petit livre et lis-le avec plaisir. Rapporte les livres de bibliothèque le jeudi.', stars: 2 },
    {
      id: 'mots-a-ecouter', type: 'wordPreview', subject: 'mots', title: 'Le mur des mots sonores',
      prompt: 'Touche les mots jaunes pour les écouter. Répète-les comme un écho.', words: revisionWords, stars: 1,
    },
    {
      id: 'mots-ecoute', type: 'listenChoose', subject: 'mots', title: 'L’oreille de lynx',
      instruction: 'Écoute le mot, puis attrape le bon bouton.',
      words: ['canard', 'cour', 'cousin', 'voici', 'froid', 'image', 'large', 'orange', 'suivre', 'bois', 'autour', 'vite'], rounds: 7, stars: 3,
    },
    {
      id: 'mots-lettres-cachees', type: 'missingLetters', subject: 'mots', title: 'La lettre mystère',
      instruction: 'Une lettre s’est cachée. Trouve-la pour réparer le mot.',
      words: ['canard', 'cousine', 'froide', 'image', 'orange', 'basse', 'suivre', 'autour', 'haute', 'vite'], rounds: 6, stars: 3,
    },
    {
      id: 'mots-mini-dictee', type: 'miniDictee', subject: 'mots', title: 'La mini dictée magique',
      instruction: 'Écoute, écris le mot dans ton cahier, puis vérifie-le ici.',
      words: ['canard', 'cousin', 'froid', 'large', 'rose', 'bois', 'haute', 'vite'], rounds: 5, stars: 3,
    },
    {
      id: 'dictee-nombres-100-200', type: 'numberDictation', subject: 'maths', title: 'Le robot des nombres',
      instruction: 'Écoute le robot, puis touche le nombre que tu as entendu.', min: 100, max: 200,
      numbers: [104, 117, 126, 138, 145, 153, 164, 172, 189, 200], rounds: 7, stars: 3,
    },
    {
      id: 'additions-sans-retenue', type: 'choiceQuiz', subject: 'maths', title: 'Les coffres à additionner',
      instruction: 'Additionne les unités, puis les dizaines. Aucune retenue ne se cache ici.', audioPrompt: true,
      items: [
        { question: '23 plus 14 font combien ?', choices: ['37', '36', '47', '27'], answer: '37', hint: '3 + 4 = 7, puis 2 dizaines + 1 dizaine = 3 dizaines.' },
        { question: '41 plus 26 font combien ?', choices: ['67', '57', '77', '66'], answer: '67', hint: '1 + 6 = 7, puis 4 dizaines + 2 dizaines = 6 dizaines.' },
        { question: '52 plus 35 font combien ?', choices: ['87', '77', '88', '97'], answer: '87', hint: '2 + 5 = 7, puis 5 dizaines + 3 dizaines = 8 dizaines.' },
        { question: '64 plus 23 font combien ?', choices: ['87', '77', '88', '86'], answer: '87', hint: '4 + 3 = 7, puis 6 dizaines + 2 dizaines = 8 dizaines.' },
        { question: '132 plus 47 font combien ?', choices: ['179', '169', '189', '178'], answer: '179', hint: '2 + 7 = 9, 3 dizaines + 4 dizaines = 7 dizaines, puis garde la centaine.' },
        { question: '145 plus 32 font combien ?', choices: ['177', '167', '187', '176'], answer: '177', hint: '5 + 2 = 7, 4 dizaines + 3 dizaines = 7 dizaines, puis garde la centaine.' },
      ], stars: 3,
    },
    {
      id: 'tables-plus-moins-un-six', type: 'choiceQuiz', subject: 'maths', title: 'La course des calculs',
      instruction: 'Compte avec tes doigts ou dans ta tête, puis touche la bonne réponse.', audioPrompt: true,
      items: [
        { question: '8 plus 1 font combien ?', choices: ['9', '8', '7', '10'], answer: '9', hint: 'Ajouter 1 donne le nombre suivant.' },
        { question: '11 moins 1 font combien ?', choices: ['10', '11', '9', '12'], answer: '10', hint: 'Enlever 1 donne le nombre précédent.' },
        { question: '7 plus 2 font combien ?', choices: ['9', '8', '10', '7'], answer: '9', hint: 'Avance de deux nombres à partir de 7.' },
        { question: '12 moins 3 font combien ?', choices: ['9', '8', '10', '15'], answer: '9', hint: 'Recule de trois nombres à partir de 12.' },
        { question: '6 plus 4 font combien ?', choices: ['10', '9', '11', '8'], answer: '10', hint: 'Compte quatre nombres après 6.' },
        { question: '14 moins 5 font combien ?', choices: ['9', '8', '10', '19'], answer: '9', hint: 'Recule de cinq nombres à partir de 14.' },
        { question: '8 plus 6 font combien ?', choices: ['14', '13', '15', '12'], answer: '14', hint: 'Compte six nombres après 8.' },
        { question: '15 moins 6 font combien ?', choices: ['9', '8', '10', '21'], answer: '9', hint: 'Recule de six nombres à partir de 15.' },
      ], stars: 3,
    },
    {
      id: 'trouver-determinants', type: 'choiceQuiz', subject: 'grammaire', title: 'Les détectives des noms',
      instruction: 'Le déterminant est le petit mot placé devant le nom. Trouve-le.', audioPrompt: true,
      items: [
        { question: 'Le canard nage. Quel est le déterminant ?', choices: ['Le', 'canard', 'nage', 'canard nage'], answer: 'Le', hint: '« Le » accompagne le nom « canard ».' },
        { question: 'Une fille lit. Quel est le déterminant ?', choices: ['Une', 'fille', 'lit', 'fille lit'], answer: 'Une', hint: '« Une » accompagne le nom « fille ».' },
        { question: 'Les livres sont rangés. Quel est le déterminant ?', choices: ['Les', 'livres', 'sont', 'rangés'], answer: 'Les', hint: '« Les » accompagne le nom « livres ».' },
        { question: 'Mon chat dort. Quel est le déterminant ?', choices: ['Mon', 'chat', 'dort', 'chat dort'], answer: 'Mon', hint: '« Mon » accompagne le nom « chat ».' },
        { question: 'Cette pomme est rouge. Quel est le déterminant ?', choices: ['Cette', 'pomme', 'est', 'rouge'], answer: 'Cette', hint: '« Cette » accompagne le nom « pomme ».' },
        { question: 'Des oiseaux chantent. Quel est le déterminant ?', choices: ['Des', 'oiseaux', 'chantent', 'oiseaux chantent'], answer: 'Des', hint: '« Des » accompagne le nom « oiseaux ».' },
      ], stars: 3,
    },
    {
      id: 'ecriture-deux-phrases', type: 'writing', subject: 'ecriture', title: 'Mes deux phrases',
      prompt: 'Choisis deux mots du mur sonore et écris deux phrases dans ton cahier. Entoure les noms communs et souligne leurs déterminants.',
      checklist: ['Une majuscule au début', 'Des espaces entre les mots', 'Un point à la fin', 'Les noms sont entourés', 'Les déterminants sont soulignés'], stars: 2,
    },
    {
      id: 'determinants-et-noms', type: 'writing', subject: 'grammaire', title: 'Cinq équipes de mots',
      prompt: 'Dans ton cahier, écris cinq équipes formées d’un déterminant et d’un nom. Exemple : « un canard ». Tu peux regarder la page 16 de l’aide-mémoire de Majesté.',
      checklist: ['Cinq déterminants', 'Un nom avec chaque déterminant'], stars: 2,
    },
    { id: 'netmath', type: 'reading', subject: 'maths', title: 'Mon petit défi Netmath', prompt: 'Si tu veux encore jouer avec les nombres, ouvre Netmath avec le code PIPUTO.', required: false, stars: 1 },
  ],
}
