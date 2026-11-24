import type { ReadingText } from '../types'

export const saturdayMorning: ReadingText = {
  id: 'saturday-morning',
  title: 'A busy Saturday morning',
  level: 'A2',
  topic: 'everyday',
  summary: 'Олена йде до крамниці по молоко для млинців — і дещо забуває.',
  paragraphs: [
    'On Saturday morning Olena woke up late. She wanted to make pancakes, but she had run out of milk. So she put on her coat and went to the small shop on the corner.',
    'The shop was crowded. There was a long queue at the checkout, and only one cashier was working. Olena waited for ten minutes. While she was waiting, she checked the price of eggs. They were more expensive than last week.',
    'At home, she realised that she had forgotten the eggs. She laughed, went back to the shop and bought them. In the end, the pancakes were delicious, and her flatmate offered to do the washing-up.',
  ],
  glossary: [
    { term: 'run out of', translation: 'закінчитися (про запаси)', partOfSpeech: 'phrasal verb' },
    { term: 'crowded', translation: 'переповнений, людний', partOfSpeech: 'adjective' },
    { term: 'queue', translation: 'черга', partOfSpeech: 'noun' },
    { term: 'checkout', translation: 'каса (у магазині)', partOfSpeech: 'noun' },
    { term: 'expensive', translation: 'дорогий', partOfSpeech: 'adjective' },
    { term: 'realise', form: 'realised', translation: 'усвідомити, зрозуміти', partOfSpeech: 'verb' },
    { term: 'flatmate', translation: 'сусід (сусідка) по квартирі', partOfSpeech: 'noun' },
    { term: 'do the washing-up', translation: 'мити посуд', partOfSpeech: 'phrase' },
  ],
  questions: [
    { id: 'saturday-morning:q1', type: 'choice', prompt: 'Why did Olena go to the shop?', options: ['She wanted to buy a coat.', 'She needed milk for pancakes.', 'She worked there on Saturdays.', 'Her flatmate asked her to go.'], answer: 1, explanation: '«She had run out of milk» — у неї закінчилося молоко для млинців.' },
    { id: 'saturday-morning:q2', type: 'choice', prompt: 'Why did she wait for ten minutes?', options: ['There was a long queue and only one cashier.', 'The shop was closed.', 'She couldn’t find the eggs.', 'She was talking to a friend.'], answer: 0, explanation: '«There was a long queue at the checkout, and only one cashier was working.»' },
    { id: 'saturday-morning:q3', type: 'choice', prompt: 'What did she forget to buy?', options: ['Milk', 'Bread', 'Her coat', 'Eggs'], answer: 3, explanation: '«She realised that she had forgotten the eggs» — вона забула яйця.' },
    { id: 'saturday-morning:q4', type: 'choice', prompt: 'Who offered to wash the dishes?', options: ['Olena', 'The cashier', 'Her flatmate', 'Nobody'], answer: 2, explanation: '«Her flatmate offered to do the washing-up» — сусідка запропонувала помити посуд.' },
  ],
}
