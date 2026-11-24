import type { GrammarLesson } from '../types'

export const presentSimpleContinuous: GrammarLesson = {
  id: 'present-simple-vs-continuous',
  title: 'Present Simple vs Present Continuous',
  level: 'A2',
  category: 'tenses',
  summary: 'Звички й факти проти дій, які відбуваються саме зараз.',
  explanation: [
    'Present Simple описує те, що відбувається регулярно або є загальним фактом: звички, розклади, постійні стани.',
    'Present Continuous описує дію, яка відбувається саме зараз або протягом цього періоду, а також тимчасові ситуації.',
    'Дієслова стану (know, like, want, need, understand, believe) зазвичай не вживаються в Continuous, навіть коли йдеться про «зараз».',
  ],
  simpleEnglish: 'Use the Present Simple for habits and facts. Use the Present Continuous for things happening now or around now.',
  forms: [
    { label: 'Present Simple: ствердження', formula: 'I / you / we / they + V;  he / she / it + V-s', examples: [
      { en: 'She works from home on Fridays.', uk: 'По п’ятницях вона працює з дому.' },
      { en: 'Our team uses React and TypeScript.', uk: 'Наша команда використовує React і TypeScript.' },
    ] },
    { label: 'Present Simple: заперечення і питання', formula: 'do / does + not + V;  Do / Does + підмет + V?', examples: [
      { en: 'He doesn’t drink coffee.', uk: 'Він не п’є каву.' },
      { en: 'Do you use Git at work?', uk: 'Ти використовуєш Git на роботі?' },
    ] },
    { label: 'Present Continuous: ствердження', formula: 'am / is / are + V-ing', examples: [
      { en: 'I’m fixing a bug right now.', uk: 'Я зараз виправляю баг.' },
      { en: 'They are testing the new release.', uk: 'Вони тестують новий реліз.' },
    ] },
    { label: 'Present Continuous: заперечення і питання', formula: 'am / is / are + not + V-ing;  Am / Is / Are + підмет + V-ing?', examples: [
      { en: 'We aren’t working on that feature this week.', uk: 'Цього тижня ми не працюємо над цією фічею.' },
      { en: 'What are you reading at the moment?', uk: 'Що ти зараз читаєш?' },
    ] },
  ],
  usage: [
    { title: 'Звички та регулярні дії', example: { en: 'I check my email every morning.', uk: 'Я перевіряю пошту щоранку.' } },
    { title: 'Факти та загальні істини', example: { en: 'Water boils at 100 degrees.', uk: 'Вода кипить при 100 градусах.' } },
    { title: 'Розклади', example: { en: 'The daily standup starts at ten.', uk: 'Щоденна нарада починається о десятій.' } },
    { title: 'Дія саме зараз', example: { en: 'Wait a second, I’m deploying the app.', uk: 'Зачекай секунду, я деплою застосунок.' } },
    { title: 'Тимчасова ситуація', example: { en: 'I’m learning React this month.', uk: 'Цього місяця я вчу React.' } },
  ],
  mistakes: [
    { wrong: 'She work in IT.', right: 'She works in IT.', why: 'У Present Simple після he / she / it до дієслова додається -s.' },
    { wrong: 'I am knowing the answer.', right: 'I know the answer.', why: 'Know — дієслово стану, його не вживають у Continuous.' },
    { wrong: 'Do she like coffee?', right: 'Does she like coffee?', why: 'Для he / she / it у питанні вживаємо does, а дієслово лишається без -s.' },
    { wrong: 'Look! It rains.', right: 'Look! It’s raining.', why: 'Дія відбувається саме зараз, тому потрібен Present Continuous.' },
  ],
  comparison: {
    title: 'Слова-підказки',
    text: 'Always, usually, often, every day, on Mondays вказують на Present Simple. Now, right now, at the moment, currently, this week вказують на Present Continuous.',
    examples: [
      { en: 'I usually work in the office, but this week I’m working from home.', uk: 'Зазвичай я працюю в офісі, але цього тижня працюю з дому.' },
    ],
  },
  exercises: [
    { id: 'psc-1', type: 'gap', prompt: 'She ___ (work) from home on Mondays.', answers: ['works'], explanation: 'Регулярна дія і підмет she, тому works.' },
    { id: 'psc-2', type: 'gap', prompt: 'Please be quiet. I ___ (talk) to a client.', answers: ['am talking'], explanation: 'Дія відбувається саме зараз: am talking.' },
    { id: 'psc-3', type: 'choice', prompt: 'Water ___ at 100 °C.', options: ['boils', 'is boiling', 'boil'], answer: 0, explanation: 'Загальний факт, тому Present Simple.' },
    { id: 'psc-4', type: 'choice', prompt: 'What ___ right now?', options: ['do you do', 'are you doing', 'you are doing'], answer: 1, explanation: 'Right now вказує на Continuous, а в питанні are стоїть перед підметом.' },
    { id: 'psc-5', type: 'gap', prompt: 'I ___ (not / understand) this error message.', answers: ['do not understand'], explanation: 'Understand — дієслово стану, тому Present Simple навіть «зараз».' },
    { id: 'psc-6', type: 'transform', instruction: 'Постав запитання до речення.', prompt: 'He uses Git every day.', answers: ['Does he use Git every day?'], explanation: 'Does + he + use: дієслово після does без -s.' },
    { id: 'psc-7', type: 'choice', prompt: 'This week we ___ on a new design.', options: ['work', 'are working', 'works'], answer: 1, explanation: 'This week — тимчасова ситуація, тому Present Continuous.' },
    { id: 'psc-8', type: 'order', tokens: ['usually', 'I', 'coffee', 'drink', 'in', 'the', 'morning'], answers: ['I usually drink coffee in the morning'], translation: 'Зазвичай я п’ю каву вранці.', explanation: 'Прислівник частоти (usually) стоїть перед основним дієсловом.' },
  ],
}
