import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function migrate() {
  console.log('Running migration...');

  await sql`
    CREATE TABLE IF NOT EXISTS qurban_state (
      id TEXT PRIMARY KEY DEFAULT 'default',
      data JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  const existing = await sql`SELECT id FROM qurban_state WHERE id = 'default'`;
  if (existing.length === 0) {
    const defaultData = {
      totalHewan: 100,
      tanggal: new Date().toISOString().split('T')[0],
      waktuMulai: '06:00',
      waktuSelesai: '',
      kandang: Array.from({ length: 8 }, (_, i) => ({
        no: i + 1, total: 12, keluar: 0,
        waktuMulai: '06:00', waktuSelesai: '', status: 'belum',
      })),
      sembelih: Array.from({ length: 10 }, (_, i) => ({
        no: i + 1, dipotong: 0, status: 'belum',
        waktuMulai: '06:00', waktuSelesai: '',
      })),
      transit: { kaki: 0, kepala: 0, hewan: 0 },
      kalet: Array.from({ length: 30 }, (_, i) => ({
        no: i + 1, total: 0, status: 'belum',
        waktuMulai: '', waktuSelesai: '',
      })),
      cacah: Array.from({ length: 6 }, (_, i) => ({
        no: i + 1, total: 0, status: 'belum',
        waktuMulai: '', waktuSelesai: '',
      })),
      karkas: { sudah: 0, waktuMulai: '', waktuSelesai: '' },
      distribusi: {
        totalPacking: 0, packingSelesai: 0, selesai: 0,
        waktuMulai: '', waktuSelesai: '',
      },
    };
    await sql`
      INSERT INTO qurban_state (id, data)
      VALUES ('default', ${JSON.stringify(defaultData)}::jsonb)
    `;
    console.log('Inserted default state');
  }

  console.log('Migration complete!');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
