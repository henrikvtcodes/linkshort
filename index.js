import { Router } from 'itty-router';
import { customAlphabet } from 'nanoid';

import { addSlug } from './handlers';

const router = Router();
const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  6,
);

router.get('/', async request => {
    return new Response(null, {
      headers: { Location: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"},
      status: 301,
    });
});

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

// TODO: add jwt-based authentication
router.post('/links', async request => {
  let requestBody = await request.json();

  if ('url' in requestBody) {
    // Add slug to our KV store so it can be retrieved later:
    let Slug = await addSlug(requestBody.slug, requestBody.url, true, requestBody.ttl);

    let shortenedURL = `${new URL(request.url).origin}/${Slug.slug}`;

    let responseBody = {
      message: 'Link shortened successfully',
      slug,
      shortened: shortenedURL,
    };
    return new Response(JSON.stringify(responseBody), {
      headers: { 'content-type': 'application/json' },
      status: 200,
    });

  }
  else {
    return new Response("Must provide a valid URL", { status: 400 });
  }
});

addEventListener('fetch', event => {
  event.respondWith(router.handle(event.request))
})