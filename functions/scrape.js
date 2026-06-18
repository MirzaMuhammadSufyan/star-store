import fetch from 'node-fetch';

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const target = url.searchParams.get('target');

  if (!target) {
    return new Response(JSON.stringify({ error: 'Missing target URL' }), {
      status: 400,
      headers: { 'content-type': 'application/json' }
    });
  }

  try {
    const response = await fetch(target, {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Target fetch failed: ${response.status}` }), {
        status: response.status,
        headers: { 'content-type': 'application/json' }
      });
    }

    const text = await response.text();
    return new Response(text, {
      headers: { 'content-type': 'text/html;charset=UTF-8' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}
