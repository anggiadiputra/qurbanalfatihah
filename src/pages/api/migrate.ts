import type { APIContext } from 'astro';
import { createSql, defaultState, saveState } from '../../lib/db';

export async function GET() {
  try {
    const sql = createSql();
    console.log('Running migration from API...');

    await sql`
      CREATE TABLE IF NOT EXISTS qurban_state (
        id TEXT PRIMARY KEY DEFAULT 'default',
        data JSONB NOT NULL DEFAULT '{}'::jsonb,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS qurban_locks (
        field_id TEXT PRIMARY KEY,
        device_id TEXT NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    const existing = await sql`SELECT id FROM qurban_state WHERE id = 'default'`;
    if (existing.length === 0) {
      await saveState(defaultState());
    }

    return new Response(JSON.stringify({ ok: true, message: 'Migration completed successfully!' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    console.error('API Migration failed:', e);
    return new Response(JSON.stringify({ error: e?.message || 'Migration failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
