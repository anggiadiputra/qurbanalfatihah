/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<{
  DATABASE_URL: string;
}>;

declare namespace App {
  interface Locals extends Runtime {
    role: 'admin' | 'editor' | 'viewer';
  }
}
