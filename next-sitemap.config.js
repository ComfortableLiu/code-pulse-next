/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://code-pulse.cn',
  generateRobotsTxt: true,
}
