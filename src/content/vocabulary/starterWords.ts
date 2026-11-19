import type { CefrLevel, PartOfSpeech } from '@/lib/db/types'

/**
 * Starter vocabulary, imported into the database once (see features/vocabulary/seed.ts).
 * High-frequency, practical words for everyday life, work and frontend development.
 * Transcriptions are British English IPA. To add words: append entries and bump
 * STARTER_VOCABULARY_VERSION — existing users get only the new ones.
 */

export const STARTER_VOCABULARY_VERSION = 1

export interface StarterCollection {
  slug: string
  name: string
  description: string
  icon: string
}

export const STARTER_COLLECTIONS: StarterCollection[] = [
  { slug: 'everyday', name: 'Everyday English', description: 'Words for daily life and small talk', icon: 'coffee' },
  { slug: 'common-verbs', name: 'Common Verbs', description: 'High-frequency verbs worth knowing well', icon: 'zap' },
  { slug: 'phrasal-verbs', name: 'Phrasal Verbs', description: 'Verb + particle combinations natives use constantly', icon: 'shuffle' },
  { slug: 'it', name: 'IT & Programming', description: 'Words from code reviews, standups and docs', icon: 'code' },
  { slug: 'work', name: 'Professional Communication', description: 'Emails, meetings and teamwork', icon: 'briefcase' },
  { slug: 'interviews', name: 'Job Interviews', description: 'Talking about yourself and your experience', icon: 'user-check' },
  { slug: 'travel', name: 'Travel', description: 'Airports, hotels and getting around', icon: 'plane' },
  { slug: 'idioms', name: 'Idioms', description: 'Expressions whose meaning isn’t literal', icon: 'sparkles' },
  { slug: 'difficult', name: 'Difficult Words', description: 'Words you want to give extra attention', icon: 'flame' },
  { slug: 'mistakes', name: 'My Mistakes', description: 'Words you got wrong in reviews and quizzes', icon: 'circle-alert' },
]

/** [term, phonetic, part of speech, level, translation, definition, example, example translation] */
type Entry = [string, string, PartOfSpeech, CefrLevel, string, string, string, string]

