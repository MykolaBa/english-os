import type { SpeakingTask } from './types'

/** Short monologues: plan with the points, then speak against the timer. */
export const SPEAKING_TASKS: readonly SpeakingTask[] = [
  {
    id: 'last-weekend',
    title: 'Describe your last weekend',
    level: 'A2',
    seconds: 60,
    prompt: 'Розкажіть, як минули ваші останні вихідні: де були, що робили, з ким, що сподобалося найбільше. Говоріть у Past Simple.',
    points: ['Where you were', 'What you did, in order', 'Who you were with', 'The best moment and why'],
    phrases: [
      { en: 'On Saturday I went to …', uk: 'У суботу я ходив …' },
      { en: 'After that, we …', uk: 'Після цього ми …' },
      { en: 'The best part was …', uk: 'Найкраще було …' },
    ],
  },
  {
    id: 'about-your-job',
    title: 'Talk about your job',
    level: 'B1',
    seconds: 60,
    prompt: 'Вас просять коротко розповісти про свою роботу: що ви робите, як минає типовий день, що подобається і що дається важко.',
    points: ['Your role and team', 'A typical day', 'What you enjoy', 'What is challenging'],
    phrases: [
      { en: 'I work as a … in a team of …', uk: 'Я працюю … у команді з …' },
      { en: 'A typical day starts with …', uk: 'Типовий день починається з …' },
      { en: 'What I enjoy most is …', uk: 'Найбільше мені подобається …' },
      { en: 'The most challenging part is …', uk: 'Найскладніше — це …' },
    ],
  },
  {
    id: 'recommend-a-tool',
    title: 'Recommend a tool you use',
    level: 'B1',
    seconds: 60,
    prompt: 'Колега питає, яким інструментом ви користуєтеся щодня (редактор, бібліотека, застосунок). Порадьте його: що це, навіщо, плюси й мінуси.',
    points: ['What the tool is', 'What you use it for', 'Why it’s good', 'One downside', 'Who it’s for'],
    phrases: [
      { en: 'I’d really recommend …', uk: 'Дуже раджу …' },
      { en: 'I mainly use it for …', uk: 'Я здебільшого використовую його для …' },
      { en: 'The only downside is …', uk: 'Єдиний мінус — …' },
      { en: 'It’s great if you …', uk: 'Він чудово підходить, якщо ти …' },
    ],
  },
  {
    id: 'explain-a-bug',
    title: 'Explain a bug to a teammate',
    level: 'B1',
    seconds: 90,
    prompt: 'На дзвінку поясніть колезі баг, який ви досліджуєте: що ламається, коли саме, що ви вже з’ясували і з чим потрібна допомога.',
    points: ['What is broken', 'When it happens', 'What you have tried', 'What you think the cause is', 'What help you need'],
    phrases: [
      { en: 'So, the problem is that …', uk: 'Отже, проблема в тому, що …' },
      { en: 'It only happens when …', uk: 'Це трапляється лише тоді, коли …' },
      { en: 'I’ve already tried …', uk: 'Я вже спробував …' },
      { en: 'My guess is that …', uk: 'Моє припущення — що …' },
      { en: 'Could you take a look at …?', uk: 'Можеш глянути на …?' },
    ],
  },
  {
    id: 'disagree-politely',
    title: 'Disagree with a decision politely',
    level: 'B2',
    seconds: 90,
    prompt: 'Команда хоче переписати застосунок на новий фреймворк просто зараз. Ви вважаєте, що це ризиковано. Ввічливо заперечте: визнайте плюси, поясніть ризики, запропонуйте компроміс.',
    points: ['Acknowledge the idea', 'Explain your concern with a fact', 'Describe the risk', 'Suggest a compromise', 'Offer to help'],
    phrases: [
      { en: 'I see why this is attractive, but …', uk: 'Розумію, чому це привабливо, але …' },
      { en: 'My main concern is …', uk: 'Найбільше мене турбує …' },
      { en: 'What if we started with …?', uk: 'А що, як почати з …?' },
      { en: 'I’m happy to help with …', uk: 'Охоче допоможу з …' },
    ],
  },
]
