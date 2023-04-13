module.exports = {
  DEV: process.env.ELEVENTY_ENV !== 'production',
  PRODUCTION: process.env.ELEVENTY_ENV === 'production',
  CONTEXT: process.env.CONTEXT === 'production',
  BRANCH: process.env.CONTEXT !== 'production',
}
