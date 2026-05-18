import { resetState } from '../../lib/db';

export async function POST() {
  try {
    const data = await resetState();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    console.error('POST /api/reset error:', e);
    return new Response(JSON.stringify({ error: e?.message || 'Reset failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
