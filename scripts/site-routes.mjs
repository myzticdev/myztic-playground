export const englishRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/app', changefreq: 'weekly', priority: '0.9' },
  { path: '/examples', changefreq: 'monthly', priority: '0.8' },
  { path: '/security', changefreq: 'monthly', priority: '0.6' },
  { path: '/safe-javascript-playground', changefreq: 'monthly', priority: '0.7' },
  { path: '/for-teachers', changefreq: 'monthly', priority: '0.8' },
  { path: '/learn/html-css-js-playground', changefreq: 'monthly', priority: '0.8' },
  { path: '/export-html-css-js-zip', changefreq: 'monthly', priority: '0.9' },
  { path: '/alternatives/codepen', changefreq: 'monthly', priority: '0.8' },
  { path: '/alternatives/jsfiddle', changefreq: 'monthly', priority: '0.8' },
  { path: '/codepen-vs-jsfiddle-vs-myztic-playground', changefreq: 'monthly', priority: '0.9' },
  { path: '/best-free-html-css-js-playground-no-signup', changefreq: 'monthly', priority: '0.7' },
  { path: '/html-css-js-playground-for-beginners', changefreq: 'monthly', priority: '0.7' },
  { path: '/online-javascript-playground-live-preview', changefreq: 'monthly', priority: '0.7' },
  { path: '/download-html-css-js-project-as-zip', changefreq: 'monthly', priority: '0.7' },
  { path: '/local-save-code-playground', changefreq: 'monthly', priority: '0.7' },
  { path: '/browser-based-frontend-playground', changefreq: 'monthly', priority: '0.7' },
  { path: '/privacy', changefreq: 'monthly', priority: '0.6' },
  { path: '/about', changefreq: 'monthly', priority: '0.5' },
  { path: '/changelog', changefreq: 'weekly', priority: '0.6' },
]

export function spanishPath(englishPath) {
  return englishPath === '/' ? '/es' : `/es${englishPath}`
}
