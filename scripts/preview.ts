import { spawn, execSync, type ChildProcess } from 'node:child_process';

/** Build (optional) and start `astro preview`, resolving once it answers. */
export async function startPreview(port: number, build = true): Promise<{ url: string; stop: () => void }> {
  if (build) execSync('npm run build', { stdio: 'inherit' });
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
