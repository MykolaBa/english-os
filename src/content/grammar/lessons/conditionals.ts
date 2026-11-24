import type { GrammarLesson } from '../types'

export const conditionals: GrammarLesson = {
  id: 'first-and-second-conditional',
  title: 'First and Second Conditional',
  level: 'B1',
  category: 'conditionals',
  summary: 'Реальні та уявні умови: if + Present Simple і if + Past Simple.',
  explanation: [
    'First Conditional описує реальну, можливу ситуацію в майбутньому: якщо умова виконається, буде результат.',
    'Second Conditional описує уявну, малоймовірну або нереальну ситуацію в теперішньому чи майбутньому. Past Simple тут не означає минуле, він показує «нереальність».',
    'У частині з if не вживаємо will чи would. Частини речення можна міняти місцями; кома ставиться, коли if стоїть на початку.',
  ],
  simpleEnglish: 'First conditional: real possibilities. Second conditional: imagined situations. Never put will or would after if.',
  forms: [
    { label: 'First Conditional', formula: 'If + Present Simple,  will + V', examples: [
      { en: 'If the tests pass, we’ll deploy today.', uk: 'Якщо тести пройдуть, ми задеплоїмо сьогодні.' },
      { en: 'I’ll call you if I have any questions.', uk: 'Я зателефоную тобі, якщо матиму запитання.' },
    ] },
    { label: 'Second Conditional', formula: 'If + Past Simple,  would + V', examples: [
      { en: 'If I had more time, I would learn Rust.', uk: 'Якби в мене було більше часу, я б вивчив Rust.' },
      { en: 'What would you do if you lost your job?', uk: 'Що б ти робив, якби втратив роботу?' },
    ] },
  ],
  usage: [
    { title: 'Реальний план з умовою', example: { en: 'If it rains, we’ll stay at home.', uk: 'Якщо піде дощ, ми залишимося вдома.' } },
    { title: 'Попередження', example: { en: 'If you don’t save your work, you’ll lose it.', uk: 'Якщо не збережеш роботу, ти її втратиш.' } },
    { title: 'Мрія або уявна ситуація', example: { en: 'If I lived by the sea, I’d swim every day.', uk: 'Якби я жив біля моря, я б плавав щодня.' } },
    { title: 'Порада', example: { en: 'If I were you, I would ask the team lead.', uk: 'На твоєму місці я б запитав тімліда.' } },
  ],
  mistakes: [
    { wrong: 'If it will rain, we’ll stay home.', right: 'If it rains, we’ll stay home.', why: 'У частині з if не вживаємо will.' },
    { wrong: 'If I would have money, I would buy it.', right: 'If I had money, I would buy it.', why: 'У частині з if у Second Conditional потрібен Past Simple, а не would.' },
    { wrong: 'If I was you, I’d take the offer.', right: 'If I were you, I’d take the offer.', why: 'У пораді «на твоєму місці» нормою є were; was трапляється лише в розмовній мові.' },
    { wrong: 'If you will need help, ask me.', right: 'If you need help, ask me.', why: 'Після if — Present Simple, навіть коли йдеться про майбутнє.' },
  ],
  comparison: {
    title: 'First чи Second?',
    text: 'Обидва говорять про майбутнє, різниця в ймовірності. First: «це цілком може статися». Second: «це малоймовірно або нереально».',
    examples: [
      { en: 'If I get the job, I’ll move to Warsaw.', uk: 'Якщо я отримаю цю роботу, я переїду до Варшави. (реально: я вже подався)' },
      { en: 'If I got a job at Google, I’d move to California.', uk: 'Якби я отримав роботу в Google, я б переїхав до Каліфорнії. (мрія)' },
    ],
  },
  exercises: [
    { id: 'cond-1', type: 'gap', prompt: 'If you ___ (press) this button, the app will restart.', answers: ['press'], explanation: 'First Conditional: після if — Present Simple.' },
    { id: 'cond-2', type: 'choice', prompt: 'If I ___ rich, I would travel the world.', options: ['am', 'were', 'will be'], answer: 1, explanation: 'Уявна ситуація: if + were (або was у розмовній мові), would + V.' },
    { id: 'cond-3', type: 'gap', prompt: 'If she ___ (have) more experience, she would get the job.', answers: ['had'], explanation: 'Second Conditional: після if — Past Simple: had.' },
    { id: 'cond-4', type: 'choice', prompt: 'We ___ late if we don’t leave now.', options: ['will be', 'would be', 'are'], answer: 0, explanation: 'Реальна ситуація, тому First Conditional: will be.' },
    { id: 'cond-5', type: 'choice', prompt: 'What ___ if you won the lottery?', options: ['will you do', 'would you do', 'do you do'], answer: 1, explanation: 'Won (Past Simple) після if показує уявну ситуацію, тому would.' },
    { id: 'cond-6', type: 'transform', instruction: 'Об’єднай в одне речення з if (First Conditional).', prompt: 'Maybe it will rain. Then we will cancel the picnic.', answers: ['If it rains, we will cancel the picnic.', 'We will cancel the picnic if it rains.'], explanation: 'If + Present Simple (rains), will + V.' },
    { id: 'cond-7', type: 'choice', prompt: 'If I ___ you, I’d update the dependencies.', options: ['was', 'were', 'am'], answer: 1, explanation: 'Порада: If I were you.' },
    { id: 'cond-8', type: 'order', tokens: ['would', 'I', 'if', 'buy', 'I', 'had', 'money', 'a', 'car'], answers: ['If I had money I would buy a car', 'I would buy a car if I had money'], translation: 'Якби в мене були гроші, я б купив машину.', explanation: 'Будь-який порядок частин правильний: if + Past Simple, would + V.' },
  ],
}
