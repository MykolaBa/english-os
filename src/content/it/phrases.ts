import type { PhraseSet } from './types'

/** Phrasebook for everyday developer work, from stand-up to bug reports. */
export const PHRASE_SETS: readonly PhraseSet[] = [
  {
    id: 'standup',
    title: 'Daily stand-up',
    summary: 'Коротко розповісти, що зроблено, що далі і що заважає.',
    phrases: [
      { en: 'Yesterday I finished the login form.', uk: 'Учора я закінчив форму входу.' },
      { en: 'Today I’m going to work on the API integration.', uk: 'Сьогодні я працюватиму над інтеграцією з API.' },
      { en: 'I’m blocked by the missing design for the settings page.', uk: 'Мене блокує відсутній дизайн сторінки налаштувань.', note: 'Blocked by — коли не можете рухатися далі без когось або чогось.' },
      { en: 'I’m still working on the bug from yesterday.', uk: 'Я досі працюю над учорашнім багом.' },
      { en: 'Nothing blocking me at the moment.', uk: 'Зараз мене ніщо не блокує.' },
      { en: 'Can we take this offline?', uk: 'Обговорімо це окремо, після стендапу?', note: 'Take it offline — винести обговорення за межі зустрічі, а не «вимкнути інтернет».' },
    ],
  },
  {
    id: 'asking-for-help',
    title: 'Asking for help and clarifying',
    summary: 'Попросити допомоги чи уточнити завдання, не звучачи невпевнено.',
    phrases: [
      { en: 'Do you have a minute to look at something?', uk: 'Маєш хвилинку глянути на одну річ?' },
      { en: 'I’ve tried a few things, but I’m stuck.', uk: 'Я спробував кілька варіантів, але застряг.', note: 'Покажіть, що ви вже пробували, — так допомогти легше і швидше.' },
      { en: 'Could you walk me through how this works?', uk: 'Можеш пояснити мені крок за кроком, як це працює?' },
      { en: 'Just to make sure I understand: you want the button disabled until the form is valid?', uk: 'Щоб переконатися, що я правильно зрозумів: кнопка має бути неактивною, доки форма не валідна?' },
      { en: 'What’s the expected behaviour here?', uk: 'Як тут усе має працювати?' },
      { en: 'Sorry, could you say that again a bit more slowly?', uk: 'Перепрошую, можеш повторити трохи повільніше?' },
    ],
  },
  {
    id: 'code-review',
    title: 'Code review comments',
    summary: 'Ввічливо пропонувати зміни й відповідати на зауваження до свого коду.',
    phrases: [
      { en: 'What do you think about extracting this into a separate hook?', uk: 'Що думаєш, якщо винести це в окремий хук?' },
      { en: 'Nit: this variable name could be more descriptive.', uk: 'Дрібниця: цю змінну можна назвати зрозуміліше.', note: 'Nit (від nitpick) позначає неважливе зауваження, яке не блокує злиття.' },
      { en: 'This might cause a re-render on every keystroke.', uk: 'Через це компонент може перерендерюватися на кожне натискання клавіші.' },
      { en: 'Good catch, I’ll fix it.', uk: 'Слушне зауваження, виправлю.' },
      { en: 'I went with this approach because it keeps the API simple.', uk: 'Я обрав цей підхід, бо він залишає API простим.' },
      { en: 'Looks good to me, approved.', uk: 'Як на мене, усе добре, схвалюю.', note: 'Часто скорочують до LGTM.' },
    ],
  },
  {
    id: 'estimates',
    title: 'Estimates and deadlines',
    summary: 'Оцінювати задачі й чесно говорити про ризики та терміни.',
    phrases: [
      { en: 'I’d estimate it at about two days.', uk: 'Я б оцінив це приблизно у два дні.' },
      { en: 'It depends on how complex the validation is.', uk: 'Це залежить від того, наскільки складна валідація.' },
      { en: 'I need to look into it before I can give an estimate.', uk: 'Мені треба в цьому розібратися, перш ніж давати оцінку.' },
      { en: 'This is taking longer than expected.', uk: 'Це займає більше часу, ніж очікувалося.' },
      { en: 'We might not make it by Friday.', uk: 'Можемо не встигнути до п’ятниці.', note: 'Make it by — встигнути до певного часу.' },
      { en: 'Can we cut the scope to ship on time?', uk: 'Можемо зменшити обсяг, щоб випустити вчасно?' },
    ],
  },
  {
    id: 'meetings',
    title: 'Meetings: agreeing and disagreeing',
    summary: 'Погоджуватися, заперечувати й пропонувати ідеї без різкості.',
    phrases: [
      { en: 'That makes sense to me.', uk: 'Як на мене, це логічно.' },
      { en: 'I see your point, but I’m not sure it will scale.', uk: 'Розумію твою думку, але не впевнений, що це масштабуватиметься.' },
      { en: 'Could I add something here?', uk: 'Можна я дещо додам?' },
      { en: 'What if we tried a different approach?', uk: 'А що, як спробувати інший підхід?' },
      { en: 'Let’s move on and come back to this later.', uk: 'Рухаймося далі, а до цього повернемося пізніше.' },
      { en: 'So, to sum up, we agreed to release on Monday.', uk: 'Отже, підсумовуючи: ми домовилися випустити реліз у понеділок.' },
    ],
  },
  {
    id: 'bug-reports',
    title: 'Reporting a bug',
    summary: 'Описати баг так, щоб його можна було відтворити й виправити.',
    phrases: [
      { en: 'Steps to reproduce: open the cart and remove the last item.', uk: 'Кроки для відтворення: відкрийте кошик і видаліть останній товар.' },
      { en: 'Expected result: the cart is empty.', uk: 'Очікуваний результат: кошик порожній.' },
      { en: 'Actual result: the page crashes.', uk: 'Фактичний результат: сторінка падає.', note: 'Actual — «фактичний», а не «актуальний».' },
      { en: 'It only happens on Safari.', uk: 'Це трапляється лише в Safari.' },
      { en: 'I can’t reproduce it on my machine.', uk: 'Я не можу відтворити це у себе.' },
    ],
  },
]
