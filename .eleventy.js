const yaml = require('js-yaml')
const fs = require('fs')
const { DateTime } = require('luxon')
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const embedYouTube = require('eleventy-plugin-youtube-embed')
const CleanCSS = require('clean-css')
const Image = require('@11ty/eleventy-img')
const markdownIt = require('markdown-it')

module.exports = function (eleventyConfig) {
  eleventyConfig.addNunjucksAsyncShortcode(
    'heroSlider',
    require('./_site/utils/shortcodes/heroSlider.js')
  )
  eleventyConfig.addNunjucksAsyncShortcode(
    'genImages',
    require('./_site/utils/shortcodes/genImages.js')
  )
  eleventyConfig.addNunjucksAsyncShortcode(
    'genImagesE',
    require('./_site/utils/shortcodes/genImagesE.js')
  )
  
  eleventyConfig.setDataDeepMerge(true)
  eleventyConfig.addPassthroughCopy('./_site/images')
  eleventyConfig.addPassthroughCopy('./_site/favicon.ico')
  eleventyConfig.addPassthroughCopy('./_site/css')
  eleventyConfig.addPassthroughCopy('./_site/js')
  eleventyConfig.addPassthroughCopy('./_site/fonts')

  eleventyConfig.addPassthroughCopy('./_site/browserconfig.xml')
  eleventyConfig.addPassthroughCopy('./_site/manifest.webmanifest')
  eleventyConfig.addPassthroughCopy('./_site/sw.js')
  eleventyConfig.addPassthroughCopy('./_site/robots.txt')

  eleventyConfig.addLayoutAlias('base', 'base.njk')
  eleventyConfig.addLayoutAlias('page', 'page.njk')
  eleventyConfig.addDataExtension('yaml', (contents) => yaml.safeLoad(contents))
  eleventyConfig.addPlugin(syntaxHighlight)

  eleventyConfig.addWatchTarget('./_site/css/')
  eleventyConfig.addWatchTarget('./_site/js/')

  eleventyConfig.addFilter('markdownify', function (value) {
    const md = new markdownIt({
      html: true,
      breaks: true,
    })
    return md.render(value)
  })

 eleventyConfig.addFilter('propAddressSimple', (ojbAddress) => {
    return ojbAddress.join(', ')
  })
  eleventyConfig.addFilter('propClassJoin', (ojbAddress) => {
    return ojbAddress.join(' ')
  })

  eleventyConfig.addFilter('simpleDate', (dateObj) => {
    return DateTime.fromJSDate(new Date(dateObj), { zone: 'utc+5:30' }).toFormat('LLL dd, yyyy')
  })

  eleventyConfig.addFilter('stringy', (objarray) => {
    return objarray.toString()
  })

  eleventyConfig.addCollection('articles', function (collection) {
    return collection.getFilteredByGlob('_site/posts/*.md').reverse()
  })

  eleventyConfig.addFilter('limit', (array, qty) =>
    qty < 0 ? array.slice(qty) : array.slice(0, qty)
  )

  eleventyConfig.addPlugin(eleventyNavigationPlugin)

  if (process.env.ELEVENTY_ENV === 'production') {
    eleventyConfig.addPlugin(require('./_site/_11ty/optimize-html.js'))
  }
  /*eleventyConfig.addPlugin(require('./_site/_11ty/json-ld.js'));*/
  /*eleventyConfig.addPlugin(require('./_site/_11ty/apply-csp.js'))*/

  eleventyConfig.addTransform('cleancss', require('./_site/utils/css-clean.js'))
  eleventyConfig.addTransform('minifyjs', require('./_site/utils/minifyjs.js'))

  eleventyConfig.addNunjucksAsyncFilter('addHash', function (absolutePath, callback) {
    readFile(`dist${absolutePath}`, {
      encoding: 'utf-8',
    })
      .then((content) => {
        return hasha.async(content)
      })
      .then((hash) => {
        callback(null, `${absolutePath}?hash=${hash.substr(0, 10)}`)
      })
      .catch((error) => callback(error))
  })

  // compress and combine js files
  eleventyConfig.addFilter('jsmin', function (code) {
    const UglifyJS = require('uglify-js')
    let minified = UglifyJS.minify(code)
    if (minified.error) {
      console.log('UglifyJS error: ', minified.error)
      return code
    }
    return minified.code
  })
  eleventyConfig.addFilter('cssmin', function (code) {
    return new CleanCSS({}).minify(code).styles
  })

  return {
    markdownTemplateEngine: 'njk',
    dir: {
      input: '_site',
      data: '_data',
      includes: '_includes',
      layouts: '_includes/layouts',
      output: 'dist',
    },
  }
}
