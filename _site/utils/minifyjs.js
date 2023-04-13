const UglifyJS = require('uglify-js')

module.exports = function (content, outputPath) {
  if (outputPath.endsWith('.js') && !outputPath.endsWith('sw.js')) {
    let minified = UglifyJS.minify(content)
    if (minified.error) {
      console.log('UglifyJS error: ', minified.error)
      return code
    }
    return minified.code
  }
  return content
}
