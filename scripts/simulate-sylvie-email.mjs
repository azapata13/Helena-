const sampleEmail = `
De: Sylvie Guénette
Objet: Devoirs Helena - semaine du 21 au 25 septembre

Bonjour,

Voici les devoirs pour la semaine du 21 au 25 septembre.

Lecture: lire un petit livre à la maison 10 minutes par soir.
Mots de vocabulaire: grand, grande, long, longue, rond, ronde, blond, blonde.
Écriture: écrire deux phrases avec des mots de la semaine.
Mathématiques: pratiquer les nombres de 0 à 100, suites de +2, +5 et +10.
Grammaire: revoir les noms propres et les noms communs.

Merci,
Mme Sylvie
`

function matchLine(label) {
  const match = sampleEmail.match(new RegExp(`${label}:\\s*(.+)`, 'i'))
  return match?.[1]?.trim() ?? ''
}

function parseWeekRange() {
  const match = sampleEmail.match(/semaine du (\d{1,2}) au (\d{1,2}) septembre/i)
  if (!match) return { title: 'Semaine simulée', startDate: '2026-09-21', endDate: '2026-09-25' }

  const startDay = match[1].padStart(2, '0')
  const endDay = match[2].padStart(2, '0')
  return {
    title: `Semaine du ${Number(match[1])} au ${Number(match[2])} septembre`,
    startDate: `2026-09-${startDay}`,
    endDate: `2026-09-${endDay}`,
  }
}

function parseWords() {
  return matchLine('Mots de vocabulaire')
    .replace(/\\.$/, '')
    .split(',')
    .map((word) => word.trim().replace(/[.!?;:]$/, ''))
    .filter(Boolean)
}

const week = parseWeekRange()
const vocabulary = parseWords()
const preview = {
  id: week.startDate,
  title: week.title,
  startDate: week.startDate,
  endDate: week.endDate,
  summary: {
    reading: matchLine('Lecture'),
    vocabulary: `Mots à travailler: ${vocabulary.join(', ')}.`,
    writing: matchLine('Écriture'),
    math: matchLine('Mathématiques'),
    grammar: matchLine('Grammaire'),
  },
  vocabulary,
  plannedActivities: [
    'reading',
    'wordPreview',
    'missingLetters',
    'listenChoose',
    'buildWord',
    'miniDictee',
    'alphabeticalOrder',
    'nounSort',
    'numberSequence',
    'numberDictation',
    'writing',
  ],
}

console.log('Simulation du courriel de Mme Sylvie')
console.log('--------------------------------------')
console.log(sampleEmail.trim())
console.log('\nExtraction proposée')
console.log('-------------------')
console.log(JSON.stringify(preview, null, 2))
console.log('\nCe script est un test seulement: il ne modifie pas src/content.')
