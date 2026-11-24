import type { ReadingText } from '../types'

export const firstWeek: ReadingText = {
  id: 'first-week-at-work',
  title: 'My first week at a new job',
  level: 'B1',
  topic: 'work',
  summary: 'Перший тиждень junior-розробника: знайомство з командою, перший баг і висновки.',
  paragraphs: [
    'Last Monday I started a new job as a junior frontend developer. I was nervous, but my team made me feel welcome. My manager, Anna, showed me around the office and introduced me to everyone.',
    'On the first day I didn’t write any code. Instead, I set up my laptop, got access to the tools we use and read the documentation. Anna also gave me a mentor, Tom, who answers my questions and helps me when I get stuck.',
    'By Thursday I had fixed my first small bug. It was only one line of CSS, but it felt great to see my change go live. On Friday we had a short meeting to discuss what went well and what I could improve. My goal for next week is to ask for help earlier instead of trying to solve everything on my own.',
  ],
  glossary: [
    { term: 'nervous', translation: 'знервований, схвильований', partOfSpeech: 'adjective' },
    { term: 'make someone feel welcome', form: 'made me feel welcome', translation: 'тепло прийняти, дати відчути себе своїм', partOfSpeech: 'phrase' },
    { term: 'show someone around', form: 'showed me around', translation: 'показати все (у приміщенні), провести', partOfSpeech: 'phrasal verb' },
    { term: 'get access to', form: 'got access to', translation: 'отримати доступ до', partOfSpeech: 'phrase' },
    { term: 'get stuck', translation: 'застрягти, не знати, як рухатися далі', partOfSpeech: 'phrase' },
    { term: 'bug', translation: 'помилка в програмі, баг', partOfSpeech: 'noun' },
    { term: 'go live', translation: 'запрацювати для користувачів, вийти в продакшн', partOfSpeech: 'phrase' },
    { term: 'on your own', form: 'on my own', translation: 'самостійно, без допомоги', partOfSpeech: 'phrase' },
  ],
  questions: [
    { id: 'first-week-at-work:q1', type: 'choice', prompt: 'How did the writer feel at the start?', options: ['Bored', 'Angry', 'Nervous', 'Tired'], answer: 2, explanation: '«I was nervous» — автор хвилювався.' },
    { id: 'first-week-at-work:q2', type: 'choice', prompt: 'What did the writer do on the first day?', options: ['Set up the laptop and read the documentation', 'Fixed a bug', 'Wrote a lot of code', 'Had a meeting about mistakes'], answer: 0, explanation: '«On the first day I didn’t write any code. Instead, I set up my laptop… and read the documentation.»' },
    { id: 'first-week-at-work:q3', type: 'choice', prompt: 'Who is Tom?', options: ['The writer’s manager', 'A customer', 'Another junior developer', 'The writer’s mentor'], answer: 3, explanation: '«Anna also gave me a mentor, Tom» — Том є ментором автора.' },
    { id: 'first-week-at-work:q4', type: 'choice', prompt: 'What does the writer want to change next week?', options: ['Work longer hours', 'Ask for help earlier', 'Write more CSS', 'Skip meetings'], answer: 1, explanation: '«My goal for next week is to ask for help earlier» — просити про допомогу раніше, а не розв’язувати все самостійно.' },
  ],
}
