import type { InterviewQuestion } from './types'

/**
 * Common questions for a junior/middle frontend interview. Sample answers are models to
 * adapt, not scripts to memorise: the learner writes their own answer next to them.
 */
export const INTERVIEW_QUESTIONS: readonly InterviewQuestion[] = [
  {
    id: 'tell-me-about-yourself',
    question: 'Tell me about yourself.',
    kind: 'behavioural',
    level: 'B1',
    tip: 'Це не біографія, а 1–2 хвилини про ваш професійний шлях: хто ви зараз, що вмієте, чого хочете далі.',
    outline: ['Who you are now (role, years of experience)', 'Your main skills and one achievement', 'Why you’re interested in this role'],
    sample: 'I’m a frontend developer with two years of experience, mostly with React and TypeScript. In my current job I build internal dashboards, and recently I reduced the load time of our main page by about forty percent. I enjoy turning complex data into simple interfaces, and I’m looking for a team where I can grow into a middle developer and work on a product used by many people.',
    phrases: [
      { en: 'I have two years of experience in…', uk: 'Маю два роки досвіду в…' },
      { en: 'Recently I…', uk: 'Нещодавно я…' },
      { en: 'I’m looking for a role where I can…', uk: 'Шукаю роль, де зможу…' },
    ],
  },
  {
    id: 'difficult-bug',
    question: 'Tell me about a difficult bug you fixed.',
    kind: 'behavioural',
    level: 'B1',
    tip: 'Розкажіть за схемою STAR: ситуація, завдання, ваші дії, результат. Головне — як ви думали, а не лише що виправили.',
    outline: ['Situation: what was broken and why it mattered', 'Task: what you had to find out', 'Action: how you investigated, step by step', 'Result: the fix and what you learned'],
    sample: 'Users reported that the checkout button sometimes did nothing. I couldn’t reproduce it at first, so I added logging and noticed it only happened after a slow network request. It turned out the button was disabled while a request was pending, and a failed request never enabled it again. I fixed the error handling, added a test for that case, and since then I always check the failure path, not just the happy path.',
    phrases: [
      { en: 'It turned out that…', uk: 'З’ясувалося, що…' },
      { en: 'I couldn’t reproduce it at first.', uk: 'Спочатку я не міг це відтворити.' },
      { en: 'Since then, I always…', uk: 'Відтоді я завжди…' },
    ],
  },
  {
    id: 'disagreement',
    question: 'How do you handle disagreements with teammates?',
    kind: 'behavioural',
    level: 'B1',
    tip: 'Перевіряють, чи вмієте ви сперечатися про ідеї, а не з людьми, і чи можете погодитися з рішенням команди.',
    outline: ['Listen and understand their reasoning', 'Explain your view with facts or examples', 'Look for a compromise or let data decide', 'Commit to the decision once it’s made'],
    sample: 'First, I try to understand why my teammate sees it differently — often they know something I don’t. Then I explain my reasoning with concrete examples. If we still disagree, I suggest a quick experiment or ask the team lead for a decision. Once we decide, I fully support it, even if it wasn’t my idea.',
    phrases: [
      { en: 'I try to understand why…', uk: 'Я намагаюся зрозуміти, чому…' },
      { en: 'If we still disagree, I…', uk: 'Якщо ми все одно не згодні, я…' },
      { en: 'Once we decide, I fully support it.', uk: 'Коли рішення ухвалене, я повністю його підтримую.' },
    ],
  },
  {
    id: 'questions-for-us',
    question: 'Do you have any questions for us?',
    kind: 'behavioural',
    level: 'A2',
    tip: 'Відповідь «ні» звучить як брак інтересу. Підготуйте 2–3 запитання про команду, процеси й розвиток.',
    outline: ['Ask about the team and how work is organised', 'Ask how success is measured in the role', 'Ask about growth and learning'],
    sample: 'Yes, a few. What does a typical week look like for the team? How do you review code and share knowledge? And what would you expect from me in the first three months?',
    phrases: [
      { en: 'What does a typical week look like?', uk: 'Який вигляд має типовий тиждень?' },
      { en: 'What would you expect from me in the first three months?', uk: 'Чого ви очікуватимете від мене в перші три місяці?' },
      { en: 'How do you share knowledge in the team?', uk: 'Як ви ділитеся знаннями в команді?' },
    ],
  },
  {
    id: 'let-const-var',
    question: 'What’s the difference between var, let and const?',
    kind: 'technical',
    level: 'B1',
    tip: 'Очікують три речі: область видимості, повторне присвоєння і поведінку до оголошення (hoisting).',
    outline: ['Scope: var is function-scoped, let and const are block-scoped', 'Reassignment: const can’t be reassigned, but objects it points to can change', 'Hoisting: var is undefined before its line, let and const throw an error', 'What you use in practice'],
    sample: 'var is function-scoped, while let and const are block-scoped, so they only exist inside the nearest curly braces. A const variable can’t be reassigned, but if it holds an object, the object itself can still be changed. var is hoisted and is undefined before its declaration, whereas using let or const too early throws an error. In practice I use const by default and let only when the value has to change.',
    phrases: [
      { en: 'X is function-scoped, while Y is block-scoped.', uk: 'X має область видимості функції, а Y — блоку.' },
      { en: 'It can’t be reassigned.', uk: 'Йому не можна присвоїти нове значення.' },
      { en: 'In practice, I use… by default.', uk: 'На практиці я за замовчуванням використовую…' },
    ],
  },
  {
    id: 'react-rerender',
    question: 'When does a React component re-render?',
    kind: 'technical',
    level: 'B1',
    tip: 'Назвіть причини перерендеру і покажіть, що розумієте: рендер — це не завжди оновлення DOM.',
    outline: ['Its state changes', 'Its parent re-renders (props or not)', 'A context it uses changes', 'Rendering is not the same as updating the DOM', 'How to avoid unnecessary renders when it matters'],
    sample: 'A component re-renders when its state changes, when its parent re-renders, or when a context it reads changes. A re-render doesn’t necessarily update the DOM: React compares the result and applies only the differences. Usually that’s fast enough, but if a component is expensive, I can move state down, split the component, or memoise it with memo and useMemo.',
    phrases: [
      { en: 'It doesn’t necessarily mean…', uk: 'Це не обов’язково означає…' },
      { en: 'React compares the result and applies only the differences.', uk: 'React порівнює результат і застосовує лише відмінності.' },
      { en: 'Usually that’s fast enough, but…', uk: 'Зазвичай цього досить швидко, але…' },
    ],
  },
  {
    id: 'slow-page',
    question: 'A page is slow. How would you make it faster?',
    kind: 'technical',
    level: 'B2',
    tip: 'Важливо почати з вимірювання, а не з здогадок, і назвати кілька рівнів: мережа, бандл, рендеринг.',
    outline: ['Measure first: Lighthouse, the Performance panel, real user data', 'Network: fewer and smaller requests, caching, compressed images', 'Bundle: code splitting and lazy loading', 'Rendering: avoid unnecessary re-renders, virtualise long lists', 'Measure again to confirm'],
    sample: 'First I’d measure, because guessing usually optimises the wrong thing. I’d run Lighthouse and record the page in the Performance panel to see whether the problem is the network, the JavaScript bundle or rendering. Then I’d fix the biggest issue: for example, compress images, split the bundle so each page loads only its own code, or virtualise a long list. Finally, I’d measure again to make sure it actually helped.',
    phrases: [
      { en: 'First, I’d measure…', uk: 'Спершу я б виміряв…' },
      { en: 'to see whether the problem is…', uk: 'щоб побачити, чи проблема в…' },
      { en: 'to make sure it actually helped', uk: 'щоб переконатися, що це справді допомогло' },
    ],
  },
  {
    id: 'accessibility',
    question: 'How do you make a website accessible?',
    kind: 'technical',
    level: 'B2',
    tip: 'Покажіть практичний підхід: семантичний HTML, клавіатура, контраст, тестування з реальними інструментами.',
    outline: ['Semantic HTML first: buttons, labels, headings', 'Everything works with the keyboard, with a visible focus', 'Enough colour contrast; colour is never the only signal', 'ARIA only when HTML isn’t enough', 'Test with a screen reader and automated tools'],
    sample: 'I start with semantic HTML: real buttons, labels for every input and a logical heading structure, because that solves most problems for free. I make sure everything works with the keyboard and the focus is always visible. I check colour contrast and never use colour as the only signal. I add ARIA only when plain HTML isn’t enough, and I test with a screen reader and tools like axe.',
    phrases: [
      { en: 'That solves most problems for free.', uk: 'Це безкоштовно розв’язує більшість проблем.' },
      { en: 'I make sure that…', uk: 'Я стежу за тим, щоб…' },
      { en: 'only when … isn’t enough', uk: 'лише тоді, коли … недостатньо' },
    ],
  },
]
