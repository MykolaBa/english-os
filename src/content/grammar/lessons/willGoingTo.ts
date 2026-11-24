import type { GrammarLesson } from '../types'

export const willGoingTo: GrammarLesson = {
  id: 'will-vs-going-to',
  title: 'Future: will vs going to',
  level: 'A2',
  category: 'tenses',
  summary: 'Рішення в момент розмови, обіцянки, плани й прогнози.',
  explanation: [
    'Will вживаємо, коли рішення приймаємо в момент розмови, для обіцянок, пропозицій допомоги та прогнозів, що ґрунтуються на думці.',
    'Be going to вживаємо для планів і намірів, які вже існують, а також для прогнозів, коли ми бачимо докази просто зараз.',
    'Для домовленостей на конкретний час часто вживають Present Continuous: I’m meeting the client tomorrow.',
  ],
  simpleEnglish: 'Will is for quick decisions, promises and opinions about the future. Going to is for plans you already have and for things you can see coming.',
  forms: [
    { label: 'Will', formula: 'will + V;  will not (won’t) + V;  Will + підмет + V?', examples: [
      { en: 'I’ll send you the link.', uk: 'Я надішлю тобі посилання.' },
      { en: 'It won’t take long.', uk: 'Це не забере багато часу.' },
    ] },
    { label: 'Be going to', formula: 'am / is / are + going to + V', examples: [
      { en: 'We’re going to migrate to TypeScript.', uk: 'Ми збираємося перейти на TypeScript.' },
      { en: 'Are you going to apply for the job?', uk: 'Ти збираєшся подаватися на цю вакансію?' },
    ] },
  ],
  usage: [
    { title: 'Рішення в момент розмови', example: { en: '“The server is down.” “I’ll check it.”', uk: '«Сервер упав». «Я перевірю».' } },
    { title: 'Обіцянка', example: { en: 'I’ll finish it by Monday, I promise.', uk: 'Я закінчу до понеділка, обіцяю.' } },
    { title: 'План, вирішений заздалегідь', example: { en: 'I’m going to learn Next.js next month.', uk: 'Наступного місяця я збираюся вчити Next.js.' } },
    { title: 'Прогноз на основі доказів', example: { en: 'Look at those clouds. It’s going to rain.', uk: 'Поглянь на ці хмари. Зараз піде дощ.' } },
    { title: 'Прогноз-думка', example: { en: 'I think AI will change our jobs.', uk: 'Я думаю, ШІ змінить нашу роботу.' } },
  ],
  mistakes: [
    { wrong: 'I will to call you.', right: 'I will call you.', why: 'Після will дієслово стоїть без to.' },
    { wrong: 'She going to start a new job.', right: 'She’s going to start a new job.', why: 'У конструкції потрібне дієслово be: she is going to.' },
    { wrong: '(The phone rings) I’m going to answer it!', right: 'I’ll answer it!', why: 'Рішення прийняте щойно, тому will.' },
    { wrong: 'Will you to help me?', right: 'Will you help me?', why: 'Після will у питанні дієслово теж без to.' },
  ],
  comparison: {
    title: 'Will чи going to?',
    text: 'Запитай себе: я вирішую це просто зараз (will) чи це вже мій план (going to)? Якщо в розмові з’явилася нова інформація і ти на неї реагуєш, обирай will.',
    examples: [
      { en: 'A: We need someone to write the tests. B: I’ll do it.', uk: 'А: Нам потрібен хтось, хто напише тести. Б: Я зроблю.' },
      { en: 'I’m going to write the tests tomorrow. It’s in my plan.', uk: 'Я збираюся написати тести завтра. Це є в моєму плані.' },
    ],
  },
  exercises: [
    { id: 'fut-1', type: 'choice', prompt: '“I’m cold.” “I ___ close the window.”', options: ['will', 'am going to', 'going to'], answer: 0, explanation: 'Рішення в момент розмови, тому will.' },
    { id: 'fut-2', type: 'choice', prompt: 'We’ve already booked the tickets. We ___ visit Lviv in May.', options: ['will', 'are going to', 'go to'], answer: 1, explanation: 'План уже існує (квитки куплені), тому going to.' },
    { id: 'fut-3', type: 'gap', prompt: 'I promise I ___ (not / forget) your birthday.', answers: ['will not forget'], explanation: 'Обіцянка, тому will: won’t forget.' },
    { id: 'fut-4', type: 'choice', prompt: 'Look at that car! It ___ crash!', options: ['will', 'is going to', 'is going'], answer: 1, explanation: 'Ми бачимо докази просто зараз, тому going to.' },
    { id: 'fut-5', type: 'gap', prompt: 'I think she ___ (be) a great developer.', answers: ['will be'], explanation: 'Прогноз-думка після I think, тому will.' },
    { id: 'fut-6', type: 'transform', instruction: 'Перепиши речення з be going to.', prompt: 'I plan to learn Spanish.', answers: ['I am going to learn Spanish.'], explanation: 'План: I am going to + V.' },
    { id: 'fut-7', type: 'choice', prompt: 'Don’t worry, I ___ help you with the presentation.', options: ['will', 'am going', 'go'], answer: 0, explanation: 'Пропозиція допомоги, тому will.' },
    { id: 'fut-8', type: 'order', tokens: ['going', 'we', 'to', 'are', 'the', 'refactor', 'code'], answers: ['We are going to refactor the code'], translation: 'Ми збираємося відрефакторити код.', explanation: 'Підмет + are going to + дієслово + додаток.' },
  ],
}
