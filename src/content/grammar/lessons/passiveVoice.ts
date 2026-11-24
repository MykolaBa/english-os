import type { GrammarLesson } from '../types'

export const passiveVoice: GrammarLesson = {
  id: 'passive-voice',
  title: 'Passive Voice',
  level: 'B1',
  category: 'passive',
  summary: 'Коли важлива дія чи результат, а не той, хто її виконав.',
  explanation: [
    'Пасивний стан вживаємо, коли виконавець невідомий, неважливий або очевидний, а в центрі уваги дія чи об’єкт.',
    'Утворюється з дієслова be у потрібному часі та третьої форми основного дієслова (V3). Час показує саме be: is made, was made, has been made, will be made.',
    'Якщо потрібно назвати виконавця, додаємо by: The app was designed by our team.',
  ],
  simpleEnglish: 'Use the passive when the action matters more than who did it: be + past participle.',
  forms: [
    { label: 'Present Simple Passive', formula: 'am / is / are + V3', examples: [
      { en: 'English is spoken in many countries.', uk: 'Англійською розмовляють у багатьох країнах.' },
      { en: 'The data is stored locally.', uk: 'Дані зберігаються локально.' },
    ] },
    { label: 'Past Simple Passive', formula: 'was / were + V3', examples: [
      { en: 'The bug was found by a tester.', uk: 'Баг знайшов тестувальник.' },
      { en: 'These houses were built in 1950.', uk: 'Ці будинки збудували в 1950 році.' },
    ] },
    { label: 'Інші часи', formula: 'has / have been + V3;  will be + V3', examples: [
      { en: 'The meeting has been cancelled.', uk: 'Зустріч скасували.' },
      { en: 'The results will be announced tomorrow.', uk: 'Результати оголосять завтра.' },
    ] },
  ],
  usage: [
    { title: 'Виконавець невідомий', example: { en: 'My bike was stolen last night.', uk: 'Мій велосипед учора вночі вкрали.' } },
    { title: 'Процеси та інструкції', example: { en: 'The code is reviewed before it is merged.', uk: 'Код переглядають, перш ніж змерджити.' } },
    { title: 'Офіційний стиль', example: { en: 'Applications must be submitted by Friday.', uk: 'Заявки потрібно подати до п’ятниці.' } },
  ],
  mistakes: [
    { wrong: 'The report was write yesterday.', right: 'The report was written yesterday.', why: 'Потрібна третя форма: write → wrote → written.' },
    { wrong: 'The email sent to all users.', right: 'The email was sent to all users.', why: 'Без be речення не пасивне: потрібно was sent.' },
    { wrong: 'This app is develop by our team.', right: 'This app is developed by our team.', why: 'Після is потрібна третя форма: developed.' },
    { wrong: 'The window was broke.', right: 'The window was broken.', why: 'Broke — друга форма, а в пасиві потрібна третя: broken.' },
  ],
  comparison: {
    title: 'Пасив українською',
    text: 'Український переклад пасиву часто звучить природніше через неозначено-особову форму: «тут розмовляють англійською», «баг виправили». Якщо виконавець важливий, краще активний стан: Anna fixed the bug.',
    examples: [
      { en: 'Somebody fixed the bug. → The bug was fixed.', uk: 'Хтось виправив баг. → Баг виправили.' },
    ],
  },
  exercises: [
    { id: 'pv-1', type: 'gap', prompt: 'The tests ___ (run) automatically on every push.', answers: ['are run'], explanation: 'Регулярний процес: are + run (третя форма run).' },
    { id: 'pv-2', type: 'gap', prompt: 'This bridge ___ (build) in 1930.', answers: ['was built'], explanation: 'Минуле: was + built.' },
    { id: 'pv-3', type: 'choice', prompt: 'The meeting ___ to Thursday.', options: ['has moved', 'has been moved', 'was move'], answer: 1, explanation: 'Зустріч не переїхала сама — її перенесли: has been moved.' },
    { id: 'pv-4', type: 'choice', prompt: 'Our office ___ every evening.', options: ['is cleaned', 'cleans', 'is clean'], answer: 0, explanation: 'Офіс прибирають (хтось інший), тому is cleaned.' },
    { id: 'pv-5', type: 'gap', prompt: 'The new version ___ (release) next week.', answers: ['will be released'], explanation: 'Майбутнє: will be + released.' },
    { id: 'pv-6', type: 'transform', instruction: 'Перепиши речення в пасивному стані.', prompt: 'Someone stole my phone.', answers: ['My phone was stolen.', 'My phone was stolen by someone.'], explanation: 'Об’єкт (my phone) стає підметом: was + stolen.' },
    { id: 'pv-7', type: 'choice', prompt: 'These photos ___ by my sister.', options: ['were taken', 'were took', 'was taken'], answer: 0, explanation: 'Photos — множина, тому were; третя форма take — taken.' },
    { id: 'pv-8', type: 'order', tokens: ['was', 'by', 'the', 'designed', 'app', 'Anna'], answers: ['The app was designed by Anna'], translation: 'Застосунок розробила Анна.', explanation: 'Об’єкт + was + V3 + by + виконавець.' },
  ],
}
