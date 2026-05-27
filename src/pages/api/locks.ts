import type { APIContext } from 'astro';
import { getActiveLocks, acquireLock, releaseLock } from '../../lib/db';

export async function GET() {
  try {
    const locks = await getActiveLocks();
    return new Response(JSON.stringify(locks), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    console.error('GET /api/locks error:', e);
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST({ request }: APIContext) {
  try {
    const { field_id, device_id } = await request.json();
    if (!field_id || !device_id) {
      return new Response(JSON.stringify({ error: 'Missing field_id or device_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const success = await acquireLock(field_id, device_id);
    if (!success) {
      return new Response(JSON.stringify({ ok: false, error: 'Field is currently locked by another device' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    console.error('POST /api/locks error:', e);
    return new Response(JSON.stringify({ error: e?.message || 'Lock failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE({ request }: APIContext) {
  try {
    const { field_id, device_id } = await request.json();
    if (!field_id || !device_id) {
      return new Response(JSON.stringify({ error: 'Missing field_id or device_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    await releaseLock(field_id, device_id);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    console.error('DELETE /api/locks error:', e);
    return new Response(JSON.stringify({ error: e?.message || 'Unlock failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
