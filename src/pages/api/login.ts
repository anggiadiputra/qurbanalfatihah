import type { APIContext } from 'astro';
import { EDITOR_EMAIL, EDITOR_PASSWORD, EDITOR_TOKEN, VIEWER_TOKEN, COOKIE_NAME } from '../../lib/auth';

export async function POST({ request }: APIContext) {
  const body = await request.json();
  const { email, password, role } = body;
  const secure = request.url.startsWith('https');

  if (role === 'viewer') {
    return new Response(JSON.stringify({ ok: true, role: 'viewer' }), {
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `${COOKIE_NAME}=${VIEWER_TOKEN}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${secure ? '; Secure' : ''}`,
      },
    });
  }

  if (email === EDITOR_EMAIL && password === EDITOR_PASSWORD) {
    return new Response(JSON.stringify({ ok: true, role: 'editor' }), {
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `${COOKIE_NAME}=${EDITOR_TOKEN}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${secure ? '; Secure' : ''}`,
      },
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
