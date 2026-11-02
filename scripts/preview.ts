import { spawn, execSync, type ChildProcess } from 'node:child_process';
import { createServer } from 'node:net';

/** Ask the OS for a free port so parallel runs never collide. */
export function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.unref();
    srv.on('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address() as { port: number };
      srv.close(() => resolve(port));
    });
  });
}

/** Build (optional) and start `astro preview`, resolving once it answers. */
export async function startPreview(build = true): Promise<{ url: string; stop: () => void }> {
  if (build) execSync('npm run build', { stdio: 'inherit' });
  const port = await freePort();
  const proc: ChildProcess = spawn('npx', ['astro', 'preview', '--ignore-lock', '--port', String(port), '--host', '127.0.0.1'], {
    stdio: 'ignore',
  });
  const url = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 100; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return { url, stop: () => proc.kill() };
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  proc.kill();
  throw new Error(`astro preview did not start on ${url}`);
}

export const currentBranch = () => execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
