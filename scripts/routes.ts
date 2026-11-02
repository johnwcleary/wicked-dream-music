/** Every route the audition covers. `/404` is the built 404 page. */
export const routes = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'services', path: '/services' },
  { name: 'work', path: '/work' },
  { name: 'contact', path: '/contact' },
  { name: '404', path: '/404' },
] as const;

export const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
] as const;
