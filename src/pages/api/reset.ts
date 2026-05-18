import type { APIContext } from 'astro';
import { resetState } from '../../lib/db';

export async function POST({ locals }: APIContext) {
  try {
    const data = await resetState(locals);
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('POST /api/reset error:', e);
    return new Response(JSON.stringify({ error: 'Reset failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