export const STARTER_WORDS: Record<string, Entry[]> = {
  everyday: [
    ['appointment', '/əˈpɔɪntmənt/', 'noun', 'A2', 'запис (на прийом), домовлена зустріч', 'an arranged time to see someone, e.g. a doctor', 'I have a dentist appointment at 3 pm.', 'У мене запис до стоматолога на 15:00.'],
    ['available', '/əˈveɪləbl/', 'adjective', 'A2', 'доступний, вільний', 'free to use, buy or talk to', 'Are you available on Friday afternoon?', 'Ти вільний у п’ятницю після обіду?'],
    ['convenient', '/kənˈviːniənt/', 'adjective', 'B1', 'зручний', 'easy and suitable for you', 'Is 10 o’clock convenient for you?', 'Тобі зручно о 10-й?'],
    ['borrow', '/ˈbɒrəʊ/', 'verb', 'A2', 'позичати (у когось)', 'to take something that you will give back later', 'Can I borrow your charger?', 'Можна позичити твою зарядку?'],
    ['lend', '/lend/', 'verb', 'A2', 'позичати (комусь)', 'to give something to someone for a short time', 'I can lend you my umbrella.', 'Я можу позичити тобі свою парасольку.'],
    ['actually', '/ˈæktʃuəli/', 'adverb', 'A2', 'насправді, взагалі-то', 'used to say what is really true, often surprisingly', 'Actually, I’ve never been to London.', 'Насправді я ніколи не був у Лондоні.'],
    ['probably', '/ˈprɒbəbli/', 'adverb', 'A2', 'мабуть, ймовірно', 'very likely', 'I’ll probably stay at home tonight.', 'Мабуть, сьогодні ввечері я залишуся вдома.'],
    ['enough', '/ɪˈnʌf/', 'adjective', 'A2', 'достатньо', 'as much or as many as you need', 'We don’t have enough time.', 'У нас недостатньо часу.'],
    ['expensive', '/ɪkˈspensɪv/', 'adjective', 'A2', 'дорогий', 'costing a lot of money', 'This phone is too expensive for me.', 'Цей телефон для мене задорогий.'],
    ['neighbour', '/ˈneɪbə/', 'noun', 'A2', 'сусід', 'a person who lives near you', 'Our neighbours are very friendly.', 'Наші сусіди дуже привітні.'],
    ['weather forecast', '/ˈweðə ˌfɔːkɑːst/', 'noun', 'A2', 'прогноз погоди', 'a report about what the weather will be like', 'The weather forecast says it will rain tomorrow.', 'За прогнозом погоди завтра буде дощ.'],
    ['busy', '/ˈbɪzi/', 'adjective', 'A1', 'зайнятий', 'having a lot of things to do', 'Sorry, I’m busy right now.', 'Вибач, я зараз зайнятий.'],
    ['be used to', '', 'phrase', 'B1', 'звикнути до, мати звичку до', 'to find something normal because you have done it often', 'I’m used to working late.', 'Я звик працювати допізна.'],
    ['mood', '/muːd/', 'noun', 'B1', 'настрій', 'the way you feel at a particular time', 'She’s in a good mood today.', 'У неї сьогодні гарний настрій.'],
    ['habit', '/ˈhæbɪt/', 'noun', 'B1', 'звичка', 'something you do regularly, often without thinking', 'Reading before bed is a good habit.', 'Читати перед сном — хороша звичка.'],
    ['tired', '/ˈtaɪəd/', 'adjective', 'A1', 'втомлений', 'needing rest or sleep', 'I’m too tired to cook tonight.', 'Я надто втомлений, щоб готувати сьогодні.'],
    ['errand', '/ˈerənd/', 'noun', 'B2', 'справа, доручення (кудись сходити)', 'a short trip to do a task, like buying something', 'I need to run a few errands this morning.', 'Мені треба зранку зробити кілька справ.'],
    ['by the way', '', 'phrase', 'A2', 'до речі', 'used to introduce a new topic in a conversation', 'By the way, did you call Anna?', 'До речі, ти дзвонив Анні?'],
    ['it depends', '', 'phrase', 'A2', 'залежить (від обставин)', 'the answer changes according to the situation', 'Will I come? It depends on the weather.', 'Чи прийду я? Залежить від погоди.'],
    ['grocery store', '/ˈɡrəʊsəri stɔː/', 'noun', 'A2', 'продуктовий магазин', 'a shop that sells food and household goods', 'I’m going to the grocery store. Do we need milk?', 'Я йду в продуктовий. Нам треба молоко?'],
  ],
  'common-verbs': [
    ['achieve', '/əˈtʃiːv/', 'verb', 'B1', 'досягати', 'to succeed in doing something after a lot of effort', 'She achieved her goal of running a marathon.', 'Вона досягла своєї мети — пробігти марафон.'],
    ['improve', '/ɪmˈpruːv/', 'verb', 'A2', 'покращувати(ся)', 'to make something better or to become better', 'I want to improve my English.', 'Я хочу покращити свою англійську.'],
    ['avoid', '/əˈvɔɪd/', 'verb', 'B1', 'уникати', 'to stay away from someone or something', 'Try to avoid sugar in the evening.', 'Намагайся уникати цукру ввечері.'],
    ['suggest', '/səˈdʒest/', 'verb', 'B1', 'пропонувати, радити', 'to give an idea for someone to consider', 'I suggest we start the meeting now.', 'Пропоную почати зустріч зараз.'],
    ['remind', '/rɪˈmaɪnd/', 'verb', 'B1', 'нагадувати', 'to make someone remember something', 'Please remind me to call the bank.', 'Нагадай мені, будь ласка, зателефонувати в банк.'],
    ['afford', '/əˈfɔːd/', 'verb', 'B1', 'дозволити собі (фінансово)', 'to have enough money to pay for something', 'We can’t afford a new car this year.', 'Ми не можемо дозволити собі нову машину цього року.'],
    ['explain', '/ɪkˈspleɪn/', 'verb', 'A2', 'пояснювати', 'to make something clear and easy to understand', 'Can you explain how this works?', 'Можеш пояснити, як це працює?'],
    ['decide', '/dɪˈsaɪd/', 'verb', 'A2', 'вирішувати', 'to choose something after thinking about it', 'I decided to learn programming.', 'Я вирішив вивчати програмування.'],
    ['expect', '/ɪkˈspekt/', 'verb', 'B1', 'очікувати', 'to think that something will happen', 'I didn’t expect the test to be so easy.', 'Я не очікував, що тест буде таким легким.'],
    ['manage', '/ˈmænɪdʒ/', 'verb', 'B1', 'впоратися, зуміти; керувати', 'to succeed in doing something difficult; to be in charge of', 'I managed to finish the project on time.', 'Мені вдалося завершити проєкт вчасно.'],
    ['mention', '/ˈmenʃn/', 'verb', 'B1', 'згадувати', 'to say something briefly', 'He mentioned that he was leaving the company.', 'Він згадав, що йде з компанії.'],
    ['require', '/rɪˈkwaɪə/', 'verb', 'B2', 'вимагати, потребувати', 'to need something; to make something necessary', 'This job requires good communication skills.', 'Ця робота вимагає хороших комунікативних навичок.'],
    ['provide', '/prəˈvaɪd/', 'verb', 'B1', 'надавати, забезпечувати', 'to give someone something that they need', 'The company provides free training.', 'Компанія надає безкоштовне навчання.'],
    ['complain', '/kəmˈpleɪn/', 'verb', 'B1', 'скаржитися', 'to say that you are unhappy about something', 'He always complains about the traffic.', 'Він постійно скаржиться на затори.'],
    ['recommend', '/ˌrekəˈmend/', 'verb', 'B1', 'рекомендувати, радити', 'to say that someone or something is good', 'Can you recommend a good book?', 'Можеш порадити хорошу книжку?'],
  ],
  'phrasal-verbs': [
    ['find out', '', 'phrasal verb', 'A2', 'дізнаватися', 'to discover a fact or piece of information', 'I found out that the meeting was cancelled.', 'Я дізнався, що зустріч скасували.'],
    ['give up', '', 'phrasal verb', 'A2', 'здаватися; кидати (звичку)', 'to stop trying, or to stop doing a habit', 'Don’t give up — you’re almost there!', 'Не здавайся — ти майже у цілі!'],
    ['look for', '', 'phrasal verb', 'A2', 'шукати', 'to try to find someone or something', 'I’m looking for a new job.', 'Я шукаю нову роботу.'],
    ['look forward to', '', 'phrasal verb', 'B1', 'чекати з нетерпінням', 'to feel happy about something that is going to happen', 'I’m looking forward to the weekend.', 'Я з нетерпінням чекаю на вихідні.'],
    ['figure out', '', 'phrasal verb', 'B1', 'розібратися, зрозуміти', 'to understand or solve something after thinking', 'I can’t figure out why the code doesn’t work.', 'Я не можу зрозуміти, чому код не працює.'],
    ['set up', '', 'phrasal verb', 'B1', 'налаштовувати, створювати', 'to prepare, install or organise something', 'Let’s set up the project first.', 'Давай спочатку налаштуємо проєкт.'],
    ['come up with', '', 'phrasal verb', 'B2', 'придумати, запропонувати (ідею)', 'to think of an idea, plan or answer', 'She came up with a great solution.', 'Вона придумала чудове рішення.'],
    ['carry on', '', 'phrasal verb', 'B1', 'продовжувати', 'to continue doing something', 'Carry on, I’m listening.', 'Продовжуй, я слухаю.'],
    ['turn down', '', 'phrasal verb', 'B1', 'відхиляти; робити тихіше', 'to refuse an offer; to reduce the volume', 'He turned down the job offer.', 'Він відхилив пропозицію роботи.'],
    ['put off', '', 'phrasal verb', 'B1', 'відкладати', 'to delay doing something until later', 'Stop putting off your homework.', 'Перестань відкладати домашнє завдання.'],
    ['get along with', '', 'phrasal verb', 'B1', 'ладнати з', 'to have a friendly relationship with someone', 'I get along well with my colleagues.', 'Я добре ладнаю з колегами.'],
    ['run out of', '', 'phrasal verb', 'B1', 'закінчуватися (про запаси)', 'to use all of something so that none is left', 'We’ve run out of coffee.', 'У нас закінчилася кава.'],
    ['deal with', '', 'phrasal verb', 'B1', 'мати справу з, розбиратися з', 'to take action to solve a problem or do a task', 'I’ll deal with this bug tomorrow.', 'Я розберуся з цим багом завтра.'],
    ['point out', '', 'phrasal verb', 'B1', 'вказувати (на щось)', 'to tell someone about a fact or mistake', 'She pointed out a mistake in my code.', 'Вона вказала на помилку в моєму коді.'],
    ['catch up', '', 'phrasal verb', 'B1', 'наздоганяти; поспілкуватися після перерви', 'to reach the same level as others; to talk after not seeing each other', 'Let’s catch up over coffee next week.', 'Давай наступного тижня зустрінемося на каву й поговоримо.'],
    ['work out', '', 'phrasal verb', 'B1', 'тренуватися; складатися (вдало)', 'to do exercise; to end in a good way', 'Don’t worry, everything will work out.', 'Не хвилюйся, все складеться.'],
    ['fill in', '', 'phrasal verb', 'A2', 'заповнювати (форму)', 'to write the information needed in a form', 'Please fill in this form.', 'Будь ласка, заповніть цю форму.'],
    ['get over', '', 'phrasal verb', 'B1', 'оговтатися, пережити', 'to recover from an illness or something bad', 'It took me a week to get over the flu.', 'Мені знадобився тиждень, щоб оговтатися від грипу.'],
    ['show up', '', 'phrasal verb', 'B1', 'з’являтися, приходити', 'to arrive, especially late or unexpectedly', 'He showed up an hour late.', 'Він з’явився на годину пізніше.'],
    ['take off', '', 'phrasal verb', 'A2', 'злітати; знімати (одяг)', '(of a plane) to leave the ground; to remove clothes', 'Our plane takes off at 6 am.', 'Наш літак злітає о 6 ранку.'],
  ],
  it: [
    ['deploy', '/dɪˈplɔɪ/', 'verb', 'B1', 'розгортати, деплоїти', 'to release code to a server so that users can use it', 'We deploy to production every Friday.', 'Ми деплоїмо в продакшн щоп’ятниці.'],
    ['bug', '/bʌɡ/', 'noun', 'A2', 'баг, помилка в програмі', 'an error in code that makes it work incorrectly', 'I found a bug in the login form.', 'Я знайшов баг у формі входу.'],
    ['debug', '/ˌdiːˈbʌɡ/', 'verb', 'B1', 'налагоджувати, шукати помилки', 'to find and fix errors in code', 'It took me two hours to debug this issue.', 'У мене пішло дві години, щоб налагодити цю проблему.'],
    ['merge', '/mɜːdʒ/', 'verb', 'B1', 'зливати, мерджити', 'to combine changes from different branches', 'Can you merge my pull request?', 'Можеш змерджити мій пул-реквест?'],
    ['branch', '/brɑːntʃ/', 'noun', 'B1', 'гілка', 'a separate line of development in Git', 'Create a new branch for this feature.', 'Створи нову гілку для цієї фічі.'],
    ['repository', '/rɪˈpɒzɪtri/', 'noun', 'B1', 'репозиторій', 'a place where a project’s code and its history are stored', 'Clone the repository and install the dependencies.', 'Склонуй репозиторій і встанови залежності.'],
    ['requirement', '/rɪˈkwaɪəmənt/', 'noun', 'B1', 'вимога', 'something that is needed or must be done', 'Let’s review the requirements before we start.', 'Давай переглянемо вимоги, перш ніж почати.'],
    ['feature', '/ˈfiːtʃə/', 'noun', 'B1', 'функція, фіча', 'a part of a product that does something useful', 'This feature lets users export their data.', 'Ця функція дозволяє користувачам експортувати свої дані.'],
    ['release', '/rɪˈliːs/', 'noun', 'B1', 'реліз, випуск', 'a version of software made available to users', 'The next release is planned for May.', 'Наступний реліз запланований на травень.'],
    ['dependency', '/dɪˈpendənsi/', 'noun', 'B2', 'залежність (пакет)', 'a package that your project needs in order to work', 'Try not to add unnecessary dependencies.', 'Намагайся не додавати зайвих залежностей.'],
    ['reliable', '/rɪˈlaɪəbl/', 'adjective', 'B1', 'надійний', 'working well and able to be trusted', 'We need a reliable backup system.', 'Нам потрібна надійна система резервного копіювання.'],
    ['maintain', '/meɪnˈteɪn/', 'verb', 'B1', 'підтримувати, супроводжувати', 'to keep something in good condition over time', 'Clean code is easier to maintain.', 'Чистий код легше підтримувати.'],
    ['implement', '/ˈɪmplɪment/', 'verb', 'B2', 'реалізовувати, впроваджувати', 'to make a plan or idea work in practice', 'We implemented the search feature last week.', 'Ми реалізували пошук минулого тижня.'],
    ['refactor', '/ˌriːˈfæktə/', 'verb', 'B2', 'рефакторити', 'to improve the structure of code without changing what it does', 'I refactored this component to make it smaller.', 'Я відрефакторив цей компонент, щоб зробити його меншим.'],
    ['responsive', '/rɪˈspɒnsɪv/', 'adjective', 'B2', 'адаптивний (про дизайн)', 'working well on screens of different sizes', 'The website is fully responsive.', 'Сайт повністю адаптивний.'],
    ['performance', '/pəˈfɔːməns/', 'noun', 'B1', 'продуктивність, швидкодія', 'how fast and efficiently something works', 'Lazy loading improved the app’s performance.', 'Ліниве завантаження покращило продуктивність застосунку.'],
    ['environment', '/ɪnˈvaɪrənmənt/', 'noun', 'B1', 'середовище', 'the setup where code runs, e.g. development or production', 'The bug only happens in the production environment.', 'Баг виникає лише в продакшн-середовищі.'],
    ['code review', '/ˈkəʊd rɪˌvjuː/', 'noun', 'B1', 'рев’ю коду', 'when other developers check your code before it is merged', 'I got useful feedback in the code review.', 'Я отримав корисні зауваження на рев’ю коду.'],
    ['issue', '/ˈɪʃuː/', 'noun', 'B1', 'проблема; задача (тікет)', 'a problem, or a task in a tracker like GitHub or Jira', 'I’ve opened an issue on GitHub.', 'Я створив задачу на GitHub.'],
    ['straightforward', '/ˌstreɪtˈfɔːwəd/', 'adjective', 'B2', 'простий, зрозумілий', 'easy to understand or do', 'The fix was pretty straightforward.', 'Виправлення було досить простим.'],
  ],
  work: [
    ['deadline', '/ˈdedlaɪn/', 'noun', 'B1', 'дедлайн, кінцевий термін', 'the time by which something must be finished', 'The deadline for this task is Monday.', 'Дедлайн для цього завдання — понеділок.'],
    ['schedule', '/ˈʃedjuːl/', 'verb', 'B1', 'планувати, призначати (на час)', 'to arrange for something to happen at a particular time', 'Let’s schedule a call for Tuesday.', 'Давай заплануємо дзвінок на вівторок.'],
    ['colleague', '/ˈkɒliːɡ/', 'noun', 'A2', 'колега', 'a person you work with', 'My colleague helped me with the task.', 'Колега допоміг мені із завданням.'],
    ['be responsible for', '', 'phrase', 'B1', 'відповідати за', 'to have the job of doing or taking care of something', 'I’m responsible for the frontend.', 'Я відповідаю за фронтенд.'],
    ['feedback', '/ˈfiːdbæk/', 'noun', 'B1', 'відгук, зворотний зв’язок', 'comments about how good or bad something is', 'Thanks for the feedback!', 'Дякую за відгук!'],
    ['agenda', '/əˈdʒendə/', 'noun', 'B1', 'порядок денний', 'a list of topics to discuss at a meeting', 'What’s on the agenda for today?', 'Що сьогодні на порядку денному?'],
    ['follow up', '', 'phrasal verb', 'B2', 'повернутися до питання, нагадати', 'to contact someone again to continue something', 'I’ll follow up with an email after the meeting.', 'Після зустрічі я надішлю лист, щоб продовжити тему.'],
    ['attach', '/əˈtætʃ/', 'verb', 'A2', 'прикріплювати', 'to add a file to an email or message', 'I’ve attached the report to this email.', 'Я прикріпив звіт до цього листа.'],
    ['as soon as possible', '', 'phrase', 'A2', 'якнайшвидше', 'very quickly, without delay (often written ASAP)', 'Please reply as soon as possible.', 'Будь ласка, дайте відповідь якнайшвидше.'],
    ['I’d like to', '', 'phrase', 'A2', 'я б хотів', 'a polite way to say what you want', 'I’d like to discuss the budget.', 'Я б хотів обговорити бюджет.'],
    ['let me know', '', 'phrase', 'A2', 'дай(те) знати', 'tell me when you know something', 'Let me know if you have any questions.', 'Дайте знати, якщо виникнуть запитання.'],
  ],
  interviews: [
    ['experience', '/ɪkˈspɪəriəns/', 'noun', 'A2', 'досвід', 'knowledge or skill that you get from doing something', 'I have two years of experience with React.', 'У мене два роки досвіду з React.'],
    ['confident', '/ˈkɒnfɪdənt/', 'adjective', 'B1', 'впевнений', 'sure about your own abilities', 'I feel confident about the interview.', 'Я почуваюся впевнено щодо співбесіди.'],
    ['strength', '/streŋθ/', 'noun', 'B1', 'сильна сторона', 'a good quality or ability that someone has', 'My main strength is attention to detail.', 'Моя головна сильна сторона — уважність до деталей.'],
    ['weakness', '/ˈwiːknəs/', 'noun', 'B1', 'слабка сторона', 'a quality or ability that is not good enough', 'My weakness is that I sometimes take on too much.', 'Моя слабка сторона в тому, що я іноді беру на себе забагато.'],
  ],
  travel: [
    ['departure', '/dɪˈpɑːtʃə/', 'noun', 'B1', 'відправлення, виліт', 'the act of leaving a place, especially on a journey', 'Departure is at 7:40 from gate 12.', 'Виліт о 7:40 з виходу 12.'],
    ['delay', '/dɪˈleɪ/', 'noun', 'B1', 'затримка', 'a period when something happens later than planned', 'There’s a two-hour delay on our flight.', 'Наш рейс затримується на дві години.'],
    ['luggage', '/ˈlʌɡɪdʒ/', 'noun', 'A2', 'багаж', 'the bags and cases you take when you travel', 'How much luggage can I take?', 'Скільки багажу я можу взяти?'],
    ['book', '/bʊk/', 'verb', 'A2', 'бронювати', 'to arrange to have a seat, room or ticket in advance', 'I booked a hotel near the station.', 'Я забронював готель біля вокзалу.'],
    ['sightseeing', '/ˈsaɪtsiːɪŋ/', 'noun', 'A2', 'огляд визначних місць', 'visiting famous places as a tourist', 'We spent the day sightseeing in Rome.', 'Ми провели день, оглядаючи визначні місця Рима.'],
    ['one-way ticket', '', 'noun', 'A2', 'квиток в один бік', 'a ticket for a journey to a place but not back', 'A one-way ticket to Kraków, please.', 'Квиток в один бік до Кракова, будь ласка.'],
    ['accommodation', '/əˌkɒməˈdeɪʃn/', 'noun', 'B1', 'житло, проживання', 'a place to live or stay', 'The price includes flights and accommodation.', 'Ціна включає переліт і проживання.'],
    ['check in', '', 'phrasal verb', 'A2', 'реєструватися, заселятися', 'to register at a hotel or at the airport', 'We can check in after 2 pm.', 'Ми можемо заселитися після 14:00.'],
    ['Could you tell me the way to…?', '', 'phrase', 'A2', 'Чи не підкажете, як дістатися до…?', 'a polite way to ask for directions', 'Could you tell me the way to the station?', 'Чи не підкажете, як дістатися до вокзалу?'],
    ['currency', '/ˈkʌrənsi/', 'noun', 'B1', 'валюта', 'the money used in a particular country', 'What currency do they use in Japan?', 'Яка валюта в Японії?'],
  ],
  idioms: [
    ['a piece of cake', '', 'idiom', 'B1', 'дуже легко, «раз плюнути»', 'something very easy to do', 'The exam was a piece of cake.', 'Іспит був — раз плюнути.'],
    ['break the ice', '', 'idiom', 'B2', 'розрядити атмосферу', 'to make people feel relaxed at the start of a meeting', 'He told a joke to break the ice.', 'Він розповів жарт, щоб розрядити атмосферу.'],
    ['be on the same page', '', 'idiom', 'B2', 'однаково розуміти ситуацію', 'to agree and understand something in the same way', 'Let’s make sure we’re all on the same page.', 'Давайте переконаємося, що ми всі однаково це розуміємо.'],
    ['call it a day', '', 'idiom', 'B2', 'на сьогодні досить', 'to stop working for the rest of the day', 'It’s late — let’s call it a day.', 'Вже пізно — на сьогодні досить.'],
    ['hit the road', '', 'idiom', 'B2', 'вирушати в дорогу', 'to leave or start a journey', 'We should hit the road before the traffic gets bad.', 'Нам варто вирушати, поки не почалися затори.'],
  ],
}
