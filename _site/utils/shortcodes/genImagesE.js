const Image = require('@11ty/eleventy-img')

module.exports = async (src, alt, classes) => {
  if (alt === undefined) {
    // You bet we throw an error on missing alt (alt="" works okay)
    throw new Error(`Missing \`alt\` on genImagesE from: ${src}`)
  }
  if (process.env.ELEVENTY_ENV === 'production' && process.env.CONTEXT === 'production') {
    const sizes = '(max-width: 360px) 340px, 100vw'
    try {
      var pattern = /https/
      const srcn = pattern.test(src) ? `${src}` : `./_site${src}`
      const formats = ['avif', 'webp', 'jpeg']
      const widths = [340, 480, null]
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
      let defaultSrc = stats['jpeg'][2]
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
          loading="eager">
      </picture>`
    } catch (err) {
      console.error('genImagesE: eleventy-img error:', err, src)

      // load empty img src (as placeholder)
      return `<img src="${src}" alt="${alt}" loading="eager">`
    }
  } else {
    return `<img src="${src}" alt="${alt}" loading="eager" class="${classes ? classes : ''}">`
  }
}
