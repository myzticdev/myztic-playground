export type ExampleSlug = 'gradient-card' | 'counter' | 'profile-card' | 'orbit-loader' | 'signup-form' | 'theme-switcher'

export type ExampleProject = {
  slug: ExampleSlug
  title: string
  category: 'HTML' | 'CSS' | 'JS'
  lines: number
  description: string
  code: { html: string; css: string; javascript: string }
}

export const exampleProjects: ExampleProject[] = [
  {
    slug: 'gradient-card', title: 'Animated gradient card', category: 'CSS', lines: 42,
    description: 'Layer gradients and subtle motion into a polished callout card.',
    code: {
      html: `<main class="stage">
  <article class="aurora-card">
    <span class="label">CREATIVE CSS</span>
    <h1>Soft gradients,<br><em>bold ideas.</em></h1>
    <p>A tiny study in color, depth, and motion.</p>
    <button>Explore the glow <span>→</span></button>
  </article>
</main>`,
      css: `:root { font-family: Inter, system-ui, sans-serif; color-scheme: dark; }
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; background: #09090e; }
.stage { min-height: 100vh; display: grid; place-items: center; overflow: hidden; }
.aurora-card {
  position: relative; width: min(86vw, 560px); padding: 3.5rem;
  overflow: hidden; border: 1px solid #ffffff20; border-radius: 28px;
  background: radial-gradient(circle at 75% 10%, #b768df88, transparent 35%),
    radial-gradient(circle at 5% 90%, #4e8dff66, transparent 42%), #15111d;
  box-shadow: 0 35px 100px #0009; animation: float 5s ease-in-out infinite;
}
.aurora-card::before { content: ''; position: absolute; inset: -50%; background: conic-gradient(from 90deg, transparent, #d999ff22, transparent 28%); animation: turn 8s linear infinite; }
.aurora-card > * { position: relative; }
.label { color: #d8b4f5; font-size: .7rem; font-weight: 800; letter-spacing: .18em; }
h1 { margin: 1rem 0; font-size: clamp(2.7rem, 9vw, 5rem); line-height: .93; letter-spacing: -.06em; }
em { color: #c88bf0; font-style: normal; }
p { color: #b8afc0; line-height: 1.7; }
button { margin-top: 1.2rem; padding: .9rem 1.1rem; border: 1px solid #ffffff30; border-radius: 10px; color: white; background: #ffffff12; font-weight: 750; }
button span { margin-left: 1rem; }
@keyframes float { 50% { transform: translateY(-10px); } }
@keyframes turn { to { transform: rotate(360deg); } }`,
      javascript: `document.querySelector('button').addEventListener('click', () => {
  document.querySelector('.aurora-card').animate(
    [{ filter: 'hue-rotate(0deg)' }, { filter: 'hue-rotate(65deg)' }, { filter: 'hue-rotate(0deg)' }],
    { duration: 1400, easing: 'ease-out' }
  );
});`,
    },
  },
  {
    slug: 'counter', title: 'Interactive counter', category: 'JS', lines: 38,
    description: 'Wire up a tactile, accessible counter with vanilla JavaScript.',
    code: {
      html: `<main class="counter-card">
  <span class="eyebrow">DAILY MOMENTUM</span>
  <p>Projects shipped</p>
  <output id="count" aria-live="polite">42</output>
  <div class="controls">
    <button id="minus" aria-label="Decrease">−</button>
    <button id="reset">Reset</button>
    <button id="plus" aria-label="Increase">+</button>
  </div>
</main>`,
      css: `:root { font-family: Inter, system-ui, sans-serif; color-scheme: dark; }
* { box-sizing: border-box; }
body { min-height: 100vh; margin: 0; display: grid; place-items: center; color: #eefaf6; background: radial-gradient(circle at top, #17352e, #09100e 62%); }
.counter-card { width: min(88vw, 430px); padding: 3rem; border: 1px solid #8ee6c633; border-radius: 26px; text-align: center; background: #0d1916dd; box-shadow: 0 30px 90px #0008; }
.eyebrow { color: #79d5b5; font-size: .7rem; font-weight: 800; letter-spacing: .16em; }
p { color: #839e95; }
output { display: block; margin: 1.2rem 0 1.8rem; font: 700 6rem/1 ui-monospace, monospace; letter-spacing: -.08em; }
.controls { display: grid; grid-template-columns: 56px 1fr 56px; gap: .7rem; }
button { min-height: 52px; border: 1px solid #7ed8b644; border-radius: 12px; color: #dff8ef; background: #172923; font-size: 1.4rem; cursor: pointer; }
#reset { color: #82ac9e; font-size: .8rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
button:active { transform: scale(.96); }`,
      javascript: `let value = 42;
const output = document.querySelector('#count');
const render = () => {
  output.textContent = value;
  output.animate([{ transform: 'scale(.9)' }, { transform: 'scale(1)' }], { duration: 180 });
};
document.querySelector('#minus').addEventListener('click', () => { value--; render(); });
document.querySelector('#plus').addEventListener('click', () => { value++; render(); });
document.querySelector('#reset').addEventListener('click', () => { value = 0; render(); });`,
    },
  },
  {
    slug: 'profile-card', title: 'Developer profile card', category: 'HTML', lines: 44,
    description: 'Build a refined profile component using semantic HTML and CSS.',
    code: {
      html: `<main>
  <article class="profile">
    <div class="cover"></div>
    <div class="avatar">AM</div>
    <p class="role">FRONTEND ENGINEER</p>
    <h1>Alex Morgan</h1>
    <p class="bio">Building thoughtful interfaces and tiny tools for the open web.</p>
    <ul><li><strong>28</strong> Projects</li><li><strong>4.8k</strong> Followers</li></ul>
    <button>Follow Alex</button>
  </article>
</main>`,
      css: `:root { font-family: Inter, system-ui, sans-serif; color-scheme: dark; }
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; background: #0b0910; }
main { min-height: 100vh; display: grid; place-items: center; }
.profile { position: relative; width: min(88vw, 390px); overflow: hidden; padding: 0 2.2rem 2.2rem; border: 1px solid #ffffff18; border-radius: 25px; background: #15121b; box-shadow: 0 30px 90px #0009; }
.cover { height: 120px; margin-inline: -2.2rem; background: radial-gradient(circle at 25% 30%, #d38dfa, transparent 28%), radial-gradient(circle at 75% 80%, #5a7be9, transparent 32%), #2a1c38; }
.avatar { position: relative; width: 78px; height: 78px; margin-top: -39px; display: grid; place-items: center; border: 5px solid #15121b; border-radius: 50%; color: #26152f; background: linear-gradient(135deg, #d9b5f2, #9b72cf); font-weight: 900; }
.role { margin: 1.4rem 0 .5rem; color: #a682c5; font-size: .67rem; font-weight: 800; letter-spacing: .13em; }
h1 { margin: 0; font-size: 2rem; letter-spacing: -.04em; }
.bio { color: #918a99; line-height: 1.6; }
ul { margin: 1.6rem 0; padding: 1.2rem 0; display: flex; gap: 2rem; border-block: 1px solid #ffffff12; list-style: none; color: #77717e; font-size: .75rem; }
li strong { display: block; color: #eeeaf1; font-size: 1.1rem; }
button { width: 100%; padding: .9rem; border: 0; border-radius: 10px; color: #1a1020; background: #c8a4e5; font-weight: 850; }`,
      javascript: `const button = document.querySelector('button');
button.addEventListener('click', () => {
  const following = button.dataset.following === 'true';
  button.dataset.following = String(!following);
  button.textContent = following ? 'Follow Alex' : 'Following ✓';
});`,
    },
  },
  {
    slug: 'orbit-loader', title: 'Orbit loader', category: 'CSS', lines: 35,
    description: 'Explore transforms, keyframes, and reduced-motion-friendly animation.',
    code: {
      html: `<main><div class="loader" role="status" aria-label="Loading"><div class="core">M</div><i></i><i></i><i></i></div><p>Preparing your workspace</p></main>`,
      css: `:root { font-family: Inter, system-ui, sans-serif; color-scheme: dark; }
body { min-height: 100vh; margin: 0; display: grid; place-items: center; color: #d9cce5; background: radial-gradient(circle, #241831, #09080d 60%); }
main { text-align: center; }
.loader { position: relative; width: 180px; height: 180px; margin: auto; display: grid; place-items: center; }
.core { width: 70px; height: 70px; display: grid; place-items: center; border: 1px solid #bd8ce0; border-radius: 20px; color: #1b1021; background: #c8a1e5; box-shadow: 0 0 40px #a667d577; font-size: 1.4rem; font-weight: 900; }
.loader i { position: absolute; inset: 15px; border: 1px solid #a979ca55; border-radius: 50%; animation: orbit 2.2s linear infinite; }
.loader i::after { content: ''; position: absolute; width: 11px; height: 11px; top: -6px; left: 50%; border-radius: 50%; background: #d5aeef; box-shadow: 0 0 14px #d5aeef; }
.loader i:nth-child(2) { inset: 0; animation-duration: 3.4s; animation-direction: reverse; }
.loader i:nth-child(3) { inset: 32px; animation-duration: 1.6s; }
p { color: #776d80; font-size: .8rem; letter-spacing: .06em; }
@keyframes orbit { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .loader i { animation-duration: 8s; } }`,
      javascript: `// This loader is powered entirely by CSS.
document.querySelector('p').textContent = 'Preparing your workspace…';`,
    },
  },
  {
    slug: 'signup-form', title: 'Sign-up form', category: 'HTML', lines: 48,
    description: 'Practice labels, focus states, and concise form validation.',
    code: {
      html: `<main><form><span>EARLY ACCESS</span><h1>Build with us.</h1><p>Join the list for product notes and small web experiments.</p><label>Name<input name="name" placeholder="Alex Morgan" required></label><label>Email<input name="email" type="email" placeholder="alex@example.com" required></label><button>Join the waitlist <b>→</b></button><output aria-live="polite"></output></form></main>`,
      css: `:root { font-family: Inter, system-ui, sans-serif; color-scheme: dark; }
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; background: radial-gradient(circle at top, #31213f, #0a090d 58%); }
main { min-height: 100vh; display: grid; place-items: center; padding: 1.5rem; }
form { width: min(100%, 430px); padding: 2.8rem; border: 1px solid #ffffff1a; border-radius: 24px; background: #131117e8; box-shadow: 0 30px 90px #0009; }
form > span { color: #bd92df; font-size: .68rem; font-weight: 850; letter-spacing: .16em; }
h1 { margin: .8rem 0; font-size: 2.6rem; letter-spacing: -.05em; }
p { margin-bottom: 1.8rem; color: #8f8894; line-height: 1.6; }
label { margin-top: 1rem; display: block; color: #aaa3af; font-size: .75rem; font-weight: 750; }
input { width: 100%; margin-top: .5rem; padding: .9rem 1rem; border: 1px solid #34303b; border-radius: 9px; outline: 0; color: white; background: #0d0c11; }
input:focus { border-color: #a477c6; box-shadow: 0 0 0 3px #9e6cc222; }
button { width: 100%; margin-top: 1.2rem; padding: .95rem; border: 0; border-radius: 9px; color: #1a1021; background: #c5a2e1; font-weight: 850; }
button b { float: right; }
output { min-height: 1.2rem; margin-top: 1rem; display: block; color: #78cf9c; font-size: .8rem; text-align: center; }`,
      javascript: `const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = new FormData(form).get('name');
  form.querySelector('output').textContent = \`You’re on the list, \${name}!\`;
  form.querySelector('button').textContent = 'You’re in ✓';
});`,
    },
  },
  {
    slug: 'theme-switcher', title: 'Theme switcher', category: 'JS', lines: 40,
    description: 'Toggle a complete interface theme with custom properties and JavaScript.',
    code: {
      html: `<main><nav><span>Myztic Notes</span><button id="theme" aria-label="Toggle theme">☼</button></nav><article><span class="tag">DESIGN SYSTEMS</span><h1>Good interfaces feel inevitable.</h1><p>Use custom properties to make a complete theme change simple, consistent, and instant.</p><a href="#">Read the note <span>→</span></a></article></main>`,
      css: `:root { --bg: #0c0a10; --panel: #151219; --text: #f2edf4; --muted: #928b97; --accent: #c093df; font-family: Inter, system-ui, sans-serif; }
:root.light { --bg: #eee9f2; --panel: #faf8fb; --text: #211b25; --muted: #706876; --accent: #795298; }
* { box-sizing: border-box; }
body { margin: 0; color: var(--text); background: var(--bg); transition: .35s; }
main { min-height: 100vh; padding: clamp(1.2rem, 5vw, 4rem); }
nav { display: flex; align-items: center; justify-content: space-between; font-weight: 850; }
button { width: 44px; height: 44px; border: 1px solid color-mix(in srgb, var(--text) 15%, transparent); border-radius: 50%; color: var(--text); background: var(--panel); font-size: 1.1rem; }
article { max-width: 720px; margin: 16vh auto 0; }
.tag { color: var(--accent); font-size: .7rem; font-weight: 850; letter-spacing: .15em; }
h1 { margin: 1rem 0; font-size: clamp(3rem, 9vw, 6.5rem); line-height: .92; letter-spacing: -.07em; }
p { max-width: 540px; color: var(--muted); font-size: 1.05rem; line-height: 1.7; }
a { margin-top: 1rem; display: inline-flex; gap: 2rem; color: var(--accent); text-decoration: none; font-weight: 800; }`,
      javascript: `const root = document.documentElement;
const button = document.querySelector('#theme');
button.addEventListener('click', () => {
  const isLight = root.classList.toggle('light');
  button.textContent = isLight ? '☾' : '☼';
  button.setAttribute('aria-label', isLight ? 'Use dark theme' : 'Use light theme');
});`,
    },
  },
]

export function getExampleProject(slug: string | null) {
  return exampleProjects.find((example) => example.slug === slug)
}
