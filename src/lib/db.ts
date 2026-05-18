import { neon } from '@neondatabase/serverless';

export function getDbUrl(locals?: App.Locals): string {
  const runtime = (locals as any)?.runtime;
  const url =
    runtime?.env?.DATABASE_URL ||
    (typeof process !== 'undefined' ? process.env?.DATABASE_URL : '') ||
    import.meta.env.DATABASE_URL ||
    '';
  if (!url) throw new Error('DATABASE_URL is not configured. runtime=' + JSON.stringify(Object.keys(runtime?.env || {})));
  return url;
}

export function createSql(locals?: App.Locals) {
  return neon(getDbUrl(locals));
}

export function defaultState() {
  return {
    totalHewan: 100,
    tanggal: new Date().toISOString().split('T')[0],
    waktuMulai: '06:00',
    waktuSelesai: '',
    kandang: Array.from({ length: 8 }, (_, i) => ({
      no: i + 1,
      total: 12,
      keluar: 0,
      waktuMulai: '06:00',
      waktuSelesai: '',
      status: 'belum',
    })),
    sembelih: Array.from({ length: 10 }, (_, i) => ({
      no: i + 1,
      dipotong: 0,
      status: 'belum',
      waktuMulai: '06:00',
      waktuSelesai: '',
    })),
    transit: { kaki: 0, kepala: 0, hewan: 0 },
    kalet: Array.from({ length: 30 }, (_, i) => ({
      no: i + 1,
      total: 0,
      status: 'belum',
      waktuMulai: '',
      waktuSelesai: '',
    })),
    cacah: Array.from({ length: 6 }, (_, i) => ({
      no: i + 1,
      total: 0,
      status: 'belum',
      waktuMulai: '',
      waktuSelesai: '',
    })),
    karkas: { sudah: 0, waktuMulai: '', waktuSelesai: '' },
    distribusi: {
      totalPacking: 0,
      packingSelesai: 0,
      selesai: 0,
      waktuMulai: '',
      waktuSelesai: '',
    },
  };
}

export async function getState(locals?: App.Locals) {
  const sql = createSql(locals);
  const result = await sql`SELECT data FROM qurban_state WHERE id = 'default'`;
  return result.length > 0 ? result[0].data : null;
}

export async function saveState(data: unknown, locals?: App.Locals) {
  const sql = createSql(locals);
  const json = JSON.stringify(data);
  await sql`
    INSERT INTO qurban_state (id, data, updated_at)
    VALUES ('default', ${json}::jsonb, NOW())
    ON CONFLICT (id) DO UPDATE
    SET data = ${json}::jsonb, updated_at = NOW()
  `;
}

export async function resetState(locals?: App.Locals) {
  const data = defaultState();
  await saveState(data, locals);
  return data;
}
