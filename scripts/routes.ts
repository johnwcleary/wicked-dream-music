/**
 * Every route the audition covers. `/404` is the built 404 page.
 * design/archive is a one-page site: the other nav routes redirect to sections.
 */
export const routes = [
  { name: 'home', path: '/' },
  { name: '404', path: '/404' },
] as const;

/** Old routes that now land on a section of the home page. */
export const redirects = [
  { from: '/about', to: '/#about' },
  { from: '/services', to: '/#services' },
  { from: '/work', to: '/#work' },
  { from: '/contact', to: '/#contact' },
] as const;

export const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
] as const;
