import type { GrammarLesson } from '../types'

export const presentPerfect: GrammarLesson = {
  id: 'present-perfect',
  title: 'Present Perfect',
  level: 'B1',
  category: 'tenses',
  summary: 'Досвід, результат до цього моменту та for / since. Різниця з Past Simple.',
  explanation: [
    'Present Perfect поєднує минуле з теперішнім: важливий результат або досвід зараз, а не точний час, коли це сталося.',
    'Його вживаємо для життєвого досвіду (ever, never), нещодавніх дій з результатом (just, already, yet) і для ситуацій, що почалися в минулому й тривають досі (for, since).',
    'Якщо названо конкретний час у минулому (yesterday, in 2020, last week), потрібен Past Simple. Українською обидва часи зазвичай перекладаються минулим, тому орієнтуйся на зміст, а не на переклад.',
  ],
  simpleEnglish: 'Use the Present Perfect when the past matters now: experience, recent results, or something that started in the past and is still true.',
  forms: [
    { label: 'Ствердження', formula: 'have / has + V3 (третя форма дієслова)', examples: [
      { en: 'I’ve worked with React for two years.', uk: 'Я працюю з React уже два роки.' },
      { en: 'She has just pushed the fix.', uk: 'Вона щойно запушила виправлення.' },
    ] },
    { label: 'Заперечення', formula: 'have / has + not + V3', examples: [
      { en: 'We haven’t deployed it yet.', uk: 'Ми ще не задеплоїли це.' },
    ] },
    { label: 'Питання', formula: 'Have / Has + підмет + V3?', examples: [
      { en: 'Have you ever worked in a big team?', uk: 'Ти колись працював у великій команді?' },
      { en: 'How long have you lived here?', uk: 'Скільки часу ти тут живеш?' },
    ] },
  ],
  usage: [
    { title: 'Досвід без вказівки часу', example: { en: 'I’ve never been to the USA.', uk: 'Я ніколи не був у США.' } },
    { title: 'Результат, важливий зараз', example: { en: 'I’ve lost my keys, so I can’t get in.', uk: 'Я загубив ключі, тому не можу зайти.' } },
    { title: 'Щойно, вже, ще не', example: { en: '“Have you finished the task yet?” “Yes, I’ve already sent it.”', uk: '«Ти вже закінчив завдання?» «Так, я вже його надіслав».' } },
    { title: 'Ситуація триває досі', example: { en: 'He has lived in Lviv since 2019.', uk: 'Він живе у Львові з 2019 року.' } },
  ],
  mistakes: [
    { wrong: 'I have finished it yesterday.', right: 'I finished it yesterday.', why: 'Є конкретний час у минулому, тому Past Simple.' },
    { wrong: 'I work here since 2022.', right: 'I have worked here since 2022.', why: 'Дія почалася в минулому й триває досі, тому Present Perfect, а не Present Simple.' },
    { wrong: 'She has went home.', right: 'She has gone home.', why: 'Після has потрібна третя форма: go → went → gone.' },
    { wrong: 'Did you ever see snow?', right: 'Have you ever seen snow?', why: 'Питання про життєвий досвід з ever, тому Present Perfect.' },
  ],
  comparison: {
    title: 'For чи since?',
    text: 'For + тривалість: for two years, for a week. Since + момент початку: since Monday, since 2020, since I was a child. Українською обидва часто перекладаються як «уже …» або «з …».',
    examples: [
      { en: 'I’ve known her for ten years.', uk: 'Я знаю її вже десять років.' },
      { en: 'I’ve known her since school.', uk: 'Я знаю її ще зі школи.' },
    ],
  },
  exercises: [
    { id: 'pp-1', type: 'choice', prompt: 'I ___ this film three times.', options: ['saw', 'have seen', 'have saw'], answer: 1, explanation: 'Досвід без конкретного часу: have + seen (третя форма).' },
    { id: 'pp-2', type: 'choice', prompt: 'We ___ the release last Monday.', options: ['have shipped', 'shipped', 'has shipped'], answer: 1, explanation: 'Last Monday — конкретний час, тому Past Simple.' },
    { id: 'pp-3', type: 'gap', prompt: 'She ___ (work) here since 2021.', answers: ['has worked', 'has been working'], explanation: 'Почалося в минулому й триває досі: has worked.' },
    { id: 'pp-4', type: 'choice', prompt: 'I’ve been a developer ___ three years.', options: ['since', 'for', 'from'], answer: 1, explanation: 'Three years — тривалість, тому for.' },
    { id: 'pp-5', type: 'gap', prompt: 'Have you ___ (finish) the report yet?', answers: ['finished'], explanation: 'Після have потрібна третя форма: finished.' },
    { id: 'pp-6', type: 'gap', prompt: 'They ___ (not / reply) to my email yet.', answers: ['have not replied'], explanation: 'Yet у запереченні, тому haven’t replied.' },
    { id: 'pp-7', type: 'transform', instruction: 'Постав запитання про досвід, використавши ever.', prompt: 'You have visited London.', answers: ['Have you ever visited London?'], explanation: 'Have + you + ever + V3.' },
    { id: 'pp-8', type: 'order', tokens: ['already', 'I’ve', 'the', 'fixed', 'bug'], answers: ['I’ve already fixed the bug'], translation: 'Я вже виправив баг.', explanation: 'Already стоїть між have і третьою формою дієслова.' },
  ],
}
