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

export function defaultDay2State() {
  return {
    totalKarkas: 0,
    abfKeluar: 0,
    abfMulai: '',
    abfSelesai: '',
    cacah: 0,
    cacahMulai: '',
    cacahSelesai: '',
    mejaCacah: Array.from({ length: 6 }, (_, i) => ({
      nama: 'Meja ' + (i + 1),
      jumlah: 0,
      mulai: '',
      selesai: '',
    })),
    packBox: 0,
    packPack: 0,
    packMulai: '',
    packSelesai: '',
    distribMulai: '',
    distribSelesai: '',
    tanggal: '',
    mulai: '',
    selesai: '',
    distribusi: [] as Array<{ nama: string; jumlah: number; status: string; catatan: string }>,
  };
}

export async function getDay2State() {
  const sql = createSql();
  const result = await sql`SELECT data FROM qurban_state WHERE id = 'day2'`;
  return result.length > 0 ? result[0].data : null;
}

export async function saveDay2State(data: unknown) {
  const sql = createSql();
  const json = JSON.stringify(data);
  await sql`
    INSERT INTO qurban_state (id, data, updated_at)
    VALUES ('day2', ${json}::jsonb, NOW())
    ON CONFLICT (id) DO UPDATE
    SET data = ${json}::jsonb, updated_at = NOW()
  `;
}

export async function resetDay2State() {
  const data = defaultDay2State();
  await saveDay2State(data);
  return data;
}

export async function getDay2Settings() {
  const sql = createSql();
  const result = await sql`SELECT data FROM qurban_state WHERE id = 'day2-settings'`;
  return result.length > 0 ? result[0].data : null;
}

export async function saveDay2Settings(data: unknown) {
  const sql = createSql();
  const json = JSON.stringify(data);
  await sql`
    INSERT INTO qurban_state (id, data, updated_at)
    VALUES ('day2-settings', ${json}::jsonb, NOW())
    ON CONFLICT (id) DO UPDATE
    SET data = ${json}::jsonb, updated_at = NOW()
  `;
}
