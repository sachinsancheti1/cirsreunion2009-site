const cleancss = require('clean-css')

module.exports = function (content, outputPath) {
  /*  if (outputPath.endsWith('.css')) {
    var options = {}
    var minified = new cleancss(options).minify(content).styles
    return minified
  }
*/ return content
}
