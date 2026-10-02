import type { WeekContent } from '../../types/content'

export const week20260928: WeekContent = {
  id: '2026-09-28',
  title: 'Semaine du 28 septembre au 2 octobre',
  startDate: '2026-09-28',
  endDate: '2026-10-02',
  status: 'past',
  summary: {
    reading: 'Lire de petits livres à la maison ou à la bibliothèque; rapporter les emprunts tous les jeudis.',
    vocabulary: 'Apprendre en jouant avec les verbes être, avoir et aimer au présent.',
    writing: 'Écrire deux phrases avec les mots à l’étude dans le petit cahier de devoirs.',
    math: 'Décomposer les nombres jusqu’à 100 en dizaines et unités; reconnaître les mots de position.',
  },
  reminders: ['Photo le 2 octobre.', 'Rapporter les livres de bibliothèque tous les jeudis.', 'Netmath : code de classe PIPUTO.'],
  activities: [
    { id: 'lecture-petits-livres', type: 'reading', subject: 'lecture', title: 'Mon moment lecture', prompt: 'Choisis un petit livre et lis-le avec plaisir. Rapporte les livres de bibliothèque le jeudi.', stars: 2 },
    {
      id: 'verbes-a-ecouter', type: 'wordPreview', subject: 'mots', title: 'Les verbes en musique',
      prompt: 'Touche chaque bouton, écoute, puis répète la petite formule.',
      words: ['je suis', 'tu es', 'il est', 'nous sommes', 'vous êtes', 'ils sont', 'j’ai', 'tu as', 'elle a', 'nous avons', 'vous avez', 'elles ont', 'j’aime', 'tu aimes', 'on aime', 'nous aimons', 'vous aimez', 'ils aiment'],
      stars: 1,
    },
    {
      id: 'verbes-au-present', type: 'choiceQuiz', subject: 'mots', title: 'La fusée des verbes',
      instruction: 'Écoute si tu veux, puis choisis le morceau qui complète la phrase.', audioPrompt: true,
      items: [
        { question: 'Je ... contente.', choices: ['suis', 'es', 'sommes', 'sont'], answer: 'suis', hint: 'Dis la phrase à voix haute : je suis contente.' },
        { question: 'Nous ... à l’école.', choices: ['sommes', 'êtes', 'sont', 'est'], answer: 'sommes', hint: 'Avec nous, être devient « sommes ».' },
        { question: 'Tu ... un livre.', choices: ['as', 'ai', 'a', 'ont'], answer: 'as', hint: 'Dis la phrase à voix haute : tu as un livre.' },
        { question: 'Elles ... deux crayons.', choices: ['ont', 'avons', 'avez', 'a'], answer: 'ont', hint: 'Avec elles, avoir devient « ont ».' },
        { question: 'J’... les histoires.', choices: ['aime', 'aimes', 'aimons', 'aimez'], answer: 'aime', hint: 'Avec je, aimer devient « aime ».' },
        { question: 'Vous ... les jeux.', choices: ['aimez', 'aimons', 'aiment', 'aimes'], answer: 'aimez', hint: 'Avec vous, aimer devient « aimez ».' },
      ], stars: 3,
    },
    {
      id: 'dizaines-unites', type: 'choiceQuiz', subject: 'maths', title: 'Le coffre des nombres',
      instruction: 'Ouvre le bon coffre : regarde les dizaines et les unités.', audioPrompt: true,
      items: [
        { question: 'Quel coffre contient 34 ?', choices: ['3 dizaines et 4 unités', '4 dizaines et 3 unités', '30 dizaines et 4 unités', '3 dizaines et 3 unités'], answer: '3 dizaines et 4 unités', hint: 'Dans 34, le 3 montre les dizaines et le 4 montre les unités.' },
        { question: 'Quel nombre font 6 dizaines et 2 unités ?', choices: ['62', '26', '60', '68'], answer: '62', hint: 'Six dizaines font 60. Ajoute 2 unités.' },
        { question: 'Quelle somme construit 47 ?', choices: ['40 + 7', '70 + 4', '40 + 4', '30 + 7'], answer: '40 + 7', hint: 'Le 4 représente 40 et le 7 représente 7.' },
        { question: 'Quel nombre font 8 dizaines et 5 unités ?', choices: ['85', '58', '80', '75'], answer: '85', hint: 'Huit dizaines font 80. Ajoute 5 unités.' },
        { question: 'Quelle somme construit 93 ?', choices: ['90 + 3', '30 + 9', '90 + 9', '80 + 3'], answer: '90 + 3', hint: 'Le 9 représente 90 et le 3 représente 3.' },
        { question: 'Quel nombre font 10 dizaines et 0 unité ?', choices: ['100', '10', '0', '90'], answer: '100', hint: 'Dix groupes de dix font 100.' },
      ], stars: 3,
    },
    {
      id: 'mots-de-position', type: 'choiceQuiz', subject: 'maths', title: 'La chasse au trésor',
      instruction: 'Aide le chat à suivre les indices de position.', audioPrompt: true,
      items: [
        { question: 'Le chat est ⬆️ de la boîte. Où est-il ?', choices: ['au-dessus', 'au-dessous', 'derrière', 'à gauche'], answer: 'au-dessus', hint: 'La flèche monte : le chat est au-dessus.' },
        { question: 'La balle est ⬇️ de la chaise. Où est-elle ?', choices: ['au-dessous', 'au-dessus', 'devant', 'à droite'], answer: 'au-dessous', hint: 'La flèche descend : la balle est au-dessous.' },
        { question: 'Le trésor est dans le coffre. Il est à...', choices: ['l’intérieur', 'l’extérieur', 'gauche', 'autour'], answer: 'l’intérieur', hint: 'Ce qui est dedans est à l’intérieur.' },
        { question: 'Le chien est hors de la maison. Il est à...', choices: ['l’extérieur', 'l’intérieur', 'droite', 'derrière'], answer: 'l’extérieur', hint: 'Ce qui est dehors est à l’extérieur.' },
        { question: 'Une ligne couchée est...', choices: ['horizontale', 'verticale', 'derrière', 'autour'], answer: 'horizontale', hint: 'Une ligne horizontale va de gauche à droite.' },
        { question: 'Une ligne debout est...', choices: ['verticale', 'horizontale', 'devant', 'autour'], answer: 'verticale', hint: 'Une ligne verticale va du haut vers le bas.' },
      ], stars: 3,
    },
    { id: 'ecriture-deux-phrases', type: 'writing', subject: 'ecriture', title: 'Mes deux phrases', prompt: 'Choisis deux mots à l’étude et écris deux petites phrases dans ton cahier.', checklist: ['Une majuscule au début', 'Des espaces entre les mots', 'Un point à la fin'], stars: 2 },
    { id: 'netmath', type: 'reading', subject: 'maths', title: 'Mon petit défi Netmath', prompt: 'Si tu veux encore jouer avec les nombres, ouvre Netmath avec le code PIPUTO.', required: false, stars: 1 },
  ],
}
