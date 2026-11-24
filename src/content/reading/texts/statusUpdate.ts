import type { ReadingText } from '../types'

export const statusUpdate: ReadingText = {
  id: 'status-update',
  title: 'Writing a good status update',
  level: 'B1',
  topic: 'work',
  summary: 'Як коротко й конкретно звітувати про роботу: зроблене, поточне, блокери, ризики.',
  paragraphs: [
    'Many teams ask for a short status update every day or every week. A good update saves everyone time: your manager doesn’t need to chase you for information, and your teammates know what to expect.',
    'Keep it short and structured. First, say what you have done since the last update. Then say what you are working on now. Finally, mention any blockers — problems that stop you from moving forward and that someone else can help with.',
    'Be specific. “Working on the login page” says very little. “Finished the form validation; next I’m adding error messages; blocked by the missing API endpoint” tells the reader exactly where things stand. And if a deadline is at risk, say so early. Bad news gets worse with time.',
  ],
  glossary: [
    { term: 'status update', translation: 'короткий звіт про стан справ', partOfSpeech: 'noun' },
    { term: 'chase', translation: 'підганяти, нагадувати (щоб щось отримати)', partOfSpeech: 'verb' },
    { term: 'teammate', form: 'teammates', translation: 'колега по команді', partOfSpeech: 'noun' },
    { term: 'blocker', form: 'blockers', translation: 'блокер — перешкода, що зупиняє роботу', partOfSpeech: 'noun' },
    { term: 'move forward', form: 'moving forward', translation: 'рухатися далі, просуватися', partOfSpeech: 'phrasal verb' },
    { term: 'specific', translation: 'конкретний', partOfSpeech: 'adjective' },
    { term: 'where things stand', translation: 'як ідуть справи, на якому все етапі', partOfSpeech: 'phrase' },
    { term: 'deadline', translation: 'крайній термін, дедлайн', partOfSpeech: 'noun' },
    { term: 'at risk', translation: 'під загрозою', partOfSpeech: 'phrase' },
  ],
  questions: [
    { id: 'status-update:q1', type: 'choice', prompt: 'Why is a good status update useful?', options: ['It saves everyone time.', 'It replaces all meetings.', 'It makes the code faster.', 'It is required by law.'], answer: 0, explanation: '«A good update saves everyone time» — гарний звіт заощаджує всім час.' },
    { id: 'status-update:q2', type: 'choice', prompt: 'What is a blocker?', options: ['A finished task', 'A long meeting', 'A problem that stops you and that someone else can help with', 'A new feature'], answer: 2, explanation: 'Блокер — «problems that stop you from moving forward and that someone else can help with».' },
    { id: 'status-update:q3', type: 'choice', prompt: 'Which update does the text recommend?', options: ['“Working on the login page.”', '“Busy.”', '“Same as yesterday.”', '“Finished the form validation; next I’m adding error messages.”'], answer: 3, explanation: 'Конкретний звіт показує, що зроблено, що далі і що заважає.' },
    { id: 'status-update:q4', type: 'choice', prompt: 'What should you do if a deadline is at risk?', options: ['Wait and see', 'Say so early', 'Hide it from your manager', 'Work at night'], answer: 1, explanation: '«If a deadline is at risk, say so early. Bad news gets worse with time.»' },
  ],
}
