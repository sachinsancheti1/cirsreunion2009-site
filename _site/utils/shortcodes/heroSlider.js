const Image = require('@11ty/eleventy-img')

module.exports = async (src, alt, classes, loopid) => {
  if (alt === undefined) {
    // You bet we throw an error on missing alt (alt="" works okay)
    throw new Error(`Missing \`alt\` on heroSlider from: ${src}`)
  }
  if (process.env.ELEVENTY_ENV === 'production' && process.env.CONTEXT === 'production') {
    const sizes = '100vw'
    try {
      var pattern = /https/
      const srcn = pattern.test(src) ? `${src}` : `./_site${src}`
      const formats = ['avif', 'webp', 'jpeg']
      const widths = [640, 750, 828, 1080, 1200, null]
      let stats = await Image(srcn, {
        widths: widths,
        formats: formats,
        urlPath: '/images/',
        outputDir: 'dist/images/',
        cacheOptions: {
          duration: '365d',
          directory: '.cache',
          removeUrlQueryParams: false,
        },
      })
      // console.log(stats);
      let defaultSrc = stats['jpeg'][5]
      // Iterate over formats and widths
      return `<picture>
      ${Object.values(stats)
        .map((imageFormat) => {
          return `  <source type="image/${imageFormat[0].format}" srcset="${imageFormat
            .map((entry) => `${entry.url} ${entry.width}w`)
            .join(', ')}" sizes="${sizes}">`
        })
        .join('\n')}
        <img
          alt="${alt}"
          class="${classes ? classes : ''}"
          src="${defaultSrc.url}"
          width="${defaultSrc.width}"
          height="${defaultSrc.height}"
          loading="${loopid >= 2 ? 'lazy' : ''}">
      </picture>`
    } catch (err) {
      console.error('heroSlider: eleventy-img error:', err, src)

      // load empty img src (as placeholder)
      return `<img src="${src}?fit=max&auto=format" decoding="async" class="${
        classes ? classes : ''
      }" alt="${alt}" loading="lazy">`
    }
  } else {
    return `<img src="${src}?fit=max&auto=format" decoding="async" class="${
      classes ? classes : ''
    }" alt="${alt}" loading="lazy">`
  }
}
