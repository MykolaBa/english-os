import type { ReadingText } from '../types'

export const howAWebsiteLoads: ReadingText = {
  id: 'how-a-website-loads',
  title: 'What happens when you open a website',
  level: 'B1',
  topic: 'it',
  summary: 'Від адреси в браузері до пікселів на екрані: DNS, запит, відповідь, рендеринг і кеш.',
  paragraphs: [
    'You type an address into the browser and press Enter. Less than a second later, the page appears. A lot happens in that second.',
    'First, the browser needs to find the server. It asks a DNS server to translate the domain name, like example.com, into an IP address. Then it sends an HTTP request to that address. The server processes the request and sends back a response — usually an HTML document.',
    'The browser reads the HTML from top to bottom. When it finds links to CSS files, scripts or images, it requests them too. It builds the page structure, applies the styles and runs the JavaScript. Finally, it paints the pixels on the screen.',
    'That’s why performance matters. Every extra request and every heavy script makes users wait. Caching helps: files that haven’t changed can be loaded from the cache instead of the network.',
  ],
  glossary: [
    { term: 'domain name', translation: 'доменне ім’я', partOfSpeech: 'noun' },
    { term: 'request', translation: 'запит; запитувати', partOfSpeech: 'noun' },
    { term: 'process', form: 'processes', translation: 'обробляти', partOfSpeech: 'verb' },
    { term: 'response', translation: 'відповідь (сервера)', partOfSpeech: 'noun' },
    { term: 'from top to bottom', translation: 'згори донизу', partOfSpeech: 'phrase' },
    { term: 'apply', form: 'applies', translation: 'застосовувати', partOfSpeech: 'verb' },
    { term: 'performance', translation: 'продуктивність, швидкодія', partOfSpeech: 'noun' },
    { term: 'cache', translation: 'кеш', partOfSpeech: 'noun' },
  ],
  questions: [
    { id: 'how-a-website-loads:q1', type: 'choice', prompt: 'What does a DNS server do?', options: ['It stores web pages.', 'It runs JavaScript.', 'It translates a domain name into an IP address.', 'It paints pixels.'], answer: 2, explanation: '«It asks a DNS server to translate the domain name… into an IP address.»' },
    { id: 'how-a-website-loads:q2', type: 'choice', prompt: 'What does the server usually send back?', options: ['An HTML document', 'An image', 'A CSS file', 'A DNS request'], answer: 0, explanation: '«The server… sends back a response — usually an HTML document.»' },
    { id: 'how-a-website-loads:q3', type: 'choice', prompt: 'What does the browser do when it finds links to CSS files and scripts?', options: ['It ignores them.', 'It requests them too.', 'It deletes them.', 'It sends them to the DNS server.'], answer: 1, explanation: '«When it finds links to CSS files, scripts or images, it requests them too.»' },
    { id: 'how-a-website-loads:q4', type: 'choice', prompt: 'How does caching help?', options: ['It makes scripts heavier.', 'It adds extra requests.', 'It changes the domain name.', 'Unchanged files can be loaded without the network.'], answer: 3, explanation: '«Files that haven’t changed can be loaded from the cache instead of the network.»' },
  ],
}
