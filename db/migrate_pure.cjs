const https = require('https');

const DATABASE_URL = 'postgresql://neondb_owner:npg_8fAKDv4ZIPMw@ep-square-tree-ao6g82z5-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const host = 'ep-square-tree-ao6g82z5-pooler.c-2.ap-southeast-1.aws.neon.tech';

function query(sqlString) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      query: sqlString,
      params: []
    });

    const options = {
      hostname: host,
      port: 443,
      path: '/sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Neon-Connection-String': DATABASE_URL,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch(e) {
            resolve(data);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log("Running migration via pure Node.js https client...");
  
  console.log("Creating table qurban_state...");
  await query(`
    CREATE TABLE IF NOT EXISTS qurban_state (
      id TEXT PRIMARY KEY DEFAULT 'default',
      data JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  console.log("Creating table qurban_locks...");
  await query(`
    CREATE TABLE IF NOT EXISTS qurban_locks (
      field_id TEXT PRIMARY KEY,
      device_id TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  console.log("Checking default state...");
  const existing = await query(`SELECT id FROM qurban_state WHERE id = 'default'`);
  console.log("Existing states query results:", JSON.stringify(existing));
  
  const hasDefault = JSON.stringify(existing).includes('default');
  if (!hasDefault) {
    console.log("Inserting default state...");
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
    
    const defaultDataStr = JSON.stringify(defaultData).replace(/'/g, "''");
    await query(`
      INSERT INTO qurban_state (id, data)
      VALUES ('default', '${defaultDataStr}'::jsonb)
    `);
    console.log("Inserted default state.");
  }

  console.log("Migration completed successfully!");
}

run().catch(console.error);
