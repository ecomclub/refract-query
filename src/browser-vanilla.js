// Simple version for browser compatibility with vanilla JS
// Original (with Lodash 3): ./index.js

(function () {
  'use strict'

  /**
   * Queries the whole Refract tree and finds a respective
   * element(s) which matches the query.
   */
  var query = function (element, elementQuery) {
    if (typeof element !== 'object' || element === null || !Array.isArray(element.content)) {
      return []
    }

    var results = []
    // find elements
    for (var i = 0; i < element.content.length; i++) {
      var el = element.content[i]
      // go deep
      var nested = query(el, elementQuery)
      for (var ii = 0; ii < nested.length; ii++) {
        results.push(nested[ii])
      }

      var skip = false
      for (var prop in elementQuery) {
        if (elementQuery.hasOwnProperty(prop) && el[prop] !== elementQuery[prop]) {
          skip = true
          break
        }
      }
      if (!skip) {
        // matched
        results.push(el)
      }
    }

    return results
  }

  if (typeof module !== 'undefined' && module.exports) {
    // NodeJS
    module.exports = query
  } else {
    // declare globally
    window.refractQuery = query
  }
}())
