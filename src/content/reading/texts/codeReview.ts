import type { ReadingText } from '../types'

export const codeReview: ReadingText = {
  id: 'code-review',
  title: 'Giving and receiving code review',
  level: 'B2',
  topic: 'it',
  summary: 'Як коментувати чужий код без конфліктів і як спокійно сприймати зауваження до свого.',
  paragraphs: [
    'Code review is one of the best ways to learn on a development team, but it can also be a source of tension. The difference usually lies not in what people say, but in how they say it.',
    'When you review someone’s pull request, focus on the code, not the person. Instead of “You did this wrong”, try “What do you think about extracting this into a function?” Questions invite discussion; orders tend to shut it down. If a comment is just a matter of taste, label it as a nitpick so the author knows it isn’t a blocker.',
    'When you receive feedback, try not to take it personally. Reviewers are pointing out ways to improve the code, not judging your abilities. If you disagree, explain your reasoning politely and be open to changing your mind. And when someone’s suggestion helps you, thank them — it costs nothing and builds trust.',
  ],
  glossary: [
    { term: 'source of tension', translation: 'джерело напруги', partOfSpeech: 'phrase' },
    { term: 'pull request', translation: 'пул-реквест, запит на злиття змін', partOfSpeech: 'noun' },
    { term: 'extract', form: 'extracting', translation: 'винести (код в окрему функцію)', partOfSpeech: 'verb' },
    { term: 'shut something down', form: 'shut it down', translation: 'припинити, згорнути (розмову)', partOfSpeech: 'phrasal verb' },
    { term: 'a matter of taste', translation: 'справа смаку', partOfSpeech: 'phrase' },
    { term: 'nitpick', translation: 'дрібне зауваження, прискіпування', partOfSpeech: 'noun' },
    { term: 'take it personally', translation: 'сприймати на свій рахунок', partOfSpeech: 'phrase' },
    { term: 'point out', form: 'pointing out', translation: 'вказувати на', partOfSpeech: 'phrasal verb' },
    { term: 'reasoning', translation: 'міркування, аргументація', partOfSpeech: 'noun' },
    { term: 'build trust', form: 'builds trust', translation: 'зміцнювати довіру', partOfSpeech: 'phrase' },
  ],
  questions: [
    { id: 'code-review:q1', type: 'choice', prompt: 'According to the text, what usually causes tension in code review?', options: ['What people say', 'The programming language', 'How people say it', 'The size of the team'], answer: 2, explanation: '«The difference usually lies not in what people say, but in how they say it.»' },
    { id: 'code-review:q2', type: 'choice', prompt: 'Why does the author suggest asking questions instead of giving orders?', options: ['Questions invite discussion.', 'Questions are shorter.', 'Orders are against the rules.', 'Questions hide problems.'], answer: 0, explanation: '«Questions invite discussion; orders tend to shut it down.»' },
    { id: 'code-review:q3', type: 'choice', prompt: 'What is a nitpick?', options: ['A serious bug', 'A failed test', 'A new pull request', 'A comment about taste that isn’t a blocker'], answer: 3, explanation: 'Nitpick — дрібне зауваження «справа смаку», яке не блокує злиття.' },
    { id: 'code-review:q4', type: 'choice', prompt: 'What should you do if you disagree with a reviewer?', options: ['Ignore the comment', 'Explain your reasoning politely', 'Close the pull request', 'Ask your manager to decide'], answer: 1, explanation: '«If you disagree, explain your reasoning politely and be open to changing your mind.»' },
  ],
}
