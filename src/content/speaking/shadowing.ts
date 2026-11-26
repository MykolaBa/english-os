import type { ShadowingSet } from './types'

/** Pronunciation through shadowing: hear a sentence, say it the same way, compare. */
export const SHADOWING_SETS: readonly ShadowingSet[] = [
  {
    id: 'th-sounds',
    title: 'The two th sounds',
    focus: 'Кінчик язика між зубами. Глухий звук [θ] — у think, third; дзвінкий [ð] — у this, they. Не замінюйте їх на «с», «з», «т» чи «д»: think і sink — різні слова.',
    sentences: [
      { id: 'th-sounds:1', en: 'I think this is the third time.', uk: 'Здається, це вже втретє.', note: 'think і third — глухий [θ], this і the — дзвінкий [ð].' },
      { id: 'th-sounds:2', en: 'Thank you for those thoughts.', uk: 'Дякую за ці думки.' },
      { id: 'th-sounds:3', en: 'The weather is better than they thought.', uk: 'Погода краща, ніж вони думали.' },
      { id: 'th-sounds:4', en: 'Both of them are in the other room.', uk: 'Обоє в іншій кімнаті.' },
      { id: 'th-sounds:5', en: 'Is this method thread-safe?', uk: 'Цей метод потокобезпечний?', note: 'thread — глухий [θ], this — дзвінкий [ð].' },
    ],
  },
  {
    id: 'word-stress-it',
    title: 'Word stress in tech words',
    focus: 'В англійських IT-словах наголос часто падає не туди, де в українських відповідниках. Наголошений склад довший і гучніший, ненаголошені — короткі й «проковтнуті».',
    sentences: [
      { id: 'word-stress-it:1', en: 'The developer fixed the database.', uk: 'Розробник виправив базу даних.', note: 'deVELoper, DAtabase.' },
      { id: 'word-stress-it:2', en: 'We need to analyse the performance.', uk: 'Нам треба проаналізувати швидкодію.', note: 'ANalyse, perFORmance.' },
      { id: 'word-stress-it:3', en: 'Can you review this component?', uk: 'Можеш переглянути цей компонент?', note: 'reVIEW, comPOnent.' },
      { id: 'word-stress-it:4', en: 'The application is already in production.', uk: 'Застосунок уже в продакшні.', note: 'appliCAtion, proDUCtion.' },
      { id: 'word-stress-it:5', en: 'Let’s deploy the update on Thursday.', uk: 'Задеплоймо оновлення в четвер.', note: 'dePLOY, UPdate (іменник), THURSday.' },
    ],
  },
  {
    id: 'question-intonation',
    title: 'Question intonation',
    focus: 'У запитаннях «так чи ні» голос наприкінці йде вгору. У запитаннях зі словами what, where, how — зазвичай униз. Ввічливі прохання з could / would — теж угору.',
    sentences: [
      { id: 'question-intonation:1', en: 'Are you free on Friday?', uk: 'Ти вільний у п’ятницю?', note: 'Так чи ні — угору на Friday.' },
      { id: 'question-intonation:2', en: 'Have you tested it yet?', uk: 'Ти вже це протестував?', note: 'Угору на yet.' },
      { id: 'question-intonation:3', en: 'Where did you find the bug?', uk: 'Де ти знайшов баг?', note: 'Where — униз на bug.' },
      { id: 'question-intonation:4', en: 'How long will it take?', uk: 'Скільки часу це займе?', note: 'How — униз на take.' },
      { id: 'question-intonation:5', en: 'Could you share your screen?', uk: 'Можеш поділитися екраном?', note: 'Ввічливе прохання — угору на screen.' },
    ],
  },
  {
    id: 'linking',
    title: 'Linking words together',
    focus: 'Носії не роблять пауз між словами: кінцевий приголосний «чіпляється» до наступної голосної. Pick it up звучить як «пі-кі-тап». Так мовлення стає плавним і зрозумілішим.',
    sentences: [
      { id: 'linking:1', en: 'Can I have a coffee, please?', uk: 'Можна мені каву, будь ласка?', note: 'Can_I_have_a — одним потоком.' },
      { id: 'linking:2', en: 'Pick it up at eight.', uk: 'Забери це о восьмій.', note: 'pi-ki-tu-pa-teight: кінцевий приголосний переходить до наступного слова.' },
      { id: 'linking:3', en: 'Not at all.', uk: 'Зовсім ні.', note: 'no-ta-tall.' },
      { id: 'linking:4', en: 'Turn it off and on again.', uk: 'Вимкни й увімкни ще раз.', note: 'tur-ni-to-fan-do-na-gain.' },
      { id: 'linking:5', en: 'What are you up to this weekend?', uk: 'Що плануєш на ці вихідні?', note: 'What_are_you_up_to — без пауз.' },
    ],
  },
]
