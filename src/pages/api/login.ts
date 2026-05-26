import type { APIContext } from 'astro';
import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_TOKEN, EDITOR_EMAIL, EDITOR_PASSWORD, EDITOR_TOKEN, VIEWER_TOKEN, COOKIE_NAME } from '../../lib/auth';

export async function POST({ request }: APIContext) {
  const body = await request.json();
  const { email, password, role } = body;
  const secure = request.url.startsWith('https');
  const maxAge = 60 * 60 * 24 * 7;
  const cookieOpts = `Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? '; Secure' : ''}`;

  if (role === 'viewer') {
    return new Response(JSON.stringify({ ok: true, role: 'viewer' }), {
      headers: { 'Content-Type': 'application/json', 'Set-Cookie': `${COOKIE_NAME}=${VIEWER_TOKEN}; ${cookieOpts}` },
    });
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ ok: true, role: 'admin' }), {
      headers: { 'Content-Type': 'application/json', 'Set-Cookie': `${COOKIE_NAME}=${ADMIN_TOKEN}; ${cookieOpts}` },
    });
  }

  if (email === EDITOR_EMAIL && password === EDITOR_PASSWORD) {
    return new Response(JSON.stringify({ ok: true, role: 'editor' }), {
      headers: { 'Content-Type': 'application/json', 'Set-Cookie': `${COOKIE_NAME}=${EDITOR_TOKEN}; ${cookieOpts}` },
    });
  }

  return new Response(JSON.stringify({ error: 'Email atau password salah' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE({ request }: APIContext) {
  const secure = request.url.startsWith('https');
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? '; Secure' : ''}`,
    },
  });
}
