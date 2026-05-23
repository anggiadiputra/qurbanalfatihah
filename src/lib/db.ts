import { neon } from '@neondatabase/serverless';

const DATABASE_URL = 'postgresql://neondb_owner:npg_lfi4whnS9pTo@ep-fragrant-frog-ao3dh0wh-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

export function getDbUrl(): string {
  return DATABASE_URL;
}

export function createSql() {
  return neon(getDbUrl());
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
      selesai: 0,
      packingWaktuMulai: '',
      packingWaktuSelesai: '',
      waktuMulai: '',
      waktuSelesai: '',
    },
  };
}

export async function getState() {
  const sql = createSql();
  const result = await sql`SELECT data FROM qurban_state WHERE id = 'default'`;
  return result.length > 0 ? result[0].data : null;
}

export async function getSettings() {
  const sql = createSql();
  const result = await sql`SELECT data FROM qurban_state WHERE id = 'settings'`;
  return result.length > 0 ? result[0].data : null;
}

export async function saveSettings(data: unknown) {
  const sql = createSql();
  const json = JSON.stringify(data);
  await sql`
    INSERT INTO qurban_state (id, data, updated_at)
    VALUES ('settings', ${json}::jsonb, NOW())
    ON CONFLICT (id) DO UPDATE
    SET data = ${json}::jsonb, updated_at = NOW()
  `;
}

export async function saveState(data: unknown) {
  const sql = createSql();
  const json = JSON.stringify(data);
  await sql`
    INSERT INTO qurban_state (id, data, updated_at)
    VALUES ('default', ${json}::jsonb, NOW())
    ON CONFLICT (id) DO UPDATE
    SET data = ${json}::jsonb, updated_at = NOW()
  `;
}

export async function resetState() {
  const data = defaultState();
  await saveState(data);
  return data;
}
