import { Router } from 'itty-router';
import { customAlphabet } from 'nanoid';

const router = Router();
const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  6,
);

router.get('/:slug', async request => {
  let link = await linkshort.get(request.params.slug);

  if (link) {
    return new Response(null, {
      headers: { Location: link },
      status: 301,
    });
  } else {
    return new Response('Key not found', {
      status: 404,
    });
  }
});

router.get('/', async request => {
    return new Response(null, {
      headers: { Location: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      status: 200,
    });
});


addEventListener('fetch', event => {
  event.respondWith(router.handle(event.request))
})