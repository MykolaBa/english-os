import type { ReadingText } from '../types'

export const lookingForAFlat: ReadingText = {
  id: 'looking-for-a-flat',
  title: 'Looking for a flat',
  level: 'B1',
  topic: 'everyday',
  summary: 'Макс шукає квартиру в новому місті і вчиться ставити правильні запитання орендодавцю.',
  paragraphs: [
    'When Max moved to Kraków for work, the hardest part was finding a flat. Most good places disappeared within a day, so he learned to reply to adverts quickly and to have his documents ready.',
    'Before signing the contract, he asked the landlord a lot of questions. How much is the deposit? Are the bills included in the rent? Can I give notice if I need to leave early? One landlord got annoyed, so Max decided not to rent from him.',
    'In the end, he found a bright one-bedroom flat near a tram stop. The rent was a bit higher than he had planned, but the neighbourhood was quiet and he could get to the office in fifteen minutes. Looking back, he says that asking questions saved him from a lot of trouble.',
  ],
  glossary: [
    { term: 'advert', form: 'adverts', translation: 'оголошення', partOfSpeech: 'noun' },
    { term: 'landlord', translation: 'орендодавець, власник житла', partOfSpeech: 'noun' },
    { term: 'deposit', translation: 'застава, депозит', partOfSpeech: 'noun' },
    { term: 'bills', translation: 'комунальні платежі, рахунки', partOfSpeech: 'noun' },
    { term: 'rent', translation: 'орендна плата; орендувати', partOfSpeech: 'noun' },
    { term: 'give notice', translation: 'заздалегідь попередити про виїзд (розірвання договору)', partOfSpeech: 'phrase' },
    { term: 'annoyed', translation: 'роздратований', partOfSpeech: 'adjective' },
    { term: 'neighbourhood', translation: 'район, околиця', partOfSpeech: 'noun' },
    { term: 'looking back', translation: 'озираючись назад, згадуючи', partOfSpeech: 'phrase' },
  ],
  questions: [
    { id: 'looking-for-a-flat:q1', type: 'choice', prompt: 'Why did Max reply to adverts quickly?', options: ['He had a lot of free time.', 'Good flats disappeared within a day.', 'The landlords asked him to.', 'He wanted the cheapest flat.'], answer: 1, explanation: '«Most good places disappeared within a day» — хороші варіанти зникали за день.' },
    { id: 'looking-for-a-flat:q2', type: 'choice', prompt: 'Which question did Max NOT ask?', options: ['How much is the deposit?', 'Are the bills included in the rent?', 'Can I have a pet?', 'Can I give notice if I need to leave early?'], answer: 2, explanation: 'Про домашніх тварин у тексті не йдеться — решта запитань є в другому абзаці.' },
    { id: 'looking-for-a-flat:q3', type: 'choice', prompt: 'Why didn’t he rent from one of the landlords?', options: ['The landlord got annoyed by his questions.', 'The flat was too dark.', 'The rent was too low.', 'It was far from the office.'], answer: 0, explanation: '«One landlord got annoyed, so Max decided not to rent from him.»' },
    { id: 'looking-for-a-flat:q4', type: 'choice', prompt: 'What was the downside of the flat he chose?', options: ['It was noisy.', 'It was far from the tram.', 'It had no bedroom.', 'The rent was a bit higher than planned.'], answer: 3, explanation: '«The rent was a bit higher than he had planned» — оренда була трохи вищою, ніж він планував.' },
  ],
}
