const rewrites: {
  source: string
  destination: string
}[] = [{
  source: '/',
  destination: '/homepage',
}, {
  source: '/home',
  destination: '/homepage',
}, {
  source: '/about-us',
  destination: '/about',
}, {
  source: '/aboutUs',
  destination: '/about',
}]

export default rewrites
