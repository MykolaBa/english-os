import type { GrammarLesson } from '../types'

export const pastSimple: GrammarLesson = {
  id: 'past-simple',
  title: 'Past Simple',
  level: 'A2',
  category: 'tenses',
  summary: 'Завершені дії в минулому: правильні й неправильні дієслова.',
  explanation: [
    'Past Simple описує дію, яка почалася й закінчилася в минулому. Часто є вказівка на час: yesterday, last week, in 2020, two days ago.',
    'Правильні дієслова отримують закінчення -ed (work → worked). Неправильні мають власну форму, яку треба запам’ятати (go → went, write → wrote).',
    'У запереченнях і питаннях з’являється did, а основне дієслово повертається в початкову форму: I didn’t go, Did you see?',
  ],
  simpleEnglish: 'Use the Past Simple for finished actions at a specific time in the past.',
  forms: [
    { label: 'Ствердження', formula: 'підмет + V-ed  або  друга форма неправильного дієслова', examples: [
      { en: 'We released the new version yesterday.', uk: 'Ми випустили нову версію вчора.' },
      { en: 'I wrote the tests last week.', uk: 'Я написав тести минулого тижня.' },
    ] },
    { label: 'Заперечення', formula: 'підмет + did not (didn’t) + V', examples: [
      { en: 'The build didn’t fail this time.', uk: 'Цього разу збірка не впала.' },
    ] },
    { label: 'Питання', formula: 'Did + підмет + V?', examples: [
      { en: 'Did you merge my pull request?', uk: 'Ти змерджив мій пул-реквест?' },
      { en: 'When did you start learning English?', uk: 'Коли ти почав вчити англійську?' },
    ] },
  ],
  usage: [
    { title: 'Завершена дія з вказаним часом', example: { en: 'I moved to Kyiv in 2021.', uk: 'Я переїхав до Києва у 2021 році.' } },
    { title: 'Послідовність подій', example: { en: 'I opened the logs, found the bug and fixed it.', uk: 'Я відкрив логи, знайшов баг і виправив його.' } },
    { title: 'Минулі звички', example: { en: 'When I was a student, I worked at night.', uk: 'Коли я був студентом, я працював уночі.' } },
  ],
  mistakes: [
    { wrong: 'I didn’t went to the meeting.', right: 'I didn’t go to the meeting.', why: 'Після didn’t дієслово стоїть у початковій формі.' },
    { wrong: 'Did you saw the email?', right: 'Did you see the email?', why: 'У питанні з did основне дієслово не змінюється.' },
    { wrong: 'I have seen him yesterday.', right: 'I saw him yesterday.', why: 'Є конкретний час у минулому (yesterday), тому Past Simple, а не Present Perfect.' },
    { wrong: 'She buyed a new laptop.', right: 'She bought a new laptop.', why: 'Buy — неправильне дієслово: buy → bought.' },
  ],
  comparison: {
    title: 'Як вимовляти -ed',
    text: 'Після t і d закінчення -ed звучить як окремий склад /ɪd/: wanted, needed. Після глухих звуків воно звучить як /t/: worked, fixed. Після дзвінких і голосних як /d/: played, called.',
    examples: [
      { en: 'I needed help, so I called a colleague.', uk: 'Мені потрібна була допомога, тож я зателефонував колезі.' },
    ],
  },
  exercises: [
    { id: 'ps-1', type: 'gap', prompt: 'We ___ (finish) the project last Friday.', answers: ['finished'], explanation: 'Правильне дієслово: finish + -ed.' },
    { id: 'ps-2', type: 'gap', prompt: 'She ___ (write) the documentation yesterday.', answers: ['wrote'], explanation: 'Write — неправильне дієслово: write → wrote.' },
    { id: 'ps-3', type: 'choice', prompt: 'I ___ the bug two hours ago.', options: ['find', 'found', 'have found'], answer: 1, explanation: 'Two hours ago — конкретний час у минулому, тому Past Simple: find → found.' },
    { id: 'ps-4', type: 'gap', prompt: 'They ___ (not / come) to the standup.', answers: ['did not come'], explanation: 'Заперечення: didn’t + початкова форма come.' },
    { id: 'ps-5', type: 'transform', instruction: 'Постав запитання до речення.', prompt: 'You tested the login form.', answers: ['Did you test the login form?'], explanation: 'Did + you + test: після did дієслово без -ed.' },
    { id: 'ps-6', type: 'choice', prompt: 'Did you ___ the new release?', options: ['saw', 'see', 'seen'], answer: 1, explanation: 'Після did — початкова форма see.' },
    { id: 'ps-7', type: 'gap', prompt: 'I ___ (go) to London last year.', answers: ['went'], explanation: 'Go — неправильне дієслово: go → went.' },
    { id: 'ps-8', type: 'order', tokens: ['didn’t', 'yesterday', 'I', 'the', 'deploy', 'app'], answers: ['I didn’t deploy the app yesterday', 'Yesterday I didn’t deploy the app'], translation: 'Я не деплоїв застосунок учора.', explanation: 'Порядок: підмет, didn’t, дієслово, додаток, час.' },
  ],
}
