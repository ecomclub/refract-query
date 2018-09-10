// Simple version for browser compatibility with vanilla JS

/*
Original (with Lodash 3):
https://github.com/apiaryio/refract-query/blob/master/src/index.js
*/

/*
Supported element query samples:
elementQuery = { element: 'category' }
elementQuery = { element: 'category', 'meta': { 'classes': 'api' } }
*/

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

      // test query at the current level
      var skip = !find(el, elementQuery)
      if (!skip) {
        // matched
        results.push(el)
      }
    }

    return results
  }

  // set find function for recursion
  var find = function (el, elementQuery) {
    for (var prop in elementQuery) {
      if (elementQuery.hasOwnProperty(prop)) {
        var match = false
        var val = elementQuery[prop]
        var obj = el[prop]

        // check type first
        if (typeof val === 'object' && val !== null) {
          if (typeof obj === 'object' && obj !== null) {
            // try recursion
            match = find(obj, val)
          } else {
            // element has not current property
            return false
          }
        } else {
          // support checking string or number within array
          if (!Array.isArray(obj)) {
            obj = [ obj ]
          }
          for (var i = 0; i < obj.length; i++) {
            if (obj[i] === val) {
              match = true
              break
            }
          }
        }

        if (!match) {
          // not matched
          // does not need to continue
          return false
        }
      }
    }

    // goes here if matched
    return true
  }

  if (typeof module !== 'undefined' && module.exports) {
    // NodeJS
    module.exports = query
  } else {
    // declare globally
    window.refractQuery = query
  }
}())
