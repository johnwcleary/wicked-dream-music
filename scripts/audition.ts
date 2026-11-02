/** Lists the design directions and how to flip between them. */
import { execSync } from 'node:child_process';

const directions = [
  { branch: 'design/signal', pitch: 'Poster / loud accent — massive condensed type on ink, the lavender→pink gradient as the single electric accent.' },
  { branch: 'design/archive', pitch: 'Editorial / portfolio index — calm paper ground, numbered index, image field, hover-reveal work list.' },
  { branch: 'design/dream', pitch: 'Atmospheric / cinematic — deep ink, drifting gradient glows, full-bleed haze hero, horizontal work strip.' },
];

const existing = new Set(
  execSync("git branch --format='%(refname:short)'").toString().split('\n').map((s) => s.trim()).filter(Boolean),
);
const current = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

console.log('\nWicked Dream Music — design audition\n');
for (const d of directions) {
  const mark = d.branch === current ? '→' : ' ';
  const status = existing.has(d.branch) ? '' : '  (branch not created yet)';
  console.log(`${mark} ${d.branch.padEnd(16)} ${d.pitch}${status}`);
}
console.log('\nTo view a direction:');
for (const d of directions) console.log(`  git switch ${d.branch} && npm run dev`);
console.log('\nThen open http://localhost:4321  (back to baseline: git switch main)');
console.log('Screenshots per branch: npm run screenshots → screenshots/<branch>/\n');
