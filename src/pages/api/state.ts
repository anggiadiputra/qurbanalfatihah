import type { APIContext } from 'astro';
import { getState, saveState, defaultState } from '../../lib/db';

export async function GET({ locals }: APIContext) {
  try {
    const data = await getState(locals);
    return new Response(JSON.stringify(data || defaultState()), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('GET /api/state error:', e);
    return new Response(JSON.stringify(defaultState()), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PATCH({ request, locals }: APIContext) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return new Response(JSON.stringify({ error: 'Invalid body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    await saveState(body, locals);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('PATCH /api/state error:', e);
    return new Response(JSON.stringify({ error: 'Save failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
