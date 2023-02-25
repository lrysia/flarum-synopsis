/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/boolbase/index.js":
/*!****************************************!*\
  !*** ./node_modules/boolbase/index.js ***!
  \****************************************/
/***/ ((module) => {

module.exports = {
  trueFunc: function trueFunc() {
    return true;
  },
  falseFunc: function falseFunc() {
    return false;
  }
};

/***/ }),

/***/ "./node_modules/css-what/lib/es/parse.js":
/*!***********************************************!*\
  !*** ./node_modules/css-what/lib/es/parse.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isTraversal": () => (/* binding */ isTraversal),
/* harmony export */   "parse": () => (/* binding */ parse)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./node_modules/css-what/lib/es/types.js");

var reName = /^[^\\#]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\-\u00b0-\uFFFF])+/;
var reEscape = /\\([\da-f]{1,6}\s?|(\s)|.)/gi;
var actionTypes = new Map([[126
/* Tilde */
, _types__WEBPACK_IMPORTED_MODULE_0__.AttributeAction.Element], [94
/* Circumflex */
, _types__WEBPACK_IMPORTED_MODULE_0__.AttributeAction.Start], [36
/* Dollar */
, _types__WEBPACK_IMPORTED_MODULE_0__.AttributeAction.End], [42
/* Asterisk */
, _types__WEBPACK_IMPORTED_MODULE_0__.AttributeAction.Any], [33
/* ExclamationMark */
, _types__WEBPACK_IMPORTED_MODULE_0__.AttributeAction.Not], [124
/* Pipe */
, _types__WEBPACK_IMPORTED_MODULE_0__.AttributeAction.Hyphen]]); // Pseudos, whose data property is parsed as well.

var unpackPseudos = new Set(["has", "not", "matches", "is", "where", "host", "host-context"]);
/**
 * Checks whether a specific selector is a traversal.
 * This is useful eg. in swapping the order of elements that
 * are not traversals.
 *
 * @param selector Selector to check.
 */

function isTraversal(selector) {
  switch (selector.type) {
    case _types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Adjacent:
    case _types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Child:
    case _types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Descendant:
    case _types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Parent:
    case _types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Sibling:
    case _types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.ColumnCombinator:
      return true;

    default:
      return false;
  }
}
var stripQuotesFromPseudos = new Set(["contains", "icontains"]); // Unescape function taken from https://github.com/jquery/sizzle/blob/master/src/sizzle.js#L152

function funescape(_, escaped, escapedWhitespace) {
  var high = parseInt(escaped, 16) - 0x10000; // NaN means non-codepoint

  return high !== high || escapedWhitespace ? escaped : high < 0 ? // BMP codepoint
  String.fromCharCode(high + 0x10000) : // Supplemental Plane codepoint (surrogate pair)
  String.fromCharCode(high >> 10 | 0xd800, high & 0x3ff | 0xdc00);
}

function unescapeCSS(str) {
  return str.replace(reEscape, funescape);
}

function isQuote(c) {
  return c === 39
  /* SingleQuote */
  || c === 34
  /* DoubleQuote */
  ;
}

function isWhitespace(c) {
  return c === 32
  /* Space */
  || c === 9
  /* Tab */
  || c === 10
  /* NewLine */
  || c === 12
  /* FormFeed */
  || c === 13
  /* CarriageReturn */
  ;
}
/**
 * Parses `selector`, optionally with the passed `options`.
 *
 * @param selector Selector to parse.
 * @param options Options for parsing.
 * @returns Returns a two-dimensional array.
 * The first dimension represents selectors separated by commas (eg. `sub1, sub2`),
 * the second contains the relevant tokens for that selector.
 */


function parse(selector) {
  var subselects = [];
  var endIndex = parseSelector(subselects, "" + selector, 0);

  if (endIndex < selector.length) {
    throw new Error("Unmatched selector: " + selector.slice(endIndex));
  }

  return subselects;
}

function parseSelector(subselects, selector, selectorIndex) {
  var tokens = [];

  function getName(offset) {
    var match = selector.slice(selectorIndex + offset).match(reName);

    if (!match) {
      throw new Error("Expected name, found " + selector.slice(selectorIndex));
    }

    var name = match[0];
    selectorIndex += offset + name.length;
    return unescapeCSS(name);
  }

  function stripWhitespace(offset) {
    selectorIndex += offset;

    while (selectorIndex < selector.length && isWhitespace(selector.charCodeAt(selectorIndex))) {
      selectorIndex++;
    }
  }

  function readValueWithParenthesis() {
    selectorIndex += 1;
    var start = selectorIndex;
    var counter = 1;

    for (; counter > 0 && selectorIndex < selector.length; selectorIndex++) {
      if (selector.charCodeAt(selectorIndex) === 40
      /* LeftParenthesis */
      && !isEscaped(selectorIndex)) {
        counter++;
      } else if (selector.charCodeAt(selectorIndex) === 41
      /* RightParenthesis */
      && !isEscaped(selectorIndex)) {
        counter--;
      }
    }

    if (counter) {
      throw new Error("Parenthesis not matched");
    }

    return unescapeCSS(selector.slice(start, selectorIndex - 1));
  }

  function isEscaped(pos) {
    var slashCount = 0;

    while (selector.charCodeAt(--pos) === 92
    /* BackSlash */
    ) {
      slashCount++;
    }

    return (slashCount & 1) === 1;
  }

  function ensureNotTraversal() {
    if (tokens.length > 0 && isTraversal(tokens[tokens.length - 1])) {
      throw new Error("Did not expect successive traversals.");
    }
  }

  function addTraversal(type) {
    if (tokens.length > 0 && tokens[tokens.length - 1].type === _types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Descendant) {
      tokens[tokens.length - 1].type = type;
      return;
    }

    ensureNotTraversal();
    tokens.push({
      type: type
    });
  }

  function addSpecialAttribute(name, action) {
    tokens.push({
      type: _types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Attribute,
      name: name,
      action: action,
      value: getName(1),
      namespace: null,
      ignoreCase: "quirks"
    });
  }
  /**
   * We have finished parsing the current part of the selector.
   *
   * Remove descendant tokens at the end if they exist,
   * and return the last index, so that parsing can be
   * picked up from here.
   */


  function finalizeSubselector() {
    if (tokens.length && tokens[tokens.length - 1].type === _types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Descendant) {
      tokens.pop();
    }

    if (tokens.length === 0) {
      throw new Error("Empty sub-selector");
    }

    subselects.push(tokens);
  }

  stripWhitespace(0);

  if (selector.length === selectorIndex) {
    return selectorIndex;
  }

  loop: while (selectorIndex < selector.length) {
    var firstChar = selector.charCodeAt(selectorIndex);

    switch (firstChar) {
      // Whitespace
      case 32
      /* Space */
      :
      case 9
      /* Tab */
      :
      case 10
      /* NewLine */
      :
      case 12
      /* FormFeed */
      :
      case 13
      /* CarriageReturn */
      :
        {
          if (tokens.length === 0 || tokens[0].type !== _types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Descendant) {
            ensureNotTraversal();
            tokens.push({
              type: _types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Descendant
            });
          }

          stripWhitespace(1);
          break;
        }
      // Traversals

      case 62
      /* GreaterThan */
      :
        {
          addTraversal(_types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Child);
          stripWhitespace(1);
          break;
        }

      case 60
      /* LessThan */
      :
        {
          addTraversal(_types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Parent);
          stripWhitespace(1);
          break;
        }

      case 126
      /* Tilde */
      :
        {
          addTraversal(_types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Sibling);
          stripWhitespace(1);
          break;
        }

      case 43
      /* Plus */
      :
        {
          addTraversal(_types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Adjacent);
          stripWhitespace(1);
          break;
        }
      // Special attribute selectors: .class, #id

      case 46
      /* Period */
      :
        {
          addSpecialAttribute("class", _types__WEBPACK_IMPORTED_MODULE_0__.AttributeAction.Element);
          break;
        }

      case 35
      /* Hash */
      :
        {
          addSpecialAttribute("id", _types__WEBPACK_IMPORTED_MODULE_0__.AttributeAction.Equals);
          break;
        }

      case 91
      /* LeftSquareBracket */
      :
        {
          stripWhitespace(1); // Determine attribute name and namespace

          var name = void 0;
          var namespace = null;

          if (selector.charCodeAt(selectorIndex) === 124
          /* Pipe */
          ) {
            // Equivalent to no namespace
            name = getName(1);
          } else if (selector.startsWith("*|", selectorIndex)) {
            namespace = "*";
            name = getName(2);
          } else {
            name = getName(0);

            if (selector.charCodeAt(selectorIndex) === 124
            /* Pipe */
            && selector.charCodeAt(selectorIndex + 1) !== 61
            /* Equal */
            ) {
              namespace = name;
              name = getName(1);
            }
          }

          stripWhitespace(0); // Determine comparison operation

          var action = _types__WEBPACK_IMPORTED_MODULE_0__.AttributeAction.Exists;
          var possibleAction = actionTypes.get(selector.charCodeAt(selectorIndex));

          if (possibleAction) {
            action = possibleAction;

            if (selector.charCodeAt(selectorIndex + 1) !== 61
            /* Equal */
            ) {
              throw new Error("Expected `=`");
            }

            stripWhitespace(2);
          } else if (selector.charCodeAt(selectorIndex) === 61
          /* Equal */
          ) {
            action = _types__WEBPACK_IMPORTED_MODULE_0__.AttributeAction.Equals;
            stripWhitespace(1);
          } // Determine value


          var value = "";
          var ignoreCase = null;

          if (action !== "exists") {
            if (isQuote(selector.charCodeAt(selectorIndex))) {
              var quote = selector.charCodeAt(selectorIndex);
              var sectionEnd = selectorIndex + 1;

              while (sectionEnd < selector.length && (selector.charCodeAt(sectionEnd) !== quote || isEscaped(sectionEnd))) {
                sectionEnd += 1;
              }

              if (selector.charCodeAt(sectionEnd) !== quote) {
                throw new Error("Attribute value didn't end");
              }

              value = unescapeCSS(selector.slice(selectorIndex + 1, sectionEnd));
              selectorIndex = sectionEnd + 1;
            } else {
              var valueStart = selectorIndex;

              while (selectorIndex < selector.length && (!isWhitespace(selector.charCodeAt(selectorIndex)) && selector.charCodeAt(selectorIndex) !== 93
              /* RightSquareBracket */
              || isEscaped(selectorIndex))) {
                selectorIndex += 1;
              }

              value = unescapeCSS(selector.slice(valueStart, selectorIndex));
            }

            stripWhitespace(0); // See if we have a force ignore flag

            var forceIgnore = selector.charCodeAt(selectorIndex) | 0x20; // If the forceIgnore flag is set (either `i` or `s`), use that value

            if (forceIgnore === 115
            /* LowerS */
            ) {
              ignoreCase = false;
              stripWhitespace(1);
            } else if (forceIgnore === 105
            /* LowerI */
            ) {
              ignoreCase = true;
              stripWhitespace(1);
            }
          }

          if (selector.charCodeAt(selectorIndex) !== 93
          /* RightSquareBracket */
          ) {
            throw new Error("Attribute selector didn't terminate");
          }

          selectorIndex += 1;
          var attributeSelector = {
            type: _types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Attribute,
            name: name,
            action: action,
            value: value,
            namespace: namespace,
            ignoreCase: ignoreCase
          };
          tokens.push(attributeSelector);
          break;
        }

      case 58
      /* Colon */
      :
        {
          if (selector.charCodeAt(selectorIndex + 1) === 58
          /* Colon */
          ) {
            tokens.push({
              type: _types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.PseudoElement,
              name: getName(2).toLowerCase(),
              data: selector.charCodeAt(selectorIndex) === 40
              /* LeftParenthesis */
              ? readValueWithParenthesis() : null
            });
            continue;
          }

          var _name = getName(1).toLowerCase();

          var data = null;

          if (selector.charCodeAt(selectorIndex) === 40
          /* LeftParenthesis */
          ) {
            if (unpackPseudos.has(_name)) {
              if (isQuote(selector.charCodeAt(selectorIndex + 1))) {
                throw new Error("Pseudo-selector " + _name + " cannot be quoted");
              }

              data = [];
              selectorIndex = parseSelector(data, selector, selectorIndex + 1);

              if (selector.charCodeAt(selectorIndex) !== 41
              /* RightParenthesis */
              ) {
                throw new Error("Missing closing parenthesis in :" + _name + " (" + selector + ")");
              }

              selectorIndex += 1;
            } else {
              data = readValueWithParenthesis();

              if (stripQuotesFromPseudos.has(_name)) {
                var quot = data.charCodeAt(0);

                if (quot === data.charCodeAt(data.length - 1) && isQuote(quot)) {
                  data = data.slice(1, -1);
                }
              }

              data = unescapeCSS(data);
            }
          }

          tokens.push({
            type: _types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Pseudo,
            name: _name,
            data: data
          });
          break;
        }

      case 44
      /* Comma */
      :
        {
          finalizeSubselector();
          tokens = [];
          stripWhitespace(1);
          break;
        }

      default:
        {
          if (selector.startsWith("/*", selectorIndex)) {
            var endIndex = selector.indexOf("*/", selectorIndex + 2);

            if (endIndex < 0) {
              throw new Error("Comment was not terminated");
            }

            selectorIndex = endIndex + 2; // Remove leading whitespace

            if (tokens.length === 0) {
              stripWhitespace(0);
            }

            break;
          }

          var _namespace = null;

          var _name2 = void 0;

          if (firstChar === 42
          /* Asterisk */
          ) {
            selectorIndex += 1;
            _name2 = "*";
          } else if (firstChar === 124
          /* Pipe */
          ) {
            _name2 = "";

            if (selector.charCodeAt(selectorIndex + 1) === 124
            /* Pipe */
            ) {
              addTraversal(_types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.ColumnCombinator);
              stripWhitespace(2);
              break;
            }
          } else if (reName.test(selector.slice(selectorIndex))) {
            _name2 = getName(0);
          } else {
            break loop;
          }

          if (selector.charCodeAt(selectorIndex) === 124
          /* Pipe */
          && selector.charCodeAt(selectorIndex + 1) !== 124
          /* Pipe */
          ) {
            _namespace = _name2;

            if (selector.charCodeAt(selectorIndex + 1) === 42
            /* Asterisk */
            ) {
              _name2 = "*";
              selectorIndex += 2;
            } else {
              _name2 = getName(1);
            }
          }

          tokens.push(_name2 === "*" ? {
            type: _types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Universal,
            namespace: _namespace
          } : {
            type: _types__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Tag,
            name: _name2,
            namespace: _namespace
          });
        }
    }
  }

  finalizeSubselector();
  return selectorIndex;
}

/***/ }),

/***/ "./node_modules/css-what/lib/es/types.js":
/*!***********************************************!*\
  !*** ./node_modules/css-what/lib/es/types.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AttributeAction": () => (/* binding */ AttributeAction),
/* harmony export */   "IgnoreCaseMode": () => (/* binding */ IgnoreCaseMode),
/* harmony export */   "SelectorType": () => (/* binding */ SelectorType)
/* harmony export */ });
var SelectorType;

(function (SelectorType) {
  SelectorType["Attribute"] = "attribute";
  SelectorType["Pseudo"] = "pseudo";
  SelectorType["PseudoElement"] = "pseudo-element";
  SelectorType["Tag"] = "tag";
  SelectorType["Universal"] = "universal"; // Traversals

  SelectorType["Adjacent"] = "adjacent";
  SelectorType["Child"] = "child";
  SelectorType["Descendant"] = "descendant";
  SelectorType["Parent"] = "parent";
  SelectorType["Sibling"] = "sibling";
  SelectorType["ColumnCombinator"] = "column-combinator";
})(SelectorType || (SelectorType = {}));
/**
 * Modes for ignore case.
 *
 * This could be updated to an enum, and the object is
 * the current stand-in that will allow code to be updated
 * without big changes.
 */


var IgnoreCaseMode = {
  Unknown: null,
  QuirksMode: "quirks",
  IgnoreCase: true,
  CaseSensitive: false
};
var AttributeAction;

(function (AttributeAction) {
  AttributeAction["Any"] = "any";
  AttributeAction["Element"] = "element";
  AttributeAction["End"] = "end";
  AttributeAction["Equals"] = "equals";
  AttributeAction["Exists"] = "exists";
  AttributeAction["Hyphen"] = "hyphen";
  AttributeAction["Not"] = "not";
  AttributeAction["Start"] = "start";
})(AttributeAction || (AttributeAction = {}));

/***/ }),

/***/ "./src/forum/addSummaryExcerpt.tsx":
/*!*****************************************!*\
  !*** ./src/forum/addSummaryExcerpt.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ addSummaryExcerpt)
/* harmony export */ });
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_states_DiscussionListState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/states/DiscussionListState */ "flarum/forum/states/DiscussionListState");
/* harmony import */ var flarum_forum_states_DiscussionListState__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_states_DiscussionListState__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/components/DiscussionListItem */ "flarum/forum/components/DiscussionListItem");
/* harmony import */ var flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/utils/string */ "flarum/common/utils/string");
/* harmony import */ var flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_tags_models_Tag__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/tags/models/Tag */ "flarum/tags/models/Tag");
/* harmony import */ var flarum_tags_models_Tag__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_tags_models_Tag__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/Model */ "flarum/common/Model");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Model__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var cheerio__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! cheerio */ "./node_modules/cheerio/lib/esm/index.js");








function addSummaryExcerpt() {
  if (flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().initializers.has('flarum-tags')) {
    (flarum_tags_models_Tag__WEBPACK_IMPORTED_MODULE_5___default().prototype.richExcerpts) = flarum_common_Model__WEBPACK_IMPORTED_MODULE_6___default().attribute('richExcerpts');
    (flarum_tags_models_Tag__WEBPACK_IMPORTED_MODULE_5___default().prototype.excerptLength) = flarum_common_Model__WEBPACK_IMPORTED_MODULE_6___default().attribute('excerptLength');
  }

  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)((flarum_forum_states_DiscussionListState__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'requestParams', function (params) {
    if (flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('synopsis.excerpt_type') === 'first') params.include.push('firstPost');else params.include.push('lastPost');
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)((flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_3___default().prototype), 'infoItems', function (items) {
    var _tag, _tag2, _tag3, _tag4;

    var discussion = this.attrs.discussion;

    if ((flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session.user) && !flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session.user.preferences().showSynopsisExcerpts) {
      return;
    }

    var tags = discussion.tags();
    var tag;

    if (tags) {
      tag = tags[tags.length - 1];
    }

    var excerptPost = flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('synopsis.excerpt_type') === 'first' ? discussion.firstPost() : discussion.lastPost();
    var excerptLength = typeof ((_tag = tag) == null ? void 0 : _tag.excerptLength()) === 'number' ? (_tag2 = tag) == null ? void 0 : _tag2.excerptLength() : flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('synopsis.excerpt_length');
    var richExcerpt = typeof ((_tag3 = tag) == null ? void 0 : _tag3.richExcerpts()) === 'number' ? (_tag4 = tag) == null ? void 0 : _tag4.richExcerpts() : flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('synopsis.rich_excerpts'); // const onMobile = app.session.user ? app.session.user.preferences().showSynopsisExcerptsOnMobile : false;
    // A length of zero means we don't want a synopsis for this discussion, so do nothing.

    if (excerptLength === 0) {
      return;
    }

    if (!(excerptPost != null && excerptPost.contentHtml != null && excerptPost.contentHtml())) return;
    /*
        原实现: 将一楼post内容对应的html字符串按设定长度截断，然后将html字符串 m.trust 转化为html
        新实现: 提取一楼post中的文本内容，按设定长度截断；再提取post中的img或视频外链内容(按数量上限)，
               再经 m.trust 转化为html。
    */
    // 纯文本内容按设定长度截断

    var contentText = (0,flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_4__.truncate)(excerptPost.contentPlain(), excerptLength); // 展示的数量上限

    var maxResources = 3; // 富文本提取支持(目前)：图片

    function getResource(html, maxResources) {
      // 根据展示数量上限，计算单图最大宽度(百分比)
      var maxWidth = (100 - 2 * maxResources) / maxResources; // 使用cheerio操作html字符串(一楼post内容)

      var $ = cheerio__WEBPACK_IMPORTED_MODULE_7__["default"].load(html, null, false);
      var images = $('img'); // 选择器:img标签

      var ret = ''; // 不含img标签

      if (images.length === 0) {
        return ret; // const vedios = $(iframe);
      } // 含img标签
      else {
        for (var i = 0; i < images.length && i < maxResources; i++) {
          ret += "<li class=\"ianm-syno-imgs\" style=\"max-width: " + maxWidth + "%;\">" + $.html(images[i]) + '</li>';
        }
      } // 将字符串解析为html


      return m.trust(ret);
    } // console.log(this);
    // console.log(discussion);
    // console.log(excerptPost);
    // console.log(excerptPost.contentHtml());
    // 非文本资源


    var contentResource = richExcerpt ? getResource(excerptPost.contentHtml(), maxResources) : '';
    console.log(contentResource); // 原插件的核心实现
    // const content = richExcerpt ? m.trust(truncate(excerptPost.contentHtml(), excerptLength)) : truncate(excerptPost.contentPlain(), excerptLength);

    if (excerptPost) {
      var excerpt;

      if (contentResource !== '') {
        excerpt = m("div", {
          "class": "ianm-synopsis-excerpt"
        }, m("div", {
          "class": "ianm-synopsis-text"
        }, contentText), m("div", {
          "class": "ianm-synopsis-resource"
        }, m("ul", {
          "class": "ianm-synopsis-gallary"
        }, contentResource)));
      } else {
        excerpt = m("div", {
          "class": "ianm-synopsis-excerpt"
        }, m("div", {
          "class": "ianm-synopsis-text"
        }, contentText));
      } // items.add(onMobile ? 'excerptM' : 'excerpt', excerpt, -100);


      items.add('excerpt', excerpt, -100);
    }
  });
}

/***/ }),

/***/ "./src/forum/addUserPreference.ts":
/*!****************************************!*\
  !*** ./src/forum/addUserPreference.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_SettingsPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/SettingsPage */ "flarum/forum/components/SettingsPage");
/* harmony import */ var flarum_forum_components_SettingsPage__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_SettingsPage__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_FieldSet__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/FieldSet */ "flarum/common/components/FieldSet");
/* harmony import */ var flarum_common_components_FieldSet__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_FieldSet__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/Switch */ "flarum/common/components/Switch");
/* harmony import */ var flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/utils/Stream */ "flarum/common/utils/Stream");
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_6__);







/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_SettingsPage__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'oninit', function () {
    this.showSynopsisExcerpts = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_6___default()(this.user.preferences().showSynopsisExcerpts);
    this.showSynopsisExcerptsOnMobile = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_6___default()(this.user.preferences().showSynopsisExcerptsOnMobile);
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_SettingsPage__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'settingsItems', function (items) {
    items.add('synopsis', flarum_common_components_FieldSet__WEBPACK_IMPORTED_MODULE_3___default().component({
      label: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-synopsis.forum.user.settings.summaries-heading'),
      className: 'Settings-Synopsis'
    }, this.summariesItems().toArray()));
  });

  (flarum_forum_components_SettingsPage__WEBPACK_IMPORTED_MODULE_2___default().prototype.summariesItems) = function () {
    var _this = this;

    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4___default())();
    items.add('synopsis-excerpts', flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_5___default().component({
      state: this.user.preferences().showSynopsisExcerpts,
      onchange: function onchange(value) {
        _this.showSynopsisExcerptsLoading = true;

        _this.user.savePreferences({
          showSynopsisExcerpts: value
        }).then(function () {
          _this.showSynopsisExcerptsLoading = false;
          m.redraw();
        });
      },
      loading: this.showSynopsisExcerptsLoading
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-synopsis.forum.user.settings.show-summaries'))); //
    // if (this.user.preferences().showSynopsisExcerpts) {
    //   items.add(
    //     'synopsis-excerpts-mobile',
    //     Switch.component(
    //       {
    //         state: this.user.preferences().showSynopsisExcerptsOnMobile,
    //         disabled: !this.user.preferences().showSynopsisExcerpts,
    //         onchange: (value) => {
    //           this.showSynopsisExcerptsOnMobileLoading = true;
    //
    //           this.user.savePreferences({ showSynopsisExcerptsOnMobile: value }).then(() => {
    //             this.showSynopsisExcerptsOnMobileLoading = false;
    //             window.location.reload();
    //           });
    //         },
    //         loading: this.showSynopsisExcerptsOnMobileLoading,
    //       },
    //       app.translator.trans('ianm-synopsis.forum.user.settings.show-summaries-mobile')
    //     )
    //   );
    // }

    return items;
  };
}

/***/ }),

/***/ "./src/forum/index.ts":
/*!****************************!*\
  !*** ./src/forum/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _addSummaryExcerpt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./addSummaryExcerpt */ "./src/forum/addSummaryExcerpt.tsx");
/* harmony import */ var _addUserPreference__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./addUserPreference */ "./src/forum/addUserPreference.ts");



flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('ianm-synopsis', function () {
  (0,_addSummaryExcerpt__WEBPACK_IMPORTED_MODULE_1__["default"])();
  (0,_addUserPreference__WEBPACK_IMPORTED_MODULE_2__["default"])();
});

/***/ }),

/***/ "flarum/common/Model":
/*!*****************************************************!*\
  !*** external "flarum.core.compat['common/Model']" ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/Model'];

/***/ }),

/***/ "flarum/common/components/FieldSet":
/*!*******************************************************************!*\
  !*** external "flarum.core.compat['common/components/FieldSet']" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/FieldSet'];

/***/ }),

/***/ "flarum/common/components/Switch":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Switch']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Switch'];

/***/ }),

/***/ "flarum/common/extend":
/*!******************************************************!*\
  !*** external "flarum.core.compat['common/extend']" ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/extend'];

/***/ }),

/***/ "flarum/common/utils/ItemList":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['common/utils/ItemList']" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/ItemList'];

/***/ }),

/***/ "flarum/common/utils/Stream":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/utils/Stream']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/Stream'];

/***/ }),

/***/ "flarum/common/utils/string":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/utils/string']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/string'];

/***/ }),

/***/ "flarum/forum/app":
/*!**************************************************!*\
  !*** external "flarum.core.compat['forum/app']" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/app'];

/***/ }),

/***/ "flarum/forum/components/DiscussionListItem":
/*!****************************************************************************!*\
  !*** external "flarum.core.compat['forum/components/DiscussionListItem']" ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/DiscussionListItem'];

/***/ }),

/***/ "flarum/forum/components/SettingsPage":
/*!**********************************************************************!*\
  !*** external "flarum.core.compat['forum/components/SettingsPage']" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/SettingsPage'];

/***/ }),

/***/ "flarum/forum/states/DiscussionListState":
/*!*************************************************************************!*\
  !*** external "flarum.core.compat['forum/states/DiscussionListState']" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/states/DiscussionListState'];

/***/ }),

/***/ "flarum/tags/models/Tag":
/*!********************************************************!*\
  !*** external "flarum.core.compat['tags/models/Tag']" ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['tags/models/Tag'];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _createClass)
/* harmony export */ });
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inheritsLoose)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

/***/ }),

/***/ "./node_modules/cheerio-select/lib/esm/helpers.js":
/*!********************************************************!*\
  !*** ./node_modules/cheerio-select/lib/esm/helpers.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getDocumentRoot": () => (/* binding */ getDocumentRoot),
/* harmony export */   "groupSelectors": () => (/* binding */ groupSelectors)
/* harmony export */ });
/* harmony import */ var _positionals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./positionals.js */ "./node_modules/cheerio-select/lib/esm/positionals.js");
function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }


function getDocumentRoot(node) {
  while (node.parent) {
    node = node.parent;
  }

  return node;
}
function groupSelectors(selectors) {
  var filteredSelectors = [];
  var plainSelectors = [];

  for (var _iterator = _createForOfIteratorHelperLoose(selectors), _step; !(_step = _iterator()).done;) {
    var selector = _step.value;

    if (selector.some(_positionals_js__WEBPACK_IMPORTED_MODULE_0__.isFilter)) {
      filteredSelectors.push(selector);
    } else {
      plainSelectors.push(selector);
    }
  }

  return [plainSelectors, filteredSelectors];
}

/***/ }),

/***/ "./node_modules/cheerio-select/lib/esm/index.js":
/*!******************************************************!*\
  !*** ./node_modules/cheerio-select/lib/esm/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "aliases": () => (/* reexport safe */ css_select__WEBPACK_IMPORTED_MODULE_1__.aliases),
/* harmony export */   "filter": () => (/* binding */ filter),
/* harmony export */   "filters": () => (/* reexport safe */ css_select__WEBPACK_IMPORTED_MODULE_1__.filters),
/* harmony export */   "is": () => (/* binding */ is),
/* harmony export */   "pseudos": () => (/* reexport safe */ css_select__WEBPACK_IMPORTED_MODULE_1__.pseudos),
/* harmony export */   "select": () => (/* binding */ select),
/* harmony export */   "some": () => (/* binding */ some)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var css_what__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! css-what */ "./node_modules/css-what/lib/es/types.js");
/* harmony import */ var css_what__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! css-what */ "./node_modules/css-what/lib/es/parse.js");
/* harmony import */ var css_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! css-select */ "./node_modules/css-select/lib/esm/index.js");
/* harmony import */ var domutils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! domutils */ "./node_modules/domutils/lib/esm/index.js");
/* harmony import */ var boolbase__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! boolbase */ "./node_modules/boolbase/index.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers.js */ "./node_modules/cheerio-select/lib/esm/helpers.js");
/* harmony import */ var _positionals_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./positionals.js */ "./node_modules/cheerio-select/lib/esm/positionals.js");






 // Re-export pseudo extension points


var UNIVERSAL_SELECTOR = {
  type: css_what__WEBPACK_IMPORTED_MODULE_6__.SelectorType.Universal,
  namespace: null
};
var SCOPE_PSEUDO = {
  type: css_what__WEBPACK_IMPORTED_MODULE_6__.SelectorType.Pseudo,
  name: "scope",
  data: null
};
function is(element, selector, options) {
  if (options === void 0) {
    options = {};
  }

  return some([element], selector, options);
}
function some(elements, selector, options) {
  if (options === void 0) {
    options = {};
  }

  if (typeof selector === "function") return elements.some(selector);

  var _groupSelectors = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_4__.groupSelectors)((0,css_what__WEBPACK_IMPORTED_MODULE_7__.parse)(selector)),
      plain = _groupSelectors[0],
      filtered = _groupSelectors[1];

  return plain.length > 0 && elements.some((0,css_select__WEBPACK_IMPORTED_MODULE_1__._compileToken)(plain, options)) || filtered.some(function (sel) {
    return filterBySelector(sel, elements, options).length > 0;
  });
}

function filterByPosition(filter, elems, data, options) {
  var num = typeof data === "string" ? parseInt(data, 10) : NaN;

  switch (filter) {
    case "first":
    case "lt":
      // Already done in `getLimit`
      return elems;

    case "last":
      return elems.length > 0 ? [elems[elems.length - 1]] : elems;

    case "nth":
    case "eq":
      return isFinite(num) && Math.abs(num) < elems.length ? [num < 0 ? elems[elems.length + num] : elems[num]] : [];

    case "gt":
      return isFinite(num) ? elems.slice(num + 1) : [];

    case "even":
      return elems.filter(function (_, i) {
        return i % 2 === 0;
      });

    case "odd":
      return elems.filter(function (_, i) {
        return i % 2 === 1;
      });

    case "not":
      {
        var filtered = new Set(filterParsed(data, elems, options));
        return elems.filter(function (e) {
          return !filtered.has(e);
        });
      }
  }
}

function filter(selector, elements, options) {
  if (options === void 0) {
    options = {};
  }

  return filterParsed((0,css_what__WEBPACK_IMPORTED_MODULE_7__.parse)(selector), elements, options);
}
/**
 * Filter a set of elements by a selector.
 *
 * Will return elements in the original order.
 *
 * @param selector Selector to filter by.
 * @param elements Elements to filter.
 * @param options Options for selector.
 */

function filterParsed(selector, elements, options) {
  if (elements.length === 0) return [];

  var _groupSelectors2 = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_4__.groupSelectors)(selector),
      plainSelectors = _groupSelectors2[0],
      filteredSelectors = _groupSelectors2[1];

  var found;

  if (plainSelectors.length) {
    var filtered = filterElements(elements, plainSelectors, options); // If there are no filters, just return

    if (filteredSelectors.length === 0) {
      return filtered;
    } // Otherwise, we have to do some filtering


    if (filtered.length) {
      found = new Set(filtered);
    }
  }

  for (var i = 0; i < filteredSelectors.length && (found === null || found === void 0 ? void 0 : found.size) !== elements.length; i++) {
    var filteredSelector = filteredSelectors[i];
    var missing = found ? elements.filter(function (e) {
      return domutils__WEBPACK_IMPORTED_MODULE_2__.isTag(e) && !found.has(e);
    }) : elements;
    if (missing.length === 0) break;

    var _filtered = filterBySelector(filteredSelector, elements, options);

    if (_filtered.length) {
      if (!found) {
        /*
         * If we haven't found anything before the last selector,
         * just return what we found now.
         */
        if (i === filteredSelectors.length - 1) {
          return _filtered;
        }

        found = new Set(_filtered);
      } else {
        _filtered.forEach(function (el) {
          return found.add(el);
        });
      }
    }
  }

  return typeof found !== "undefined" ? found.size === elements.length ? elements : // Filter elements to preserve order
  elements.filter(function (el) {
    return found.has(el);
  }) : [];
}

function filterBySelector(selector, elements, options) {
  var _a;

  if (selector.some(css_what__WEBPACK_IMPORTED_MODULE_7__.isTraversal)) {
    /*
     * Get root node, run selector with the scope
     * set to all of our nodes.
     */
    var root = (_a = options.root) !== null && _a !== void 0 ? _a : (0,_helpers_js__WEBPACK_IMPORTED_MODULE_4__.getDocumentRoot)(elements[0]);

    var opts = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, options, {
      context: elements,
      relativeSelector: false
    });

    selector.push(SCOPE_PSEUDO);
    return findFilterElements(root, selector, opts, true, elements.length);
  } // Performance optimization: If we don't have to traverse, just filter set.


  return findFilterElements(elements, selector, options, false, elements.length);
}

function select(selector, root, options, limit) {
  if (options === void 0) {
    options = {};
  }

  if (limit === void 0) {
    limit = Infinity;
  }

  if (typeof selector === "function") {
    return find(root, selector);
  }

  var _groupSelectors3 = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_4__.groupSelectors)((0,css_what__WEBPACK_IMPORTED_MODULE_7__.parse)(selector)),
      plain = _groupSelectors3[0],
      filtered = _groupSelectors3[1];

  var results = filtered.map(function (sel) {
    return findFilterElements(root, sel, options, true, limit);
  }); // Plain selectors can be queried in a single go

  if (plain.length) {
    results.push(findElements(root, plain, options, limit));
  }

  if (results.length === 0) {
    return [];
  } // If there was only a single selector, just return the result


  if (results.length === 1) {
    return results[0];
  } // Sort results, filtering for duplicates


  return domutils__WEBPACK_IMPORTED_MODULE_2__.uniqueSort(results.reduce(function (a, b) {
    return [].concat(a, b);
  }));
}
/**
 *
 * @param root Element(s) to search from.
 * @param selector Selector to look for.
 * @param options Options for querying.
 * @param queryForSelector Query multiple levels deep for the initial selector, even if it doesn't contain a traversal.
 */

function findFilterElements(root, selector, options, queryForSelector, totalLimit) {
  var filterIndex = selector.findIndex(_positionals_js__WEBPACK_IMPORTED_MODULE_5__.isFilter);
  var sub = selector.slice(0, filterIndex);
  var filter = selector[filterIndex]; // If we are at the end of the selector, we can limit the number of elements to retrieve.

  var partLimit = selector.length - 1 === filterIndex ? totalLimit : Infinity;
  /*
   * Set the number of elements to retrieve.
   * Eg. for :first, we only have to get a single element.
   */

  var limit = (0,_positionals_js__WEBPACK_IMPORTED_MODULE_5__.getLimit)(filter.name, filter.data, partLimit);
  if (limit === 0) return [];
  /*
   * Skip `findElements` call if our selector starts with a positional
   * pseudo.
   */

  var elemsNoLimit = sub.length === 0 && !Array.isArray(root) ? domutils__WEBPACK_IMPORTED_MODULE_2__.getChildren(root).filter(domutils__WEBPACK_IMPORTED_MODULE_2__.isTag) : sub.length === 0 ? (Array.isArray(root) ? root : [root]).filter(domutils__WEBPACK_IMPORTED_MODULE_2__.isTag) : queryForSelector || sub.some(css_what__WEBPACK_IMPORTED_MODULE_7__.isTraversal) ? findElements(root, [sub], options, limit) : filterElements(root, [sub], options);
  var elems = elemsNoLimit.slice(0, limit);
  var result = filterByPosition(filter.name, elems, filter.data, options);

  if (result.length === 0 || selector.length === filterIndex + 1) {
    return result;
  }

  var remainingSelector = selector.slice(filterIndex + 1);
  var remainingHasTraversal = remainingSelector.some(css_what__WEBPACK_IMPORTED_MODULE_7__.isTraversal);

  if (remainingHasTraversal) {
    if ((0,css_what__WEBPACK_IMPORTED_MODULE_7__.isTraversal)(remainingSelector[0])) {
      var type = remainingSelector[0].type;

      if (type === css_what__WEBPACK_IMPORTED_MODULE_6__.SelectorType.Sibling || type === css_what__WEBPACK_IMPORTED_MODULE_6__.SelectorType.Adjacent) {
        // If we have a sibling traversal, we need to also look at the siblings.
        result = (0,css_select__WEBPACK_IMPORTED_MODULE_1__.prepareContext)(result, domutils__WEBPACK_IMPORTED_MODULE_2__, true);
      } // Avoid a traversal-first selector error.


      remainingSelector.unshift(UNIVERSAL_SELECTOR);
    }

    options = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, options, {
      // Avoid absolutizing the selector
      relativeSelector: false,

      /*
       * Add a custom root func, to make sure traversals don't match elements
       * that aren't a part of the considered tree.
       */
      rootFunc: function rootFunc(el) {
        return result.includes(el);
      }
    });
  } else if (options.rootFunc && options.rootFunc !== boolbase__WEBPACK_IMPORTED_MODULE_3__.trueFunc) {
    options = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, options, {
      rootFunc: boolbase__WEBPACK_IMPORTED_MODULE_3__.trueFunc
    });
  }
  /*
   * If we have another filter, recursively call `findFilterElements`,
   * with the `recursive` flag disabled. We only have to look for more
   * elements when we see a traversal.
   *
   * Otherwise,
   */


  return remainingSelector.some(_positionals_js__WEBPACK_IMPORTED_MODULE_5__.isFilter) ? findFilterElements(result, remainingSelector, options, false, totalLimit) : remainingHasTraversal ? // Query existing elements to resolve traversal.
  findElements(result, [remainingSelector], options, totalLimit) : // If we don't have any more traversals, simply filter elements.
  filterElements(result, [remainingSelector], options);
}

function findElements(root, sel, options, limit) {
  var query = (0,css_select__WEBPACK_IMPORTED_MODULE_1__._compileToken)(sel, options, root);
  return find(root, query, limit);
}

function find(root, query, limit) {
  if (limit === void 0) {
    limit = Infinity;
  }

  var elems = (0,css_select__WEBPACK_IMPORTED_MODULE_1__.prepareContext)(root, domutils__WEBPACK_IMPORTED_MODULE_2__, query.shouldTestNextSiblings);
  return domutils__WEBPACK_IMPORTED_MODULE_2__.find(function (node) {
    return domutils__WEBPACK_IMPORTED_MODULE_2__.isTag(node) && query(node);
  }, elems, true, limit);
}

function filterElements(elements, sel, options) {
  var els = (Array.isArray(elements) ? elements : [elements]).filter(domutils__WEBPACK_IMPORTED_MODULE_2__.isTag);
  if (els.length === 0) return els;
  var query = (0,css_select__WEBPACK_IMPORTED_MODULE_1__._compileToken)(sel, options);
  return query === boolbase__WEBPACK_IMPORTED_MODULE_3__.trueFunc ? els : els.filter(query);
}

/***/ }),

/***/ "./node_modules/cheerio-select/lib/esm/positionals.js":
/*!************************************************************!*\
  !*** ./node_modules/cheerio-select/lib/esm/positionals.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "filterNames": () => (/* binding */ filterNames),
/* harmony export */   "getLimit": () => (/* binding */ getLimit),
/* harmony export */   "isFilter": () => (/* binding */ isFilter)
/* harmony export */ });
var filterNames = new Set(["first", "last", "eq", "gt", "nth", "lt", "even", "odd"]);
function isFilter(s) {
  if (s.type !== "pseudo") return false;
  if (filterNames.has(s.name)) return true;

  if (s.name === "not" && Array.isArray(s.data)) {
    // Only consider `:not` with embedded filters
    return s.data.some(function (s) {
      return s.some(isFilter);
    });
  }

  return false;
}
function getLimit(filter, data, partLimit) {
  var num = data != null ? parseInt(data, 10) : NaN;

  switch (filter) {
    case "first":
      return 1;

    case "nth":
    case "eq":
      return isFinite(num) ? num >= 0 ? num + 1 : Infinity : 0;

    case "lt":
      return isFinite(num) ? num >= 0 ? Math.min(num, partLimit) : Infinity : 0;

    case "gt":
      return isFinite(num) ? Infinity : 0;

    case "odd":
      return 2 * partLimit;

    case "even":
      return 2 * partLimit - 1;

    case "last":
    case "not":
      return Infinity;
  }
}

/***/ }),

/***/ "./node_modules/cheerio/lib/esm/api/attributes.js":
/*!********************************************************!*\
  !*** ./node_modules/cheerio/lib/esm/api/attributes.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addClass": () => (/* binding */ addClass),
/* harmony export */   "attr": () => (/* binding */ attr),
/* harmony export */   "data": () => (/* binding */ data),
/* harmony export */   "hasClass": () => (/* binding */ hasClass),
/* harmony export */   "prop": () => (/* binding */ prop),
/* harmony export */   "removeAttr": () => (/* binding */ removeAttr),
/* harmony export */   "removeClass": () => (/* binding */ removeClass),
/* harmony export */   "toggleClass": () => (/* binding */ toggleClass),
/* harmony export */   "val": () => (/* binding */ val)
/* harmony export */ });
/* harmony import */ var _static_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../static.js */ "./node_modules/cheerio/lib/esm/static.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/cheerio/lib/esm/utils.js");
/* harmony import */ var domutils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! domutils */ "./node_modules/domutils/lib/esm/index.js");
/**
 * Methods for getting and modifying attributes.
 *
 * @module cheerio/attributes
 */



var hasOwn = Object.prototype.hasOwnProperty;
var rspace = /\s+/;
var dataAttrPrefix = 'data-';
/*
 * Lookup table for coercing string data-* attributes to their corresponding
 * JavaScript primitives
 */

var primitives = {
  "null": null,
  "true": true,
  "false": false
}; // Attributes that are booleans

var rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i; // Matches strings that look like JSON objects or arrays

var rbrace = /^{[^]*}$|^\[[^]*]$/;

function getAttr(elem, name, xmlMode) {
  var _a;

  if (!elem || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isTag)(elem)) return undefined;
  (_a = elem.attribs) !== null && _a !== void 0 ? _a : elem.attribs = {}; // Return the entire attribs object if no attribute specified

  if (!name) {
    return elem.attribs;
  }

  if (hasOwn.call(elem.attribs, name)) {
    // Get the (decoded) attribute
    return !xmlMode && rboolean.test(name) ? name : elem.attribs[name];
  } // Mimic the DOM and return text content as value for `option's`


  if (elem.name === 'option' && name === 'value') {
    return (0,_static_js__WEBPACK_IMPORTED_MODULE_0__.text)(elem.children);
  } // Mimic DOM with default value for radios/checkboxes


  if (elem.name === 'input' && (elem.attribs['type'] === 'radio' || elem.attribs['type'] === 'checkbox') && name === 'value') {
    return 'on';
  }

  return undefined;
}
/**
 * Sets the value of an attribute. The attribute will be deleted if the value is `null`.
 *
 * @private
 * @param el - The element to set the attribute on.
 * @param name - The attribute's name.
 * @param value - The attribute's value.
 */


function setAttr(el, name, value) {
  if (value === null) {
    removeAttribute(el, name);
  } else {
    el.attribs[name] = "" + value;
  }
}

function attr(name, value) {
  // Set the value (with attr map support)
  if (typeof name === 'object' || value !== undefined) {
    if (typeof value === 'function') {
      if (typeof name !== 'string') {
        {
          throw new Error('Bad combination of arguments.');
        }
      }

      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.domEach)(this, function (el, i) {
        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isTag)(el)) setAttr(el, name, value.call(el, i, el.attribs[name]));
      });
    }

    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.domEach)(this, function (el) {
      if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isTag)(el)) return;

      if (typeof name === 'object') {
        Object.keys(name).forEach(function (objName) {
          var objValue = name[objName];
          setAttr(el, objName, objValue);
        });
      } else {
        setAttr(el, name, value);
      }
    });
  }

  return arguments.length > 1 ? this : getAttr(this[0], name, this.options.xmlMode);
}
/**
 * Gets a node's prop.
 *
 * @private
 * @category Attributes
 * @param el - Element to get the prop of.
 * @param name - Name of the prop.
 * @returns The prop's value.
 */

function getProp(el, name, xmlMode) {
  return name in el ? // @ts-expect-error TS doesn't like us accessing the value directly here.
  el[name] : !xmlMode && rboolean.test(name) ? getAttr(el, name, false) !== undefined : getAttr(el, name, xmlMode);
}
/**
 * Sets the value of a prop.
 *
 * @private
 * @param el - The element to set the prop on.
 * @param name - The prop's name.
 * @param value - The prop's value.
 */


function setProp(el, name, value, xmlMode) {
  if (name in el) {
    // @ts-expect-error Overriding value
    el[name] = value;
  } else {
    setAttr(el, name, !xmlMode && rboolean.test(name) ? value ? '' : null : "" + value);
  }
}

function prop(name, value) {
  var _this = this;

  var _a;

  if (typeof name === 'string' && value === undefined) {
    var el = this[0];
    if (!el || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isTag)(el)) return undefined;

    switch (name) {
      case 'style':
        {
          var property = this.css();
          var keys = Object.keys(property);
          keys.forEach(function (p, i) {
            property[i] = p;
          });
          property.length = keys.length;
          return property;
        }

      case 'tagName':
      case 'nodeName':
        {
          return el.name.toUpperCase();
        }

      case 'href':
      case 'src':
        {
          var _prop = (_a = el.attribs) === null || _a === void 0 ? void 0 : _a[name];
          /* eslint-disable node/no-unsupported-features/node-builtins */


          if (typeof URL !== 'undefined' && (name === 'href' && (el.tagName === 'a' || el.name === 'link') || name === 'src' && (el.tagName === 'img' || el.tagName === 'iframe' || el.tagName === 'audio' || el.tagName === 'video' || el.tagName === 'source')) && _prop !== undefined && this.options.baseURI) {
            return new URL(_prop, this.options.baseURI).href;
          }
          /* eslint-enable node/no-unsupported-features/node-builtins */


          return _prop;
        }

      case 'innerText':
        {
          return (0,domutils__WEBPACK_IMPORTED_MODULE_2__.innerText)(el);
        }

      case 'textContent':
        {
          return (0,domutils__WEBPACK_IMPORTED_MODULE_2__.textContent)(el);
        }

      case 'outerHTML':
        return this.clone().wrap('<container />').parent().html();

      case 'innerHTML':
        return this.html();

      default:
        return getProp(el, name, this.options.xmlMode);
    }
  }

  if (typeof name === 'object' || value !== undefined) {
    if (typeof value === 'function') {
      if (typeof name === 'object') {
        throw new Error('Bad combination of arguments.');
      }

      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.domEach)(this, function (el, i) {
        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isTag)(el)) {
          setProp(el, name, value.call(el, i, getProp(el, name, _this.options.xmlMode)), _this.options.xmlMode);
        }
      });
    }

    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.domEach)(this, function (el) {
      if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isTag)(el)) return;

      if (typeof name === 'object') {
        Object.keys(name).forEach(function (key) {
          var val = name[key];
          setProp(el, key, val, _this.options.xmlMode);
        });
      } else {
        setProp(el, name, value, _this.options.xmlMode);
      }
    });
  }

  return undefined;
}
/**
 * Sets the value of a data attribute.
 *
 * @private
 * @param el - The element to set the data attribute on.
 * @param name - The data attribute's name.
 * @param value - The data attribute's value.
 */

function setData(el, name, value) {
  var _a;

  var elem = el;
  (_a = elem.data) !== null && _a !== void 0 ? _a : elem.data = {};
  if (typeof name === 'object') Object.assign(elem.data, name);else if (typeof name === 'string' && value !== undefined) {
    elem.data[name] = value;
  }
}
/**
 * Read the specified attribute from the equivalent HTML5 `data-*` attribute,
 * and (if present) cache the value in the node's internal data store. If no
 * attribute name is specified, read _all_ HTML5 `data-*` attributes in this manner.
 *
 * @private
 * @category Attributes
 * @param el - Element to get the data attribute of.
 * @param name - Name of the data attribute.
 * @returns The data attribute's value, or a map with all of the data attributes.
 */


function readData(el, name) {
  var domNames;
  var jsNames;
  var value;

  if (name == null) {
    domNames = Object.keys(el.attribs).filter(function (attrName) {
      return attrName.startsWith(dataAttrPrefix);
    });
    jsNames = domNames.map(function (domName) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.camelCase)(domName.slice(dataAttrPrefix.length));
    });
  } else {
    domNames = [dataAttrPrefix + (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.cssCase)(name)];
    jsNames = [name];
  }

  for (var idx = 0; idx < domNames.length; ++idx) {
    var domName = domNames[idx];
    var jsName = jsNames[idx];

    if (hasOwn.call(el.attribs, domName) && !hasOwn.call(el.data, jsName)) {
      value = el.attribs[domName];

      if (hasOwn.call(primitives, value)) {
        value = primitives[value];
      } else if (value === String(Number(value))) {
        value = Number(value);
      } else if (rbrace.test(value)) {
        try {
          value = JSON.parse(value);
        } catch (e) {
          /* Ignore */
        }
      }

      el.data[jsName] = value;
    }
  }

  return name == null ? el.data : value;
}

function data(name, value) {
  var _a;

  var elem = this[0];
  if (!elem || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isTag)(elem)) return;
  var dataEl = elem;
  (_a = dataEl.data) !== null && _a !== void 0 ? _a : dataEl.data = {}; // Return the entire data object if no data specified

  if (!name) {
    return readData(dataEl);
  } // Set the value (with attr map support)


  if (typeof name === 'object' || value !== undefined) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.domEach)(this, function (el) {
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isTag)(el)) {
        if (typeof name === 'object') setData(el, name);else setData(el, name, value);
      }
    });
    return this;
  }

  if (hasOwn.call(dataEl.data, name)) {
    return dataEl.data[name];
  }

  return readData(dataEl, name);
}
function val(value) {
  var querying = arguments.length === 0;
  var element = this[0];
  if (!element || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isTag)(element)) return querying ? undefined : this;

  switch (element.name) {
    case 'textarea':
      return this.text(value);

    case 'select':
      {
        var option = this.find('option:selected');

        if (!querying) {
          if (this.attr('multiple') == null && typeof value === 'object') {
            return this;
          }

          this.find('option').removeAttr('selected');
          var values = typeof value !== 'object' ? [value] : value;

          for (var i = 0; i < values.length; i++) {
            this.find("option[value=\"" + values[i] + "\"]").attr('selected', '');
          }

          return this;
        }

        return this.attr('multiple') ? option.toArray().map(function (el) {
          return (0,_static_js__WEBPACK_IMPORTED_MODULE_0__.text)(el.children);
        }) : option.attr('value');
      }

    case 'input':
    case 'option':
      return querying ? this.attr('value') : this.attr('value', value);
  }

  return undefined;
}
/**
 * Remove an attribute.
 *
 * @private
 * @param elem - Node to remove attribute from.
 * @param name - Name of the attribute to remove.
 */

function removeAttribute(elem, name) {
  if (!elem.attribs || !hasOwn.call(elem.attribs, name)) return;
  delete elem.attribs[name];
}
/**
 * Splits a space-separated list of names to individual names.
 *
 * @category Attributes
 * @param names - Names to split.
 * @returns - Split names.
 */


function splitNames(names) {
  return names ? names.trim().split(rspace) : [];
}
/**
 * Method for removing attributes by `name`.
 *
 * @category Attributes
 * @example
 *
 * ```js
 * $('.pear').removeAttr('class').html();
 * //=> <li>Pear</li>
 *
 * $('.apple').attr('id', 'favorite');
 * $('.apple').removeAttr('id class').html();
 * //=> <li>Apple</li>
 * ```
 *
 * @param name - Name of the attribute.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/removeAttr/}
 */


function removeAttr(name) {
  var _this2 = this;

  var attrNames = splitNames(name);

  var _loop = function _loop(i) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.domEach)(_this2, function (elem) {
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isTag)(elem)) removeAttribute(elem, attrNames[i]);
    });
  };

  for (var i = 0; i < attrNames.length; i++) {
    _loop(i);
  }

  return this;
}
/**
 * Check to see if _any_ of the matched elements have the given `className`.
 *
 * @category Attributes
 * @example
 *
 * ```js
 * $('.pear').hasClass('pear');
 * //=> true
 *
 * $('apple').hasClass('fruit');
 * //=> false
 *
 * $('li').hasClass('pear');
 * //=> true
 * ```
 *
 * @param className - Name of the class.
 * @returns Indicates if an element has the given `className`.
 * @see {@link https://api.jquery.com/hasClass/}
 */

function hasClass(className) {
  return this.toArray().some(function (elem) {
    var clazz = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isTag)(elem) && elem.attribs['class'];
    var idx = -1;

    if (clazz && className.length) {
      while ((idx = clazz.indexOf(className, idx + 1)) > -1) {
        var end = idx + className.length;

        if ((idx === 0 || rspace.test(clazz[idx - 1])) && (end === clazz.length || rspace.test(clazz[end]))) {
          return true;
        }
      }
    }

    return false;
  });
}
/**
 * Adds class(es) to all of the matched elements. Also accepts a `function`.
 *
 * @category Attributes
 * @example
 *
 * ```js
 * $('.pear').addClass('fruit').html();
 * //=> <li class="pear fruit">Pear</li>
 *
 * $('.apple').addClass('fruit red').html();
 * //=> <li class="apple fruit red">Apple</li>
 * ```
 *
 * @param value - Name of new class.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/addClass/}
 */

function addClass(value) {
  // Support functions
  if (typeof value === 'function') {
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.domEach)(this, function (el, i) {
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isTag)(el)) {
        var className = el.attribs['class'] || '';
        addClass.call([el], value.call(el, i, className));
      }
    });
  } // Return if no value or not a string or function


  if (!value || typeof value !== 'string') return this;
  var classNames = value.split(rspace);
  var numElements = this.length;

  for (var i = 0; i < numElements; i++) {
    var el = this[i]; // If selected element isn't a tag, move on

    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isTag)(el)) continue; // If we don't already have classes — always set xmlMode to false here, as it doesn't matter for classes

    var className = getAttr(el, 'class', false);

    if (!className) {
      setAttr(el, 'class', classNames.join(' ').trim());
    } else {
      var setClass = " " + className + " "; // Check if class already exists

      for (var j = 0; j < classNames.length; j++) {
        var appendClass = classNames[j] + " ";
        if (!setClass.includes(" " + appendClass)) setClass += appendClass;
      }

      setAttr(el, 'class', setClass.trim());
    }
  }

  return this;
}
/**
 * Removes one or more space-separated classes from the selected elements. If no
 * `className` is defined, all classes will be removed. Also accepts a `function`.
 *
 * @category Attributes
 * @example
 *
 * ```js
 * $('.pear').removeClass('pear').html();
 * //=> <li class="">Pear</li>
 *
 * $('.apple').addClass('red').removeClass().html();
 * //=> <li class="">Apple</li>
 * ```
 *
 * @param name - Name of the class. If not specified, removes all elements.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/removeClass/}
 */

function removeClass(name) {
  // Handle if value is a function
  if (typeof name === 'function') {
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.domEach)(this, function (el, i) {
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isTag)(el)) {
        removeClass.call([el], name.call(el, i, el.attribs['class'] || ''));
      }
    });
  }

  var classes = splitNames(name);
  var numClasses = classes.length;
  var removeAll = arguments.length === 0;
  return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.domEach)(this, function (el) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isTag)(el)) return;

    if (removeAll) {
      // Short circuit the remove all case as this is the nice one
      el.attribs['class'] = '';
    } else {
      var elClasses = splitNames(el.attribs['class']);
      var changed = false;

      for (var j = 0; j < numClasses; j++) {
        var index = elClasses.indexOf(classes[j]);

        if (index >= 0) {
          elClasses.splice(index, 1);
          changed = true;
          /*
           * We have to do another pass to ensure that there are not duplicate
           * classes listed
           */

          j--;
        }
      }

      if (changed) {
        el.attribs['class'] = elClasses.join(' ');
      }
    }
  });
}
/**
 * Add or remove class(es) from the matched elements, depending on either the
 * class's presence or the value of the switch argument. Also accepts a `function`.
 *
 * @category Attributes
 * @example
 *
 * ```js
 * $('.apple.green').toggleClass('fruit green red').html();
 * //=> <li class="apple fruit red">Apple</li>
 *
 * $('.apple.green').toggleClass('fruit green red', true).html();
 * //=> <li class="apple green fruit red">Apple</li>
 * ```
 *
 * @param value - Name of the class. Can also be a function.
 * @param stateVal - If specified the state of the class.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/toggleClass/}
 */

function toggleClass(value, stateVal) {
  // Support functions
  if (typeof value === 'function') {
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.domEach)(this, function (el, i) {
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isTag)(el)) {
        toggleClass.call([el], value.call(el, i, el.attribs['class'] || '', stateVal), stateVal);
      }
    });
  } // Return if no value or not a string or function


  if (!value || typeof value !== 'string') return this;
  var classNames = value.split(rspace);
  var numClasses = classNames.length;
  var state = typeof stateVal === 'boolean' ? stateVal ? 1 : -1 : 0;
  var numElements = this.length;

  for (var i = 0; i < numElements; i++) {
    var el = this[i]; // If selected element isn't a tag, move on

    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isTag)(el)) continue;
    var elementClasses = splitNames(el.attribs['class']); // Check if class already exists

    for (var j = 0; j < numClasses; j++) {
      // Check if the class name is currently defined
      var index = elementClasses.indexOf(classNames[j]); // Add if stateValue === true or we are toggling and there is no value

      if (state >= 0 && index < 0) {
        elementClasses.push(classNames[j]);
      } else if (state <= 0 && index >= 0) {
        // Otherwise remove but only if the item exists
        elementClasses.splice(index, 1);
      }
    }

    el.attribs['class'] = elementClasses.join(' ');
  }

  return this;
}

/***/ }),

/***/ "./node_modules/cheerio/lib/esm/api/css.js":
/*!*************************************************!*\
  !*** ./node_modules/cheerio/lib/esm/api/css.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "css": () => (/* binding */ css)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/cheerio/lib/esm/utils.js");
function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }


/**
 * Set multiple CSS properties for every matched element.
 *
 * @category CSS
 * @param prop - The names of the properties.
 * @param val - The new values.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/css/}
 */

function css(prop, val) {
  if (prop != null && val != null || // When `prop` is a "plain" object
  typeof prop === 'object' && !Array.isArray(prop)) {
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.domEach)(this, function (el, i) {
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isTag)(el)) {
        // `prop` can't be an array here anymore.
        setCss(el, prop, val, i);
      }
    });
  }

  if (this.length === 0) {
    return undefined;
  }

  return getCss(this[0], prop);
}
/**
 * Set styles of all elements.
 *
 * @private
 * @param el - Element to set style of.
 * @param prop - Name of property.
 * @param value - Value to set property to.
 * @param idx - Optional index within the selection.
 */

function setCss(el, prop, value, idx) {
  if (typeof prop === 'string') {
    var styles = getCss(el);
    var val = typeof value === 'function' ? value.call(el, idx, styles[prop]) : value;

    if (val === '') {
      delete styles[prop];
    } else if (val != null) {
      styles[prop] = val;
    }

    el.attribs['style'] = stringify(styles);
  } else if (typeof prop === 'object') {
    Object.keys(prop).forEach(function (k, i) {
      setCss(el, k, prop[k], i);
    });
  }
}

function getCss(el, prop) {
  if (!el || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isTag)(el)) return;
  var styles = parse(el.attribs['style']);

  if (typeof prop === 'string') {
    return styles[prop];
  }

  if (Array.isArray(prop)) {
    var newStyles = {};
    prop.forEach(function (item) {
      if (styles[item] != null) {
        newStyles[item] = styles[item];
      }
    });
    return newStyles;
  }

  return styles;
}
/**
 * Stringify `obj` to styles.
 *
 * @private
 * @category CSS
 * @param obj - Object to stringify.
 * @returns The serialized styles.
 */


function stringify(obj) {
  return Object.keys(obj).reduce(function (str, prop) {
    return "" + str + (str ? ' ' : '') + prop + ": " + obj[prop] + ";";
  }, '');
}
/**
 * Parse `styles`.
 *
 * @private
 * @category CSS
 * @param styles - Styles to be parsed.
 * @returns The parsed styles.
 */


function parse(styles) {
  styles = (styles || '').trim();
  if (!styles) return {};
  var obj = {};
  var key;

  for (var _iterator = _createForOfIteratorHelperLoose(styles.split(';')), _step; !(_step = _iterator()).done;) {
    var str = _step.value;
    var n = str.indexOf(':'); // If there is no :, or if it is the first/last character, add to the previous item's value

    if (n < 1 || n === str.length - 1) {
      var trimmed = str.trimEnd();

      if (trimmed.length > 0 && key !== undefined) {
        obj[key] += ";" + trimmed;
      }
    } else {
      key = str.slice(0, n).trim();
      obj[key] = str.slice(n + 1).trim();
    }
  }

  return obj;
}

/***/ }),

/***/ "./node_modules/cheerio/lib/esm/api/forms.js":
/*!***************************************************!*\
  !*** ./node_modules/cheerio/lib/esm/api/forms.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "serialize": () => (/* binding */ serialize),
/* harmony export */   "serializeArray": () => (/* binding */ serializeArray)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/cheerio/lib/esm/utils.js");

/*
 * https://github.com/jquery/jquery/blob/2.1.3/src/manipulation/var/rcheckableType.js
 * https://github.com/jquery/jquery/blob/2.1.3/src/serialize.js
 */

var submittableSelector = 'input,select,textarea,keygen';
var r20 = /%20/g;
var rCRLF = /\r?\n/g;
/**
 * Encode a set of form elements as a string for submission.
 *
 * @category Forms
 * @example
 *
 * ```js
 * $('<form><input name="foo" value="bar" /></form>').serialize();
 * //=> 'foo=bar'
 * ```
 *
 * @returns The serialized form.
 * @see {@link https://api.jquery.com/serialize/}
 */

function serialize() {
  // Convert form elements into name/value objects
  var arr = this.serializeArray(); // Serialize each element into a key/value string

  var retArr = arr.map(function (data) {
    return encodeURIComponent(data.name) + "=" + encodeURIComponent(data.value);
  }); // Return the resulting serialization

  return retArr.join('&').replace(r20, '+');
}
/**
 * Encode a set of form elements as an array of names and values.
 *
 * @category Forms
 * @example
 *
 * ```js
 * $('<form><input name="foo" value="bar" /></form>').serializeArray();
 * //=> [ { name: 'foo', value: 'bar' } ]
 * ```
 *
 * @returns The serialized form.
 * @see {@link https://api.jquery.com/serializeArray/}
 */

function serializeArray() {
  var _this = this;

  // Resolve all form elements from either forms or collections of form elements
  return this.map(function (_, elem) {
    var $elem = _this._make(elem);

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isTag)(elem) && elem.name === 'form') {
      return $elem.find(submittableSelector).toArray();
    }

    return $elem.filter(submittableSelector).toArray();
  }).filter( // Verify elements have a name (`attr.name`) and are not disabled (`:enabled`)
  '[name!=""]:enabled' + // And cannot be clicked (`[type=submit]`) or are used in `x-www-form-urlencoded` (`[type=file]`)
  ':not(:submit, :button, :image, :reset, :file)' + // And are either checked/don't have a checkable state
  ':matches([checked], :not(:checkbox, :radio))' // Convert each of the elements to its value(s)
  ).map(function (_, elem) {
    var _a;

    var $elem = _this._make(elem);

    var name = $elem.attr('name'); // We have filtered for elements with a name before.
    // If there is no value set (e.g. `undefined`, `null`), then default value to empty

    var value = (_a = $elem.val()) !== null && _a !== void 0 ? _a : ''; // If we have an array of values (e.g. `<select multiple>`), return an array of key/value pairs

    if (Array.isArray(value)) {
      return value.map(function (val) {
        return (
          /*
           * We trim replace any line endings (e.g. `\r` or `\r\n` with `\r\n`) to guarantee consistency across platforms
           * These can occur inside of `<textarea>'s`
           */
          {
            name: name,
            value: val.replace(rCRLF, '\r\n')
          }
        );
      });
    } // Otherwise (e.g. `<input type="text">`, return only one key/value pair


    return {
      name: name,
      value: value.replace(rCRLF, '\r\n')
    };
  }).toArray();
}

/***/ }),

/***/ "./node_modules/cheerio/lib/esm/api/manipulation.js":
/*!**********************************************************!*\
  !*** ./node_modules/cheerio/lib/esm/api/manipulation.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_makeDomArray": () => (/* binding */ _makeDomArray),
/* harmony export */   "after": () => (/* binding */ after),
/* harmony export */   "append": () => (/* binding */ append),
/* harmony export */   "appendTo": () => (/* binding */ appendTo),
/* harmony export */   "before": () => (/* binding */ before),
/* harmony export */   "clone": () => (/* binding */ clone),
/* harmony export */   "empty": () => (/* binding */ empty),
/* harmony export */   "html": () => (/* binding */ html),
/* harmony export */   "insertAfter": () => (/* binding */ insertAfter),
/* harmony export */   "insertBefore": () => (/* binding */ insertBefore),
/* harmony export */   "prepend": () => (/* binding */ prepend),
/* harmony export */   "prependTo": () => (/* binding */ prependTo),
/* harmony export */   "remove": () => (/* binding */ remove),
/* harmony export */   "replaceWith": () => (/* binding */ replaceWith),
/* harmony export */   "text": () => (/* binding */ text),
/* harmony export */   "toString": () => (/* binding */ toString),
/* harmony export */   "unwrap": () => (/* binding */ unwrap),
/* harmony export */   "wrap": () => (/* binding */ wrap),
/* harmony export */   "wrapAll": () => (/* binding */ wrapAll),
/* harmony export */   "wrapInner": () => (/* binding */ wrapInner)
/* harmony export */ });
/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/esm/index.js");
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../parse.js */ "./node_modules/cheerio/lib/esm/parse.js");
/* harmony import */ var _static_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../static.js */ "./node_modules/cheerio/lib/esm/static.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils.js */ "./node_modules/cheerio/lib/esm/utils.js");
/* harmony import */ var domutils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! domutils */ "./node_modules/domutils/lib/esm/index.js");
/**
 * Methods for modifying the DOM structure.
 *
 * @module cheerio/manipulation
 */





/**
 * Create an array of nodes, recursing into arrays and parsing strings if necessary.
 *
 * @private
 * @category Manipulation
 * @param elem - Elements to make an array of.
 * @param clone - Optionally clone nodes.
 * @returns The array of nodes.
 */

function _makeDomArray(elem, clone) {
  var _this = this;

  if (elem == null) {
    return [];
  }

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isCheerio)(elem)) {
    return clone ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.cloneDom)(elem.get()) : elem.get();
  }

  if (Array.isArray(elem)) {
    return elem.reduce(function (newElems, el) {
      return newElems.concat(_this._makeDomArray(el, clone));
    }, []);
  }

  if (typeof elem === 'string') {
    return this._parse(elem, this.options, false, null).children;
  }

  return clone ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.cloneDom)([elem]) : [elem];
}

function _insert(concatenator) {
  return function () {
    var _this2 = this;

    for (var _len = arguments.length, elems = new Array(_len), _key = 0; _key < _len; _key++) {
      elems[_key] = arguments[_key];
    }

    var lastIdx = this.length - 1;
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.domEach)(this, function (el, i) {
      if (!(0,domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(el)) return;
      var domSrc = typeof elems[0] === 'function' ? elems[0].call(el, i, _this2._render(el.children)) : elems;

      var dom = _this2._makeDomArray(domSrc, i < lastIdx);

      concatenator(dom, el.children, el);
    });
  };
}
/**
 * Modify an array in-place, removing some number of elements and adding new
 * elements directly following them.
 *
 * @private
 * @category Manipulation
 * @param array - Target array to splice.
 * @param spliceIdx - Index at which to begin changing the array.
 * @param spliceCount - Number of elements to remove from the array.
 * @param newElems - Elements to insert into the array.
 * @param parent - The parent of the node.
 * @returns The spliced array.
 */


function uniqueSplice(array, spliceIdx, spliceCount, newElems, parent) {
  var _a, _b;

  var spliceArgs = [spliceIdx, spliceCount].concat(newElems);
  var prev = spliceIdx === 0 ? null : array[spliceIdx - 1];
  var next = spliceIdx + spliceCount >= array.length ? null : array[spliceIdx + spliceCount];
  /*
   * Before splicing in new elements, ensure they do not already appear in the
   * current array.
   */

  for (var idx = 0; idx < newElems.length; ++idx) {
    var node = newElems[idx];
    var oldParent = node.parent;

    if (oldParent) {
      var oldSiblings = oldParent.children;
      var prevIdx = oldSiblings.indexOf(node);

      if (prevIdx > -1) {
        oldParent.children.splice(prevIdx, 1);

        if (parent === oldParent && spliceIdx > prevIdx) {
          spliceArgs[0]--;
        }
      }
    }

    node.parent = parent;

    if (node.prev) {
      node.prev.next = (_a = node.next) !== null && _a !== void 0 ? _a : null;
    }

    if (node.next) {
      node.next.prev = (_b = node.prev) !== null && _b !== void 0 ? _b : null;
    }

    node.prev = idx === 0 ? prev : newElems[idx - 1];
    node.next = idx === newElems.length - 1 ? next : newElems[idx + 1];
  }

  if (prev) {
    prev.next = newElems[0];
  }

  if (next) {
    next.prev = newElems[newElems.length - 1];
  }

  return array.splice.apply(array, spliceArgs);
}
/**
 * Insert every element in the set of matched elements to the end of the target.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * $('<li class="plum">Plum</li>').appendTo('#fruits');
 * $.html();
 * //=>  <ul id="fruits">
 * //      <li class="apple">Apple</li>
 * //      <li class="orange">Orange</li>
 * //      <li class="pear">Pear</li>
 * //      <li class="plum">Plum</li>
 * //    </ul>
 * ```
 *
 * @param target - Element to append elements to.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/appendTo/}
 */


function appendTo(target) {
  var appendTarget = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isCheerio)(target) ? target : this._make(target);
  appendTarget.append(this);
  return this;
}
/**
 * Insert every element in the set of matched elements to the beginning of the target.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * $('<li class="plum">Plum</li>').prependTo('#fruits');
 * $.html();
 * //=>  <ul id="fruits">
 * //      <li class="plum">Plum</li>
 * //      <li class="apple">Apple</li>
 * //      <li class="orange">Orange</li>
 * //      <li class="pear">Pear</li>
 * //    </ul>
 * ```
 *
 * @param target - Element to prepend elements to.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/prependTo/}
 */

function prependTo(target) {
  var prependTarget = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isCheerio)(target) ? target : this._make(target);
  prependTarget.prepend(this);
  return this;
}
/**
 * Inserts content as the _last_ child of each of the selected elements.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * $('ul').append('<li class="plum">Plum</li>');
 * $.html();
 * //=>  <ul id="fruits">
 * //      <li class="apple">Apple</li>
 * //      <li class="orange">Orange</li>
 * //      <li class="pear">Pear</li>
 * //      <li class="plum">Plum</li>
 * //    </ul>
 * ```
 *
 * @see {@link https://api.jquery.com/append/}
 */

var append = _insert(function (dom, children, parent) {
  uniqueSplice(children, children.length, 0, dom, parent);
});
/**
 * Inserts content as the _first_ child of each of the selected elements.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * $('ul').prepend('<li class="plum">Plum</li>');
 * $.html();
 * //=>  <ul id="fruits">
 * //      <li class="plum">Plum</li>
 * //      <li class="apple">Apple</li>
 * //      <li class="orange">Orange</li>
 * //      <li class="pear">Pear</li>
 * //    </ul>
 * ```
 *
 * @see {@link https://api.jquery.com/prepend/}
 */

var prepend = _insert(function (dom, children, parent) {
  uniqueSplice(children, 0, 0, dom, parent);
});

function _wrap(insert) {
  return function (wrapper) {
    var lastIdx = this.length - 1;
    var lastParent = this.parents().last();

    for (var i = 0; i < this.length; i++) {
      var el = this[i];

      var _wrap2 = typeof wrapper === 'function' ? wrapper.call(el, i, el) : typeof wrapper === 'string' && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isHtml)(wrapper) ? lastParent.find(wrapper).clone() : wrapper;

      var _this$_makeDomArray = this._makeDomArray(_wrap2, i < lastIdx),
          wrapperDom = _this$_makeDomArray[0];

      if (!wrapperDom || !(0,domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(wrapperDom)) continue;
      var elInsertLocation = wrapperDom;
      /*
       * Find the deepest child. Only consider the first tag child of each node
       * (ignore text); stop if no children are found.
       */

      var j = 0;

      while (j < elInsertLocation.children.length) {
        var child = elInsertLocation.children[j];

        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isTag)(child)) {
          elInsertLocation = child;
          j = 0;
        } else {
          j++;
        }
      }

      insert(el, elInsertLocation, [wrapperDom]);
    }

    return this;
  };
}
/**
 * The .wrap() function can take any string or object that could be passed to
 * the $() factory function to specify a DOM structure. This structure may be
 * nested several levels deep, but should contain only one inmost element. A
 * copy of this structure will be wrapped around each of the elements in the set
 * of matched elements. This method returns the original set of elements for
 * chaining purposes.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * const redFruit = $('<div class="red-fruit"></div>');
 * $('.apple').wrap(redFruit);
 *
 * //=> <ul id="fruits">
 * //     <div class="red-fruit">
 * //      <li class="apple">Apple</li>
 * //     </div>
 * //     <li class="orange">Orange</li>
 * //     <li class="plum">Plum</li>
 * //   </ul>
 *
 * const healthy = $('<div class="healthy"></div>');
 * $('li').wrap(healthy);
 *
 * //=> <ul id="fruits">
 * //     <div class="healthy">
 * //       <li class="apple">Apple</li>
 * //     </div>
 * //     <div class="healthy">
 * //       <li class="orange">Orange</li>
 * //     </div>
 * //     <div class="healthy">
 * //        <li class="plum">Plum</li>
 * //     </div>
 * //   </ul>
 * ```
 *
 * @param wrapper - The DOM structure to wrap around each element in the selection.
 * @see {@link https://api.jquery.com/wrap/}
 */


var wrap = _wrap(function (el, elInsertLocation, wrapperDom) {
  var parent = el.parent;
  if (!parent) return;
  var siblings = parent.children;
  var index = siblings.indexOf(el);
  (0,_parse_js__WEBPACK_IMPORTED_MODULE_1__.update)([el], elInsertLocation);
  /*
   * The previous operation removed the current element from the `siblings`
   * array, so the `dom` array can be inserted without removing any
   * additional elements.
   */

  uniqueSplice(siblings, index, 0, wrapperDom, parent);
});
/**
 * The .wrapInner() function can take any string or object that could be passed
 * to the $() factory function to specify a DOM structure. This structure may be
 * nested several levels deep, but should contain only one inmost element. The
 * structure will be wrapped around the content of each of the elements in the
 * set of matched elements.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * const redFruit = $('<div class="red-fruit"></div>');
 * $('.apple').wrapInner(redFruit);
 *
 * //=> <ul id="fruits">
 * //     <li class="apple">
 * //       <div class="red-fruit">Apple</div>
 * //     </li>
 * //     <li class="orange">Orange</li>
 * //     <li class="pear">Pear</li>
 * //   </ul>
 *
 * const healthy = $('<div class="healthy"></div>');
 * $('li').wrapInner(healthy);
 *
 * //=> <ul id="fruits">
 * //     <li class="apple">
 * //       <div class="healthy">Apple</div>
 * //     </li>
 * //     <li class="orange">
 * //       <div class="healthy">Orange</div>
 * //     </li>
 * //     <li class="pear">
 * //       <div class="healthy">Pear</div>
 * //     </li>
 * //   </ul>
 * ```
 *
 * @param wrapper - The DOM structure to wrap around the content of each element
 *   in the selection.
 * @returns The instance itself, for chaining.
 * @see {@link https://api.jquery.com/wrapInner/}
 */

var wrapInner = _wrap(function (el, elInsertLocation, wrapperDom) {
  if (!(0,domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(el)) return;
  (0,_parse_js__WEBPACK_IMPORTED_MODULE_1__.update)(el.children, elInsertLocation);
  (0,_parse_js__WEBPACK_IMPORTED_MODULE_1__.update)(wrapperDom, el);
});
/**
 * The .unwrap() function, removes the parents of the set of matched elements
 * from the DOM, leaving the matched elements in their place.
 *
 * @category Manipulation
 * @example <caption>without selector</caption>
 *
 * ```js
 * const $ = cheerio.load(
 *   '<div id=test>\n  <div><p>Hello</p></div>\n  <div><p>World</p></div>\n</div>'
 * );
 * $('#test p').unwrap();
 *
 * //=> <div id=test>
 * //     <p>Hello</p>
 * //     <p>World</p>
 * //   </div>
 * ```
 *
 * @example <caption>with selector</caption>
 *
 * ```js
 * const $ = cheerio.load(
 *   '<div id=test>\n  <p>Hello</p>\n  <b><p>World</p></b>\n</div>'
 * );
 * $('#test p').unwrap('b');
 *
 * //=> <div id=test>
 * //     <p>Hello</p>
 * //     <p>World</p>
 * //   </div>
 * ```
 *
 * @param selector - A selector to check the parent element against. If an
 *   element's parent does not match the selector, the element won't be unwrapped.
 * @returns The instance itself, for chaining.
 * @see {@link https://api.jquery.com/unwrap/}
 */

function unwrap(selector) {
  var _this3 = this;

  this.parent(selector).not('body').each(function (_, el) {
    _this3._make(el).replaceWith(el.children);
  });
  return this;
}
/**
 * The .wrapAll() function can take any string or object that could be passed to
 * the $() function to specify a DOM structure. This structure may be nested
 * several levels deep, but should contain only one inmost element. The
 * structure will be wrapped around all of the elements in the set of matched
 * elements, as a single group.
 *
 * @category Manipulation
 * @example <caption>With markup passed to `wrapAll`</caption>
 *
 * ```js
 * const $ = cheerio.load(
 *   '<div class="container"><div class="inner">First</div><div class="inner">Second</div></div>'
 * );
 * $('.inner').wrapAll("<div class='new'></div>");
 *
 * //=> <div class="container">
 * //     <div class='new'>
 * //       <div class="inner">First</div>
 * //       <div class="inner">Second</div>
 * //     </div>
 * //   </div>
 * ```
 *
 * @example <caption>With an existing cheerio instance</caption>
 *
 * ```js
 * const $ = cheerio.load(
 *   '<span>Span 1</span><strong>Strong</strong><span>Span 2</span>'
 * );
 * const wrap = $('<div><p><em><b></b></em></p></div>');
 * $('span').wrapAll(wrap);
 *
 * //=> <div>
 * //     <p>
 * //       <em>
 * //         <b>
 * //           <span>Span 1</span>
 * //           <span>Span 2</span>
 * //         </b>
 * //       </em>
 * //     </p>
 * //   </div>
 * //   <strong>Strong</strong>
 * ```
 *
 * @param wrapper - The DOM structure to wrap around all matched elements in the
 *   selection.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/wrapAll/}
 */

function wrapAll(wrapper) {
  var el = this[0];

  if (el) {
    var _wrap3 = this._make(typeof wrapper === 'function' ? wrapper.call(el, 0, el) : wrapper).insertBefore(el); // If html is given as wrapper, wrap may contain text elements


    var elInsertLocation;

    for (var i = 0; i < _wrap3.length; i++) {
      if (_wrap3[i].type === 'tag') elInsertLocation = _wrap3[i];
    }

    var j = 0;
    /*
     * Find the deepest child. Only consider the first tag child of each node
     * (ignore text); stop if no children are found.
     */

    while (elInsertLocation && j < elInsertLocation.children.length) {
      var child = elInsertLocation.children[j];

      if (child.type === 'tag') {
        elInsertLocation = child;
        j = 0;
      } else {
        j++;
      }
    }

    if (elInsertLocation) this._make(elInsertLocation).append(this);
  }

  return this;
}
/* eslint-disable jsdoc/check-param-names*/

/**
 * Insert content next to each element in the set of matched elements.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * $('.apple').after('<li class="plum">Plum</li>');
 * $.html();
 * //=>  <ul id="fruits">
 * //      <li class="apple">Apple</li>
 * //      <li class="plum">Plum</li>
 * //      <li class="orange">Orange</li>
 * //      <li class="pear">Pear</li>
 * //    </ul>
 * ```
 *
 * @param content - HTML string, DOM element, array of DOM elements or Cheerio
 *   to insert after each element in the set of matched elements.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/after/}
 */

function after() {
  var _this4 = this;

  for (var _len2 = arguments.length, elems = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    elems[_key2] = arguments[_key2];
  }

  var lastIdx = this.length - 1;
  return (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.domEach)(this, function (el, i) {
    var parent = el.parent;

    if (!(0,domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(el) || !parent) {
      return;
    }

    var siblings = parent.children;
    var index = siblings.indexOf(el); // If not found, move on

    /* istanbul ignore next */

    if (index < 0) return;
    var domSrc = typeof elems[0] === 'function' ? elems[0].call(el, i, _this4._render(el.children)) : elems;

    var dom = _this4._makeDomArray(domSrc, i < lastIdx); // Add element after `this` element


    uniqueSplice(siblings, index + 1, 0, dom, parent);
  });
}
/* eslint-enable jsdoc/check-param-names*/

/**
 * Insert every element in the set of matched elements after the target.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * $('<li class="plum">Plum</li>').insertAfter('.apple');
 * $.html();
 * //=>  <ul id="fruits">
 * //      <li class="apple">Apple</li>
 * //      <li class="plum">Plum</li>
 * //      <li class="orange">Orange</li>
 * //      <li class="pear">Pear</li>
 * //    </ul>
 * ```
 *
 * @param target - Element to insert elements after.
 * @returns The set of newly inserted elements.
 * @see {@link https://api.jquery.com/insertAfter/}
 */

function insertAfter(target) {
  var _this5 = this;

  if (typeof target === 'string') {
    target = this._make(target);
  }

  this.remove();
  var clones = [];

  this._makeDomArray(target).forEach(function (el) {
    var clonedSelf = _this5.clone().toArray();

    var parent = el.parent;

    if (!parent) {
      return;
    }

    var siblings = parent.children;
    var index = siblings.indexOf(el); // If not found, move on

    /* istanbul ignore next */

    if (index < 0) return; // Add cloned `this` element(s) after target element

    uniqueSplice(siblings, index + 1, 0, clonedSelf, parent);
    clones.push.apply(clones, clonedSelf);
  });

  return this._make(clones);
}
/* eslint-disable jsdoc/check-param-names*/

/**
 * Insert content previous to each element in the set of matched elements.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * $('.apple').before('<li class="plum">Plum</li>');
 * $.html();
 * //=>  <ul id="fruits">
 * //      <li class="plum">Plum</li>
 * //      <li class="apple">Apple</li>
 * //      <li class="orange">Orange</li>
 * //      <li class="pear">Pear</li>
 * //    </ul>
 * ```
 *
 * @param content - HTML string, DOM element, array of DOM elements or Cheerio
 *   to insert before each element in the set of matched elements.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/before/}
 */

function before() {
  var _this6 = this;

  for (var _len3 = arguments.length, elems = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    elems[_key3] = arguments[_key3];
  }

  var lastIdx = this.length - 1;
  return (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.domEach)(this, function (el, i) {
    var parent = el.parent;

    if (!(0,domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(el) || !parent) {
      return;
    }

    var siblings = parent.children;
    var index = siblings.indexOf(el); // If not found, move on

    /* istanbul ignore next */

    if (index < 0) return;
    var domSrc = typeof elems[0] === 'function' ? elems[0].call(el, i, _this6._render(el.children)) : elems;

    var dom = _this6._makeDomArray(domSrc, i < lastIdx); // Add element before `el` element


    uniqueSplice(siblings, index, 0, dom, parent);
  });
}
/* eslint-enable jsdoc/check-param-names*/

/**
 * Insert every element in the set of matched elements before the target.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * $('<li class="plum">Plum</li>').insertBefore('.apple');
 * $.html();
 * //=>  <ul id="fruits">
 * //      <li class="plum">Plum</li>
 * //      <li class="apple">Apple</li>
 * //      <li class="orange">Orange</li>
 * //      <li class="pear">Pear</li>
 * //    </ul>
 * ```
 *
 * @param target - Element to insert elements before.
 * @returns The set of newly inserted elements.
 * @see {@link https://api.jquery.com/insertBefore/}
 */

function insertBefore(target) {
  var _this7 = this;

  var targetArr = this._make(target);

  this.remove();
  var clones = [];
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.domEach)(targetArr, function (el) {
    var clonedSelf = _this7.clone().toArray();

    var parent = el.parent;

    if (!parent) {
      return;
    }

    var siblings = parent.children;
    var index = siblings.indexOf(el); // If not found, move on

    /* istanbul ignore next */

    if (index < 0) return; // Add cloned `this` element(s) after target element

    uniqueSplice(siblings, index, 0, clonedSelf, parent);
    clones.push.apply(clones, clonedSelf);
  });
  return this._make(clones);
}
/**
 * Removes the set of matched elements from the DOM and all their children.
 * `selector` filters the set of matched elements to be removed.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * $('.pear').remove();
 * $.html();
 * //=>  <ul id="fruits">
 * //      <li class="apple">Apple</li>
 * //      <li class="orange">Orange</li>
 * //    </ul>
 * ```
 *
 * @param selector - Optional selector for elements to remove.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/remove/}
 */

function remove(selector) {
  // Filter if we have selector
  var elems = selector ? this.filter(selector) : this;
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.domEach)(elems, function (el) {
    (0,domutils__WEBPACK_IMPORTED_MODULE_4__.removeElement)(el);
    el.prev = el.next = el.parent = null;
  });
  return this;
}
/**
 * Replaces matched elements with `content`.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * const plum = $('<li class="plum">Plum</li>');
 * $('.pear').replaceWith(plum);
 * $.html();
 * //=> <ul id="fruits">
 * //     <li class="apple">Apple</li>
 * //     <li class="orange">Orange</li>
 * //     <li class="plum">Plum</li>
 * //   </ul>
 * ```
 *
 * @param content - Replacement for matched elements.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/replaceWith/}
 */

function replaceWith(content) {
  var _this8 = this;

  return (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.domEach)(this, function (el, i) {
    var parent = el.parent;

    if (!parent) {
      return;
    }

    var siblings = parent.children;
    var cont = typeof content === 'function' ? content.call(el, i, el) : content;

    var dom = _this8._makeDomArray(cont);
    /*
     * In the case that `dom` contains nodes that already exist in other
     * structures, ensure those nodes are properly removed.
     */


    (0,_parse_js__WEBPACK_IMPORTED_MODULE_1__.update)(dom, null);
    var index = siblings.indexOf(el); // Completely remove old element

    uniqueSplice(siblings, index, 1, dom, parent);

    if (!dom.includes(el)) {
      el.parent = el.prev = el.next = null;
    }
  });
}
/**
 * Empties an element, removing all its children.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * $('ul').empty();
 * $.html();
 * //=>  <ul id="fruits"></ul>
 * ```
 *
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/empty/}
 */

function empty() {
  return (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.domEach)(this, function (el) {
    if (!(0,domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(el)) return;
    el.children.forEach(function (child) {
      child.next = child.prev = child.parent = null;
    });
    el.children.length = 0;
  });
}
function html(str) {
  var _this9 = this;

  if (str === undefined) {
    var el = this[0];
    if (!el || !(0,domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(el)) return null;
    return this._render(el.children);
  }

  return (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.domEach)(this, function (el) {
    if (!(0,domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(el)) return;
    el.children.forEach(function (child) {
      child.next = child.prev = child.parent = null;
    });
    var content = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isCheerio)(str) ? str.toArray() : _this9._parse("" + str, _this9.options, false, el).children;
    (0,_parse_js__WEBPACK_IMPORTED_MODULE_1__.update)(content, el);
  });
}
/**
 * Turns the collection to a string. Alias for `.html()`.
 *
 * @category Manipulation
 * @returns The rendered document.
 */

function toString() {
  return this._render(this);
}
function text(str) {
  var _this10 = this;

  // If `str` is undefined, act as a "getter"
  if (str === undefined) {
    return (0,_static_js__WEBPACK_IMPORTED_MODULE_2__.text)(this);
  }

  if (typeof str === 'function') {
    // Function support
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.domEach)(this, function (el, i) {
      return _this10._make(el).text(str.call(el, i, (0,_static_js__WEBPACK_IMPORTED_MODULE_2__.text)([el])));
    });
  } // Append text node to each selected elements


  return (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.domEach)(this, function (el) {
    if (!(0,domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(el)) return;
    el.children.forEach(function (child) {
      child.next = child.prev = child.parent = null;
    });
    var textNode = new domhandler__WEBPACK_IMPORTED_MODULE_0__.Text("" + str);
    (0,_parse_js__WEBPACK_IMPORTED_MODULE_1__.update)(textNode, el);
  });
}
/**
 * Clone the cheerio object.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * const moreFruit = $('#fruits').clone();
 * ```
 *
 * @returns The cloned object.
 * @see {@link https://api.jquery.com/clone/}
 */

function clone() {
  return this._make((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.cloneDom)(this.get()));
}

/***/ }),

/***/ "./node_modules/cheerio/lib/esm/api/traversing.js":
/*!********************************************************!*\
  !*** ./node_modules/cheerio/lib/esm/api/traversing.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "addBack": () => (/* binding */ addBack),
/* harmony export */   "children": () => (/* binding */ children),
/* harmony export */   "closest": () => (/* binding */ closest),
/* harmony export */   "contents": () => (/* binding */ contents),
/* harmony export */   "each": () => (/* binding */ each),
/* harmony export */   "end": () => (/* binding */ end),
/* harmony export */   "eq": () => (/* binding */ eq),
/* harmony export */   "filter": () => (/* binding */ filter),
/* harmony export */   "filterArray": () => (/* binding */ filterArray),
/* harmony export */   "find": () => (/* binding */ find),
/* harmony export */   "first": () => (/* binding */ first),
/* harmony export */   "get": () => (/* binding */ get),
/* harmony export */   "has": () => (/* binding */ has),
/* harmony export */   "index": () => (/* binding */ index),
/* harmony export */   "is": () => (/* binding */ is),
/* harmony export */   "last": () => (/* binding */ last),
/* harmony export */   "map": () => (/* binding */ map),
/* harmony export */   "next": () => (/* binding */ next),
/* harmony export */   "nextAll": () => (/* binding */ nextAll),
/* harmony export */   "nextUntil": () => (/* binding */ nextUntil),
/* harmony export */   "not": () => (/* binding */ not),
/* harmony export */   "parent": () => (/* binding */ parent),
/* harmony export */   "parents": () => (/* binding */ parents),
/* harmony export */   "parentsUntil": () => (/* binding */ parentsUntil),
/* harmony export */   "prev": () => (/* binding */ prev),
/* harmony export */   "prevAll": () => (/* binding */ prevAll),
/* harmony export */   "prevUntil": () => (/* binding */ prevUntil),
/* harmony export */   "siblings": () => (/* binding */ siblings),
/* harmony export */   "slice": () => (/* binding */ slice),
/* harmony export */   "toArray": () => (/* binding */ toArray)
/* harmony export */ });
/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/esm/index.js");
/* harmony import */ var cheerio_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! cheerio-select */ "./node_modules/cheerio-select/lib/esm/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./node_modules/cheerio/lib/esm/utils.js");
/* harmony import */ var _static_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../static.js */ "./node_modules/cheerio/lib/esm/static.js");
/* harmony import */ var domutils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! domutils */ "./node_modules/domutils/lib/esm/index.js");
/**
 * Methods for traversing the DOM structure.
 *
 * @module cheerio/traversing
 */





var reSiblingSelector = /^\s*[~+]/;
/**
 * Get the descendants of each element in the current set of matched elements,
 * filtered by a selector, jQuery object, or element.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('#fruits').find('li').length;
 * //=> 3
 * $('#fruits').find($('.apple')).length;
 * //=> 1
 * ```
 *
 * @param selectorOrHaystack - Element to look for.
 * @returns The found elements.
 * @see {@link https://api.jquery.com/find/}
 */

function find(selectorOrHaystack) {
  var _a;

  if (!selectorOrHaystack) {
    return this._make([]);
  }

  var context = this.toArray();

  if (typeof selectorOrHaystack !== 'string') {
    var haystack = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isCheerio)(selectorOrHaystack) ? selectorOrHaystack.toArray() : [selectorOrHaystack];
    return this._make(haystack.filter(function (elem) {
      return context.some(function (node) {
        return (0,_static_js__WEBPACK_IMPORTED_MODULE_3__.contains)(node, elem);
      });
    }));
  }

  var elems = reSiblingSelector.test(selectorOrHaystack) ? context : this.children().toArray();
  var options = {
    context: context,
    root: (_a = this._root) === null || _a === void 0 ? void 0 : _a[0],
    // Pass options that are recognized by `cheerio-select`
    xmlMode: this.options.xmlMode,
    lowerCaseTags: this.options.lowerCaseTags,
    lowerCaseAttributeNames: this.options.lowerCaseAttributeNames,
    pseudos: this.options.pseudos,
    quirksMode: this.options.quirksMode
  };
  return this._make(cheerio_select__WEBPACK_IMPORTED_MODULE_1__.select(selectorOrHaystack, elems, options));
}
/**
 * Creates a matcher, using a particular mapping function. Matchers provide a
 * function that finds elements using a generating function, supporting filtering.
 *
 * @private
 * @param matchMap - Mapping function.
 * @returns - Function for wrapping generating functions.
 */

function _getMatcher(matchMap) {
  return function (fn) {
    for (var _len = arguments.length, postFns = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      postFns[_key - 1] = arguments[_key];
    }

    return function (selector) {
      var _a;

      var matched = matchMap(fn, this);

      if (selector) {
        matched = filterArray(matched, selector, this.options.xmlMode, (_a = this._root) === null || _a === void 0 ? void 0 : _a[0]);
      }

      return this._make( // Post processing is only necessary if there is more than one element.
      this.length > 1 && matched.length > 1 ? postFns.reduce(function (elems, fn) {
        return fn(elems);
      }, matched) : matched);
    };
  };
}
/** Matcher that adds multiple elements for each entry in the input. */


var _matcher = _getMatcher(function (fn, elems) {
  var _Array;

  var ret = [];

  for (var i = 0; i < elems.length; i++) {
    var value = fn(elems[i]);
    ret.push(value);
  }

  return (_Array = new Array()).concat.apply(_Array, ret);
});
/** Matcher that adds at most one element for each entry in the input. */


var _singleMatcher = _getMatcher(function (fn, elems) {
  var ret = [];

  for (var i = 0; i < elems.length; i++) {
    var value = fn(elems[i]);

    if (value !== null) {
      ret.push(value);
    }
  }

  return ret;
});
/**
 * Matcher that supports traversing until a condition is met.
 *
 * @returns A function usable for `*Until` methods.
 */


function _matchUntil(nextElem) {
  // We use a variable here that is used from within the matcher.
  var matches = null;

  for (var _len2 = arguments.length, postFns = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    postFns[_key2 - 1] = arguments[_key2];
  }

  var innerMatcher = _getMatcher(function (nextElem, elems) {
    var matched = [];
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.domEach)(elems, function (elem) {
      for (var _next; _next = nextElem(elem); elem = _next) {
        // FIXME: `matched` might contain duplicates here and the index is too large.
        if (matches === null || matches === void 0 ? void 0 : matches(_next, matched.length)) break;
        matched.push(_next);
      }
    });
    return matched;
  }).apply(void 0, [nextElem].concat(postFns));

  return function (selector, filterSelector) {
    var _this = this;

    // Override `matches` variable with the new target.
    matches = typeof selector === 'string' ? function (elem) {
      return cheerio_select__WEBPACK_IMPORTED_MODULE_1__.is(elem, selector, _this.options);
    } : selector ? getFilterFn(selector) : null;
    var ret = innerMatcher.call(this, filterSelector); // Set `matches` to `null`, so we don't waste memory.

    matches = null;
    return ret;
  };
}

function _removeDuplicates(elems) {
  return Array.from(new Set(elems));
}
/**
 * Get the parent of each element in the current set of matched elements,
 * optionally filtered by a selector.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.pear').parent().attr('id');
 * //=> fruits
 * ```
 *
 * @param selector - If specified filter for parent.
 * @returns The parents.
 * @see {@link https://api.jquery.com/parent/}
 */


var parent = _singleMatcher(function (_ref) {
  var parent = _ref.parent;
  return parent && !(0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isDocument)(parent) ? parent : null;
}, _removeDuplicates);
/**
 * Get a set of parents filtered by `selector` of each element in the current
 * set of match elements.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.orange').parents().length;
 * //=> 2
 * $('.orange').parents('#fruits').length;
 * //=> 1
 * ```
 *
 * @param selector - If specified filter for parents.
 * @returns The parents.
 * @see {@link https://api.jquery.com/parents/}
 */

var parents = _matcher(function (elem) {
  var matched = [];

  while (elem.parent && !(0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isDocument)(elem.parent)) {
    matched.push(elem.parent);
    elem = elem.parent;
  }

  return matched;
}, domutils__WEBPACK_IMPORTED_MODULE_4__.uniqueSort, function (elems) {
  return elems.reverse();
});
/**
 * Get the ancestors of each element in the current set of matched elements, up
 * to but not including the element matched by the selector, DOM node, or cheerio object.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.orange').parentsUntil('#food').length;
 * //=> 1
 * ```
 *
 * @param selector - Selector for element to stop at.
 * @param filterSelector - Optional filter for parents.
 * @returns The parents.
 * @see {@link https://api.jquery.com/parentsUntil/}
 */

var parentsUntil = _matchUntil(function (_ref2) {
  var parent = _ref2.parent;
  return parent && !(0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isDocument)(parent) ? parent : null;
}, domutils__WEBPACK_IMPORTED_MODULE_4__.uniqueSort, function (elems) {
  return elems.reverse();
});
/**
 * For each element in the set, get the first element that matches the selector
 * by testing the element itself and traversing up through its ancestors in the DOM tree.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.orange').closest();
 * //=> []
 *
 * $('.orange').closest('.apple');
 * // => []
 *
 * $('.orange').closest('li');
 * //=> [<li class="orange">Orange</li>]
 *
 * $('.orange').closest('#fruits');
 * //=> [<ul id="fruits"> ... </ul>]
 * ```
 *
 * @param selector - Selector for the element to find.
 * @returns The closest nodes.
 * @see {@link https://api.jquery.com/closest/}
 */

function closest(selector) {
  var _a;

  var set = [];

  if (!selector) {
    return this._make(set);
  }

  var selectOpts = {
    xmlMode: this.options.xmlMode,
    root: (_a = this._root) === null || _a === void 0 ? void 0 : _a[0]
  };
  var selectFn = typeof selector === 'string' ? function (elem) {
    return cheerio_select__WEBPACK_IMPORTED_MODULE_1__.is(elem, selector, selectOpts);
  } : getFilterFn(selector);
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.domEach)(this, function (elem) {
    while (elem && (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isTag)(elem)) {
      if (selectFn(elem, 0)) {
        // Do not add duplicate elements to the set
        if (!set.includes(elem)) {
          set.push(elem);
        }

        break;
      }

      elem = elem.parent;
    }
  });
  return this._make(set);
}
/**
 * Gets the next sibling of the first selected element, optionally filtered by a selector.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.apple').next().hasClass('orange');
 * //=> true
 * ```
 *
 * @param selector - If specified filter for sibling.
 * @returns The next nodes.
 * @see {@link https://api.jquery.com/next/}
 */

var next = _singleMatcher(function (elem) {
  return (0,domutils__WEBPACK_IMPORTED_MODULE_4__.nextElementSibling)(elem);
});
/**
 * Gets all the following siblings of the first selected element, optionally
 * filtered by a selector.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.apple').nextAll();
 * //=> [<li class="orange">Orange</li>, <li class="pear">Pear</li>]
 * $('.apple').nextAll('.orange');
 * //=> [<li class="orange">Orange</li>]
 * ```
 *
 * @param selector - If specified filter for siblings.
 * @returns The next nodes.
 * @see {@link https://api.jquery.com/nextAll/}
 */

var nextAll = _matcher(function (elem) {
  var matched = [];

  while (elem.next) {
    elem = elem.next;
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isTag)(elem)) matched.push(elem);
  }

  return matched;
}, _removeDuplicates);
/**
 * Gets all the following siblings up to but not including the element matched
 * by the selector, optionally filtered by another selector.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.apple').nextUntil('.pear');
 * //=> [<li class="orange">Orange</li>]
 * ```
 *
 * @param selector - Selector for element to stop at.
 * @param filterSelector - If specified filter for siblings.
 * @returns The next nodes.
 * @see {@link https://api.jquery.com/nextUntil/}
 */

var nextUntil = _matchUntil(function (el) {
  return (0,domutils__WEBPACK_IMPORTED_MODULE_4__.nextElementSibling)(el);
}, _removeDuplicates);
/**
 * Gets the previous sibling of the first selected element optionally filtered
 * by a selector.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.orange').prev().hasClass('apple');
 * //=> true
 * ```
 *
 * @param selector - If specified filter for siblings.
 * @returns The previous nodes.
 * @see {@link https://api.jquery.com/prev/}
 */

var prev = _singleMatcher(function (elem) {
  return (0,domutils__WEBPACK_IMPORTED_MODULE_4__.prevElementSibling)(elem);
});
/**
 * Gets all the preceding siblings of the first selected element, optionally
 * filtered by a selector.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.pear').prevAll();
 * //=> [<li class="orange">Orange</li>, <li class="apple">Apple</li>]
 *
 * $('.pear').prevAll('.orange');
 * //=> [<li class="orange">Orange</li>]
 * ```
 *
 * @param selector - If specified filter for siblings.
 * @returns The previous nodes.
 * @see {@link https://api.jquery.com/prevAll/}
 */

var prevAll = _matcher(function (elem) {
  var matched = [];

  while (elem.prev) {
    elem = elem.prev;
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isTag)(elem)) matched.push(elem);
  }

  return matched;
}, _removeDuplicates);
/**
 * Gets all the preceding siblings up to but not including the element matched
 * by the selector, optionally filtered by another selector.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.pear').prevUntil('.apple');
 * //=> [<li class="orange">Orange</li>]
 * ```
 *
 * @param selector - Selector for element to stop at.
 * @param filterSelector - If specified filter for siblings.
 * @returns The previous nodes.
 * @see {@link https://api.jquery.com/prevUntil/}
 */

var prevUntil = _matchUntil(function (el) {
  return (0,domutils__WEBPACK_IMPORTED_MODULE_4__.prevElementSibling)(el);
}, _removeDuplicates);
/**
 * Get the siblings of each element (excluding the element) in the set of
 * matched elements, optionally filtered by a selector.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.pear').siblings().length;
 * //=> 2
 *
 * $('.pear').siblings('.orange').length;
 * //=> 1
 * ```
 *
 * @param selector - If specified filter for siblings.
 * @returns The siblings.
 * @see {@link https://api.jquery.com/siblings/}
 */

var siblings = _matcher(function (elem) {
  return (0,domutils__WEBPACK_IMPORTED_MODULE_4__.getSiblings)(elem).filter(function (el) {
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isTag)(el) && el !== elem;
  });
}, domutils__WEBPACK_IMPORTED_MODULE_4__.uniqueSort);
/**
 * Gets the element children of each element in the set of matched elements.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('#fruits').children().length;
 * //=> 3
 *
 * $('#fruits').children('.pear').text();
 * //=> Pear
 * ```
 *
 * @param selector - If specified filter for children.
 * @returns The children.
 * @see {@link https://api.jquery.com/children/}
 */

var children = _matcher(function (elem) {
  return (0,domutils__WEBPACK_IMPORTED_MODULE_4__.getChildren)(elem).filter(_utils_js__WEBPACK_IMPORTED_MODULE_2__.isTag);
}, _removeDuplicates);
/**
 * Gets the children of each element in the set of matched elements, including
 * text and comment nodes.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('#fruits').contents().length;
 * //=> 3
 * ```
 *
 * @returns The children.
 * @see {@link https://api.jquery.com/contents/}
 */

function contents() {
  var elems = this.toArray().reduce(function (newElems, elem) {
    return (0,domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(elem) ? newElems.concat(elem.children) : newElems;
  }, []);
  return this._make(elems);
}
/**
 * Iterates over a cheerio object, executing a function for each matched
 * element. When the callback is fired, the function is fired in the context of
 * the DOM element, so `this` refers to the current element, which is equivalent
 * to the function parameter `element`. To break out of the `each` loop early,
 * return with `false`.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * const fruits = [];
 *
 * $('li').each(function (i, elem) {
 *   fruits[i] = $(this).text();
 * });
 *
 * fruits.join(', ');
 * //=> Apple, Orange, Pear
 * ```
 *
 * @param fn - Function to execute.
 * @returns The instance itself, useful for chaining.
 * @see {@link https://api.jquery.com/each/}
 */

function each(fn) {
  var i = 0;
  var len = this.length;

  while (i < len && fn.call(this[i], i, this[i]) !== false) {
    ++i;
  }

  return this;
}
/**
 * Pass each element in the current matched set through a function, producing a
 * new Cheerio object containing the return values. The function can return an
 * individual data item or an array of data items to be inserted into the
 * resulting set. If an array is returned, the elements inside the array are
 * inserted into the set. If the function returns null or undefined, no element
 * will be inserted.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('li')
 *   .map(function (i, el) {
 *     // this === el
 *     return $(this).text();
 *   })
 *   .toArray()
 *   .join(' ');
 * //=> "apple orange pear"
 * ```
 *
 * @param fn - Function to execute.
 * @returns The mapped elements, wrapped in a Cheerio collection.
 * @see {@link https://api.jquery.com/map/}
 */

function map(fn) {
  var elems = [];

  for (var i = 0; i < this.length; i++) {
    var el = this[i];
    var val = fn.call(el, i, el);

    if (val != null) {
      elems = elems.concat(val);
    }
  }

  return this._make(elems);
}
/**
 * Creates a function to test if a filter is matched.
 *
 * @param match - A filter.
 * @returns A function that determines if a filter has been matched.
 */

function getFilterFn(match) {
  if (typeof match === 'function') {
    return function (el, i) {
      return match.call(el, i, el);
    };
  }

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isCheerio)(match)) {
    return function (el) {
      return Array.prototype.includes.call(match, el);
    };
  }

  return function (el) {
    return match === el;
  };
}

function filter(match) {
  var _a;

  return this._make(filterArray(this.toArray(), match, this.options.xmlMode, (_a = this._root) === null || _a === void 0 ? void 0 : _a[0]));
}
function filterArray(nodes, match, xmlMode, root) {
  return typeof match === 'string' ? cheerio_select__WEBPACK_IMPORTED_MODULE_1__.filter(match, nodes, {
    xmlMode: xmlMode,
    root: root
  }) : nodes.filter(getFilterFn(match));
}
/**
 * Checks the current list of elements and returns `true` if _any_ of the
 * elements match the selector. If using an element or Cheerio selection,
 * returns `true` if _any_ of the elements match. If using a predicate function,
 * the function is executed in the context of the selected element, so `this`
 * refers to the current element.
 *
 * @category Attributes
 * @param selector - Selector for the selection.
 * @returns Whether or not the selector matches an element of the instance.
 * @see {@link https://api.jquery.com/is/}
 */

function is(selector) {
  var nodes = this.toArray();
  return typeof selector === 'string' ? cheerio_select__WEBPACK_IMPORTED_MODULE_1__.some(nodes.filter(_utils_js__WEBPACK_IMPORTED_MODULE_2__.isTag), selector, this.options) : selector ? nodes.some(getFilterFn(selector)) : false;
}
/**
 * Remove elements from the set of matched elements. Given a Cheerio object that
 * represents a set of DOM elements, the `.not()` method constructs a new
 * Cheerio object from a subset of the matching elements. The supplied selector
 * is tested against each element; the elements that don't match the selector
 * will be included in the result.
 *
 * The `.not()` method can take a function as its argument in the same way that
 * `.filter()` does. Elements for which the function returns `true` are excluded
 * from the filtered set; all other elements are included.
 *
 * @category Traversing
 * @example <caption>Selector</caption>
 *
 * ```js
 * $('li').not('.apple').length;
 * //=> 2
 * ```
 *
 * @example <caption>Function</caption>
 *
 * ```js
 * $('li').not(function (i, el) {
 *   // this === el
 *   return $(this).attr('class') === 'orange';
 * }).length; //=> 2
 * ```
 *
 * @param match - Value to look for, following the rules above.
 * @param container - Optional node to filter instead.
 * @returns The filtered collection.
 * @see {@link https://api.jquery.com/not/}
 */

function not(match) {
  var nodes = this.toArray();

  if (typeof match === 'string') {
    var matches = new Set(cheerio_select__WEBPACK_IMPORTED_MODULE_1__.filter(match, nodes, this.options));
    nodes = nodes.filter(function (el) {
      return !matches.has(el);
    });
  } else {
    var filterFn = getFilterFn(match);
    nodes = nodes.filter(function (el, i) {
      return !filterFn(el, i);
    });
  }

  return this._make(nodes);
}
/**
 * Filters the set of matched elements to only those which have the given DOM
 * element as a descendant or which have a descendant that matches the given
 * selector. Equivalent to `.filter(':has(selector)')`.
 *
 * @category Traversing
 * @example <caption>Selector</caption>
 *
 * ```js
 * $('ul').has('.pear').attr('id');
 * //=> fruits
 * ```
 *
 * @example <caption>Element</caption>
 *
 * ```js
 * $('ul').has($('.pear')[0]).attr('id');
 * //=> fruits
 * ```
 *
 * @param selectorOrHaystack - Element to look for.
 * @returns The filtered collection.
 * @see {@link https://api.jquery.com/has/}
 */

function has(selectorOrHaystack) {
  var _this2 = this;

  return this.filter(typeof selectorOrHaystack === 'string' ? // Using the `:has` selector here short-circuits searches.
  ":has(" + selectorOrHaystack + ")" : function (_, el) {
    return _this2._make(el).find(selectorOrHaystack).length > 0;
  });
}
/**
 * Will select the first element of a cheerio object.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('#fruits').children().first().text();
 * //=> Apple
 * ```
 *
 * @returns The first element.
 * @see {@link https://api.jquery.com/first/}
 */

function first() {
  return this.length > 1 ? this._make(this[0]) : this;
}
/**
 * Will select the last element of a cheerio object.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('#fruits').children().last().text();
 * //=> Pear
 * ```
 *
 * @returns The last element.
 * @see {@link https://api.jquery.com/last/}
 */

function last() {
  return this.length > 0 ? this._make(this[this.length - 1]) : this;
}
/**
 * Reduce the set of matched elements to the one at the specified index. Use
 * `.eq(-i)` to count backwards from the last selected element.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('li').eq(0).text();
 * //=> Apple
 *
 * $('li').eq(-1).text();
 * //=> Pear
 * ```
 *
 * @param i - Index of the element to select.
 * @returns The element at the `i`th position.
 * @see {@link https://api.jquery.com/eq/}
 */

function eq(i) {
  var _a;

  i = +i; // Use the first identity optimization if possible

  if (i === 0 && this.length <= 1) return this;
  if (i < 0) i = this.length + i;
  return this._make((_a = this[i]) !== null && _a !== void 0 ? _a : []);
}
function get(i) {
  if (i == null) {
    return this.toArray();
  }

  return this[i < 0 ? this.length + i : i];
}
/**
 * Retrieve all the DOM elements contained in the jQuery set as an array.
 *
 * @example
 *
 * ```js
 * $('li').toArray();
 * //=> [ {...}, {...}, {...} ]
 * ```
 *
 * @returns The contained items.
 */

function toArray() {
  return Array.prototype.slice.call(this);
}
/**
 * Search for a given element from among the matched elements.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.pear').index();
 * //=> 2 $('.orange').index('li');
 * //=> 1
 * $('.apple').index($('#fruit, li'));
 * //=> 1
 * ```
 *
 * @param selectorOrNeedle - Element to look for.
 * @returns The index of the element.
 * @see {@link https://api.jquery.com/index/}
 */

function index(selectorOrNeedle) {
  var $haystack;
  var needle;

  if (selectorOrNeedle == null) {
    $haystack = this.parent().children();
    needle = this[0];
  } else if (typeof selectorOrNeedle === 'string') {
    $haystack = this._make(selectorOrNeedle);
    needle = this[0];
  } else {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    $haystack = this;
    needle = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isCheerio)(selectorOrNeedle) ? selectorOrNeedle[0] : selectorOrNeedle;
  }

  return Array.prototype.indexOf.call($haystack, needle);
}
/**
 * Gets the elements matching the specified range (0-based position).
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('li').slice(1).eq(0).text();
 * //=> 'Orange'
 *
 * $('li').slice(1, 2).length;
 * //=> 1
 * ```
 *
 * @param start - A position at which the elements begin to be selected. If
 *   negative, it indicates an offset from the end of the set.
 * @param end - A position at which the elements stop being selected. If
 *   negative, it indicates an offset from the end of the set. If omitted, the
 *   range continues until the end of the set.
 * @returns The elements matching the specified range.
 * @see {@link https://api.jquery.com/slice/}
 */

function slice(start, end) {
  return this._make(Array.prototype.slice.call(this, start, end));
}
/**
 * End the most recent filtering operation in the current chain and return the
 * set of matched elements to its previous state.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('li').eq(0).end().length;
 * //=> 3
 * ```
 *
 * @returns The previous state of the set of matched elements.
 * @see {@link https://api.jquery.com/end/}
 */

function end() {
  var _a;

  return (_a = this.prevObject) !== null && _a !== void 0 ? _a : this._make([]);
}
/**
 * Add elements to the set of matched elements.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.apple').add('.orange').length;
 * //=> 2
 * ```
 *
 * @param other - Elements to add.
 * @param context - Optionally the context of the new selection.
 * @returns The combined set.
 * @see {@link https://api.jquery.com/add/}
 */

function add(other, context) {
  var selection = this._make(other, context);

  var contents = (0,domutils__WEBPACK_IMPORTED_MODULE_4__.uniqueSort)([].concat(this.get(), selection.get()));
  return this._make(contents);
}
/**
 * Add the previous set of elements on the stack to the current set, optionally
 * filtered by a selector.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('li').eq(0).addBack('.orange').length;
 * //=> 2
 * ```
 *
 * @param selector - Selector for the elements to add.
 * @returns The combined set.
 * @see {@link https://api.jquery.com/addBack/}
 */

function addBack(selector) {
  return this.prevObject ? this.add(selector ? this.prevObject.filter(selector) : this.prevObject) : this;
}

/***/ }),

/***/ "./node_modules/cheerio/lib/esm/cheerio.js":
/*!*************************************************!*\
  !*** ./node_modules/cheerio/lib/esm/cheerio.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Cheerio": () => (/* binding */ Cheerio)
/* harmony export */ });
/* harmony import */ var _api_attributes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api/attributes.js */ "./node_modules/cheerio/lib/esm/api/attributes.js");
/* harmony import */ var _api_traversing_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api/traversing.js */ "./node_modules/cheerio/lib/esm/api/traversing.js");
/* harmony import */ var _api_manipulation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./api/manipulation.js */ "./node_modules/cheerio/lib/esm/api/manipulation.js");
/* harmony import */ var _api_css_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./api/css.js */ "./node_modules/cheerio/lib/esm/api/css.js");
/* harmony import */ var _api_forms_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./api/forms.js */ "./node_modules/cheerio/lib/esm/api/forms.js");





var Cheerio =
/**
 * Instance of cheerio. Methods are specified in the modules. Usage of this
 * constructor is not recommended. Please use `$.load` instead.
 *
 * @private
 * @param elements - The new selection.
 * @param root - Sets the root node.
 * @param options - Options for the instance.
 */
function Cheerio(elements, root, options) {
  this.length = 0;
  this.options = options;
  this._root = root;

  if (elements) {
    for (var idx = 0; idx < elements.length; idx++) {
      this[idx] = elements[idx];
    }

    this.length = elements.length;
  }
};
/** Set a signature of the object. */

Cheerio.prototype.cheerio = '[cheerio object]';
/*
 * Make cheerio an array-like object
 */

Cheerio.prototype.splice = Array.prototype.splice; // Support for (const element of $(...)) iteration:

Cheerio.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]; // Plug in the API

Object.assign(Cheerio.prototype, _api_attributes_js__WEBPACK_IMPORTED_MODULE_0__, _api_traversing_js__WEBPACK_IMPORTED_MODULE_1__, _api_manipulation_js__WEBPACK_IMPORTED_MODULE_2__, _api_css_js__WEBPACK_IMPORTED_MODULE_3__, _api_forms_js__WEBPACK_IMPORTED_MODULE_4__);

/***/ }),

/***/ "./node_modules/cheerio/lib/esm/index.js":
/*!***********************************************!*\
  !*** ./node_modules/cheerio/lib/esm/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "contains": () => (/* binding */ contains),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "html": () => (/* reexport safe */ _static_js__WEBPACK_IMPORTED_MODULE_6__.html),
/* harmony export */   "load": () => (/* binding */ load),
/* harmony export */   "merge": () => (/* binding */ merge),
/* harmony export */   "parseHTML": () => (/* binding */ parseHTML),
/* harmony export */   "root": () => (/* binding */ root),
/* harmony export */   "text": () => (/* reexport safe */ _static_js__WEBPACK_IMPORTED_MODULE_6__.text),
/* harmony export */   "xml": () => (/* reexport safe */ _static_js__WEBPACK_IMPORTED_MODULE_6__.xml)
/* harmony export */ });
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types.js */ "./node_modules/cheerio/lib/esm/types.js");
/* harmony import */ var _load_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./load.js */ "./node_modules/cheerio/lib/esm/load.js");
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./parse.js */ "./node_modules/cheerio/lib/esm/parse.js");
/* harmony import */ var _parsers_parse5_adapter_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./parsers/parse5-adapter.js */ "./node_modules/cheerio/lib/esm/parsers/parse5-adapter.js");
/* harmony import */ var dom_serializer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! dom-serializer */ "./node_modules/dom-serializer/lib/esm/index.js");
/* harmony import */ var htmlparser2__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! htmlparser2 */ "./node_modules/htmlparser2/lib/esm/index.js");
/* harmony import */ var _static_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./static.js */ "./node_modules/cheerio/lib/esm/static.js");
/**
 * Types used in signatures of Cheerio methods.
 *
 * @category Cheerio
 */






var parse = (0,_parse_js__WEBPACK_IMPORTED_MODULE_2__.getParse)(function (content, options, isDocument, context) {
  return options.xmlMode || options._useHtmlParser2 ? (0,htmlparser2__WEBPACK_IMPORTED_MODULE_5__.parseDocument)(content, options) : (0,_parsers_parse5_adapter_js__WEBPACK_IMPORTED_MODULE_3__.parseWithParse5)(content, options, isDocument, context);
}); // Duplicate docs due to https://github.com/TypeStrong/typedoc/issues/1616

/**
 * Create a querying function, bound to a document created from the provided markup.
 *
 * Note that similar to web browser contexts, this operation may introduce
 * `<html>`, `<head>`, and `<body>` elements; set `isDocument` to `false` to
 * switch to fragment mode and disable this.
 *
 * @param content - Markup to be loaded.
 * @param options - Options for the created instance.
 * @param isDocument - Allows parser to be switched to fragment mode.
 * @returns The loaded document.
 * @see {@link https://cheerio.js.org#loading} for additional usage information.
 */

var load = (0,_load_js__WEBPACK_IMPORTED_MODULE_1__.getLoad)(parse, function (dom, options) {
  return options.xmlMode || options._useHtmlParser2 ? (0,dom_serializer__WEBPACK_IMPORTED_MODULE_4__["default"])(dom, options) : (0,_parsers_parse5_adapter_js__WEBPACK_IMPORTED_MODULE_3__.renderWithParse5)(dom);
});
/**
 * The default cheerio instance.
 *
 * @deprecated Use the function returned by `load` instead.
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (load([]));


/**
 * In order to promote consistency with the jQuery library, users are encouraged
 * to instead use the static method of the same name.
 *
 * @deprecated
 * @example
 *
 * ```js
 * const $ = cheerio.load('<div><p></p></div>');
 *
 * $.contains($('div').get(0), $('p').get(0));
 * //=> true
 *
 * $.contains($('p').get(0), $('div').get(0));
 * //=> false
 * ```
 *
 * @returns {boolean}
 */

var contains = _static_js__WEBPACK_IMPORTED_MODULE_6__.contains;
/**
 * In order to promote consistency with the jQuery library, users are encouraged
 * to instead use the static method of the same name.
 *
 * @deprecated
 * @example
 *
 * ```js
 * const $ = cheerio.load('');
 *
 * $.merge([1, 2], [3, 4]);
 * //=> [1, 2, 3, 4]
 * ```
 */


var merge = _static_js__WEBPACK_IMPORTED_MODULE_6__.merge;
/**
 * In order to promote consistency with the jQuery library, users are encouraged
 * to instead use the static method of the same name as it is defined on the
 * "loaded" Cheerio factory function.
 *
 * @deprecated See {@link static/parseHTML}.
 * @example
 *
 * ```js
 * const $ = cheerio.load('');
 * $.parseHTML('<b>markup</b>');
 * ```
 */


var parseHTML = _static_js__WEBPACK_IMPORTED_MODULE_6__.parseHTML;
/**
 * Users seeking to access the top-level element of a parsed document should
 * instead use the `root` static method of a "loaded" Cheerio function.
 *
 * @deprecated
 * @example
 *
 * ```js
 * const $ = cheerio.load('');
 * $.root();
 * ```
 */


var root = _static_js__WEBPACK_IMPORTED_MODULE_6__.root;


/***/ }),

/***/ "./node_modules/cheerio/lib/esm/load.js":
/*!**********************************************!*\
  !*** ./node_modules/cheerio/lib/esm/load.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getLoad": () => (/* binding */ getLoad)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _options_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./options.js */ "./node_modules/cheerio/lib/esm/options.js");
/* harmony import */ var _static_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./static.js */ "./node_modules/cheerio/lib/esm/static.js");
/* harmony import */ var _cheerio_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./cheerio.js */ "./node_modules/cheerio/lib/esm/cheerio.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils.js */ "./node_modules/cheerio/lib/esm/utils.js");






function getLoad(parse, render) {
  /**
   * Create a querying function, bound to a document created from the provided markup.
   *
   * Note that similar to web browser contexts, this operation may introduce
   * `<html>`, `<head>`, and `<body>` elements; set `isDocument` to `false` to
   * switch to fragment mode and disable this.
   *
   * @param content - Markup to be loaded.
   * @param options - Options for the created instance.
   * @param isDocument - Allows parser to be switched to fragment mode.
   * @returns The loaded document.
   * @see {@link https://cheerio.js.org#loading} for additional usage information.
   */
  return function load(content, options, isDocument) {
    if (isDocument === void 0) {
      isDocument = true;
    }

    if (content == null) {
      throw new Error('cheerio.load() expects a string');
    }

    var internalOpts = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, _options_js__WEBPACK_IMPORTED_MODULE_2__["default"], (0,_options_js__WEBPACK_IMPORTED_MODULE_2__.flatten)(options));

    var initialRoot = parse(content, internalOpts, isDocument, null);
    /** Create an extended class here, so that extensions only live on one instance. */

    var LoadedCheerio = /*#__PURE__*/function (_Cheerio) {
      (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(LoadedCheerio, _Cheerio);

      function LoadedCheerio() {
        return _Cheerio.apply(this, arguments) || this;
      }

      var _proto = LoadedCheerio.prototype;

      _proto._make = function _make(selector, context) {
        var cheerio = initialize(selector, context);
        cheerio.prevObject = this;
        return cheerio;
      };

      _proto._parse = function _parse(content, options, isDocument, context) {
        return parse(content, options, isDocument, context);
      };

      _proto._render = function _render(dom) {
        return render(dom, this.options);
      };

      return LoadedCheerio;
    }(_cheerio_js__WEBPACK_IMPORTED_MODULE_4__.Cheerio);

    function initialize(selector, context, root, opts) {
      if (root === void 0) {
        root = initialRoot;
      }

      // $($)
      if (selector && (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.isCheerio)(selector)) return selector;

      var options = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, internalOpts, (0,_options_js__WEBPACK_IMPORTED_MODULE_2__.flatten)(opts));

      var r = typeof root === 'string' ? [parse(root, options, false, null)] : 'length' in root ? root : [root];
      var rootInstance = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.isCheerio)(r) ? r : new LoadedCheerio(r, null, options); // Add a cyclic reference, so that calling methods on `_root` never fails.

      rootInstance._root = rootInstance; // $(), $(null), $(undefined), $(false)

      if (!selector) {
        return new LoadedCheerio(undefined, rootInstance, options);
      }

      var elements = typeof selector === 'string' && (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.isHtml)(selector) ? // $(<html>)
      parse(selector, options, false, null).children : isNode(selector) ? // $(dom)
      [selector] : Array.isArray(selector) ? // $([dom])
      selector : undefined;
      var instance = new LoadedCheerio(elements, rootInstance, options);

      if (elements) {
        return instance;
      }

      if (typeof selector !== 'string') {
        throw new Error('Unexpected type of selector');
      } // We know that our selector is a string now.


      var search = selector;
      var searchContext = !context ? // If we don't have a context, maybe we have a root, from loading
      rootInstance : typeof context === 'string' ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.isHtml)(context) ? // $('li', '<ul>...</ul>')
      new LoadedCheerio([parse(context, options, false, null)], rootInstance, options) : ( // $('li', 'ul')
      search = context + " " + search, rootInstance) : (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.isCheerio)(context) ? // $('li', $)
      context : // $('li', node), $('li', [nodes])
      new LoadedCheerio(Array.isArray(context) ? context : [context], rootInstance, options); // If we still don't have a context, return

      if (!searchContext) return instance;
      /*
       * #id, .class, tag
       */

      return searchContext.find(search);
    } // Add in static methods & properties


    Object.assign(initialize, _static_js__WEBPACK_IMPORTED_MODULE_3__, {
      load: load,
      // `_root` and `_options` are used in static methods.
      _root: initialRoot,
      _options: internalOpts,
      // Add `fn` for plugins
      fn: LoadedCheerio.prototype,
      // Add the prototype here to maintain `instanceof` behavior.
      prototype: LoadedCheerio.prototype
    });
    return initialize;
  };
}

function isNode(obj) {
  return !!obj.name || obj.type === 'root' || obj.type === 'text' || obj.type === 'comment';
}

/***/ }),

/***/ "./node_modules/cheerio/lib/esm/options.js":
/*!*************************************************!*\
  !*** ./node_modules/cheerio/lib/esm/options.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "flatten": () => (/* binding */ flatten)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");

var defaultOpts = {
  xml: false,
  decodeEntities: true
};
/** Cheerio default options. */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defaultOpts);
var xmlModeDefault = {
  _useHtmlParser2: true,
  xmlMode: true
};
/**
 * Flatten the options for Cheerio.
 *
 * This will set `_useHtmlParser2` to true if `xml` is set to true.
 *
 * @param options - The options to flatten.
 * @returns The flattened options.
 */

function flatten(options) {
  return (options === null || options === void 0 ? void 0 : options.xml) ? typeof options.xml === 'boolean' ? xmlModeDefault : (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, xmlModeDefault, options.xml) : options !== null && options !== void 0 ? options : undefined;
}

/***/ }),

/***/ "./node_modules/cheerio/lib/esm/parse.js":
/*!***********************************************!*\
  !*** ./node_modules/cheerio/lib/esm/parse.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getParse": () => (/* binding */ getParse),
/* harmony export */   "update": () => (/* binding */ update)
/* harmony export */ });
/* harmony import */ var domutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domutils */ "./node_modules/domutils/lib/esm/index.js");
/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/esm/index.js");


/**
 * Get the parse function with options.
 *
 * @param parser - The parser function.
 * @returns The parse function with options.
 */

function getParse(parser) {
  /**
   * Parse a HTML string or a node.
   *
   * @param content - The HTML string or node.
   * @param options - The parser options.
   * @param isDocument - If `content` is a document.
   * @param context - The context node in the DOM tree.
   * @returns The parsed document node.
   */
  return function parse(content, options, isDocument, context) {
    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(content)) {
      content = content.toString();
    }

    if (typeof content === 'string') {
      return parser(content, options, isDocument, context);
    }

    var doc = content;

    if (!Array.isArray(doc) && (0,domhandler__WEBPACK_IMPORTED_MODULE_1__.isDocument)(doc)) {
      // If `doc` is already a root, just return it
      return doc;
    } // Add conent to new root element


    var root = new domhandler__WEBPACK_IMPORTED_MODULE_1__.Document([]); // Update the DOM using the root

    update(doc, root);
    return root;
  };
}
/**
 * Update the dom structure, for one changed layer.
 *
 * @param newChilds - The new children.
 * @param parent - The new parent.
 * @returns The parent node.
 */

function update(newChilds, parent) {
  // Normalize
  var arr = Array.isArray(newChilds) ? newChilds : [newChilds]; // Update parent

  if (parent) {
    parent.children = arr;
  } else {
    parent = null;
  } // Update neighbors


  for (var i = 0; i < arr.length; i++) {
    var node = arr[i]; // Cleanly remove existing nodes from their previous structures.

    if (node.parent && node.parent.children !== arr) {
      (0,domutils__WEBPACK_IMPORTED_MODULE_0__.removeElement)(node);
    }

    if (parent) {
      node.prev = arr[i - 1] || null;
      node.next = arr[i + 1] || null;
    } else {
      node.prev = node.next = null;
    }

    node.parent = parent;
  }

  return parent;
}

/***/ }),

/***/ "./node_modules/cheerio/lib/esm/parsers/parse5-adapter.js":
/*!****************************************************************!*\
  !*** ./node_modules/cheerio/lib/esm/parsers/parse5-adapter.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "parseWithParse5": () => (/* binding */ parseWithParse5),
/* harmony export */   "renderWithParse5": () => (/* binding */ renderWithParse5)
/* harmony export */ });
/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/esm/index.js");
/* harmony import */ var parse5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! parse5 */ "./node_modules/parse5/dist/index.js");
/* harmony import */ var parse5_htmlparser2_tree_adapter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! parse5-htmlparser2-tree-adapter */ "./node_modules/parse5-htmlparser2-tree-adapter/dist/index.js");



/**
 * Parse the content with `parse5` in the context of the given `ParentNode`.
 *
 * @param content - The content to parse.
 * @param options - A set of options to use to parse.
 * @param isDocument - Whether to parse the content as a full HTML document.
 * @param context - The context in which to parse the content.
 * @returns The parsed content.
 */

function parseWithParse5(content, options, isDocument, context) {
  var opts = {
    scriptingEnabled: typeof options.scriptingEnabled === 'boolean' ? options.scriptingEnabled : true,
    treeAdapter: parse5_htmlparser2_tree_adapter__WEBPACK_IMPORTED_MODULE_2__.adapter,
    sourceCodeLocationInfo: options.sourceCodeLocationInfo
  };
  return isDocument ? (0,parse5__WEBPACK_IMPORTED_MODULE_1__.parse)(content, opts) : (0,parse5__WEBPACK_IMPORTED_MODULE_1__.parseFragment)(context, content, opts);
}
var renderOpts = {
  treeAdapter: parse5_htmlparser2_tree_adapter__WEBPACK_IMPORTED_MODULE_2__.adapter
};
/**
 * Renders the given DOM tree with `parse5` and returns the result as a string.
 *
 * @param dom - The DOM tree to render.
 * @returns The rendered document.
 */

function renderWithParse5(dom) {
  /*
   * `dom-serializer` passes over the special "root" node and renders the
   * node's children in its place. To mimic this behavior with `parse5`, an
   * equivalent operation must be applied to the input array.
   */
  var nodes = 'length' in dom ? dom : [dom];

  for (var index = 0; index < nodes.length; index += 1) {
    var node = nodes[index];

    if ((0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isDocument)(node)) {
      var _Array$prototype$spli;

      (_Array$prototype$spli = Array.prototype.splice).call.apply(_Array$prototype$spli, [nodes, index, 1].concat(node.children));
    }
  }

  var result = '';

  for (var _index = 0; _index < nodes.length; _index += 1) {
    var _node = nodes[_index];
    result += (0,parse5__WEBPACK_IMPORTED_MODULE_1__.serializeOuter)(_node, renderOpts);
  }

  return result;
}

/***/ }),

/***/ "./node_modules/cheerio/lib/esm/static.js":
/*!************************************************!*\
  !*** ./node_modules/cheerio/lib/esm/static.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "contains": () => (/* binding */ contains),
/* harmony export */   "html": () => (/* binding */ html),
/* harmony export */   "merge": () => (/* binding */ merge),
/* harmony export */   "parseHTML": () => (/* binding */ parseHTML),
/* harmony export */   "root": () => (/* binding */ root),
/* harmony export */   "text": () => (/* binding */ text),
/* harmony export */   "xml": () => (/* binding */ xml)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var domutils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! domutils */ "./node_modules/domutils/lib/esm/index.js");
/* harmony import */ var _options_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./options.js */ "./node_modules/cheerio/lib/esm/options.js");



/**
 * Helper function to render a DOM.
 *
 * @param that - Cheerio instance to render.
 * @param dom - The DOM to render. Defaults to `that`'s root.
 * @param options - Options for rendering.
 * @returns The rendered document.
 */

function render(that, dom, options) {
  if (!that) return '';
  return that(dom !== null && dom !== void 0 ? dom : that._root.children, null, undefined, options).toString();
}
/**
 * Checks if a passed object is an options object.
 *
 * @param dom - Object to check if it is an options object.
 * @returns Whether the object is an options object.
 */


function isOptions(dom, options) {
  return !options && typeof dom === 'object' && dom != null && !('length' in dom) && !('type' in dom);
}

function html(dom, options) {
  /*
   * Be flexible about parameters, sometimes we call html(),
   * with options as only parameter
   * check dom argument for dom element specific properties
   * assume there is no 'length' or 'type' properties in the options object
   */
  var toRender = isOptions(dom) ? (options = dom, undefined) : dom;
  /*
   * Sometimes `$.html()` is used without preloading html,
   * so fallback non-existing options to the default ones.
   */

  var opts = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, _options_js__WEBPACK_IMPORTED_MODULE_2__["default"], this === null || this === void 0 ? void 0 : this._options, (0,_options_js__WEBPACK_IMPORTED_MODULE_2__.flatten)(options !== null && options !== void 0 ? options : {}));

  return render(this, toRender, opts);
}
/**
 * Render the document as XML.
 *
 * @param dom - Element to render.
 * @returns THe rendered document.
 */

function xml(dom) {
  var options = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, this._options, {
    xmlMode: true
  });

  return render(this, dom, options);
}
/**
 * Render the document as text.
 *
 * This returns the `textContent` of the passed elements. The result will
 * include the contents of `script` and `stype` elements. To avoid this, use
 * `.prop('innerText')` instead.
 *
 * @param elements - Elements to render.
 * @returns The rendered document.
 */

function text(elements) {
  var elems = elements ? elements : this ? this.root() : [];
  var ret = '';

  for (var i = 0; i < elems.length; i++) {
    ret += (0,domutils__WEBPACK_IMPORTED_MODULE_1__.textContent)(elems[i]);
  }

  return ret;
}
function parseHTML(data, context, keepScripts) {
  if (keepScripts === void 0) {
    keepScripts = typeof context === 'boolean' ? context : false;
  }

  if (!data || typeof data !== 'string') {
    return null;
  }

  if (typeof context === 'boolean') {
    keepScripts = context;
  }

  var parsed = this.load(data, _options_js__WEBPACK_IMPORTED_MODULE_2__["default"], false);

  if (!keepScripts) {
    parsed('script').remove();
  }
  /*
   * The `children` array is used by Cheerio internally to group elements that
   * share the same parents. When nodes created through `parseHTML` are
   * inserted into previously-existing DOM structures, they will be removed
   * from the `children` array. The results of `parseHTML` should remain
   * constant across these operations, so a shallow copy should be returned.
   */


  return parsed.root()[0].children.slice();
}
/**
 * Sometimes you need to work with the top-level root element. To query it, you
 * can use `$.root()`.
 *
 * @example
 *
 * ```js
 * $.root().append('<ul id="vegetables"></ul>').html();
 * //=> <ul id="fruits">...</ul><ul id="vegetables"></ul>
 * ```
 *
 * @returns Cheerio instance wrapping the root node.
 * @alias Cheerio.root
 */

function root() {
  return this(this._root);
}
/**
 * Checks to see if the `contained` DOM element is a descendant of the
 * `container` DOM element.
 *
 * @param container - Potential parent node.
 * @param contained - Potential child node.
 * @returns Indicates if the nodes contain one another.
 * @alias Cheerio.contains
 * @see {@link https://api.jquery.com/jQuery.contains/}
 */

function contains(container, contained) {
  // According to the jQuery API, an element does not "contain" itself
  if (contained === container) {
    return false;
  }
  /*
   * Step up the descendants, stopping when the root element is reached
   * (signaled by `.parent` returning a reference to the same object)
   */


  var next = contained;

  while (next && next !== next.parent) {
    next = next.parent;

    if (next === container) {
      return true;
    }
  }

  return false;
}
/**
 * $.merge().
 *
 * @param arr1 - First array.
 * @param arr2 - Second array.
 * @returns `arr1`, with elements of `arr2` inserted.
 * @alias Cheerio.merge
 * @see {@link https://api.jquery.com/jQuery.merge/}
 */

function merge(arr1, arr2) {
  if (!isArrayLike(arr1) || !isArrayLike(arr2)) {
    return;
  }

  var newLength = arr1.length;
  var len = +arr2.length;

  for (var i = 0; i < len; i++) {
    arr1[newLength++] = arr2[i];
  }

  arr1.length = newLength;
  return arr1;
}
/**
 * Checks if an object is array-like.
 *
 * @param item - Item to check.
 * @returns Indicates if the item is array-like.
 */

function isArrayLike(item) {
  if (Array.isArray(item)) {
    return true;
  }

  if (typeof item !== 'object' || !Object.prototype.hasOwnProperty.call(item, 'length') || typeof item.length !== 'number' || item.length < 0) {
    return false;
  }

  for (var i = 0; i < item.length; i++) {
    if (!(i in item)) {
      return false;
    }
  }

  return true;
}

/***/ }),

/***/ "./node_modules/cheerio/lib/esm/types.js":
/*!***********************************************!*\
  !*** ./node_modules/cheerio/lib/esm/types.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "./node_modules/cheerio/lib/esm/utils.js":
/*!***********************************************!*\
  !*** ./node_modules/cheerio/lib/esm/utils.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "camelCase": () => (/* binding */ camelCase),
/* harmony export */   "cloneDom": () => (/* binding */ cloneDom),
/* harmony export */   "cssCase": () => (/* binding */ cssCase),
/* harmony export */   "domEach": () => (/* binding */ domEach),
/* harmony export */   "isCheerio": () => (/* binding */ isCheerio),
/* harmony export */   "isHtml": () => (/* binding */ isHtml),
/* harmony export */   "isTag": () => (/* reexport safe */ domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag)
/* harmony export */ });
/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/esm/index.js");

/**
 * Check if the DOM element is a tag.
 *
 * `isTag(type)` includes `<script>` and `<style>` tags.
 *
 * @private
 * @category Utils
 * @param type - The DOM node to check.
 * @returns Whether the node is a tag.
 */


/**
 * Checks if an object is a Cheerio instance.
 *
 * @category Utils
 * @param maybeCheerio - The object to check.
 * @returns Whether the object is a Cheerio instance.
 */

function isCheerio(maybeCheerio) {
  return maybeCheerio.cheerio != null;
}
/**
 * Convert a string to camel case notation.
 *
 * @private
 * @category Utils
 * @param str - The string to be converted.
 * @returns String in camel case notation.
 */

function camelCase(str) {
  return str.replace(/[_.-](\w|$)/g, function (_, x) {
    return x.toUpperCase();
  });
}
/**
 * Convert a string from camel case to "CSS case", where word boundaries are
 * described by hyphens ("-") and all characters are lower-case.
 *
 * @private
 * @category Utils
 * @param str - The string to be converted.
 * @returns String in "CSS case".
 */

function cssCase(str) {
  return str.replace(/[A-Z]/g, '-$&').toLowerCase();
}
/**
 * Iterate over each DOM element without creating intermediary Cheerio instances.
 *
 * This is indented for use internally to avoid otherwise unnecessary memory
 * pressure introduced by _make.
 *
 * @category Utils
 * @param array - The array to iterate over.
 * @param fn - Function to call.
 * @returns The original instance.
 */

function domEach(array, fn) {
  var len = array.length;

  for (var i = 0; i < len; i++) {
    fn(array[i], i);
  }

  return array;
}
/**
 * Create a deep copy of the given DOM structure. Sets the parents of the copies
 * of the passed nodes to `null`.
 *
 * @private
 * @category Utils
 * @param dom - The domhandler-compliant DOM structure.
 * @returns - The cloned DOM.
 */

function cloneDom(dom) {
  var clone = 'length' in dom ? Array.prototype.map.call(dom, function (el) {
    return (0,domhandler__WEBPACK_IMPORTED_MODULE_0__.cloneNode)(el, true);
  }) : [(0,domhandler__WEBPACK_IMPORTED_MODULE_0__.cloneNode)(dom, true)]; // Add a root node around the cloned nodes

  var root = new domhandler__WEBPACK_IMPORTED_MODULE_0__.Document(clone);
  clone.forEach(function (node) {
    node.parent = root;
  });
  return clone;
}
var CharacterCodes;

(function (CharacterCodes) {
  CharacterCodes[CharacterCodes["LowerA"] = 97] = "LowerA";
  CharacterCodes[CharacterCodes["LowerZ"] = 122] = "LowerZ";
  CharacterCodes[CharacterCodes["UpperA"] = 65] = "UpperA";
  CharacterCodes[CharacterCodes["UpperZ"] = 90] = "UpperZ";
  CharacterCodes[CharacterCodes["Exclamation"] = 33] = "Exclamation";
})(CharacterCodes || (CharacterCodes = {}));
/**
 * Check if string is HTML.
 *
 * Tests for a `<` within a string, immediate followed by a letter and
 * eventually followed by a `>`.
 *
 * @private
 * @category Utils
 * @param str - The string to check.
 * @returns Indicates if `str` is HTML.
 */


function isHtml(str) {
  var tagStart = str.indexOf('<');
  if (tagStart < 0 || tagStart > str.length - 3) return false;
  var tagChar = str.charCodeAt(tagStart + 1);
  return (tagChar >= CharacterCodes.LowerA && tagChar <= CharacterCodes.LowerZ || tagChar >= CharacterCodes.UpperA && tagChar <= CharacterCodes.UpperZ || tagChar === CharacterCodes.Exclamation) && str.includes('>', tagStart + 2);
}

/***/ }),

/***/ "./node_modules/css-select/lib/esm/attributes.js":
/*!*******************************************************!*\
  !*** ./node_modules/css-select/lib/esm/attributes.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "attributeRules": () => (/* binding */ attributeRules)
/* harmony export */ });
/* harmony import */ var boolbase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! boolbase */ "./node_modules/boolbase/index.js");

/**
 * All reserved characters in a regex, used for escaping.
 *
 * Taken from XRegExp, (c) 2007-2020 Steven Levithan under the MIT license
 * https://github.com/slevithan/xregexp/blob/95eeebeb8fac8754d54eafe2b4743661ac1cf028/src/xregexp.js#L794
 */

var reChars = /[-[\]{}()*+?.,\\^$|#\s]/g;

function escapeRegex(value) {
  return value.replace(reChars, "\\$&");
}
/**
 * Attributes that are case-insensitive in HTML.
 *
 * @private
 * @see https://html.spec.whatwg.org/multipage/semantics-other.html#case-sensitivity-of-selectors
 */


var caseInsensitiveAttributes = new Set(["accept", "accept-charset", "align", "alink", "axis", "bgcolor", "charset", "checked", "clear", "codetype", "color", "compact", "declare", "defer", "dir", "direction", "disabled", "enctype", "face", "frame", "hreflang", "http-equiv", "lang", "language", "link", "media", "method", "multiple", "nohref", "noresize", "noshade", "nowrap", "readonly", "rel", "rev", "rules", "scope", "scrolling", "selected", "shape", "target", "text", "type", "valign", "valuetype", "vlink"]);

function shouldIgnoreCase(selector, options) {
  return typeof selector.ignoreCase === "boolean" ? selector.ignoreCase : selector.ignoreCase === "quirks" ? !!options.quirksMode : !options.xmlMode && caseInsensitiveAttributes.has(selector.name);
}
/**
 * Attribute selectors
 */


var attributeRules = {
  equals: function equals(next, data, options) {
    var adapter = options.adapter;
    var name = data.name;
    var value = data.value;

    if (shouldIgnoreCase(data, options)) {
      value = value.toLowerCase();
      return function (elem) {
        var attr = adapter.getAttributeValue(elem, name);
        return attr != null && attr.length === value.length && attr.toLowerCase() === value && next(elem);
      };
    }

    return function (elem) {
      return adapter.getAttributeValue(elem, name) === value && next(elem);
    };
  },
  hyphen: function hyphen(next, data, options) {
    var adapter = options.adapter;
    var name = data.name;
    var value = data.value;
    var len = value.length;

    if (shouldIgnoreCase(data, options)) {
      value = value.toLowerCase();
      return function hyphenIC(elem) {
        var attr = adapter.getAttributeValue(elem, name);
        return attr != null && (attr.length === len || attr.charAt(len) === "-") && attr.substr(0, len).toLowerCase() === value && next(elem);
      };
    }

    return function hyphen(elem) {
      var attr = adapter.getAttributeValue(elem, name);
      return attr != null && (attr.length === len || attr.charAt(len) === "-") && attr.substr(0, len) === value && next(elem);
    };
  },
  element: function element(next, data, options) {
    var adapter = options.adapter;
    var name = data.name,
        value = data.value;

    if (/\s/.test(value)) {
      return boolbase__WEBPACK_IMPORTED_MODULE_0__.falseFunc;
    }

    var regex = new RegExp("(?:^|\\s)" + escapeRegex(value) + "(?:$|\\s)", shouldIgnoreCase(data, options) ? "i" : "");
    return function element(elem) {
      var attr = adapter.getAttributeValue(elem, name);
      return attr != null && attr.length >= value.length && regex.test(attr) && next(elem);
    };
  },
  exists: function exists(next, _ref, _ref2) {
    var name = _ref.name;
    var adapter = _ref2.adapter;
    return function (elem) {
      return adapter.hasAttrib(elem, name) && next(elem);
    };
  },
  start: function start(next, data, options) {
    var adapter = options.adapter;
    var name = data.name;
    var value = data.value;
    var len = value.length;

    if (len === 0) {
      return boolbase__WEBPACK_IMPORTED_MODULE_0__.falseFunc;
    }

    if (shouldIgnoreCase(data, options)) {
      value = value.toLowerCase();
      return function (elem) {
        var attr = adapter.getAttributeValue(elem, name);
        return attr != null && attr.length >= len && attr.substr(0, len).toLowerCase() === value && next(elem);
      };
    }

    return function (elem) {
      var _a;

      return !!((_a = adapter.getAttributeValue(elem, name)) === null || _a === void 0 ? void 0 : _a.startsWith(value)) && next(elem);
    };
  },
  end: function end(next, data, options) {
    var adapter = options.adapter;
    var name = data.name;
    var value = data.value;
    var len = -value.length;

    if (len === 0) {
      return boolbase__WEBPACK_IMPORTED_MODULE_0__.falseFunc;
    }

    if (shouldIgnoreCase(data, options)) {
      value = value.toLowerCase();
      return function (elem) {
        var _a;

        return ((_a = adapter.getAttributeValue(elem, name)) === null || _a === void 0 ? void 0 : _a.substr(len).toLowerCase()) === value && next(elem);
      };
    }

    return function (elem) {
      var _a;

      return !!((_a = adapter.getAttributeValue(elem, name)) === null || _a === void 0 ? void 0 : _a.endsWith(value)) && next(elem);
    };
  },
  any: function any(next, data, options) {
    var adapter = options.adapter;
    var name = data.name,
        value = data.value;

    if (value === "") {
      return boolbase__WEBPACK_IMPORTED_MODULE_0__.falseFunc;
    }

    if (shouldIgnoreCase(data, options)) {
      var regex = new RegExp(escapeRegex(value), "i");
      return function anyIC(elem) {
        var attr = adapter.getAttributeValue(elem, name);
        return attr != null && attr.length >= value.length && regex.test(attr) && next(elem);
      };
    }

    return function (elem) {
      var _a;

      return !!((_a = adapter.getAttributeValue(elem, name)) === null || _a === void 0 ? void 0 : _a.includes(value)) && next(elem);
    };
  },
  not: function not(next, data, options) {
    var adapter = options.adapter;
    var name = data.name;
    var value = data.value;

    if (value === "") {
      return function (elem) {
        return !!adapter.getAttributeValue(elem, name) && next(elem);
      };
    } else if (shouldIgnoreCase(data, options)) {
      value = value.toLowerCase();
      return function (elem) {
        var attr = adapter.getAttributeValue(elem, name);
        return (attr == null || attr.length !== value.length || attr.toLowerCase() !== value) && next(elem);
      };
    }

    return function (elem) {
      return adapter.getAttributeValue(elem, name) !== value && next(elem);
    };
  }
};

/***/ }),

/***/ "./node_modules/css-select/lib/esm/compile.js":
/*!****************************************************!*\
  !*** ./node_modules/css-select/lib/esm/compile.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "compile": () => (/* binding */ compile),
/* harmony export */   "compileToken": () => (/* binding */ compileToken),
/* harmony export */   "compileUnsafe": () => (/* binding */ compileUnsafe)
/* harmony export */ });
/* harmony import */ var css_what__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! css-what */ "./node_modules/css-what/lib/es/parse.js");
/* harmony import */ var css_what__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! css-what */ "./node_modules/css-what/lib/es/types.js");
/* harmony import */ var boolbase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! boolbase */ "./node_modules/boolbase/index.js");
/* harmony import */ var _sort_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sort.js */ "./node_modules/css-select/lib/esm/sort.js");
/* harmony import */ var _general_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./general.js */ "./node_modules/css-select/lib/esm/general.js");
/* harmony import */ var _pseudo_selectors_subselects_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pseudo-selectors/subselects.js */ "./node_modules/css-select/lib/esm/pseudo-selectors/subselects.js");
function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }






/**
 * Compiles a selector to an executable function.
 *
 * @param selector Selector to compile.
 * @param options Compilation options.
 * @param context Optional context for the selector.
 */

function compile(selector, options, context) {
  var next = compileUnsafe(selector, options, context);
  return (0,_pseudo_selectors_subselects_js__WEBPACK_IMPORTED_MODULE_3__.ensureIsTag)(next, options.adapter);
}
function compileUnsafe(selector, options, context) {
  var token = typeof selector === "string" ? (0,css_what__WEBPACK_IMPORTED_MODULE_4__.parse)(selector) : selector;
  return compileToken(token, options, context);
}

function includesScopePseudo(t) {
  return t.type === css_what__WEBPACK_IMPORTED_MODULE_5__.SelectorType.Pseudo && (t.name === "scope" || Array.isArray(t.data) && t.data.some(function (data) {
    return data.some(includesScopePseudo);
  }));
}

var DESCENDANT_TOKEN = {
  type: css_what__WEBPACK_IMPORTED_MODULE_5__.SelectorType.Descendant
};
var FLEXIBLE_DESCENDANT_TOKEN = {
  type: "_flexibleDescendant"
};
var SCOPE_TOKEN = {
  type: css_what__WEBPACK_IMPORTED_MODULE_5__.SelectorType.Pseudo,
  name: "scope",
  data: null
};
/*
 * CSS 4 Spec (Draft): 3.4.1. Absolutizing a Relative Selector
 * http://www.w3.org/TR/selectors4/#absolutizing
 */

function absolutize(token, _ref, context) {
  var adapter = _ref.adapter;
  // TODO Use better check if the context is a document
  var hasContext = !!(context === null || context === void 0 ? void 0 : context.every(function (e) {
    var parent = adapter.isTag(e) && adapter.getParent(e);
    return e === _pseudo_selectors_subselects_js__WEBPACK_IMPORTED_MODULE_3__.PLACEHOLDER_ELEMENT || parent && adapter.isTag(parent);
  }));

  for (var _iterator = _createForOfIteratorHelperLoose(token), _step; !(_step = _iterator()).done;) {
    var t = _step.value;

    if (t.length > 0 && (0,_sort_js__WEBPACK_IMPORTED_MODULE_1__.isTraversal)(t[0]) && t[0].type !== css_what__WEBPACK_IMPORTED_MODULE_5__.SelectorType.Descendant) {// Don't continue in else branch
    } else if (hasContext && !t.some(includesScopePseudo)) {
      t.unshift(DESCENDANT_TOKEN);
    } else {
      continue;
    }

    t.unshift(SCOPE_TOKEN);
  }
}

function compileToken(token, options, context) {
  var _a;

  token.forEach(_sort_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
  context = (_a = options.context) !== null && _a !== void 0 ? _a : context;
  var isArrayContext = Array.isArray(context);
  var finalContext = context && (Array.isArray(context) ? context : [context]); // Check if the selector is relative

  if (options.relativeSelector !== false) {
    absolutize(token, options, finalContext);
  } else if (token.some(function (t) {
    return t.length > 0 && (0,_sort_js__WEBPACK_IMPORTED_MODULE_1__.isTraversal)(t[0]);
  })) {
    throw new Error("Relative selectors are not allowed when the `relativeSelector` option is disabled");
  }

  var shouldTestNextSiblings = false;
  var query = token.map(function (rules) {
    if (rules.length >= 2) {
      var first = rules[0],
          second = rules[1];

      if (first.type !== css_what__WEBPACK_IMPORTED_MODULE_5__.SelectorType.Pseudo || first.name !== "scope") {// Ignore
      } else if (isArrayContext && second.type === css_what__WEBPACK_IMPORTED_MODULE_5__.SelectorType.Descendant) {
        rules[1] = FLEXIBLE_DESCENDANT_TOKEN;
      } else if (second.type === css_what__WEBPACK_IMPORTED_MODULE_5__.SelectorType.Adjacent || second.type === css_what__WEBPACK_IMPORTED_MODULE_5__.SelectorType.Sibling) {
        shouldTestNextSiblings = true;
      }
    }

    return compileRules(rules, options, finalContext);
  }).reduce(reduceRules, boolbase__WEBPACK_IMPORTED_MODULE_0__.falseFunc);
  query.shouldTestNextSiblings = shouldTestNextSiblings;
  return query;
}

function compileRules(rules, options, context) {
  var _a;

  return rules.reduce(function (previous, rule) {
    return previous === boolbase__WEBPACK_IMPORTED_MODULE_0__.falseFunc ? boolbase__WEBPACK_IMPORTED_MODULE_0__.falseFunc : (0,_general_js__WEBPACK_IMPORTED_MODULE_2__.compileGeneralSelector)(previous, rule, options, context, compileToken);
  }, (_a = options.rootFunc) !== null && _a !== void 0 ? _a : boolbase__WEBPACK_IMPORTED_MODULE_0__.trueFunc);
}

function reduceRules(a, b) {
  if (b === boolbase__WEBPACK_IMPORTED_MODULE_0__.falseFunc || a === boolbase__WEBPACK_IMPORTED_MODULE_0__.trueFunc) {
    return a;
  }

  if (a === boolbase__WEBPACK_IMPORTED_MODULE_0__.falseFunc || b === boolbase__WEBPACK_IMPORTED_MODULE_0__.trueFunc) {
    return b;
  }

  return function combine(elem) {
    return a(elem) || b(elem);
  };
}

/***/ }),

/***/ "./node_modules/css-select/lib/esm/general.js":
/*!****************************************************!*\
  !*** ./node_modules/css-select/lib/esm/general.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "compileGeneralSelector": () => (/* binding */ compileGeneralSelector)
/* harmony export */ });
/* harmony import */ var _attributes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./attributes.js */ "./node_modules/css-select/lib/esm/attributes.js");
/* harmony import */ var _pseudo_selectors_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pseudo-selectors/index.js */ "./node_modules/css-select/lib/esm/pseudo-selectors/index.js");
/* harmony import */ var css_what__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! css-what */ "./node_modules/css-what/lib/es/types.js");




function getElementParent(node, adapter) {
  var parent = adapter.getParent(node);

  if (parent && adapter.isTag(parent)) {
    return parent;
  }

  return null;
}
/*
 * All available rules
 */


function compileGeneralSelector(next, selector, options, context, compileToken) {
  var adapter = options.adapter,
      equals = options.equals;

  switch (selector.type) {
    case css_what__WEBPACK_IMPORTED_MODULE_2__.SelectorType.PseudoElement:
      {
        throw new Error("Pseudo-elements are not supported by css-select");
      }

    case css_what__WEBPACK_IMPORTED_MODULE_2__.SelectorType.ColumnCombinator:
      {
        throw new Error("Column combinators are not yet supported by css-select");
      }

    case css_what__WEBPACK_IMPORTED_MODULE_2__.SelectorType.Attribute:
      {
        if (selector.namespace != null) {
          throw new Error("Namespaced attributes are not yet supported by css-select");
        }

        if (!options.xmlMode || options.lowerCaseAttributeNames) {
          selector.name = selector.name.toLowerCase();
        }

        return _attributes_js__WEBPACK_IMPORTED_MODULE_0__.attributeRules[selector.action](next, selector, options);
      }

    case css_what__WEBPACK_IMPORTED_MODULE_2__.SelectorType.Pseudo:
      {
        return (0,_pseudo_selectors_index_js__WEBPACK_IMPORTED_MODULE_1__.compilePseudoSelector)(next, selector, options, context, compileToken);
      }
    // Tags

    case css_what__WEBPACK_IMPORTED_MODULE_2__.SelectorType.Tag:
      {
        if (selector.namespace != null) {
          throw new Error("Namespaced tag names are not yet supported by css-select");
        }

        var name = selector.name;

        if (!options.xmlMode || options.lowerCaseTags) {
          name = name.toLowerCase();
        }

        return function tag(elem) {
          return adapter.getName(elem) === name && next(elem);
        };
      }
    // Traversal

    case css_what__WEBPACK_IMPORTED_MODULE_2__.SelectorType.Descendant:
      {
        if (options.cacheResults === false || typeof WeakSet === "undefined") {
          return function descendant(elem) {
            var current = elem;

            while (current = getElementParent(current, adapter)) {
              if (next(current)) {
                return true;
              }
            }

            return false;
          };
        } // @ts-expect-error `ElementNode` is not extending object


        var isFalseCache = new WeakSet();
        return function cachedDescendant(elem) {
          var current = elem;

          while (current = getElementParent(current, adapter)) {
            if (!isFalseCache.has(current)) {
              if (adapter.isTag(current) && next(current)) {
                return true;
              }

              isFalseCache.add(current);
            }
          }

          return false;
        };
      }

    case "_flexibleDescendant":
      {
        // Include element itself, only used while querying an array
        return function flexibleDescendant(elem) {
          var current = elem;

          do {
            if (next(current)) return true;
          } while (current = getElementParent(current, adapter));

          return false;
        };
      }

    case css_what__WEBPACK_IMPORTED_MODULE_2__.SelectorType.Parent:
      {
        return function parent(elem) {
          return adapter.getChildren(elem).some(function (elem) {
            return adapter.isTag(elem) && next(elem);
          });
        };
      }

    case css_what__WEBPACK_IMPORTED_MODULE_2__.SelectorType.Child:
      {
        return function child(elem) {
          var parent = adapter.getParent(elem);
          return parent != null && adapter.isTag(parent) && next(parent);
        };
      }

    case css_what__WEBPACK_IMPORTED_MODULE_2__.SelectorType.Sibling:
      {
        return function sibling(elem) {
          var siblings = adapter.getSiblings(elem);

          for (var i = 0; i < siblings.length; i++) {
            var currentSibling = siblings[i];
            if (equals(elem, currentSibling)) break;

            if (adapter.isTag(currentSibling) && next(currentSibling)) {
              return true;
            }
          }

          return false;
        };
      }

    case css_what__WEBPACK_IMPORTED_MODULE_2__.SelectorType.Adjacent:
      {
        if (adapter.prevElementSibling) {
          return function adjacent(elem) {
            var previous = adapter.prevElementSibling(elem);
            return previous != null && next(previous);
          };
        }

        return function adjacent(elem) {
          var siblings = adapter.getSiblings(elem);
          var lastElement;

          for (var i = 0; i < siblings.length; i++) {
            var currentSibling = siblings[i];
            if (equals(elem, currentSibling)) break;

            if (adapter.isTag(currentSibling)) {
              lastElement = currentSibling;
            }
          }

          return !!lastElement && next(lastElement);
        };
      }

    case css_what__WEBPACK_IMPORTED_MODULE_2__.SelectorType.Universal:
      {
        if (selector.namespace != null && selector.namespace !== "*") {
          throw new Error("Namespaced universal selectors are not yet supported by css-select");
        }

        return next;
      }
  }
}

/***/ }),

/***/ "./node_modules/css-select/lib/esm/index.js":
/*!**************************************************!*\
  !*** ./node_modules/css-select/lib/esm/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_compileToken": () => (/* binding */ _compileToken),
/* harmony export */   "_compileUnsafe": () => (/* binding */ _compileUnsafe),
/* harmony export */   "aliases": () => (/* reexport safe */ _pseudo_selectors_index_js__WEBPACK_IMPORTED_MODULE_4__.aliases),
/* harmony export */   "compile": () => (/* binding */ compile),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "filters": () => (/* reexport safe */ _pseudo_selectors_index_js__WEBPACK_IMPORTED_MODULE_4__.filters),
/* harmony export */   "is": () => (/* binding */ is),
/* harmony export */   "prepareContext": () => (/* binding */ prepareContext),
/* harmony export */   "pseudos": () => (/* reexport safe */ _pseudo_selectors_index_js__WEBPACK_IMPORTED_MODULE_4__.pseudos),
/* harmony export */   "selectAll": () => (/* binding */ selectAll),
/* harmony export */   "selectOne": () => (/* binding */ selectOne)
/* harmony export */ });
/* harmony import */ var domutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domutils */ "./node_modules/domutils/lib/esm/index.js");
/* harmony import */ var boolbase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! boolbase */ "./node_modules/boolbase/index.js");
/* harmony import */ var _compile_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./compile.js */ "./node_modules/css-select/lib/esm/compile.js");
/* harmony import */ var _pseudo_selectors_subselects_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pseudo-selectors/subselects.js */ "./node_modules/css-select/lib/esm/pseudo-selectors/subselects.js");
/* harmony import */ var _pseudo_selectors_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pseudo-selectors/index.js */ "./node_modules/css-select/lib/esm/pseudo-selectors/index.js");





var defaultEquals = function defaultEquals(a, b) {
  return a === b;
};

var defaultOptions = {
  adapter: domutils__WEBPACK_IMPORTED_MODULE_0__,
  equals: defaultEquals
};

function convertOptionFormats(options) {
  var _a, _b, _c, _d;
  /*
   * We force one format of options to the other one.
   */
  // @ts-expect-error Default options may have incompatible `Node` / `ElementNode`.


  var opts = options !== null && options !== void 0 ? options : defaultOptions; // @ts-expect-error Same as above.

  (_a = opts.adapter) !== null && _a !== void 0 ? _a : opts.adapter = domutils__WEBPACK_IMPORTED_MODULE_0__; // @ts-expect-error `equals` does not exist on `Options`

  (_b = opts.equals) !== null && _b !== void 0 ? _b : opts.equals = (_d = (_c = opts.adapter) === null || _c === void 0 ? void 0 : _c.equals) !== null && _d !== void 0 ? _d : defaultEquals;
  return opts;
}

function wrapCompile(func) {
  return function addAdapter(selector, options, context) {
    var opts = convertOptionFormats(options);
    return func(selector, opts, context);
  };
}
/**
 * Compiles the query, returns a function.
 */


var compile = wrapCompile(_compile_js__WEBPACK_IMPORTED_MODULE_2__.compile);
var _compileUnsafe = wrapCompile(_compile_js__WEBPACK_IMPORTED_MODULE_2__.compileUnsafe);
var _compileToken = wrapCompile(_compile_js__WEBPACK_IMPORTED_MODULE_2__.compileToken);

function getSelectorFunc(searchFunc) {
  return function select(query, elements, options) {
    var opts = convertOptionFormats(options);

    if (typeof query !== "function") {
      query = (0,_compile_js__WEBPACK_IMPORTED_MODULE_2__.compileUnsafe)(query, opts, elements);
    }

    var filteredElements = prepareContext(elements, opts.adapter, query.shouldTestNextSiblings);
    return searchFunc(query, filteredElements, opts);
  };
}

function prepareContext(elems, adapter, shouldTestNextSiblings) {
  if (shouldTestNextSiblings === void 0) {
    shouldTestNextSiblings = false;
  }

  /*
   * Add siblings if the query requires them.
   * See https://github.com/fb55/css-select/pull/43#issuecomment-225414692
   */
  if (shouldTestNextSiblings) {
    elems = appendNextSiblings(elems, adapter);
  }

  return Array.isArray(elems) ? adapter.removeSubsets(elems) : adapter.getChildren(elems);
}

function appendNextSiblings(elem, adapter) {
  // Order matters because jQuery seems to check the children before the siblings
  var elems = Array.isArray(elem) ? elem.slice(0) : [elem];
  var elemsLength = elems.length;

  for (var i = 0; i < elemsLength; i++) {
    var nextSiblings = (0,_pseudo_selectors_subselects_js__WEBPACK_IMPORTED_MODULE_3__.getNextSiblings)(elems[i], adapter);
    elems.push.apply(elems, nextSiblings);
  }

  return elems;
}
/**
 * @template Node The generic Node type for the DOM adapter being used.
 * @template ElementNode The Node type for elements for the DOM adapter being used.
 * @param elems Elements to query. If it is an element, its children will be queried..
 * @param query can be either a CSS selector string or a compiled query function.
 * @param [options] options for querying the document.
 * @see compile for supported selector queries.
 * @returns All matching elements.
 *
 */


var selectAll = getSelectorFunc(function (query, elems, options) {
  return query === boolbase__WEBPACK_IMPORTED_MODULE_1__.falseFunc || !elems || elems.length === 0 ? [] : options.adapter.findAll(query, elems);
});
/**
 * @template Node The generic Node type for the DOM adapter being used.
 * @template ElementNode The Node type for elements for the DOM adapter being used.
 * @param elems Elements to query. If it is an element, its children will be queried..
 * @param query can be either a CSS selector string or a compiled query function.
 * @param [options] options for querying the document.
 * @see compile for supported selector queries.
 * @returns the first match, or null if there was no match.
 */

var selectOne = getSelectorFunc(function (query, elems, options) {
  return query === boolbase__WEBPACK_IMPORTED_MODULE_1__.falseFunc || !elems || elems.length === 0 ? null : options.adapter.findOne(query, elems);
});
/**
 * Tests whether or not an element is matched by query.
 *
 * @template Node The generic Node type for the DOM adapter being used.
 * @template ElementNode The Node type for elements for the DOM adapter being used.
 * @param elem The element to test if it matches the query.
 * @param query can be either a CSS selector string or a compiled query function.
 * @param [options] options for querying the document.
 * @see compile for supported selector queries.
 * @returns
 */

function is(elem, query, options) {
  var opts = convertOptionFormats(options);
  return (typeof query === "function" ? query : (0,_compile_js__WEBPACK_IMPORTED_MODULE_2__.compile)(query, opts))(elem);
}
/**
 * Alias for selectAll(query, elems, options).
 * @see [compile] for supported selector queries.
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (selectAll); // Export filters, pseudos and aliases to allow users to supply their own.

/** @deprecated Use the `pseudos` option instead. */



/***/ }),

/***/ "./node_modules/css-select/lib/esm/pseudo-selectors/aliases.js":
/*!*********************************************************************!*\
  !*** ./node_modules/css-select/lib/esm/pseudo-selectors/aliases.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "aliases": () => (/* binding */ aliases)
/* harmony export */ });
/**
 * Aliases are pseudos that are expressed as selectors.
 */
var aliases = {
  // Links
  "any-link": ":is(a, area, link)[href]",
  link: ":any-link:not(:visited)",
  // Forms
  // https://html.spec.whatwg.org/multipage/scripting.html#disabled-elements
  disabled: ":is(\n        :is(button, input, select, textarea, optgroup, option)[disabled],\n        optgroup[disabled] > option,\n        fieldset[disabled]:not(fieldset[disabled] legend:first-of-type *)\n    )",
  enabled: ":not(:disabled)",
  checked: ":is(:is(input[type=radio], input[type=checkbox])[checked], option:selected)",
  required: ":is(input, select, textarea)[required]",
  optional: ":is(input, select, textarea):not([required])",
  // JQuery extensions
  // https://html.spec.whatwg.org/multipage/form-elements.html#concept-option-selectedness
  selected: "option:is([selected], select:not([multiple]):not(:has(> option[selected])) > :first-of-type)",
  checkbox: "[type=checkbox]",
  file: "[type=file]",
  password: "[type=password]",
  radio: "[type=radio]",
  reset: "[type=reset]",
  image: "[type=image]",
  submit: "[type=submit]",
  parent: ":not(:empty)",
  header: ":is(h1, h2, h3, h4, h5, h6)",
  button: ":is(button, input[type=button])",
  input: ":is(input, textarea, select, button)",
  text: "input:is(:not([type!='']), [type=text])"
};

/***/ }),

/***/ "./node_modules/css-select/lib/esm/pseudo-selectors/filters.js":
/*!*********************************************************************!*\
  !*** ./node_modules/css-select/lib/esm/pseudo-selectors/filters.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "filters": () => (/* binding */ filters)
/* harmony export */ });
/* harmony import */ var nth_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! nth-check */ "./node_modules/nth-check/lib/esm/index.js");
/* harmony import */ var boolbase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! boolbase */ "./node_modules/boolbase/index.js");



function getChildFunc(next, adapter) {
  return function (elem) {
    var parent = adapter.getParent(elem);
    return parent != null && adapter.isTag(parent) && next(elem);
  };
}

var filters = {
  contains: function contains(next, text, _ref) {
    var adapter = _ref.adapter;
    return function contains(elem) {
      return next(elem) && adapter.getText(elem).includes(text);
    };
  },
  icontains: function icontains(next, text, _ref2) {
    var adapter = _ref2.adapter;
    var itext = text.toLowerCase();
    return function icontains(elem) {
      return next(elem) && adapter.getText(elem).toLowerCase().includes(itext);
    };
  },
  // Location specific methods
  "nth-child": function nthChild(next, rule, _ref3) {
    var adapter = _ref3.adapter,
        equals = _ref3.equals;
    var func = (0,nth_check__WEBPACK_IMPORTED_MODULE_0__["default"])(rule);
    if (func === boolbase__WEBPACK_IMPORTED_MODULE_1__.falseFunc) return boolbase__WEBPACK_IMPORTED_MODULE_1__.falseFunc;
    if (func === boolbase__WEBPACK_IMPORTED_MODULE_1__.trueFunc) return getChildFunc(next, adapter);
    return function nthChild(elem) {
      var siblings = adapter.getSiblings(elem);
      var pos = 0;

      for (var i = 0; i < siblings.length; i++) {
        if (equals(elem, siblings[i])) break;

        if (adapter.isTag(siblings[i])) {
          pos++;
        }
      }

      return func(pos) && next(elem);
    };
  },
  "nth-last-child": function nthLastChild(next, rule, _ref4) {
    var adapter = _ref4.adapter,
        equals = _ref4.equals;
    var func = (0,nth_check__WEBPACK_IMPORTED_MODULE_0__["default"])(rule);
    if (func === boolbase__WEBPACK_IMPORTED_MODULE_1__.falseFunc) return boolbase__WEBPACK_IMPORTED_MODULE_1__.falseFunc;
    if (func === boolbase__WEBPACK_IMPORTED_MODULE_1__.trueFunc) return getChildFunc(next, adapter);
    return function nthLastChild(elem) {
      var siblings = adapter.getSiblings(elem);
      var pos = 0;

      for (var i = siblings.length - 1; i >= 0; i--) {
        if (equals(elem, siblings[i])) break;

        if (adapter.isTag(siblings[i])) {
          pos++;
        }
      }

      return func(pos) && next(elem);
    };
  },
  "nth-of-type": function nthOfType(next, rule, _ref5) {
    var adapter = _ref5.adapter,
        equals = _ref5.equals;
    var func = (0,nth_check__WEBPACK_IMPORTED_MODULE_0__["default"])(rule);
    if (func === boolbase__WEBPACK_IMPORTED_MODULE_1__.falseFunc) return boolbase__WEBPACK_IMPORTED_MODULE_1__.falseFunc;
    if (func === boolbase__WEBPACK_IMPORTED_MODULE_1__.trueFunc) return getChildFunc(next, adapter);
    return function nthOfType(elem) {
      var siblings = adapter.getSiblings(elem);
      var pos = 0;

      for (var i = 0; i < siblings.length; i++) {
        var currentSibling = siblings[i];
        if (equals(elem, currentSibling)) break;

        if (adapter.isTag(currentSibling) && adapter.getName(currentSibling) === adapter.getName(elem)) {
          pos++;
        }
      }

      return func(pos) && next(elem);
    };
  },
  "nth-last-of-type": function nthLastOfType(next, rule, _ref6) {
    var adapter = _ref6.adapter,
        equals = _ref6.equals;
    var func = (0,nth_check__WEBPACK_IMPORTED_MODULE_0__["default"])(rule);
    if (func === boolbase__WEBPACK_IMPORTED_MODULE_1__.falseFunc) return boolbase__WEBPACK_IMPORTED_MODULE_1__.falseFunc;
    if (func === boolbase__WEBPACK_IMPORTED_MODULE_1__.trueFunc) return getChildFunc(next, adapter);
    return function nthLastOfType(elem) {
      var siblings = adapter.getSiblings(elem);
      var pos = 0;

      for (var i = siblings.length - 1; i >= 0; i--) {
        var currentSibling = siblings[i];
        if (equals(elem, currentSibling)) break;

        if (adapter.isTag(currentSibling) && adapter.getName(currentSibling) === adapter.getName(elem)) {
          pos++;
        }
      }

      return func(pos) && next(elem);
    };
  },
  // TODO determine the actual root element
  root: function root(next, _rule, _ref7) {
    var adapter = _ref7.adapter;
    return function (elem) {
      var parent = adapter.getParent(elem);
      return (parent == null || !adapter.isTag(parent)) && next(elem);
    };
  },
  scope: function scope(next, rule, options, context) {
    var equals = options.equals;

    if (!context || context.length === 0) {
      // Equivalent to :root
      return filters["root"](next, rule, options);
    }

    if (context.length === 1) {
      // NOTE: can't be unpacked, as :has uses this for side-effects
      return function (elem) {
        return equals(context[0], elem) && next(elem);
      };
    }

    return function (elem) {
      return context.includes(elem) && next(elem);
    };
  },
  hover: dynamicStatePseudo("isHovered"),
  visited: dynamicStatePseudo("isVisited"),
  active: dynamicStatePseudo("isActive")
};
/**
 * Dynamic state pseudos. These depend on optional Adapter methods.
 *
 * @param name The name of the adapter method to call.
 * @returns Pseudo for the `filters` object.
 */

function dynamicStatePseudo(name) {
  return function dynamicPseudo(next, _rule, _ref8) {
    var adapter = _ref8.adapter;
    var func = adapter[name];

    if (typeof func !== "function") {
      return boolbase__WEBPACK_IMPORTED_MODULE_1__.falseFunc;
    }

    return function active(elem) {
      return func(elem) && next(elem);
    };
  };
}

/***/ }),

/***/ "./node_modules/css-select/lib/esm/pseudo-selectors/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/css-select/lib/esm/pseudo-selectors/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "aliases": () => (/* reexport safe */ _aliases_js__WEBPACK_IMPORTED_MODULE_2__.aliases),
/* harmony export */   "compilePseudoSelector": () => (/* binding */ compilePseudoSelector),
/* harmony export */   "filters": () => (/* reexport safe */ _filters_js__WEBPACK_IMPORTED_MODULE_0__.filters),
/* harmony export */   "pseudos": () => (/* reexport safe */ _pseudos_js__WEBPACK_IMPORTED_MODULE_1__.pseudos)
/* harmony export */ });
/* harmony import */ var css_what__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! css-what */ "./node_modules/css-what/lib/es/parse.js");
/* harmony import */ var _filters_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./filters.js */ "./node_modules/css-select/lib/esm/pseudo-selectors/filters.js");
/* harmony import */ var _pseudos_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pseudos.js */ "./node_modules/css-select/lib/esm/pseudo-selectors/pseudos.js");
/* harmony import */ var _aliases_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./aliases.js */ "./node_modules/css-select/lib/esm/pseudo-selectors/aliases.js");
/* harmony import */ var _subselects_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./subselects.js */ "./node_modules/css-select/lib/esm/pseudo-selectors/subselects.js");






function compilePseudoSelector(next, selector, options, context, compileToken) {
  var _a;

  var name = selector.name,
      data = selector.data;

  if (Array.isArray(data)) {
    if (!(name in _subselects_js__WEBPACK_IMPORTED_MODULE_3__.subselects)) {
      throw new Error("Unknown pseudo-class :" + name + "(" + data + ")");
    }

    return _subselects_js__WEBPACK_IMPORTED_MODULE_3__.subselects[name](next, data, options, context, compileToken);
  }

  var userPseudo = (_a = options.pseudos) === null || _a === void 0 ? void 0 : _a[name];
  var stringPseudo = typeof userPseudo === "string" ? userPseudo : _aliases_js__WEBPACK_IMPORTED_MODULE_2__.aliases[name];

  if (typeof stringPseudo === "string") {
    if (data != null) {
      throw new Error("Pseudo " + name + " doesn't have any arguments");
    } // The alias has to be parsed here, to make sure options are respected.


    var alias = (0,css_what__WEBPACK_IMPORTED_MODULE_4__.parse)(stringPseudo);
    return _subselects_js__WEBPACK_IMPORTED_MODULE_3__.subselects.is(next, alias, options, context, compileToken);
  }

  if (typeof userPseudo === "function") {
    (0,_pseudos_js__WEBPACK_IMPORTED_MODULE_1__.verifyPseudoArgs)(userPseudo, name, data, 1);
    return function (elem) {
      return userPseudo(elem, data) && next(elem);
    };
  }

  if (name in _filters_js__WEBPACK_IMPORTED_MODULE_0__.filters) {
    return _filters_js__WEBPACK_IMPORTED_MODULE_0__.filters[name](next, data, options, context);
  }

  if (name in _pseudos_js__WEBPACK_IMPORTED_MODULE_1__.pseudos) {
    var pseudo = _pseudos_js__WEBPACK_IMPORTED_MODULE_1__.pseudos[name];
    (0,_pseudos_js__WEBPACK_IMPORTED_MODULE_1__.verifyPseudoArgs)(pseudo, name, data, 2);
    return function (elem) {
      return pseudo(elem, options, data) && next(elem);
    };
  }

  throw new Error("Unknown pseudo-class :" + name);
}

/***/ }),

/***/ "./node_modules/css-select/lib/esm/pseudo-selectors/pseudos.js":
/*!*********************************************************************!*\
  !*** ./node_modules/css-select/lib/esm/pseudo-selectors/pseudos.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pseudos": () => (/* binding */ pseudos),
/* harmony export */   "verifyPseudoArgs": () => (/* binding */ verifyPseudoArgs)
/* harmony export */ });
// While filters are precompiled, pseudos get called when they are needed
var pseudos = {
  empty: function empty(elem, _ref) {
    var adapter = _ref.adapter;
    return !adapter.getChildren(elem).some(function (elem) {
      return (// FIXME: `getText` call is potentially expensive.
        adapter.isTag(elem) || adapter.getText(elem) !== ""
      );
    });
  },
  "first-child": function firstChild(elem, _ref2) {
    var adapter = _ref2.adapter,
        equals = _ref2.equals;

    if (adapter.prevElementSibling) {
      return adapter.prevElementSibling(elem) == null;
    }

    var firstChild = adapter.getSiblings(elem).find(function (elem) {
      return adapter.isTag(elem);
    });
    return firstChild != null && equals(elem, firstChild);
  },
  "last-child": function lastChild(elem, _ref3) {
    var adapter = _ref3.adapter,
        equals = _ref3.equals;
    var siblings = adapter.getSiblings(elem);

    for (var i = siblings.length - 1; i >= 0; i--) {
      if (equals(elem, siblings[i])) return true;
      if (adapter.isTag(siblings[i])) break;
    }

    return false;
  },
  "first-of-type": function firstOfType(elem, _ref4) {
    var adapter = _ref4.adapter,
        equals = _ref4.equals;
    var siblings = adapter.getSiblings(elem);
    var elemName = adapter.getName(elem);

    for (var i = 0; i < siblings.length; i++) {
      var currentSibling = siblings[i];
      if (equals(elem, currentSibling)) return true;

      if (adapter.isTag(currentSibling) && adapter.getName(currentSibling) === elemName) {
        break;
      }
    }

    return false;
  },
  "last-of-type": function lastOfType(elem, _ref5) {
    var adapter = _ref5.adapter,
        equals = _ref5.equals;
    var siblings = adapter.getSiblings(elem);
    var elemName = adapter.getName(elem);

    for (var i = siblings.length - 1; i >= 0; i--) {
      var currentSibling = siblings[i];
      if (equals(elem, currentSibling)) return true;

      if (adapter.isTag(currentSibling) && adapter.getName(currentSibling) === elemName) {
        break;
      }
    }

    return false;
  },
  "only-of-type": function onlyOfType(elem, _ref6) {
    var adapter = _ref6.adapter,
        equals = _ref6.equals;
    var elemName = adapter.getName(elem);
    return adapter.getSiblings(elem).every(function (sibling) {
      return equals(elem, sibling) || !adapter.isTag(sibling) || adapter.getName(sibling) !== elemName;
    });
  },
  "only-child": function onlyChild(elem, _ref7) {
    var adapter = _ref7.adapter,
        equals = _ref7.equals;
    return adapter.getSiblings(elem).every(function (sibling) {
      return equals(elem, sibling) || !adapter.isTag(sibling);
    });
  }
};
function verifyPseudoArgs(func, name, subselect, argIndex) {
  if (subselect === null) {
    if (func.length > argIndex) {
      throw new Error("Pseudo-class :" + name + " requires an argument");
    }
  } else if (func.length === argIndex) {
    throw new Error("Pseudo-class :" + name + " doesn't have any arguments");
  }
}

/***/ }),

/***/ "./node_modules/css-select/lib/esm/pseudo-selectors/subselects.js":
/*!************************************************************************!*\
  !*** ./node_modules/css-select/lib/esm/pseudo-selectors/subselects.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PLACEHOLDER_ELEMENT": () => (/* binding */ PLACEHOLDER_ELEMENT),
/* harmony export */   "ensureIsTag": () => (/* binding */ ensureIsTag),
/* harmony export */   "getNextSiblings": () => (/* binding */ getNextSiblings),
/* harmony export */   "subselects": () => (/* binding */ subselects)
/* harmony export */ });
/* harmony import */ var boolbase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! boolbase */ "./node_modules/boolbase/index.js");
/* harmony import */ var _sort_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sort.js */ "./node_modules/css-select/lib/esm/sort.js");


/** Used as a placeholder for :has. Will be replaced with the actual element. */

var PLACEHOLDER_ELEMENT = {};
function ensureIsTag(next, adapter) {
  if (next === boolbase__WEBPACK_IMPORTED_MODULE_0__.falseFunc) return boolbase__WEBPACK_IMPORTED_MODULE_0__.falseFunc;
  return function (elem) {
    return adapter.isTag(elem) && next(elem);
  };
}
function getNextSiblings(elem, adapter) {
  var siblings = adapter.getSiblings(elem);
  if (siblings.length <= 1) return [];
  var elemIndex = siblings.indexOf(elem);
  if (elemIndex < 0 || elemIndex === siblings.length - 1) return [];
  return siblings.slice(elemIndex + 1).filter(adapter.isTag);
}

function copyOptions(options) {
  // Not copied: context, rootFunc
  return {
    xmlMode: !!options.xmlMode,
    lowerCaseAttributeNames: !!options.lowerCaseAttributeNames,
    lowerCaseTags: !!options.lowerCaseTags,
    quirksMode: !!options.quirksMode,
    cacheResults: !!options.cacheResults,
    pseudos: options.pseudos,
    adapter: options.adapter,
    equals: options.equals
  };
}

var is = function is(next, token, options, context, compileToken) {
  var func = compileToken(token, copyOptions(options), context);
  return func === boolbase__WEBPACK_IMPORTED_MODULE_0__.trueFunc ? next : func === boolbase__WEBPACK_IMPORTED_MODULE_0__.falseFunc ? boolbase__WEBPACK_IMPORTED_MODULE_0__.falseFunc : function (elem) {
    return func(elem) && next(elem);
  };
};
/*
 * :not, :has, :is, :matches and :where have to compile selectors
 * doing this in src/pseudos.ts would lead to circular dependencies,
 * so we add them here
 */


var subselects = {
  is: is,

  /**
   * `:matches` and `:where` are aliases for `:is`.
   */
  matches: is,
  where: is,
  not: function not(next, token, options, context, compileToken) {
    var func = compileToken(token, copyOptions(options), context);
    return func === boolbase__WEBPACK_IMPORTED_MODULE_0__.falseFunc ? next : func === boolbase__WEBPACK_IMPORTED_MODULE_0__.trueFunc ? boolbase__WEBPACK_IMPORTED_MODULE_0__.falseFunc : function (elem) {
      return !func(elem) && next(elem);
    };
  },
  has: function has(next, subselect, options, _context, compileToken) {
    var adapter = options.adapter;
    var opts = copyOptions(options);
    opts.relativeSelector = true;
    var context = subselect.some(function (s) {
      return s.some(_sort_js__WEBPACK_IMPORTED_MODULE_1__.isTraversal);
    }) ? // Used as a placeholder. Will be replaced with the actual element.
    [PLACEHOLDER_ELEMENT] : undefined;
    var compiled = compileToken(subselect, opts, context);
    if (compiled === boolbase__WEBPACK_IMPORTED_MODULE_0__.falseFunc) return boolbase__WEBPACK_IMPORTED_MODULE_0__.falseFunc;
    var hasElement = ensureIsTag(compiled, adapter); // If `compiled` is `trueFunc`, we can skip this.

    if (context && compiled !== boolbase__WEBPACK_IMPORTED_MODULE_0__.trueFunc) {
      /*
       * `shouldTestNextSiblings` will only be true if the query starts with
       * a traversal (sibling or adjacent). That means we will always have a context.
       */
      var _compiled$shouldTestN = compiled.shouldTestNextSiblings,
          shouldTestNextSiblings = _compiled$shouldTestN === void 0 ? false : _compiled$shouldTestN;
      return function (elem) {
        if (!next(elem)) return false;
        context[0] = elem;
        var childs = adapter.getChildren(elem);
        var nextElements = shouldTestNextSiblings ? [].concat(childs, getNextSiblings(elem, adapter)) : childs;
        return adapter.existsOne(hasElement, nextElements);
      };
    }

    return function (elem) {
      return next(elem) && adapter.existsOne(hasElement, adapter.getChildren(elem));
    };
  }
};

/***/ }),

/***/ "./node_modules/css-select/lib/esm/sort.js":
/*!*************************************************!*\
  !*** ./node_modules/css-select/lib/esm/sort.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ sortByProcedure),
/* harmony export */   "isTraversal": () => (/* binding */ isTraversal)
/* harmony export */ });
/* harmony import */ var css_what__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! css-what */ "./node_modules/css-what/lib/es/types.js");

var procedure = new Map([[css_what__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Universal, 50], [css_what__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Tag, 30], [css_what__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Attribute, 1], [css_what__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Pseudo, 0]]);
function isTraversal(token) {
  return !procedure.has(token.type);
}
var attributes = new Map([[css_what__WEBPACK_IMPORTED_MODULE_0__.AttributeAction.Exists, 10], [css_what__WEBPACK_IMPORTED_MODULE_0__.AttributeAction.Equals, 8], [css_what__WEBPACK_IMPORTED_MODULE_0__.AttributeAction.Not, 7], [css_what__WEBPACK_IMPORTED_MODULE_0__.AttributeAction.Start, 6], [css_what__WEBPACK_IMPORTED_MODULE_0__.AttributeAction.End, 6], [css_what__WEBPACK_IMPORTED_MODULE_0__.AttributeAction.Any, 5]]);
/**
 * Sort the parts of the passed selector,
 * as there is potential for optimization
 * (some types of selectors are faster than others)
 *
 * @param arr Selector to sort
 */

function sortByProcedure(arr) {
  var procs = arr.map(getProcedure);

  for (var i = 1; i < arr.length; i++) {
    var procNew = procs[i];
    if (procNew < 0) continue;

    for (var j = i - 1; j >= 0 && procNew < procs[j]; j--) {
      var token = arr[j + 1];
      arr[j + 1] = arr[j];
      arr[j] = token;
      procs[j + 1] = procs[j];
      procs[j] = procNew;
    }
  }
}

function getProcedure(token) {
  var _a, _b;

  var proc = (_a = procedure.get(token.type)) !== null && _a !== void 0 ? _a : -1;

  if (token.type === css_what__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Attribute) {
    proc = (_b = attributes.get(token.action)) !== null && _b !== void 0 ? _b : 4;

    if (token.action === css_what__WEBPACK_IMPORTED_MODULE_0__.AttributeAction.Equals && token.name === "id") {
      // Prefer ID selectors (eg. #ID)
      proc = 9;
    }

    if (token.ignoreCase) {
      /*
       * IgnoreCase adds some overhead, prefer "normal" token
       * this is a binary operation, to ensure it's still an int
       */
      proc >>= 1;
    }
  } else if (token.type === css_what__WEBPACK_IMPORTED_MODULE_0__.SelectorType.Pseudo) {
    if (!token.data) {
      proc = 3;
    } else if (token.name === "has" || token.name === "contains") {
      proc = 0; // Expensive in any case
    } else if (Array.isArray(token.data)) {
      // Eg. :matches, :not
      proc = Math.min.apply(Math, token.data.map(function (d) {
        return Math.min.apply(Math, d.map(getProcedure));
      })); // If we have traversals, try to avoid executing this selector

      if (proc < 0) {
        proc = 0;
      }
    } else {
      proc = 2;
    }
  }

  return proc;
}

/***/ }),

/***/ "./node_modules/dom-serializer/lib/esm/foreignNames.js":
/*!*************************************************************!*\
  !*** ./node_modules/dom-serializer/lib/esm/foreignNames.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "attributeNames": () => (/* binding */ attributeNames),
/* harmony export */   "elementNames": () => (/* binding */ elementNames)
/* harmony export */ });
var elementNames = new Map(["altGlyph", "altGlyphDef", "altGlyphItem", "animateColor", "animateMotion", "animateTransform", "clipPath", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "foreignObject", "glyphRef", "linearGradient", "radialGradient", "textPath"].map(function (val) {
  return [val.toLowerCase(), val];
}));
var attributeNames = new Map(["definitionURL", "attributeName", "attributeType", "baseFrequency", "baseProfile", "calcMode", "clipPathUnits", "diffuseConstant", "edgeMode", "filterUnits", "glyphRef", "gradientTransform", "gradientUnits", "kernelMatrix", "kernelUnitLength", "keyPoints", "keySplines", "keyTimes", "lengthAdjust", "limitingConeAngle", "markerHeight", "markerUnits", "markerWidth", "maskContentUnits", "maskUnits", "numOctaves", "pathLength", "patternContentUnits", "patternTransform", "patternUnits", "pointsAtX", "pointsAtY", "pointsAtZ", "preserveAlpha", "preserveAspectRatio", "primitiveUnits", "refX", "refY", "repeatCount", "repeatDur", "requiredExtensions", "requiredFeatures", "specularConstant", "specularExponent", "spreadMethod", "startOffset", "stdDeviation", "stitchTiles", "surfaceScale", "systemLanguage", "tableValues", "targetX", "targetY", "textLength", "viewBox", "viewTarget", "xChannelSelector", "yChannelSelector", "zoomAndPan"].map(function (val) {
  return [val.toLowerCase(), val];
}));

/***/ }),

/***/ "./node_modules/dom-serializer/lib/esm/index.js":
/*!******************************************************!*\
  !*** ./node_modules/dom-serializer/lib/esm/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var domelementtype__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! domelementtype */ "./node_modules/domelementtype/lib/esm/index.js");
/* harmony import */ var entities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! entities */ "./node_modules/entities/lib/esm/index.js");
/* harmony import */ var _foreignNames_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./foreignNames.js */ "./node_modules/dom-serializer/lib/esm/foreignNames.js");


/*
 * Module dependencies
 */


/**
 * Mixed-case SVG and MathML tags & attributes
 * recognized by the HTML parser.
 *
 * @see https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inforeign
 */


var unencodedElements = new Set(["style", "script", "xmp", "iframe", "noembed", "noframes", "plaintext", "noscript"]);

function replaceQuotes(value) {
  return value.replace(/"/g, "&quot;");
}
/**
 * Format attributes
 */


function formatAttributes(attributes, opts) {
  var _a;

  if (!attributes) return;
  var encode = ((_a = opts.encodeEntities) !== null && _a !== void 0 ? _a : opts.decodeEntities) === false ? replaceQuotes : opts.xmlMode || opts.encodeEntities !== "utf8" ? entities__WEBPACK_IMPORTED_MODULE_2__.encodeXML : entities__WEBPACK_IMPORTED_MODULE_2__.escapeAttribute;
  return Object.keys(attributes).map(function (key) {
    var _a, _b;

    var value = (_a = attributes[key]) !== null && _a !== void 0 ? _a : "";

    if (opts.xmlMode === "foreign") {
      /* Fix up mixed-case attribute names */
      key = (_b = _foreignNames_js__WEBPACK_IMPORTED_MODULE_3__.attributeNames.get(key)) !== null && _b !== void 0 ? _b : key;
    }

    if (!opts.emptyAttrs && !opts.xmlMode && value === "") {
      return key;
    }

    return key + "=\"" + encode(value) + "\"";
  }).join(" ");
}
/**
 * Self-enclosing tags
 */


var singleTag = new Set(["area", "base", "basefont", "br", "col", "command", "embed", "frame", "hr", "img", "input", "isindex", "keygen", "link", "meta", "param", "source", "track", "wbr"]);
/**
 * Renders a DOM node or an array of DOM nodes to a string.
 *
 * Can be thought of as the equivalent of the `outerHTML` of the passed node(s).
 *
 * @param node Node to be rendered.
 * @param options Changes serialization behavior
 */

function render(node, options) {
  if (options === void 0) {
    options = {};
  }

  var nodes = "length" in node ? node : [node];
  var output = "";

  for (var i = 0; i < nodes.length; i++) {
    output += renderNode(nodes[i], options);
  }

  return output;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (render);

function renderNode(node, options) {
  switch (node.type) {
    case domelementtype__WEBPACK_IMPORTED_MODULE_1__.Root:
      return render(node.children, options);
    // @ts-expect-error We don't use `Doctype` yet

    case domelementtype__WEBPACK_IMPORTED_MODULE_1__.Doctype:
    case domelementtype__WEBPACK_IMPORTED_MODULE_1__.Directive:
      return renderDirective(node);

    case domelementtype__WEBPACK_IMPORTED_MODULE_1__.Comment:
      return renderComment(node);

    case domelementtype__WEBPACK_IMPORTED_MODULE_1__.CDATA:
      return renderCdata(node);

    case domelementtype__WEBPACK_IMPORTED_MODULE_1__.Script:
    case domelementtype__WEBPACK_IMPORTED_MODULE_1__.Style:
    case domelementtype__WEBPACK_IMPORTED_MODULE_1__.Tag:
      return renderTag(node, options);

    case domelementtype__WEBPACK_IMPORTED_MODULE_1__.Text:
      return renderText(node, options);
  }
}

var foreignModeIntegrationPoints = new Set(["mi", "mo", "mn", "ms", "mtext", "annotation-xml", "foreignObject", "desc", "title"]);
var foreignElements = new Set(["svg", "math"]);

function renderTag(elem, opts) {
  var _a; // Handle SVG / MathML in HTML


  if (opts.xmlMode === "foreign") {
    /* Fix up mixed-case element names */
    elem.name = (_a = _foreignNames_js__WEBPACK_IMPORTED_MODULE_3__.elementNames.get(elem.name)) !== null && _a !== void 0 ? _a : elem.name;
    /* Exit foreign mode at integration points */

    if (elem.parent && foreignModeIntegrationPoints.has(elem.parent.name)) {
      opts = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, opts, {
        xmlMode: false
      });
    }
  }

  if (!opts.xmlMode && foreignElements.has(elem.name)) {
    opts = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, opts, {
      xmlMode: "foreign"
    });
  }

  var tag = "<" + elem.name;
  var attribs = formatAttributes(elem.attribs, opts);

  if (attribs) {
    tag += " " + attribs;
  }

  if (elem.children.length === 0 && (opts.xmlMode ? // In XML mode or foreign mode, and user hasn't explicitly turned off self-closing tags
  opts.selfClosingTags !== false : // User explicitly asked for self-closing tags, even in HTML mode
  opts.selfClosingTags && singleTag.has(elem.name))) {
    if (!opts.xmlMode) tag += " ";
    tag += "/>";
  } else {
    tag += ">";

    if (elem.children.length > 0) {
      tag += render(elem.children, opts);
    }

    if (opts.xmlMode || !singleTag.has(elem.name)) {
      tag += "</" + elem.name + ">";
    }
  }

  return tag;
}

function renderDirective(elem) {
  return "<" + elem.data + ">";
}

function renderText(elem, opts) {
  var _a;

  var data = elem.data || ""; // If entities weren't decoded, no need to encode them back

  if (((_a = opts.encodeEntities) !== null && _a !== void 0 ? _a : opts.decodeEntities) !== false && !(!opts.xmlMode && elem.parent && unencodedElements.has(elem.parent.name))) {
    data = opts.xmlMode || opts.encodeEntities !== "utf8" ? (0,entities__WEBPACK_IMPORTED_MODULE_2__.encodeXML)(data) : (0,entities__WEBPACK_IMPORTED_MODULE_2__.escapeText)(data);
  }

  return data;
}

function renderCdata(elem) {
  return "<![CDATA[" + elem.children[0].data + "]]>";
}

function renderComment(elem) {
  return "<!--" + elem.data + "-->";
}

/***/ }),

/***/ "./node_modules/domelementtype/lib/esm/index.js":
/*!******************************************************!*\
  !*** ./node_modules/domelementtype/lib/esm/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CDATA": () => (/* binding */ CDATA),
/* harmony export */   "Comment": () => (/* binding */ Comment),
/* harmony export */   "Directive": () => (/* binding */ Directive),
/* harmony export */   "Doctype": () => (/* binding */ Doctype),
/* harmony export */   "ElementType": () => (/* binding */ ElementType),
/* harmony export */   "Root": () => (/* binding */ Root),
/* harmony export */   "Script": () => (/* binding */ Script),
/* harmony export */   "Style": () => (/* binding */ Style),
/* harmony export */   "Tag": () => (/* binding */ Tag),
/* harmony export */   "Text": () => (/* binding */ Text),
/* harmony export */   "isTag": () => (/* binding */ isTag)
/* harmony export */ });
/** Types of elements found in htmlparser2's DOM */
var ElementType;

(function (ElementType) {
  /** Type for the root element of a document */
  ElementType["Root"] = "root";
  /** Type for Text */

  ElementType["Text"] = "text";
  /** Type for <? ... ?> */

  ElementType["Directive"] = "directive";
  /** Type for <!-- ... --> */

  ElementType["Comment"] = "comment";
  /** Type for <script> tags */

  ElementType["Script"] = "script";
  /** Type for <style> tags */

  ElementType["Style"] = "style";
  /** Type for Any tag */

  ElementType["Tag"] = "tag";
  /** Type for <![CDATA[ ... ]]> */

  ElementType["CDATA"] = "cdata";
  /** Type for <!doctype ...> */

  ElementType["Doctype"] = "doctype";
})(ElementType || (ElementType = {}));
/**
 * Tests whether an element is a tag or not.
 *
 * @param elem Element to test
 */


function isTag(elem) {
  return elem.type === ElementType.Tag || elem.type === ElementType.Script || elem.type === ElementType.Style;
} // Exports for backwards compatibility

/** Type for the root element of a document */

var Root = ElementType.Root;
/** Type for Text */

var Text = ElementType.Text;
/** Type for <? ... ?> */

var Directive = ElementType.Directive;
/** Type for <!-- ... --> */

var Comment = ElementType.Comment;
/** Type for <script> tags */

var Script = ElementType.Script;
/** Type for <style> tags */

var Style = ElementType.Style;
/** Type for Any tag */

var Tag = ElementType.Tag;
/** Type for <![CDATA[ ... ]]> */

var CDATA = ElementType.CDATA;
/** Type for <!doctype ...> */

var Doctype = ElementType.Doctype;

/***/ }),

/***/ "./node_modules/domhandler/lib/esm/index.js":
/*!**************************************************!*\
  !*** ./node_modules/domhandler/lib/esm/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CDATA": () => (/* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.CDATA),
/* harmony export */   "Comment": () => (/* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.Comment),
/* harmony export */   "DataNode": () => (/* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.DataNode),
/* harmony export */   "Document": () => (/* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.Document),
/* harmony export */   "DomHandler": () => (/* binding */ DomHandler),
/* harmony export */   "Element": () => (/* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.Element),
/* harmony export */   "Node": () => (/* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.Node),
/* harmony export */   "NodeWithChildren": () => (/* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.NodeWithChildren),
/* harmony export */   "ProcessingInstruction": () => (/* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.ProcessingInstruction),
/* harmony export */   "Text": () => (/* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.Text),
/* harmony export */   "cloneNode": () => (/* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.cloneNode),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "hasChildren": () => (/* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.hasChildren),
/* harmony export */   "isCDATA": () => (/* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.isCDATA),
/* harmony export */   "isComment": () => (/* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.isComment),
/* harmony export */   "isDirective": () => (/* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.isDirective),
/* harmony export */   "isDocument": () => (/* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.isDocument),
/* harmony export */   "isTag": () => (/* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.isTag),
/* harmony export */   "isText": () => (/* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_1__.isText)
/* harmony export */ });
/* harmony import */ var domelementtype__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelementtype */ "./node_modules/domelementtype/lib/esm/index.js");
/* harmony import */ var _node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node.js */ "./node_modules/domhandler/lib/esm/node.js");


 // Default options

var defaultOpts = {
  withStartIndices: false,
  withEndIndices: false,
  xmlMode: false
};
var DomHandler = /*#__PURE__*/function () {
  /**
   * @param callback Called once parsing has completed.
   * @param options Settings for the handler.
   * @param elementCB Callback whenever a tag is closed.
   */
  function DomHandler(callback, options, elementCB) {
    /** The elements of the DOM */
    this.dom = [];
    /** The root element for the DOM */

    this.root = new _node_js__WEBPACK_IMPORTED_MODULE_1__.Document(this.dom);
    /** Indicated whether parsing has been completed. */

    this.done = false;
    /** Stack of open tags. */

    this.tagStack = [this.root];
    /** A data node that is still being written to. */

    this.lastNode = null;
    /** Reference to the parser instance. Used for location information. */

    this.parser = null; // Make it possible to skip arguments, for backwards-compatibility

    if (typeof options === "function") {
      elementCB = options;
      options = defaultOpts;
    }

    if (typeof callback === "object") {
      options = callback;
      callback = undefined;
    }

    this.callback = callback !== null && callback !== void 0 ? callback : null;
    this.options = options !== null && options !== void 0 ? options : defaultOpts;
    this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
  }

  var _proto = DomHandler.prototype;

  _proto.onparserinit = function onparserinit(parser) {
    this.parser = parser;
  } // Resets the handler back to starting state
  ;

  _proto.onreset = function onreset() {
    this.dom = [];
    this.root = new _node_js__WEBPACK_IMPORTED_MODULE_1__.Document(this.dom);
    this.done = false;
    this.tagStack = [this.root];
    this.lastNode = null;
    this.parser = null;
  } // Signals the handler that parsing is done
  ;

  _proto.onend = function onend() {
    if (this.done) return;
    this.done = true;
    this.parser = null;
    this.handleCallback(null);
  };

  _proto.onerror = function onerror(error) {
    this.handleCallback(error);
  };

  _proto.onclosetag = function onclosetag() {
    this.lastNode = null;
    var elem = this.tagStack.pop();

    if (this.options.withEndIndices) {
      elem.endIndex = this.parser.endIndex;
    }

    if (this.elementCB) this.elementCB(elem);
  };

  _proto.onopentag = function onopentag(name, attribs) {
    var type = this.options.xmlMode ? domelementtype__WEBPACK_IMPORTED_MODULE_0__.ElementType.Tag : undefined;
    var element = new _node_js__WEBPACK_IMPORTED_MODULE_1__.Element(name, attribs, undefined, type);
    this.addNode(element);
    this.tagStack.push(element);
  };

  _proto.ontext = function ontext(data) {
    var lastNode = this.lastNode;

    if (lastNode && lastNode.type === domelementtype__WEBPACK_IMPORTED_MODULE_0__.ElementType.Text) {
      lastNode.data += data;

      if (this.options.withEndIndices) {
        lastNode.endIndex = this.parser.endIndex;
      }
    } else {
      var node = new _node_js__WEBPACK_IMPORTED_MODULE_1__.Text(data);
      this.addNode(node);
      this.lastNode = node;
    }
  };

  _proto.oncomment = function oncomment(data) {
    if (this.lastNode && this.lastNode.type === domelementtype__WEBPACK_IMPORTED_MODULE_0__.ElementType.Comment) {
      this.lastNode.data += data;
      return;
    }

    var node = new _node_js__WEBPACK_IMPORTED_MODULE_1__.Comment(data);
    this.addNode(node);
    this.lastNode = node;
  };

  _proto.oncommentend = function oncommentend() {
    this.lastNode = null;
  };

  _proto.oncdatastart = function oncdatastart() {
    var text = new _node_js__WEBPACK_IMPORTED_MODULE_1__.Text("");
    var node = new _node_js__WEBPACK_IMPORTED_MODULE_1__.CDATA([text]);
    this.addNode(node);
    text.parent = node;
    this.lastNode = text;
  };

  _proto.oncdataend = function oncdataend() {
    this.lastNode = null;
  };

  _proto.onprocessinginstruction = function onprocessinginstruction(name, data) {
    var node = new _node_js__WEBPACK_IMPORTED_MODULE_1__.ProcessingInstruction(name, data);
    this.addNode(node);
  };

  _proto.handleCallback = function handleCallback(error) {
    if (typeof this.callback === "function") {
      this.callback(error, this.dom);
    } else if (error) {
      throw error;
    }
  };

  _proto.addNode = function addNode(node) {
    var parent = this.tagStack[this.tagStack.length - 1];
    var previousSibling = parent.children[parent.children.length - 1];

    if (this.options.withStartIndices) {
      node.startIndex = this.parser.startIndex;
    }

    if (this.options.withEndIndices) {
      node.endIndex = this.parser.endIndex;
    }

    parent.children.push(node);

    if (previousSibling) {
      node.prev = previousSibling;
      previousSibling.next = node;
    }

    node.parent = parent;
    this.lastNode = null;
  };

  return DomHandler;
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DomHandler);

/***/ }),

/***/ "./node_modules/domhandler/lib/esm/node.js":
/*!*************************************************!*\
  !*** ./node_modules/domhandler/lib/esm/node.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CDATA": () => (/* binding */ CDATA),
/* harmony export */   "Comment": () => (/* binding */ Comment),
/* harmony export */   "DataNode": () => (/* binding */ DataNode),
/* harmony export */   "Document": () => (/* binding */ Document),
/* harmony export */   "Element": () => (/* binding */ Element),
/* harmony export */   "Node": () => (/* binding */ Node),
/* harmony export */   "NodeWithChildren": () => (/* binding */ NodeWithChildren),
/* harmony export */   "ProcessingInstruction": () => (/* binding */ ProcessingInstruction),
/* harmony export */   "Text": () => (/* binding */ Text),
/* harmony export */   "cloneNode": () => (/* binding */ _cloneNode),
/* harmony export */   "hasChildren": () => (/* binding */ hasChildren),
/* harmony export */   "isCDATA": () => (/* binding */ isCDATA),
/* harmony export */   "isComment": () => (/* binding */ isComment),
/* harmony export */   "isDirective": () => (/* binding */ isDirective),
/* harmony export */   "isDocument": () => (/* binding */ isDocument),
/* harmony export */   "isTag": () => (/* binding */ isTag),
/* harmony export */   "isText": () => (/* binding */ isText)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var domelementtype__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! domelementtype */ "./node_modules/domelementtype/lib/esm/index.js");




/**
 * This object will be used as the prototype for Nodes when creating a
 * DOM-Level-1-compliant structure.
 */

var Node = /*#__PURE__*/function () {
  function Node() {
    /** Parent of the node */
    this.parent = null;
    /** Previous sibling */

    this.prev = null;
    /** Next sibling */

    this.next = null;
    /** The start index of the node. Requires `withStartIndices` on the handler to be `true. */

    this.startIndex = null;
    /** The end index of the node. Requires `withEndIndices` on the handler to be `true. */

    this.endIndex = null;
  } // Read-write aliases for properties

  /**
   * Same as {@link parent}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */


  var _proto = Node.prototype;

  /**
   * Clone this node, and optionally its children.
   *
   * @param recursive Clone child nodes as well.
   * @returns A clone of the node.
   */
  _proto.cloneNode = function cloneNode(recursive) {
    if (recursive === void 0) {
      recursive = false;
    }

    return _cloneNode(this, recursive);
  };

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(Node, [{
    key: "parentNode",
    get: function get() {
      return this.parent;
    },
    set: function set(parent) {
      this.parent = parent;
    }
    /**
     * Same as {@link prev}.
     * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
     */

  }, {
    key: "previousSibling",
    get: function get() {
      return this.prev;
    },
    set: function set(prev) {
      this.prev = prev;
    }
    /**
     * Same as {@link next}.
     * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
     */

  }, {
    key: "nextSibling",
    get: function get() {
      return this.next;
    },
    set: function set(next) {
      this.next = next;
    }
  }]);

  return Node;
}();
/**
 * A node that contains some data.
 */

var DataNode = /*#__PURE__*/function (_Node) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(DataNode, _Node);

  /**
   * @param data The content of the data node
   */
  function DataNode(data) {
    var _this;

    _this = _Node.call(this) || this;
    _this.data = data;
    return _this;
  }
  /**
   * Same as {@link data}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */


  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(DataNode, [{
    key: "nodeValue",
    get: function get() {
      return this.data;
    },
    set: function set(data) {
      this.data = data;
    }
  }]);

  return DataNode;
}(Node);
/**
 * Text within the document.
 */

var Text = /*#__PURE__*/function (_DataNode) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(Text, _DataNode);

  function Text() {
    var _this2;

    _this2 = _DataNode.apply(this, arguments) || this;
    _this2.type = domelementtype__WEBPACK_IMPORTED_MODULE_3__.ElementType.Text;
    return _this2;
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(Text, [{
    key: "nodeType",
    get: function get() {
      return 3;
    }
  }]);

  return Text;
}(DataNode);
/**
 * Comments within the document.
 */

var Comment = /*#__PURE__*/function (_DataNode2) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(Comment, _DataNode2);

  function Comment() {
    var _this3;

    _this3 = _DataNode2.apply(this, arguments) || this;
    _this3.type = domelementtype__WEBPACK_IMPORTED_MODULE_3__.ElementType.Comment;
    return _this3;
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(Comment, [{
    key: "nodeType",
    get: function get() {
      return 8;
    }
  }]);

  return Comment;
}(DataNode);
/**
 * Processing instructions, including doc types.
 */

var ProcessingInstruction = /*#__PURE__*/function (_DataNode3) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(ProcessingInstruction, _DataNode3);

  function ProcessingInstruction(name, data) {
    var _this4;

    _this4 = _DataNode3.call(this, data) || this;
    _this4.name = name;
    _this4.type = domelementtype__WEBPACK_IMPORTED_MODULE_3__.ElementType.Directive;
    return _this4;
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(ProcessingInstruction, [{
    key: "nodeType",
    get: function get() {
      return 1;
    }
  }]);

  return ProcessingInstruction;
}(DataNode);
/**
 * A `Node` that can have children.
 */

var NodeWithChildren = /*#__PURE__*/function (_Node2) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(NodeWithChildren, _Node2);

  /**
   * @param children Children of the node. Only certain node types can have children.
   */
  function NodeWithChildren(children) {
    var _this5;

    _this5 = _Node2.call(this) || this;
    _this5.children = children;
    return _this5;
  } // Aliases

  /** First child of the node. */


  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(NodeWithChildren, [{
    key: "firstChild",
    get: function get() {
      var _a;

      return (_a = this.children[0]) !== null && _a !== void 0 ? _a : null;
    }
    /** Last child of the node. */

  }, {
    key: "lastChild",
    get: function get() {
      return this.children.length > 0 ? this.children[this.children.length - 1] : null;
    }
    /**
     * Same as {@link children}.
     * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
     */

  }, {
    key: "childNodes",
    get: function get() {
      return this.children;
    },
    set: function set(children) {
      this.children = children;
    }
  }]);

  return NodeWithChildren;
}(Node);
var CDATA = /*#__PURE__*/function (_NodeWithChildren) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(CDATA, _NodeWithChildren);

  function CDATA() {
    var _this6;

    _this6 = _NodeWithChildren.apply(this, arguments) || this;
    _this6.type = domelementtype__WEBPACK_IMPORTED_MODULE_3__.ElementType.CDATA;
    return _this6;
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(CDATA, [{
    key: "nodeType",
    get: function get() {
      return 4;
    }
  }]);

  return CDATA;
}(NodeWithChildren);
/**
 * The root node of the document.
 */

var Document = /*#__PURE__*/function (_NodeWithChildren2) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(Document, _NodeWithChildren2);

  function Document() {
    var _this7;

    _this7 = _NodeWithChildren2.apply(this, arguments) || this;
    _this7.type = domelementtype__WEBPACK_IMPORTED_MODULE_3__.ElementType.Root;
    return _this7;
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(Document, [{
    key: "nodeType",
    get: function get() {
      return 9;
    }
  }]);

  return Document;
}(NodeWithChildren);
/**
 * An element within the DOM.
 */

var Element = /*#__PURE__*/function (_NodeWithChildren3) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(Element, _NodeWithChildren3);

  /**
   * @param name Name of the tag, eg. `div`, `span`.
   * @param attribs Object mapping attribute names to attribute values.
   * @param children Children of the node.
   */
  function Element(name, attribs, children, type) {
    var _this8;

    if (children === void 0) {
      children = [];
    }

    if (type === void 0) {
      type = name === "script" ? domelementtype__WEBPACK_IMPORTED_MODULE_3__.ElementType.Script : name === "style" ? domelementtype__WEBPACK_IMPORTED_MODULE_3__.ElementType.Style : domelementtype__WEBPACK_IMPORTED_MODULE_3__.ElementType.Tag;
    }

    _this8 = _NodeWithChildren3.call(this, children) || this;
    _this8.name = name;
    _this8.attribs = attribs;
    _this8.type = type;
    return _this8;
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(Element, [{
    key: "nodeType",
    get: function get() {
      return 1;
    } // DOM Level 1 aliases

    /**
     * Same as {@link name}.
     * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
     */

  }, {
    key: "tagName",
    get: function get() {
      return this.name;
    },
    set: function set(name) {
      this.name = name;
    }
  }, {
    key: "attributes",
    get: function get() {
      var _this9 = this;

      return Object.keys(this.attribs).map(function (name) {
        var _a, _b;

        return {
          name: name,
          value: _this9.attribs[name],
          namespace: (_a = _this9["x-attribsNamespace"]) === null || _a === void 0 ? void 0 : _a[name],
          prefix: (_b = _this9["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name]
        };
      });
    }
  }]);

  return Element;
}(NodeWithChildren);
/**
 * @param node Node to check.
 * @returns `true` if the node is a `Element`, `false` otherwise.
 */

function isTag(node) {
  return (0,domelementtype__WEBPACK_IMPORTED_MODULE_3__.isTag)(node);
}
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `CDATA`, `false` otherwise.
 */

function isCDATA(node) {
  return node.type === domelementtype__WEBPACK_IMPORTED_MODULE_3__.ElementType.CDATA;
}
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `Text`, `false` otherwise.
 */

function isText(node) {
  return node.type === domelementtype__WEBPACK_IMPORTED_MODULE_3__.ElementType.Text;
}
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `Comment`, `false` otherwise.
 */

function isComment(node) {
  return node.type === domelementtype__WEBPACK_IMPORTED_MODULE_3__.ElementType.Comment;
}
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
 */

function isDirective(node) {
  return node.type === domelementtype__WEBPACK_IMPORTED_MODULE_3__.ElementType.Directive;
}
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
 */

function isDocument(node) {
  return node.type === domelementtype__WEBPACK_IMPORTED_MODULE_3__.ElementType.Root;
}
/**
 * @param node Node to check.
 * @returns `true` if the node has children, `false` otherwise.
 */

function hasChildren(node) {
  return Object.prototype.hasOwnProperty.call(node, "children");
}
/**
 * Clone a node, and optionally its children.
 *
 * @param recursive Clone child nodes as well.
 * @returns A clone of the node.
 */

function _cloneNode(node, recursive) {
  if (recursive === void 0) {
    recursive = false;
  }

  var result;

  if (isText(node)) {
    result = new Text(node.data);
  } else if (isComment(node)) {
    result = new Comment(node.data);
  } else if (isTag(node)) {
    var children = recursive ? cloneChildren(node.children) : [];
    var clone = new Element(node.name, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, node.attribs), children);
    children.forEach(function (child) {
      return child.parent = clone;
    });

    if (node.namespace != null) {
      clone.namespace = node.namespace;
    }

    if (node["x-attribsNamespace"]) {
      clone["x-attribsNamespace"] = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, node["x-attribsNamespace"]);
    }

    if (node["x-attribsPrefix"]) {
      clone["x-attribsPrefix"] = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, node["x-attribsPrefix"]);
    }

    result = clone;
  } else if (isCDATA(node)) {
    var _children = recursive ? cloneChildren(node.children) : [];

    var _clone = new CDATA(_children);

    _children.forEach(function (child) {
      return child.parent = _clone;
    });

    result = _clone;
  } else if (isDocument(node)) {
    var _children2 = recursive ? cloneChildren(node.children) : [];

    var _clone2 = new Document(_children2);

    _children2.forEach(function (child) {
      return child.parent = _clone2;
    });

    if (node["x-mode"]) {
      _clone2["x-mode"] = node["x-mode"];
    }

    result = _clone2;
  } else if (isDirective(node)) {
    var instruction = new ProcessingInstruction(node.name, node.data);

    if (node["x-name"] != null) {
      instruction["x-name"] = node["x-name"];
      instruction["x-publicId"] = node["x-publicId"];
      instruction["x-systemId"] = node["x-systemId"];
    }

    result = instruction;
  } else {
    throw new Error("Not implemented yet: " + node.type);
  }

  result.startIndex = node.startIndex;
  result.endIndex = node.endIndex;

  if (node.sourceCodeLocation != null) {
    result.sourceCodeLocation = node.sourceCodeLocation;
  }

  return result;
}



function cloneChildren(childs) {
  var children = childs.map(function (child) {
    return _cloneNode(child, true);
  });

  for (var i = 1; i < children.length; i++) {
    children[i].prev = children[i - 1];
    children[i - 1].next = children[i];
  }

  return children;
}

/***/ }),

/***/ "./node_modules/domutils/lib/esm/feeds.js":
/*!************************************************!*\
  !*** ./node_modules/domutils/lib/esm/feeds.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getFeed": () => (/* binding */ getFeed)
/* harmony export */ });
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/domutils/lib/esm/stringify.js");
/* harmony import */ var _legacy_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./legacy.js */ "./node_modules/domutils/lib/esm/legacy.js");
function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



/**
 * Get the feed object from the root of a DOM tree.
 *
 * @category Feeds
 * @param doc - The DOM to to extract the feed from.
 * @returns The feed.
 */

function getFeed(doc) {
  var feedRoot = getOneElement(isValidFeed, doc);
  return !feedRoot ? null : feedRoot.name === "feed" ? getAtomFeed(feedRoot) : getRssFeed(feedRoot);
}
/**
 * Parse an Atom feed.
 *
 * @param feedRoot The root of the feed.
 * @returns The parsed feed.
 */

function getAtomFeed(feedRoot) {
  var _a;

  var childs = feedRoot.children;
  var feed = {
    type: "atom",
    items: (0,_legacy_js__WEBPACK_IMPORTED_MODULE_1__.getElementsByTagName)("entry", childs).map(function (item) {
      var _a;

      var children = item.children;
      var entry = {
        media: getMediaElements(children)
      };
      addConditionally(entry, "id", "id", children);
      addConditionally(entry, "title", "title", children);
      var href = (_a = getOneElement("link", children)) === null || _a === void 0 ? void 0 : _a.attribs["href"];

      if (href) {
        entry.link = href;
      }

      var description = fetch("summary", children) || fetch("content", children);

      if (description) {
        entry.description = description;
      }

      var pubDate = fetch("updated", children);

      if (pubDate) {
        entry.pubDate = new Date(pubDate);
      }

      return entry;
    })
  };
  addConditionally(feed, "id", "id", childs);
  addConditionally(feed, "title", "title", childs);
  var href = (_a = getOneElement("link", childs)) === null || _a === void 0 ? void 0 : _a.attribs["href"];

  if (href) {
    feed.link = href;
  }

  addConditionally(feed, "description", "subtitle", childs);
  var updated = fetch("updated", childs);

  if (updated) {
    feed.updated = new Date(updated);
  }

  addConditionally(feed, "author", "email", childs, true);
  return feed;
}
/**
 * Parse a RSS feed.
 *
 * @param feedRoot The root of the feed.
 * @returns The parsed feed.
 */


function getRssFeed(feedRoot) {
  var _a, _b;

  var childs = (_b = (_a = getOneElement("channel", feedRoot.children)) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : [];
  var feed = {
    type: feedRoot.name.substr(0, 3),
    id: "",
    items: (0,_legacy_js__WEBPACK_IMPORTED_MODULE_1__.getElementsByTagName)("item", feedRoot.children).map(function (item) {
      var children = item.children;
      var entry = {
        media: getMediaElements(children)
      };
      addConditionally(entry, "id", "guid", children);
      addConditionally(entry, "title", "title", children);
      addConditionally(entry, "link", "link", children);
      addConditionally(entry, "description", "description", children);
      var pubDate = fetch("pubDate", children);
      if (pubDate) entry.pubDate = new Date(pubDate);
      return entry;
    })
  };
  addConditionally(feed, "title", "title", childs);
  addConditionally(feed, "link", "link", childs);
  addConditionally(feed, "description", "description", childs);
  var updated = fetch("lastBuildDate", childs);

  if (updated) {
    feed.updated = new Date(updated);
  }

  addConditionally(feed, "author", "managingEditor", childs, true);
  return feed;
}

var MEDIA_KEYS_STRING = ["url", "type", "lang"];
var MEDIA_KEYS_INT = ["fileSize", "bitrate", "framerate", "samplingrate", "channels", "duration", "height", "width"];
/**
 * Get all media elements of a feed item.
 *
 * @param where Nodes to search in.
 * @returns Media elements.
 */

function getMediaElements(where) {
  return (0,_legacy_js__WEBPACK_IMPORTED_MODULE_1__.getElementsByTagName)("media:content", where).map(function (elem) {
    var attribs = elem.attribs;
    var media = {
      medium: attribs["medium"],
      isDefault: !!attribs["isDefault"]
    };

    for (var _iterator = _createForOfIteratorHelperLoose(MEDIA_KEYS_STRING), _step; !(_step = _iterator()).done;) {
      var attrib = _step.value;

      if (attribs[attrib]) {
        media[attrib] = attribs[attrib];
      }
    }

    for (var _iterator2 = _createForOfIteratorHelperLoose(MEDIA_KEYS_INT), _step2; !(_step2 = _iterator2()).done;) {
      var _attrib = _step2.value;

      if (attribs[_attrib]) {
        media[_attrib] = parseInt(attribs[_attrib], 10);
      }
    }

    if (attribs["expression"]) {
      media.expression = attribs["expression"];
    }

    return media;
  });
}
/**
 * Get one element by tag name.
 *
 * @param tagName Tag name to look for
 * @param node Node to search in
 * @returns The element or null
 */


function getOneElement(tagName, node) {
  return (0,_legacy_js__WEBPACK_IMPORTED_MODULE_1__.getElementsByTagName)(tagName, node, true, 1)[0];
}
/**
 * Get the text content of an element with a certain tag name.
 *
 * @param tagName Tag name to look for.
 * @param where Node to search in.
 * @param recurse Whether to recurse into child nodes.
 * @returns The text content of the element.
 */


function fetch(tagName, where, recurse) {
  if (recurse === void 0) {
    recurse = false;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_0__.textContent)((0,_legacy_js__WEBPACK_IMPORTED_MODULE_1__.getElementsByTagName)(tagName, where, recurse, 1)).trim();
}
/**
 * Adds a property to an object if it has a value.
 *
 * @param obj Object to be extended
 * @param prop Property name
 * @param tagName Tag name that contains the conditionally added property
 * @param where Element to search for the property
 * @param recurse Whether to recurse into child nodes.
 */


function addConditionally(obj, prop, tagName, where, recurse) {
  if (recurse === void 0) {
    recurse = false;
  }

  var val = fetch(tagName, where, recurse);
  if (val) obj[prop] = val;
}
/**
 * Checks if an element is a feed root node.
 *
 * @param value The name of the element to check.
 * @returns Whether an element is a feed root node.
 */


function isValidFeed(value) {
  return value === "rss" || value === "feed" || value === "rdf:RDF";
}

/***/ }),

/***/ "./node_modules/domutils/lib/esm/helpers.js":
/*!**************************************************!*\
  !*** ./node_modules/domutils/lib/esm/helpers.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DocumentPosition": () => (/* binding */ DocumentPosition),
/* harmony export */   "compareDocumentPosition": () => (/* binding */ compareDocumentPosition),
/* harmony export */   "removeSubsets": () => (/* binding */ removeSubsets),
/* harmony export */   "uniqueSort": () => (/* binding */ uniqueSort)
/* harmony export */ });
/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/esm/index.js");

/**
 * Given an array of nodes, remove any member that is contained by another.
 *
 * @category Helpers
 * @param nodes Nodes to filter.
 * @returns Remaining nodes that aren't subtrees of each other.
 */

function removeSubsets(nodes) {
  var idx = nodes.length;
  /*
   * Check if each node (or one of its ancestors) is already contained in the
   * array.
   */

  while (--idx >= 0) {
    var node = nodes[idx];
    /*
     * Remove the node if it is not unique.
     * We are going through the array from the end, so we only
     * have to check nodes that preceed the node under consideration in the array.
     */

    if (idx > 0 && nodes.lastIndexOf(node, idx - 1) >= 0) {
      nodes.splice(idx, 1);
      continue;
    }

    for (var ancestor = node.parent; ancestor; ancestor = ancestor.parent) {
      if (nodes.includes(ancestor)) {
        nodes.splice(idx, 1);
        break;
      }
    }
  }

  return nodes;
}
/**
 * @category Helpers
 * @see {@link http://dom.spec.whatwg.org/#dom-node-comparedocumentposition}
 */

var DocumentPosition;

(function (DocumentPosition) {
  DocumentPosition[DocumentPosition["DISCONNECTED"] = 1] = "DISCONNECTED";
  DocumentPosition[DocumentPosition["PRECEDING"] = 2] = "PRECEDING";
  DocumentPosition[DocumentPosition["FOLLOWING"] = 4] = "FOLLOWING";
  DocumentPosition[DocumentPosition["CONTAINS"] = 8] = "CONTAINS";
  DocumentPosition[DocumentPosition["CONTAINED_BY"] = 16] = "CONTAINED_BY";
})(DocumentPosition || (DocumentPosition = {}));
/**
 * Compare the position of one node against another node in any other document.
 * The return value is a bitmask with the values from {@link DocumentPosition}.
 *
 * Document order:
 * > There is an ordering, document order, defined on all the nodes in the
 * > document corresponding to the order in which the first character of the
 * > XML representation of each node occurs in the XML representation of the
 * > document after expansion of general entities. Thus, the document element
 * > node will be the first node. Element nodes occur before their children.
 * > Thus, document order orders element nodes in order of the occurrence of
 * > their start-tag in the XML (after expansion of entities). The attribute
 * > nodes of an element occur after the element and before its children. The
 * > relative order of attribute nodes is implementation-dependent.
 *
 * Source:
 * http://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-document-order
 *
 * @category Helpers
 * @param nodeA The first node to use in the comparison
 * @param nodeB The second node to use in the comparison
 * @returns A bitmask describing the input nodes' relative position.
 *
 * See http://dom.spec.whatwg.org/#dom-node-comparedocumentposition for
 * a description of these values.
 */


function compareDocumentPosition(nodeA, nodeB) {
  var aParents = [];
  var bParents = [];

  if (nodeA === nodeB) {
    return 0;
  }

  var current = (0,domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(nodeA) ? nodeA : nodeA.parent;

  while (current) {
    aParents.unshift(current);
    current = current.parent;
  }

  current = (0,domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(nodeB) ? nodeB : nodeB.parent;

  while (current) {
    bParents.unshift(current);
    current = current.parent;
  }

  var maxIdx = Math.min(aParents.length, bParents.length);
  var idx = 0;

  while (idx < maxIdx && aParents[idx] === bParents[idx]) {
    idx++;
  }

  if (idx === 0) {
    return DocumentPosition.DISCONNECTED;
  }

  var sharedParent = aParents[idx - 1];
  var siblings = sharedParent.children;
  var aSibling = aParents[idx];
  var bSibling = bParents[idx];

  if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
    if (sharedParent === nodeB) {
      return DocumentPosition.FOLLOWING | DocumentPosition.CONTAINED_BY;
    }

    return DocumentPosition.FOLLOWING;
  }

  if (sharedParent === nodeA) {
    return DocumentPosition.PRECEDING | DocumentPosition.CONTAINS;
  }

  return DocumentPosition.PRECEDING;
}
/**
 * Sort an array of nodes based on their relative position in the document and
 * remove any duplicate nodes. If the array contains nodes that do not belong to
 * the same document, sort order is unspecified.
 *
 * @category Helpers
 * @param nodes Array of DOM nodes.
 * @returns Collection of unique nodes, sorted in document order.
 */

function uniqueSort(nodes) {
  nodes = nodes.filter(function (node, i, arr) {
    return !arr.includes(node, i + 1);
  });
  nodes.sort(function (a, b) {
    var relative = compareDocumentPosition(a, b);

    if (relative & DocumentPosition.PRECEDING) {
      return -1;
    } else if (relative & DocumentPosition.FOLLOWING) {
      return 1;
    }

    return 0;
  });
  return nodes;
}

/***/ }),

/***/ "./node_modules/domutils/lib/esm/index.js":
/*!************************************************!*\
  !*** ./node_modules/domutils/lib/esm/index.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DocumentPosition": () => (/* reexport safe */ _helpers_js__WEBPACK_IMPORTED_MODULE_5__.DocumentPosition),
/* harmony export */   "append": () => (/* reexport safe */ _manipulation_js__WEBPACK_IMPORTED_MODULE_2__.append),
/* harmony export */   "appendChild": () => (/* reexport safe */ _manipulation_js__WEBPACK_IMPORTED_MODULE_2__.appendChild),
/* harmony export */   "compareDocumentPosition": () => (/* reexport safe */ _helpers_js__WEBPACK_IMPORTED_MODULE_5__.compareDocumentPosition),
/* harmony export */   "existsOne": () => (/* reexport safe */ _querying_js__WEBPACK_IMPORTED_MODULE_3__.existsOne),
/* harmony export */   "filter": () => (/* reexport safe */ _querying_js__WEBPACK_IMPORTED_MODULE_3__.filter),
/* harmony export */   "find": () => (/* reexport safe */ _querying_js__WEBPACK_IMPORTED_MODULE_3__.find),
/* harmony export */   "findAll": () => (/* reexport safe */ _querying_js__WEBPACK_IMPORTED_MODULE_3__.findAll),
/* harmony export */   "findOne": () => (/* reexport safe */ _querying_js__WEBPACK_IMPORTED_MODULE_3__.findOne),
/* harmony export */   "findOneChild": () => (/* reexport safe */ _querying_js__WEBPACK_IMPORTED_MODULE_3__.findOneChild),
/* harmony export */   "getAttributeValue": () => (/* reexport safe */ _traversal_js__WEBPACK_IMPORTED_MODULE_1__.getAttributeValue),
/* harmony export */   "getChildren": () => (/* reexport safe */ _traversal_js__WEBPACK_IMPORTED_MODULE_1__.getChildren),
/* harmony export */   "getElementById": () => (/* reexport safe */ _legacy_js__WEBPACK_IMPORTED_MODULE_4__.getElementById),
/* harmony export */   "getElements": () => (/* reexport safe */ _legacy_js__WEBPACK_IMPORTED_MODULE_4__.getElements),
/* harmony export */   "getElementsByTagName": () => (/* reexport safe */ _legacy_js__WEBPACK_IMPORTED_MODULE_4__.getElementsByTagName),
/* harmony export */   "getElementsByTagType": () => (/* reexport safe */ _legacy_js__WEBPACK_IMPORTED_MODULE_4__.getElementsByTagType),
/* harmony export */   "getFeed": () => (/* reexport safe */ _feeds_js__WEBPACK_IMPORTED_MODULE_6__.getFeed),
/* harmony export */   "getInnerHTML": () => (/* reexport safe */ _stringify_js__WEBPACK_IMPORTED_MODULE_0__.getInnerHTML),
/* harmony export */   "getName": () => (/* reexport safe */ _traversal_js__WEBPACK_IMPORTED_MODULE_1__.getName),
/* harmony export */   "getOuterHTML": () => (/* reexport safe */ _stringify_js__WEBPACK_IMPORTED_MODULE_0__.getOuterHTML),
/* harmony export */   "getParent": () => (/* reexport safe */ _traversal_js__WEBPACK_IMPORTED_MODULE_1__.getParent),
/* harmony export */   "getSiblings": () => (/* reexport safe */ _traversal_js__WEBPACK_IMPORTED_MODULE_1__.getSiblings),
/* harmony export */   "getText": () => (/* reexport safe */ _stringify_js__WEBPACK_IMPORTED_MODULE_0__.getText),
/* harmony export */   "hasAttrib": () => (/* reexport safe */ _traversal_js__WEBPACK_IMPORTED_MODULE_1__.hasAttrib),
/* harmony export */   "hasChildren": () => (/* reexport safe */ domhandler__WEBPACK_IMPORTED_MODULE_7__.hasChildren),
/* harmony export */   "innerText": () => (/* reexport safe */ _stringify_js__WEBPACK_IMPORTED_MODULE_0__.innerText),
/* harmony export */   "isCDATA": () => (/* reexport safe */ domhandler__WEBPACK_IMPORTED_MODULE_7__.isCDATA),
/* harmony export */   "isComment": () => (/* reexport safe */ domhandler__WEBPACK_IMPORTED_MODULE_7__.isComment),
/* harmony export */   "isDocument": () => (/* reexport safe */ domhandler__WEBPACK_IMPORTED_MODULE_7__.isDocument),
/* harmony export */   "isTag": () => (/* reexport safe */ domhandler__WEBPACK_IMPORTED_MODULE_7__.isTag),
/* harmony export */   "isText": () => (/* reexport safe */ domhandler__WEBPACK_IMPORTED_MODULE_7__.isText),
/* harmony export */   "nextElementSibling": () => (/* reexport safe */ _traversal_js__WEBPACK_IMPORTED_MODULE_1__.nextElementSibling),
/* harmony export */   "prepend": () => (/* reexport safe */ _manipulation_js__WEBPACK_IMPORTED_MODULE_2__.prepend),
/* harmony export */   "prependChild": () => (/* reexport safe */ _manipulation_js__WEBPACK_IMPORTED_MODULE_2__.prependChild),
/* harmony export */   "prevElementSibling": () => (/* reexport safe */ _traversal_js__WEBPACK_IMPORTED_MODULE_1__.prevElementSibling),
/* harmony export */   "removeElement": () => (/* reexport safe */ _manipulation_js__WEBPACK_IMPORTED_MODULE_2__.removeElement),
/* harmony export */   "removeSubsets": () => (/* reexport safe */ _helpers_js__WEBPACK_IMPORTED_MODULE_5__.removeSubsets),
/* harmony export */   "replaceElement": () => (/* reexport safe */ _manipulation_js__WEBPACK_IMPORTED_MODULE_2__.replaceElement),
/* harmony export */   "testElement": () => (/* reexport safe */ _legacy_js__WEBPACK_IMPORTED_MODULE_4__.testElement),
/* harmony export */   "textContent": () => (/* reexport safe */ _stringify_js__WEBPACK_IMPORTED_MODULE_0__.textContent),
/* harmony export */   "uniqueSort": () => (/* reexport safe */ _helpers_js__WEBPACK_IMPORTED_MODULE_5__.uniqueSort)
/* harmony export */ });
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/domutils/lib/esm/stringify.js");
/* harmony import */ var _traversal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./traversal.js */ "./node_modules/domutils/lib/esm/traversal.js");
/* harmony import */ var _manipulation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./manipulation.js */ "./node_modules/domutils/lib/esm/manipulation.js");
/* harmony import */ var _querying_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./querying.js */ "./node_modules/domutils/lib/esm/querying.js");
/* harmony import */ var _legacy_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./legacy.js */ "./node_modules/domutils/lib/esm/legacy.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./helpers.js */ "./node_modules/domutils/lib/esm/helpers.js");
/* harmony import */ var _feeds_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./feeds.js */ "./node_modules/domutils/lib/esm/feeds.js");
/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/esm/index.js");







/** @deprecated Use these methods from `domhandler` directly. */



/***/ }),

/***/ "./node_modules/domutils/lib/esm/legacy.js":
/*!*************************************************!*\
  !*** ./node_modules/domutils/lib/esm/legacy.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getElementById": () => (/* binding */ getElementById),
/* harmony export */   "getElements": () => (/* binding */ getElements),
/* harmony export */   "getElementsByTagName": () => (/* binding */ getElementsByTagName),
/* harmony export */   "getElementsByTagType": () => (/* binding */ getElementsByTagType),
/* harmony export */   "testElement": () => (/* binding */ testElement)
/* harmony export */ });
/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/esm/index.js");
/* harmony import */ var _querying_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./querying.js */ "./node_modules/domutils/lib/esm/querying.js");


var Checks = {
  tag_name: function tag_name(name) {
    if (typeof name === "function") {
      return function (elem) {
        return (0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag)(elem) && name(elem.name);
      };
    } else if (name === "*") {
      return domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag;
    }

    return function (elem) {
      return (0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag)(elem) && elem.name === name;
    };
  },
  tag_type: function tag_type(type) {
    if (typeof type === "function") {
      return function (elem) {
        return type(elem.type);
      };
    }

    return function (elem) {
      return elem.type === type;
    };
  },
  tag_contains: function tag_contains(data) {
    if (typeof data === "function") {
      return function (elem) {
        return (0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isText)(elem) && data(elem.data);
      };
    }

    return function (elem) {
      return (0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isText)(elem) && elem.data === data;
    };
  }
};
/**
 * @param attrib Attribute to check.
 * @param value Attribute value to look for.
 * @returns A function to check whether the a node has an attribute with a
 *   particular value.
 */

function getAttribCheck(attrib, value) {
  if (typeof value === "function") {
    return function (elem) {
      return (0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag)(elem) && value(elem.attribs[attrib]);
    };
  }

  return function (elem) {
    return (0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag)(elem) && elem.attribs[attrib] === value;
  };
}
/**
 * @param a First function to combine.
 * @param b Second function to combine.
 * @returns A function taking a node and returning `true` if either of the input
 *   functions returns `true` for the node.
 */


function combineFuncs(a, b) {
  return function (elem) {
    return a(elem) || b(elem);
  };
}
/**
 * @param options An object describing nodes to look for.
 * @returns A function executing all checks in `options` and returning `true` if
 *   any of them match a node.
 */


function compileTest(options) {
  var funcs = Object.keys(options).map(function (key) {
    var value = options[key];
    return Object.prototype.hasOwnProperty.call(Checks, key) ? Checks[key](value) : getAttribCheck(key, value);
  });
  return funcs.length === 0 ? null : funcs.reduce(combineFuncs);
}
/**
 * @category Legacy Query Functions
 * @param options An object describing nodes to look for.
 * @param node The element to test.
 * @returns Whether the element matches the description in `options`.
 */


function testElement(options, node) {
  var test = compileTest(options);
  return test ? test(node) : true;
}
/**
 * @category Legacy Query Functions
 * @param options An object describing nodes to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes that match `options`.
 */

function getElements(options, nodes, recurse, limit) {
  if (limit === void 0) {
    limit = Infinity;
  }

  var test = compileTest(options);
  return test ? (0,_querying_js__WEBPACK_IMPORTED_MODULE_1__.filter)(test, nodes, recurse, limit) : [];
}
/**
 * @category Legacy Query Functions
 * @param id The unique ID attribute value to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @returns The node with the supplied ID.
 */

function getElementById(id, nodes, recurse) {
  if (recurse === void 0) {
    recurse = true;
  }

  if (!Array.isArray(nodes)) nodes = [nodes];
  return (0,_querying_js__WEBPACK_IMPORTED_MODULE_1__.findOne)(getAttribCheck("id", id), nodes, recurse);
}
/**
 * @category Legacy Query Functions
 * @param tagName Tag name to search for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes with the supplied `tagName`.
 */

function getElementsByTagName(tagName, nodes, recurse, limit) {
  if (recurse === void 0) {
    recurse = true;
  }

  if (limit === void 0) {
    limit = Infinity;
  }

  return (0,_querying_js__WEBPACK_IMPORTED_MODULE_1__.filter)(Checks["tag_name"](tagName), nodes, recurse, limit);
}
/**
 * @category Legacy Query Functions
 * @param type Element type to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes with the supplied `type`.
 */

function getElementsByTagType(type, nodes, recurse, limit) {
  if (recurse === void 0) {
    recurse = true;
  }

  if (limit === void 0) {
    limit = Infinity;
  }

  return (0,_querying_js__WEBPACK_IMPORTED_MODULE_1__.filter)(Checks["tag_type"](type), nodes, recurse, limit);
}

/***/ }),

/***/ "./node_modules/domutils/lib/esm/manipulation.js":
/*!*******************************************************!*\
  !*** ./node_modules/domutils/lib/esm/manipulation.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "append": () => (/* binding */ append),
/* harmony export */   "appendChild": () => (/* binding */ appendChild),
/* harmony export */   "prepend": () => (/* binding */ prepend),
/* harmony export */   "prependChild": () => (/* binding */ prependChild),
/* harmony export */   "removeElement": () => (/* binding */ removeElement),
/* harmony export */   "replaceElement": () => (/* binding */ replaceElement)
/* harmony export */ });
/**
 * Remove an element from the dom
 *
 * @category Manipulation
 * @param elem The element to be removed
 */
function removeElement(elem) {
  if (elem.prev) elem.prev.next = elem.next;
  if (elem.next) elem.next.prev = elem.prev;

  if (elem.parent) {
    var childs = elem.parent.children;
    childs.splice(childs.lastIndexOf(elem), 1);
  }
}
/**
 * Replace an element in the dom
 *
 * @category Manipulation
 * @param elem The element to be replaced
 * @param replacement The element to be added
 */

function replaceElement(elem, replacement) {
  var prev = replacement.prev = elem.prev;

  if (prev) {
    prev.next = replacement;
  }

  var next = replacement.next = elem.next;

  if (next) {
    next.prev = replacement;
  }

  var parent = replacement.parent = elem.parent;

  if (parent) {
    var childs = parent.children;
    childs[childs.lastIndexOf(elem)] = replacement;
    elem.parent = null;
  }
}
/**
 * Append a child to an element.
 *
 * @category Manipulation
 * @param elem The element to append to.
 * @param child The element to be added as a child.
 */

function appendChild(elem, child) {
  removeElement(child);
  child.next = null;
  child.parent = elem;

  if (elem.children.push(child) > 1) {
    var sibling = elem.children[elem.children.length - 2];
    sibling.next = child;
    child.prev = sibling;
  } else {
    child.prev = null;
  }
}
/**
 * Append an element after another.
 *
 * @category Manipulation
 * @param elem The element to append after.
 * @param next The element be added.
 */

function append(elem, next) {
  removeElement(next);
  var parent = elem.parent;
  var currNext = elem.next;
  next.next = currNext;
  next.prev = elem;
  elem.next = next;
  next.parent = parent;

  if (currNext) {
    currNext.prev = next;

    if (parent) {
      var childs = parent.children;
      childs.splice(childs.lastIndexOf(currNext), 0, next);
    }
  } else if (parent) {
    parent.children.push(next);
  }
}
/**
 * Prepend a child to an element.
 *
 * @category Manipulation
 * @param elem The element to prepend before.
 * @param child The element to be added as a child.
 */

function prependChild(elem, child) {
  removeElement(child);
  child.parent = elem;
  child.prev = null;

  if (elem.children.unshift(child) !== 1) {
    var sibling = elem.children[1];
    sibling.prev = child;
    child.next = sibling;
  } else {
    child.next = null;
  }
}
/**
 * Prepend an element before another.
 *
 * @category Manipulation
 * @param elem The element to prepend before.
 * @param prev The element be added.
 */

function prepend(elem, prev) {
  removeElement(prev);
  var parent = elem.parent;

  if (parent) {
    var childs = parent.children;
    childs.splice(childs.indexOf(elem), 0, prev);
  }

  if (elem.prev) {
    elem.prev.next = prev;
  }

  prev.parent = parent;
  prev.prev = elem.prev;
  prev.next = elem;
  elem.prev = prev;
}

/***/ }),

/***/ "./node_modules/domutils/lib/esm/querying.js":
/*!***************************************************!*\
  !*** ./node_modules/domutils/lib/esm/querying.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "existsOne": () => (/* binding */ existsOne),
/* harmony export */   "filter": () => (/* binding */ filter),
/* harmony export */   "find": () => (/* binding */ find),
/* harmony export */   "findAll": () => (/* binding */ findAll),
/* harmony export */   "findOne": () => (/* binding */ findOne),
/* harmony export */   "findOneChild": () => (/* binding */ findOneChild)
/* harmony export */ });
/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/esm/index.js");
function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }


/**
 * Search a node and its children for nodes passing a test function.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param node Node to search. Will be included in the result set if it matches.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes passing `test`.
 */

function filter(test, node, recurse, limit) {
  if (recurse === void 0) {
    recurse = true;
  }

  if (limit === void 0) {
    limit = Infinity;
  }

  if (!Array.isArray(node)) node = [node];
  return find(test, node, recurse, limit);
}
/**
 * Search an array of node and its children for nodes passing a test function.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes passing `test`.
 */

function find(test, nodes, recurse, limit) {
  var result = [];

  for (var _iterator = _createForOfIteratorHelperLoose(nodes), _step; !(_step = _iterator()).done;) {
    var elem = _step.value;

    if (test(elem)) {
      result.push(elem);
      if (--limit <= 0) break;
    }

    if (recurse && (0,domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(elem) && elem.children.length > 0) {
      var children = find(test, elem.children, recurse, limit);
      result.push.apply(result, children);
      limit -= children.length;
      if (limit <= 0) break;
    }
  }

  return result;
}
/**
 * Finds the first element inside of an array that matches a test function.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns The first node in the array that passes `test`.
 * @deprecated Use `Array.prototype.find` directly.
 */

function findOneChild(test, nodes) {
  return nodes.find(test);
}
/**
 * Finds one element in a tree that passes a test.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @param recurse Also consider child nodes.
 * @returns The first child node that passes `test`.
 */

function findOne(test, nodes, recurse) {
  if (recurse === void 0) {
    recurse = true;
  }

  var elem = null;

  for (var i = 0; i < nodes.length && !elem; i++) {
    var checked = nodes[i];

    if (!(0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag)(checked)) {
      continue;
    } else if (test(checked)) {
      elem = checked;
    } else if (recurse && checked.children.length > 0) {
      elem = findOne(test, checked.children, true);
    }
  }

  return elem;
}
/**
 * @category Querying
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns Whether a tree of nodes contains at least one node passing the test.
 */

function existsOne(test, nodes) {
  return nodes.some(function (checked) {
    return (0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag)(checked) && (test(checked) || checked.children.length > 0 && existsOne(test, checked.children));
  });
}
/**
 * Search and array of nodes and its children for elements passing a test function.
 *
 * Same as `find`, but limited to elements and with less options, leading to reduced complexity.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns All nodes passing `test`.
 */

function findAll(test, nodes) {
  var _a;

  var result = [];
  var stack = nodes.filter(domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag);
  var elem;

  while (elem = stack.shift()) {
    var children = (_a = elem.children) === null || _a === void 0 ? void 0 : _a.filter(domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag);

    if (children && children.length > 0) {
      stack.unshift.apply(stack, children);
    }

    if (test(elem)) result.push(elem);
  }

  return result;
}

/***/ }),

/***/ "./node_modules/domutils/lib/esm/stringify.js":
/*!****************************************************!*\
  !*** ./node_modules/domutils/lib/esm/stringify.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getInnerHTML": () => (/* binding */ getInnerHTML),
/* harmony export */   "getOuterHTML": () => (/* binding */ getOuterHTML),
/* harmony export */   "getText": () => (/* binding */ getText),
/* harmony export */   "innerText": () => (/* binding */ innerText),
/* harmony export */   "textContent": () => (/* binding */ textContent)
/* harmony export */ });
/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/esm/index.js");
/* harmony import */ var dom_serializer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dom-serializer */ "./node_modules/dom-serializer/lib/esm/index.js");
/* harmony import */ var domelementtype__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! domelementtype */ "./node_modules/domelementtype/lib/esm/index.js");



/**
 * @category Stringify
 * @deprecated Use the `dom-serializer` module directly.
 * @param node Node to get the outer HTML of.
 * @param options Options for serialization.
 * @returns `node`'s outer HTML.
 */

function getOuterHTML(node, options) {
  return (0,dom_serializer__WEBPACK_IMPORTED_MODULE_1__["default"])(node, options);
}
/**
 * @category Stringify
 * @deprecated Use the `dom-serializer` module directly.
 * @param node Node to get the inner HTML of.
 * @param options Options for serialization.
 * @returns `node`'s inner HTML.
 */

function getInnerHTML(node, options) {
  return (0,domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(node) ? node.children.map(function (node) {
    return getOuterHTML(node, options);
  }).join("") : "";
}
/**
 * Get a node's inner text. Same as `textContent`, but inserts newlines for `<br>` tags.
 *
 * @category Stringify
 * @deprecated Use `textContent` instead.
 * @param node Node to get the inner text of.
 * @returns `node`'s inner text.
 */

function getText(node) {
  if (Array.isArray(node)) return node.map(getText).join("");
  if ((0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag)(node)) return node.name === "br" ? "\n" : getText(node.children);
  if ((0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isCDATA)(node)) return getText(node.children);
  if ((0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isText)(node)) return node.data;
  return "";
}
/**
 * Get a node's text content.
 *
 * @category Stringify
 * @param node Node to get the text content of.
 * @returns `node`'s text content.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent}
 */

function textContent(node) {
  if (Array.isArray(node)) return node.map(textContent).join("");

  if ((0,domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(node) && !(0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isComment)(node)) {
    return textContent(node.children);
  }

  if ((0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isText)(node)) return node.data;
  return "";
}
/**
 * Get a node's inner text.
 *
 * @category Stringify
 * @param node Node to get the inner text of.
 * @returns `node`'s inner text.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/innerText}
 */

function innerText(node) {
  if (Array.isArray(node)) return node.map(innerText).join("");

  if ((0,domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(node) && (node.type === domelementtype__WEBPACK_IMPORTED_MODULE_2__.ElementType.Tag || (0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isCDATA)(node))) {
    return innerText(node.children);
  }

  if ((0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isText)(node)) return node.data;
  return "";
}

/***/ }),

/***/ "./node_modules/domutils/lib/esm/traversal.js":
/*!****************************************************!*\
  !*** ./node_modules/domutils/lib/esm/traversal.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getAttributeValue": () => (/* binding */ getAttributeValue),
/* harmony export */   "getChildren": () => (/* binding */ getChildren),
/* harmony export */   "getName": () => (/* binding */ getName),
/* harmony export */   "getParent": () => (/* binding */ getParent),
/* harmony export */   "getSiblings": () => (/* binding */ getSiblings),
/* harmony export */   "hasAttrib": () => (/* binding */ hasAttrib),
/* harmony export */   "nextElementSibling": () => (/* binding */ nextElementSibling),
/* harmony export */   "prevElementSibling": () => (/* binding */ prevElementSibling)
/* harmony export */ });
/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/esm/index.js");

/**
 * Get a node's children.
 *
 * @category Traversal
 * @param elem Node to get the children of.
 * @returns `elem`'s children, or an empty array.
 */

function getChildren(elem) {
  return (0,domhandler__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(elem) ? elem.children : [];
}
/**
 * Get a node's parent.
 *
 * @category Traversal
 * @param elem Node to get the parent of.
 * @returns `elem`'s parent node.
 */

function getParent(elem) {
  return elem.parent || null;
}
/**
 * Gets an elements siblings, including the element itself.
 *
 * Attempts to get the children through the element's parent first. If we don't
 * have a parent (the element is a root node), we walk the element's `prev` &
 * `next` to get all remaining nodes.
 *
 * @category Traversal
 * @param elem Element to get the siblings of.
 * @returns `elem`'s siblings.
 */

function getSiblings(elem) {
  var parent = getParent(elem);
  if (parent != null) return getChildren(parent);
  var siblings = [elem];
  var prev = elem.prev,
      next = elem.next;

  while (prev != null) {
    siblings.unshift(prev);
    var _prev = prev;
    prev = _prev.prev;
  }

  while (next != null) {
    siblings.push(next);
    var _next = next;
    next = _next.next;
  }

  return siblings;
}
/**
 * Gets an attribute from an element.
 *
 * @category Traversal
 * @param elem Element to check.
 * @param name Attribute name to retrieve.
 * @returns The element's attribute value, or `undefined`.
 */

function getAttributeValue(elem, name) {
  var _a;

  return (_a = elem.attribs) === null || _a === void 0 ? void 0 : _a[name];
}
/**
 * Checks whether an element has an attribute.
 *
 * @category Traversal
 * @param elem Element to check.
 * @param name Attribute name to look for.
 * @returns Returns whether `elem` has the attribute `name`.
 */

function hasAttrib(elem, name) {
  return elem.attribs != null && Object.prototype.hasOwnProperty.call(elem.attribs, name) && elem.attribs[name] != null;
}
/**
 * Get the tag name of an element.
 *
 * @category Traversal
 * @param elem The element to get the name for.
 * @returns The tag name of `elem`.
 */

function getName(elem) {
  return elem.name;
}
/**
 * Returns the next element sibling of a node.
 *
 * @category Traversal
 * @param elem The element to get the next sibling of.
 * @returns `elem`'s next sibling that is a tag.
 */

function nextElementSibling(elem) {
  var next = elem.next;

  while (next !== null && !(0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag)(next)) {
    var _next2 = next;
    next = _next2.next;
  }

  return next;
}
/**
 * Returns the previous element sibling of a node.
 *
 * @category Traversal
 * @param elem The element to get the previous sibling of.
 * @returns `elem`'s previous sibling that is a tag.
 */

function prevElementSibling(elem) {
  var prev = elem.prev;

  while (prev !== null && !(0,domhandler__WEBPACK_IMPORTED_MODULE_0__.isTag)(prev)) {
    var _prev2 = prev;
    prev = _prev2.prev;
  }

  return prev;
}

/***/ }),

/***/ "./node_modules/entities/lib/esm/decode.js":
/*!*************************************************!*\
  !*** ./node_modules/entities/lib/esm/decode.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BinTrieFlags": () => (/* binding */ BinTrieFlags),
/* harmony export */   "decodeCodePoint": () => (/* reexport safe */ _decode_codepoint_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "decodeHTML": () => (/* binding */ decodeHTML),
/* harmony export */   "decodeHTMLStrict": () => (/* binding */ decodeHTMLStrict),
/* harmony export */   "decodeXML": () => (/* binding */ decodeXML),
/* harmony export */   "determineBranch": () => (/* binding */ determineBranch),
/* harmony export */   "fromCodePoint": () => (/* reexport safe */ _decode_codepoint_js__WEBPACK_IMPORTED_MODULE_2__.fromCodePoint),
/* harmony export */   "htmlDecodeTree": () => (/* reexport safe */ _generated_decode_data_html_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "replaceCodePoint": () => (/* reexport safe */ _decode_codepoint_js__WEBPACK_IMPORTED_MODULE_2__.replaceCodePoint),
/* harmony export */   "xmlDecodeTree": () => (/* reexport safe */ _generated_decode_data_xml_js__WEBPACK_IMPORTED_MODULE_1__["default"])
/* harmony export */ });
/* harmony import */ var _generated_decode_data_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./generated/decode-data-html.js */ "./node_modules/entities/lib/esm/generated/decode-data-html.js");
/* harmony import */ var _generated_decode_data_xml_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./generated/decode-data-xml.js */ "./node_modules/entities/lib/esm/generated/decode-data-xml.js");
/* harmony import */ var _decode_codepoint_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./decode_codepoint.js */ "./node_modules/entities/lib/esm/decode_codepoint.js");


 // Re-export for use by eg. htmlparser2



var CharCodes;

(function (CharCodes) {
  CharCodes[CharCodes["NUM"] = 35] = "NUM";
  CharCodes[CharCodes["SEMI"] = 59] = "SEMI";
  CharCodes[CharCodes["ZERO"] = 48] = "ZERO";
  CharCodes[CharCodes["NINE"] = 57] = "NINE";
  CharCodes[CharCodes["LOWER_A"] = 97] = "LOWER_A";
  CharCodes[CharCodes["LOWER_F"] = 102] = "LOWER_F";
  CharCodes[CharCodes["LOWER_X"] = 120] = "LOWER_X";
  /** Bit that needs to be set to convert an upper case ASCII character to lower case */

  CharCodes[CharCodes["To_LOWER_BIT"] = 32] = "To_LOWER_BIT";
})(CharCodes || (CharCodes = {}));

var BinTrieFlags;

(function (BinTrieFlags) {
  BinTrieFlags[BinTrieFlags["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
  BinTrieFlags[BinTrieFlags["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
  BinTrieFlags[BinTrieFlags["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags || (BinTrieFlags = {}));

function getDecoder(decodeTree) {
  return function decodeHTMLBinary(str, strict) {
    var ret = "";
    var lastIdx = 0;
    var strIdx = 0;

    while ((strIdx = str.indexOf("&", strIdx)) >= 0) {
      ret += str.slice(lastIdx, strIdx);
      lastIdx = strIdx; // Skip the "&"

      strIdx += 1; // If we have a numeric entity, handle this separately.

      if (str.charCodeAt(strIdx) === CharCodes.NUM) {
        // Skip the leading "&#". For hex entities, also skip the leading "x".
        var start = strIdx + 1;
        var base = 10;
        var cp = str.charCodeAt(start);

        if ((cp | CharCodes.To_LOWER_BIT) === CharCodes.LOWER_X) {
          base = 16;
          strIdx += 1;
          start += 1;
        }

        do {
          cp = str.charCodeAt(++strIdx);
        } while (cp >= CharCodes.ZERO && cp <= CharCodes.NINE || base === 16 && (cp | CharCodes.To_LOWER_BIT) >= CharCodes.LOWER_A && (cp | CharCodes.To_LOWER_BIT) <= CharCodes.LOWER_F);

        if (start !== strIdx) {
          var entity = str.substring(start, strIdx);
          var parsed = parseInt(entity, base);

          if (str.charCodeAt(strIdx) === CharCodes.SEMI) {
            strIdx += 1;
          } else if (strict) {
            continue;
          }

          ret += (0,_decode_codepoint_js__WEBPACK_IMPORTED_MODULE_2__["default"])(parsed);
          lastIdx = strIdx;
        }

        continue;
      }

      var resultIdx = 0;
      var excess = 1;
      var treeIdx = 0;
      var current = decodeTree[treeIdx];

      for (; strIdx < str.length; strIdx++, excess++) {
        treeIdx = determineBranch(decodeTree, current, treeIdx + 1, str.charCodeAt(strIdx));
        if (treeIdx < 0) break;
        current = decodeTree[treeIdx];
        var masked = current & BinTrieFlags.VALUE_LENGTH; // If the branch is a value, store it and continue

        if (masked) {
          // If we have a legacy entity while parsing strictly, just skip the number of bytes
          if (!strict || str.charCodeAt(strIdx) === CharCodes.SEMI) {
            resultIdx = treeIdx;
            excess = 0;
          } // The mask is the number of bytes of the value, including the current byte.


          var valueLength = (masked >> 14) - 1;
          if (valueLength === 0) break;
          treeIdx += valueLength;
        }
      }

      if (resultIdx !== 0) {
        var _valueLength = (decodeTree[resultIdx] & BinTrieFlags.VALUE_LENGTH) >> 14;

        ret += _valueLength === 1 ? String.fromCharCode(decodeTree[resultIdx] & ~BinTrieFlags.VALUE_LENGTH) : _valueLength === 2 ? String.fromCharCode(decodeTree[resultIdx + 1]) : String.fromCharCode(decodeTree[resultIdx + 1], decodeTree[resultIdx + 2]);
        lastIdx = strIdx - excess + 1;
      }
    }

    return ret + str.slice(lastIdx);
  };
}

function determineBranch(decodeTree, current, nodeIdx, _char) {
  var branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
  var jumpOffset = current & BinTrieFlags.JUMP_TABLE; // Case 1: Single branch encoded in jump offset

  if (branchCount === 0) {
    return jumpOffset !== 0 && _char === jumpOffset ? nodeIdx : -1;
  } // Case 2: Multiple branches encoded in jump table


  if (jumpOffset) {
    var value = _char - jumpOffset;
    return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIdx + value] - 1;
  } // Case 3: Multiple branches encoded in dictionary
  // Binary search for the character.


  var lo = nodeIdx;
  var hi = lo + branchCount - 1;

  while (lo <= hi) {
    var mid = lo + hi >>> 1;
    var midVal = decodeTree[mid];

    if (midVal < _char) {
      lo = mid + 1;
    } else if (midVal > _char) {
      hi = mid - 1;
    } else {
      return decodeTree[mid + branchCount];
    }
  }

  return -1;
}
var htmlDecoder = getDecoder(_generated_decode_data_html_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
var xmlDecoder = getDecoder(_generated_decode_data_xml_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/**
 * Decodes an HTML string, allowing for entities not terminated by a semi-colon.
 *
 * @param str The string to decode.
 * @returns The decoded string.
 */

function decodeHTML(str) {
  return htmlDecoder(str, false);
}
/**
 * Decodes an HTML string, requiring all entities to be terminated by a semi-colon.
 *
 * @param str The string to decode.
 * @returns The decoded string.
 */

function decodeHTMLStrict(str) {
  return htmlDecoder(str, true);
}
/**
 * Decodes an XML string, requiring all entities to be terminated by a semi-colon.
 *
 * @param str The string to decode.
 * @returns The decoded string.
 */

function decodeXML(str) {
  return xmlDecoder(str, true);
}

/***/ }),

/***/ "./node_modules/entities/lib/esm/decode_codepoint.js":
/*!***********************************************************!*\
  !*** ./node_modules/entities/lib/esm/decode_codepoint.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ decodeCodePoint),
/* harmony export */   "fromCodePoint": () => (/* binding */ fromCodePoint),
/* harmony export */   "replaceCodePoint": () => (/* binding */ replaceCodePoint)
/* harmony export */ });
// Adapted from https://github.com/mathiasbynens/he/blob/36afe179392226cf1b6ccdb16ebbb7a5a844d93a/src/he.js#L106-L134
var _a;

var decodeMap = new Map([[0, 65533], [128, 8364], [130, 8218], [131, 402], [132, 8222], [133, 8230], [134, 8224], [135, 8225], [136, 710], [137, 8240], [138, 352], [139, 8249], [140, 338], [142, 381], [145, 8216], [146, 8217], [147, 8220], [148, 8221], [149, 8226], [150, 8211], [151, 8212], [152, 732], [153, 8482], [154, 353], [155, 8250], [156, 339], [158, 382], [159, 376]]);
var fromCodePoint = // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
(_a = String.fromCodePoint) !== null && _a !== void 0 ? _a : function (codePoint) {
  var output = "";

  if (codePoint > 0xffff) {
    codePoint -= 0x10000;
    output += String.fromCharCode(codePoint >>> 10 & 0x3ff | 0xd800);
    codePoint = 0xdc00 | codePoint & 0x3ff;
  }

  output += String.fromCharCode(codePoint);
  return output;
};
function replaceCodePoint(codePoint) {
  var _a;

  if (codePoint >= 0xd800 && codePoint <= 0xdfff || codePoint > 0x10ffff) {
    return 0xfffd;
  }

  return (_a = decodeMap.get(codePoint)) !== null && _a !== void 0 ? _a : codePoint;
}
function decodeCodePoint(codePoint) {
  return fromCodePoint(replaceCodePoint(codePoint));
}

/***/ }),

/***/ "./node_modules/entities/lib/esm/encode.js":
/*!*************************************************!*\
  !*** ./node_modules/entities/lib/esm/encode.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "encodeHTML": () => (/* binding */ encodeHTML),
/* harmony export */   "encodeNonAsciiHTML": () => (/* binding */ encodeNonAsciiHTML)
/* harmony export */ });
/* harmony import */ var _generated_encode_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./generated/encode-html.js */ "./node_modules/entities/lib/esm/generated/encode-html.js");
/* harmony import */ var _escape_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./escape.js */ "./node_modules/entities/lib/esm/escape.js");


var htmlReplacer = /[\t\n!-,./:-@[-`\f{-}$\x80-\uFFFF]/g;
/**
 * Encodes all characters in the input using HTML entities. This includes
 * characters that are valid ASCII characters in HTML documents, such as `#`.
 *
 * To get a more compact output, consider using the `encodeNonAsciiHTML`
 * function, which will only encode characters that are not valid in HTML
 * documents, as well as non-ASCII characters.
 *
 * If a character has no equivalent entity, a numeric hexadecimal reference
 * (eg. `&#xfc;`) will be used.
 */

function encodeHTML(data) {
  return encodeHTMLTrieRe(htmlReplacer, data);
}
/**
 * Encodes all non-ASCII characters, as well as characters not valid in HTML
 * documents using HTML entities. This function will not encode characters that
 * are valid in HTML documents, such as `#`.
 *
 * If a character has no equivalent entity, a numeric hexadecimal reference
 * (eg. `&#xfc;`) will be used.
 */

function encodeNonAsciiHTML(data) {
  return encodeHTMLTrieRe(_escape_js__WEBPACK_IMPORTED_MODULE_1__.xmlReplacer, data);
}

function encodeHTMLTrieRe(regExp, str) {
  var ret = "";
  var lastIdx = 0;
  var match;

  while ((match = regExp.exec(str)) !== null) {
    var i = match.index;
    ret += str.substring(lastIdx, i);

    var _char = str.charCodeAt(i);

    var next = _generated_encode_html_js__WEBPACK_IMPORTED_MODULE_0__["default"].get(_char);

    if (typeof next === "object") {
      // We are in a branch. Try to match the next char.
      if (i + 1 < str.length) {
        var nextChar = str.charCodeAt(i + 1);
        var value = typeof next.n === "number" ? next.n === nextChar ? next.o : undefined : next.n.get(nextChar);

        if (value !== undefined) {
          ret += value;
          lastIdx = regExp.lastIndex += 1;
          continue;
        }
      }

      next = next.v;
    } // We might have a tree node without a value; skip and use a numeric entitiy.


    if (next !== undefined) {
      ret += next;
      lastIdx = i + 1;
    } else {
      var cp = (0,_escape_js__WEBPACK_IMPORTED_MODULE_1__.getCodePoint)(str, i);
      ret += "&#x" + cp.toString(16) + ";"; // Increase by 1 if we have a surrogate pair

      lastIdx = regExp.lastIndex += Number(cp !== _char);
    }
  }

  return ret + str.substr(lastIdx);
}

/***/ }),

/***/ "./node_modules/entities/lib/esm/escape.js":
/*!*************************************************!*\
  !*** ./node_modules/entities/lib/esm/escape.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "encodeXML": () => (/* binding */ encodeXML),
/* harmony export */   "escape": () => (/* binding */ escape),
/* harmony export */   "escapeAttribute": () => (/* binding */ escapeAttribute),
/* harmony export */   "escapeText": () => (/* binding */ escapeText),
/* harmony export */   "escapeUTF8": () => (/* binding */ escapeUTF8),
/* harmony export */   "getCodePoint": () => (/* binding */ getCodePoint),
/* harmony export */   "xmlReplacer": () => (/* binding */ xmlReplacer)
/* harmony export */ });
var xmlReplacer = /["&'<>$\x80-\uFFFF]/g;
var xmlCodeMap = new Map([[34, "&quot;"], [38, "&amp;"], [39, "&apos;"], [60, "&lt;"], [62, "&gt;"]]); // For compatibility with node < 4, we wrap `codePointAt`

var getCodePoint = // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
String.prototype.codePointAt != null ? function (str, index) {
  return str.codePointAt(index);
} : // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
function (c, index) {
  return (c.charCodeAt(index) & 0xfc00) === 0xd800 ? (c.charCodeAt(index) - 0xd800) * 0x400 + c.charCodeAt(index + 1) - 0xdc00 + 0x10000 : c.charCodeAt(index);
};
/**
 * Encodes all non-ASCII characters, as well as characters not valid in XML
 * documents using XML entities.
 *
 * If a character has no equivalent entity, a
 * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
 */

function encodeXML(str) {
  var ret = "";
  var lastIdx = 0;
  var match;

  while ((match = xmlReplacer.exec(str)) !== null) {
    var i = match.index;

    var _char = str.charCodeAt(i);

    var next = xmlCodeMap.get(_char);

    if (next !== undefined) {
      ret += str.substring(lastIdx, i) + next;
      lastIdx = i + 1;
    } else {
      ret += str.substring(lastIdx, i) + "&#x" + getCodePoint(str, i).toString(16) + ";"; // Increase by 1 if we have a surrogate pair

      lastIdx = xmlReplacer.lastIndex += Number((_char & 0xfc00) === 0xd800);
    }
  }

  return ret + str.substr(lastIdx);
}
/**
 * Encodes all non-ASCII characters, as well as characters not valid in XML
 * documents using numeric hexadecimal reference (eg. `&#xfc;`).
 *
 * Have a look at `escapeUTF8` if you want a more concise output at the expense
 * of reduced transportability.
 *
 * @param data String to escape.
 */

var escape = encodeXML;

function getEscaper(regex, map) {
  return function escape(data) {
    var match;
    var lastIdx = 0;
    var result = "";

    while (match = regex.exec(data)) {
      if (lastIdx !== match.index) {
        result += data.substring(lastIdx, match.index);
      } // We know that this chararcter will be in the map.


      result += map.get(match[0].charCodeAt(0)); // Every match will be of length 1

      lastIdx = match.index + 1;
    }

    return result + data.substring(lastIdx);
  };
}
/**
 * Encodes all characters not valid in XML documents using XML entities.
 *
 * Note that the output will be character-set dependent.
 *
 * @param data String to escape.
 */


var escapeUTF8 = getEscaper(/[&<>'"]/g, xmlCodeMap);
/**
 * Encodes all characters that have to be escaped in HTML attributes,
 * following {@link https://html.spec.whatwg.org/multipage/parsing.html#escapingString}.
 *
 * @param data String to escape.
 */

var escapeAttribute = getEscaper(/["&\u00A0]/g, new Map([[34, "&quot;"], [38, "&amp;"], [160, "&nbsp;"]]));
/**
 * Encodes all characters that have to be escaped in HTML text,
 * following {@link https://html.spec.whatwg.org/multipage/parsing.html#escapingString}.
 *
 * @param data String to escape.
 */

var escapeText = getEscaper(/[&<>\u00A0]/g, new Map([[38, "&amp;"], [60, "&lt;"], [62, "&gt;"], [160, "&nbsp;"]]));

/***/ }),

/***/ "./node_modules/entities/lib/esm/generated/decode-data-html.js":
/*!*********************************************************************!*\
  !*** ./node_modules/entities/lib/esm/generated/decode-data-html.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Generated using scripts/write-decode-map.ts
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Uint16Array( // prettier-ignore
"\u1D41<\xD5\u0131\u028A\u049D\u057B\u05D0\u0675\u06DE\u07A2\u07D6\u080F\u0A4A\u0A91\u0DA1\u0E6D\u0F09\u0F26\u10CA\u1228\u12E1\u1415\u149D\u14C3\u14DF\u1525\0\0\0\0\0\0\u156B\u16CD\u198D\u1C12\u1DDD\u1F7E\u2060\u21B0\u228D\u23C0\u23FB\u2442\u2824\u2912\u2D08\u2E48\u2FCE\u3016\u32BA\u3639\u37AC\u38FE\u3A28\u3A71\u3AE0\u3B2E\u0800EMabcfglmnoprstu\\bfms\x7F\x84\x8B\x90\x95\x98\xA6\xB3\xB9\xC8\xCFlig\u803B\xC6\u40C6P\u803B&\u4026cute\u803B\xC1\u40C1reve;\u4102\u0100iyx}rc\u803B\xC2\u40C2;\u4410r;\uC000\uD835\uDD04rave\u803B\xC0\u40C0pha;\u4391acr;\u4100d;\u6A53\u0100gp\x9D\xA1on;\u4104f;\uC000\uD835\uDD38plyFunction;\u6061ing\u803B\xC5\u40C5\u0100cs\xBE\xC3r;\uC000\uD835\uDC9Cign;\u6254ilde\u803B\xC3\u40C3ml\u803B\xC4\u40C4\u0400aceforsu\xE5\xFB\xFE\u0117\u011C\u0122\u0127\u012A\u0100cr\xEA\xF2kslash;\u6216\u0176\xF6\xF8;\u6AE7ed;\u6306y;\u4411\u0180crt\u0105\u010B\u0114ause;\u6235noullis;\u612Ca;\u4392r;\uC000\uD835\uDD05pf;\uC000\uD835\uDD39eve;\u42D8c\xF2\u0113mpeq;\u624E\u0700HOacdefhilorsu\u014D\u0151\u0156\u0180\u019E\u01A2\u01B5\u01B7\u01BA\u01DC\u0215\u0273\u0278\u027Ecy;\u4427PY\u803B\xA9\u40A9\u0180cpy\u015D\u0162\u017Aute;\u4106\u0100;i\u0167\u0168\u62D2talDifferentialD;\u6145leys;\u612D\u0200aeio\u0189\u018E\u0194\u0198ron;\u410Cdil\u803B\xC7\u40C7rc;\u4108nint;\u6230ot;\u410A\u0100dn\u01A7\u01ADilla;\u40B8terDot;\u40B7\xF2\u017Fi;\u43A7rcle\u0200DMPT\u01C7\u01CB\u01D1\u01D6ot;\u6299inus;\u6296lus;\u6295imes;\u6297o\u0100cs\u01E2\u01F8kwiseContourIntegral;\u6232eCurly\u0100DQ\u0203\u020FoubleQuote;\u601Duote;\u6019\u0200lnpu\u021E\u0228\u0247\u0255on\u0100;e\u0225\u0226\u6237;\u6A74\u0180git\u022F\u0236\u023Aruent;\u6261nt;\u622FourIntegral;\u622E\u0100fr\u024C\u024E;\u6102oduct;\u6210nterClockwiseContourIntegral;\u6233oss;\u6A2Fcr;\uC000\uD835\uDC9Ep\u0100;C\u0284\u0285\u62D3ap;\u624D\u0580DJSZacefios\u02A0\u02AC\u02B0\u02B4\u02B8\u02CB\u02D7\u02E1\u02E6\u0333\u048D\u0100;o\u0179\u02A5trahd;\u6911cy;\u4402cy;\u4405cy;\u440F\u0180grs\u02BF\u02C4\u02C7ger;\u6021r;\u61A1hv;\u6AE4\u0100ay\u02D0\u02D5ron;\u410E;\u4414l\u0100;t\u02DD\u02DE\u6207a;\u4394r;\uC000\uD835\uDD07\u0100af\u02EB\u0327\u0100cm\u02F0\u0322ritical\u0200ADGT\u0300\u0306\u0316\u031Ccute;\u40B4o\u0174\u030B\u030D;\u42D9bleAcute;\u42DDrave;\u4060ilde;\u42DCond;\u62C4ferentialD;\u6146\u0470\u033D\0\0\0\u0342\u0354\0\u0405f;\uC000\uD835\uDD3B\u0180;DE\u0348\u0349\u034D\u40A8ot;\u60DCqual;\u6250ble\u0300CDLRUV\u0363\u0372\u0382\u03CF\u03E2\u03F8ontourIntegra\xEC\u0239o\u0274\u0379\0\0\u037B\xBB\u0349nArrow;\u61D3\u0100eo\u0387\u03A4ft\u0180ART\u0390\u0396\u03A1rrow;\u61D0ightArrow;\u61D4e\xE5\u02CAng\u0100LR\u03AB\u03C4eft\u0100AR\u03B3\u03B9rrow;\u67F8ightArrow;\u67FAightArrow;\u67F9ight\u0100AT\u03D8\u03DErrow;\u61D2ee;\u62A8p\u0241\u03E9\0\0\u03EFrrow;\u61D1ownArrow;\u61D5erticalBar;\u6225n\u0300ABLRTa\u0412\u042A\u0430\u045E\u047F\u037Crrow\u0180;BU\u041D\u041E\u0422\u6193ar;\u6913pArrow;\u61F5reve;\u4311eft\u02D2\u043A\0\u0446\0\u0450ightVector;\u6950eeVector;\u695Eector\u0100;B\u0459\u045A\u61BDar;\u6956ight\u01D4\u0467\0\u0471eeVector;\u695Fector\u0100;B\u047A\u047B\u61C1ar;\u6957ee\u0100;A\u0486\u0487\u62A4rrow;\u61A7\u0100ct\u0492\u0497r;\uC000\uD835\uDC9Frok;\u4110\u0800NTacdfglmopqstux\u04BD\u04C0\u04C4\u04CB\u04DE\u04E2\u04E7\u04EE\u04F5\u0521\u052F\u0536\u0552\u055D\u0560\u0565G;\u414AH\u803B\xD0\u40D0cute\u803B\xC9\u40C9\u0180aiy\u04D2\u04D7\u04DCron;\u411Arc\u803B\xCA\u40CA;\u442Dot;\u4116r;\uC000\uD835\uDD08rave\u803B\xC8\u40C8ement;\u6208\u0100ap\u04FA\u04FEcr;\u4112ty\u0253\u0506\0\0\u0512mallSquare;\u65FBerySmallSquare;\u65AB\u0100gp\u0526\u052Aon;\u4118f;\uC000\uD835\uDD3Csilon;\u4395u\u0100ai\u053C\u0549l\u0100;T\u0542\u0543\u6A75ilde;\u6242librium;\u61CC\u0100ci\u0557\u055Ar;\u6130m;\u6A73a;\u4397ml\u803B\xCB\u40CB\u0100ip\u056A\u056Fsts;\u6203onentialE;\u6147\u0280cfios\u0585\u0588\u058D\u05B2\u05CCy;\u4424r;\uC000\uD835\uDD09lled\u0253\u0597\0\0\u05A3mallSquare;\u65FCerySmallSquare;\u65AA\u0370\u05BA\0\u05BF\0\0\u05C4f;\uC000\uD835\uDD3DAll;\u6200riertrf;\u6131c\xF2\u05CB\u0600JTabcdfgorst\u05E8\u05EC\u05EF\u05FA\u0600\u0612\u0616\u061B\u061D\u0623\u066C\u0672cy;\u4403\u803B>\u403Emma\u0100;d\u05F7\u05F8\u4393;\u43DCreve;\u411E\u0180eiy\u0607\u060C\u0610dil;\u4122rc;\u411C;\u4413ot;\u4120r;\uC000\uD835\uDD0A;\u62D9pf;\uC000\uD835\uDD3Eeater\u0300EFGLST\u0635\u0644\u064E\u0656\u065B\u0666qual\u0100;L\u063E\u063F\u6265ess;\u62DBullEqual;\u6267reater;\u6AA2ess;\u6277lantEqual;\u6A7Eilde;\u6273cr;\uC000\uD835\uDCA2;\u626B\u0400Aacfiosu\u0685\u068B\u0696\u069B\u069E\u06AA\u06BE\u06CARDcy;\u442A\u0100ct\u0690\u0694ek;\u42C7;\u405Eirc;\u4124r;\u610ClbertSpace;\u610B\u01F0\u06AF\0\u06B2f;\u610DizontalLine;\u6500\u0100ct\u06C3\u06C5\xF2\u06A9rok;\u4126mp\u0144\u06D0\u06D8ownHum\xF0\u012Fqual;\u624F\u0700EJOacdfgmnostu\u06FA\u06FE\u0703\u0707\u070E\u071A\u071E\u0721\u0728\u0744\u0778\u078B\u078F\u0795cy;\u4415lig;\u4132cy;\u4401cute\u803B\xCD\u40CD\u0100iy\u0713\u0718rc\u803B\xCE\u40CE;\u4418ot;\u4130r;\u6111rave\u803B\xCC\u40CC\u0180;ap\u0720\u072F\u073F\u0100cg\u0734\u0737r;\u412AinaryI;\u6148lie\xF3\u03DD\u01F4\u0749\0\u0762\u0100;e\u074D\u074E\u622C\u0100gr\u0753\u0758ral;\u622Bsection;\u62C2isible\u0100CT\u076C\u0772omma;\u6063imes;\u6062\u0180gpt\u077F\u0783\u0788on;\u412Ef;\uC000\uD835\uDD40a;\u4399cr;\u6110ilde;\u4128\u01EB\u079A\0\u079Ecy;\u4406l\u803B\xCF\u40CF\u0280cfosu\u07AC\u07B7\u07BC\u07C2\u07D0\u0100iy\u07B1\u07B5rc;\u4134;\u4419r;\uC000\uD835\uDD0Dpf;\uC000\uD835\uDD41\u01E3\u07C7\0\u07CCr;\uC000\uD835\uDCA5rcy;\u4408kcy;\u4404\u0380HJacfos\u07E4\u07E8\u07EC\u07F1\u07FD\u0802\u0808cy;\u4425cy;\u440Cppa;\u439A\u0100ey\u07F6\u07FBdil;\u4136;\u441Ar;\uC000\uD835\uDD0Epf;\uC000\uD835\uDD42cr;\uC000\uD835\uDCA6\u0580JTaceflmost\u0825\u0829\u082C\u0850\u0863\u09B3\u09B8\u09C7\u09CD\u0A37\u0A47cy;\u4409\u803B<\u403C\u0280cmnpr\u0837\u083C\u0841\u0844\u084Dute;\u4139bda;\u439Bg;\u67EAlacetrf;\u6112r;\u619E\u0180aey\u0857\u085C\u0861ron;\u413Ddil;\u413B;\u441B\u0100fs\u0868\u0970t\u0500ACDFRTUVar\u087E\u08A9\u08B1\u08E0\u08E6\u08FC\u092F\u095B\u0390\u096A\u0100nr\u0883\u088FgleBracket;\u67E8row\u0180;BR\u0899\u089A\u089E\u6190ar;\u61E4ightArrow;\u61C6eiling;\u6308o\u01F5\u08B7\0\u08C3bleBracket;\u67E6n\u01D4\u08C8\0\u08D2eeVector;\u6961ector\u0100;B\u08DB\u08DC\u61C3ar;\u6959loor;\u630Aight\u0100AV\u08EF\u08F5rrow;\u6194ector;\u694E\u0100er\u0901\u0917e\u0180;AV\u0909\u090A\u0910\u62A3rrow;\u61A4ector;\u695Aiangle\u0180;BE\u0924\u0925\u0929\u62B2ar;\u69CFqual;\u62B4p\u0180DTV\u0937\u0942\u094CownVector;\u6951eeVector;\u6960ector\u0100;B\u0956\u0957\u61BFar;\u6958ector\u0100;B\u0965\u0966\u61BCar;\u6952ight\xE1\u039Cs\u0300EFGLST\u097E\u098B\u0995\u099D\u09A2\u09ADqualGreater;\u62DAullEqual;\u6266reater;\u6276ess;\u6AA1lantEqual;\u6A7Dilde;\u6272r;\uC000\uD835\uDD0F\u0100;e\u09BD\u09BE\u62D8ftarrow;\u61DAidot;\u413F\u0180npw\u09D4\u0A16\u0A1Bg\u0200LRlr\u09DE\u09F7\u0A02\u0A10eft\u0100AR\u09E6\u09ECrrow;\u67F5ightArrow;\u67F7ightArrow;\u67F6eft\u0100ar\u03B3\u0A0Aight\xE1\u03BFight\xE1\u03CAf;\uC000\uD835\uDD43er\u0100LR\u0A22\u0A2CeftArrow;\u6199ightArrow;\u6198\u0180cht\u0A3E\u0A40\u0A42\xF2\u084C;\u61B0rok;\u4141;\u626A\u0400acefiosu\u0A5A\u0A5D\u0A60\u0A77\u0A7C\u0A85\u0A8B\u0A8Ep;\u6905y;\u441C\u0100dl\u0A65\u0A6FiumSpace;\u605Flintrf;\u6133r;\uC000\uD835\uDD10nusPlus;\u6213pf;\uC000\uD835\uDD44c\xF2\u0A76;\u439C\u0480Jacefostu\u0AA3\u0AA7\u0AAD\u0AC0\u0B14\u0B19\u0D91\u0D97\u0D9Ecy;\u440Acute;\u4143\u0180aey\u0AB4\u0AB9\u0ABEron;\u4147dil;\u4145;\u441D\u0180gsw\u0AC7\u0AF0\u0B0Eative\u0180MTV\u0AD3\u0ADF\u0AE8ediumSpace;\u600Bhi\u0100cn\u0AE6\u0AD8\xEB\u0AD9eryThi\xEE\u0AD9ted\u0100GL\u0AF8\u0B06reaterGreate\xF2\u0673essLes\xF3\u0A48Line;\u400Ar;\uC000\uD835\uDD11\u0200Bnpt\u0B22\u0B28\u0B37\u0B3Areak;\u6060BreakingSpace;\u40A0f;\u6115\u0680;CDEGHLNPRSTV\u0B55\u0B56\u0B6A\u0B7C\u0BA1\u0BEB\u0C04\u0C5E\u0C84\u0CA6\u0CD8\u0D61\u0D85\u6AEC\u0100ou\u0B5B\u0B64ngruent;\u6262pCap;\u626DoubleVerticalBar;\u6226\u0180lqx\u0B83\u0B8A\u0B9Bement;\u6209ual\u0100;T\u0B92\u0B93\u6260ilde;\uC000\u2242\u0338ists;\u6204reater\u0380;EFGLST\u0BB6\u0BB7\u0BBD\u0BC9\u0BD3\u0BD8\u0BE5\u626Fqual;\u6271ullEqual;\uC000\u2267\u0338reater;\uC000\u226B\u0338ess;\u6279lantEqual;\uC000\u2A7E\u0338ilde;\u6275ump\u0144\u0BF2\u0BFDownHump;\uC000\u224E\u0338qual;\uC000\u224F\u0338e\u0100fs\u0C0A\u0C27tTriangle\u0180;BE\u0C1A\u0C1B\u0C21\u62EAar;\uC000\u29CF\u0338qual;\u62ECs\u0300;EGLST\u0C35\u0C36\u0C3C\u0C44\u0C4B\u0C58\u626Equal;\u6270reater;\u6278ess;\uC000\u226A\u0338lantEqual;\uC000\u2A7D\u0338ilde;\u6274ested\u0100GL\u0C68\u0C79reaterGreater;\uC000\u2AA2\u0338essLess;\uC000\u2AA1\u0338recedes\u0180;ES\u0C92\u0C93\u0C9B\u6280qual;\uC000\u2AAF\u0338lantEqual;\u62E0\u0100ei\u0CAB\u0CB9verseElement;\u620CghtTriangle\u0180;BE\u0CCB\u0CCC\u0CD2\u62EBar;\uC000\u29D0\u0338qual;\u62ED\u0100qu\u0CDD\u0D0CuareSu\u0100bp\u0CE8\u0CF9set\u0100;E\u0CF0\u0CF3\uC000\u228F\u0338qual;\u62E2erset\u0100;E\u0D03\u0D06\uC000\u2290\u0338qual;\u62E3\u0180bcp\u0D13\u0D24\u0D4Eset\u0100;E\u0D1B\u0D1E\uC000\u2282\u20D2qual;\u6288ceeds\u0200;EST\u0D32\u0D33\u0D3B\u0D46\u6281qual;\uC000\u2AB0\u0338lantEqual;\u62E1ilde;\uC000\u227F\u0338erset\u0100;E\u0D58\u0D5B\uC000\u2283\u20D2qual;\u6289ilde\u0200;EFT\u0D6E\u0D6F\u0D75\u0D7F\u6241qual;\u6244ullEqual;\u6247ilde;\u6249erticalBar;\u6224cr;\uC000\uD835\uDCA9ilde\u803B\xD1\u40D1;\u439D\u0700Eacdfgmoprstuv\u0DBD\u0DC2\u0DC9\u0DD5\u0DDB\u0DE0\u0DE7\u0DFC\u0E02\u0E20\u0E22\u0E32\u0E3F\u0E44lig;\u4152cute\u803B\xD3\u40D3\u0100iy\u0DCE\u0DD3rc\u803B\xD4\u40D4;\u441Eblac;\u4150r;\uC000\uD835\uDD12rave\u803B\xD2\u40D2\u0180aei\u0DEE\u0DF2\u0DF6cr;\u414Cga;\u43A9cron;\u439Fpf;\uC000\uD835\uDD46enCurly\u0100DQ\u0E0E\u0E1AoubleQuote;\u601Cuote;\u6018;\u6A54\u0100cl\u0E27\u0E2Cr;\uC000\uD835\uDCAAash\u803B\xD8\u40D8i\u016C\u0E37\u0E3Cde\u803B\xD5\u40D5es;\u6A37ml\u803B\xD6\u40D6er\u0100BP\u0E4B\u0E60\u0100ar\u0E50\u0E53r;\u603Eac\u0100ek\u0E5A\u0E5C;\u63DEet;\u63B4arenthesis;\u63DC\u0480acfhilors\u0E7F\u0E87\u0E8A\u0E8F\u0E92\u0E94\u0E9D\u0EB0\u0EFCrtialD;\u6202y;\u441Fr;\uC000\uD835\uDD13i;\u43A6;\u43A0usMinus;\u40B1\u0100ip\u0EA2\u0EADncareplan\xE5\u069Df;\u6119\u0200;eio\u0EB9\u0EBA\u0EE0\u0EE4\u6ABBcedes\u0200;EST\u0EC8\u0EC9\u0ECF\u0EDA\u627Aqual;\u6AAFlantEqual;\u627Cilde;\u627Eme;\u6033\u0100dp\u0EE9\u0EEEuct;\u620Fortion\u0100;a\u0225\u0EF9l;\u621D\u0100ci\u0F01\u0F06r;\uC000\uD835\uDCAB;\u43A8\u0200Ufos\u0F11\u0F16\u0F1B\u0F1FOT\u803B\"\u4022r;\uC000\uD835\uDD14pf;\u611Acr;\uC000\uD835\uDCAC\u0600BEacefhiorsu\u0F3E\u0F43\u0F47\u0F60\u0F73\u0FA7\u0FAA\u0FAD\u1096\u10A9\u10B4\u10BEarr;\u6910G\u803B\xAE\u40AE\u0180cnr\u0F4E\u0F53\u0F56ute;\u4154g;\u67EBr\u0100;t\u0F5C\u0F5D\u61A0l;\u6916\u0180aey\u0F67\u0F6C\u0F71ron;\u4158dil;\u4156;\u4420\u0100;v\u0F78\u0F79\u611Cerse\u0100EU\u0F82\u0F99\u0100lq\u0F87\u0F8Eement;\u620Builibrium;\u61CBpEquilibrium;\u696Fr\xBB\u0F79o;\u43A1ght\u0400ACDFTUVa\u0FC1\u0FEB\u0FF3\u1022\u1028\u105B\u1087\u03D8\u0100nr\u0FC6\u0FD2gleBracket;\u67E9row\u0180;BL\u0FDC\u0FDD\u0FE1\u6192ar;\u61E5eftArrow;\u61C4eiling;\u6309o\u01F5\u0FF9\0\u1005bleBracket;\u67E7n\u01D4\u100A\0\u1014eeVector;\u695Dector\u0100;B\u101D\u101E\u61C2ar;\u6955loor;\u630B\u0100er\u102D\u1043e\u0180;AV\u1035\u1036\u103C\u62A2rrow;\u61A6ector;\u695Biangle\u0180;BE\u1050\u1051\u1055\u62B3ar;\u69D0qual;\u62B5p\u0180DTV\u1063\u106E\u1078ownVector;\u694FeeVector;\u695Cector\u0100;B\u1082\u1083\u61BEar;\u6954ector\u0100;B\u1091\u1092\u61C0ar;\u6953\u0100pu\u109B\u109Ef;\u611DndImplies;\u6970ightarrow;\u61DB\u0100ch\u10B9\u10BCr;\u611B;\u61B1leDelayed;\u69F4\u0680HOacfhimoqstu\u10E4\u10F1\u10F7\u10FD\u1119\u111E\u1151\u1156\u1161\u1167\u11B5\u11BB\u11BF\u0100Cc\u10E9\u10EEHcy;\u4429y;\u4428FTcy;\u442Ccute;\u415A\u0280;aeiy\u1108\u1109\u110E\u1113\u1117\u6ABCron;\u4160dil;\u415Erc;\u415C;\u4421r;\uC000\uD835\uDD16ort\u0200DLRU\u112A\u1134\u113E\u1149ownArrow\xBB\u041EeftArrow\xBB\u089AightArrow\xBB\u0FDDpArrow;\u6191gma;\u43A3allCircle;\u6218pf;\uC000\uD835\uDD4A\u0272\u116D\0\0\u1170t;\u621Aare\u0200;ISU\u117B\u117C\u1189\u11AF\u65A1ntersection;\u6293u\u0100bp\u118F\u119Eset\u0100;E\u1197\u1198\u628Fqual;\u6291erset\u0100;E\u11A8\u11A9\u6290qual;\u6292nion;\u6294cr;\uC000\uD835\uDCAEar;\u62C6\u0200bcmp\u11C8\u11DB\u1209\u120B\u0100;s\u11CD\u11CE\u62D0et\u0100;E\u11CD\u11D5qual;\u6286\u0100ch\u11E0\u1205eeds\u0200;EST\u11ED\u11EE\u11F4\u11FF\u627Bqual;\u6AB0lantEqual;\u627Dilde;\u627FTh\xE1\u0F8C;\u6211\u0180;es\u1212\u1213\u1223\u62D1rset\u0100;E\u121C\u121D\u6283qual;\u6287et\xBB\u1213\u0580HRSacfhiors\u123E\u1244\u1249\u1255\u125E\u1271\u1276\u129F\u12C2\u12C8\u12D1ORN\u803B\xDE\u40DEADE;\u6122\u0100Hc\u124E\u1252cy;\u440By;\u4426\u0100bu\u125A\u125C;\u4009;\u43A4\u0180aey\u1265\u126A\u126Fron;\u4164dil;\u4162;\u4422r;\uC000\uD835\uDD17\u0100ei\u127B\u1289\u01F2\u1280\0\u1287efore;\u6234a;\u4398\u0100cn\u128E\u1298kSpace;\uC000\u205F\u200ASpace;\u6009lde\u0200;EFT\u12AB\u12AC\u12B2\u12BC\u623Cqual;\u6243ullEqual;\u6245ilde;\u6248pf;\uC000\uD835\uDD4BipleDot;\u60DB\u0100ct\u12D6\u12DBr;\uC000\uD835\uDCAFrok;\u4166\u0AE1\u12F7\u130E\u131A\u1326\0\u132C\u1331\0\0\0\0\0\u1338\u133D\u1377\u1385\0\u13FF\u1404\u140A\u1410\u0100cr\u12FB\u1301ute\u803B\xDA\u40DAr\u0100;o\u1307\u1308\u619Fcir;\u6949r\u01E3\u1313\0\u1316y;\u440Eve;\u416C\u0100iy\u131E\u1323rc\u803B\xDB\u40DB;\u4423blac;\u4170r;\uC000\uD835\uDD18rave\u803B\xD9\u40D9acr;\u416A\u0100di\u1341\u1369er\u0100BP\u1348\u135D\u0100ar\u134D\u1350r;\u405Fac\u0100ek\u1357\u1359;\u63DFet;\u63B5arenthesis;\u63DDon\u0100;P\u1370\u1371\u62C3lus;\u628E\u0100gp\u137B\u137Fon;\u4172f;\uC000\uD835\uDD4C\u0400ADETadps\u1395\u13AE\u13B8\u13C4\u03E8\u13D2\u13D7\u13F3rrow\u0180;BD\u1150\u13A0\u13A4ar;\u6912ownArrow;\u61C5ownArrow;\u6195quilibrium;\u696Eee\u0100;A\u13CB\u13CC\u62A5rrow;\u61A5own\xE1\u03F3er\u0100LR\u13DE\u13E8eftArrow;\u6196ightArrow;\u6197i\u0100;l\u13F9\u13FA\u43D2on;\u43A5ing;\u416Ecr;\uC000\uD835\uDCB0ilde;\u4168ml\u803B\xDC\u40DC\u0480Dbcdefosv\u1427\u142C\u1430\u1433\u143E\u1485\u148A\u1490\u1496ash;\u62ABar;\u6AEBy;\u4412ash\u0100;l\u143B\u143C\u62A9;\u6AE6\u0100er\u1443\u1445;\u62C1\u0180bty\u144C\u1450\u147Aar;\u6016\u0100;i\u144F\u1455cal\u0200BLST\u1461\u1465\u146A\u1474ar;\u6223ine;\u407Ceparator;\u6758ilde;\u6240ThinSpace;\u600Ar;\uC000\uD835\uDD19pf;\uC000\uD835\uDD4Dcr;\uC000\uD835\uDCB1dash;\u62AA\u0280cefos\u14A7\u14AC\u14B1\u14B6\u14BCirc;\u4174dge;\u62C0r;\uC000\uD835\uDD1Apf;\uC000\uD835\uDD4Ecr;\uC000\uD835\uDCB2\u0200fios\u14CB\u14D0\u14D2\u14D8r;\uC000\uD835\uDD1B;\u439Epf;\uC000\uD835\uDD4Fcr;\uC000\uD835\uDCB3\u0480AIUacfosu\u14F1\u14F5\u14F9\u14FD\u1504\u150F\u1514\u151A\u1520cy;\u442Fcy;\u4407cy;\u442Ecute\u803B\xDD\u40DD\u0100iy\u1509\u150Drc;\u4176;\u442Br;\uC000\uD835\uDD1Cpf;\uC000\uD835\uDD50cr;\uC000\uD835\uDCB4ml;\u4178\u0400Hacdefos\u1535\u1539\u153F\u154B\u154F\u155D\u1560\u1564cy;\u4416cute;\u4179\u0100ay\u1544\u1549ron;\u417D;\u4417ot;\u417B\u01F2\u1554\0\u155BoWidt\xE8\u0AD9a;\u4396r;\u6128pf;\u6124cr;\uC000\uD835\uDCB5\u0BE1\u1583\u158A\u1590\0\u15B0\u15B6\u15BF\0\0\0\0\u15C6\u15DB\u15EB\u165F\u166D\0\u1695\u169B\u16B2\u16B9\0\u16BEcute\u803B\xE1\u40E1reve;\u4103\u0300;Ediuy\u159C\u159D\u15A1\u15A3\u15A8\u15AD\u623E;\uC000\u223E\u0333;\u623Frc\u803B\xE2\u40E2te\u80BB\xB4\u0306;\u4430lig\u803B\xE6\u40E6\u0100;r\xB2\u15BA;\uC000\uD835\uDD1Erave\u803B\xE0\u40E0\u0100ep\u15CA\u15D6\u0100fp\u15CF\u15D4sym;\u6135\xE8\u15D3ha;\u43B1\u0100ap\u15DFc\u0100cl\u15E4\u15E7r;\u4101g;\u6A3F\u0264\u15F0\0\0\u160A\u0280;adsv\u15FA\u15FB\u15FF\u1601\u1607\u6227nd;\u6A55;\u6A5Clope;\u6A58;\u6A5A\u0380;elmrsz\u1618\u1619\u161B\u161E\u163F\u164F\u1659\u6220;\u69A4e\xBB\u1619sd\u0100;a\u1625\u1626\u6221\u0461\u1630\u1632\u1634\u1636\u1638\u163A\u163C\u163E;\u69A8;\u69A9;\u69AA;\u69AB;\u69AC;\u69AD;\u69AE;\u69AFt\u0100;v\u1645\u1646\u621Fb\u0100;d\u164C\u164D\u62BE;\u699D\u0100pt\u1654\u1657h;\u6222\xBB\xB9arr;\u637C\u0100gp\u1663\u1667on;\u4105f;\uC000\uD835\uDD52\u0380;Eaeiop\u12C1\u167B\u167D\u1682\u1684\u1687\u168A;\u6A70cir;\u6A6F;\u624Ad;\u624Bs;\u4027rox\u0100;e\u12C1\u1692\xF1\u1683ing\u803B\xE5\u40E5\u0180cty\u16A1\u16A6\u16A8r;\uC000\uD835\uDCB6;\u402Amp\u0100;e\u12C1\u16AF\xF1\u0288ilde\u803B\xE3\u40E3ml\u803B\xE4\u40E4\u0100ci\u16C2\u16C8onin\xF4\u0272nt;\u6A11\u0800Nabcdefiklnoprsu\u16ED\u16F1\u1730\u173C\u1743\u1748\u1778\u177D\u17E0\u17E6\u1839\u1850\u170D\u193D\u1948\u1970ot;\u6AED\u0100cr\u16F6\u171Ek\u0200ceps\u1700\u1705\u170D\u1713ong;\u624Cpsilon;\u43F6rime;\u6035im\u0100;e\u171A\u171B\u623Dq;\u62CD\u0176\u1722\u1726ee;\u62BDed\u0100;g\u172C\u172D\u6305e\xBB\u172Drk\u0100;t\u135C\u1737brk;\u63B6\u0100oy\u1701\u1741;\u4431quo;\u601E\u0280cmprt\u1753\u175B\u1761\u1764\u1768aus\u0100;e\u010A\u0109ptyv;\u69B0s\xE9\u170Cno\xF5\u0113\u0180ahw\u176F\u1771\u1773;\u43B2;\u6136een;\u626Cr;\uC000\uD835\uDD1Fg\u0380costuvw\u178D\u179D\u17B3\u17C1\u17D5\u17DB\u17DE\u0180aiu\u1794\u1796\u179A\xF0\u0760rc;\u65EFp\xBB\u1371\u0180dpt\u17A4\u17A8\u17ADot;\u6A00lus;\u6A01imes;\u6A02\u0271\u17B9\0\0\u17BEcup;\u6A06ar;\u6605riangle\u0100du\u17CD\u17D2own;\u65BDp;\u65B3plus;\u6A04e\xE5\u1444\xE5\u14ADarow;\u690D\u0180ako\u17ED\u1826\u1835\u0100cn\u17F2\u1823k\u0180lst\u17FA\u05AB\u1802ozenge;\u69EBriangle\u0200;dlr\u1812\u1813\u1818\u181D\u65B4own;\u65BEeft;\u65C2ight;\u65B8k;\u6423\u01B1\u182B\0\u1833\u01B2\u182F\0\u1831;\u6592;\u65914;\u6593ck;\u6588\u0100eo\u183E\u184D\u0100;q\u1843\u1846\uC000=\u20E5uiv;\uC000\u2261\u20E5t;\u6310\u0200ptwx\u1859\u185E\u1867\u186Cf;\uC000\uD835\uDD53\u0100;t\u13CB\u1863om\xBB\u13CCtie;\u62C8\u0600DHUVbdhmptuv\u1885\u1896\u18AA\u18BB\u18D7\u18DB\u18EC\u18FF\u1905\u190A\u1910\u1921\u0200LRlr\u188E\u1890\u1892\u1894;\u6557;\u6554;\u6556;\u6553\u0280;DUdu\u18A1\u18A2\u18A4\u18A6\u18A8\u6550;\u6566;\u6569;\u6564;\u6567\u0200LRlr\u18B3\u18B5\u18B7\u18B9;\u655D;\u655A;\u655C;\u6559\u0380;HLRhlr\u18CA\u18CB\u18CD\u18CF\u18D1\u18D3\u18D5\u6551;\u656C;\u6563;\u6560;\u656B;\u6562;\u655Fox;\u69C9\u0200LRlr\u18E4\u18E6\u18E8\u18EA;\u6555;\u6552;\u6510;\u650C\u0280;DUdu\u06BD\u18F7\u18F9\u18FB\u18FD;\u6565;\u6568;\u652C;\u6534inus;\u629Flus;\u629Eimes;\u62A0\u0200LRlr\u1919\u191B\u191D\u191F;\u655B;\u6558;\u6518;\u6514\u0380;HLRhlr\u1930\u1931\u1933\u1935\u1937\u1939\u193B\u6502;\u656A;\u6561;\u655E;\u653C;\u6524;\u651C\u0100ev\u0123\u1942bar\u803B\xA6\u40A6\u0200ceio\u1951\u1956\u195A\u1960r;\uC000\uD835\uDCB7mi;\u604Fm\u0100;e\u171A\u171Cl\u0180;bh\u1968\u1969\u196B\u405C;\u69C5sub;\u67C8\u016C\u1974\u197El\u0100;e\u1979\u197A\u6022t\xBB\u197Ap\u0180;Ee\u012F\u1985\u1987;\u6AAE\u0100;q\u06DC\u06DB\u0CE1\u19A7\0\u19E8\u1A11\u1A15\u1A32\0\u1A37\u1A50\0\0\u1AB4\0\0\u1AC1\0\0\u1B21\u1B2E\u1B4D\u1B52\0\u1BFD\0\u1C0C\u0180cpr\u19AD\u19B2\u19DDute;\u4107\u0300;abcds\u19BF\u19C0\u19C4\u19CA\u19D5\u19D9\u6229nd;\u6A44rcup;\u6A49\u0100au\u19CF\u19D2p;\u6A4Bp;\u6A47ot;\u6A40;\uC000\u2229\uFE00\u0100eo\u19E2\u19E5t;\u6041\xEE\u0693\u0200aeiu\u19F0\u19FB\u1A01\u1A05\u01F0\u19F5\0\u19F8s;\u6A4Don;\u410Ddil\u803B\xE7\u40E7rc;\u4109ps\u0100;s\u1A0C\u1A0D\u6A4Cm;\u6A50ot;\u410B\u0180dmn\u1A1B\u1A20\u1A26il\u80BB\xB8\u01ADptyv;\u69B2t\u8100\xA2;e\u1A2D\u1A2E\u40A2r\xE4\u01B2r;\uC000\uD835\uDD20\u0180cei\u1A3D\u1A40\u1A4Dy;\u4447ck\u0100;m\u1A47\u1A48\u6713ark\xBB\u1A48;\u43C7r\u0380;Ecefms\u1A5F\u1A60\u1A62\u1A6B\u1AA4\u1AAA\u1AAE\u65CB;\u69C3\u0180;el\u1A69\u1A6A\u1A6D\u42C6q;\u6257e\u0261\u1A74\0\0\u1A88rrow\u0100lr\u1A7C\u1A81eft;\u61BAight;\u61BB\u0280RSacd\u1A92\u1A94\u1A96\u1A9A\u1A9F\xBB\u0F47;\u64C8st;\u629Birc;\u629Aash;\u629Dnint;\u6A10id;\u6AEFcir;\u69C2ubs\u0100;u\u1ABB\u1ABC\u6663it\xBB\u1ABC\u02EC\u1AC7\u1AD4\u1AFA\0\u1B0Aon\u0100;e\u1ACD\u1ACE\u403A\u0100;q\xC7\xC6\u026D\u1AD9\0\0\u1AE2a\u0100;t\u1ADE\u1ADF\u402C;\u4040\u0180;fl\u1AE8\u1AE9\u1AEB\u6201\xEE\u1160e\u0100mx\u1AF1\u1AF6ent\xBB\u1AE9e\xF3\u024D\u01E7\u1AFE\0\u1B07\u0100;d\u12BB\u1B02ot;\u6A6Dn\xF4\u0246\u0180fry\u1B10\u1B14\u1B17;\uC000\uD835\uDD54o\xE4\u0254\u8100\xA9;s\u0155\u1B1Dr;\u6117\u0100ao\u1B25\u1B29rr;\u61B5ss;\u6717\u0100cu\u1B32\u1B37r;\uC000\uD835\uDCB8\u0100bp\u1B3C\u1B44\u0100;e\u1B41\u1B42\u6ACF;\u6AD1\u0100;e\u1B49\u1B4A\u6AD0;\u6AD2dot;\u62EF\u0380delprvw\u1B60\u1B6C\u1B77\u1B82\u1BAC\u1BD4\u1BF9arr\u0100lr\u1B68\u1B6A;\u6938;\u6935\u0270\u1B72\0\0\u1B75r;\u62DEc;\u62DFarr\u0100;p\u1B7F\u1B80\u61B6;\u693D\u0300;bcdos\u1B8F\u1B90\u1B96\u1BA1\u1BA5\u1BA8\u622Arcap;\u6A48\u0100au\u1B9B\u1B9Ep;\u6A46p;\u6A4Aot;\u628Dr;\u6A45;\uC000\u222A\uFE00\u0200alrv\u1BB5\u1BBF\u1BDE\u1BE3rr\u0100;m\u1BBC\u1BBD\u61B7;\u693Cy\u0180evw\u1BC7\u1BD4\u1BD8q\u0270\u1BCE\0\0\u1BD2re\xE3\u1B73u\xE3\u1B75ee;\u62CEedge;\u62CFen\u803B\xA4\u40A4earrow\u0100lr\u1BEE\u1BF3eft\xBB\u1B80ight\xBB\u1BBDe\xE4\u1BDD\u0100ci\u1C01\u1C07onin\xF4\u01F7nt;\u6231lcty;\u632D\u0980AHabcdefhijlorstuwz\u1C38\u1C3B\u1C3F\u1C5D\u1C69\u1C75\u1C8A\u1C9E\u1CAC\u1CB7\u1CFB\u1CFF\u1D0D\u1D7B\u1D91\u1DAB\u1DBB\u1DC6\u1DCDr\xF2\u0381ar;\u6965\u0200glrs\u1C48\u1C4D\u1C52\u1C54ger;\u6020eth;\u6138\xF2\u1133h\u0100;v\u1C5A\u1C5B\u6010\xBB\u090A\u016B\u1C61\u1C67arow;\u690Fa\xE3\u0315\u0100ay\u1C6E\u1C73ron;\u410F;\u4434\u0180;ao\u0332\u1C7C\u1C84\u0100gr\u02BF\u1C81r;\u61CAtseq;\u6A77\u0180glm\u1C91\u1C94\u1C98\u803B\xB0\u40B0ta;\u43B4ptyv;\u69B1\u0100ir\u1CA3\u1CA8sht;\u697F;\uC000\uD835\uDD21ar\u0100lr\u1CB3\u1CB5\xBB\u08DC\xBB\u101E\u0280aegsv\u1CC2\u0378\u1CD6\u1CDC\u1CE0m\u0180;os\u0326\u1CCA\u1CD4nd\u0100;s\u0326\u1CD1uit;\u6666amma;\u43DDin;\u62F2\u0180;io\u1CE7\u1CE8\u1CF8\u40F7de\u8100\xF7;o\u1CE7\u1CF0ntimes;\u62C7n\xF8\u1CF7cy;\u4452c\u026F\u1D06\0\0\u1D0Arn;\u631Eop;\u630D\u0280lptuw\u1D18\u1D1D\u1D22\u1D49\u1D55lar;\u4024f;\uC000\uD835\uDD55\u0280;emps\u030B\u1D2D\u1D37\u1D3D\u1D42q\u0100;d\u0352\u1D33ot;\u6251inus;\u6238lus;\u6214quare;\u62A1blebarwedg\xE5\xFAn\u0180adh\u112E\u1D5D\u1D67ownarrow\xF3\u1C83arpoon\u0100lr\u1D72\u1D76ef\xF4\u1CB4igh\xF4\u1CB6\u0162\u1D7F\u1D85karo\xF7\u0F42\u026F\u1D8A\0\0\u1D8Ern;\u631Fop;\u630C\u0180cot\u1D98\u1DA3\u1DA6\u0100ry\u1D9D\u1DA1;\uC000\uD835\uDCB9;\u4455l;\u69F6rok;\u4111\u0100dr\u1DB0\u1DB4ot;\u62F1i\u0100;f\u1DBA\u1816\u65BF\u0100ah\u1DC0\u1DC3r\xF2\u0429a\xF2\u0FA6angle;\u69A6\u0100ci\u1DD2\u1DD5y;\u445Fgrarr;\u67FF\u0900Dacdefglmnopqrstux\u1E01\u1E09\u1E19\u1E38\u0578\u1E3C\u1E49\u1E61\u1E7E\u1EA5\u1EAF\u1EBD\u1EE1\u1F2A\u1F37\u1F44\u1F4E\u1F5A\u0100Do\u1E06\u1D34o\xF4\u1C89\u0100cs\u1E0E\u1E14ute\u803B\xE9\u40E9ter;\u6A6E\u0200aioy\u1E22\u1E27\u1E31\u1E36ron;\u411Br\u0100;c\u1E2D\u1E2E\u6256\u803B\xEA\u40EAlon;\u6255;\u444Dot;\u4117\u0100Dr\u1E41\u1E45ot;\u6252;\uC000\uD835\uDD22\u0180;rs\u1E50\u1E51\u1E57\u6A9Aave\u803B\xE8\u40E8\u0100;d\u1E5C\u1E5D\u6A96ot;\u6A98\u0200;ils\u1E6A\u1E6B\u1E72\u1E74\u6A99nters;\u63E7;\u6113\u0100;d\u1E79\u1E7A\u6A95ot;\u6A97\u0180aps\u1E85\u1E89\u1E97cr;\u4113ty\u0180;sv\u1E92\u1E93\u1E95\u6205et\xBB\u1E93p\u01001;\u1E9D\u1EA4\u0133\u1EA1\u1EA3;\u6004;\u6005\u6003\u0100gs\u1EAA\u1EAC;\u414Bp;\u6002\u0100gp\u1EB4\u1EB8on;\u4119f;\uC000\uD835\uDD56\u0180als\u1EC4\u1ECE\u1ED2r\u0100;s\u1ECA\u1ECB\u62D5l;\u69E3us;\u6A71i\u0180;lv\u1EDA\u1EDB\u1EDF\u43B5on\xBB\u1EDB;\u43F5\u0200csuv\u1EEA\u1EF3\u1F0B\u1F23\u0100io\u1EEF\u1E31rc\xBB\u1E2E\u0269\u1EF9\0\0\u1EFB\xED\u0548ant\u0100gl\u1F02\u1F06tr\xBB\u1E5Dess\xBB\u1E7A\u0180aei\u1F12\u1F16\u1F1Als;\u403Dst;\u625Fv\u0100;D\u0235\u1F20D;\u6A78parsl;\u69E5\u0100Da\u1F2F\u1F33ot;\u6253rr;\u6971\u0180cdi\u1F3E\u1F41\u1EF8r;\u612Fo\xF4\u0352\u0100ah\u1F49\u1F4B;\u43B7\u803B\xF0\u40F0\u0100mr\u1F53\u1F57l\u803B\xEB\u40EBo;\u60AC\u0180cip\u1F61\u1F64\u1F67l;\u4021s\xF4\u056E\u0100eo\u1F6C\u1F74ctatio\xEE\u0559nential\xE5\u0579\u09E1\u1F92\0\u1F9E\0\u1FA1\u1FA7\0\0\u1FC6\u1FCC\0\u1FD3\0\u1FE6\u1FEA\u2000\0\u2008\u205Allingdotse\xF1\u1E44y;\u4444male;\u6640\u0180ilr\u1FAD\u1FB3\u1FC1lig;\u8000\uFB03\u0269\u1FB9\0\0\u1FBDg;\u8000\uFB00ig;\u8000\uFB04;\uC000\uD835\uDD23lig;\u8000\uFB01lig;\uC000fj\u0180alt\u1FD9\u1FDC\u1FE1t;\u666Dig;\u8000\uFB02ns;\u65B1of;\u4192\u01F0\u1FEE\0\u1FF3f;\uC000\uD835\uDD57\u0100ak\u05BF\u1FF7\u0100;v\u1FFC\u1FFD\u62D4;\u6AD9artint;\u6A0D\u0100ao\u200C\u2055\u0100cs\u2011\u2052\u03B1\u201A\u2030\u2038\u2045\u2048\0\u2050\u03B2\u2022\u2025\u2027\u202A\u202C\0\u202E\u803B\xBD\u40BD;\u6153\u803B\xBC\u40BC;\u6155;\u6159;\u615B\u01B3\u2034\0\u2036;\u6154;\u6156\u02B4\u203E\u2041\0\0\u2043\u803B\xBE\u40BE;\u6157;\u615C5;\u6158\u01B6\u204C\0\u204E;\u615A;\u615D8;\u615El;\u6044wn;\u6322cr;\uC000\uD835\uDCBB\u0880Eabcdefgijlnorstv\u2082\u2089\u209F\u20A5\u20B0\u20B4\u20F0\u20F5\u20FA\u20FF\u2103\u2112\u2138\u0317\u213E\u2152\u219E\u0100;l\u064D\u2087;\u6A8C\u0180cmp\u2090\u2095\u209Dute;\u41F5ma\u0100;d\u209C\u1CDA\u43B3;\u6A86reve;\u411F\u0100iy\u20AA\u20AErc;\u411D;\u4433ot;\u4121\u0200;lqs\u063E\u0642\u20BD\u20C9\u0180;qs\u063E\u064C\u20C4lan\xF4\u0665\u0200;cdl\u0665\u20D2\u20D5\u20E5c;\u6AA9ot\u0100;o\u20DC\u20DD\u6A80\u0100;l\u20E2\u20E3\u6A82;\u6A84\u0100;e\u20EA\u20ED\uC000\u22DB\uFE00s;\u6A94r;\uC000\uD835\uDD24\u0100;g\u0673\u061Bmel;\u6137cy;\u4453\u0200;Eaj\u065A\u210C\u210E\u2110;\u6A92;\u6AA5;\u6AA4\u0200Eaes\u211B\u211D\u2129\u2134;\u6269p\u0100;p\u2123\u2124\u6A8Arox\xBB\u2124\u0100;q\u212E\u212F\u6A88\u0100;q\u212E\u211Bim;\u62E7pf;\uC000\uD835\uDD58\u0100ci\u2143\u2146r;\u610Am\u0180;el\u066B\u214E\u2150;\u6A8E;\u6A90\u8300>;cdlqr\u05EE\u2160\u216A\u216E\u2173\u2179\u0100ci\u2165\u2167;\u6AA7r;\u6A7Aot;\u62D7Par;\u6995uest;\u6A7C\u0280adels\u2184\u216A\u2190\u0656\u219B\u01F0\u2189\0\u218Epro\xF8\u209Er;\u6978q\u0100lq\u063F\u2196les\xF3\u2088i\xED\u066B\u0100en\u21A3\u21ADrtneqq;\uC000\u2269\uFE00\xC5\u21AA\u0500Aabcefkosy\u21C4\u21C7\u21F1\u21F5\u21FA\u2218\u221D\u222F\u2268\u227Dr\xF2\u03A0\u0200ilmr\u21D0\u21D4\u21D7\u21DBrs\xF0\u1484f\xBB\u2024il\xF4\u06A9\u0100dr\u21E0\u21E4cy;\u444A\u0180;cw\u08F4\u21EB\u21EFir;\u6948;\u61ADar;\u610Firc;\u4125\u0180alr\u2201\u220E\u2213rts\u0100;u\u2209\u220A\u6665it\xBB\u220Alip;\u6026con;\u62B9r;\uC000\uD835\uDD25s\u0100ew\u2223\u2229arow;\u6925arow;\u6926\u0280amopr\u223A\u223E\u2243\u225E\u2263rr;\u61FFtht;\u623Bk\u0100lr\u2249\u2253eftarrow;\u61A9ightarrow;\u61AAf;\uC000\uD835\uDD59bar;\u6015\u0180clt\u226F\u2274\u2278r;\uC000\uD835\uDCBDas\xE8\u21F4rok;\u4127\u0100bp\u2282\u2287ull;\u6043hen\xBB\u1C5B\u0AE1\u22A3\0\u22AA\0\u22B8\u22C5\u22CE\0\u22D5\u22F3\0\0\u22F8\u2322\u2367\u2362\u237F\0\u2386\u23AA\u23B4cute\u803B\xED\u40ED\u0180;iy\u0771\u22B0\u22B5rc\u803B\xEE\u40EE;\u4438\u0100cx\u22BC\u22BFy;\u4435cl\u803B\xA1\u40A1\u0100fr\u039F\u22C9;\uC000\uD835\uDD26rave\u803B\xEC\u40EC\u0200;ino\u073E\u22DD\u22E9\u22EE\u0100in\u22E2\u22E6nt;\u6A0Ct;\u622Dfin;\u69DCta;\u6129lig;\u4133\u0180aop\u22FE\u231A\u231D\u0180cgt\u2305\u2308\u2317r;\u412B\u0180elp\u071F\u230F\u2313in\xE5\u078Ear\xF4\u0720h;\u4131f;\u62B7ed;\u41B5\u0280;cfot\u04F4\u232C\u2331\u233D\u2341are;\u6105in\u0100;t\u2338\u2339\u621Eie;\u69DDdo\xF4\u2319\u0280;celp\u0757\u234C\u2350\u235B\u2361al;\u62BA\u0100gr\u2355\u2359er\xF3\u1563\xE3\u234Darhk;\u6A17rod;\u6A3C\u0200cgpt\u236F\u2372\u2376\u237By;\u4451on;\u412Ff;\uC000\uD835\uDD5Aa;\u43B9uest\u803B\xBF\u40BF\u0100ci\u238A\u238Fr;\uC000\uD835\uDCBEn\u0280;Edsv\u04F4\u239B\u239D\u23A1\u04F3;\u62F9ot;\u62F5\u0100;v\u23A6\u23A7\u62F4;\u62F3\u0100;i\u0777\u23AElde;\u4129\u01EB\u23B8\0\u23BCcy;\u4456l\u803B\xEF\u40EF\u0300cfmosu\u23CC\u23D7\u23DC\u23E1\u23E7\u23F5\u0100iy\u23D1\u23D5rc;\u4135;\u4439r;\uC000\uD835\uDD27ath;\u4237pf;\uC000\uD835\uDD5B\u01E3\u23EC\0\u23F1r;\uC000\uD835\uDCBFrcy;\u4458kcy;\u4454\u0400acfghjos\u240B\u2416\u2422\u2427\u242D\u2431\u2435\u243Bppa\u0100;v\u2413\u2414\u43BA;\u43F0\u0100ey\u241B\u2420dil;\u4137;\u443Ar;\uC000\uD835\uDD28reen;\u4138cy;\u4445cy;\u445Cpf;\uC000\uD835\uDD5Ccr;\uC000\uD835\uDCC0\u0B80ABEHabcdefghjlmnoprstuv\u2470\u2481\u2486\u248D\u2491\u250E\u253D\u255A\u2580\u264E\u265E\u2665\u2679\u267D\u269A\u26B2\u26D8\u275D\u2768\u278B\u27C0\u2801\u2812\u0180art\u2477\u247A\u247Cr\xF2\u09C6\xF2\u0395ail;\u691Barr;\u690E\u0100;g\u0994\u248B;\u6A8Bar;\u6962\u0963\u24A5\0\u24AA\0\u24B1\0\0\0\0\0\u24B5\u24BA\0\u24C6\u24C8\u24CD\0\u24F9ute;\u413Amptyv;\u69B4ra\xEE\u084Cbda;\u43BBg\u0180;dl\u088E\u24C1\u24C3;\u6991\xE5\u088E;\u6A85uo\u803B\xAB\u40ABr\u0400;bfhlpst\u0899\u24DE\u24E6\u24E9\u24EB\u24EE\u24F1\u24F5\u0100;f\u089D\u24E3s;\u691Fs;\u691D\xEB\u2252p;\u61ABl;\u6939im;\u6973l;\u61A2\u0180;ae\u24FF\u2500\u2504\u6AABil;\u6919\u0100;s\u2509\u250A\u6AAD;\uC000\u2AAD\uFE00\u0180abr\u2515\u2519\u251Drr;\u690Crk;\u6772\u0100ak\u2522\u252Cc\u0100ek\u2528\u252A;\u407B;\u405B\u0100es\u2531\u2533;\u698Bl\u0100du\u2539\u253B;\u698F;\u698D\u0200aeuy\u2546\u254B\u2556\u2558ron;\u413E\u0100di\u2550\u2554il;\u413C\xEC\u08B0\xE2\u2529;\u443B\u0200cqrs\u2563\u2566\u256D\u257Da;\u6936uo\u0100;r\u0E19\u1746\u0100du\u2572\u2577har;\u6967shar;\u694Bh;\u61B2\u0280;fgqs\u258B\u258C\u0989\u25F3\u25FF\u6264t\u0280ahlrt\u2598\u25A4\u25B7\u25C2\u25E8rrow\u0100;t\u0899\u25A1a\xE9\u24F6arpoon\u0100du\u25AF\u25B4own\xBB\u045Ap\xBB\u0966eftarrows;\u61C7ight\u0180ahs\u25CD\u25D6\u25DErrow\u0100;s\u08F4\u08A7arpoon\xF3\u0F98quigarro\xF7\u21F0hreetimes;\u62CB\u0180;qs\u258B\u0993\u25FAlan\xF4\u09AC\u0280;cdgs\u09AC\u260A\u260D\u261D\u2628c;\u6AA8ot\u0100;o\u2614\u2615\u6A7F\u0100;r\u261A\u261B\u6A81;\u6A83\u0100;e\u2622\u2625\uC000\u22DA\uFE00s;\u6A93\u0280adegs\u2633\u2639\u263D\u2649\u264Bppro\xF8\u24C6ot;\u62D6q\u0100gq\u2643\u2645\xF4\u0989gt\xF2\u248C\xF4\u099Bi\xED\u09B2\u0180ilr\u2655\u08E1\u265Asht;\u697C;\uC000\uD835\uDD29\u0100;E\u099C\u2663;\u6A91\u0161\u2669\u2676r\u0100du\u25B2\u266E\u0100;l\u0965\u2673;\u696Alk;\u6584cy;\u4459\u0280;acht\u0A48\u2688\u268B\u2691\u2696r\xF2\u25C1orne\xF2\u1D08ard;\u696Bri;\u65FA\u0100io\u269F\u26A4dot;\u4140ust\u0100;a\u26AC\u26AD\u63B0che\xBB\u26AD\u0200Eaes\u26BB\u26BD\u26C9\u26D4;\u6268p\u0100;p\u26C3\u26C4\u6A89rox\xBB\u26C4\u0100;q\u26CE\u26CF\u6A87\u0100;q\u26CE\u26BBim;\u62E6\u0400abnoptwz\u26E9\u26F4\u26F7\u271A\u272F\u2741\u2747\u2750\u0100nr\u26EE\u26F1g;\u67ECr;\u61FDr\xEB\u08C1g\u0180lmr\u26FF\u270D\u2714eft\u0100ar\u09E6\u2707ight\xE1\u09F2apsto;\u67FCight\xE1\u09FDparrow\u0100lr\u2725\u2729ef\xF4\u24EDight;\u61AC\u0180afl\u2736\u2739\u273Dr;\u6985;\uC000\uD835\uDD5Dus;\u6A2Dimes;\u6A34\u0161\u274B\u274Fst;\u6217\xE1\u134E\u0180;ef\u2757\u2758\u1800\u65CAnge\xBB\u2758ar\u0100;l\u2764\u2765\u4028t;\u6993\u0280achmt\u2773\u2776\u277C\u2785\u2787r\xF2\u08A8orne\xF2\u1D8Car\u0100;d\u0F98\u2783;\u696D;\u600Eri;\u62BF\u0300achiqt\u2798\u279D\u0A40\u27A2\u27AE\u27BBquo;\u6039r;\uC000\uD835\uDCC1m\u0180;eg\u09B2\u27AA\u27AC;\u6A8D;\u6A8F\u0100bu\u252A\u27B3o\u0100;r\u0E1F\u27B9;\u601Arok;\u4142\u8400<;cdhilqr\u082B\u27D2\u2639\u27DC\u27E0\u27E5\u27EA\u27F0\u0100ci\u27D7\u27D9;\u6AA6r;\u6A79re\xE5\u25F2mes;\u62C9arr;\u6976uest;\u6A7B\u0100Pi\u27F5\u27F9ar;\u6996\u0180;ef\u2800\u092D\u181B\u65C3r\u0100du\u2807\u280Dshar;\u694Ahar;\u6966\u0100en\u2817\u2821rtneqq;\uC000\u2268\uFE00\xC5\u281E\u0700Dacdefhilnopsu\u2840\u2845\u2882\u288E\u2893\u28A0\u28A5\u28A8\u28DA\u28E2\u28E4\u0A83\u28F3\u2902Dot;\u623A\u0200clpr\u284E\u2852\u2863\u287Dr\u803B\xAF\u40AF\u0100et\u2857\u2859;\u6642\u0100;e\u285E\u285F\u6720se\xBB\u285F\u0100;s\u103B\u2868to\u0200;dlu\u103B\u2873\u2877\u287Bow\xEE\u048Cef\xF4\u090F\xF0\u13D1ker;\u65AE\u0100oy\u2887\u288Cmma;\u6A29;\u443Cash;\u6014asuredangle\xBB\u1626r;\uC000\uD835\uDD2Ao;\u6127\u0180cdn\u28AF\u28B4\u28C9ro\u803B\xB5\u40B5\u0200;acd\u1464\u28BD\u28C0\u28C4s\xF4\u16A7ir;\u6AF0ot\u80BB\xB7\u01B5us\u0180;bd\u28D2\u1903\u28D3\u6212\u0100;u\u1D3C\u28D8;\u6A2A\u0163\u28DE\u28E1p;\u6ADB\xF2\u2212\xF0\u0A81\u0100dp\u28E9\u28EEels;\u62A7f;\uC000\uD835\uDD5E\u0100ct\u28F8\u28FDr;\uC000\uD835\uDCC2pos\xBB\u159D\u0180;lm\u2909\u290A\u290D\u43BCtimap;\u62B8\u0C00GLRVabcdefghijlmoprstuvw\u2942\u2953\u297E\u2989\u2998\u29DA\u29E9\u2A15\u2A1A\u2A58\u2A5D\u2A83\u2A95\u2AA4\u2AA8\u2B04\u2B07\u2B44\u2B7F\u2BAE\u2C34\u2C67\u2C7C\u2CE9\u0100gt\u2947\u294B;\uC000\u22D9\u0338\u0100;v\u2950\u0BCF\uC000\u226B\u20D2\u0180elt\u295A\u2972\u2976ft\u0100ar\u2961\u2967rrow;\u61CDightarrow;\u61CE;\uC000\u22D8\u0338\u0100;v\u297B\u0C47\uC000\u226A\u20D2ightarrow;\u61CF\u0100Dd\u298E\u2993ash;\u62AFash;\u62AE\u0280bcnpt\u29A3\u29A7\u29AC\u29B1\u29CCla\xBB\u02DEute;\u4144g;\uC000\u2220\u20D2\u0280;Eiop\u0D84\u29BC\u29C0\u29C5\u29C8;\uC000\u2A70\u0338d;\uC000\u224B\u0338s;\u4149ro\xF8\u0D84ur\u0100;a\u29D3\u29D4\u666El\u0100;s\u29D3\u0B38\u01F3\u29DF\0\u29E3p\u80BB\xA0\u0B37mp\u0100;e\u0BF9\u0C00\u0280aeouy\u29F4\u29FE\u2A03\u2A10\u2A13\u01F0\u29F9\0\u29FB;\u6A43on;\u4148dil;\u4146ng\u0100;d\u0D7E\u2A0Aot;\uC000\u2A6D\u0338p;\u6A42;\u443Dash;\u6013\u0380;Aadqsx\u0B92\u2A29\u2A2D\u2A3B\u2A41\u2A45\u2A50rr;\u61D7r\u0100hr\u2A33\u2A36k;\u6924\u0100;o\u13F2\u13F0ot;\uC000\u2250\u0338ui\xF6\u0B63\u0100ei\u2A4A\u2A4Ear;\u6928\xED\u0B98ist\u0100;s\u0BA0\u0B9Fr;\uC000\uD835\uDD2B\u0200Eest\u0BC5\u2A66\u2A79\u2A7C\u0180;qs\u0BBC\u2A6D\u0BE1\u0180;qs\u0BBC\u0BC5\u2A74lan\xF4\u0BE2i\xED\u0BEA\u0100;r\u0BB6\u2A81\xBB\u0BB7\u0180Aap\u2A8A\u2A8D\u2A91r\xF2\u2971rr;\u61AEar;\u6AF2\u0180;sv\u0F8D\u2A9C\u0F8C\u0100;d\u2AA1\u2AA2\u62FC;\u62FAcy;\u445A\u0380AEadest\u2AB7\u2ABA\u2ABE\u2AC2\u2AC5\u2AF6\u2AF9r\xF2\u2966;\uC000\u2266\u0338rr;\u619Ar;\u6025\u0200;fqs\u0C3B\u2ACE\u2AE3\u2AEFt\u0100ar\u2AD4\u2AD9rro\xF7\u2AC1ightarro\xF7\u2A90\u0180;qs\u0C3B\u2ABA\u2AEAlan\xF4\u0C55\u0100;s\u0C55\u2AF4\xBB\u0C36i\xED\u0C5D\u0100;r\u0C35\u2AFEi\u0100;e\u0C1A\u0C25i\xE4\u0D90\u0100pt\u2B0C\u2B11f;\uC000\uD835\uDD5F\u8180\xAC;in\u2B19\u2B1A\u2B36\u40ACn\u0200;Edv\u0B89\u2B24\u2B28\u2B2E;\uC000\u22F9\u0338ot;\uC000\u22F5\u0338\u01E1\u0B89\u2B33\u2B35;\u62F7;\u62F6i\u0100;v\u0CB8\u2B3C\u01E1\u0CB8\u2B41\u2B43;\u62FE;\u62FD\u0180aor\u2B4B\u2B63\u2B69r\u0200;ast\u0B7B\u2B55\u2B5A\u2B5Flle\xEC\u0B7Bl;\uC000\u2AFD\u20E5;\uC000\u2202\u0338lint;\u6A14\u0180;ce\u0C92\u2B70\u2B73u\xE5\u0CA5\u0100;c\u0C98\u2B78\u0100;e\u0C92\u2B7D\xF1\u0C98\u0200Aait\u2B88\u2B8B\u2B9D\u2BA7r\xF2\u2988rr\u0180;cw\u2B94\u2B95\u2B99\u619B;\uC000\u2933\u0338;\uC000\u219D\u0338ghtarrow\xBB\u2B95ri\u0100;e\u0CCB\u0CD6\u0380chimpqu\u2BBD\u2BCD\u2BD9\u2B04\u0B78\u2BE4\u2BEF\u0200;cer\u0D32\u2BC6\u0D37\u2BC9u\xE5\u0D45;\uC000\uD835\uDCC3ort\u026D\u2B05\0\0\u2BD6ar\xE1\u2B56m\u0100;e\u0D6E\u2BDF\u0100;q\u0D74\u0D73su\u0100bp\u2BEB\u2BED\xE5\u0CF8\xE5\u0D0B\u0180bcp\u2BF6\u2C11\u2C19\u0200;Ees\u2BFF\u2C00\u0D22\u2C04\u6284;\uC000\u2AC5\u0338et\u0100;e\u0D1B\u2C0Bq\u0100;q\u0D23\u2C00c\u0100;e\u0D32\u2C17\xF1\u0D38\u0200;Ees\u2C22\u2C23\u0D5F\u2C27\u6285;\uC000\u2AC6\u0338et\u0100;e\u0D58\u2C2Eq\u0100;q\u0D60\u2C23\u0200gilr\u2C3D\u2C3F\u2C45\u2C47\xEC\u0BD7lde\u803B\xF1\u40F1\xE7\u0C43iangle\u0100lr\u2C52\u2C5Ceft\u0100;e\u0C1A\u2C5A\xF1\u0C26ight\u0100;e\u0CCB\u2C65\xF1\u0CD7\u0100;m\u2C6C\u2C6D\u43BD\u0180;es\u2C74\u2C75\u2C79\u4023ro;\u6116p;\u6007\u0480DHadgilrs\u2C8F\u2C94\u2C99\u2C9E\u2CA3\u2CB0\u2CB6\u2CD3\u2CE3ash;\u62ADarr;\u6904p;\uC000\u224D\u20D2ash;\u62AC\u0100et\u2CA8\u2CAC;\uC000\u2265\u20D2;\uC000>\u20D2nfin;\u69DE\u0180Aet\u2CBD\u2CC1\u2CC5rr;\u6902;\uC000\u2264\u20D2\u0100;r\u2CCA\u2CCD\uC000<\u20D2ie;\uC000\u22B4\u20D2\u0100At\u2CD8\u2CDCrr;\u6903rie;\uC000\u22B5\u20D2im;\uC000\u223C\u20D2\u0180Aan\u2CF0\u2CF4\u2D02rr;\u61D6r\u0100hr\u2CFA\u2CFDk;\u6923\u0100;o\u13E7\u13E5ear;\u6927\u1253\u1A95\0\0\0\0\0\0\0\0\0\0\0\0\0\u2D2D\0\u2D38\u2D48\u2D60\u2D65\u2D72\u2D84\u1B07\0\0\u2D8D\u2DAB\0\u2DC8\u2DCE\0\u2DDC\u2E19\u2E2B\u2E3E\u2E43\u0100cs\u2D31\u1A97ute\u803B\xF3\u40F3\u0100iy\u2D3C\u2D45r\u0100;c\u1A9E\u2D42\u803B\xF4\u40F4;\u443E\u0280abios\u1AA0\u2D52\u2D57\u01C8\u2D5Alac;\u4151v;\u6A38old;\u69BClig;\u4153\u0100cr\u2D69\u2D6Dir;\u69BF;\uC000\uD835\uDD2C\u036F\u2D79\0\0\u2D7C\0\u2D82n;\u42DBave\u803B\xF2\u40F2;\u69C1\u0100bm\u2D88\u0DF4ar;\u69B5\u0200acit\u2D95\u2D98\u2DA5\u2DA8r\xF2\u1A80\u0100ir\u2D9D\u2DA0r;\u69BEoss;\u69BBn\xE5\u0E52;\u69C0\u0180aei\u2DB1\u2DB5\u2DB9cr;\u414Dga;\u43C9\u0180cdn\u2DC0\u2DC5\u01CDron;\u43BF;\u69B6pf;\uC000\uD835\uDD60\u0180ael\u2DD4\u2DD7\u01D2r;\u69B7rp;\u69B9\u0380;adiosv\u2DEA\u2DEB\u2DEE\u2E08\u2E0D\u2E10\u2E16\u6228r\xF2\u1A86\u0200;efm\u2DF7\u2DF8\u2E02\u2E05\u6A5Dr\u0100;o\u2DFE\u2DFF\u6134f\xBB\u2DFF\u803B\xAA\u40AA\u803B\xBA\u40BAgof;\u62B6r;\u6A56lope;\u6A57;\u6A5B\u0180clo\u2E1F\u2E21\u2E27\xF2\u2E01ash\u803B\xF8\u40F8l;\u6298i\u016C\u2E2F\u2E34de\u803B\xF5\u40F5es\u0100;a\u01DB\u2E3As;\u6A36ml\u803B\xF6\u40F6bar;\u633D\u0AE1\u2E5E\0\u2E7D\0\u2E80\u2E9D\0\u2EA2\u2EB9\0\0\u2ECB\u0E9C\0\u2F13\0\0\u2F2B\u2FBC\0\u2FC8r\u0200;ast\u0403\u2E67\u2E72\u0E85\u8100\xB6;l\u2E6D\u2E6E\u40B6le\xEC\u0403\u0269\u2E78\0\0\u2E7Bm;\u6AF3;\u6AFDy;\u443Fr\u0280cimpt\u2E8B\u2E8F\u2E93\u1865\u2E97nt;\u4025od;\u402Eil;\u6030enk;\u6031r;\uC000\uD835\uDD2D\u0180imo\u2EA8\u2EB0\u2EB4\u0100;v\u2EAD\u2EAE\u43C6;\u43D5ma\xF4\u0A76ne;\u660E\u0180;tv\u2EBF\u2EC0\u2EC8\u43C0chfork\xBB\u1FFD;\u43D6\u0100au\u2ECF\u2EDFn\u0100ck\u2ED5\u2EDDk\u0100;h\u21F4\u2EDB;\u610E\xF6\u21F4s\u0480;abcdemst\u2EF3\u2EF4\u1908\u2EF9\u2EFD\u2F04\u2F06\u2F0A\u2F0E\u402Bcir;\u6A23ir;\u6A22\u0100ou\u1D40\u2F02;\u6A25;\u6A72n\u80BB\xB1\u0E9Dim;\u6A26wo;\u6A27\u0180ipu\u2F19\u2F20\u2F25ntint;\u6A15f;\uC000\uD835\uDD61nd\u803B\xA3\u40A3\u0500;Eaceinosu\u0EC8\u2F3F\u2F41\u2F44\u2F47\u2F81\u2F89\u2F92\u2F7E\u2FB6;\u6AB3p;\u6AB7u\xE5\u0ED9\u0100;c\u0ECE\u2F4C\u0300;acens\u0EC8\u2F59\u2F5F\u2F66\u2F68\u2F7Eppro\xF8\u2F43urlye\xF1\u0ED9\xF1\u0ECE\u0180aes\u2F6F\u2F76\u2F7Approx;\u6AB9qq;\u6AB5im;\u62E8i\xED\u0EDFme\u0100;s\u2F88\u0EAE\u6032\u0180Eas\u2F78\u2F90\u2F7A\xF0\u2F75\u0180dfp\u0EEC\u2F99\u2FAF\u0180als\u2FA0\u2FA5\u2FAAlar;\u632Eine;\u6312urf;\u6313\u0100;t\u0EFB\u2FB4\xEF\u0EFBrel;\u62B0\u0100ci\u2FC0\u2FC5r;\uC000\uD835\uDCC5;\u43C8ncsp;\u6008\u0300fiopsu\u2FDA\u22E2\u2FDF\u2FE5\u2FEB\u2FF1r;\uC000\uD835\uDD2Epf;\uC000\uD835\uDD62rime;\u6057cr;\uC000\uD835\uDCC6\u0180aeo\u2FF8\u3009\u3013t\u0100ei\u2FFE\u3005rnion\xF3\u06B0nt;\u6A16st\u0100;e\u3010\u3011\u403F\xF1\u1F19\xF4\u0F14\u0A80ABHabcdefhilmnoprstux\u3040\u3051\u3055\u3059\u30E0\u310E\u312B\u3147\u3162\u3172\u318E\u3206\u3215\u3224\u3229\u3258\u326E\u3272\u3290\u32B0\u32B7\u0180art\u3047\u304A\u304Cr\xF2\u10B3\xF2\u03DDail;\u691Car\xF2\u1C65ar;\u6964\u0380cdenqrt\u3068\u3075\u3078\u307F\u308F\u3094\u30CC\u0100eu\u306D\u3071;\uC000\u223D\u0331te;\u4155i\xE3\u116Emptyv;\u69B3g\u0200;del\u0FD1\u3089\u308B\u308D;\u6992;\u69A5\xE5\u0FD1uo\u803B\xBB\u40BBr\u0580;abcfhlpstw\u0FDC\u30AC\u30AF\u30B7\u30B9\u30BC\u30BE\u30C0\u30C3\u30C7\u30CAp;\u6975\u0100;f\u0FE0\u30B4s;\u6920;\u6933s;\u691E\xEB\u225D\xF0\u272El;\u6945im;\u6974l;\u61A3;\u619D\u0100ai\u30D1\u30D5il;\u691Ao\u0100;n\u30DB\u30DC\u6236al\xF3\u0F1E\u0180abr\u30E7\u30EA\u30EEr\xF2\u17E5rk;\u6773\u0100ak\u30F3\u30FDc\u0100ek\u30F9\u30FB;\u407D;\u405D\u0100es\u3102\u3104;\u698Cl\u0100du\u310A\u310C;\u698E;\u6990\u0200aeuy\u3117\u311C\u3127\u3129ron;\u4159\u0100di\u3121\u3125il;\u4157\xEC\u0FF2\xE2\u30FA;\u4440\u0200clqs\u3134\u3137\u313D\u3144a;\u6937dhar;\u6969uo\u0100;r\u020E\u020Dh;\u61B3\u0180acg\u314E\u315F\u0F44l\u0200;ips\u0F78\u3158\u315B\u109Cn\xE5\u10BBar\xF4\u0FA9t;\u65AD\u0180ilr\u3169\u1023\u316Esht;\u697D;\uC000\uD835\uDD2F\u0100ao\u3177\u3186r\u0100du\u317D\u317F\xBB\u047B\u0100;l\u1091\u3184;\u696C\u0100;v\u318B\u318C\u43C1;\u43F1\u0180gns\u3195\u31F9\u31FCht\u0300ahlrst\u31A4\u31B0\u31C2\u31D8\u31E4\u31EErrow\u0100;t\u0FDC\u31ADa\xE9\u30C8arpoon\u0100du\u31BB\u31BFow\xEE\u317Ep\xBB\u1092eft\u0100ah\u31CA\u31D0rrow\xF3\u0FEAarpoon\xF3\u0551ightarrows;\u61C9quigarro\xF7\u30CBhreetimes;\u62CCg;\u42DAingdotse\xF1\u1F32\u0180ahm\u320D\u3210\u3213r\xF2\u0FEAa\xF2\u0551;\u600Foust\u0100;a\u321E\u321F\u63B1che\xBB\u321Fmid;\u6AEE\u0200abpt\u3232\u323D\u3240\u3252\u0100nr\u3237\u323Ag;\u67EDr;\u61FEr\xEB\u1003\u0180afl\u3247\u324A\u324Er;\u6986;\uC000\uD835\uDD63us;\u6A2Eimes;\u6A35\u0100ap\u325D\u3267r\u0100;g\u3263\u3264\u4029t;\u6994olint;\u6A12ar\xF2\u31E3\u0200achq\u327B\u3280\u10BC\u3285quo;\u603Ar;\uC000\uD835\uDCC7\u0100bu\u30FB\u328Ao\u0100;r\u0214\u0213\u0180hir\u3297\u329B\u32A0re\xE5\u31F8mes;\u62CAi\u0200;efl\u32AA\u1059\u1821\u32AB\u65B9tri;\u69CEluhar;\u6968;\u611E\u0D61\u32D5\u32DB\u32DF\u332C\u3338\u3371\0\u337A\u33A4\0\0\u33EC\u33F0\0\u3428\u3448\u345A\u34AD\u34B1\u34CA\u34F1\0\u3616\0\0\u3633cute;\u415Bqu\xEF\u27BA\u0500;Eaceinpsy\u11ED\u32F3\u32F5\u32FF\u3302\u330B\u330F\u331F\u3326\u3329;\u6AB4\u01F0\u32FA\0\u32FC;\u6AB8on;\u4161u\xE5\u11FE\u0100;d\u11F3\u3307il;\u415Frc;\u415D\u0180Eas\u3316\u3318\u331B;\u6AB6p;\u6ABAim;\u62E9olint;\u6A13i\xED\u1204;\u4441ot\u0180;be\u3334\u1D47\u3335\u62C5;\u6A66\u0380Aacmstx\u3346\u334A\u3357\u335B\u335E\u3363\u336Drr;\u61D8r\u0100hr\u3350\u3352\xEB\u2228\u0100;o\u0A36\u0A34t\u803B\xA7\u40A7i;\u403Bwar;\u6929m\u0100in\u3369\xF0nu\xF3\xF1t;\u6736r\u0100;o\u3376\u2055\uC000\uD835\uDD30\u0200acoy\u3382\u3386\u3391\u33A0rp;\u666F\u0100hy\u338B\u338Fcy;\u4449;\u4448rt\u026D\u3399\0\0\u339Ci\xE4\u1464ara\xEC\u2E6F\u803B\xAD\u40AD\u0100gm\u33A8\u33B4ma\u0180;fv\u33B1\u33B2\u33B2\u43C3;\u43C2\u0400;deglnpr\u12AB\u33C5\u33C9\u33CE\u33D6\u33DE\u33E1\u33E6ot;\u6A6A\u0100;q\u12B1\u12B0\u0100;E\u33D3\u33D4\u6A9E;\u6AA0\u0100;E\u33DB\u33DC\u6A9D;\u6A9Fe;\u6246lus;\u6A24arr;\u6972ar\xF2\u113D\u0200aeit\u33F8\u3408\u340F\u3417\u0100ls\u33FD\u3404lsetm\xE9\u336Ahp;\u6A33parsl;\u69E4\u0100dl\u1463\u3414e;\u6323\u0100;e\u341C\u341D\u6AAA\u0100;s\u3422\u3423\u6AAC;\uC000\u2AAC\uFE00\u0180flp\u342E\u3433\u3442tcy;\u444C\u0100;b\u3438\u3439\u402F\u0100;a\u343E\u343F\u69C4r;\u633Ff;\uC000\uD835\uDD64a\u0100dr\u344D\u0402es\u0100;u\u3454\u3455\u6660it\xBB\u3455\u0180csu\u3460\u3479\u349F\u0100au\u3465\u346Fp\u0100;s\u1188\u346B;\uC000\u2293\uFE00p\u0100;s\u11B4\u3475;\uC000\u2294\uFE00u\u0100bp\u347F\u348F\u0180;es\u1197\u119C\u3486et\u0100;e\u1197\u348D\xF1\u119D\u0180;es\u11A8\u11AD\u3496et\u0100;e\u11A8\u349D\xF1\u11AE\u0180;af\u117B\u34A6\u05B0r\u0165\u34AB\u05B1\xBB\u117Car\xF2\u1148\u0200cemt\u34B9\u34BE\u34C2\u34C5r;\uC000\uD835\uDCC8tm\xEE\xF1i\xEC\u3415ar\xE6\u11BE\u0100ar\u34CE\u34D5r\u0100;f\u34D4\u17BF\u6606\u0100an\u34DA\u34EDight\u0100ep\u34E3\u34EApsilo\xEE\u1EE0h\xE9\u2EAFs\xBB\u2852\u0280bcmnp\u34FB\u355E\u1209\u358B\u358E\u0480;Edemnprs\u350E\u350F\u3511\u3515\u351E\u3523\u352C\u3531\u3536\u6282;\u6AC5ot;\u6ABD\u0100;d\u11DA\u351Aot;\u6AC3ult;\u6AC1\u0100Ee\u3528\u352A;\u6ACB;\u628Alus;\u6ABFarr;\u6979\u0180eiu\u353D\u3552\u3555t\u0180;en\u350E\u3545\u354Bq\u0100;q\u11DA\u350Feq\u0100;q\u352B\u3528m;\u6AC7\u0100bp\u355A\u355C;\u6AD5;\u6AD3c\u0300;acens\u11ED\u356C\u3572\u3579\u357B\u3326ppro\xF8\u32FAurlye\xF1\u11FE\xF1\u11F3\u0180aes\u3582\u3588\u331Bppro\xF8\u331Aq\xF1\u3317g;\u666A\u0680123;Edehlmnps\u35A9\u35AC\u35AF\u121C\u35B2\u35B4\u35C0\u35C9\u35D5\u35DA\u35DF\u35E8\u35ED\u803B\xB9\u40B9\u803B\xB2\u40B2\u803B\xB3\u40B3;\u6AC6\u0100os\u35B9\u35BCt;\u6ABEub;\u6AD8\u0100;d\u1222\u35C5ot;\u6AC4s\u0100ou\u35CF\u35D2l;\u67C9b;\u6AD7arr;\u697Bult;\u6AC2\u0100Ee\u35E4\u35E6;\u6ACC;\u628Blus;\u6AC0\u0180eiu\u35F4\u3609\u360Ct\u0180;en\u121C\u35FC\u3602q\u0100;q\u1222\u35B2eq\u0100;q\u35E7\u35E4m;\u6AC8\u0100bp\u3611\u3613;\u6AD4;\u6AD6\u0180Aan\u361C\u3620\u362Drr;\u61D9r\u0100hr\u3626\u3628\xEB\u222E\u0100;o\u0A2B\u0A29war;\u692Alig\u803B\xDF\u40DF\u0BE1\u3651\u365D\u3660\u12CE\u3673\u3679\0\u367E\u36C2\0\0\0\0\0\u36DB\u3703\0\u3709\u376C\0\0\0\u3787\u0272\u3656\0\0\u365Bget;\u6316;\u43C4r\xEB\u0E5F\u0180aey\u3666\u366B\u3670ron;\u4165dil;\u4163;\u4442lrec;\u6315r;\uC000\uD835\uDD31\u0200eiko\u3686\u369D\u36B5\u36BC\u01F2\u368B\0\u3691e\u01004f\u1284\u1281a\u0180;sv\u3698\u3699\u369B\u43B8ym;\u43D1\u0100cn\u36A2\u36B2k\u0100as\u36A8\u36AEppro\xF8\u12C1im\xBB\u12ACs\xF0\u129E\u0100as\u36BA\u36AE\xF0\u12C1rn\u803B\xFE\u40FE\u01EC\u031F\u36C6\u22E7es\u8180\xD7;bd\u36CF\u36D0\u36D8\u40D7\u0100;a\u190F\u36D5r;\u6A31;\u6A30\u0180eps\u36E1\u36E3\u3700\xE1\u2A4D\u0200;bcf\u0486\u36EC\u36F0\u36F4ot;\u6336ir;\u6AF1\u0100;o\u36F9\u36FC\uC000\uD835\uDD65rk;\u6ADA\xE1\u3362rime;\u6034\u0180aip\u370F\u3712\u3764d\xE5\u1248\u0380adempst\u3721\u374D\u3740\u3751\u3757\u375C\u375Fngle\u0280;dlqr\u3730\u3731\u3736\u3740\u3742\u65B5own\xBB\u1DBBeft\u0100;e\u2800\u373E\xF1\u092E;\u625Cight\u0100;e\u32AA\u374B\xF1\u105Aot;\u65ECinus;\u6A3Alus;\u6A39b;\u69CDime;\u6A3Bezium;\u63E2\u0180cht\u3772\u377D\u3781\u0100ry\u3777\u377B;\uC000\uD835\uDCC9;\u4446cy;\u445Brok;\u4167\u0100io\u378B\u378Ex\xF4\u1777head\u0100lr\u3797\u37A0eftarro\xF7\u084Fightarrow\xBB\u0F5D\u0900AHabcdfghlmoprstuw\u37D0\u37D3\u37D7\u37E4\u37F0\u37FC\u380E\u381C\u3823\u3834\u3851\u385D\u386B\u38A9\u38CC\u38D2\u38EA\u38F6r\xF2\u03EDar;\u6963\u0100cr\u37DC\u37E2ute\u803B\xFA\u40FA\xF2\u1150r\u01E3\u37EA\0\u37EDy;\u445Eve;\u416D\u0100iy\u37F5\u37FArc\u803B\xFB\u40FB;\u4443\u0180abh\u3803\u3806\u380Br\xF2\u13ADlac;\u4171a\xF2\u13C3\u0100ir\u3813\u3818sht;\u697E;\uC000\uD835\uDD32rave\u803B\xF9\u40F9\u0161\u3827\u3831r\u0100lr\u382C\u382E\xBB\u0957\xBB\u1083lk;\u6580\u0100ct\u3839\u384D\u026F\u383F\0\0\u384Arn\u0100;e\u3845\u3846\u631Cr\xBB\u3846op;\u630Fri;\u65F8\u0100al\u3856\u385Acr;\u416B\u80BB\xA8\u0349\u0100gp\u3862\u3866on;\u4173f;\uC000\uD835\uDD66\u0300adhlsu\u114B\u3878\u387D\u1372\u3891\u38A0own\xE1\u13B3arpoon\u0100lr\u3888\u388Cef\xF4\u382Digh\xF4\u382Fi\u0180;hl\u3899\u389A\u389C\u43C5\xBB\u13FAon\xBB\u389Aparrows;\u61C8\u0180cit\u38B0\u38C4\u38C8\u026F\u38B6\0\0\u38C1rn\u0100;e\u38BC\u38BD\u631Dr\xBB\u38BDop;\u630Eng;\u416Fri;\u65F9cr;\uC000\uD835\uDCCA\u0180dir\u38D9\u38DD\u38E2ot;\u62F0lde;\u4169i\u0100;f\u3730\u38E8\xBB\u1813\u0100am\u38EF\u38F2r\xF2\u38A8l\u803B\xFC\u40FCangle;\u69A7\u0780ABDacdeflnoprsz\u391C\u391F\u3929\u392D\u39B5\u39B8\u39BD\u39DF\u39E4\u39E8\u39F3\u39F9\u39FD\u3A01\u3A20r\xF2\u03F7ar\u0100;v\u3926\u3927\u6AE8;\u6AE9as\xE8\u03E1\u0100nr\u3932\u3937grt;\u699C\u0380eknprst\u34E3\u3946\u394B\u3952\u395D\u3964\u3996app\xE1\u2415othin\xE7\u1E96\u0180hir\u34EB\u2EC8\u3959op\xF4\u2FB5\u0100;h\u13B7\u3962\xEF\u318D\u0100iu\u3969\u396Dgm\xE1\u33B3\u0100bp\u3972\u3984setneq\u0100;q\u397D\u3980\uC000\u228A\uFE00;\uC000\u2ACB\uFE00setneq\u0100;q\u398F\u3992\uC000\u228B\uFE00;\uC000\u2ACC\uFE00\u0100hr\u399B\u399Fet\xE1\u369Ciangle\u0100lr\u39AA\u39AFeft\xBB\u0925ight\xBB\u1051y;\u4432ash\xBB\u1036\u0180elr\u39C4\u39D2\u39D7\u0180;be\u2DEA\u39CB\u39CFar;\u62BBq;\u625Alip;\u62EE\u0100bt\u39DC\u1468a\xF2\u1469r;\uC000\uD835\uDD33tr\xE9\u39AEsu\u0100bp\u39EF\u39F1\xBB\u0D1C\xBB\u0D59pf;\uC000\uD835\uDD67ro\xF0\u0EFBtr\xE9\u39B4\u0100cu\u3A06\u3A0Br;\uC000\uD835\uDCCB\u0100bp\u3A10\u3A18n\u0100Ee\u3980\u3A16\xBB\u397En\u0100Ee\u3992\u3A1E\xBB\u3990igzag;\u699A\u0380cefoprs\u3A36\u3A3B\u3A56\u3A5B\u3A54\u3A61\u3A6Airc;\u4175\u0100di\u3A40\u3A51\u0100bg\u3A45\u3A49ar;\u6A5Fe\u0100;q\u15FA\u3A4F;\u6259erp;\u6118r;\uC000\uD835\uDD34pf;\uC000\uD835\uDD68\u0100;e\u1479\u3A66at\xE8\u1479cr;\uC000\uD835\uDCCC\u0AE3\u178E\u3A87\0\u3A8B\0\u3A90\u3A9B\0\0\u3A9D\u3AA8\u3AAB\u3AAF\0\0\u3AC3\u3ACE\0\u3AD8\u17DC\u17DFtr\xE9\u17D1r;\uC000\uD835\uDD35\u0100Aa\u3A94\u3A97r\xF2\u03C3r\xF2\u09F6;\u43BE\u0100Aa\u3AA1\u3AA4r\xF2\u03B8r\xF2\u09EBa\xF0\u2713is;\u62FB\u0180dpt\u17A4\u3AB5\u3ABE\u0100fl\u3ABA\u17A9;\uC000\uD835\uDD69im\xE5\u17B2\u0100Aa\u3AC7\u3ACAr\xF2\u03CEr\xF2\u0A01\u0100cq\u3AD2\u17B8r;\uC000\uD835\uDCCD\u0100pt\u17D6\u3ADCr\xE9\u17D4\u0400acefiosu\u3AF0\u3AFD\u3B08\u3B0C\u3B11\u3B15\u3B1B\u3B21c\u0100uy\u3AF6\u3AFBte\u803B\xFD\u40FD;\u444F\u0100iy\u3B02\u3B06rc;\u4177;\u444Bn\u803B\xA5\u40A5r;\uC000\uD835\uDD36cy;\u4457pf;\uC000\uD835\uDD6Acr;\uC000\uD835\uDCCE\u0100cm\u3B26\u3B29y;\u444El\u803B\xFF\u40FF\u0500acdefhiosw\u3B42\u3B48\u3B54\u3B58\u3B64\u3B69\u3B6D\u3B74\u3B7A\u3B80cute;\u417A\u0100ay\u3B4D\u3B52ron;\u417E;\u4437ot;\u417C\u0100et\u3B5D\u3B61tr\xE6\u155Fa;\u43B6r;\uC000\uD835\uDD37cy;\u4436grarr;\u61DDpf;\uC000\uD835\uDD6Bcr;\uC000\uD835\uDCCF\u0100jn\u3B85\u3B87;\u600Dj;\u600C".split("").map(function (c) {
  return c.charCodeAt(0);
})));

/***/ }),

/***/ "./node_modules/entities/lib/esm/generated/decode-data-xml.js":
/*!********************************************************************!*\
  !*** ./node_modules/entities/lib/esm/generated/decode-data-xml.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Generated using scripts/write-decode-map.ts
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Uint16Array( // prettier-ignore
"\u0200aglq\t\x15\x18\x1B\u026D\x0F\0\0\x12p;\u4026os;\u4027t;\u403Et;\u403Cuot;\u4022".split("").map(function (c) {
  return c.charCodeAt(0);
})));

/***/ }),

/***/ "./node_modules/entities/lib/esm/generated/encode-html.js":
/*!****************************************************************!*\
  !*** ./node_modules/entities/lib/esm/generated/encode-html.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Generated using scripts/write-encode-map.ts
function restoreDiff(arr) {
  for (var i = 1; i < arr.length; i++) {
    arr[i][0] += arr[i - 1][0] + 1;
  }

  return arr;
} // prettier-ignore


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Map( /* #__PURE__ */restoreDiff([[9, "&Tab;"], [0, "&NewLine;"], [22, "&excl;"], [0, "&quot;"], [0, "&num;"], [0, "&dollar;"], [0, "&percnt;"], [0, "&amp;"], [0, "&apos;"], [0, "&lpar;"], [0, "&rpar;"], [0, "&ast;"], [0, "&plus;"], [0, "&comma;"], [1, "&period;"], [0, "&sol;"], [10, "&colon;"], [0, "&semi;"], [0, {
  v: "&lt;",
  n: 8402,
  o: "&nvlt;"
}], [0, {
  v: "&equals;",
  n: 8421,
  o: "&bne;"
}], [0, {
  v: "&gt;",
  n: 8402,
  o: "&nvgt;"
}], [0, "&quest;"], [0, "&commat;"], [26, "&lbrack;"], [0, "&bsol;"], [0, "&rbrack;"], [0, "&Hat;"], [0, "&lowbar;"], [0, "&DiacriticalGrave;"], [5, {
  n: 106,
  o: "&fjlig;"
}], [20, "&lbrace;"], [0, "&verbar;"], [0, "&rbrace;"], [34, "&nbsp;"], [0, "&iexcl;"], [0, "&cent;"], [0, "&pound;"], [0, "&curren;"], [0, "&yen;"], [0, "&brvbar;"], [0, "&sect;"], [0, "&die;"], [0, "&copy;"], [0, "&ordf;"], [0, "&laquo;"], [0, "&not;"], [0, "&shy;"], [0, "&circledR;"], [0, "&macr;"], [0, "&deg;"], [0, "&PlusMinus;"], [0, "&sup2;"], [0, "&sup3;"], [0, "&acute;"], [0, "&micro;"], [0, "&para;"], [0, "&centerdot;"], [0, "&cedil;"], [0, "&sup1;"], [0, "&ordm;"], [0, "&raquo;"], [0, "&frac14;"], [0, "&frac12;"], [0, "&frac34;"], [0, "&iquest;"], [0, "&Agrave;"], [0, "&Aacute;"], [0, "&Acirc;"], [0, "&Atilde;"], [0, "&Auml;"], [0, "&angst;"], [0, "&AElig;"], [0, "&Ccedil;"], [0, "&Egrave;"], [0, "&Eacute;"], [0, "&Ecirc;"], [0, "&Euml;"], [0, "&Igrave;"], [0, "&Iacute;"], [0, "&Icirc;"], [0, "&Iuml;"], [0, "&ETH;"], [0, "&Ntilde;"], [0, "&Ograve;"], [0, "&Oacute;"], [0, "&Ocirc;"], [0, "&Otilde;"], [0, "&Ouml;"], [0, "&times;"], [0, "&Oslash;"], [0, "&Ugrave;"], [0, "&Uacute;"], [0, "&Ucirc;"], [0, "&Uuml;"], [0, "&Yacute;"], [0, "&THORN;"], [0, "&szlig;"], [0, "&agrave;"], [0, "&aacute;"], [0, "&acirc;"], [0, "&atilde;"], [0, "&auml;"], [0, "&aring;"], [0, "&aelig;"], [0, "&ccedil;"], [0, "&egrave;"], [0, "&eacute;"], [0, "&ecirc;"], [0, "&euml;"], [0, "&igrave;"], [0, "&iacute;"], [0, "&icirc;"], [0, "&iuml;"], [0, "&eth;"], [0, "&ntilde;"], [0, "&ograve;"], [0, "&oacute;"], [0, "&ocirc;"], [0, "&otilde;"], [0, "&ouml;"], [0, "&div;"], [0, "&oslash;"], [0, "&ugrave;"], [0, "&uacute;"], [0, "&ucirc;"], [0, "&uuml;"], [0, "&yacute;"], [0, "&thorn;"], [0, "&yuml;"], [0, "&Amacr;"], [0, "&amacr;"], [0, "&Abreve;"], [0, "&abreve;"], [0, "&Aogon;"], [0, "&aogon;"], [0, "&Cacute;"], [0, "&cacute;"], [0, "&Ccirc;"], [0, "&ccirc;"], [0, "&Cdot;"], [0, "&cdot;"], [0, "&Ccaron;"], [0, "&ccaron;"], [0, "&Dcaron;"], [0, "&dcaron;"], [0, "&Dstrok;"], [0, "&dstrok;"], [0, "&Emacr;"], [0, "&emacr;"], [2, "&Edot;"], [0, "&edot;"], [0, "&Eogon;"], [0, "&eogon;"], [0, "&Ecaron;"], [0, "&ecaron;"], [0, "&Gcirc;"], [0, "&gcirc;"], [0, "&Gbreve;"], [0, "&gbreve;"], [0, "&Gdot;"], [0, "&gdot;"], [0, "&Gcedil;"], [1, "&Hcirc;"], [0, "&hcirc;"], [0, "&Hstrok;"], [0, "&hstrok;"], [0, "&Itilde;"], [0, "&itilde;"], [0, "&Imacr;"], [0, "&imacr;"], [2, "&Iogon;"], [0, "&iogon;"], [0, "&Idot;"], [0, "&imath;"], [0, "&IJlig;"], [0, "&ijlig;"], [0, "&Jcirc;"], [0, "&jcirc;"], [0, "&Kcedil;"], [0, "&kcedil;"], [0, "&kgreen;"], [0, "&Lacute;"], [0, "&lacute;"], [0, "&Lcedil;"], [0, "&lcedil;"], [0, "&Lcaron;"], [0, "&lcaron;"], [0, "&Lmidot;"], [0, "&lmidot;"], [0, "&Lstrok;"], [0, "&lstrok;"], [0, "&Nacute;"], [0, "&nacute;"], [0, "&Ncedil;"], [0, "&ncedil;"], [0, "&Ncaron;"], [0, "&ncaron;"], [0, "&napos;"], [0, "&ENG;"], [0, "&eng;"], [0, "&Omacr;"], [0, "&omacr;"], [2, "&Odblac;"], [0, "&odblac;"], [0, "&OElig;"], [0, "&oelig;"], [0, "&Racute;"], [0, "&racute;"], [0, "&Rcedil;"], [0, "&rcedil;"], [0, "&Rcaron;"], [0, "&rcaron;"], [0, "&Sacute;"], [0, "&sacute;"], [0, "&Scirc;"], [0, "&scirc;"], [0, "&Scedil;"], [0, "&scedil;"], [0, "&Scaron;"], [0, "&scaron;"], [0, "&Tcedil;"], [0, "&tcedil;"], [0, "&Tcaron;"], [0, "&tcaron;"], [0, "&Tstrok;"], [0, "&tstrok;"], [0, "&Utilde;"], [0, "&utilde;"], [0, "&Umacr;"], [0, "&umacr;"], [0, "&Ubreve;"], [0, "&ubreve;"], [0, "&Uring;"], [0, "&uring;"], [0, "&Udblac;"], [0, "&udblac;"], [0, "&Uogon;"], [0, "&uogon;"], [0, "&Wcirc;"], [0, "&wcirc;"], [0, "&Ycirc;"], [0, "&ycirc;"], [0, "&Yuml;"], [0, "&Zacute;"], [0, "&zacute;"], [0, "&Zdot;"], [0, "&zdot;"], [0, "&Zcaron;"], [0, "&zcaron;"], [19, "&fnof;"], [34, "&imped;"], [63, "&gacute;"], [65, "&jmath;"], [142, "&circ;"], [0, "&caron;"], [16, "&breve;"], [0, "&DiacriticalDot;"], [0, "&ring;"], [0, "&ogon;"], [0, "&DiacriticalTilde;"], [0, "&dblac;"], [51, "&DownBreve;"], [127, "&Alpha;"], [0, "&Beta;"], [0, "&Gamma;"], [0, "&Delta;"], [0, "&Epsilon;"], [0, "&Zeta;"], [0, "&Eta;"], [0, "&Theta;"], [0, "&Iota;"], [0, "&Kappa;"], [0, "&Lambda;"], [0, "&Mu;"], [0, "&Nu;"], [0, "&Xi;"], [0, "&Omicron;"], [0, "&Pi;"], [0, "&Rho;"], [1, "&Sigma;"], [0, "&Tau;"], [0, "&Upsilon;"], [0, "&Phi;"], [0, "&Chi;"], [0, "&Psi;"], [0, "&ohm;"], [7, "&alpha;"], [0, "&beta;"], [0, "&gamma;"], [0, "&delta;"], [0, "&epsi;"], [0, "&zeta;"], [0, "&eta;"], [0, "&theta;"], [0, "&iota;"], [0, "&kappa;"], [0, "&lambda;"], [0, "&mu;"], [0, "&nu;"], [0, "&xi;"], [0, "&omicron;"], [0, "&pi;"], [0, "&rho;"], [0, "&sigmaf;"], [0, "&sigma;"], [0, "&tau;"], [0, "&upsi;"], [0, "&phi;"], [0, "&chi;"], [0, "&psi;"], [0, "&omega;"], [7, "&thetasym;"], [0, "&Upsi;"], [2, "&phiv;"], [0, "&piv;"], [5, "&Gammad;"], [0, "&digamma;"], [18, "&kappav;"], [0, "&rhov;"], [3, "&epsiv;"], [0, "&backepsilon;"], [10, "&IOcy;"], [0, "&DJcy;"], [0, "&GJcy;"], [0, "&Jukcy;"], [0, "&DScy;"], [0, "&Iukcy;"], [0, "&YIcy;"], [0, "&Jsercy;"], [0, "&LJcy;"], [0, "&NJcy;"], [0, "&TSHcy;"], [0, "&KJcy;"], [1, "&Ubrcy;"], [0, "&DZcy;"], [0, "&Acy;"], [0, "&Bcy;"], [0, "&Vcy;"], [0, "&Gcy;"], [0, "&Dcy;"], [0, "&IEcy;"], [0, "&ZHcy;"], [0, "&Zcy;"], [0, "&Icy;"], [0, "&Jcy;"], [0, "&Kcy;"], [0, "&Lcy;"], [0, "&Mcy;"], [0, "&Ncy;"], [0, "&Ocy;"], [0, "&Pcy;"], [0, "&Rcy;"], [0, "&Scy;"], [0, "&Tcy;"], [0, "&Ucy;"], [0, "&Fcy;"], [0, "&KHcy;"], [0, "&TScy;"], [0, "&CHcy;"], [0, "&SHcy;"], [0, "&SHCHcy;"], [0, "&HARDcy;"], [0, "&Ycy;"], [0, "&SOFTcy;"], [0, "&Ecy;"], [0, "&YUcy;"], [0, "&YAcy;"], [0, "&acy;"], [0, "&bcy;"], [0, "&vcy;"], [0, "&gcy;"], [0, "&dcy;"], [0, "&iecy;"], [0, "&zhcy;"], [0, "&zcy;"], [0, "&icy;"], [0, "&jcy;"], [0, "&kcy;"], [0, "&lcy;"], [0, "&mcy;"], [0, "&ncy;"], [0, "&ocy;"], [0, "&pcy;"], [0, "&rcy;"], [0, "&scy;"], [0, "&tcy;"], [0, "&ucy;"], [0, "&fcy;"], [0, "&khcy;"], [0, "&tscy;"], [0, "&chcy;"], [0, "&shcy;"], [0, "&shchcy;"], [0, "&hardcy;"], [0, "&ycy;"], [0, "&softcy;"], [0, "&ecy;"], [0, "&yucy;"], [0, "&yacy;"], [1, "&iocy;"], [0, "&djcy;"], [0, "&gjcy;"], [0, "&jukcy;"], [0, "&dscy;"], [0, "&iukcy;"], [0, "&yicy;"], [0, "&jsercy;"], [0, "&ljcy;"], [0, "&njcy;"], [0, "&tshcy;"], [0, "&kjcy;"], [1, "&ubrcy;"], [0, "&dzcy;"], [7074, "&ensp;"], [0, "&emsp;"], [0, "&emsp13;"], [0, "&emsp14;"], [1, "&numsp;"], [0, "&puncsp;"], [0, "&ThinSpace;"], [0, "&hairsp;"], [0, "&NegativeMediumSpace;"], [0, "&zwnj;"], [0, "&zwj;"], [0, "&lrm;"], [0, "&rlm;"], [0, "&dash;"], [2, "&ndash;"], [0, "&mdash;"], [0, "&horbar;"], [0, "&Verbar;"], [1, "&lsquo;"], [0, "&CloseCurlyQuote;"], [0, "&lsquor;"], [1, "&ldquo;"], [0, "&CloseCurlyDoubleQuote;"], [0, "&bdquo;"], [1, "&dagger;"], [0, "&Dagger;"], [0, "&bull;"], [2, "&nldr;"], [0, "&hellip;"], [9, "&permil;"], [0, "&pertenk;"], [0, "&prime;"], [0, "&Prime;"], [0, "&tprime;"], [0, "&backprime;"], [3, "&lsaquo;"], [0, "&rsaquo;"], [3, "&oline;"], [2, "&caret;"], [1, "&hybull;"], [0, "&frasl;"], [10, "&bsemi;"], [7, "&qprime;"], [7, {
  v: "&MediumSpace;",
  n: 8202,
  o: "&ThickSpace;"
}], [0, "&NoBreak;"], [0, "&af;"], [0, "&InvisibleTimes;"], [0, "&ic;"], [72, "&euro;"], [46, "&tdot;"], [0, "&DotDot;"], [37, "&complexes;"], [2, "&incare;"], [4, "&gscr;"], [0, "&hamilt;"], [0, "&Hfr;"], [0, "&Hopf;"], [0, "&planckh;"], [0, "&hbar;"], [0, "&imagline;"], [0, "&Ifr;"], [0, "&lagran;"], [0, "&ell;"], [1, "&naturals;"], [0, "&numero;"], [0, "&copysr;"], [0, "&weierp;"], [0, "&Popf;"], [0, "&Qopf;"], [0, "&realine;"], [0, "&real;"], [0, "&reals;"], [0, "&rx;"], [3, "&trade;"], [1, "&integers;"], [2, "&mho;"], [0, "&zeetrf;"], [0, "&iiota;"], [2, "&bernou;"], [0, "&Cayleys;"], [1, "&escr;"], [0, "&Escr;"], [0, "&Fouriertrf;"], [1, "&Mellintrf;"], [0, "&order;"], [0, "&alefsym;"], [0, "&beth;"], [0, "&gimel;"], [0, "&daleth;"], [12, "&CapitalDifferentialD;"], [0, "&dd;"], [0, "&ee;"], [0, "&ii;"], [10, "&frac13;"], [0, "&frac23;"], [0, "&frac15;"], [0, "&frac25;"], [0, "&frac35;"], [0, "&frac45;"], [0, "&frac16;"], [0, "&frac56;"], [0, "&frac18;"], [0, "&frac38;"], [0, "&frac58;"], [0, "&frac78;"], [49, "&larr;"], [0, "&ShortUpArrow;"], [0, "&rarr;"], [0, "&darr;"], [0, "&harr;"], [0, "&updownarrow;"], [0, "&nwarr;"], [0, "&nearr;"], [0, "&LowerRightArrow;"], [0, "&LowerLeftArrow;"], [0, "&nlarr;"], [0, "&nrarr;"], [1, {
  v: "&rarrw;",
  n: 824,
  o: "&nrarrw;"
}], [0, "&Larr;"], [0, "&Uarr;"], [0, "&Rarr;"], [0, "&Darr;"], [0, "&larrtl;"], [0, "&rarrtl;"], [0, "&LeftTeeArrow;"], [0, "&mapstoup;"], [0, "&map;"], [0, "&DownTeeArrow;"], [1, "&hookleftarrow;"], [0, "&hookrightarrow;"], [0, "&larrlp;"], [0, "&looparrowright;"], [0, "&harrw;"], [0, "&nharr;"], [1, "&lsh;"], [0, "&rsh;"], [0, "&ldsh;"], [0, "&rdsh;"], [1, "&crarr;"], [0, "&cularr;"], [0, "&curarr;"], [2, "&circlearrowleft;"], [0, "&circlearrowright;"], [0, "&leftharpoonup;"], [0, "&DownLeftVector;"], [0, "&RightUpVector;"], [0, "&LeftUpVector;"], [0, "&rharu;"], [0, "&DownRightVector;"], [0, "&dharr;"], [0, "&dharl;"], [0, "&RightArrowLeftArrow;"], [0, "&udarr;"], [0, "&LeftArrowRightArrow;"], [0, "&leftleftarrows;"], [0, "&upuparrows;"], [0, "&rightrightarrows;"], [0, "&ddarr;"], [0, "&leftrightharpoons;"], [0, "&Equilibrium;"], [0, "&nlArr;"], [0, "&nhArr;"], [0, "&nrArr;"], [0, "&DoubleLeftArrow;"], [0, "&DoubleUpArrow;"], [0, "&DoubleRightArrow;"], [0, "&dArr;"], [0, "&DoubleLeftRightArrow;"], [0, "&DoubleUpDownArrow;"], [0, "&nwArr;"], [0, "&neArr;"], [0, "&seArr;"], [0, "&swArr;"], [0, "&lAarr;"], [0, "&rAarr;"], [1, "&zigrarr;"], [6, "&larrb;"], [0, "&rarrb;"], [15, "&DownArrowUpArrow;"], [7, "&loarr;"], [0, "&roarr;"], [0, "&hoarr;"], [0, "&forall;"], [0, "&comp;"], [0, {
  v: "&part;",
  n: 824,
  o: "&npart;"
}], [0, "&exist;"], [0, "&nexist;"], [0, "&empty;"], [1, "&Del;"], [0, "&Element;"], [0, "&NotElement;"], [1, "&ni;"], [0, "&notni;"], [2, "&prod;"], [0, "&coprod;"], [0, "&sum;"], [0, "&minus;"], [0, "&MinusPlus;"], [0, "&dotplus;"], [1, "&Backslash;"], [0, "&lowast;"], [0, "&compfn;"], [1, "&radic;"], [2, "&prop;"], [0, "&infin;"], [0, "&angrt;"], [0, {
  v: "&ang;",
  n: 8402,
  o: "&nang;"
}], [0, "&angmsd;"], [0, "&angsph;"], [0, "&mid;"], [0, "&nmid;"], [0, "&DoubleVerticalBar;"], [0, "&NotDoubleVerticalBar;"], [0, "&and;"], [0, "&or;"], [0, {
  v: "&cap;",
  n: 65024,
  o: "&caps;"
}], [0, {
  v: "&cup;",
  n: 65024,
  o: "&cups;"
}], [0, "&int;"], [0, "&Int;"], [0, "&iiint;"], [0, "&conint;"], [0, "&Conint;"], [0, "&Cconint;"], [0, "&cwint;"], [0, "&ClockwiseContourIntegral;"], [0, "&awconint;"], [0, "&there4;"], [0, "&becaus;"], [0, "&ratio;"], [0, "&Colon;"], [0, "&dotminus;"], [1, "&mDDot;"], [0, "&homtht;"], [0, {
  v: "&sim;",
  n: 8402,
  o: "&nvsim;"
}], [0, {
  v: "&backsim;",
  n: 817,
  o: "&race;"
}], [0, {
  v: "&ac;",
  n: 819,
  o: "&acE;"
}], [0, "&acd;"], [0, "&VerticalTilde;"], [0, "&NotTilde;"], [0, {
  v: "&eqsim;",
  n: 824,
  o: "&nesim;"
}], [0, "&sime;"], [0, "&NotTildeEqual;"], [0, "&cong;"], [0, "&simne;"], [0, "&ncong;"], [0, "&ap;"], [0, "&nap;"], [0, "&ape;"], [0, {
  v: "&apid;",
  n: 824,
  o: "&napid;"
}], [0, "&backcong;"], [0, {
  v: "&asympeq;",
  n: 8402,
  o: "&nvap;"
}], [0, {
  v: "&bump;",
  n: 824,
  o: "&nbump;"
}], [0, {
  v: "&bumpe;",
  n: 824,
  o: "&nbumpe;"
}], [0, {
  v: "&doteq;",
  n: 824,
  o: "&nedot;"
}], [0, "&doteqdot;"], [0, "&efDot;"], [0, "&erDot;"], [0, "&Assign;"], [0, "&ecolon;"], [0, "&ecir;"], [0, "&circeq;"], [1, "&wedgeq;"], [0, "&veeeq;"], [1, "&triangleq;"], [2, "&equest;"], [0, "&ne;"], [0, {
  v: "&Congruent;",
  n: 8421,
  o: "&bnequiv;"
}], [0, "&nequiv;"], [1, {
  v: "&le;",
  n: 8402,
  o: "&nvle;"
}], [0, {
  v: "&ge;",
  n: 8402,
  o: "&nvge;"
}], [0, {
  v: "&lE;",
  n: 824,
  o: "&nlE;"
}], [0, {
  v: "&gE;",
  n: 824,
  o: "&ngE;"
}], [0, {
  v: "&lnE;",
  n: 65024,
  o: "&lvertneqq;"
}], [0, {
  v: "&gnE;",
  n: 65024,
  o: "&gvertneqq;"
}], [0, {
  v: "&ll;",
  n: new Map( /* #__PURE__ */restoreDiff([[824, "&nLtv;"], [7577, "&nLt;"]]))
}], [0, {
  v: "&gg;",
  n: new Map( /* #__PURE__ */restoreDiff([[824, "&nGtv;"], [7577, "&nGt;"]]))
}], [0, "&between;"], [0, "&NotCupCap;"], [0, "&nless;"], [0, "&ngt;"], [0, "&nle;"], [0, "&nge;"], [0, "&lesssim;"], [0, "&GreaterTilde;"], [0, "&nlsim;"], [0, "&ngsim;"], [0, "&LessGreater;"], [0, "&gl;"], [0, "&NotLessGreater;"], [0, "&NotGreaterLess;"], [0, "&pr;"], [0, "&sc;"], [0, "&prcue;"], [0, "&sccue;"], [0, "&PrecedesTilde;"], [0, {
  v: "&scsim;",
  n: 824,
  o: "&NotSucceedsTilde;"
}], [0, "&NotPrecedes;"], [0, "&NotSucceeds;"], [0, {
  v: "&sub;",
  n: 8402,
  o: "&NotSubset;"
}], [0, {
  v: "&sup;",
  n: 8402,
  o: "&NotSuperset;"
}], [0, "&nsub;"], [0, "&nsup;"], [0, "&sube;"], [0, "&supe;"], [0, "&NotSubsetEqual;"], [0, "&NotSupersetEqual;"], [0, {
  v: "&subne;",
  n: 65024,
  o: "&varsubsetneq;"
}], [0, {
  v: "&supne;",
  n: 65024,
  o: "&varsupsetneq;"
}], [1, "&cupdot;"], [0, "&UnionPlus;"], [0, {
  v: "&sqsub;",
  n: 824,
  o: "&NotSquareSubset;"
}], [0, {
  v: "&sqsup;",
  n: 824,
  o: "&NotSquareSuperset;"
}], [0, "&sqsube;"], [0, "&sqsupe;"], [0, {
  v: "&sqcap;",
  n: 65024,
  o: "&sqcaps;"
}], [0, {
  v: "&sqcup;",
  n: 65024,
  o: "&sqcups;"
}], [0, "&CirclePlus;"], [0, "&CircleMinus;"], [0, "&CircleTimes;"], [0, "&osol;"], [0, "&CircleDot;"], [0, "&circledcirc;"], [0, "&circledast;"], [1, "&circleddash;"], [0, "&boxplus;"], [0, "&boxminus;"], [0, "&boxtimes;"], [0, "&dotsquare;"], [0, "&RightTee;"], [0, "&dashv;"], [0, "&DownTee;"], [0, "&bot;"], [1, "&models;"], [0, "&DoubleRightTee;"], [0, "&Vdash;"], [0, "&Vvdash;"], [0, "&VDash;"], [0, "&nvdash;"], [0, "&nvDash;"], [0, "&nVdash;"], [0, "&nVDash;"], [0, "&prurel;"], [1, "&LeftTriangle;"], [0, "&RightTriangle;"], [0, {
  v: "&LeftTriangleEqual;",
  n: 8402,
  o: "&nvltrie;"
}], [0, {
  v: "&RightTriangleEqual;",
  n: 8402,
  o: "&nvrtrie;"
}], [0, "&origof;"], [0, "&imof;"], [0, "&multimap;"], [0, "&hercon;"], [0, "&intcal;"], [0, "&veebar;"], [1, "&barvee;"], [0, "&angrtvb;"], [0, "&lrtri;"], [0, "&bigwedge;"], [0, "&bigvee;"], [0, "&bigcap;"], [0, "&bigcup;"], [0, "&diam;"], [0, "&sdot;"], [0, "&sstarf;"], [0, "&divideontimes;"], [0, "&bowtie;"], [0, "&ltimes;"], [0, "&rtimes;"], [0, "&leftthreetimes;"], [0, "&rightthreetimes;"], [0, "&backsimeq;"], [0, "&curlyvee;"], [0, "&curlywedge;"], [0, "&Sub;"], [0, "&Sup;"], [0, "&Cap;"], [0, "&Cup;"], [0, "&fork;"], [0, "&epar;"], [0, "&lessdot;"], [0, "&gtdot;"], [0, {
  v: "&Ll;",
  n: 824,
  o: "&nLl;"
}], [0, {
  v: "&Gg;",
  n: 824,
  o: "&nGg;"
}], [0, {
  v: "&leg;",
  n: 65024,
  o: "&lesg;"
}], [0, {
  v: "&gel;",
  n: 65024,
  o: "&gesl;"
}], [2, "&cuepr;"], [0, "&cuesc;"], [0, "&NotPrecedesSlantEqual;"], [0, "&NotSucceedsSlantEqual;"], [0, "&NotSquareSubsetEqual;"], [0, "&NotSquareSupersetEqual;"], [2, "&lnsim;"], [0, "&gnsim;"], [0, "&precnsim;"], [0, "&scnsim;"], [0, "&nltri;"], [0, "&NotRightTriangle;"], [0, "&nltrie;"], [0, "&NotRightTriangleEqual;"], [0, "&vellip;"], [0, "&ctdot;"], [0, "&utdot;"], [0, "&dtdot;"], [0, "&disin;"], [0, "&isinsv;"], [0, "&isins;"], [0, {
  v: "&isindot;",
  n: 824,
  o: "&notindot;"
}], [0, "&notinvc;"], [0, "&notinvb;"], [1, {
  v: "&isinE;",
  n: 824,
  o: "&notinE;"
}], [0, "&nisd;"], [0, "&xnis;"], [0, "&nis;"], [0, "&notnivc;"], [0, "&notnivb;"], [6, "&barwed;"], [0, "&Barwed;"], [1, "&lceil;"], [0, "&rceil;"], [0, "&LeftFloor;"], [0, "&rfloor;"], [0, "&drcrop;"], [0, "&dlcrop;"], [0, "&urcrop;"], [0, "&ulcrop;"], [0, "&bnot;"], [1, "&profline;"], [0, "&profsurf;"], [1, "&telrec;"], [0, "&target;"], [5, "&ulcorn;"], [0, "&urcorn;"], [0, "&dlcorn;"], [0, "&drcorn;"], [2, "&frown;"], [0, "&smile;"], [9, "&cylcty;"], [0, "&profalar;"], [7, "&topbot;"], [6, "&ovbar;"], [1, "&solbar;"], [60, "&angzarr;"], [51, "&lmoustache;"], [0, "&rmoustache;"], [2, "&OverBracket;"], [0, "&bbrk;"], [0, "&bbrktbrk;"], [37, "&OverParenthesis;"], [0, "&UnderParenthesis;"], [0, "&OverBrace;"], [0, "&UnderBrace;"], [2, "&trpezium;"], [4, "&elinters;"], [59, "&blank;"], [164, "&circledS;"], [55, "&boxh;"], [1, "&boxv;"], [9, "&boxdr;"], [3, "&boxdl;"], [3, "&boxur;"], [3, "&boxul;"], [3, "&boxvr;"], [7, "&boxvl;"], [7, "&boxhd;"], [7, "&boxhu;"], [7, "&boxvh;"], [19, "&boxH;"], [0, "&boxV;"], [0, "&boxdR;"], [0, "&boxDr;"], [0, "&boxDR;"], [0, "&boxdL;"], [0, "&boxDl;"], [0, "&boxDL;"], [0, "&boxuR;"], [0, "&boxUr;"], [0, "&boxUR;"], [0, "&boxuL;"], [0, "&boxUl;"], [0, "&boxUL;"], [0, "&boxvR;"], [0, "&boxVr;"], [0, "&boxVR;"], [0, "&boxvL;"], [0, "&boxVl;"], [0, "&boxVL;"], [0, "&boxHd;"], [0, "&boxhD;"], [0, "&boxHD;"], [0, "&boxHu;"], [0, "&boxhU;"], [0, "&boxHU;"], [0, "&boxvH;"], [0, "&boxVh;"], [0, "&boxVH;"], [19, "&uhblk;"], [3, "&lhblk;"], [3, "&block;"], [8, "&blk14;"], [0, "&blk12;"], [0, "&blk34;"], [13, "&square;"], [8, "&blacksquare;"], [0, "&EmptyVerySmallSquare;"], [1, "&rect;"], [0, "&marker;"], [2, "&fltns;"], [1, "&bigtriangleup;"], [0, "&blacktriangle;"], [0, "&triangle;"], [2, "&blacktriangleright;"], [0, "&rtri;"], [3, "&bigtriangledown;"], [0, "&blacktriangledown;"], [0, "&dtri;"], [2, "&blacktriangleleft;"], [0, "&ltri;"], [6, "&loz;"], [0, "&cir;"], [32, "&tridot;"], [2, "&bigcirc;"], [8, "&ultri;"], [0, "&urtri;"], [0, "&lltri;"], [0, "&EmptySmallSquare;"], [0, "&FilledSmallSquare;"], [8, "&bigstar;"], [0, "&star;"], [7, "&phone;"], [49, "&female;"], [1, "&male;"], [29, "&spades;"], [2, "&clubs;"], [1, "&hearts;"], [0, "&diamondsuit;"], [3, "&sung;"], [2, "&flat;"], [0, "&natural;"], [0, "&sharp;"], [163, "&check;"], [3, "&cross;"], [8, "&malt;"], [21, "&sext;"], [33, "&VerticalSeparator;"], [25, "&lbbrk;"], [0, "&rbbrk;"], [84, "&bsolhsub;"], [0, "&suphsol;"], [28, "&LeftDoubleBracket;"], [0, "&RightDoubleBracket;"], [0, "&lang;"], [0, "&rang;"], [0, "&Lang;"], [0, "&Rang;"], [0, "&loang;"], [0, "&roang;"], [7, "&longleftarrow;"], [0, "&longrightarrow;"], [0, "&longleftrightarrow;"], [0, "&DoubleLongLeftArrow;"], [0, "&DoubleLongRightArrow;"], [0, "&DoubleLongLeftRightArrow;"], [1, "&longmapsto;"], [2, "&dzigrarr;"], [258, "&nvlArr;"], [0, "&nvrArr;"], [0, "&nvHarr;"], [0, "&Map;"], [6, "&lbarr;"], [0, "&bkarow;"], [0, "&lBarr;"], [0, "&dbkarow;"], [0, "&drbkarow;"], [0, "&DDotrahd;"], [0, "&UpArrowBar;"], [0, "&DownArrowBar;"], [2, "&Rarrtl;"], [2, "&latail;"], [0, "&ratail;"], [0, "&lAtail;"], [0, "&rAtail;"], [0, "&larrfs;"], [0, "&rarrfs;"], [0, "&larrbfs;"], [0, "&rarrbfs;"], [2, "&nwarhk;"], [0, "&nearhk;"], [0, "&hksearow;"], [0, "&hkswarow;"], [0, "&nwnear;"], [0, "&nesear;"], [0, "&seswar;"], [0, "&swnwar;"], [8, {
  v: "&rarrc;",
  n: 824,
  o: "&nrarrc;"
}], [1, "&cudarrr;"], [0, "&ldca;"], [0, "&rdca;"], [0, "&cudarrl;"], [0, "&larrpl;"], [2, "&curarrm;"], [0, "&cularrp;"], [7, "&rarrpl;"], [2, "&harrcir;"], [0, "&Uarrocir;"], [0, "&lurdshar;"], [0, "&ldrushar;"], [2, "&LeftRightVector;"], [0, "&RightUpDownVector;"], [0, "&DownLeftRightVector;"], [0, "&LeftUpDownVector;"], [0, "&LeftVectorBar;"], [0, "&RightVectorBar;"], [0, "&RightUpVectorBar;"], [0, "&RightDownVectorBar;"], [0, "&DownLeftVectorBar;"], [0, "&DownRightVectorBar;"], [0, "&LeftUpVectorBar;"], [0, "&LeftDownVectorBar;"], [0, "&LeftTeeVector;"], [0, "&RightTeeVector;"], [0, "&RightUpTeeVector;"], [0, "&RightDownTeeVector;"], [0, "&DownLeftTeeVector;"], [0, "&DownRightTeeVector;"], [0, "&LeftUpTeeVector;"], [0, "&LeftDownTeeVector;"], [0, "&lHar;"], [0, "&uHar;"], [0, "&rHar;"], [0, "&dHar;"], [0, "&luruhar;"], [0, "&ldrdhar;"], [0, "&ruluhar;"], [0, "&rdldhar;"], [0, "&lharul;"], [0, "&llhard;"], [0, "&rharul;"], [0, "&lrhard;"], [0, "&udhar;"], [0, "&duhar;"], [0, "&RoundImplies;"], [0, "&erarr;"], [0, "&simrarr;"], [0, "&larrsim;"], [0, "&rarrsim;"], [0, "&rarrap;"], [0, "&ltlarr;"], [1, "&gtrarr;"], [0, "&subrarr;"], [1, "&suplarr;"], [0, "&lfisht;"], [0, "&rfisht;"], [0, "&ufisht;"], [0, "&dfisht;"], [5, "&lopar;"], [0, "&ropar;"], [4, "&lbrke;"], [0, "&rbrke;"], [0, "&lbrkslu;"], [0, "&rbrksld;"], [0, "&lbrksld;"], [0, "&rbrkslu;"], [0, "&langd;"], [0, "&rangd;"], [0, "&lparlt;"], [0, "&rpargt;"], [0, "&gtlPar;"], [0, "&ltrPar;"], [3, "&vzigzag;"], [1, "&vangrt;"], [0, "&angrtvbd;"], [6, "&ange;"], [0, "&range;"], [0, "&dwangle;"], [0, "&uwangle;"], [0, "&angmsdaa;"], [0, "&angmsdab;"], [0, "&angmsdac;"], [0, "&angmsdad;"], [0, "&angmsdae;"], [0, "&angmsdaf;"], [0, "&angmsdag;"], [0, "&angmsdah;"], [0, "&bemptyv;"], [0, "&demptyv;"], [0, "&cemptyv;"], [0, "&raemptyv;"], [0, "&laemptyv;"], [0, "&ohbar;"], [0, "&omid;"], [0, "&opar;"], [1, "&operp;"], [1, "&olcross;"], [0, "&odsold;"], [1, "&olcir;"], [0, "&ofcir;"], [0, "&olt;"], [0, "&ogt;"], [0, "&cirscir;"], [0, "&cirE;"], [0, "&solb;"], [0, "&bsolb;"], [3, "&boxbox;"], [3, "&trisb;"], [0, "&rtriltri;"], [0, {
  v: "&LeftTriangleBar;",
  n: 824,
  o: "&NotLeftTriangleBar;"
}], [0, {
  v: "&RightTriangleBar;",
  n: 824,
  o: "&NotRightTriangleBar;"
}], [11, "&iinfin;"], [0, "&infintie;"], [0, "&nvinfin;"], [4, "&eparsl;"], [0, "&smeparsl;"], [0, "&eqvparsl;"], [5, "&blacklozenge;"], [8, "&RuleDelayed;"], [1, "&dsol;"], [9, "&bigodot;"], [0, "&bigoplus;"], [0, "&bigotimes;"], [1, "&biguplus;"], [1, "&bigsqcup;"], [5, "&iiiint;"], [0, "&fpartint;"], [2, "&cirfnint;"], [0, "&awint;"], [0, "&rppolint;"], [0, "&scpolint;"], [0, "&npolint;"], [0, "&pointint;"], [0, "&quatint;"], [0, "&intlarhk;"], [10, "&pluscir;"], [0, "&plusacir;"], [0, "&simplus;"], [0, "&plusdu;"], [0, "&plussim;"], [0, "&plustwo;"], [1, "&mcomma;"], [0, "&minusdu;"], [2, "&loplus;"], [0, "&roplus;"], [0, "&Cross;"], [0, "&timesd;"], [0, "&timesbar;"], [1, "&smashp;"], [0, "&lotimes;"], [0, "&rotimes;"], [0, "&otimesas;"], [0, "&Otimes;"], [0, "&odiv;"], [0, "&triplus;"], [0, "&triminus;"], [0, "&tritime;"], [0, "&intprod;"], [2, "&amalg;"], [0, "&capdot;"], [1, "&ncup;"], [0, "&ncap;"], [0, "&capand;"], [0, "&cupor;"], [0, "&cupcap;"], [0, "&capcup;"], [0, "&cupbrcap;"], [0, "&capbrcup;"], [0, "&cupcup;"], [0, "&capcap;"], [0, "&ccups;"], [0, "&ccaps;"], [2, "&ccupssm;"], [2, "&And;"], [0, "&Or;"], [0, "&andand;"], [0, "&oror;"], [0, "&orslope;"], [0, "&andslope;"], [1, "&andv;"], [0, "&orv;"], [0, "&andd;"], [0, "&ord;"], [1, "&wedbar;"], [6, "&sdote;"], [3, "&simdot;"], [2, {
  v: "&congdot;",
  n: 824,
  o: "&ncongdot;"
}], [0, "&easter;"], [0, "&apacir;"], [0, {
  v: "&apE;",
  n: 824,
  o: "&napE;"
}], [0, "&eplus;"], [0, "&pluse;"], [0, "&Esim;"], [0, "&Colone;"], [0, "&Equal;"], [1, "&ddotseq;"], [0, "&equivDD;"], [0, "&ltcir;"], [0, "&gtcir;"], [0, "&ltquest;"], [0, "&gtquest;"], [0, {
  v: "&leqslant;",
  n: 824,
  o: "&nleqslant;"
}], [0, {
  v: "&geqslant;",
  n: 824,
  o: "&ngeqslant;"
}], [0, "&lesdot;"], [0, "&gesdot;"], [0, "&lesdoto;"], [0, "&gesdoto;"], [0, "&lesdotor;"], [0, "&gesdotol;"], [0, "&lap;"], [0, "&gap;"], [0, "&lne;"], [0, "&gne;"], [0, "&lnap;"], [0, "&gnap;"], [0, "&lEg;"], [0, "&gEl;"], [0, "&lsime;"], [0, "&gsime;"], [0, "&lsimg;"], [0, "&gsiml;"], [0, "&lgE;"], [0, "&glE;"], [0, "&lesges;"], [0, "&gesles;"], [0, "&els;"], [0, "&egs;"], [0, "&elsdot;"], [0, "&egsdot;"], [0, "&el;"], [0, "&eg;"], [2, "&siml;"], [0, "&simg;"], [0, "&simlE;"], [0, "&simgE;"], [0, {
  v: "&LessLess;",
  n: 824,
  o: "&NotNestedLessLess;"
}], [0, {
  v: "&GreaterGreater;",
  n: 824,
  o: "&NotNestedGreaterGreater;"
}], [1, "&glj;"], [0, "&gla;"], [0, "&ltcc;"], [0, "&gtcc;"], [0, "&lescc;"], [0, "&gescc;"], [0, "&smt;"], [0, "&lat;"], [0, {
  v: "&smte;",
  n: 65024,
  o: "&smtes;"
}], [0, {
  v: "&late;",
  n: 65024,
  o: "&lates;"
}], [0, "&bumpE;"], [0, {
  v: "&PrecedesEqual;",
  n: 824,
  o: "&NotPrecedesEqual;"
}], [0, {
  v: "&sce;",
  n: 824,
  o: "&NotSucceedsEqual;"
}], [2, "&prE;"], [0, "&scE;"], [0, "&precneqq;"], [0, "&scnE;"], [0, "&prap;"], [0, "&scap;"], [0, "&precnapprox;"], [0, "&scnap;"], [0, "&Pr;"], [0, "&Sc;"], [0, "&subdot;"], [0, "&supdot;"], [0, "&subplus;"], [0, "&supplus;"], [0, "&submult;"], [0, "&supmult;"], [0, "&subedot;"], [0, "&supedot;"], [0, {
  v: "&subE;",
  n: 824,
  o: "&nsubE;"
}], [0, {
  v: "&supE;",
  n: 824,
  o: "&nsupE;"
}], [0, "&subsim;"], [0, "&supsim;"], [2, {
  v: "&subnE;",
  n: 65024,
  o: "&varsubsetneqq;"
}], [0, {
  v: "&supnE;",
  n: 65024,
  o: "&varsupsetneqq;"
}], [2, "&csub;"], [0, "&csup;"], [0, "&csube;"], [0, "&csupe;"], [0, "&subsup;"], [0, "&supsub;"], [0, "&subsub;"], [0, "&supsup;"], [0, "&suphsub;"], [0, "&supdsub;"], [0, "&forkv;"], [0, "&topfork;"], [0, "&mlcp;"], [8, "&Dashv;"], [1, "&Vdashl;"], [0, "&Barv;"], [0, "&vBar;"], [0, "&vBarv;"], [1, "&Vbar;"], [0, "&Not;"], [0, "&bNot;"], [0, "&rnmid;"], [0, "&cirmid;"], [0, "&midcir;"], [0, "&topcir;"], [0, "&nhpar;"], [0, "&parsim;"], [9, {
  v: "&parsl;",
  n: 8421,
  o: "&nparsl;"
}], [44343, {
  n: new Map( /* #__PURE__ */restoreDiff([[56476, "&Ascr;"], [1, "&Cscr;"], [0, "&Dscr;"], [2, "&Gscr;"], [2, "&Jscr;"], [0, "&Kscr;"], [2, "&Nscr;"], [0, "&Oscr;"], [0, "&Pscr;"], [0, "&Qscr;"], [1, "&Sscr;"], [0, "&Tscr;"], [0, "&Uscr;"], [0, "&Vscr;"], [0, "&Wscr;"], [0, "&Xscr;"], [0, "&Yscr;"], [0, "&Zscr;"], [0, "&ascr;"], [0, "&bscr;"], [0, "&cscr;"], [0, "&dscr;"], [1, "&fscr;"], [1, "&hscr;"], [0, "&iscr;"], [0, "&jscr;"], [0, "&kscr;"], [0, "&lscr;"], [0, "&mscr;"], [0, "&nscr;"], [1, "&pscr;"], [0, "&qscr;"], [0, "&rscr;"], [0, "&sscr;"], [0, "&tscr;"], [0, "&uscr;"], [0, "&vscr;"], [0, "&wscr;"], [0, "&xscr;"], [0, "&yscr;"], [0, "&zscr;"], [52, "&Afr;"], [0, "&Bfr;"], [1, "&Dfr;"], [0, "&Efr;"], [0, "&Ffr;"], [0, "&Gfr;"], [2, "&Jfr;"], [0, "&Kfr;"], [0, "&Lfr;"], [0, "&Mfr;"], [0, "&Nfr;"], [0, "&Ofr;"], [0, "&Pfr;"], [0, "&Qfr;"], [1, "&Sfr;"], [0, "&Tfr;"], [0, "&Ufr;"], [0, "&Vfr;"], [0, "&Wfr;"], [0, "&Xfr;"], [0, "&Yfr;"], [1, "&afr;"], [0, "&bfr;"], [0, "&cfr;"], [0, "&dfr;"], [0, "&efr;"], [0, "&ffr;"], [0, "&gfr;"], [0, "&hfr;"], [0, "&ifr;"], [0, "&jfr;"], [0, "&kfr;"], [0, "&lfr;"], [0, "&mfr;"], [0, "&nfr;"], [0, "&ofr;"], [0, "&pfr;"], [0, "&qfr;"], [0, "&rfr;"], [0, "&sfr;"], [0, "&tfr;"], [0, "&ufr;"], [0, "&vfr;"], [0, "&wfr;"], [0, "&xfr;"], [0, "&yfr;"], [0, "&zfr;"], [0, "&Aopf;"], [0, "&Bopf;"], [1, "&Dopf;"], [0, "&Eopf;"], [0, "&Fopf;"], [0, "&Gopf;"], [1, "&Iopf;"], [0, "&Jopf;"], [0, "&Kopf;"], [0, "&Lopf;"], [0, "&Mopf;"], [1, "&Oopf;"], [3, "&Sopf;"], [0, "&Topf;"], [0, "&Uopf;"], [0, "&Vopf;"], [0, "&Wopf;"], [0, "&Xopf;"], [0, "&Yopf;"], [1, "&aopf;"], [0, "&bopf;"], [0, "&copf;"], [0, "&dopf;"], [0, "&eopf;"], [0, "&fopf;"], [0, "&gopf;"], [0, "&hopf;"], [0, "&iopf;"], [0, "&jopf;"], [0, "&kopf;"], [0, "&lopf;"], [0, "&mopf;"], [0, "&nopf;"], [0, "&oopf;"], [0, "&popf;"], [0, "&qopf;"], [0, "&ropf;"], [0, "&sopf;"], [0, "&topf;"], [0, "&uopf;"], [0, "&vopf;"], [0, "&wopf;"], [0, "&xopf;"], [0, "&yopf;"], [0, "&zopf;"]]))
}], [8906, "&fflig;"], [0, "&filig;"], [0, "&fllig;"], [0, "&ffilig;"], [0, "&ffllig;"]])));

/***/ }),

/***/ "./node_modules/entities/lib/esm/index.js":
/*!************************************************!*\
  !*** ./node_modules/entities/lib/esm/index.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DecodingMode": () => (/* binding */ DecodingMode),
/* harmony export */   "EncodingMode": () => (/* binding */ EncodingMode),
/* harmony export */   "EntityLevel": () => (/* binding */ EntityLevel),
/* harmony export */   "decode": () => (/* binding */ decode),
/* harmony export */   "decodeHTML": () => (/* reexport safe */ _decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeHTML),
/* harmony export */   "decodeHTML4": () => (/* reexport safe */ _decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeHTML),
/* harmony export */   "decodeHTML4Strict": () => (/* reexport safe */ _decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeHTMLStrict),
/* harmony export */   "decodeHTML5": () => (/* reexport safe */ _decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeHTML),
/* harmony export */   "decodeHTML5Strict": () => (/* reexport safe */ _decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeHTMLStrict),
/* harmony export */   "decodeHTMLStrict": () => (/* reexport safe */ _decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeHTMLStrict),
/* harmony export */   "decodeStrict": () => (/* binding */ decodeStrict),
/* harmony export */   "decodeXML": () => (/* reexport safe */ _decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeXML),
/* harmony export */   "decodeXMLStrict": () => (/* reexport safe */ _decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeXML),
/* harmony export */   "encode": () => (/* binding */ encode),
/* harmony export */   "encodeHTML": () => (/* reexport safe */ _encode_js__WEBPACK_IMPORTED_MODULE_1__.encodeHTML),
/* harmony export */   "encodeHTML4": () => (/* reexport safe */ _encode_js__WEBPACK_IMPORTED_MODULE_1__.encodeHTML),
/* harmony export */   "encodeHTML5": () => (/* reexport safe */ _encode_js__WEBPACK_IMPORTED_MODULE_1__.encodeHTML),
/* harmony export */   "encodeNonAsciiHTML": () => (/* reexport safe */ _encode_js__WEBPACK_IMPORTED_MODULE_1__.encodeNonAsciiHTML),
/* harmony export */   "encodeXML": () => (/* reexport safe */ _escape_js__WEBPACK_IMPORTED_MODULE_2__.encodeXML),
/* harmony export */   "escape": () => (/* reexport safe */ _escape_js__WEBPACK_IMPORTED_MODULE_2__.escape),
/* harmony export */   "escapeAttribute": () => (/* reexport safe */ _escape_js__WEBPACK_IMPORTED_MODULE_2__.escapeAttribute),
/* harmony export */   "escapeText": () => (/* reexport safe */ _escape_js__WEBPACK_IMPORTED_MODULE_2__.escapeText),
/* harmony export */   "escapeUTF8": () => (/* reexport safe */ _escape_js__WEBPACK_IMPORTED_MODULE_2__.escapeUTF8)
/* harmony export */ });
/* harmony import */ var _decode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./decode.js */ "./node_modules/entities/lib/esm/decode.js");
/* harmony import */ var _encode_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./encode.js */ "./node_modules/entities/lib/esm/encode.js");
/* harmony import */ var _escape_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./escape.js */ "./node_modules/entities/lib/esm/escape.js");



/** The level of entities to support. */

var EntityLevel;

(function (EntityLevel) {
  /** Support only XML entities. */
  EntityLevel[EntityLevel["XML"] = 0] = "XML";
  /** Support HTML entities, which are a superset of XML entities. */

  EntityLevel[EntityLevel["HTML"] = 1] = "HTML";
})(EntityLevel || (EntityLevel = {}));
/** Determines whether some entities are allowed to be written without a trailing `;`. */


var DecodingMode;

(function (DecodingMode) {
  /** Support legacy HTML entities. */
  DecodingMode[DecodingMode["Legacy"] = 0] = "Legacy";
  /** Do not support legacy HTML entities. */

  DecodingMode[DecodingMode["Strict"] = 1] = "Strict";
})(DecodingMode || (DecodingMode = {}));

var EncodingMode;

(function (EncodingMode) {
  /**
   * The output is UTF-8 encoded. Only characters that need escaping within
   * XML will be escaped.
   */
  EncodingMode[EncodingMode["UTF8"] = 0] = "UTF8";
  /**
   * The output consists only of ASCII characters. Characters that need
   * escaping within HTML, and characters that aren't ASCII characters will
   * be escaped.
   */

  EncodingMode[EncodingMode["ASCII"] = 1] = "ASCII";
  /**
   * Encode all characters that have an equivalent entity, as well as all
   * characters that are not ASCII characters.
   */

  EncodingMode[EncodingMode["Extensive"] = 2] = "Extensive";
  /**
   * Encode all characters that have to be escaped in HTML attributes,
   * following {@link https://html.spec.whatwg.org/multipage/parsing.html#escapingString}.
   */

  EncodingMode[EncodingMode["Attribute"] = 3] = "Attribute";
  /**
   * Encode all characters that have to be escaped in HTML text,
   * following {@link https://html.spec.whatwg.org/multipage/parsing.html#escapingString}.
   */

  EncodingMode[EncodingMode["Text"] = 4] = "Text";
})(EncodingMode || (EncodingMode = {}));
/**
 * Decodes a string with entities.
 *
 * @param data String to decode.
 * @param options Decoding options.
 */


function decode(data, options) {
  if (options === void 0) {
    options = EntityLevel.XML;
  }

  var opts = typeof options === "number" ? {
    level: options
  } : options;

  if (opts.level === EntityLevel.HTML) {
    if (opts.mode === DecodingMode.Strict) {
      return (0,_decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeHTMLStrict)(data);
    }

    return (0,_decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeHTML)(data);
  }

  return (0,_decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeXML)(data);
}
/**
 * Decodes a string with entities. Does not allow missing trailing semicolons for entities.
 *
 * @param data String to decode.
 * @param options Decoding options.
 * @deprecated Use `decode` with the `mode` set to `Strict`.
 */

function decodeStrict(data, options) {
  if (options === void 0) {
    options = EntityLevel.XML;
  }

  var opts = typeof options === "number" ? {
    level: options
  } : options;

  if (opts.level === EntityLevel.HTML) {
    if (opts.mode === DecodingMode.Legacy) {
      return (0,_decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeHTML)(data);
    }

    return (0,_decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeHTMLStrict)(data);
  }

  return (0,_decode_js__WEBPACK_IMPORTED_MODULE_0__.decodeXML)(data);
}
/**
 * Encodes a string with entities.
 *
 * @param data String to encode.
 * @param options Encoding options.
 */

function encode(data, options) {
  if (options === void 0) {
    options = EntityLevel.XML;
  }

  var opts = typeof options === "number" ? {
    level: options
  } : options; // Mode `UTF8` just escapes XML entities

  if (opts.mode === EncodingMode.UTF8) return (0,_escape_js__WEBPACK_IMPORTED_MODULE_2__.escapeUTF8)(data);
  if (opts.mode === EncodingMode.Attribute) return (0,_escape_js__WEBPACK_IMPORTED_MODULE_2__.escapeAttribute)(data);
  if (opts.mode === EncodingMode.Text) return (0,_escape_js__WEBPACK_IMPORTED_MODULE_2__.escapeText)(data);

  if (opts.level === EntityLevel.HTML) {
    if (opts.mode === EncodingMode.ASCII) {
      return (0,_encode_js__WEBPACK_IMPORTED_MODULE_1__.encodeNonAsciiHTML)(data);
    }

    return (0,_encode_js__WEBPACK_IMPORTED_MODULE_1__.encodeHTML)(data);
  } // ASCII and Extensive are equivalent


  return (0,_escape_js__WEBPACK_IMPORTED_MODULE_2__.encodeXML)(data);
}




/***/ }),

/***/ "./node_modules/htmlparser2/lib/esm/Parser.js":
/*!****************************************************!*\
  !*** ./node_modules/htmlparser2/lib/esm/Parser.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Parser": () => (/* binding */ Parser)
/* harmony export */ });
/* harmony import */ var _Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tokenizer.js */ "./node_modules/htmlparser2/lib/esm/Tokenizer.js");
/* harmony import */ var entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! entities/lib/decode.js */ "./node_modules/entities/lib/esm/decode.js");


var formTags = new Set(["input", "option", "optgroup", "select", "button", "datalist", "textarea"]);
var pTag = new Set(["p"]);
var tableSectionTags = new Set(["thead", "tbody"]);
var ddtTags = new Set(["dd", "dt"]);
var rtpTags = new Set(["rt", "rp"]);
var openImpliesClose = new Map([["tr", new Set(["tr", "th", "td"])], ["th", new Set(["th"])], ["td", new Set(["thead", "th", "td"])], ["body", new Set(["head", "link", "script"])], ["li", new Set(["li"])], ["p", pTag], ["h1", pTag], ["h2", pTag], ["h3", pTag], ["h4", pTag], ["h5", pTag], ["h6", pTag], ["select", formTags], ["input", formTags], ["output", formTags], ["button", formTags], ["datalist", formTags], ["textarea", formTags], ["option", new Set(["option"])], ["optgroup", new Set(["optgroup", "option"])], ["dd", ddtTags], ["dt", ddtTags], ["address", pTag], ["article", pTag], ["aside", pTag], ["blockquote", pTag], ["details", pTag], ["div", pTag], ["dl", pTag], ["fieldset", pTag], ["figcaption", pTag], ["figure", pTag], ["footer", pTag], ["form", pTag], ["header", pTag], ["hr", pTag], ["main", pTag], ["nav", pTag], ["ol", pTag], ["pre", pTag], ["section", pTag], ["table", pTag], ["ul", pTag], ["rt", rtpTags], ["rp", rtpTags], ["tbody", tableSectionTags], ["tfoot", tableSectionTags]]);
var voidElements = new Set(["area", "base", "basefont", "br", "col", "command", "embed", "frame", "hr", "img", "input", "isindex", "keygen", "link", "meta", "param", "source", "track", "wbr"]);
var foreignContextElements = new Set(["math", "svg"]);
var htmlIntegrationElements = new Set(["mi", "mo", "mn", "ms", "mtext", "annotation-xml", "foreignobject", "desc", "title"]);
var reNameEnd = /\s|\//;
var Parser = /*#__PURE__*/function () {
  function Parser(cbs, options) {
    if (options === void 0) {
      options = {};
    }

    var _a, _b, _c, _d, _e;

    this.options = options;
    /** The start index of the last event. */

    this.startIndex = 0;
    /** The end index of the last event. */

    this.endIndex = 0;
    /**
     * Store the start index of the current open tag,
     * so we can update the start index for attributes.
     */

    this.openTagStart = 0;
    this.tagname = "";
    this.attribname = "";
    this.attribvalue = "";
    this.attribs = null;
    this.stack = [];
    this.foreignContext = [];
    this.buffers = [];
    this.bufferOffset = 0;
    /** The index of the last written buffer. Used when resuming after a `pause()`. */

    this.writeIndex = 0;
    /** Indicates whether the parser has finished running / `.end` has been called. */

    this.ended = false;
    this.cbs = cbs !== null && cbs !== void 0 ? cbs : {};
    this.lowerCaseTagNames = (_a = options.lowerCaseTags) !== null && _a !== void 0 ? _a : !options.xmlMode;
    this.lowerCaseAttributeNames = (_b = options.lowerCaseAttributeNames) !== null && _b !== void 0 ? _b : !options.xmlMode;
    this.tokenizer = new ((_c = options.Tokenizer) !== null && _c !== void 0 ? _c : _Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this.options, this);
    (_e = (_d = this.cbs).onparserinit) === null || _e === void 0 ? void 0 : _e.call(_d, this);
  } // Tokenizer event handlers

  /** @internal */


  var _proto = Parser.prototype;

  _proto.ontext = function ontext(start, endIndex) {
    var _a, _b;

    var data = this.getSlice(start, endIndex);
    this.endIndex = endIndex - 1;
    (_b = (_a = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a, data);
    this.startIndex = endIndex;
  }
  /** @internal */
  ;

  _proto.ontextentity = function ontextentity(cp) {
    var _a, _b;
    /*
     * Entities can be emitted on the character, or directly after.
     * We use the section start here to get accurate indices.
     */


    var idx = this.tokenizer.getSectionStart();
    this.endIndex = idx - 1;
    (_b = (_a = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a, (0,entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_1__.fromCodePoint)(cp));
    this.startIndex = idx;
  };

  _proto.isVoidElement = function isVoidElement(name) {
    return !this.options.xmlMode && voidElements.has(name);
  }
  /** @internal */
  ;

  _proto.onopentagname = function onopentagname(start, endIndex) {
    this.endIndex = endIndex;
    var name = this.getSlice(start, endIndex);

    if (this.lowerCaseTagNames) {
      name = name.toLowerCase();
    }

    this.emitOpenTag(name);
  };

  _proto.emitOpenTag = function emitOpenTag(name) {
    var _a, _b, _c, _d;

    this.openTagStart = this.startIndex;
    this.tagname = name;
    var impliesClose = !this.options.xmlMode && openImpliesClose.get(name);

    if (impliesClose) {
      while (this.stack.length > 0 && impliesClose.has(this.stack[this.stack.length - 1])) {
        var el = this.stack.pop();
        (_b = (_a = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a, el, true);
      }
    }

    if (!this.isVoidElement(name)) {
      this.stack.push(name);

      if (foreignContextElements.has(name)) {
        this.foreignContext.push(true);
      } else if (htmlIntegrationElements.has(name)) {
        this.foreignContext.push(false);
      }
    }

    (_d = (_c = this.cbs).onopentagname) === null || _d === void 0 ? void 0 : _d.call(_c, name);
    if (this.cbs.onopentag) this.attribs = {};
  };

  _proto.endOpenTag = function endOpenTag(isImplied) {
    var _a, _b;

    this.startIndex = this.openTagStart;

    if (this.attribs) {
      (_b = (_a = this.cbs).onopentag) === null || _b === void 0 ? void 0 : _b.call(_a, this.tagname, this.attribs, isImplied);
      this.attribs = null;
    }

    if (this.cbs.onclosetag && this.isVoidElement(this.tagname)) {
      this.cbs.onclosetag(this.tagname, true);
    }

    this.tagname = "";
  }
  /** @internal */
  ;

  _proto.onopentagend = function onopentagend(endIndex) {
    this.endIndex = endIndex;
    this.endOpenTag(false); // Set `startIndex` for next node

    this.startIndex = endIndex + 1;
  }
  /** @internal */
  ;

  _proto.onclosetag = function onclosetag(start, endIndex) {
    var _a, _b, _c, _d, _e, _f;

    this.endIndex = endIndex;
    var name = this.getSlice(start, endIndex);

    if (this.lowerCaseTagNames) {
      name = name.toLowerCase();
    }

    if (foreignContextElements.has(name) || htmlIntegrationElements.has(name)) {
      this.foreignContext.pop();
    }

    if (!this.isVoidElement(name)) {
      var pos = this.stack.lastIndexOf(name);

      if (pos !== -1) {
        if (this.cbs.onclosetag) {
          var count = this.stack.length - pos;

          while (count--) {
            // We know the stack has sufficient elements.
            this.cbs.onclosetag(this.stack.pop(), count !== 0);
          }
        } else this.stack.length = pos;
      } else if (!this.options.xmlMode && name === "p") {
        // Implicit open before close
        this.emitOpenTag("p");
        this.closeCurrentTag(true);
      }
    } else if (!this.options.xmlMode && name === "br") {
      // We can't use `emitOpenTag` for implicit open, as `br` would be implicitly closed.
      (_b = (_a = this.cbs).onopentagname) === null || _b === void 0 ? void 0 : _b.call(_a, "br");
      (_d = (_c = this.cbs).onopentag) === null || _d === void 0 ? void 0 : _d.call(_c, "br", {}, true);
      (_f = (_e = this.cbs).onclosetag) === null || _f === void 0 ? void 0 : _f.call(_e, "br", false);
    } // Set `startIndex` for next node


    this.startIndex = endIndex + 1;
  }
  /** @internal */
  ;

  _proto.onselfclosingtag = function onselfclosingtag(endIndex) {
    this.endIndex = endIndex;

    if (this.options.xmlMode || this.options.recognizeSelfClosing || this.foreignContext[this.foreignContext.length - 1]) {
      this.closeCurrentTag(false); // Set `startIndex` for next node

      this.startIndex = endIndex + 1;
    } else {
      // Ignore the fact that the tag is self-closing.
      this.onopentagend(endIndex);
    }
  };

  _proto.closeCurrentTag = function closeCurrentTag(isOpenImplied) {
    var _a, _b;

    var name = this.tagname;
    this.endOpenTag(isOpenImplied); // Self-closing tags will be on the top of the stack

    if (this.stack[this.stack.length - 1] === name) {
      // If the opening tag isn't implied, the closing tag has to be implied.
      (_b = (_a = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a, name, !isOpenImplied);
      this.stack.pop();
    }
  }
  /** @internal */
  ;

  _proto.onattribname = function onattribname(start, endIndex) {
    this.startIndex = start;
    var name = this.getSlice(start, endIndex);
    this.attribname = this.lowerCaseAttributeNames ? name.toLowerCase() : name;
  }
  /** @internal */
  ;

  _proto.onattribdata = function onattribdata(start, endIndex) {
    this.attribvalue += this.getSlice(start, endIndex);
  }
  /** @internal */
  ;

  _proto.onattribentity = function onattribentity(cp) {
    this.attribvalue += (0,entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_1__.fromCodePoint)(cp);
  }
  /** @internal */
  ;

  _proto.onattribend = function onattribend(quote, endIndex) {
    var _a, _b;

    this.endIndex = endIndex;
    (_b = (_a = this.cbs).onattribute) === null || _b === void 0 ? void 0 : _b.call(_a, this.attribname, this.attribvalue, quote === _Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.QuoteType.Double ? '"' : quote === _Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.QuoteType.Single ? "'" : quote === _Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.QuoteType.NoValue ? undefined : null);

    if (this.attribs && !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname)) {
      this.attribs[this.attribname] = this.attribvalue;
    }

    this.attribvalue = "";
  };

  _proto.getInstructionName = function getInstructionName(value) {
    var idx = value.search(reNameEnd);
    var name = idx < 0 ? value : value.substr(0, idx);

    if (this.lowerCaseTagNames) {
      name = name.toLowerCase();
    }

    return name;
  }
  /** @internal */
  ;

  _proto.ondeclaration = function ondeclaration(start, endIndex) {
    this.endIndex = endIndex;
    var value = this.getSlice(start, endIndex);

    if (this.cbs.onprocessinginstruction) {
      var name = this.getInstructionName(value);
      this.cbs.onprocessinginstruction("!" + name, "!" + value);
    } // Set `startIndex` for next node


    this.startIndex = endIndex + 1;
  }
  /** @internal */
  ;

  _proto.onprocessinginstruction = function onprocessinginstruction(start, endIndex) {
    this.endIndex = endIndex;
    var value = this.getSlice(start, endIndex);

    if (this.cbs.onprocessinginstruction) {
      var name = this.getInstructionName(value);
      this.cbs.onprocessinginstruction("?" + name, "?" + value);
    } // Set `startIndex` for next node


    this.startIndex = endIndex + 1;
  }
  /** @internal */
  ;

  _proto.oncomment = function oncomment(start, endIndex, offset) {
    var _a, _b, _c, _d;

    this.endIndex = endIndex;
    (_b = (_a = this.cbs).oncomment) === null || _b === void 0 ? void 0 : _b.call(_a, this.getSlice(start, endIndex - offset));
    (_d = (_c = this.cbs).oncommentend) === null || _d === void 0 ? void 0 : _d.call(_c); // Set `startIndex` for next node

    this.startIndex = endIndex + 1;
  }
  /** @internal */
  ;

  _proto.oncdata = function oncdata(start, endIndex, offset) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;

    this.endIndex = endIndex;
    var value = this.getSlice(start, endIndex - offset);

    if (this.options.xmlMode || this.options.recognizeCDATA) {
      (_b = (_a = this.cbs).oncdatastart) === null || _b === void 0 ? void 0 : _b.call(_a);
      (_d = (_c = this.cbs).ontext) === null || _d === void 0 ? void 0 : _d.call(_c, value);
      (_f = (_e = this.cbs).oncdataend) === null || _f === void 0 ? void 0 : _f.call(_e);
    } else {
      (_h = (_g = this.cbs).oncomment) === null || _h === void 0 ? void 0 : _h.call(_g, "[CDATA[" + value + "]]");
      (_k = (_j = this.cbs).oncommentend) === null || _k === void 0 ? void 0 : _k.call(_j);
    } // Set `startIndex` for next node


    this.startIndex = endIndex + 1;
  }
  /** @internal */
  ;

  _proto.onend = function onend() {
    var _a, _b;

    if (this.cbs.onclosetag) {
      // Set the end index for all remaining tags
      this.endIndex = this.startIndex;

      for (var i = this.stack.length; i > 0; this.cbs.onclosetag(this.stack[--i], true)) {
        ;
      }
    }

    (_b = (_a = this.cbs).onend) === null || _b === void 0 ? void 0 : _b.call(_a);
  }
  /**
   * Resets the parser to a blank state, ready to parse a new HTML document
   */
  ;

  _proto.reset = function reset() {
    var _a, _b, _c, _d;

    (_b = (_a = this.cbs).onreset) === null || _b === void 0 ? void 0 : _b.call(_a);
    this.tokenizer.reset();
    this.tagname = "";
    this.attribname = "";
    this.attribs = null;
    this.stack.length = 0;
    this.startIndex = 0;
    this.endIndex = 0;
    (_d = (_c = this.cbs).onparserinit) === null || _d === void 0 ? void 0 : _d.call(_c, this);
    this.buffers.length = 0;
    this.bufferOffset = 0;
    this.writeIndex = 0;
    this.ended = false;
  }
  /**
   * Resets the parser, then parses a complete document and
   * pushes it to the handler.
   *
   * @param data Document to parse.
   */
  ;

  _proto.parseComplete = function parseComplete(data) {
    this.reset();
    this.end(data);
  };

  _proto.getSlice = function getSlice(start, end) {
    while (start - this.bufferOffset >= this.buffers[0].length) {
      this.shiftBuffer();
    }

    var str = this.buffers[0].slice(start - this.bufferOffset, end - this.bufferOffset);

    while (end - this.bufferOffset > this.buffers[0].length) {
      this.shiftBuffer();
      str += this.buffers[0].slice(0, end - this.bufferOffset);
    }

    return str;
  };

  _proto.shiftBuffer = function shiftBuffer() {
    this.bufferOffset += this.buffers[0].length;
    this.writeIndex--;
    this.buffers.shift();
  }
  /**
   * Parses a chunk of data and calls the corresponding callbacks.
   *
   * @param chunk Chunk to parse.
   */
  ;

  _proto.write = function write(chunk) {
    var _a, _b;

    if (this.ended) {
      (_b = (_a = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a, new Error(".write() after done!"));
      return;
    }

    this.buffers.push(chunk);

    if (this.tokenizer.running) {
      this.tokenizer.write(chunk);
      this.writeIndex++;
    }
  }
  /**
   * Parses the end of the buffer and clears the stack, calls onend.
   *
   * @param chunk Optional final chunk to parse.
   */
  ;

  _proto.end = function end(chunk) {
    var _a, _b;

    if (this.ended) {
      (_b = (_a = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a, Error(".end() after done!"));
      return;
    }

    if (chunk) this.write(chunk);
    this.ended = true;
    this.tokenizer.end();
  }
  /**
   * Pauses parsing. The parser won't emit events until `resume` is called.
   */
  ;

  _proto.pause = function pause() {
    this.tokenizer.pause();
  }
  /**
   * Resumes parsing after `pause` was called.
   */
  ;

  _proto.resume = function resume() {
    this.tokenizer.resume();

    while (this.tokenizer.running && this.writeIndex < this.buffers.length) {
      this.tokenizer.write(this.buffers[this.writeIndex++]);
    }

    if (this.ended) this.tokenizer.end();
  }
  /**
   * Alias of `write`, for backwards compatibility.
   *
   * @param chunk Chunk to parse.
   * @deprecated
   */
  ;

  _proto.parseChunk = function parseChunk(chunk) {
    this.write(chunk);
  }
  /**
   * Alias of `end`, for backwards compatibility.
   *
   * @param chunk Optional final chunk to parse.
   * @deprecated
   */
  ;

  _proto.done = function done(chunk) {
    this.end(chunk);
  };

  return Parser;
}();

/***/ }),

/***/ "./node_modules/htmlparser2/lib/esm/Tokenizer.js":
/*!*******************************************************!*\
  !*** ./node_modules/htmlparser2/lib/esm/Tokenizer.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "QuoteType": () => (/* binding */ QuoteType),
/* harmony export */   "default": () => (/* binding */ Tokenizer)
/* harmony export */ });
/* harmony import */ var entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! entities/lib/decode.js */ "./node_modules/entities/lib/esm/decode.js");

var CharCodes;

(function (CharCodes) {
  CharCodes[CharCodes["Tab"] = 9] = "Tab";
  CharCodes[CharCodes["NewLine"] = 10] = "NewLine";
  CharCodes[CharCodes["FormFeed"] = 12] = "FormFeed";
  CharCodes[CharCodes["CarriageReturn"] = 13] = "CarriageReturn";
  CharCodes[CharCodes["Space"] = 32] = "Space";
  CharCodes[CharCodes["ExclamationMark"] = 33] = "ExclamationMark";
  CharCodes[CharCodes["Num"] = 35] = "Num";
  CharCodes[CharCodes["Amp"] = 38] = "Amp";
  CharCodes[CharCodes["SingleQuote"] = 39] = "SingleQuote";
  CharCodes[CharCodes["DoubleQuote"] = 34] = "DoubleQuote";
  CharCodes[CharCodes["Dash"] = 45] = "Dash";
  CharCodes[CharCodes["Slash"] = 47] = "Slash";
  CharCodes[CharCodes["Zero"] = 48] = "Zero";
  CharCodes[CharCodes["Nine"] = 57] = "Nine";
  CharCodes[CharCodes["Semi"] = 59] = "Semi";
  CharCodes[CharCodes["Lt"] = 60] = "Lt";
  CharCodes[CharCodes["Eq"] = 61] = "Eq";
  CharCodes[CharCodes["Gt"] = 62] = "Gt";
  CharCodes[CharCodes["Questionmark"] = 63] = "Questionmark";
  CharCodes[CharCodes["UpperA"] = 65] = "UpperA";
  CharCodes[CharCodes["LowerA"] = 97] = "LowerA";
  CharCodes[CharCodes["UpperF"] = 70] = "UpperF";
  CharCodes[CharCodes["LowerF"] = 102] = "LowerF";
  CharCodes[CharCodes["UpperZ"] = 90] = "UpperZ";
  CharCodes[CharCodes["LowerZ"] = 122] = "LowerZ";
  CharCodes[CharCodes["LowerX"] = 120] = "LowerX";
  CharCodes[CharCodes["OpeningSquareBracket"] = 91] = "OpeningSquareBracket";
})(CharCodes || (CharCodes = {}));
/** All the states the tokenizer can be in. */


var State;

(function (State) {
  State[State["Text"] = 1] = "Text";
  State[State["BeforeTagName"] = 2] = "BeforeTagName";
  State[State["InTagName"] = 3] = "InTagName";
  State[State["InSelfClosingTag"] = 4] = "InSelfClosingTag";
  State[State["BeforeClosingTagName"] = 5] = "BeforeClosingTagName";
  State[State["InClosingTagName"] = 6] = "InClosingTagName";
  State[State["AfterClosingTagName"] = 7] = "AfterClosingTagName"; // Attributes

  State[State["BeforeAttributeName"] = 8] = "BeforeAttributeName";
  State[State["InAttributeName"] = 9] = "InAttributeName";
  State[State["AfterAttributeName"] = 10] = "AfterAttributeName";
  State[State["BeforeAttributeValue"] = 11] = "BeforeAttributeValue";
  State[State["InAttributeValueDq"] = 12] = "InAttributeValueDq";
  State[State["InAttributeValueSq"] = 13] = "InAttributeValueSq";
  State[State["InAttributeValueNq"] = 14] = "InAttributeValueNq"; // Declarations

  State[State["BeforeDeclaration"] = 15] = "BeforeDeclaration";
  State[State["InDeclaration"] = 16] = "InDeclaration"; // Processing instructions

  State[State["InProcessingInstruction"] = 17] = "InProcessingInstruction"; // Comments & CDATA

  State[State["BeforeComment"] = 18] = "BeforeComment";
  State[State["CDATASequence"] = 19] = "CDATASequence";
  State[State["InSpecialComment"] = 20] = "InSpecialComment";
  State[State["InCommentLike"] = 21] = "InCommentLike"; // Special tags

  State[State["BeforeSpecialS"] = 22] = "BeforeSpecialS";
  State[State["SpecialStartSequence"] = 23] = "SpecialStartSequence";
  State[State["InSpecialTag"] = 24] = "InSpecialTag";
  State[State["BeforeEntity"] = 25] = "BeforeEntity";
  State[State["BeforeNumericEntity"] = 26] = "BeforeNumericEntity";
  State[State["InNamedEntity"] = 27] = "InNamedEntity";
  State[State["InNumericEntity"] = 28] = "InNumericEntity";
  State[State["InHexEntity"] = 29] = "InHexEntity";
})(State || (State = {}));

function isWhitespace(c) {
  return c === CharCodes.Space || c === CharCodes.NewLine || c === CharCodes.Tab || c === CharCodes.FormFeed || c === CharCodes.CarriageReturn;
}

function isEndOfTagSection(c) {
  return c === CharCodes.Slash || c === CharCodes.Gt || isWhitespace(c);
}

function isNumber(c) {
  return c >= CharCodes.Zero && c <= CharCodes.Nine;
}

function isASCIIAlpha(c) {
  return c >= CharCodes.LowerA && c <= CharCodes.LowerZ || c >= CharCodes.UpperA && c <= CharCodes.UpperZ;
}

function isHexDigit(c) {
  return c >= CharCodes.UpperA && c <= CharCodes.UpperF || c >= CharCodes.LowerA && c <= CharCodes.LowerF;
}

var QuoteType;

(function (QuoteType) {
  QuoteType[QuoteType["NoValue"] = 0] = "NoValue";
  QuoteType[QuoteType["Unquoted"] = 1] = "Unquoted";
  QuoteType[QuoteType["Single"] = 2] = "Single";
  QuoteType[QuoteType["Double"] = 3] = "Double";
})(QuoteType || (QuoteType = {}));
/**
 * Sequences used to match longer strings.
 *
 * We don't have `Script`, `Style`, or `Title` here. Instead, we re-use the *End
 * sequences with an increased offset.
 */


var Sequences = {
  Cdata: new Uint8Array([0x43, 0x44, 0x41, 0x54, 0x41, 0x5b]),
  CdataEnd: new Uint8Array([0x5d, 0x5d, 0x3e]),
  CommentEnd: new Uint8Array([0x2d, 0x2d, 0x3e]),
  ScriptEnd: new Uint8Array([0x3c, 0x2f, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74]),
  StyleEnd: new Uint8Array([0x3c, 0x2f, 0x73, 0x74, 0x79, 0x6c, 0x65]),
  TitleEnd: new Uint8Array([0x3c, 0x2f, 0x74, 0x69, 0x74, 0x6c, 0x65]) // `</title`

};

var Tokenizer = /*#__PURE__*/function () {
  function Tokenizer(_ref, cbs) {
    var _ref$xmlMode = _ref.xmlMode,
        xmlMode = _ref$xmlMode === void 0 ? false : _ref$xmlMode,
        _ref$decodeEntities = _ref.decodeEntities,
        decodeEntities = _ref$decodeEntities === void 0 ? true : _ref$decodeEntities;
    this.cbs = cbs;
    /** The current state the tokenizer is in. */

    this.state = State.Text;
    /** The read buffer. */

    this.buffer = "";
    /** The beginning of the section that is currently being read. */

    this.sectionStart = 0;
    /** The index within the buffer that we are currently looking at. */

    this.index = 0;
    /** Some behavior, eg. when decoding entities, is done while we are in another state. This keeps track of the other state type. */

    this.baseState = State.Text;
    /** For special parsing behavior inside of script and style tags. */

    this.isSpecial = false;
    /** Indicates whether the tokenizer has been paused. */

    this.running = true;
    /** The offset of the current buffer. */

    this.offset = 0;
    this.sequenceIndex = 0;
    this.trieIndex = 0;
    this.trieCurrent = 0;
    /** For named entities, the index of the value. For numeric entities, the code point. */

    this.entityResult = 0;
    this.entityExcess = 0;
    this.xmlMode = xmlMode;
    this.decodeEntities = decodeEntities;
    this.entityTrie = xmlMode ? entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_0__.xmlDecodeTree : entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_0__.htmlDecodeTree;
  }

  var _proto = Tokenizer.prototype;

  _proto.reset = function reset() {
    this.state = State.Text;
    this.buffer = "";
    this.sectionStart = 0;
    this.index = 0;
    this.baseState = State.Text;
    this.currentSequence = undefined;
    this.running = true;
    this.offset = 0;
  };

  _proto.write = function write(chunk) {
    this.offset += this.buffer.length;
    this.buffer = chunk;
    this.parse();
  };

  _proto.end = function end() {
    if (this.running) this.finish();
  };

  _proto.pause = function pause() {
    this.running = false;
  };

  _proto.resume = function resume() {
    this.running = true;

    if (this.index < this.buffer.length + this.offset) {
      this.parse();
    }
  }
  /**
   * The current index within all of the written data.
   */
  ;

  _proto.getIndex = function getIndex() {
    return this.index;
  }
  /**
   * The start of the current section.
   */
  ;

  _proto.getSectionStart = function getSectionStart() {
    return this.sectionStart;
  };

  _proto.stateText = function stateText(c) {
    if (c === CharCodes.Lt || !this.decodeEntities && this.fastForwardTo(CharCodes.Lt)) {
      if (this.index > this.sectionStart) {
        this.cbs.ontext(this.sectionStart, this.index);
      }

      this.state = State.BeforeTagName;
      this.sectionStart = this.index;
    } else if (this.decodeEntities && c === CharCodes.Amp) {
      this.state = State.BeforeEntity;
    }
  };

  _proto.stateSpecialStartSequence = function stateSpecialStartSequence(c) {
    var isEnd = this.sequenceIndex === this.currentSequence.length;
    var isMatch = isEnd ? // If we are at the end of the sequence, make sure the tag name has ended
    isEndOfTagSection(c) : // Otherwise, do a case-insensitive comparison
    (c | 0x20) === this.currentSequence[this.sequenceIndex];

    if (!isMatch) {
      this.isSpecial = false;
    } else if (!isEnd) {
      this.sequenceIndex++;
      return;
    }

    this.sequenceIndex = 0;
    this.state = State.InTagName;
    this.stateInTagName(c);
  }
  /** Look for an end tag. For <title> tags, also decode entities. */
  ;

  _proto.stateInSpecialTag = function stateInSpecialTag(c) {
    if (this.sequenceIndex === this.currentSequence.length) {
      if (c === CharCodes.Gt || isWhitespace(c)) {
        var endOfText = this.index - this.currentSequence.length;

        if (this.sectionStart < endOfText) {
          // Spoof the index so that reported locations match up.
          var actualIndex = this.index;
          this.index = endOfText;
          this.cbs.ontext(this.sectionStart, endOfText);
          this.index = actualIndex;
        }

        this.isSpecial = false;
        this.sectionStart = endOfText + 2; // Skip over the `</`

        this.stateInClosingTagName(c);
        return; // We are done; skip the rest of the function.
      }

      this.sequenceIndex = 0;
    }

    if ((c | 0x20) === this.currentSequence[this.sequenceIndex]) {
      this.sequenceIndex += 1;
    } else if (this.sequenceIndex === 0) {
      if (this.currentSequence === Sequences.TitleEnd) {
        // We have to parse entities in <title> tags.
        if (this.decodeEntities && c === CharCodes.Amp) {
          this.state = State.BeforeEntity;
        }
      } else if (this.fastForwardTo(CharCodes.Lt)) {
        // Outside of <title> tags, we can fast-forward.
        this.sequenceIndex = 1;
      }
    } else {
      // If we see a `<`, set the sequence index to 1; useful for eg. `<</script>`.
      this.sequenceIndex = Number(c === CharCodes.Lt);
    }
  };

  _proto.stateCDATASequence = function stateCDATASequence(c) {
    if (c === Sequences.Cdata[this.sequenceIndex]) {
      if (++this.sequenceIndex === Sequences.Cdata.length) {
        this.state = State.InCommentLike;
        this.currentSequence = Sequences.CdataEnd;
        this.sequenceIndex = 0;
        this.sectionStart = this.index + 1;
      }
    } else {
      this.sequenceIndex = 0;
      this.state = State.InDeclaration;
      this.stateInDeclaration(c); // Reconsume the character
    }
  }
  /**
   * When we wait for one specific character, we can speed things up
   * by skipping through the buffer until we find it.
   *
   * @returns Whether the character was found.
   */
  ;

  _proto.fastForwardTo = function fastForwardTo(c) {
    while (++this.index < this.buffer.length + this.offset) {
      if (this.buffer.charCodeAt(this.index - this.offset) === c) {
        return true;
      }
    }
    /*
     * We increment the index at the end of the `parse` loop,
     * so set it to `buffer.length - 1` here.
     *
     * TODO: Refactor `parse` to increment index before calling states.
     */


    this.index = this.buffer.length + this.offset - 1;
    return false;
  }
  /**
   * Comments and CDATA end with `-->` and `]]>`.
   *
   * Their common qualities are:
   * - Their end sequences have a distinct character they start with.
   * - That character is then repeated, so we have to check multiple repeats.
   * - All characters but the start character of the sequence can be skipped.
   */
  ;

  _proto.stateInCommentLike = function stateInCommentLike(c) {
    if (c === this.currentSequence[this.sequenceIndex]) {
      if (++this.sequenceIndex === this.currentSequence.length) {
        if (this.currentSequence === Sequences.CdataEnd) {
          this.cbs.oncdata(this.sectionStart, this.index, 2);
        } else {
          this.cbs.oncomment(this.sectionStart, this.index, 2);
        }

        this.sequenceIndex = 0;
        this.sectionStart = this.index + 1;
        this.state = State.Text;
      }
    } else if (this.sequenceIndex === 0) {
      // Fast-forward to the first character of the sequence
      if (this.fastForwardTo(this.currentSequence[0])) {
        this.sequenceIndex = 1;
      }
    } else if (c !== this.currentSequence[this.sequenceIndex - 1]) {
      // Allow long sequences, eg. --->, ]]]>
      this.sequenceIndex = 0;
    }
  }
  /**
   * HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a tag name.
   *
   * XML allows a lot more characters here (@see https://www.w3.org/TR/REC-xml/#NT-NameStartChar).
   * We allow anything that wouldn't end the tag.
   */
  ;

  _proto.isTagStartChar = function isTagStartChar(c) {
    return this.xmlMode ? !isEndOfTagSection(c) : isASCIIAlpha(c);
  };

  _proto.startSpecial = function startSpecial(sequence, offset) {
    this.isSpecial = true;
    this.currentSequence = sequence;
    this.sequenceIndex = offset;
    this.state = State.SpecialStartSequence;
  };

  _proto.stateBeforeTagName = function stateBeforeTagName(c) {
    if (c === CharCodes.ExclamationMark) {
      this.state = State.BeforeDeclaration;
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes.Questionmark) {
      this.state = State.InProcessingInstruction;
      this.sectionStart = this.index + 1;
    } else if (this.isTagStartChar(c)) {
      var lower = c | 0x20;
      this.sectionStart = this.index;

      if (!this.xmlMode && lower === Sequences.TitleEnd[2]) {
        this.startSpecial(Sequences.TitleEnd, 3);
      } else {
        this.state = !this.xmlMode && lower === Sequences.ScriptEnd[2] ? State.BeforeSpecialS : State.InTagName;
      }
    } else if (c === CharCodes.Slash) {
      this.state = State.BeforeClosingTagName;
    } else {
      this.state = State.Text;
      this.stateText(c);
    }
  };

  _proto.stateInTagName = function stateInTagName(c) {
    if (isEndOfTagSection(c)) {
      this.cbs.onopentagname(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    }
  };

  _proto.stateBeforeClosingTagName = function stateBeforeClosingTagName(c) {
    if (isWhitespace(c)) {// Ignore
    } else if (c === CharCodes.Gt) {
      this.state = State.Text;
    } else {
      this.state = this.isTagStartChar(c) ? State.InClosingTagName : State.InSpecialComment;
      this.sectionStart = this.index;
    }
  };

  _proto.stateInClosingTagName = function stateInClosingTagName(c) {
    if (c === CharCodes.Gt || isWhitespace(c)) {
      this.cbs.onclosetag(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = State.AfterClosingTagName;
      this.stateAfterClosingTagName(c);
    }
  };

  _proto.stateAfterClosingTagName = function stateAfterClosingTagName(c) {
    // Skip everything until ">"
    if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  };

  _proto.stateBeforeAttributeName = function stateBeforeAttributeName(c) {
    if (c === CharCodes.Gt) {
      this.cbs.onopentagend(this.index);

      if (this.isSpecial) {
        this.state = State.InSpecialTag;
        this.sequenceIndex = 0;
      } else {
        this.state = State.Text;
      }

      this.baseState = this.state;
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes.Slash) {
      this.state = State.InSelfClosingTag;
    } else if (!isWhitespace(c)) {
      this.state = State.InAttributeName;
      this.sectionStart = this.index;
    }
  };

  _proto.stateInSelfClosingTag = function stateInSelfClosingTag(c) {
    if (c === CharCodes.Gt) {
      this.cbs.onselfclosingtag(this.index);
      this.state = State.Text;
      this.baseState = State.Text;
      this.sectionStart = this.index + 1;
      this.isSpecial = false; // Reset special state, in case of self-closing special tags
    } else if (!isWhitespace(c)) {
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    }
  };

  _proto.stateInAttributeName = function stateInAttributeName(c) {
    if (c === CharCodes.Eq || isEndOfTagSection(c)) {
      this.cbs.onattribname(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = State.AfterAttributeName;
      this.stateAfterAttributeName(c);
    }
  };

  _proto.stateAfterAttributeName = function stateAfterAttributeName(c) {
    if (c === CharCodes.Eq) {
      this.state = State.BeforeAttributeValue;
    } else if (c === CharCodes.Slash || c === CharCodes.Gt) {
      this.cbs.onattribend(QuoteType.NoValue, this.index);
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    } else if (!isWhitespace(c)) {
      this.cbs.onattribend(QuoteType.NoValue, this.index);
      this.state = State.InAttributeName;
      this.sectionStart = this.index;
    }
  };

  _proto.stateBeforeAttributeValue = function stateBeforeAttributeValue(c) {
    if (c === CharCodes.DoubleQuote) {
      this.state = State.InAttributeValueDq;
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes.SingleQuote) {
      this.state = State.InAttributeValueSq;
      this.sectionStart = this.index + 1;
    } else if (!isWhitespace(c)) {
      this.sectionStart = this.index;
      this.state = State.InAttributeValueNq;
      this.stateInAttributeValueNoQuotes(c); // Reconsume token
    }
  };

  _proto.handleInAttributeValue = function handleInAttributeValue(c, quote) {
    if (c === quote || !this.decodeEntities && this.fastForwardTo(quote)) {
      this.cbs.onattribdata(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.cbs.onattribend(quote === CharCodes.DoubleQuote ? QuoteType.Double : QuoteType.Single, this.index);
      this.state = State.BeforeAttributeName;
    } else if (this.decodeEntities && c === CharCodes.Amp) {
      this.baseState = this.state;
      this.state = State.BeforeEntity;
    }
  };

  _proto.stateInAttributeValueDoubleQuotes = function stateInAttributeValueDoubleQuotes(c) {
    this.handleInAttributeValue(c, CharCodes.DoubleQuote);
  };

  _proto.stateInAttributeValueSingleQuotes = function stateInAttributeValueSingleQuotes(c) {
    this.handleInAttributeValue(c, CharCodes.SingleQuote);
  };

  _proto.stateInAttributeValueNoQuotes = function stateInAttributeValueNoQuotes(c) {
    if (isWhitespace(c) || c === CharCodes.Gt) {
      this.cbs.onattribdata(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.cbs.onattribend(QuoteType.Unquoted, this.index);
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    } else if (this.decodeEntities && c === CharCodes.Amp) {
      this.baseState = this.state;
      this.state = State.BeforeEntity;
    }
  };

  _proto.stateBeforeDeclaration = function stateBeforeDeclaration(c) {
    if (c === CharCodes.OpeningSquareBracket) {
      this.state = State.CDATASequence;
      this.sequenceIndex = 0;
    } else {
      this.state = c === CharCodes.Dash ? State.BeforeComment : State.InDeclaration;
    }
  };

  _proto.stateInDeclaration = function stateInDeclaration(c) {
    if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
      this.cbs.ondeclaration(this.sectionStart, this.index);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  };

  _proto.stateInProcessingInstruction = function stateInProcessingInstruction(c) {
    if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
      this.cbs.onprocessinginstruction(this.sectionStart, this.index);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  };

  _proto.stateBeforeComment = function stateBeforeComment(c) {
    if (c === CharCodes.Dash) {
      this.state = State.InCommentLike;
      this.currentSequence = Sequences.CommentEnd; // Allow short comments (eg. <!-->)

      this.sequenceIndex = 2;
      this.sectionStart = this.index + 1;
    } else {
      this.state = State.InDeclaration;
    }
  };

  _proto.stateInSpecialComment = function stateInSpecialComment(c) {
    if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
      this.cbs.oncomment(this.sectionStart, this.index, 0);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  };

  _proto.stateBeforeSpecialS = function stateBeforeSpecialS(c) {
    var lower = c | 0x20;

    if (lower === Sequences.ScriptEnd[3]) {
      this.startSpecial(Sequences.ScriptEnd, 4);
    } else if (lower === Sequences.StyleEnd[3]) {
      this.startSpecial(Sequences.StyleEnd, 4);
    } else {
      this.state = State.InTagName;
      this.stateInTagName(c); // Consume the token again
    }
  };

  _proto.stateBeforeEntity = function stateBeforeEntity(c) {
    // Start excess with 1 to include the '&'
    this.entityExcess = 1;
    this.entityResult = 0;

    if (c === CharCodes.Num) {
      this.state = State.BeforeNumericEntity;
    } else if (c === CharCodes.Amp) {// We have two `&` characters in a row. Stay in the current state.
    } else {
      this.trieIndex = 0;
      this.trieCurrent = this.entityTrie[0];
      this.state = State.InNamedEntity;
      this.stateInNamedEntity(c);
    }
  };

  _proto.stateInNamedEntity = function stateInNamedEntity(c) {
    this.entityExcess += 1;
    this.trieIndex = (0,entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_0__.determineBranch)(this.entityTrie, this.trieCurrent, this.trieIndex + 1, c);

    if (this.trieIndex < 0) {
      this.emitNamedEntity();
      this.index--;
      return;
    }

    this.trieCurrent = this.entityTrie[this.trieIndex];
    var masked = this.trieCurrent & entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_0__.BinTrieFlags.VALUE_LENGTH; // If the branch is a value, store it and continue

    if (masked) {
      // The mask is the number of bytes of the value, including the current byte.
      var valueLength = (masked >> 14) - 1; // If we have a legacy entity while parsing strictly, just skip the number of bytes

      if (!this.allowLegacyEntity() && c !== CharCodes.Semi) {
        this.trieIndex += valueLength;
      } else {
        // Add 1 as we have already incremented the excess
        var entityStart = this.index - this.entityExcess + 1;

        if (entityStart > this.sectionStart) {
          this.emitPartial(this.sectionStart, entityStart);
        } // If this is a surrogate pair, consume the next two bytes


        this.entityResult = this.trieIndex;
        this.trieIndex += valueLength;
        this.entityExcess = 0;
        this.sectionStart = this.index + 1;

        if (valueLength === 0) {
          this.emitNamedEntity();
        }
      }
    }
  };

  _proto.emitNamedEntity = function emitNamedEntity() {
    this.state = this.baseState;

    if (this.entityResult === 0) {
      return;
    }

    var valueLength = (this.entityTrie[this.entityResult] & entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_0__.BinTrieFlags.VALUE_LENGTH) >> 14;

    switch (valueLength) {
      case 1:
        this.emitCodePoint(this.entityTrie[this.entityResult] & ~entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_0__.BinTrieFlags.VALUE_LENGTH);
        break;

      case 2:
        this.emitCodePoint(this.entityTrie[this.entityResult + 1]);
        break;

      case 3:
        {
          this.emitCodePoint(this.entityTrie[this.entityResult + 1]);
          this.emitCodePoint(this.entityTrie[this.entityResult + 2]);
        }
    }
  };

  _proto.stateBeforeNumericEntity = function stateBeforeNumericEntity(c) {
    if ((c | 0x20) === CharCodes.LowerX) {
      this.entityExcess++;
      this.state = State.InHexEntity;
    } else {
      this.state = State.InNumericEntity;
      this.stateInNumericEntity(c);
    }
  };

  _proto.emitNumericEntity = function emitNumericEntity(strict) {
    var entityStart = this.index - this.entityExcess - 1;
    var numberStart = entityStart + 2 + Number(this.state === State.InHexEntity);

    if (numberStart !== this.index) {
      // Emit leading data if any
      if (entityStart > this.sectionStart) {
        this.emitPartial(this.sectionStart, entityStart);
      }

      this.sectionStart = this.index + Number(strict);
      this.emitCodePoint((0,entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_0__.replaceCodePoint)(this.entityResult));
    }

    this.state = this.baseState;
  };

  _proto.stateInNumericEntity = function stateInNumericEntity(c) {
    if (c === CharCodes.Semi) {
      this.emitNumericEntity(true);
    } else if (isNumber(c)) {
      this.entityResult = this.entityResult * 10 + (c - CharCodes.Zero);
      this.entityExcess++;
    } else {
      if (this.allowLegacyEntity()) {
        this.emitNumericEntity(false);
      } else {
        this.state = this.baseState;
      }

      this.index--;
    }
  };

  _proto.stateInHexEntity = function stateInHexEntity(c) {
    if (c === CharCodes.Semi) {
      this.emitNumericEntity(true);
    } else if (isNumber(c)) {
      this.entityResult = this.entityResult * 16 + (c - CharCodes.Zero);
      this.entityExcess++;
    } else if (isHexDigit(c)) {
      this.entityResult = this.entityResult * 16 + ((c | 0x20) - CharCodes.LowerA + 10);
      this.entityExcess++;
    } else {
      if (this.allowLegacyEntity()) {
        this.emitNumericEntity(false);
      } else {
        this.state = this.baseState;
      }

      this.index--;
    }
  };

  _proto.allowLegacyEntity = function allowLegacyEntity() {
    return !this.xmlMode && (this.baseState === State.Text || this.baseState === State.InSpecialTag);
  }
  /**
   * Remove data that has already been consumed from the buffer.
   */
  ;

  _proto.cleanup = function cleanup() {
    // If we are inside of text or attributes, emit what we already have.
    if (this.running && this.sectionStart !== this.index) {
      if (this.state === State.Text || this.state === State.InSpecialTag && this.sequenceIndex === 0) {
        this.cbs.ontext(this.sectionStart, this.index);
        this.sectionStart = this.index;
      } else if (this.state === State.InAttributeValueDq || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueNq) {
        this.cbs.onattribdata(this.sectionStart, this.index);
        this.sectionStart = this.index;
      }
    }
  };

  _proto.shouldContinue = function shouldContinue() {
    return this.index < this.buffer.length + this.offset && this.running;
  }
  /**
   * Iterates through the buffer, calling the function corresponding to the current state.
   *
   * States that are more likely to be hit are higher up, as a performance improvement.
   */
  ;

  _proto.parse = function parse() {
    while (this.shouldContinue()) {
      var c = this.buffer.charCodeAt(this.index - this.offset);

      if (this.state === State.Text) {
        this.stateText(c);
      } else if (this.state === State.SpecialStartSequence) {
        this.stateSpecialStartSequence(c);
      } else if (this.state === State.InSpecialTag) {
        this.stateInSpecialTag(c);
      } else if (this.state === State.CDATASequence) {
        this.stateCDATASequence(c);
      } else if (this.state === State.InAttributeValueDq) {
        this.stateInAttributeValueDoubleQuotes(c);
      } else if (this.state === State.InAttributeName) {
        this.stateInAttributeName(c);
      } else if (this.state === State.InCommentLike) {
        this.stateInCommentLike(c);
      } else if (this.state === State.InSpecialComment) {
        this.stateInSpecialComment(c);
      } else if (this.state === State.BeforeAttributeName) {
        this.stateBeforeAttributeName(c);
      } else if (this.state === State.InTagName) {
        this.stateInTagName(c);
      } else if (this.state === State.InClosingTagName) {
        this.stateInClosingTagName(c);
      } else if (this.state === State.BeforeTagName) {
        this.stateBeforeTagName(c);
      } else if (this.state === State.AfterAttributeName) {
        this.stateAfterAttributeName(c);
      } else if (this.state === State.InAttributeValueSq) {
        this.stateInAttributeValueSingleQuotes(c);
      } else if (this.state === State.BeforeAttributeValue) {
        this.stateBeforeAttributeValue(c);
      } else if (this.state === State.BeforeClosingTagName) {
        this.stateBeforeClosingTagName(c);
      } else if (this.state === State.AfterClosingTagName) {
        this.stateAfterClosingTagName(c);
      } else if (this.state === State.BeforeSpecialS) {
        this.stateBeforeSpecialS(c);
      } else if (this.state === State.InAttributeValueNq) {
        this.stateInAttributeValueNoQuotes(c);
      } else if (this.state === State.InSelfClosingTag) {
        this.stateInSelfClosingTag(c);
      } else if (this.state === State.InDeclaration) {
        this.stateInDeclaration(c);
      } else if (this.state === State.BeforeDeclaration) {
        this.stateBeforeDeclaration(c);
      } else if (this.state === State.BeforeComment) {
        this.stateBeforeComment(c);
      } else if (this.state === State.InProcessingInstruction) {
        this.stateInProcessingInstruction(c);
      } else if (this.state === State.InNamedEntity) {
        this.stateInNamedEntity(c);
      } else if (this.state === State.BeforeEntity) {
        this.stateBeforeEntity(c);
      } else if (this.state === State.InHexEntity) {
        this.stateInHexEntity(c);
      } else if (this.state === State.InNumericEntity) {
        this.stateInNumericEntity(c);
      } else {
        // `this._state === State.BeforeNumericEntity`
        this.stateBeforeNumericEntity(c);
      }

      this.index++;
    }

    this.cleanup();
  };

  _proto.finish = function finish() {
    if (this.state === State.InNamedEntity) {
      this.emitNamedEntity();
    } // If there is remaining data, emit it in a reasonable way


    if (this.sectionStart < this.index) {
      this.handleTrailingData();
    }

    this.cbs.onend();
  }
  /** Handle any trailing data. */
  ;

  _proto.handleTrailingData = function handleTrailingData() {
    var endIndex = this.buffer.length + this.offset;

    if (this.state === State.InCommentLike) {
      if (this.currentSequence === Sequences.CdataEnd) {
        this.cbs.oncdata(this.sectionStart, endIndex, 0);
      } else {
        this.cbs.oncomment(this.sectionStart, endIndex, 0);
      }
    } else if (this.state === State.InNumericEntity && this.allowLegacyEntity()) {
      this.emitNumericEntity(false); // All trailing data will have been consumed
    } else if (this.state === State.InHexEntity && this.allowLegacyEntity()) {
      this.emitNumericEntity(false); // All trailing data will have been consumed
    } else if (this.state === State.InTagName || this.state === State.BeforeAttributeName || this.state === State.BeforeAttributeValue || this.state === State.AfterAttributeName || this.state === State.InAttributeName || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueDq || this.state === State.InAttributeValueNq || this.state === State.InClosingTagName) {
      /*
       * If we are currently in an opening or closing tag, us not calling the
       * respective callback signals that the tag should be ignored.
       */
    } else {
      this.cbs.ontext(this.sectionStart, endIndex);
    }
  };

  _proto.emitPartial = function emitPartial(start, endIndex) {
    if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
      this.cbs.onattribdata(start, endIndex);
    } else {
      this.cbs.ontext(start, endIndex);
    }
  };

  _proto.emitCodePoint = function emitCodePoint(cp) {
    if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
      this.cbs.onattribentity(cp);
    } else {
      this.cbs.ontextentity(cp);
    }
  };

  return Tokenizer;
}();



/***/ }),

/***/ "./node_modules/htmlparser2/lib/esm/index.js":
/*!***************************************************!*\
  !*** ./node_modules/htmlparser2/lib/esm/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefaultHandler": () => (/* reexport safe */ domhandler__WEBPACK_IMPORTED_MODULE_1__.DomHandler),
/* harmony export */   "DomHandler": () => (/* reexport safe */ domhandler__WEBPACK_IMPORTED_MODULE_1__.DomHandler),
/* harmony export */   "DomUtils": () => (/* reexport module object */ domutils__WEBPACK_IMPORTED_MODULE_4__),
/* harmony export */   "ElementType": () => (/* reexport module object */ domelementtype__WEBPACK_IMPORTED_MODULE_3__),
/* harmony export */   "Parser": () => (/* reexport safe */ _Parser_js__WEBPACK_IMPORTED_MODULE_0__.Parser),
/* harmony export */   "Tokenizer": () => (/* reexport safe */ _Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "createDomStream": () => (/* binding */ createDomStream),
/* harmony export */   "getFeed": () => (/* reexport safe */ domutils__WEBPACK_IMPORTED_MODULE_4__.getFeed),
/* harmony export */   "parseDOM": () => (/* binding */ parseDOM),
/* harmony export */   "parseDocument": () => (/* binding */ parseDocument),
/* harmony export */   "parseFeed": () => (/* binding */ parseFeed)
/* harmony export */ });
/* harmony import */ var _Parser_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Parser.js */ "./node_modules/htmlparser2/lib/esm/Parser.js");
/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/esm/index.js");
/* harmony import */ var _Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Tokenizer.js */ "./node_modules/htmlparser2/lib/esm/Tokenizer.js");
/* harmony import */ var domelementtype__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! domelementtype */ "./node_modules/domelementtype/lib/esm/index.js");
/* harmony import */ var domutils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! domutils */ "./node_modules/domutils/lib/esm/index.js");



 // Helper methods

/**
 * Parses the data, returns the resulting document.
 *
 * @param data The data that should be parsed.
 * @param options Optional options for the parser and DOM builder.
 */

function parseDocument(data, options) {
  var handler = new domhandler__WEBPACK_IMPORTED_MODULE_1__.DomHandler(undefined, options);
  new _Parser_js__WEBPACK_IMPORTED_MODULE_0__.Parser(handler, options).end(data);
  return handler.root;
}
/**
 * Parses data, returns an array of the root nodes.
 *
 * Note that the root nodes still have a `Document` node as their parent.
 * Use `parseDocument` to get the `Document` node instead.
 *
 * @param data The data that should be parsed.
 * @param options Optional options for the parser and DOM builder.
 * @deprecated Use `parseDocument` instead.
 */

function parseDOM(data, options) {
  return parseDocument(data, options).children;
}
/**
 * Creates a parser instance, with an attached DOM handler.
 *
 * @param cb A callback that will be called once parsing has been completed.
 * @param options Optional options for the parser and DOM builder.
 * @param elementCb An optional callback that will be called every time a tag has been completed inside of the DOM.
 */

function createDomStream(cb, options, elementCb) {
  var handler = new domhandler__WEBPACK_IMPORTED_MODULE_1__.DomHandler(cb, options, elementCb);
  return new _Parser_js__WEBPACK_IMPORTED_MODULE_0__.Parser(handler, options);
}

/*
 * All of the following exports exist for backwards-compatibility.
 * They should probably be removed eventually.
 */





/**
 * Parse a feed.
 *
 * @param feed The feed that should be parsed, as a string.
 * @param options Optionally, options for parsing. When using this, you should set `xmlMode` to `true`.
 */

function parseFeed(feed, options) {
  if (options === void 0) {
    options = {
      xmlMode: true
    };
  }

  return (0,domutils__WEBPACK_IMPORTED_MODULE_4__.getFeed)(parseDOM(feed, options));
}

 // Old name for DomHandler



/***/ }),

/***/ "./node_modules/nth-check/lib/esm/compile.js":
/*!***************************************************!*\
  !*** ./node_modules/nth-check/lib/esm/compile.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "compile": () => (/* binding */ compile),
/* harmony export */   "generate": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var boolbase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! boolbase */ "./node_modules/boolbase/index.js");

/**
 * Returns a function that checks if an elements index matches the given rule
 * highly optimized to return the fastest solution.
 *
 * @param parsed A tuple [a, b], as returned by `parse`.
 * @returns A highly optimized function that returns whether an index matches the nth-check.
 * @example
 *
 * ```js
 * const check = nthCheck.compile([2, 3]);
 *
 * check(0); // `false`
 * check(1); // `false`
 * check(2); // `true`
 * check(3); // `false`
 * check(4); // `true`
 * check(5); // `false`
 * check(6); // `true`
 * ```
 */

function compile(parsed) {
  var a = parsed[0]; // Subtract 1 from `b`, to convert from one- to zero-indexed.

  var b = parsed[1] - 1;
  /*
   * When `b <= 0`, `a * n` won't be lead to any matches for `a < 0`.
   * Besides, the specification states that no elements are
   * matched when `a` and `b` are 0.
   *
   * `b < 0` here as we subtracted 1 from `b` above.
   */

  if (b < 0 && a <= 0) return boolbase__WEBPACK_IMPORTED_MODULE_0__.falseFunc; // When `a` is in the range -1..1, it matches any element (so only `b` is checked).

  if (a === -1) return function (index) {
    return index <= b;
  };
  if (a === 0) return function (index) {
    return index === b;
  }; // When `b <= 0` and `a === 1`, they match any element.

  if (a === 1) return b < 0 ? boolbase__WEBPACK_IMPORTED_MODULE_0__.trueFunc : function (index) {
    return index >= b;
  };
  /*
   * Otherwise, modulo can be used to check if there is a match.
   *
   * Modulo doesn't care about the sign, so let's use `a`s absolute value.
   */

  var absA = Math.abs(a); // Get `b mod a`, + a if this is negative.

  var bMod = (b % absA + absA) % absA;
  return a > 1 ? function (index) {
    return index >= b && index % absA === bMod;
  } : function (index) {
    return index <= b && index % absA === bMod;
  };
}
/**
 * Returns a function that produces a monotonously increasing sequence of indices.
 *
 * If the sequence has an end, the returned function will return `null` after
 * the last index in the sequence.
 *
 * @param parsed A tuple [a, b], as returned by `parse`.
 * @returns A function that produces a sequence of indices.
 * @example <caption>Always increasing (2n+3)</caption>
 *
 * ```js
 * const gen = nthCheck.generate([2, 3])
 *
 * gen() // `1`
 * gen() // `3`
 * gen() // `5`
 * gen() // `8`
 * gen() // `11`
 * ```
 *
 * @example <caption>With end value (-2n+10)</caption>
 *
 * ```js
 *
 * const gen = nthCheck.generate([-2, 5]);
 *
 * gen() // 0
 * gen() // 2
 * gen() // 4
 * gen() // null
 * ```
 */

function generate(parsed) {
  var a = parsed[0]; // Subtract 1 from `b`, to convert from one- to zero-indexed.

  var b = parsed[1] - 1;
  var n = 0; // Make sure to always return an increasing sequence

  if (a < 0) {
    var aPos = -a; // Get `b mod a`

    var minValue = (b % aPos + aPos) % aPos;
    return function () {
      var val = minValue + aPos * n++;
      return val > b ? null : val;
    };
  }

  if (a === 0) return b < 0 ? // There are no result — always return `null`
  function () {
    return null;
  } : // Return `b` exactly once
  function () {
    return n++ === 0 ? b : null;
  };

  if (b < 0) {
    b += a * Math.ceil(-b / a);
  }

  return function () {
    return a * n++ + b;
  };
}

/***/ }),

/***/ "./node_modules/nth-check/lib/esm/index.js":
/*!*************************************************!*\
  !*** ./node_modules/nth-check/lib/esm/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "compile": () => (/* reexport safe */ _compile_js__WEBPACK_IMPORTED_MODULE_1__.compile),
/* harmony export */   "default": () => (/* binding */ nthCheck),
/* harmony export */   "generate": () => (/* reexport safe */ _compile_js__WEBPACK_IMPORTED_MODULE_1__.generate),
/* harmony export */   "parse": () => (/* reexport safe */ _parse_js__WEBPACK_IMPORTED_MODULE_0__.parse),
/* harmony export */   "sequence": () => (/* binding */ sequence)
/* harmony export */ });
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parse.js */ "./node_modules/nth-check/lib/esm/parse.js");
/* harmony import */ var _compile_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./compile.js */ "./node_modules/nth-check/lib/esm/compile.js");



/**
 * Parses and compiles a formula to a highly optimized function.
 * Combination of {@link parse} and {@link compile}.
 *
 * If the formula doesn't match any elements,
 * it returns [`boolbase`](https://github.com/fb55/boolbase)'s `falseFunc`.
 * Otherwise, a function accepting an _index_ is returned, which returns
 * whether or not the passed _index_ matches the formula.
 *
 * Note: The nth-rule starts counting at `1`, the returned function at `0`.
 *
 * @param formula The formula to compile.
 * @example
 * const check = nthCheck("2n+3");
 *
 * check(0); // `false`
 * check(1); // `false`
 * check(2); // `true`
 * check(3); // `false`
 * check(4); // `true`
 * check(5); // `false`
 * check(6); // `true`
 */

function nthCheck(formula) {
  return (0,_compile_js__WEBPACK_IMPORTED_MODULE_1__.compile)((0,_parse_js__WEBPACK_IMPORTED_MODULE_0__.parse)(formula));
}
/**
 * Parses and compiles a formula to a generator that produces a sequence of indices.
 * Combination of {@link parse} and {@link generate}.
 *
 * @param formula The formula to compile.
 * @returns A function that produces a sequence of indices.
 * @example <caption>Always increasing</caption>
 *
 * ```js
 * const gen = nthCheck.sequence('2n+3')
 *
 * gen() // `1`
 * gen() // `3`
 * gen() // `5`
 * gen() // `8`
 * gen() // `11`
 * ```
 *
 * @example <caption>With end value</caption>
 *
 * ```js
 *
 * const gen = nthCheck.sequence('-2n+5');
 *
 * gen() // 0
 * gen() // 2
 * gen() // 4
 * gen() // null
 * ```
 */

function sequence(formula) {
  return (0,_compile_js__WEBPACK_IMPORTED_MODULE_1__.generate)((0,_parse_js__WEBPACK_IMPORTED_MODULE_0__.parse)(formula));
}

/***/ }),

/***/ "./node_modules/nth-check/lib/esm/parse.js":
/*!*************************************************!*\
  !*** ./node_modules/nth-check/lib/esm/parse.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "parse": () => (/* binding */ parse)
/* harmony export */ });
// Following http://www.w3.org/TR/css3-selectors/#nth-child-pseudo
// Whitespace as per https://www.w3.org/TR/selectors-3/#lex is " \t\r\n\f"
var whitespace = new Set([9, 10, 12, 13, 32]);
var ZERO = "0".charCodeAt(0);
var NINE = "9".charCodeAt(0);
/**
 * Parses an expression.
 *
 * @throws An `Error` if parsing fails.
 * @returns An array containing the integer step size and the integer offset of the nth rule.
 * @example nthCheck.parse("2n+3"); // returns [2, 3]
 */

function parse(formula) {
  formula = formula.trim().toLowerCase();

  if (formula === "even") {
    return [2, 0];
  } else if (formula === "odd") {
    return [2, 1];
  } // Parse [ ['-'|'+']? INTEGER? {N} [ S* ['-'|'+'] S* INTEGER ]?


  var idx = 0;
  var a = 0;
  var sign = readSign();
  var number = readNumber();

  if (idx < formula.length && formula.charAt(idx) === "n") {
    idx++;
    a = sign * (number !== null && number !== void 0 ? number : 1);
    skipWhitespace();

    if (idx < formula.length) {
      sign = readSign();
      skipWhitespace();
      number = readNumber();
    } else {
      sign = number = 0;
    }
  } // Throw if there is anything else


  if (number === null || idx < formula.length) {
    throw new Error("n-th rule couldn't be parsed ('" + formula + "')");
  }

  return [a, sign * number];

  function readSign() {
    if (formula.charAt(idx) === "-") {
      idx++;
      return -1;
    }

    if (formula.charAt(idx) === "+") {
      idx++;
    }

    return 1;
  }

  function readNumber() {
    var start = idx;
    var value = 0;

    while (idx < formula.length && formula.charCodeAt(idx) >= ZERO && formula.charCodeAt(idx) <= NINE) {
      value = value * 10 + (formula.charCodeAt(idx) - ZERO);
      idx++;
    } // Return `null` if we didn't read anything.


    return idx === start ? null : value;
  }

  function skipWhitespace() {
    while (idx < formula.length && whitespace.has(formula.charCodeAt(idx))) {
      idx++;
    }
  }
}

/***/ }),

/***/ "./node_modules/parse5-htmlparser2-tree-adapter/dist/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/parse5-htmlparser2-tree-adapter/dist/index.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "adapter": () => (/* binding */ adapter),
/* harmony export */   "serializeDoctypeContent": () => (/* binding */ serializeDoctypeContent)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var parse5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! parse5 */ "./node_modules/parse5/dist/index.js");
/* harmony import */ var domhandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/esm/index.js");




function createTextNode(value) {
  return new domhandler__WEBPACK_IMPORTED_MODULE_2__.Text(value);
}

function enquoteDoctypeId(id) {
  var quote = id.includes('"') ? "'" : '"';
  return quote + id + quote;
}
/** @internal */


function serializeDoctypeContent(name, publicId, systemId) {
  var str = '!DOCTYPE ';

  if (name) {
    str += name;
  }

  if (publicId) {
    str += " PUBLIC " + enquoteDoctypeId(publicId);
  } else if (systemId) {
    str += ' SYSTEM';
  }

  if (systemId) {
    str += " " + enquoteDoctypeId(systemId);
  }

  return str;
}
var adapter = {
  // Re-exports from domhandler
  isCommentNode: domhandler__WEBPACK_IMPORTED_MODULE_2__.isComment,
  isElementNode: domhandler__WEBPACK_IMPORTED_MODULE_2__.isTag,
  isTextNode: domhandler__WEBPACK_IMPORTED_MODULE_2__.isText,
  //Node construction
  createDocument: function createDocument() {
    var node = new domhandler__WEBPACK_IMPORTED_MODULE_2__.Document([]);
    node['x-mode'] = parse5__WEBPACK_IMPORTED_MODULE_1__.html.DOCUMENT_MODE.NO_QUIRKS;
    return node;
  },
  createDocumentFragment: function createDocumentFragment() {
    return new domhandler__WEBPACK_IMPORTED_MODULE_2__.Document([]);
  },
  createElement: function createElement(tagName, namespaceURI, attrs) {
    var attribs = Object.create(null);
    var attribsNamespace = Object.create(null);
    var attribsPrefix = Object.create(null);

    for (var i = 0; i < attrs.length; i++) {
      var attrName = attrs[i].name;
      attribs[attrName] = attrs[i].value;
      attribsNamespace[attrName] = attrs[i].namespace;
      attribsPrefix[attrName] = attrs[i].prefix;
    }

    var node = new domhandler__WEBPACK_IMPORTED_MODULE_2__.Element(tagName, attribs, []);
    node.namespace = namespaceURI;
    node['x-attribsNamespace'] = attribsNamespace;
    node['x-attribsPrefix'] = attribsPrefix;
    return node;
  },
  createCommentNode: function createCommentNode(data) {
    return new domhandler__WEBPACK_IMPORTED_MODULE_2__.Comment(data);
  },
  //Tree mutation
  appendChild: function appendChild(parentNode, newNode) {
    var prev = parentNode.children[parentNode.children.length - 1];

    if (prev) {
      prev.next = newNode;
      newNode.prev = prev;
    }

    parentNode.children.push(newNode);
    newNode.parent = parentNode;
  },
  insertBefore: function insertBefore(parentNode, newNode, referenceNode) {
    var insertionIdx = parentNode.children.indexOf(referenceNode);
    var prev = referenceNode.prev;

    if (prev) {
      prev.next = newNode;
      newNode.prev = prev;
    }

    referenceNode.prev = newNode;
    newNode.next = referenceNode;
    parentNode.children.splice(insertionIdx, 0, newNode);
    newNode.parent = parentNode;
  },
  setTemplateContent: function setTemplateContent(templateElement, contentElement) {
    adapter.appendChild(templateElement, contentElement);
  },
  getTemplateContent: function getTemplateContent(templateElement) {
    return templateElement.children[0];
  },
  setDocumentType: function setDocumentType(document, name, publicId, systemId) {
    var data = serializeDoctypeContent(name, publicId, systemId);
    var doctypeNode = document.children.find(function (node) {
      return (0,domhandler__WEBPACK_IMPORTED_MODULE_2__.isDirective)(node) && node.name === '!doctype';
    });

    if (doctypeNode) {
      doctypeNode.data = data !== null && data !== void 0 ? data : null;
    } else {
      doctypeNode = new domhandler__WEBPACK_IMPORTED_MODULE_2__.ProcessingInstruction('!doctype', data);
      adapter.appendChild(document, doctypeNode);
    }

    doctypeNode['x-name'] = name !== null && name !== void 0 ? name : undefined;
    doctypeNode['x-publicId'] = publicId !== null && publicId !== void 0 ? publicId : undefined;
    doctypeNode['x-systemId'] = systemId !== null && systemId !== void 0 ? systemId : undefined;
  },
  setDocumentMode: function setDocumentMode(document, mode) {
    document['x-mode'] = mode;
  },
  getDocumentMode: function getDocumentMode(document) {
    return document['x-mode'];
  },
  detachNode: function detachNode(node) {
    if (node.parent) {
      var idx = node.parent.children.indexOf(node);
      var prev = node.prev,
          next = node.next;
      node.prev = null;
      node.next = null;

      if (prev) {
        prev.next = next;
      }

      if (next) {
        next.prev = prev;
      }

      node.parent.children.splice(idx, 1);
      node.parent = null;
    }
  },
  insertText: function insertText(parentNode, text) {
    var lastChild = parentNode.children[parentNode.children.length - 1];

    if (lastChild && (0,domhandler__WEBPACK_IMPORTED_MODULE_2__.isText)(lastChild)) {
      lastChild.data += text;
    } else {
      adapter.appendChild(parentNode, createTextNode(text));
    }
  },
  insertTextBefore: function insertTextBefore(parentNode, text, referenceNode) {
    var prevNode = parentNode.children[parentNode.children.indexOf(referenceNode) - 1];

    if (prevNode && (0,domhandler__WEBPACK_IMPORTED_MODULE_2__.isText)(prevNode)) {
      prevNode.data += text;
    } else {
      adapter.insertBefore(parentNode, createTextNode(text), referenceNode);
    }
  },
  adoptAttributes: function adoptAttributes(recipient, attrs) {
    for (var i = 0; i < attrs.length; i++) {
      var attrName = attrs[i].name;

      if (typeof recipient.attribs[attrName] === 'undefined') {
        recipient.attribs[attrName] = attrs[i].value;
        recipient['x-attribsNamespace'][attrName] = attrs[i].namespace;
        recipient['x-attribsPrefix'][attrName] = attrs[i].prefix;
      }
    }
  },
  //Tree traversing
  getFirstChild: function getFirstChild(node) {
    return node.children[0];
  },
  getChildNodes: function getChildNodes(node) {
    return node.children;
  },
  getParentNode: function getParentNode(node) {
    return node.parent;
  },
  getAttrList: function getAttrList(element) {
    return element.attributes;
  },
  //Node data
  getTagName: function getTagName(element) {
    return element.name;
  },
  getNamespaceURI: function getNamespaceURI(element) {
    return element.namespace;
  },
  getTextNodeContent: function getTextNodeContent(textNode) {
    return textNode.data;
  },
  getCommentNodeContent: function getCommentNodeContent(commentNode) {
    return commentNode.data;
  },
  getDocumentTypeNodeName: function getDocumentTypeNodeName(doctypeNode) {
    var _a;

    return (_a = doctypeNode['x-name']) !== null && _a !== void 0 ? _a : '';
  },
  getDocumentTypeNodePublicId: function getDocumentTypeNodePublicId(doctypeNode) {
    var _a;

    return (_a = doctypeNode['x-publicId']) !== null && _a !== void 0 ? _a : '';
  },
  getDocumentTypeNodeSystemId: function getDocumentTypeNodeSystemId(doctypeNode) {
    var _a;

    return (_a = doctypeNode['x-systemId']) !== null && _a !== void 0 ? _a : '';
  },
  //Node types
  isDocumentTypeNode: function isDocumentTypeNode(node) {
    return (0,domhandler__WEBPACK_IMPORTED_MODULE_2__.isDirective)(node) && node.name === '!doctype';
  },
  // Source code location
  setNodeSourceCodeLocation: function setNodeSourceCodeLocation(node, location) {
    if (location) {
      node.startIndex = location.startOffset;
      node.endIndex = location.endOffset;
    }

    node.sourceCodeLocation = location;
  },
  getNodeSourceCodeLocation: function getNodeSourceCodeLocation(node) {
    return node.sourceCodeLocation;
  },
  updateNodeSourceCodeLocation: function updateNodeSourceCodeLocation(node, endLocation) {
    if (endLocation.endOffset != null) node.endIndex = endLocation.endOffset;
    node.sourceCodeLocation = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, node.sourceCodeLocation, endLocation);
  }
};

/***/ }),

/***/ "./node_modules/parse5/dist/common/doctype.js":
/*!****************************************************!*\
  !*** ./node_modules/parse5/dist/common/doctype.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getDocumentMode": () => (/* binding */ getDocumentMode),
/* harmony export */   "isConforming": () => (/* binding */ isConforming)
/* harmony export */ });
/* harmony import */ var _html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./html.js */ "./node_modules/parse5/dist/common/html.js");
 //Const

var VALID_DOCTYPE_NAME = 'html';
var VALID_SYSTEM_ID = 'about:legacy-compat';
var QUIRKS_MODE_SYSTEM_ID = 'http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd';
var QUIRKS_MODE_PUBLIC_ID_PREFIXES = ['+//silmaril//dtd html pro v0r11 19970101//', '-//as//dtd html 3.0 aswedit + extensions//', '-//advasoft ltd//dtd html 3.0 aswedit + extensions//', '-//ietf//dtd html 2.0 level 1//', '-//ietf//dtd html 2.0 level 2//', '-//ietf//dtd html 2.0 strict level 1//', '-//ietf//dtd html 2.0 strict level 2//', '-//ietf//dtd html 2.0 strict//', '-//ietf//dtd html 2.0//', '-//ietf//dtd html 2.1e//', '-//ietf//dtd html 3.0//', '-//ietf//dtd html 3.2 final//', '-//ietf//dtd html 3.2//', '-//ietf//dtd html 3//', '-//ietf//dtd html level 0//', '-//ietf//dtd html level 1//', '-//ietf//dtd html level 2//', '-//ietf//dtd html level 3//', '-//ietf//dtd html strict level 0//', '-//ietf//dtd html strict level 1//', '-//ietf//dtd html strict level 2//', '-//ietf//dtd html strict level 3//', '-//ietf//dtd html strict//', '-//ietf//dtd html//', '-//metrius//dtd metrius presentational//', '-//microsoft//dtd internet explorer 2.0 html strict//', '-//microsoft//dtd internet explorer 2.0 html//', '-//microsoft//dtd internet explorer 2.0 tables//', '-//microsoft//dtd internet explorer 3.0 html strict//', '-//microsoft//dtd internet explorer 3.0 html//', '-//microsoft//dtd internet explorer 3.0 tables//', '-//netscape comm. corp.//dtd html//', '-//netscape comm. corp.//dtd strict html//', "-//o'reilly and associates//dtd html 2.0//", "-//o'reilly and associates//dtd html extended 1.0//", "-//o'reilly and associates//dtd html extended relaxed 1.0//", '-//sq//dtd html 2.0 hotmetal + extensions//', '-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//', '-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//', '-//spyglass//dtd html 2.0 extended//', '-//sun microsystems corp.//dtd hotjava html//', '-//sun microsystems corp.//dtd hotjava strict html//', '-//w3c//dtd html 3 1995-03-24//', '-//w3c//dtd html 3.2 draft//', '-//w3c//dtd html 3.2 final//', '-//w3c//dtd html 3.2//', '-//w3c//dtd html 3.2s draft//', '-//w3c//dtd html 4.0 frameset//', '-//w3c//dtd html 4.0 transitional//', '-//w3c//dtd html experimental 19960712//', '-//w3c//dtd html experimental 970421//', '-//w3c//dtd w3 html//', '-//w3o//dtd w3 html 3.0//', '-//webtechs//dtd mozilla html 2.0//', '-//webtechs//dtd mozilla html//'];
var QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES = [].concat(QUIRKS_MODE_PUBLIC_ID_PREFIXES, ['-//w3c//dtd html 4.01 frameset//', '-//w3c//dtd html 4.01 transitional//']);
var QUIRKS_MODE_PUBLIC_IDS = new Set(['-//w3o//dtd w3 html strict 3.0//en//', '-/w3c/dtd html 4.0 transitional/en', 'html']);
var LIMITED_QUIRKS_PUBLIC_ID_PREFIXES = ['-//w3c//dtd xhtml 1.0 frameset//', '-//w3c//dtd xhtml 1.0 transitional//'];
var LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES = [].concat(LIMITED_QUIRKS_PUBLIC_ID_PREFIXES, ['-//w3c//dtd html 4.01 frameset//', '-//w3c//dtd html 4.01 transitional//']); //Utils

function hasPrefix(publicId, prefixes) {
  return prefixes.some(function (prefix) {
    return publicId.startsWith(prefix);
  });
} //API


function isConforming(token) {
  return token.name === VALID_DOCTYPE_NAME && token.publicId === null && (token.systemId === null || token.systemId === VALID_SYSTEM_ID);
}
function getDocumentMode(token) {
  if (token.name !== VALID_DOCTYPE_NAME) {
    return _html_js__WEBPACK_IMPORTED_MODULE_0__.DOCUMENT_MODE.QUIRKS;
  }

  var systemId = token.systemId;

  if (systemId && systemId.toLowerCase() === QUIRKS_MODE_SYSTEM_ID) {
    return _html_js__WEBPACK_IMPORTED_MODULE_0__.DOCUMENT_MODE.QUIRKS;
  }

  var publicId = token.publicId;

  if (publicId !== null) {
    publicId = publicId.toLowerCase();

    if (QUIRKS_MODE_PUBLIC_IDS.has(publicId)) {
      return _html_js__WEBPACK_IMPORTED_MODULE_0__.DOCUMENT_MODE.QUIRKS;
    }

    var prefixes = systemId === null ? QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES : QUIRKS_MODE_PUBLIC_ID_PREFIXES;

    if (hasPrefix(publicId, prefixes)) {
      return _html_js__WEBPACK_IMPORTED_MODULE_0__.DOCUMENT_MODE.QUIRKS;
    }

    prefixes = systemId === null ? LIMITED_QUIRKS_PUBLIC_ID_PREFIXES : LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES;

    if (hasPrefix(publicId, prefixes)) {
      return _html_js__WEBPACK_IMPORTED_MODULE_0__.DOCUMENT_MODE.LIMITED_QUIRKS;
    }
  }

  return _html_js__WEBPACK_IMPORTED_MODULE_0__.DOCUMENT_MODE.NO_QUIRKS;
}

/***/ }),

/***/ "./node_modules/parse5/dist/common/error-codes.js":
/*!********************************************************!*\
  !*** ./node_modules/parse5/dist/common/error-codes.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ERR": () => (/* binding */ ERR)
/* harmony export */ });
var ERR;

(function (ERR) {
  ERR["controlCharacterInInputStream"] = "control-character-in-input-stream";
  ERR["noncharacterInInputStream"] = "noncharacter-in-input-stream";
  ERR["surrogateInInputStream"] = "surrogate-in-input-stream";
  ERR["nonVoidHtmlElementStartTagWithTrailingSolidus"] = "non-void-html-element-start-tag-with-trailing-solidus";
  ERR["endTagWithAttributes"] = "end-tag-with-attributes";
  ERR["endTagWithTrailingSolidus"] = "end-tag-with-trailing-solidus";
  ERR["unexpectedSolidusInTag"] = "unexpected-solidus-in-tag";
  ERR["unexpectedNullCharacter"] = "unexpected-null-character";
  ERR["unexpectedQuestionMarkInsteadOfTagName"] = "unexpected-question-mark-instead-of-tag-name";
  ERR["invalidFirstCharacterOfTagName"] = "invalid-first-character-of-tag-name";
  ERR["unexpectedEqualsSignBeforeAttributeName"] = "unexpected-equals-sign-before-attribute-name";
  ERR["missingEndTagName"] = "missing-end-tag-name";
  ERR["unexpectedCharacterInAttributeName"] = "unexpected-character-in-attribute-name";
  ERR["unknownNamedCharacterReference"] = "unknown-named-character-reference";
  ERR["missingSemicolonAfterCharacterReference"] = "missing-semicolon-after-character-reference";
  ERR["unexpectedCharacterAfterDoctypeSystemIdentifier"] = "unexpected-character-after-doctype-system-identifier";
  ERR["unexpectedCharacterInUnquotedAttributeValue"] = "unexpected-character-in-unquoted-attribute-value";
  ERR["eofBeforeTagName"] = "eof-before-tag-name";
  ERR["eofInTag"] = "eof-in-tag";
  ERR["missingAttributeValue"] = "missing-attribute-value";
  ERR["missingWhitespaceBetweenAttributes"] = "missing-whitespace-between-attributes";
  ERR["missingWhitespaceAfterDoctypePublicKeyword"] = "missing-whitespace-after-doctype-public-keyword";
  ERR["missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers"] = "missing-whitespace-between-doctype-public-and-system-identifiers";
  ERR["missingWhitespaceAfterDoctypeSystemKeyword"] = "missing-whitespace-after-doctype-system-keyword";
  ERR["missingQuoteBeforeDoctypePublicIdentifier"] = "missing-quote-before-doctype-public-identifier";
  ERR["missingQuoteBeforeDoctypeSystemIdentifier"] = "missing-quote-before-doctype-system-identifier";
  ERR["missingDoctypePublicIdentifier"] = "missing-doctype-public-identifier";
  ERR["missingDoctypeSystemIdentifier"] = "missing-doctype-system-identifier";
  ERR["abruptDoctypePublicIdentifier"] = "abrupt-doctype-public-identifier";
  ERR["abruptDoctypeSystemIdentifier"] = "abrupt-doctype-system-identifier";
  ERR["cdataInHtmlContent"] = "cdata-in-html-content";
  ERR["incorrectlyOpenedComment"] = "incorrectly-opened-comment";
  ERR["eofInScriptHtmlCommentLikeText"] = "eof-in-script-html-comment-like-text";
  ERR["eofInDoctype"] = "eof-in-doctype";
  ERR["nestedComment"] = "nested-comment";
  ERR["abruptClosingOfEmptyComment"] = "abrupt-closing-of-empty-comment";
  ERR["eofInComment"] = "eof-in-comment";
  ERR["incorrectlyClosedComment"] = "incorrectly-closed-comment";
  ERR["eofInCdata"] = "eof-in-cdata";
  ERR["absenceOfDigitsInNumericCharacterReference"] = "absence-of-digits-in-numeric-character-reference";
  ERR["nullCharacterReference"] = "null-character-reference";
  ERR["surrogateCharacterReference"] = "surrogate-character-reference";
  ERR["characterReferenceOutsideUnicodeRange"] = "character-reference-outside-unicode-range";
  ERR["controlCharacterReference"] = "control-character-reference";
  ERR["noncharacterCharacterReference"] = "noncharacter-character-reference";
  ERR["missingWhitespaceBeforeDoctypeName"] = "missing-whitespace-before-doctype-name";
  ERR["missingDoctypeName"] = "missing-doctype-name";
  ERR["invalidCharacterSequenceAfterDoctypeName"] = "invalid-character-sequence-after-doctype-name";
  ERR["duplicateAttribute"] = "duplicate-attribute";
  ERR["nonConformingDoctype"] = "non-conforming-doctype";
  ERR["missingDoctype"] = "missing-doctype";
  ERR["misplacedDoctype"] = "misplaced-doctype";
  ERR["endTagWithoutMatchingOpenElement"] = "end-tag-without-matching-open-element";
  ERR["closingOfElementWithOpenChildElements"] = "closing-of-element-with-open-child-elements";
  ERR["disallowedContentInNoscriptInHead"] = "disallowed-content-in-noscript-in-head";
  ERR["openElementsLeftAfterEof"] = "open-elements-left-after-eof";
  ERR["abandonedHeadElementChild"] = "abandoned-head-element-child";
  ERR["misplacedStartTagForHeadElement"] = "misplaced-start-tag-for-head-element";
  ERR["nestedNoscriptInHead"] = "nested-noscript-in-head";
  ERR["eofInElementThatCanContainOnlyText"] = "eof-in-element-that-can-contain-only-text";
})(ERR = ERR || (ERR = {}));

/***/ }),

/***/ "./node_modules/parse5/dist/common/foreign-content.js":
/*!************************************************************!*\
  !*** ./node_modules/parse5/dist/common/foreign-content.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SVG_TAG_NAMES_ADJUSTMENT_MAP": () => (/* binding */ SVG_TAG_NAMES_ADJUSTMENT_MAP),
/* harmony export */   "adjustTokenMathMLAttrs": () => (/* binding */ adjustTokenMathMLAttrs),
/* harmony export */   "adjustTokenSVGAttrs": () => (/* binding */ adjustTokenSVGAttrs),
/* harmony export */   "adjustTokenSVGTagName": () => (/* binding */ adjustTokenSVGTagName),
/* harmony export */   "adjustTokenXMLAttrs": () => (/* binding */ adjustTokenXMLAttrs),
/* harmony export */   "causesExit": () => (/* binding */ causesExit),
/* harmony export */   "isIntegrationPoint": () => (/* binding */ isIntegrationPoint)
/* harmony export */ });
/* harmony import */ var _html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./html.js */ "./node_modules/parse5/dist/common/html.js");
 //MIME types

var MIME_TYPES = {
  TEXT_HTML: 'text/html',
  APPLICATION_XML: 'application/xhtml+xml'
}; //Attributes

var DEFINITION_URL_ATTR = 'definitionurl';
var ADJUSTED_DEFINITION_URL_ATTR = 'definitionURL';
var SVG_ATTRS_ADJUSTMENT_MAP = new Map(['attributeName', 'attributeType', 'baseFrequency', 'baseProfile', 'calcMode', 'clipPathUnits', 'diffuseConstant', 'edgeMode', 'filterUnits', 'glyphRef', 'gradientTransform', 'gradientUnits', 'kernelMatrix', 'kernelUnitLength', 'keyPoints', 'keySplines', 'keyTimes', 'lengthAdjust', 'limitingConeAngle', 'markerHeight', 'markerUnits', 'markerWidth', 'maskContentUnits', 'maskUnits', 'numOctaves', 'pathLength', 'patternContentUnits', 'patternTransform', 'patternUnits', 'pointsAtX', 'pointsAtY', 'pointsAtZ', 'preserveAlpha', 'preserveAspectRatio', 'primitiveUnits', 'refX', 'refY', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'specularConstant', 'specularExponent', 'spreadMethod', 'startOffset', 'stdDeviation', 'stitchTiles', 'surfaceScale', 'systemLanguage', 'tableValues', 'targetX', 'targetY', 'textLength', 'viewBox', 'viewTarget', 'xChannelSelector', 'yChannelSelector', 'zoomAndPan'].map(function (attr) {
  return [attr.toLowerCase(), attr];
}));
var XML_ATTRS_ADJUSTMENT_MAP = new Map([['xlink:actuate', {
  prefix: 'xlink',
  name: 'actuate',
  namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XLINK
}], ['xlink:arcrole', {
  prefix: 'xlink',
  name: 'arcrole',
  namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XLINK
}], ['xlink:href', {
  prefix: 'xlink',
  name: 'href',
  namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XLINK
}], ['xlink:role', {
  prefix: 'xlink',
  name: 'role',
  namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XLINK
}], ['xlink:show', {
  prefix: 'xlink',
  name: 'show',
  namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XLINK
}], ['xlink:title', {
  prefix: 'xlink',
  name: 'title',
  namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XLINK
}], ['xlink:type', {
  prefix: 'xlink',
  name: 'type',
  namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XLINK
}], ['xml:base', {
  prefix: 'xml',
  name: 'base',
  namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XML
}], ['xml:lang', {
  prefix: 'xml',
  name: 'lang',
  namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XML
}], ['xml:space', {
  prefix: 'xml',
  name: 'space',
  namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XML
}], ['xmlns', {
  prefix: '',
  name: 'xmlns',
  namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XMLNS
}], ['xmlns:xlink', {
  prefix: 'xmlns',
  name: 'xlink',
  namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XMLNS
}]]); //SVG tag names adjustment map

var SVG_TAG_NAMES_ADJUSTMENT_MAP = new Map(['altGlyph', 'altGlyphDef', 'altGlyphItem', 'animateColor', 'animateMotion', 'animateTransform', 'clipPath', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'foreignObject', 'glyphRef', 'linearGradient', 'radialGradient', 'textPath'].map(function (tn) {
  return [tn.toLowerCase(), tn];
})); //Tags that causes exit from foreign content

var EXITS_FOREIGN_CONTENT = new Set([_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.B, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.BIG, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.BLOCKQUOTE, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.BODY, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.BR, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.CENTER, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.CODE, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.DD, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.DIV, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.DL, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.DT, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.EM, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.EMBED, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.H1, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.H2, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.H3, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.H4, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.H5, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.H6, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.HEAD, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.HR, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.I, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.IMG, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.LI, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.LISTING, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.MENU, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.META, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.NOBR, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.OL, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.P, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.PRE, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.RUBY, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.S, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.SMALL, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.SPAN, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.STRONG, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.STRIKE, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.SUB, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.SUP, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TABLE, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TT, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.U, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.UL, _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.VAR]); //Check exit from foreign content

function causesExit(startTagToken) {
  var tn = startTagToken.tagID;
  var isFontWithAttrs = tn === _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.FONT && startTagToken.attrs.some(function (_ref) {
    var name = _ref.name;
    return name === _html_js__WEBPACK_IMPORTED_MODULE_0__.ATTRS.COLOR || name === _html_js__WEBPACK_IMPORTED_MODULE_0__.ATTRS.SIZE || name === _html_js__WEBPACK_IMPORTED_MODULE_0__.ATTRS.FACE;
  });
  return isFontWithAttrs || EXITS_FOREIGN_CONTENT.has(tn);
} //Token adjustments

function adjustTokenMathMLAttrs(token) {
  for (var i = 0; i < token.attrs.length; i++) {
    if (token.attrs[i].name === DEFINITION_URL_ATTR) {
      token.attrs[i].name = ADJUSTED_DEFINITION_URL_ATTR;
      break;
    }
  }
}
function adjustTokenSVGAttrs(token) {
  for (var i = 0; i < token.attrs.length; i++) {
    var adjustedAttrName = SVG_ATTRS_ADJUSTMENT_MAP.get(token.attrs[i].name);

    if (adjustedAttrName != null) {
      token.attrs[i].name = adjustedAttrName;
    }
  }
}
function adjustTokenXMLAttrs(token) {
  for (var i = 0; i < token.attrs.length; i++) {
    var adjustedAttrEntry = XML_ATTRS_ADJUSTMENT_MAP.get(token.attrs[i].name);

    if (adjustedAttrEntry) {
      token.attrs[i].prefix = adjustedAttrEntry.prefix;
      token.attrs[i].name = adjustedAttrEntry.name;
      token.attrs[i].namespace = adjustedAttrEntry.namespace;
    }
  }
}
function adjustTokenSVGTagName(token) {
  var adjustedTagName = SVG_TAG_NAMES_ADJUSTMENT_MAP.get(token.tagName);

  if (adjustedTagName != null) {
    token.tagName = adjustedTagName;
    token.tagID = (0,_html_js__WEBPACK_IMPORTED_MODULE_0__.getTagID)(token.tagName);
  }
} //Integration points

function isMathMLTextIntegrationPoint(tn, ns) {
  return ns === _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.MATHML && (tn === _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.MI || tn === _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.MO || tn === _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.MN || tn === _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.MS || tn === _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.MTEXT);
}

function isHtmlIntegrationPoint(tn, ns, attrs) {
  if (ns === _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.MATHML && tn === _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.ANNOTATION_XML) {
    for (var i = 0; i < attrs.length; i++) {
      if (attrs[i].name === _html_js__WEBPACK_IMPORTED_MODULE_0__.ATTRS.ENCODING) {
        var value = attrs[i].value.toLowerCase();
        return value === MIME_TYPES.TEXT_HTML || value === MIME_TYPES.APPLICATION_XML;
      }
    }
  }

  return ns === _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.SVG && (tn === _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.FOREIGN_OBJECT || tn === _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.DESC || tn === _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TITLE);
}

function isIntegrationPoint(tn, ns, attrs, foreignNS) {
  return (!foreignNS || foreignNS === _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML) && isHtmlIntegrationPoint(tn, ns, attrs) || (!foreignNS || foreignNS === _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.MATHML) && isMathMLTextIntegrationPoint(tn, ns);
}

/***/ }),

/***/ "./node_modules/parse5/dist/common/html.js":
/*!*************************************************!*\
  !*** ./node_modules/parse5/dist/common/html.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ATTRS": () => (/* binding */ ATTRS),
/* harmony export */   "DOCUMENT_MODE": () => (/* binding */ DOCUMENT_MODE),
/* harmony export */   "NS": () => (/* binding */ NS),
/* harmony export */   "SPECIAL_ELEMENTS": () => (/* binding */ SPECIAL_ELEMENTS),
/* harmony export */   "TAG_ID": () => (/* binding */ TAG_ID),
/* harmony export */   "TAG_NAMES": () => (/* binding */ TAG_NAMES),
/* harmony export */   "getTagID": () => (/* binding */ getTagID),
/* harmony export */   "hasUnescapedText": () => (/* binding */ hasUnescapedText),
/* harmony export */   "isNumberedHeader": () => (/* binding */ isNumberedHeader)
/* harmony export */ });
var _SPECIAL_ELEMENTS;

/** All valid namespaces in HTML. */
var NS;

(function (NS) {
  NS["HTML"] = "http://www.w3.org/1999/xhtml";
  NS["MATHML"] = "http://www.w3.org/1998/Math/MathML";
  NS["SVG"] = "http://www.w3.org/2000/svg";
  NS["XLINK"] = "http://www.w3.org/1999/xlink";
  NS["XML"] = "http://www.w3.org/XML/1998/namespace";
  NS["XMLNS"] = "http://www.w3.org/2000/xmlns/";
})(NS = NS || (NS = {}));

var ATTRS;

(function (ATTRS) {
  ATTRS["TYPE"] = "type";
  ATTRS["ACTION"] = "action";
  ATTRS["ENCODING"] = "encoding";
  ATTRS["PROMPT"] = "prompt";
  ATTRS["NAME"] = "name";
  ATTRS["COLOR"] = "color";
  ATTRS["FACE"] = "face";
  ATTRS["SIZE"] = "size";
})(ATTRS = ATTRS || (ATTRS = {}));
/**
 * The mode of the document.
 *
 * @see {@link https://dom.spec.whatwg.org/#concept-document-limited-quirks}
 */


var DOCUMENT_MODE;

(function (DOCUMENT_MODE) {
  DOCUMENT_MODE["NO_QUIRKS"] = "no-quirks";
  DOCUMENT_MODE["QUIRKS"] = "quirks";
  DOCUMENT_MODE["LIMITED_QUIRKS"] = "limited-quirks";
})(DOCUMENT_MODE = DOCUMENT_MODE || (DOCUMENT_MODE = {}));

var TAG_NAMES;

(function (TAG_NAMES) {
  TAG_NAMES["A"] = "a";
  TAG_NAMES["ADDRESS"] = "address";
  TAG_NAMES["ANNOTATION_XML"] = "annotation-xml";
  TAG_NAMES["APPLET"] = "applet";
  TAG_NAMES["AREA"] = "area";
  TAG_NAMES["ARTICLE"] = "article";
  TAG_NAMES["ASIDE"] = "aside";
  TAG_NAMES["B"] = "b";
  TAG_NAMES["BASE"] = "base";
  TAG_NAMES["BASEFONT"] = "basefont";
  TAG_NAMES["BGSOUND"] = "bgsound";
  TAG_NAMES["BIG"] = "big";
  TAG_NAMES["BLOCKQUOTE"] = "blockquote";
  TAG_NAMES["BODY"] = "body";
  TAG_NAMES["BR"] = "br";
  TAG_NAMES["BUTTON"] = "button";
  TAG_NAMES["CAPTION"] = "caption";
  TAG_NAMES["CENTER"] = "center";
  TAG_NAMES["CODE"] = "code";
  TAG_NAMES["COL"] = "col";
  TAG_NAMES["COLGROUP"] = "colgroup";
  TAG_NAMES["DD"] = "dd";
  TAG_NAMES["DESC"] = "desc";
  TAG_NAMES["DETAILS"] = "details";
  TAG_NAMES["DIALOG"] = "dialog";
  TAG_NAMES["DIR"] = "dir";
  TAG_NAMES["DIV"] = "div";
  TAG_NAMES["DL"] = "dl";
  TAG_NAMES["DT"] = "dt";
  TAG_NAMES["EM"] = "em";
  TAG_NAMES["EMBED"] = "embed";
  TAG_NAMES["FIELDSET"] = "fieldset";
  TAG_NAMES["FIGCAPTION"] = "figcaption";
  TAG_NAMES["FIGURE"] = "figure";
  TAG_NAMES["FONT"] = "font";
  TAG_NAMES["FOOTER"] = "footer";
  TAG_NAMES["FOREIGN_OBJECT"] = "foreignObject";
  TAG_NAMES["FORM"] = "form";
  TAG_NAMES["FRAME"] = "frame";
  TAG_NAMES["FRAMESET"] = "frameset";
  TAG_NAMES["H1"] = "h1";
  TAG_NAMES["H2"] = "h2";
  TAG_NAMES["H3"] = "h3";
  TAG_NAMES["H4"] = "h4";
  TAG_NAMES["H5"] = "h5";
  TAG_NAMES["H6"] = "h6";
  TAG_NAMES["HEAD"] = "head";
  TAG_NAMES["HEADER"] = "header";
  TAG_NAMES["HGROUP"] = "hgroup";
  TAG_NAMES["HR"] = "hr";
  TAG_NAMES["HTML"] = "html";
  TAG_NAMES["I"] = "i";
  TAG_NAMES["IMG"] = "img";
  TAG_NAMES["IMAGE"] = "image";
  TAG_NAMES["INPUT"] = "input";
  TAG_NAMES["IFRAME"] = "iframe";
  TAG_NAMES["KEYGEN"] = "keygen";
  TAG_NAMES["LABEL"] = "label";
  TAG_NAMES["LI"] = "li";
  TAG_NAMES["LINK"] = "link";
  TAG_NAMES["LISTING"] = "listing";
  TAG_NAMES["MAIN"] = "main";
  TAG_NAMES["MALIGNMARK"] = "malignmark";
  TAG_NAMES["MARQUEE"] = "marquee";
  TAG_NAMES["MATH"] = "math";
  TAG_NAMES["MENU"] = "menu";
  TAG_NAMES["META"] = "meta";
  TAG_NAMES["MGLYPH"] = "mglyph";
  TAG_NAMES["MI"] = "mi";
  TAG_NAMES["MO"] = "mo";
  TAG_NAMES["MN"] = "mn";
  TAG_NAMES["MS"] = "ms";
  TAG_NAMES["MTEXT"] = "mtext";
  TAG_NAMES["NAV"] = "nav";
  TAG_NAMES["NOBR"] = "nobr";
  TAG_NAMES["NOFRAMES"] = "noframes";
  TAG_NAMES["NOEMBED"] = "noembed";
  TAG_NAMES["NOSCRIPT"] = "noscript";
  TAG_NAMES["OBJECT"] = "object";
  TAG_NAMES["OL"] = "ol";
  TAG_NAMES["OPTGROUP"] = "optgroup";
  TAG_NAMES["OPTION"] = "option";
  TAG_NAMES["P"] = "p";
  TAG_NAMES["PARAM"] = "param";
  TAG_NAMES["PLAINTEXT"] = "plaintext";
  TAG_NAMES["PRE"] = "pre";
  TAG_NAMES["RB"] = "rb";
  TAG_NAMES["RP"] = "rp";
  TAG_NAMES["RT"] = "rt";
  TAG_NAMES["RTC"] = "rtc";
  TAG_NAMES["RUBY"] = "ruby";
  TAG_NAMES["S"] = "s";
  TAG_NAMES["SCRIPT"] = "script";
  TAG_NAMES["SECTION"] = "section";
  TAG_NAMES["SELECT"] = "select";
  TAG_NAMES["SOURCE"] = "source";
  TAG_NAMES["SMALL"] = "small";
  TAG_NAMES["SPAN"] = "span";
  TAG_NAMES["STRIKE"] = "strike";
  TAG_NAMES["STRONG"] = "strong";
  TAG_NAMES["STYLE"] = "style";
  TAG_NAMES["SUB"] = "sub";
  TAG_NAMES["SUMMARY"] = "summary";
  TAG_NAMES["SUP"] = "sup";
  TAG_NAMES["TABLE"] = "table";
  TAG_NAMES["TBODY"] = "tbody";
  TAG_NAMES["TEMPLATE"] = "template";
  TAG_NAMES["TEXTAREA"] = "textarea";
  TAG_NAMES["TFOOT"] = "tfoot";
  TAG_NAMES["TD"] = "td";
  TAG_NAMES["TH"] = "th";
  TAG_NAMES["THEAD"] = "thead";
  TAG_NAMES["TITLE"] = "title";
  TAG_NAMES["TR"] = "tr";
  TAG_NAMES["TRACK"] = "track";
  TAG_NAMES["TT"] = "tt";
  TAG_NAMES["U"] = "u";
  TAG_NAMES["UL"] = "ul";
  TAG_NAMES["SVG"] = "svg";
  TAG_NAMES["VAR"] = "var";
  TAG_NAMES["WBR"] = "wbr";
  TAG_NAMES["XMP"] = "xmp";
})(TAG_NAMES = TAG_NAMES || (TAG_NAMES = {}));
/**
 * Tag IDs are numeric IDs for known tag names.
 *
 * We use tag IDs to improve the performance of tag name comparisons.
 */


var TAG_ID;

(function (TAG_ID) {
  TAG_ID[TAG_ID["UNKNOWN"] = 0] = "UNKNOWN";
  TAG_ID[TAG_ID["A"] = 1] = "A";
  TAG_ID[TAG_ID["ADDRESS"] = 2] = "ADDRESS";
  TAG_ID[TAG_ID["ANNOTATION_XML"] = 3] = "ANNOTATION_XML";
  TAG_ID[TAG_ID["APPLET"] = 4] = "APPLET";
  TAG_ID[TAG_ID["AREA"] = 5] = "AREA";
  TAG_ID[TAG_ID["ARTICLE"] = 6] = "ARTICLE";
  TAG_ID[TAG_ID["ASIDE"] = 7] = "ASIDE";
  TAG_ID[TAG_ID["B"] = 8] = "B";
  TAG_ID[TAG_ID["BASE"] = 9] = "BASE";
  TAG_ID[TAG_ID["BASEFONT"] = 10] = "BASEFONT";
  TAG_ID[TAG_ID["BGSOUND"] = 11] = "BGSOUND";
  TAG_ID[TAG_ID["BIG"] = 12] = "BIG";
  TAG_ID[TAG_ID["BLOCKQUOTE"] = 13] = "BLOCKQUOTE";
  TAG_ID[TAG_ID["BODY"] = 14] = "BODY";
  TAG_ID[TAG_ID["BR"] = 15] = "BR";
  TAG_ID[TAG_ID["BUTTON"] = 16] = "BUTTON";
  TAG_ID[TAG_ID["CAPTION"] = 17] = "CAPTION";
  TAG_ID[TAG_ID["CENTER"] = 18] = "CENTER";
  TAG_ID[TAG_ID["CODE"] = 19] = "CODE";
  TAG_ID[TAG_ID["COL"] = 20] = "COL";
  TAG_ID[TAG_ID["COLGROUP"] = 21] = "COLGROUP";
  TAG_ID[TAG_ID["DD"] = 22] = "DD";
  TAG_ID[TAG_ID["DESC"] = 23] = "DESC";
  TAG_ID[TAG_ID["DETAILS"] = 24] = "DETAILS";
  TAG_ID[TAG_ID["DIALOG"] = 25] = "DIALOG";
  TAG_ID[TAG_ID["DIR"] = 26] = "DIR";
  TAG_ID[TAG_ID["DIV"] = 27] = "DIV";
  TAG_ID[TAG_ID["DL"] = 28] = "DL";
  TAG_ID[TAG_ID["DT"] = 29] = "DT";
  TAG_ID[TAG_ID["EM"] = 30] = "EM";
  TAG_ID[TAG_ID["EMBED"] = 31] = "EMBED";
  TAG_ID[TAG_ID["FIELDSET"] = 32] = "FIELDSET";
  TAG_ID[TAG_ID["FIGCAPTION"] = 33] = "FIGCAPTION";
  TAG_ID[TAG_ID["FIGURE"] = 34] = "FIGURE";
  TAG_ID[TAG_ID["FONT"] = 35] = "FONT";
  TAG_ID[TAG_ID["FOOTER"] = 36] = "FOOTER";
  TAG_ID[TAG_ID["FOREIGN_OBJECT"] = 37] = "FOREIGN_OBJECT";
  TAG_ID[TAG_ID["FORM"] = 38] = "FORM";
  TAG_ID[TAG_ID["FRAME"] = 39] = "FRAME";
  TAG_ID[TAG_ID["FRAMESET"] = 40] = "FRAMESET";
  TAG_ID[TAG_ID["H1"] = 41] = "H1";
  TAG_ID[TAG_ID["H2"] = 42] = "H2";
  TAG_ID[TAG_ID["H3"] = 43] = "H3";
  TAG_ID[TAG_ID["H4"] = 44] = "H4";
  TAG_ID[TAG_ID["H5"] = 45] = "H5";
  TAG_ID[TAG_ID["H6"] = 46] = "H6";
  TAG_ID[TAG_ID["HEAD"] = 47] = "HEAD";
  TAG_ID[TAG_ID["HEADER"] = 48] = "HEADER";
  TAG_ID[TAG_ID["HGROUP"] = 49] = "HGROUP";
  TAG_ID[TAG_ID["HR"] = 50] = "HR";
  TAG_ID[TAG_ID["HTML"] = 51] = "HTML";
  TAG_ID[TAG_ID["I"] = 52] = "I";
  TAG_ID[TAG_ID["IMG"] = 53] = "IMG";
  TAG_ID[TAG_ID["IMAGE"] = 54] = "IMAGE";
  TAG_ID[TAG_ID["INPUT"] = 55] = "INPUT";
  TAG_ID[TAG_ID["IFRAME"] = 56] = "IFRAME";
  TAG_ID[TAG_ID["KEYGEN"] = 57] = "KEYGEN";
  TAG_ID[TAG_ID["LABEL"] = 58] = "LABEL";
  TAG_ID[TAG_ID["LI"] = 59] = "LI";
  TAG_ID[TAG_ID["LINK"] = 60] = "LINK";
  TAG_ID[TAG_ID["LISTING"] = 61] = "LISTING";
  TAG_ID[TAG_ID["MAIN"] = 62] = "MAIN";
  TAG_ID[TAG_ID["MALIGNMARK"] = 63] = "MALIGNMARK";
  TAG_ID[TAG_ID["MARQUEE"] = 64] = "MARQUEE";
  TAG_ID[TAG_ID["MATH"] = 65] = "MATH";
  TAG_ID[TAG_ID["MENU"] = 66] = "MENU";
  TAG_ID[TAG_ID["META"] = 67] = "META";
  TAG_ID[TAG_ID["MGLYPH"] = 68] = "MGLYPH";
  TAG_ID[TAG_ID["MI"] = 69] = "MI";
  TAG_ID[TAG_ID["MO"] = 70] = "MO";
  TAG_ID[TAG_ID["MN"] = 71] = "MN";
  TAG_ID[TAG_ID["MS"] = 72] = "MS";
  TAG_ID[TAG_ID["MTEXT"] = 73] = "MTEXT";
  TAG_ID[TAG_ID["NAV"] = 74] = "NAV";
  TAG_ID[TAG_ID["NOBR"] = 75] = "NOBR";
  TAG_ID[TAG_ID["NOFRAMES"] = 76] = "NOFRAMES";
  TAG_ID[TAG_ID["NOEMBED"] = 77] = "NOEMBED";
  TAG_ID[TAG_ID["NOSCRIPT"] = 78] = "NOSCRIPT";
  TAG_ID[TAG_ID["OBJECT"] = 79] = "OBJECT";
  TAG_ID[TAG_ID["OL"] = 80] = "OL";
  TAG_ID[TAG_ID["OPTGROUP"] = 81] = "OPTGROUP";
  TAG_ID[TAG_ID["OPTION"] = 82] = "OPTION";
  TAG_ID[TAG_ID["P"] = 83] = "P";
  TAG_ID[TAG_ID["PARAM"] = 84] = "PARAM";
  TAG_ID[TAG_ID["PLAINTEXT"] = 85] = "PLAINTEXT";
  TAG_ID[TAG_ID["PRE"] = 86] = "PRE";
  TAG_ID[TAG_ID["RB"] = 87] = "RB";
  TAG_ID[TAG_ID["RP"] = 88] = "RP";
  TAG_ID[TAG_ID["RT"] = 89] = "RT";
  TAG_ID[TAG_ID["RTC"] = 90] = "RTC";
  TAG_ID[TAG_ID["RUBY"] = 91] = "RUBY";
  TAG_ID[TAG_ID["S"] = 92] = "S";
  TAG_ID[TAG_ID["SCRIPT"] = 93] = "SCRIPT";
  TAG_ID[TAG_ID["SECTION"] = 94] = "SECTION";
  TAG_ID[TAG_ID["SELECT"] = 95] = "SELECT";
  TAG_ID[TAG_ID["SOURCE"] = 96] = "SOURCE";
  TAG_ID[TAG_ID["SMALL"] = 97] = "SMALL";
  TAG_ID[TAG_ID["SPAN"] = 98] = "SPAN";
  TAG_ID[TAG_ID["STRIKE"] = 99] = "STRIKE";
  TAG_ID[TAG_ID["STRONG"] = 100] = "STRONG";
  TAG_ID[TAG_ID["STYLE"] = 101] = "STYLE";
  TAG_ID[TAG_ID["SUB"] = 102] = "SUB";
  TAG_ID[TAG_ID["SUMMARY"] = 103] = "SUMMARY";
  TAG_ID[TAG_ID["SUP"] = 104] = "SUP";
  TAG_ID[TAG_ID["TABLE"] = 105] = "TABLE";
  TAG_ID[TAG_ID["TBODY"] = 106] = "TBODY";
  TAG_ID[TAG_ID["TEMPLATE"] = 107] = "TEMPLATE";
  TAG_ID[TAG_ID["TEXTAREA"] = 108] = "TEXTAREA";
  TAG_ID[TAG_ID["TFOOT"] = 109] = "TFOOT";
  TAG_ID[TAG_ID["TD"] = 110] = "TD";
  TAG_ID[TAG_ID["TH"] = 111] = "TH";
  TAG_ID[TAG_ID["THEAD"] = 112] = "THEAD";
  TAG_ID[TAG_ID["TITLE"] = 113] = "TITLE";
  TAG_ID[TAG_ID["TR"] = 114] = "TR";
  TAG_ID[TAG_ID["TRACK"] = 115] = "TRACK";
  TAG_ID[TAG_ID["TT"] = 116] = "TT";
  TAG_ID[TAG_ID["U"] = 117] = "U";
  TAG_ID[TAG_ID["UL"] = 118] = "UL";
  TAG_ID[TAG_ID["SVG"] = 119] = "SVG";
  TAG_ID[TAG_ID["VAR"] = 120] = "VAR";
  TAG_ID[TAG_ID["WBR"] = 121] = "WBR";
  TAG_ID[TAG_ID["XMP"] = 122] = "XMP";
})(TAG_ID = TAG_ID || (TAG_ID = {}));

var TAG_NAME_TO_ID = new Map([[TAG_NAMES.A, TAG_ID.A], [TAG_NAMES.ADDRESS, TAG_ID.ADDRESS], [TAG_NAMES.ANNOTATION_XML, TAG_ID.ANNOTATION_XML], [TAG_NAMES.APPLET, TAG_ID.APPLET], [TAG_NAMES.AREA, TAG_ID.AREA], [TAG_NAMES.ARTICLE, TAG_ID.ARTICLE], [TAG_NAMES.ASIDE, TAG_ID.ASIDE], [TAG_NAMES.B, TAG_ID.B], [TAG_NAMES.BASE, TAG_ID.BASE], [TAG_NAMES.BASEFONT, TAG_ID.BASEFONT], [TAG_NAMES.BGSOUND, TAG_ID.BGSOUND], [TAG_NAMES.BIG, TAG_ID.BIG], [TAG_NAMES.BLOCKQUOTE, TAG_ID.BLOCKQUOTE], [TAG_NAMES.BODY, TAG_ID.BODY], [TAG_NAMES.BR, TAG_ID.BR], [TAG_NAMES.BUTTON, TAG_ID.BUTTON], [TAG_NAMES.CAPTION, TAG_ID.CAPTION], [TAG_NAMES.CENTER, TAG_ID.CENTER], [TAG_NAMES.CODE, TAG_ID.CODE], [TAG_NAMES.COL, TAG_ID.COL], [TAG_NAMES.COLGROUP, TAG_ID.COLGROUP], [TAG_NAMES.DD, TAG_ID.DD], [TAG_NAMES.DESC, TAG_ID.DESC], [TAG_NAMES.DETAILS, TAG_ID.DETAILS], [TAG_NAMES.DIALOG, TAG_ID.DIALOG], [TAG_NAMES.DIR, TAG_ID.DIR], [TAG_NAMES.DIV, TAG_ID.DIV], [TAG_NAMES.DL, TAG_ID.DL], [TAG_NAMES.DT, TAG_ID.DT], [TAG_NAMES.EM, TAG_ID.EM], [TAG_NAMES.EMBED, TAG_ID.EMBED], [TAG_NAMES.FIELDSET, TAG_ID.FIELDSET], [TAG_NAMES.FIGCAPTION, TAG_ID.FIGCAPTION], [TAG_NAMES.FIGURE, TAG_ID.FIGURE], [TAG_NAMES.FONT, TAG_ID.FONT], [TAG_NAMES.FOOTER, TAG_ID.FOOTER], [TAG_NAMES.FOREIGN_OBJECT, TAG_ID.FOREIGN_OBJECT], [TAG_NAMES.FORM, TAG_ID.FORM], [TAG_NAMES.FRAME, TAG_ID.FRAME], [TAG_NAMES.FRAMESET, TAG_ID.FRAMESET], [TAG_NAMES.H1, TAG_ID.H1], [TAG_NAMES.H2, TAG_ID.H2], [TAG_NAMES.H3, TAG_ID.H3], [TAG_NAMES.H4, TAG_ID.H4], [TAG_NAMES.H5, TAG_ID.H5], [TAG_NAMES.H6, TAG_ID.H6], [TAG_NAMES.HEAD, TAG_ID.HEAD], [TAG_NAMES.HEADER, TAG_ID.HEADER], [TAG_NAMES.HGROUP, TAG_ID.HGROUP], [TAG_NAMES.HR, TAG_ID.HR], [TAG_NAMES.HTML, TAG_ID.HTML], [TAG_NAMES.I, TAG_ID.I], [TAG_NAMES.IMG, TAG_ID.IMG], [TAG_NAMES.IMAGE, TAG_ID.IMAGE], [TAG_NAMES.INPUT, TAG_ID.INPUT], [TAG_NAMES.IFRAME, TAG_ID.IFRAME], [TAG_NAMES.KEYGEN, TAG_ID.KEYGEN], [TAG_NAMES.LABEL, TAG_ID.LABEL], [TAG_NAMES.LI, TAG_ID.LI], [TAG_NAMES.LINK, TAG_ID.LINK], [TAG_NAMES.LISTING, TAG_ID.LISTING], [TAG_NAMES.MAIN, TAG_ID.MAIN], [TAG_NAMES.MALIGNMARK, TAG_ID.MALIGNMARK], [TAG_NAMES.MARQUEE, TAG_ID.MARQUEE], [TAG_NAMES.MATH, TAG_ID.MATH], [TAG_NAMES.MENU, TAG_ID.MENU], [TAG_NAMES.META, TAG_ID.META], [TAG_NAMES.MGLYPH, TAG_ID.MGLYPH], [TAG_NAMES.MI, TAG_ID.MI], [TAG_NAMES.MO, TAG_ID.MO], [TAG_NAMES.MN, TAG_ID.MN], [TAG_NAMES.MS, TAG_ID.MS], [TAG_NAMES.MTEXT, TAG_ID.MTEXT], [TAG_NAMES.NAV, TAG_ID.NAV], [TAG_NAMES.NOBR, TAG_ID.NOBR], [TAG_NAMES.NOFRAMES, TAG_ID.NOFRAMES], [TAG_NAMES.NOEMBED, TAG_ID.NOEMBED], [TAG_NAMES.NOSCRIPT, TAG_ID.NOSCRIPT], [TAG_NAMES.OBJECT, TAG_ID.OBJECT], [TAG_NAMES.OL, TAG_ID.OL], [TAG_NAMES.OPTGROUP, TAG_ID.OPTGROUP], [TAG_NAMES.OPTION, TAG_ID.OPTION], [TAG_NAMES.P, TAG_ID.P], [TAG_NAMES.PARAM, TAG_ID.PARAM], [TAG_NAMES.PLAINTEXT, TAG_ID.PLAINTEXT], [TAG_NAMES.PRE, TAG_ID.PRE], [TAG_NAMES.RB, TAG_ID.RB], [TAG_NAMES.RP, TAG_ID.RP], [TAG_NAMES.RT, TAG_ID.RT], [TAG_NAMES.RTC, TAG_ID.RTC], [TAG_NAMES.RUBY, TAG_ID.RUBY], [TAG_NAMES.S, TAG_ID.S], [TAG_NAMES.SCRIPT, TAG_ID.SCRIPT], [TAG_NAMES.SECTION, TAG_ID.SECTION], [TAG_NAMES.SELECT, TAG_ID.SELECT], [TAG_NAMES.SOURCE, TAG_ID.SOURCE], [TAG_NAMES.SMALL, TAG_ID.SMALL], [TAG_NAMES.SPAN, TAG_ID.SPAN], [TAG_NAMES.STRIKE, TAG_ID.STRIKE], [TAG_NAMES.STRONG, TAG_ID.STRONG], [TAG_NAMES.STYLE, TAG_ID.STYLE], [TAG_NAMES.SUB, TAG_ID.SUB], [TAG_NAMES.SUMMARY, TAG_ID.SUMMARY], [TAG_NAMES.SUP, TAG_ID.SUP], [TAG_NAMES.TABLE, TAG_ID.TABLE], [TAG_NAMES.TBODY, TAG_ID.TBODY], [TAG_NAMES.TEMPLATE, TAG_ID.TEMPLATE], [TAG_NAMES.TEXTAREA, TAG_ID.TEXTAREA], [TAG_NAMES.TFOOT, TAG_ID.TFOOT], [TAG_NAMES.TD, TAG_ID.TD], [TAG_NAMES.TH, TAG_ID.TH], [TAG_NAMES.THEAD, TAG_ID.THEAD], [TAG_NAMES.TITLE, TAG_ID.TITLE], [TAG_NAMES.TR, TAG_ID.TR], [TAG_NAMES.TRACK, TAG_ID.TRACK], [TAG_NAMES.TT, TAG_ID.TT], [TAG_NAMES.U, TAG_ID.U], [TAG_NAMES.UL, TAG_ID.UL], [TAG_NAMES.SVG, TAG_ID.SVG], [TAG_NAMES.VAR, TAG_ID.VAR], [TAG_NAMES.WBR, TAG_ID.WBR], [TAG_NAMES.XMP, TAG_ID.XMP]]);
function getTagID(tagName) {
  var _a;

  return (_a = TAG_NAME_TO_ID.get(tagName)) !== null && _a !== void 0 ? _a : TAG_ID.UNKNOWN;
}
var $ = TAG_ID;
var SPECIAL_ELEMENTS = (_SPECIAL_ELEMENTS = {}, _SPECIAL_ELEMENTS[NS.HTML] = new Set([$.ADDRESS, $.APPLET, $.AREA, $.ARTICLE, $.ASIDE, $.BASE, $.BASEFONT, $.BGSOUND, $.BLOCKQUOTE, $.BODY, $.BR, $.BUTTON, $.CAPTION, $.CENTER, $.COL, $.COLGROUP, $.DD, $.DETAILS, $.DIR, $.DIV, $.DL, $.DT, $.EMBED, $.FIELDSET, $.FIGCAPTION, $.FIGURE, $.FOOTER, $.FORM, $.FRAME, $.FRAMESET, $.H1, $.H2, $.H3, $.H4, $.H5, $.H6, $.HEAD, $.HEADER, $.HGROUP, $.HR, $.HTML, $.IFRAME, $.IMG, $.INPUT, $.LI, $.LINK, $.LISTING, $.MAIN, $.MARQUEE, $.MENU, $.META, $.NAV, $.NOEMBED, $.NOFRAMES, $.NOSCRIPT, $.OBJECT, $.OL, $.P, $.PARAM, $.PLAINTEXT, $.PRE, $.SCRIPT, $.SECTION, $.SELECT, $.SOURCE, $.STYLE, $.SUMMARY, $.TABLE, $.TBODY, $.TD, $.TEMPLATE, $.TEXTAREA, $.TFOOT, $.TH, $.THEAD, $.TITLE, $.TR, $.TRACK, $.UL, $.WBR, $.XMP]), _SPECIAL_ELEMENTS[NS.MATHML] = new Set([$.MI, $.MO, $.MN, $.MS, $.MTEXT, $.ANNOTATION_XML]), _SPECIAL_ELEMENTS[NS.SVG] = new Set([$.TITLE, $.FOREIGN_OBJECT, $.DESC]), _SPECIAL_ELEMENTS[NS.XLINK] = new Set(), _SPECIAL_ELEMENTS[NS.XML] = new Set(), _SPECIAL_ELEMENTS[NS.XMLNS] = new Set(), _SPECIAL_ELEMENTS);
function isNumberedHeader(tn) {
  return tn === $.H1 || tn === $.H2 || tn === $.H3 || tn === $.H4 || tn === $.H5 || tn === $.H6;
}
var UNESCAPED_TEXT = new Set([TAG_NAMES.STYLE, TAG_NAMES.SCRIPT, TAG_NAMES.XMP, TAG_NAMES.IFRAME, TAG_NAMES.NOEMBED, TAG_NAMES.NOFRAMES, TAG_NAMES.PLAINTEXT]);
function hasUnescapedText(tn, scriptingEnabled) {
  return UNESCAPED_TEXT.has(tn) || scriptingEnabled && tn === TAG_NAMES.NOSCRIPT;
}

/***/ }),

/***/ "./node_modules/parse5/dist/common/token.js":
/*!**************************************************!*\
  !*** ./node_modules/parse5/dist/common/token.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TokenType": () => (/* binding */ TokenType),
/* harmony export */   "getTokenAttr": () => (/* binding */ getTokenAttr)
/* harmony export */ });
var TokenType;

(function (TokenType) {
  TokenType[TokenType["CHARACTER"] = 0] = "CHARACTER";
  TokenType[TokenType["NULL_CHARACTER"] = 1] = "NULL_CHARACTER";
  TokenType[TokenType["WHITESPACE_CHARACTER"] = 2] = "WHITESPACE_CHARACTER";
  TokenType[TokenType["START_TAG"] = 3] = "START_TAG";
  TokenType[TokenType["END_TAG"] = 4] = "END_TAG";
  TokenType[TokenType["COMMENT"] = 5] = "COMMENT";
  TokenType[TokenType["DOCTYPE"] = 6] = "DOCTYPE";
  TokenType[TokenType["EOF"] = 7] = "EOF";
  TokenType[TokenType["HIBERNATION"] = 8] = "HIBERNATION";
})(TokenType = TokenType || (TokenType = {}));

function getTokenAttr(token, attrName) {
  for (var i = token.attrs.length - 1; i >= 0; i--) {
    if (token.attrs[i].name === attrName) {
      return token.attrs[i].value;
    }
  }

  return null;
}

/***/ }),

/***/ "./node_modules/parse5/dist/common/unicode.js":
/*!****************************************************!*\
  !*** ./node_modules/parse5/dist/common/unicode.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CODE_POINTS": () => (/* binding */ CODE_POINTS),
/* harmony export */   "REPLACEMENT_CHARACTER": () => (/* binding */ REPLACEMENT_CHARACTER),
/* harmony export */   "SEQUENCES": () => (/* binding */ SEQUENCES),
/* harmony export */   "getSurrogatePairCodePoint": () => (/* binding */ getSurrogatePairCodePoint),
/* harmony export */   "isControlCodePoint": () => (/* binding */ isControlCodePoint),
/* harmony export */   "isSurrogate": () => (/* binding */ isSurrogate),
/* harmony export */   "isSurrogatePair": () => (/* binding */ isSurrogatePair),
/* harmony export */   "isUndefinedCodePoint": () => (/* binding */ isUndefinedCodePoint)
/* harmony export */ });
var UNDEFINED_CODE_POINTS = new Set([65534, 65535, 131070, 131071, 196606, 196607, 262142, 262143, 327678, 327679, 393214, 393215, 458750, 458751, 524286, 524287, 589822, 589823, 655358, 655359, 720894, 720895, 786430, 786431, 851966, 851967, 917502, 917503, 983038, 983039, 1048574, 1048575, 1114110, 1114111]);
var REPLACEMENT_CHARACTER = "\uFFFD";
var CODE_POINTS;

(function (CODE_POINTS) {
  CODE_POINTS[CODE_POINTS["EOF"] = -1] = "EOF";
  CODE_POINTS[CODE_POINTS["NULL"] = 0] = "NULL";
  CODE_POINTS[CODE_POINTS["TABULATION"] = 9] = "TABULATION";
  CODE_POINTS[CODE_POINTS["CARRIAGE_RETURN"] = 13] = "CARRIAGE_RETURN";
  CODE_POINTS[CODE_POINTS["LINE_FEED"] = 10] = "LINE_FEED";
  CODE_POINTS[CODE_POINTS["FORM_FEED"] = 12] = "FORM_FEED";
  CODE_POINTS[CODE_POINTS["SPACE"] = 32] = "SPACE";
  CODE_POINTS[CODE_POINTS["EXCLAMATION_MARK"] = 33] = "EXCLAMATION_MARK";
  CODE_POINTS[CODE_POINTS["QUOTATION_MARK"] = 34] = "QUOTATION_MARK";
  CODE_POINTS[CODE_POINTS["NUMBER_SIGN"] = 35] = "NUMBER_SIGN";
  CODE_POINTS[CODE_POINTS["AMPERSAND"] = 38] = "AMPERSAND";
  CODE_POINTS[CODE_POINTS["APOSTROPHE"] = 39] = "APOSTROPHE";
  CODE_POINTS[CODE_POINTS["HYPHEN_MINUS"] = 45] = "HYPHEN_MINUS";
  CODE_POINTS[CODE_POINTS["SOLIDUS"] = 47] = "SOLIDUS";
  CODE_POINTS[CODE_POINTS["DIGIT_0"] = 48] = "DIGIT_0";
  CODE_POINTS[CODE_POINTS["DIGIT_9"] = 57] = "DIGIT_9";
  CODE_POINTS[CODE_POINTS["SEMICOLON"] = 59] = "SEMICOLON";
  CODE_POINTS[CODE_POINTS["LESS_THAN_SIGN"] = 60] = "LESS_THAN_SIGN";
  CODE_POINTS[CODE_POINTS["EQUALS_SIGN"] = 61] = "EQUALS_SIGN";
  CODE_POINTS[CODE_POINTS["GREATER_THAN_SIGN"] = 62] = "GREATER_THAN_SIGN";
  CODE_POINTS[CODE_POINTS["QUESTION_MARK"] = 63] = "QUESTION_MARK";
  CODE_POINTS[CODE_POINTS["LATIN_CAPITAL_A"] = 65] = "LATIN_CAPITAL_A";
  CODE_POINTS[CODE_POINTS["LATIN_CAPITAL_F"] = 70] = "LATIN_CAPITAL_F";
  CODE_POINTS[CODE_POINTS["LATIN_CAPITAL_X"] = 88] = "LATIN_CAPITAL_X";
  CODE_POINTS[CODE_POINTS["LATIN_CAPITAL_Z"] = 90] = "LATIN_CAPITAL_Z";
  CODE_POINTS[CODE_POINTS["RIGHT_SQUARE_BRACKET"] = 93] = "RIGHT_SQUARE_BRACKET";
  CODE_POINTS[CODE_POINTS["GRAVE_ACCENT"] = 96] = "GRAVE_ACCENT";
  CODE_POINTS[CODE_POINTS["LATIN_SMALL_A"] = 97] = "LATIN_SMALL_A";
  CODE_POINTS[CODE_POINTS["LATIN_SMALL_F"] = 102] = "LATIN_SMALL_F";
  CODE_POINTS[CODE_POINTS["LATIN_SMALL_X"] = 120] = "LATIN_SMALL_X";
  CODE_POINTS[CODE_POINTS["LATIN_SMALL_Z"] = 122] = "LATIN_SMALL_Z";
  CODE_POINTS[CODE_POINTS["REPLACEMENT_CHARACTER"] = 65533] = "REPLACEMENT_CHARACTER";
})(CODE_POINTS = CODE_POINTS || (CODE_POINTS = {}));

var SEQUENCES = {
  DASH_DASH: '--',
  CDATA_START: '[CDATA[',
  DOCTYPE: 'doctype',
  SCRIPT: 'script',
  PUBLIC: 'public',
  SYSTEM: 'system'
}; //Surrogates

function isSurrogate(cp) {
  return cp >= 55296 && cp <= 57343;
}
function isSurrogatePair(cp) {
  return cp >= 56320 && cp <= 57343;
}
function getSurrogatePairCodePoint(cp1, cp2) {
  return (cp1 - 55296) * 1024 + 9216 + cp2;
} //NOTE: excluding NULL and ASCII whitespace

function isControlCodePoint(cp) {
  return cp !== 0x20 && cp !== 0x0a && cp !== 0x0d && cp !== 0x09 && cp !== 0x0c && cp >= 0x01 && cp <= 0x1f || cp >= 0x7f && cp <= 0x9f;
}
function isUndefinedCodePoint(cp) {
  return cp >= 64976 && cp <= 65007 || UNDEFINED_CODE_POINTS.has(cp);
}

/***/ }),

/***/ "./node_modules/parse5/dist/index.js":
/*!*******************************************!*\
  !*** ./node_modules/parse5/dist/index.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ErrorCodes": () => (/* reexport safe */ _common_error_codes_js__WEBPACK_IMPORTED_MODULE_3__.ERR),
/* harmony export */   "Parser": () => (/* reexport safe */ _parser_index_js__WEBPACK_IMPORTED_MODULE_0__.Parser),
/* harmony export */   "Token": () => (/* reexport module object */ _common_token_js__WEBPACK_IMPORTED_MODULE_6__),
/* harmony export */   "Tokenizer": () => (/* reexport safe */ _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_7__.Tokenizer),
/* harmony export */   "TokenizerMode": () => (/* reexport safe */ _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_7__.TokenizerMode),
/* harmony export */   "defaultTreeAdapter": () => (/* reexport safe */ _tree_adapters_default_js__WEBPACK_IMPORTED_MODULE_1__.defaultTreeAdapter),
/* harmony export */   "foreignContent": () => (/* reexport module object */ _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_4__),
/* harmony export */   "html": () => (/* reexport module object */ _common_html_js__WEBPACK_IMPORTED_MODULE_5__),
/* harmony export */   "parse": () => (/* binding */ parse),
/* harmony export */   "parseFragment": () => (/* binding */ parseFragment),
/* harmony export */   "serialize": () => (/* reexport safe */ _serializer_index_js__WEBPACK_IMPORTED_MODULE_2__.serialize),
/* harmony export */   "serializeOuter": () => (/* reexport safe */ _serializer_index_js__WEBPACK_IMPORTED_MODULE_2__.serializeOuter)
/* harmony export */ });
/* harmony import */ var _parser_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parser/index.js */ "./node_modules/parse5/dist/parser/index.js");
/* harmony import */ var _tree_adapters_default_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tree-adapters/default.js */ "./node_modules/parse5/dist/tree-adapters/default.js");
/* harmony import */ var _serializer_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./serializer/index.js */ "./node_modules/parse5/dist/serializer/index.js");
/* harmony import */ var _common_error_codes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./common/error-codes.js */ "./node_modules/parse5/dist/common/error-codes.js");
/* harmony import */ var _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./common/foreign-content.js */ "./node_modules/parse5/dist/common/foreign-content.js");
/* harmony import */ var _common_html_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common/html.js */ "./node_modules/parse5/dist/common/html.js");
/* harmony import */ var _common_token_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./common/token.js */ "./node_modules/parse5/dist/common/token.js");
/* harmony import */ var _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./tokenizer/index.js */ "./node_modules/parse5/dist/tokenizer/index.js");





/** @internal */



/** @internal */



/** @internal */



/** @internal */

 // Shorthands

/**
 * Parses an HTML string.
 *
 * @param html Input HTML string.
 * @param options Parsing options.
 * @returns Document
 *
 * @example
 *
 * ```js
 * const parse5 = require('parse5');
 *
 * const document = parse5.parse('<!DOCTYPE html><html><head></head><body>Hi there!</body></html>');
 *
 * console.log(document.childNodes[1].tagName); //> 'html'
 *```
 */

function parse(html, options) {
  return _parser_index_js__WEBPACK_IMPORTED_MODULE_0__.Parser.parse(html, options);
}
function parseFragment(fragmentContext, html, options) {
  if (typeof fragmentContext === 'string') {
    options = html;
    html = fragmentContext;
    fragmentContext = null;
  }

  var parser = _parser_index_js__WEBPACK_IMPORTED_MODULE_0__.Parser.getFragmentParser(fragmentContext, options);
  parser.tokenizer.write(html, true);
  return parser.getFragment();
}

/***/ }),

/***/ "./node_modules/parse5/dist/parser/formatting-element-list.js":
/*!********************************************************************!*\
  !*** ./node_modules/parse5/dist/parser/formatting-element-list.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EntryType": () => (/* binding */ EntryType),
/* harmony export */   "FormattingElementList": () => (/* binding */ FormattingElementList)
/* harmony export */ });
//Const
var NOAH_ARK_CAPACITY = 3;
var EntryType;

(function (EntryType) {
  EntryType[EntryType["Marker"] = 0] = "Marker";
  EntryType[EntryType["Element"] = 1] = "Element";
})(EntryType = EntryType || (EntryType = {}));

var MARKER = {
  type: EntryType.Marker
}; //List of formatting elements

var FormattingElementList = /*#__PURE__*/function () {
  function FormattingElementList(treeAdapter) {
    this.treeAdapter = treeAdapter;
    this.entries = [];
    this.bookmark = null;
  } //Noah Ark's condition
  //OPTIMIZATION: at first we try to find possible candidates for exclusion using
  //lightweight heuristics without thorough attributes check.


  var _proto = FormattingElementList.prototype;

  _proto._getNoahArkConditionCandidates = function _getNoahArkConditionCandidates(newElement, neAttrs) {
    var candidates = [];
    var neAttrsLength = neAttrs.length;
    var neTagName = this.treeAdapter.getTagName(newElement);
    var neNamespaceURI = this.treeAdapter.getNamespaceURI(newElement);

    for (var i = 0; i < this.entries.length; i++) {
      var entry = this.entries[i];

      if (entry.type === EntryType.Marker) {
        break;
      }

      var element = entry.element;

      if (this.treeAdapter.getTagName(element) === neTagName && this.treeAdapter.getNamespaceURI(element) === neNamespaceURI) {
        var elementAttrs = this.treeAdapter.getAttrList(element);

        if (elementAttrs.length === neAttrsLength) {
          candidates.push({
            idx: i,
            attrs: elementAttrs
          });
        }
      }
    }

    return candidates;
  };

  _proto._ensureNoahArkCondition = function _ensureNoahArkCondition(newElement) {
    if (this.entries.length < NOAH_ARK_CAPACITY) return;
    var neAttrs = this.treeAdapter.getAttrList(newElement);

    var candidates = this._getNoahArkConditionCandidates(newElement, neAttrs);

    if (candidates.length < NOAH_ARK_CAPACITY) return; //NOTE: build attrs map for the new element, so we can perform fast lookups

    var neAttrsMap = new Map(neAttrs.map(function (neAttr) {
      return [neAttr.name, neAttr.value];
    }));
    var validCandidates = 0; //NOTE: remove bottommost candidates, until Noah's Ark condition will not be met

    for (var i = 0; i < candidates.length; i++) {
      var candidate = candidates[i]; // We know that `candidate.attrs.length === neAttrs.length`

      if (candidate.attrs.every(function (cAttr) {
        return neAttrsMap.get(cAttr.name) === cAttr.value;
      })) {
        validCandidates += 1;

        if (validCandidates >= NOAH_ARK_CAPACITY) {
          this.entries.splice(candidate.idx, 1);
        }
      }
    }
  } //Mutations
  ;

  _proto.insertMarker = function insertMarker() {
    this.entries.unshift(MARKER);
  };

  _proto.pushElement = function pushElement(element, token) {
    this._ensureNoahArkCondition(element);

    this.entries.unshift({
      type: EntryType.Element,
      element: element,
      token: token
    });
  };

  _proto.insertElementAfterBookmark = function insertElementAfterBookmark(element, token) {
    var bookmarkIdx = this.entries.indexOf(this.bookmark);
    this.entries.splice(bookmarkIdx, 0, {
      type: EntryType.Element,
      element: element,
      token: token
    });
  };

  _proto.removeEntry = function removeEntry(entry) {
    var entryIndex = this.entries.indexOf(entry);

    if (entryIndex >= 0) {
      this.entries.splice(entryIndex, 1);
    }
  }
  /**
   * Clears the list of formatting elements up to the last marker.
   *
   * @see https://html.spec.whatwg.org/multipage/parsing.html#clear-the-list-of-active-formatting-elements-up-to-the-last-marker
   */
  ;

  _proto.clearToLastMarker = function clearToLastMarker() {
    var markerIdx = this.entries.indexOf(MARKER);

    if (markerIdx >= 0) {
      this.entries.splice(0, markerIdx + 1);
    } else {
      this.entries.length = 0;
    }
  } //Search
  ;

  _proto.getElementEntryInScopeWithTagName = function getElementEntryInScopeWithTagName(tagName) {
    var _this = this;

    var entry = this.entries.find(function (entry) {
      return entry.type === EntryType.Marker || _this.treeAdapter.getTagName(entry.element) === tagName;
    });
    return entry && entry.type === EntryType.Element ? entry : null;
  };

  _proto.getElementEntry = function getElementEntry(element) {
    return this.entries.find(function (entry) {
      return entry.type === EntryType.Element && entry.element === element;
    });
  };

  return FormattingElementList;
}();

/***/ }),

/***/ "./node_modules/parse5/dist/parser/index.js":
/*!**************************************************!*\
  !*** ./node_modules/parse5/dist/parser/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Parser": () => (/* binding */ Parser)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tokenizer/index.js */ "./node_modules/parse5/dist/tokenizer/index.js");
/* harmony import */ var _open_element_stack_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./open-element-stack.js */ "./node_modules/parse5/dist/parser/open-element-stack.js");
/* harmony import */ var _formatting_element_list_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./formatting-element-list.js */ "./node_modules/parse5/dist/parser/formatting-element-list.js");
/* harmony import */ var _tree_adapters_default_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../tree-adapters/default.js */ "./node_modules/parse5/dist/tree-adapters/default.js");
/* harmony import */ var _common_doctype_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/doctype.js */ "./node_modules/parse5/dist/common/doctype.js");
/* harmony import */ var _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/foreign-content.js */ "./node_modules/parse5/dist/common/foreign-content.js");
/* harmony import */ var _common_error_codes_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/error-codes.js */ "./node_modules/parse5/dist/common/error-codes.js");
/* harmony import */ var _common_unicode_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/unicode.js */ "./node_modules/parse5/dist/common/unicode.js");
/* harmony import */ var _common_html_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../common/html.js */ "./node_modules/parse5/dist/common/html.js");
/* harmony import */ var _common_token_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../common/token.js */ "./node_modules/parse5/dist/common/token.js");










 //Misc constants

var HIDDEN_INPUT_TYPE = 'hidden'; //Adoption agency loops iteration count

var AA_OUTER_LOOP_ITER = 8;
var AA_INNER_LOOP_ITER = 3; //Insertion modes

var InsertionMode;

(function (InsertionMode) {
  InsertionMode[InsertionMode["INITIAL"] = 0] = "INITIAL";
  InsertionMode[InsertionMode["BEFORE_HTML"] = 1] = "BEFORE_HTML";
  InsertionMode[InsertionMode["BEFORE_HEAD"] = 2] = "BEFORE_HEAD";
  InsertionMode[InsertionMode["IN_HEAD"] = 3] = "IN_HEAD";
  InsertionMode[InsertionMode["IN_HEAD_NO_SCRIPT"] = 4] = "IN_HEAD_NO_SCRIPT";
  InsertionMode[InsertionMode["AFTER_HEAD"] = 5] = "AFTER_HEAD";
  InsertionMode[InsertionMode["IN_BODY"] = 6] = "IN_BODY";
  InsertionMode[InsertionMode["TEXT"] = 7] = "TEXT";
  InsertionMode[InsertionMode["IN_TABLE"] = 8] = "IN_TABLE";
  InsertionMode[InsertionMode["IN_TABLE_TEXT"] = 9] = "IN_TABLE_TEXT";
  InsertionMode[InsertionMode["IN_CAPTION"] = 10] = "IN_CAPTION";
  InsertionMode[InsertionMode["IN_COLUMN_GROUP"] = 11] = "IN_COLUMN_GROUP";
  InsertionMode[InsertionMode["IN_TABLE_BODY"] = 12] = "IN_TABLE_BODY";
  InsertionMode[InsertionMode["IN_ROW"] = 13] = "IN_ROW";
  InsertionMode[InsertionMode["IN_CELL"] = 14] = "IN_CELL";
  InsertionMode[InsertionMode["IN_SELECT"] = 15] = "IN_SELECT";
  InsertionMode[InsertionMode["IN_SELECT_IN_TABLE"] = 16] = "IN_SELECT_IN_TABLE";
  InsertionMode[InsertionMode["IN_TEMPLATE"] = 17] = "IN_TEMPLATE";
  InsertionMode[InsertionMode["AFTER_BODY"] = 18] = "AFTER_BODY";
  InsertionMode[InsertionMode["IN_FRAMESET"] = 19] = "IN_FRAMESET";
  InsertionMode[InsertionMode["AFTER_FRAMESET"] = 20] = "AFTER_FRAMESET";
  InsertionMode[InsertionMode["AFTER_AFTER_BODY"] = 21] = "AFTER_AFTER_BODY";
  InsertionMode[InsertionMode["AFTER_AFTER_FRAMESET"] = 22] = "AFTER_AFTER_FRAMESET";
})(InsertionMode || (InsertionMode = {}));

var BASE_LOC = {
  startLine: -1,
  startCol: -1,
  startOffset: -1,
  endLine: -1,
  endCol: -1,
  endOffset: -1
};
var TABLE_STRUCTURE_TAGS = new Set([_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TABLE, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TBODY, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TFOOT, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.THEAD, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TR]);
var defaultParserOptions = {
  scriptingEnabled: true,
  sourceCodeLocationInfo: false,
  treeAdapter: _tree_adapters_default_js__WEBPACK_IMPORTED_MODULE_4__.defaultTreeAdapter,
  onParseError: null
}; //Parser

var Parser = /*#__PURE__*/function () {
  function Parser(options, document, fragmentContext, scriptHandler) {
    if (fragmentContext === void 0) {
      fragmentContext = null;
    }

    if (scriptHandler === void 0) {
      scriptHandler = null;
    }

    this.fragmentContext = fragmentContext;
    this.scriptHandler = scriptHandler;
    this.currentToken = null;
    this.stopped = false;
    this.insertionMode = InsertionMode.INITIAL;
    this.originalInsertionMode = InsertionMode.INITIAL;
    this.headElement = null;
    this.formElement = null;
    /** Indicates that the current node is not an element in the HTML namespace */

    this.currentNotInHTML = false;
    /**
     * The template insertion mode stack is maintained from the left.
     * Ie. the topmost element will always have index 0.
     */

    this.tmplInsertionModeStack = [];
    this.pendingCharacterTokens = [];
    this.hasNonWhitespacePendingCharacterToken = false;
    this.framesetOk = true;
    this.skipNextNewLine = false;
    this.fosterParentingEnabled = false;
    this.options = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, defaultParserOptions, options);
    this.treeAdapter = this.options.treeAdapter;
    this.onParseError = this.options.onParseError; // Always enable location info if we report parse errors.

    if (this.onParseError) {
      this.options.sourceCodeLocationInfo = true;
    }

    this.document = document !== null && document !== void 0 ? document : this.treeAdapter.createDocument();
    this.tokenizer = new _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_1__.Tokenizer(this.options, this);
    this.activeFormattingElements = new _formatting_element_list_js__WEBPACK_IMPORTED_MODULE_3__.FormattingElementList(this.treeAdapter);
    this.fragmentContextID = fragmentContext ? (0,_common_html_js__WEBPACK_IMPORTED_MODULE_9__.getTagID)(this.treeAdapter.getTagName(fragmentContext)) : _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.UNKNOWN;

    this._setContextModes(fragmentContext !== null && fragmentContext !== void 0 ? fragmentContext : this.document, this.fragmentContextID);

    this.openElements = new _open_element_stack_js__WEBPACK_IMPORTED_MODULE_2__.OpenElementStack(this.document, this.treeAdapter, this);
  } // API


  Parser.parse = function parse(html, options) {
    var parser = new this(options);
    parser.tokenizer.write(html, true);
    return parser.document;
  };

  Parser.getFragmentParser = function getFragmentParser(fragmentContext, options) {
    var opts = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, defaultParserOptions, options); //NOTE: use a <template> element as the fragment context if no context element was provided,
    //so we will parse in a "forgiving" manner


    fragmentContext !== null && fragmentContext !== void 0 ? fragmentContext : fragmentContext = opts.treeAdapter.createElement(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_NAMES.TEMPLATE, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML, []); //NOTE: create a fake element which will be used as the `document` for fragment parsing.
    //This is important for jsdom, where a new `document` cannot be created. This led to
    //fragment parsing messing with the main `document`.

    var documentMock = opts.treeAdapter.createElement('documentmock', _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML, []);
    var parser = new this(opts, documentMock, fragmentContext);

    if (parser.fragmentContextID === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE) {
      parser.tmplInsertionModeStack.unshift(InsertionMode.IN_TEMPLATE);
    }

    parser._initTokenizerForFragmentParsing();

    parser._insertFakeRootElement();

    parser._resetInsertionMode();

    parser._findFormInFragmentContext();

    return parser;
  };

  var _proto = Parser.prototype;

  _proto.getFragment = function getFragment() {
    var rootElement = this.treeAdapter.getFirstChild(this.document);
    var fragment = this.treeAdapter.createDocumentFragment();

    this._adoptNodes(rootElement, fragment);

    return fragment;
  } //Errors
  ;

  _proto._err = function _err(token, code, beforeToken) {
    var _a;

    if (!this.onParseError) return;
    var loc = (_a = token.location) !== null && _a !== void 0 ? _a : BASE_LOC;
    var err = {
      code: code,
      startLine: loc.startLine,
      startCol: loc.startCol,
      startOffset: loc.startOffset,
      endLine: beforeToken ? loc.startLine : loc.endLine,
      endCol: beforeToken ? loc.startCol : loc.endCol,
      endOffset: beforeToken ? loc.startOffset : loc.endOffset
    };
    this.onParseError(err);
  } //Stack events
  ;

  _proto.onItemPush = function onItemPush(node, tid, isTop) {
    var _a, _b;

    (_b = (_a = this.treeAdapter).onItemPush) === null || _b === void 0 ? void 0 : _b.call(_a, node);
    if (isTop && this.openElements.stackTop > 0) this._setContextModes(node, tid);
  };

  _proto.onItemPop = function onItemPop(node, isTop) {
    var _a, _b;

    if (this.options.sourceCodeLocationInfo) {
      this._setEndLocation(node, this.currentToken);
    }

    (_b = (_a = this.treeAdapter).onItemPop) === null || _b === void 0 ? void 0 : _b.call(_a, node, this.openElements.current);

    if (isTop) {
      var current;
      var currentTagId;

      if (this.openElements.stackTop === 0 && this.fragmentContext) {
        current = this.fragmentContext;
        currentTagId = this.fragmentContextID;
      } else {
        var _this$openElements = this.openElements;
        current = _this$openElements.current;
        currentTagId = _this$openElements.currentTagId;
      }

      this._setContextModes(current, currentTagId);
    }
  };

  _proto._setContextModes = function _setContextModes(current, tid) {
    var isHTML = current === this.document || this.treeAdapter.getNamespaceURI(current) === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML;
    this.currentNotInHTML = !isHTML;
    this.tokenizer.inForeignNode = !isHTML && !this._isIntegrationPoint(tid, current);
  };

  _proto._switchToTextParsing = function _switchToTextParsing(currentToken, nextTokenizerState) {
    this._insertElement(currentToken, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

    this.tokenizer.state = nextTokenizerState;
    this.originalInsertionMode = this.insertionMode;
    this.insertionMode = InsertionMode.TEXT;
  };

  _proto.switchToPlaintextParsing = function switchToPlaintextParsing() {
    this.insertionMode = InsertionMode.TEXT;
    this.originalInsertionMode = InsertionMode.IN_BODY;
    this.tokenizer.state = _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_1__.TokenizerMode.PLAINTEXT;
  } //Fragment parsing
  ;

  _proto._getAdjustedCurrentElement = function _getAdjustedCurrentElement() {
    return this.openElements.stackTop === 0 && this.fragmentContext ? this.fragmentContext : this.openElements.current;
  };

  _proto._findFormInFragmentContext = function _findFormInFragmentContext() {
    var node = this.fragmentContext;

    while (node) {
      if (this.treeAdapter.getTagName(node) === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_NAMES.FORM) {
        this.formElement = node;
        break;
      }

      node = this.treeAdapter.getParentNode(node);
    }
  };

  _proto._initTokenizerForFragmentParsing = function _initTokenizerForFragmentParsing() {
    if (!this.fragmentContext || this.treeAdapter.getNamespaceURI(this.fragmentContext) !== _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML) {
      return;
    }

    switch (this.fragmentContextID) {
      case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TITLE:
      case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEXTAREA:
        {
          this.tokenizer.state = _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_1__.TokenizerMode.RCDATA;
          break;
        }

      case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.STYLE:
      case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.XMP:
      case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.IFRAME:
      case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.NOEMBED:
      case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.NOFRAMES:
      case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.NOSCRIPT:
        {
          this.tokenizer.state = _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_1__.TokenizerMode.RAWTEXT;
          break;
        }

      case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SCRIPT:
        {
          this.tokenizer.state = _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_1__.TokenizerMode.SCRIPT_DATA;
          break;
        }

      case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.PLAINTEXT:
        {
          this.tokenizer.state = _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_1__.TokenizerMode.PLAINTEXT;
          break;
        }

      default: // Do nothing

    }
  } //Tree mutation
  ;

  _proto._setDocumentType = function _setDocumentType(token) {
    var _this = this;

    var name = token.name || '';
    var publicId = token.publicId || '';
    var systemId = token.systemId || '';
    this.treeAdapter.setDocumentType(this.document, name, publicId, systemId);

    if (token.location) {
      var documentChildren = this.treeAdapter.getChildNodes(this.document);
      var docTypeNode = documentChildren.find(function (node) {
        return _this.treeAdapter.isDocumentTypeNode(node);
      });

      if (docTypeNode) {
        this.treeAdapter.setNodeSourceCodeLocation(docTypeNode, token.location);
      }
    }
  };

  _proto._attachElementToTree = function _attachElementToTree(element, location) {
    if (this.options.sourceCodeLocationInfo) {
      var loc = location && (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, location, {
        startTag: location
      });

      this.treeAdapter.setNodeSourceCodeLocation(element, loc);
    }

    if (this._shouldFosterParentOnInsertion()) {
      this._fosterParentElement(element);
    } else {
      var parent = this.openElements.currentTmplContentOrNode;
      this.treeAdapter.appendChild(parent, element);
    }
  };

  _proto._appendElement = function _appendElement(token, namespaceURI) {
    var element = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);

    this._attachElementToTree(element, token.location);
  };

  _proto._insertElement = function _insertElement(token, namespaceURI) {
    var element = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);

    this._attachElementToTree(element, token.location);

    this.openElements.push(element, token.tagID);
  };

  _proto._insertFakeElement = function _insertFakeElement(tagName, tagID) {
    var element = this.treeAdapter.createElement(tagName, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML, []);

    this._attachElementToTree(element, null);

    this.openElements.push(element, tagID);
  };

  _proto._insertTemplate = function _insertTemplate(token) {
    var tmpl = this.treeAdapter.createElement(token.tagName, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML, token.attrs);
    var content = this.treeAdapter.createDocumentFragment();
    this.treeAdapter.setTemplateContent(tmpl, content);

    this._attachElementToTree(tmpl, token.location);

    this.openElements.push(tmpl, token.tagID);
    if (this.options.sourceCodeLocationInfo) this.treeAdapter.setNodeSourceCodeLocation(content, null);
  };

  _proto._insertFakeRootElement = function _insertFakeRootElement() {
    var element = this.treeAdapter.createElement(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_NAMES.HTML, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML, []);
    if (this.options.sourceCodeLocationInfo) this.treeAdapter.setNodeSourceCodeLocation(element, null);
    this.treeAdapter.appendChild(this.openElements.current, element);
    this.openElements.push(element, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML);
  };

  _proto._appendCommentNode = function _appendCommentNode(token, parent) {
    var commentNode = this.treeAdapter.createCommentNode(token.data);
    this.treeAdapter.appendChild(parent, commentNode);

    if (this.options.sourceCodeLocationInfo) {
      this.treeAdapter.setNodeSourceCodeLocation(commentNode, token.location);
    }
  };

  _proto._insertCharacters = function _insertCharacters(token) {
    var parent;
    var beforeElement;

    if (this._shouldFosterParentOnInsertion()) {
      var _this$_findFosterPare = this._findFosterParentingLocation();

      parent = _this$_findFosterPare.parent;
      beforeElement = _this$_findFosterPare.beforeElement;

      if (beforeElement) {
        this.treeAdapter.insertTextBefore(parent, token.chars, beforeElement);
      } else {
        this.treeAdapter.insertText(parent, token.chars);
      }
    } else {
      parent = this.openElements.currentTmplContentOrNode;
      this.treeAdapter.insertText(parent, token.chars);
    }

    if (!token.location) return;
    var siblings = this.treeAdapter.getChildNodes(parent);
    var textNodeIdx = beforeElement ? siblings.lastIndexOf(beforeElement) : siblings.length;
    var textNode = siblings[textNodeIdx - 1]; //NOTE: if we have a location assigned by another token, then just update the end position

    var tnLoc = this.treeAdapter.getNodeSourceCodeLocation(textNode);

    if (tnLoc) {
      var _token$location = token.location,
          endLine = _token$location.endLine,
          endCol = _token$location.endCol,
          endOffset = _token$location.endOffset;
      this.treeAdapter.updateNodeSourceCodeLocation(textNode, {
        endLine: endLine,
        endCol: endCol,
        endOffset: endOffset
      });
    } else if (this.options.sourceCodeLocationInfo) {
      this.treeAdapter.setNodeSourceCodeLocation(textNode, token.location);
    }
  };

  _proto._adoptNodes = function _adoptNodes(donor, recipient) {
    for (var child = this.treeAdapter.getFirstChild(donor); child; child = this.treeAdapter.getFirstChild(donor)) {
      this.treeAdapter.detachNode(child);
      this.treeAdapter.appendChild(recipient, child);
    }
  };

  _proto._setEndLocation = function _setEndLocation(element, closingToken) {
    if (this.treeAdapter.getNodeSourceCodeLocation(element) && closingToken.location) {
      var ctLoc = closingToken.location;
      var tn = this.treeAdapter.getTagName(element);
      var endLoc = // NOTE: For cases like <p> <p> </p> - First 'p' closes without a closing
      // tag and for cases like <td> <p> </td> - 'p' closes without a closing tag.
      closingToken.type === _common_token_js__WEBPACK_IMPORTED_MODULE_10__.TokenType.END_TAG && tn === closingToken.tagName ? {
        endTag: (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, ctLoc),
        endLine: ctLoc.endLine,
        endCol: ctLoc.endCol,
        endOffset: ctLoc.endOffset
      } : {
        endLine: ctLoc.startLine,
        endCol: ctLoc.startCol,
        endOffset: ctLoc.startOffset
      };
      this.treeAdapter.updateNodeSourceCodeLocation(element, endLoc);
    }
  } //Token processing
  ;

  _proto.shouldProcessStartTagTokenInForeignContent = function shouldProcessStartTagTokenInForeignContent(token) {
    // Check that neither current === document, or ns === NS.HTML
    if (!this.currentNotInHTML) return false;
    var current;
    var currentTagId;

    if (this.openElements.stackTop === 0 && this.fragmentContext) {
      current = this.fragmentContext;
      currentTagId = this.fragmentContextID;
    } else {
      var _this$openElements2 = this.openElements;
      current = _this$openElements2.current;
      currentTagId = _this$openElements2.currentTagId;
    }

    if (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SVG && this.treeAdapter.getTagName(current) === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_NAMES.ANNOTATION_XML && this.treeAdapter.getNamespaceURI(current) === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.MATHML) {
      return false;
    }

    return (// Check that `current` is not an integration point for HTML or MathML elements.
      this.tokenizer.inForeignNode || // If it _is_ an integration point, then we might have to check that it is not an HTML
      // integration point.
      (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.MGLYPH || token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.MALIGNMARK) && !this._isIntegrationPoint(currentTagId, current, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML)
    );
  };

  _proto._processToken = function _processToken(token) {
    switch (token.type) {
      case _common_token_js__WEBPACK_IMPORTED_MODULE_10__.TokenType.CHARACTER:
        {
          this.onCharacter(token);
          break;
        }

      case _common_token_js__WEBPACK_IMPORTED_MODULE_10__.TokenType.NULL_CHARACTER:
        {
          this.onNullCharacter(token);
          break;
        }

      case _common_token_js__WEBPACK_IMPORTED_MODULE_10__.TokenType.COMMENT:
        {
          this.onComment(token);
          break;
        }

      case _common_token_js__WEBPACK_IMPORTED_MODULE_10__.TokenType.DOCTYPE:
        {
          this.onDoctype(token);
          break;
        }

      case _common_token_js__WEBPACK_IMPORTED_MODULE_10__.TokenType.START_TAG:
        {
          this._processStartTag(token);

          break;
        }

      case _common_token_js__WEBPACK_IMPORTED_MODULE_10__.TokenType.END_TAG:
        {
          this.onEndTag(token);
          break;
        }

      case _common_token_js__WEBPACK_IMPORTED_MODULE_10__.TokenType.EOF:
        {
          this.onEof(token);
          break;
        }

      case _common_token_js__WEBPACK_IMPORTED_MODULE_10__.TokenType.WHITESPACE_CHARACTER:
        {
          this.onWhitespaceCharacter(token);
          break;
        }
    }
  } //Integration points
  ;

  _proto._isIntegrationPoint = function _isIntegrationPoint(tid, element, foreignNS) {
    var ns = this.treeAdapter.getNamespaceURI(element);
    var attrs = this.treeAdapter.getAttrList(element);
    return _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_6__.isIntegrationPoint(tid, ns, attrs, foreignNS);
  } //Active formatting elements reconstruction
  ;

  _proto._reconstructActiveFormattingElements = function _reconstructActiveFormattingElements() {
    var _this2 = this;

    var listLength = this.activeFormattingElements.entries.length;

    if (listLength) {
      var endIndex = this.activeFormattingElements.entries.findIndex(function (entry) {
        return entry.type === _formatting_element_list_js__WEBPACK_IMPORTED_MODULE_3__.EntryType.Marker || _this2.openElements.contains(entry.element);
      });
      var unopenIdx = endIndex < 0 ? listLength - 1 : endIndex - 1;

      for (var i = unopenIdx; i >= 0; i--) {
        var entry = this.activeFormattingElements.entries[i];

        this._insertElement(entry.token, this.treeAdapter.getNamespaceURI(entry.element));

        entry.element = this.openElements.current;
      }
    }
  } //Close elements
  ;

  _proto._closeTableCell = function _closeTableCell() {
    this.openElements.generateImpliedEndTags();
    this.openElements.popUntilTableCellPopped();
    this.activeFormattingElements.clearToLastMarker();
    this.insertionMode = InsertionMode.IN_ROW;
  };

  _proto._closePElement = function _closePElement() {
    this.openElements.generateImpliedEndTagsWithExclusion(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.P);
    this.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.P);
  } //Insertion modes
  ;

  _proto._resetInsertionMode = function _resetInsertionMode() {
    for (var i = this.openElements.stackTop; i >= 0; i--) {
      //Insertion mode reset map
      switch (i === 0 && this.fragmentContext ? this.fragmentContextID : this.openElements.tagIDs[i]) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TR:
          {
            this.insertionMode = InsertionMode.IN_ROW;
            return;
          }

        case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TBODY:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.THEAD:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TFOOT:
          {
            this.insertionMode = InsertionMode.IN_TABLE_BODY;
            return;
          }

        case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CAPTION:
          {
            this.insertionMode = InsertionMode.IN_CAPTION;
            return;
          }

        case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COLGROUP:
          {
            this.insertionMode = InsertionMode.IN_COLUMN_GROUP;
            return;
          }

        case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TABLE:
          {
            this.insertionMode = InsertionMode.IN_TABLE;
            return;
          }

        case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BODY:
          {
            this.insertionMode = InsertionMode.IN_BODY;
            return;
          }

        case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FRAMESET:
          {
            this.insertionMode = InsertionMode.IN_FRAMESET;
            return;
          }

        case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SELECT:
          {
            this._resetInsertionModeForSelect(i);

            return;
          }

        case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE:
          {
            this.insertionMode = this.tmplInsertionModeStack[0];
            return;
          }

        case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML:
          {
            this.insertionMode = this.headElement ? InsertionMode.AFTER_HEAD : InsertionMode.BEFORE_HEAD;
            return;
          }

        case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TD:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TH:
          {
            if (i > 0) {
              this.insertionMode = InsertionMode.IN_CELL;
              return;
            }

            break;
          }

        case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HEAD:
          {
            if (i > 0) {
              this.insertionMode = InsertionMode.IN_HEAD;
              return;
            }

            break;
          }
      }
    }

    this.insertionMode = InsertionMode.IN_BODY;
  };

  _proto._resetInsertionModeForSelect = function _resetInsertionModeForSelect(selectIdx) {
    if (selectIdx > 0) {
      for (var i = selectIdx - 1; i > 0; i--) {
        var tn = this.openElements.tagIDs[i];

        if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE) {
          break;
        } else if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TABLE) {
          this.insertionMode = InsertionMode.IN_SELECT_IN_TABLE;
          return;
        }
      }
    }

    this.insertionMode = InsertionMode.IN_SELECT;
  } //Foster parenting
  ;

  _proto._isElementCausesFosterParenting = function _isElementCausesFosterParenting(tn) {
    return TABLE_STRUCTURE_TAGS.has(tn);
  };

  _proto._shouldFosterParentOnInsertion = function _shouldFosterParentOnInsertion() {
    return this.fosterParentingEnabled && this._isElementCausesFosterParenting(this.openElements.currentTagId);
  };

  _proto._findFosterParentingLocation = function _findFosterParentingLocation() {
    for (var i = this.openElements.stackTop; i >= 0; i--) {
      var openElement = this.openElements.items[i];

      switch (this.openElements.tagIDs[i]) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE:
          {
            if (this.treeAdapter.getNamespaceURI(openElement) === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML) {
              return {
                parent: this.treeAdapter.getTemplateContent(openElement),
                beforeElement: null
              };
            }

            break;
          }

        case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TABLE:
          {
            var parent = this.treeAdapter.getParentNode(openElement);

            if (parent) {
              return {
                parent: parent,
                beforeElement: openElement
              };
            }

            return {
              parent: this.openElements.items[i - 1],
              beforeElement: null
            };
          }

        default: // Do nothing

      }
    }

    return {
      parent: this.openElements.items[0],
      beforeElement: null
    };
  };

  _proto._fosterParentElement = function _fosterParentElement(element) {
    var location = this._findFosterParentingLocation();

    if (location.beforeElement) {
      this.treeAdapter.insertBefore(location.parent, element, location.beforeElement);
    } else {
      this.treeAdapter.appendChild(location.parent, element);
    }
  } //Special elements
  ;

  _proto._isSpecialElement = function _isSpecialElement(element, id) {
    var ns = this.treeAdapter.getNamespaceURI(element);
    return _common_html_js__WEBPACK_IMPORTED_MODULE_9__.SPECIAL_ELEMENTS[ns].has(id);
  };

  _proto.onCharacter = function onCharacter(token) {
    this.skipNextNewLine = false;

    if (this.tokenizer.inForeignNode) {
      characterInForeignContent(this, token);
      return;
    }

    switch (this.insertionMode) {
      case InsertionMode.INITIAL:
        {
          tokenInInitialMode(this, token);
          break;
        }

      case InsertionMode.BEFORE_HTML:
        {
          tokenBeforeHtml(this, token);
          break;
        }

      case InsertionMode.BEFORE_HEAD:
        {
          tokenBeforeHead(this, token);
          break;
        }

      case InsertionMode.IN_HEAD:
        {
          tokenInHead(this, token);
          break;
        }

      case InsertionMode.IN_HEAD_NO_SCRIPT:
        {
          tokenInHeadNoScript(this, token);
          break;
        }

      case InsertionMode.AFTER_HEAD:
        {
          tokenAfterHead(this, token);
          break;
        }

      case InsertionMode.IN_BODY:
      case InsertionMode.IN_CAPTION:
      case InsertionMode.IN_CELL:
      case InsertionMode.IN_TEMPLATE:
        {
          characterInBody(this, token);
          break;
        }

      case InsertionMode.TEXT:
      case InsertionMode.IN_SELECT:
      case InsertionMode.IN_SELECT_IN_TABLE:
        {
          this._insertCharacters(token);

          break;
        }

      case InsertionMode.IN_TABLE:
      case InsertionMode.IN_TABLE_BODY:
      case InsertionMode.IN_ROW:
        {
          characterInTable(this, token);
          break;
        }

      case InsertionMode.IN_TABLE_TEXT:
        {
          characterInTableText(this, token);
          break;
        }

      case InsertionMode.IN_COLUMN_GROUP:
        {
          tokenInColumnGroup(this, token);
          break;
        }

      case InsertionMode.AFTER_BODY:
        {
          tokenAfterBody(this, token);
          break;
        }

      case InsertionMode.AFTER_AFTER_BODY:
        {
          tokenAfterAfterBody(this, token);
          break;
        }

      default: // Do nothing

    }
  };

  _proto.onNullCharacter = function onNullCharacter(token) {
    this.skipNextNewLine = false;

    if (this.tokenizer.inForeignNode) {
      nullCharacterInForeignContent(this, token);
      return;
    }

    switch (this.insertionMode) {
      case InsertionMode.INITIAL:
        {
          tokenInInitialMode(this, token);
          break;
        }

      case InsertionMode.BEFORE_HTML:
        {
          tokenBeforeHtml(this, token);
          break;
        }

      case InsertionMode.BEFORE_HEAD:
        {
          tokenBeforeHead(this, token);
          break;
        }

      case InsertionMode.IN_HEAD:
        {
          tokenInHead(this, token);
          break;
        }

      case InsertionMode.IN_HEAD_NO_SCRIPT:
        {
          tokenInHeadNoScript(this, token);
          break;
        }

      case InsertionMode.AFTER_HEAD:
        {
          tokenAfterHead(this, token);
          break;
        }

      case InsertionMode.TEXT:
        {
          this._insertCharacters(token);

          break;
        }

      case InsertionMode.IN_TABLE:
      case InsertionMode.IN_TABLE_BODY:
      case InsertionMode.IN_ROW:
        {
          characterInTable(this, token);
          break;
        }

      case InsertionMode.IN_COLUMN_GROUP:
        {
          tokenInColumnGroup(this, token);
          break;
        }

      case InsertionMode.AFTER_BODY:
        {
          tokenAfterBody(this, token);
          break;
        }

      case InsertionMode.AFTER_AFTER_BODY:
        {
          tokenAfterAfterBody(this, token);
          break;
        }

      default: // Do nothing

    }
  };

  _proto.onComment = function onComment(token) {
    this.skipNextNewLine = false;

    if (this.currentNotInHTML) {
      appendComment(this, token);
      return;
    }

    switch (this.insertionMode) {
      case InsertionMode.INITIAL:
      case InsertionMode.BEFORE_HTML:
      case InsertionMode.BEFORE_HEAD:
      case InsertionMode.IN_HEAD:
      case InsertionMode.IN_HEAD_NO_SCRIPT:
      case InsertionMode.AFTER_HEAD:
      case InsertionMode.IN_BODY:
      case InsertionMode.IN_TABLE:
      case InsertionMode.IN_CAPTION:
      case InsertionMode.IN_COLUMN_GROUP:
      case InsertionMode.IN_TABLE_BODY:
      case InsertionMode.IN_ROW:
      case InsertionMode.IN_CELL:
      case InsertionMode.IN_SELECT:
      case InsertionMode.IN_SELECT_IN_TABLE:
      case InsertionMode.IN_TEMPLATE:
      case InsertionMode.IN_FRAMESET:
      case InsertionMode.AFTER_FRAMESET:
        {
          appendComment(this, token);
          break;
        }

      case InsertionMode.IN_TABLE_TEXT:
        {
          tokenInTableText(this, token);
          break;
        }

      case InsertionMode.AFTER_BODY:
        {
          appendCommentToRootHtmlElement(this, token);
          break;
        }

      case InsertionMode.AFTER_AFTER_BODY:
      case InsertionMode.AFTER_AFTER_FRAMESET:
        {
          appendCommentToDocument(this, token);
          break;
        }

      default: // Do nothing

    }
  };

  _proto.onDoctype = function onDoctype(token) {
    this.skipNextNewLine = false;

    switch (this.insertionMode) {
      case InsertionMode.INITIAL:
        {
          doctypeInInitialMode(this, token);
          break;
        }

      case InsertionMode.BEFORE_HEAD:
      case InsertionMode.IN_HEAD:
      case InsertionMode.IN_HEAD_NO_SCRIPT:
      case InsertionMode.AFTER_HEAD:
        {
          this._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_7__.ERR.misplacedDoctype);

          break;
        }

      case InsertionMode.IN_TABLE_TEXT:
        {
          tokenInTableText(this, token);
          break;
        }

      default: // Do nothing

    }
  };

  _proto.onStartTag = function onStartTag(token) {
    this.skipNextNewLine = false;
    this.currentToken = token;

    this._processStartTag(token);

    if (token.selfClosing && !token.ackSelfClosing) {
      this._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_7__.ERR.nonVoidHtmlElementStartTagWithTrailingSolidus);
    }
  }
  /**
   * Processes a given start tag.
   *
   * `onStartTag` checks if a self-closing tag was recognized. When a token
   * is moved inbetween multiple insertion modes, this check for self-closing
   * could lead to false positives. To avoid this, `_processStartTag` is used
   * for nested calls.
   *
   * @param token The token to process.
   */
  ;

  _proto._processStartTag = function _processStartTag(token) {
    if (this.shouldProcessStartTagTokenInForeignContent(token)) {
      startTagInForeignContent(this, token);
    } else {
      this._startTagOutsideForeignContent(token);
    }
  };

  _proto._startTagOutsideForeignContent = function _startTagOutsideForeignContent(token) {
    switch (this.insertionMode) {
      case InsertionMode.INITIAL:
        {
          tokenInInitialMode(this, token);
          break;
        }

      case InsertionMode.BEFORE_HTML:
        {
          startTagBeforeHtml(this, token);
          break;
        }

      case InsertionMode.BEFORE_HEAD:
        {
          startTagBeforeHead(this, token);
          break;
        }

      case InsertionMode.IN_HEAD:
        {
          startTagInHead(this, token);
          break;
        }

      case InsertionMode.IN_HEAD_NO_SCRIPT:
        {
          startTagInHeadNoScript(this, token);
          break;
        }

      case InsertionMode.AFTER_HEAD:
        {
          startTagAfterHead(this, token);
          break;
        }

      case InsertionMode.IN_BODY:
        {
          startTagInBody(this, token);
          break;
        }

      case InsertionMode.IN_TABLE:
        {
          startTagInTable(this, token);
          break;
        }

      case InsertionMode.IN_TABLE_TEXT:
        {
          tokenInTableText(this, token);
          break;
        }

      case InsertionMode.IN_CAPTION:
        {
          startTagInCaption(this, token);
          break;
        }

      case InsertionMode.IN_COLUMN_GROUP:
        {
          startTagInColumnGroup(this, token);
          break;
        }

      case InsertionMode.IN_TABLE_BODY:
        {
          startTagInTableBody(this, token);
          break;
        }

      case InsertionMode.IN_ROW:
        {
          startTagInRow(this, token);
          break;
        }

      case InsertionMode.IN_CELL:
        {
          startTagInCell(this, token);
          break;
        }

      case InsertionMode.IN_SELECT:
        {
          startTagInSelect(this, token);
          break;
        }

      case InsertionMode.IN_SELECT_IN_TABLE:
        {
          startTagInSelectInTable(this, token);
          break;
        }

      case InsertionMode.IN_TEMPLATE:
        {
          startTagInTemplate(this, token);
          break;
        }

      case InsertionMode.AFTER_BODY:
        {
          startTagAfterBody(this, token);
          break;
        }

      case InsertionMode.IN_FRAMESET:
        {
          startTagInFrameset(this, token);
          break;
        }

      case InsertionMode.AFTER_FRAMESET:
        {
          startTagAfterFrameset(this, token);
          break;
        }

      case InsertionMode.AFTER_AFTER_BODY:
        {
          startTagAfterAfterBody(this, token);
          break;
        }

      case InsertionMode.AFTER_AFTER_FRAMESET:
        {
          startTagAfterAfterFrameset(this, token);
          break;
        }

      default: // Do nothing

    }
  };

  _proto.onEndTag = function onEndTag(token) {
    this.skipNextNewLine = false;
    this.currentToken = token;

    if (this.currentNotInHTML) {
      endTagInForeignContent(this, token);
    } else {
      this._endTagOutsideForeignContent(token);
    }
  };

  _proto._endTagOutsideForeignContent = function _endTagOutsideForeignContent(token) {
    switch (this.insertionMode) {
      case InsertionMode.INITIAL:
        {
          tokenInInitialMode(this, token);
          break;
        }

      case InsertionMode.BEFORE_HTML:
        {
          endTagBeforeHtml(this, token);
          break;
        }

      case InsertionMode.BEFORE_HEAD:
        {
          endTagBeforeHead(this, token);
          break;
        }

      case InsertionMode.IN_HEAD:
        {
          endTagInHead(this, token);
          break;
        }

      case InsertionMode.IN_HEAD_NO_SCRIPT:
        {
          endTagInHeadNoScript(this, token);
          break;
        }

      case InsertionMode.AFTER_HEAD:
        {
          endTagAfterHead(this, token);
          break;
        }

      case InsertionMode.IN_BODY:
        {
          endTagInBody(this, token);
          break;
        }

      case InsertionMode.TEXT:
        {
          endTagInText(this, token);
          break;
        }

      case InsertionMode.IN_TABLE:
        {
          endTagInTable(this, token);
          break;
        }

      case InsertionMode.IN_TABLE_TEXT:
        {
          tokenInTableText(this, token);
          break;
        }

      case InsertionMode.IN_CAPTION:
        {
          endTagInCaption(this, token);
          break;
        }

      case InsertionMode.IN_COLUMN_GROUP:
        {
          endTagInColumnGroup(this, token);
          break;
        }

      case InsertionMode.IN_TABLE_BODY:
        {
          endTagInTableBody(this, token);
          break;
        }

      case InsertionMode.IN_ROW:
        {
          endTagInRow(this, token);
          break;
        }

      case InsertionMode.IN_CELL:
        {
          endTagInCell(this, token);
          break;
        }

      case InsertionMode.IN_SELECT:
        {
          endTagInSelect(this, token);
          break;
        }

      case InsertionMode.IN_SELECT_IN_TABLE:
        {
          endTagInSelectInTable(this, token);
          break;
        }

      case InsertionMode.IN_TEMPLATE:
        {
          endTagInTemplate(this, token);
          break;
        }

      case InsertionMode.AFTER_BODY:
        {
          endTagAfterBody(this, token);
          break;
        }

      case InsertionMode.IN_FRAMESET:
        {
          endTagInFrameset(this, token);
          break;
        }

      case InsertionMode.AFTER_FRAMESET:
        {
          endTagAfterFrameset(this, token);
          break;
        }

      case InsertionMode.AFTER_AFTER_BODY:
        {
          tokenAfterAfterBody(this, token);
          break;
        }

      default: // Do nothing

    }
  };

  _proto.onEof = function onEof(token) {
    switch (this.insertionMode) {
      case InsertionMode.INITIAL:
        {
          tokenInInitialMode(this, token);
          break;
        }

      case InsertionMode.BEFORE_HTML:
        {
          tokenBeforeHtml(this, token);
          break;
        }

      case InsertionMode.BEFORE_HEAD:
        {
          tokenBeforeHead(this, token);
          break;
        }

      case InsertionMode.IN_HEAD:
        {
          tokenInHead(this, token);
          break;
        }

      case InsertionMode.IN_HEAD_NO_SCRIPT:
        {
          tokenInHeadNoScript(this, token);
          break;
        }

      case InsertionMode.AFTER_HEAD:
        {
          tokenAfterHead(this, token);
          break;
        }

      case InsertionMode.IN_BODY:
      case InsertionMode.IN_TABLE:
      case InsertionMode.IN_CAPTION:
      case InsertionMode.IN_COLUMN_GROUP:
      case InsertionMode.IN_TABLE_BODY:
      case InsertionMode.IN_ROW:
      case InsertionMode.IN_CELL:
      case InsertionMode.IN_SELECT:
      case InsertionMode.IN_SELECT_IN_TABLE:
        {
          eofInBody(this, token);
          break;
        }

      case InsertionMode.TEXT:
        {
          eofInText(this, token);
          break;
        }

      case InsertionMode.IN_TABLE_TEXT:
        {
          tokenInTableText(this, token);
          break;
        }

      case InsertionMode.IN_TEMPLATE:
        {
          eofInTemplate(this, token);
          break;
        }

      case InsertionMode.AFTER_BODY:
      case InsertionMode.IN_FRAMESET:
      case InsertionMode.AFTER_FRAMESET:
      case InsertionMode.AFTER_AFTER_BODY:
      case InsertionMode.AFTER_AFTER_FRAMESET:
        {
          stopParsing(this, token);
          break;
        }

      default: // Do nothing

    }
  };

  _proto.onWhitespaceCharacter = function onWhitespaceCharacter(token) {
    if (this.skipNextNewLine) {
      this.skipNextNewLine = false;

      if (token.chars.charCodeAt(0) === _common_unicode_js__WEBPACK_IMPORTED_MODULE_8__.CODE_POINTS.LINE_FEED) {
        if (token.chars.length === 1) {
          return;
        }

        token.chars = token.chars.substr(1);
      }
    }

    if (this.tokenizer.inForeignNode) {
      this._insertCharacters(token);

      return;
    }

    switch (this.insertionMode) {
      case InsertionMode.IN_HEAD:
      case InsertionMode.IN_HEAD_NO_SCRIPT:
      case InsertionMode.AFTER_HEAD:
      case InsertionMode.TEXT:
      case InsertionMode.IN_COLUMN_GROUP:
      case InsertionMode.IN_SELECT:
      case InsertionMode.IN_SELECT_IN_TABLE:
      case InsertionMode.IN_FRAMESET:
      case InsertionMode.AFTER_FRAMESET:
        {
          this._insertCharacters(token);

          break;
        }

      case InsertionMode.IN_BODY:
      case InsertionMode.IN_CAPTION:
      case InsertionMode.IN_CELL:
      case InsertionMode.IN_TEMPLATE:
      case InsertionMode.AFTER_BODY:
      case InsertionMode.AFTER_AFTER_BODY:
      case InsertionMode.AFTER_AFTER_FRAMESET:
        {
          whitespaceCharacterInBody(this, token);
          break;
        }

      case InsertionMode.IN_TABLE:
      case InsertionMode.IN_TABLE_BODY:
      case InsertionMode.IN_ROW:
        {
          characterInTable(this, token);
          break;
        }

      case InsertionMode.IN_TABLE_TEXT:
        {
          whitespaceCharacterInTableText(this, token);
          break;
        }

      default: // Do nothing

    }
  };

  return Parser;
}(); //Adoption agency algorithm
//(see: http://www.whatwg.org/specs/web-apps/current-work/multipage/tree-construction.html#adoptionAgency)
//------------------------------------------------------------------
//Steps 5-8 of the algorithm

function aaObtainFormattingElementEntry(p, token) {
  var formattingElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName(token.tagName);

  if (formattingElementEntry) {
    if (!p.openElements.contains(formattingElementEntry.element)) {
      p.activeFormattingElements.removeEntry(formattingElementEntry);
      formattingElementEntry = null;
    } else if (!p.openElements.hasInScope(token.tagID)) {
      formattingElementEntry = null;
    }
  } else {
    genericEndTagInBody(p, token);
  }

  return formattingElementEntry;
} //Steps 9 and 10 of the algorithm


function aaObtainFurthestBlock(p, formattingElementEntry) {
  var furthestBlock = null;
  var idx = p.openElements.stackTop;

  for (; idx >= 0; idx--) {
    var element = p.openElements.items[idx];

    if (element === formattingElementEntry.element) {
      break;
    }

    if (p._isSpecialElement(element, p.openElements.tagIDs[idx])) {
      furthestBlock = element;
    }
  }

  if (!furthestBlock) {
    p.openElements.shortenToLength(idx < 0 ? 0 : idx);
    p.activeFormattingElements.removeEntry(formattingElementEntry);
  }

  return furthestBlock;
} //Step 13 of the algorithm


function aaInnerLoop(p, furthestBlock, formattingElement) {
  var lastElement = furthestBlock;
  var nextElement = p.openElements.getCommonAncestor(furthestBlock);

  for (var i = 0, element = nextElement; element !== formattingElement; i++, element = nextElement) {
    //NOTE: store the next element for the next loop iteration (it may be deleted from the stack by step 9.5)
    nextElement = p.openElements.getCommonAncestor(element);
    var elementEntry = p.activeFormattingElements.getElementEntry(element);
    var counterOverflow = elementEntry && i >= AA_INNER_LOOP_ITER;
    var shouldRemoveFromOpenElements = !elementEntry || counterOverflow;

    if (shouldRemoveFromOpenElements) {
      if (counterOverflow) {
        p.activeFormattingElements.removeEntry(elementEntry);
      }

      p.openElements.remove(element);
    } else {
      element = aaRecreateElementFromEntry(p, elementEntry);

      if (lastElement === furthestBlock) {
        p.activeFormattingElements.bookmark = elementEntry;
      }

      p.treeAdapter.detachNode(lastElement);
      p.treeAdapter.appendChild(element, lastElement);
      lastElement = element;
    }
  }

  return lastElement;
} //Step 13.7 of the algorithm


function aaRecreateElementFromEntry(p, elementEntry) {
  var ns = p.treeAdapter.getNamespaceURI(elementEntry.element);
  var newElement = p.treeAdapter.createElement(elementEntry.token.tagName, ns, elementEntry.token.attrs);
  p.openElements.replace(elementEntry.element, newElement);
  elementEntry.element = newElement;
  return newElement;
} //Step 14 of the algorithm


function aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement) {
  var tn = p.treeAdapter.getTagName(commonAncestor);
  var tid = (0,_common_html_js__WEBPACK_IMPORTED_MODULE_9__.getTagID)(tn);

  if (p._isElementCausesFosterParenting(tid)) {
    p._fosterParentElement(lastElement);
  } else {
    var ns = p.treeAdapter.getNamespaceURI(commonAncestor);

    if (tid === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE && ns === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML) {
      commonAncestor = p.treeAdapter.getTemplateContent(commonAncestor);
    }

    p.treeAdapter.appendChild(commonAncestor, lastElement);
  }
} //Steps 15-19 of the algorithm


function aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry) {
  var ns = p.treeAdapter.getNamespaceURI(formattingElementEntry.element);
  var token = formattingElementEntry.token;
  var newElement = p.treeAdapter.createElement(token.tagName, ns, token.attrs);

  p._adoptNodes(furthestBlock, newElement);

  p.treeAdapter.appendChild(furthestBlock, newElement);
  p.activeFormattingElements.insertElementAfterBookmark(newElement, token);
  p.activeFormattingElements.removeEntry(formattingElementEntry);
  p.openElements.remove(formattingElementEntry.element);
  p.openElements.insertAfter(furthestBlock, newElement, token.tagID);
} //Algorithm entry point


function callAdoptionAgency(p, token) {
  for (var i = 0; i < AA_OUTER_LOOP_ITER; i++) {
    var formattingElementEntry = aaObtainFormattingElementEntry(p, token);

    if (!formattingElementEntry) {
      break;
    }

    var furthestBlock = aaObtainFurthestBlock(p, formattingElementEntry);

    if (!furthestBlock) {
      break;
    }

    p.activeFormattingElements.bookmark = formattingElementEntry;
    var lastElement = aaInnerLoop(p, furthestBlock, formattingElementEntry.element);
    var commonAncestor = p.openElements.getCommonAncestor(formattingElementEntry.element);
    p.treeAdapter.detachNode(lastElement);
    if (commonAncestor) aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement);
    aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry);
  }
} //Generic token handlers
//------------------------------------------------------------------


function appendComment(p, token) {
  p._appendCommentNode(token, p.openElements.currentTmplContentOrNode);
}

function appendCommentToRootHtmlElement(p, token) {
  p._appendCommentNode(token, p.openElements.items[0]);
}

function appendCommentToDocument(p, token) {
  p._appendCommentNode(token, p.document);
}

function stopParsing(p, token) {
  p.stopped = true; // NOTE: Set end locations for elements that remain on the open element stack.

  if (token.location) {
    // NOTE: If we are not in a fragment, `html` and `body` will stay on the stack.
    // This is a problem, as we might overwrite their end position here.
    var target = p.fragmentContext ? 0 : 2;

    for (var i = p.openElements.stackTop; i >= target; i--) {
      p._setEndLocation(p.openElements.items[i], token);
    } // Handle `html` and `body`


    if (!p.fragmentContext && p.openElements.stackTop >= 0) {
      var htmlElement = p.openElements.items[0];
      var htmlLocation = p.treeAdapter.getNodeSourceCodeLocation(htmlElement);

      if (htmlLocation && !htmlLocation.endTag) {
        p._setEndLocation(htmlElement, token);

        if (p.openElements.stackTop >= 1) {
          var bodyElement = p.openElements.items[1];
          var bodyLocation = p.treeAdapter.getNodeSourceCodeLocation(bodyElement);

          if (bodyLocation && !bodyLocation.endTag) {
            p._setEndLocation(bodyElement, token);
          }
        }
      }
    }
  }
} // The "initial" insertion mode
//------------------------------------------------------------------


function doctypeInInitialMode(p, token) {
  p._setDocumentType(token);

  var mode = token.forceQuirks ? _common_html_js__WEBPACK_IMPORTED_MODULE_9__.DOCUMENT_MODE.QUIRKS : _common_doctype_js__WEBPACK_IMPORTED_MODULE_5__.getDocumentMode(token);

  if (!_common_doctype_js__WEBPACK_IMPORTED_MODULE_5__.isConforming(token)) {
    p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_7__.ERR.nonConformingDoctype);
  }

  p.treeAdapter.setDocumentMode(p.document, mode);
  p.insertionMode = InsertionMode.BEFORE_HTML;
}

function tokenInInitialMode(p, token) {
  p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_7__.ERR.missingDoctype, true);

  p.treeAdapter.setDocumentMode(p.document, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.DOCUMENT_MODE.QUIRKS);
  p.insertionMode = InsertionMode.BEFORE_HTML;

  p._processToken(token);
} // The "before html" insertion mode
//------------------------------------------------------------------


function startTagBeforeHtml(p, token) {
  if (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML) {
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

    p.insertionMode = InsertionMode.BEFORE_HEAD;
  } else {
    tokenBeforeHtml(p, token);
  }
}

function endTagBeforeHtml(p, token) {
  var tn = token.tagID;

  if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HEAD || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BODY || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BR) {
    tokenBeforeHtml(p, token);
  }
}

function tokenBeforeHtml(p, token) {
  p._insertFakeRootElement();

  p.insertionMode = InsertionMode.BEFORE_HEAD;

  p._processToken(token);
} // The "before head" insertion mode
//------------------------------------------------------------------


function startTagBeforeHead(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML:
      {
        startTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HEAD:
      {
        p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

        p.headElement = p.openElements.current;
        p.insertionMode = InsertionMode.IN_HEAD;
        break;
      }

    default:
      {
        tokenBeforeHead(p, token);
      }
  }
}

function endTagBeforeHead(p, token) {
  var tn = token.tagID;

  if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HEAD || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BODY || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BR) {
    tokenBeforeHead(p, token);
  } else {
    p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_7__.ERR.endTagWithoutMatchingOpenElement);
  }
}

function tokenBeforeHead(p, token) {
  p._insertFakeElement(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_NAMES.HEAD, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HEAD);

  p.headElement = p.openElements.current;
  p.insertionMode = InsertionMode.IN_HEAD;

  p._processToken(token);
} // The "in head" insertion mode
//------------------------------------------------------------------


function startTagInHead(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML:
      {
        startTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BASE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BASEFONT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BGSOUND:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.LINK:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.META:
      {
        p._appendElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

        token.ackSelfClosing = true;
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TITLE:
      {
        p._switchToTextParsing(token, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_1__.TokenizerMode.RCDATA);

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.NOSCRIPT:
      {
        if (p.options.scriptingEnabled) {
          p._switchToTextParsing(token, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_1__.TokenizerMode.RAWTEXT);
        } else {
          p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

          p.insertionMode = InsertionMode.IN_HEAD_NO_SCRIPT;
        }

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.NOFRAMES:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.STYLE:
      {
        p._switchToTextParsing(token, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_1__.TokenizerMode.RAWTEXT);

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SCRIPT:
      {
        p._switchToTextParsing(token, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_1__.TokenizerMode.SCRIPT_DATA);

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE:
      {
        p._insertTemplate(token);

        p.activeFormattingElements.insertMarker();
        p.framesetOk = false;
        p.insertionMode = InsertionMode.IN_TEMPLATE;
        p.tmplInsertionModeStack.unshift(InsertionMode.IN_TEMPLATE);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HEAD:
      {
        p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_7__.ERR.misplacedStartTagForHeadElement);

        break;
      }

    default:
      {
        tokenInHead(p, token);
      }
  }
}

function endTagInHead(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HEAD:
      {
        p.openElements.pop();
        p.insertionMode = InsertionMode.AFTER_HEAD;
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BODY:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BR:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML:
      {
        tokenInHead(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE:
      {
        templateEndTagInHead(p, token);
        break;
      }

    default:
      {
        p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_7__.ERR.endTagWithoutMatchingOpenElement);
      }
  }
}

function templateEndTagInHead(p, token) {
  if (p.openElements.tmplCount > 0) {
    p.openElements.generateImpliedEndTagsThoroughly();

    if (p.openElements.currentTagId !== _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE) {
      p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_7__.ERR.closingOfElementWithOpenChildElements);
    }

    p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE);
    p.activeFormattingElements.clearToLastMarker();
    p.tmplInsertionModeStack.shift();

    p._resetInsertionMode();
  } else {
    p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_7__.ERR.endTagWithoutMatchingOpenElement);
  }
}

function tokenInHead(p, token) {
  p.openElements.pop();
  p.insertionMode = InsertionMode.AFTER_HEAD;

  p._processToken(token);
} // The "in head no script" insertion mode
//------------------------------------------------------------------


function startTagInHeadNoScript(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML:
      {
        startTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BASEFONT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BGSOUND:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HEAD:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.LINK:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.META:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.NOFRAMES:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.STYLE:
      {
        startTagInHead(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.NOSCRIPT:
      {
        p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_7__.ERR.nestedNoscriptInHead);

        break;
      }

    default:
      {
        tokenInHeadNoScript(p, token);
      }
  }
}

function endTagInHeadNoScript(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.NOSCRIPT:
      {
        p.openElements.pop();
        p.insertionMode = InsertionMode.IN_HEAD;
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BR:
      {
        tokenInHeadNoScript(p, token);
        break;
      }

    default:
      {
        p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_7__.ERR.endTagWithoutMatchingOpenElement);
      }
  }
}

function tokenInHeadNoScript(p, token) {
  var errCode = token.type === _common_token_js__WEBPACK_IMPORTED_MODULE_10__.TokenType.EOF ? _common_error_codes_js__WEBPACK_IMPORTED_MODULE_7__.ERR.openElementsLeftAfterEof : _common_error_codes_js__WEBPACK_IMPORTED_MODULE_7__.ERR.disallowedContentInNoscriptInHead;

  p._err(token, errCode);

  p.openElements.pop();
  p.insertionMode = InsertionMode.IN_HEAD;

  p._processToken(token);
} // The "after head" insertion mode
//------------------------------------------------------------------


function startTagAfterHead(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML:
      {
        startTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BODY:
      {
        p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

        p.framesetOk = false;
        p.insertionMode = InsertionMode.IN_BODY;
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FRAMESET:
      {
        p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

        p.insertionMode = InsertionMode.IN_FRAMESET;
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BASE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BASEFONT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BGSOUND:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.LINK:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.META:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.NOFRAMES:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SCRIPT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.STYLE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TITLE:
      {
        p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_7__.ERR.abandonedHeadElementChild);

        p.openElements.push(p.headElement, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HEAD);
        startTagInHead(p, token);
        p.openElements.remove(p.headElement);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HEAD:
      {
        p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_7__.ERR.misplacedStartTagForHeadElement);

        break;
      }

    default:
      {
        tokenAfterHead(p, token);
      }
  }
}

function endTagAfterHead(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BODY:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BR:
      {
        tokenAfterHead(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE:
      {
        templateEndTagInHead(p, token);
        break;
      }

    default:
      {
        p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_7__.ERR.endTagWithoutMatchingOpenElement);
      }
  }
}

function tokenAfterHead(p, token) {
  p._insertFakeElement(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_NAMES.BODY, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BODY);

  p.insertionMode = InsertionMode.IN_BODY;
  modeInBody(p, token);
} // The "in body" insertion mode
//------------------------------------------------------------------


function modeInBody(p, token) {
  switch (token.type) {
    case _common_token_js__WEBPACK_IMPORTED_MODULE_10__.TokenType.CHARACTER:
      {
        characterInBody(p, token);
        break;
      }

    case _common_token_js__WEBPACK_IMPORTED_MODULE_10__.TokenType.WHITESPACE_CHARACTER:
      {
        whitespaceCharacterInBody(p, token);
        break;
      }

    case _common_token_js__WEBPACK_IMPORTED_MODULE_10__.TokenType.COMMENT:
      {
        appendComment(p, token);
        break;
      }

    case _common_token_js__WEBPACK_IMPORTED_MODULE_10__.TokenType.START_TAG:
      {
        startTagInBody(p, token);
        break;
      }

    case _common_token_js__WEBPACK_IMPORTED_MODULE_10__.TokenType.END_TAG:
      {
        endTagInBody(p, token);
        break;
      }

    case _common_token_js__WEBPACK_IMPORTED_MODULE_10__.TokenType.EOF:
      {
        eofInBody(p, token);
        break;
      }

    default: // Do nothing

  }
}

function whitespaceCharacterInBody(p, token) {
  p._reconstructActiveFormattingElements();

  p._insertCharacters(token);
}

function characterInBody(p, token) {
  p._reconstructActiveFormattingElements();

  p._insertCharacters(token);

  p.framesetOk = false;
}

function htmlStartTagInBody(p, token) {
  if (p.openElements.tmplCount === 0) {
    p.treeAdapter.adoptAttributes(p.openElements.items[0], token.attrs);
  }
}

function bodyStartTagInBody(p, token) {
  var bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();

  if (bodyElement && p.openElements.tmplCount === 0) {
    p.framesetOk = false;
    p.treeAdapter.adoptAttributes(bodyElement, token.attrs);
  }
}

function framesetStartTagInBody(p, token) {
  var bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();

  if (p.framesetOk && bodyElement) {
    p.treeAdapter.detachNode(bodyElement);
    p.openElements.popAllUpToHtmlElement();

    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

    p.insertionMode = InsertionMode.IN_FRAMESET;
  }
}

function addressStartTagInBody(p, token) {
  if (p.openElements.hasInButtonScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.P)) {
    p._closePElement();
  }

  p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);
}

function numberedHeaderStartTagInBody(p, token) {
  if (p.openElements.hasInButtonScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.P)) {
    p._closePElement();
  }

  if ((0,_common_html_js__WEBPACK_IMPORTED_MODULE_9__.isNumberedHeader)(p.openElements.currentTagId)) {
    p.openElements.pop();
  }

  p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);
}

function preStartTagInBody(p, token) {
  if (p.openElements.hasInButtonScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.P)) {
    p._closePElement();
  }

  p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML); //NOTE: If the next token is a U+000A LINE FEED (LF) character token, then ignore that token and move
  //on to the next one. (Newlines at the start of pre blocks are ignored as an authoring convenience.)


  p.skipNextNewLine = true;
  p.framesetOk = false;
}

function formStartTagInBody(p, token) {
  var inTemplate = p.openElements.tmplCount > 0;

  if (!p.formElement || inTemplate) {
    if (p.openElements.hasInButtonScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.P)) {
      p._closePElement();
    }

    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

    if (!inTemplate) {
      p.formElement = p.openElements.current;
    }
  }
}

function listItemStartTagInBody(p, token) {
  p.framesetOk = false;
  var tn = token.tagID;

  for (var i = p.openElements.stackTop; i >= 0; i--) {
    var elementId = p.openElements.tagIDs[i];

    if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.LI && elementId === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.LI || (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.DD || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.DT) && (elementId === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.DD || elementId === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.DT)) {
      p.openElements.generateImpliedEndTagsWithExclusion(elementId);
      p.openElements.popUntilTagNamePopped(elementId);
      break;
    }

    if (elementId !== _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.ADDRESS && elementId !== _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.DIV && elementId !== _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.P && p._isSpecialElement(p.openElements.items[i], elementId)) {
      break;
    }
  }

  if (p.openElements.hasInButtonScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.P)) {
    p._closePElement();
  }

  p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);
}

function plaintextStartTagInBody(p, token) {
  if (p.openElements.hasInButtonScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.P)) {
    p._closePElement();
  }

  p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

  p.tokenizer.state = _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_1__.TokenizerMode.PLAINTEXT;
}

function buttonStartTagInBody(p, token) {
  if (p.openElements.hasInScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BUTTON)) {
    p.openElements.generateImpliedEndTags();
    p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BUTTON);
  }

  p._reconstructActiveFormattingElements();

  p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

  p.framesetOk = false;
}

function aStartTagInBody(p, token) {
  var activeElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_NAMES.A);

  if (activeElementEntry) {
    callAdoptionAgency(p, token);
    p.openElements.remove(activeElementEntry.element);
    p.activeFormattingElements.removeEntry(activeElementEntry);
  }

  p._reconstructActiveFormattingElements();

  p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

  p.activeFormattingElements.pushElement(p.openElements.current, token);
}

function bStartTagInBody(p, token) {
  p._reconstructActiveFormattingElements();

  p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

  p.activeFormattingElements.pushElement(p.openElements.current, token);
}

function nobrStartTagInBody(p, token) {
  p._reconstructActiveFormattingElements();

  if (p.openElements.hasInScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.NOBR)) {
    callAdoptionAgency(p, token);

    p._reconstructActiveFormattingElements();
  }

  p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

  p.activeFormattingElements.pushElement(p.openElements.current, token);
}

function appletStartTagInBody(p, token) {
  p._reconstructActiveFormattingElements();

  p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

  p.activeFormattingElements.insertMarker();
  p.framesetOk = false;
}

function tableStartTagInBody(p, token) {
  if (p.treeAdapter.getDocumentMode(p.document) !== _common_html_js__WEBPACK_IMPORTED_MODULE_9__.DOCUMENT_MODE.QUIRKS && p.openElements.hasInButtonScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.P)) {
    p._closePElement();
  }

  p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

  p.framesetOk = false;
  p.insertionMode = InsertionMode.IN_TABLE;
}

function areaStartTagInBody(p, token) {
  p._reconstructActiveFormattingElements();

  p._appendElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

  p.framesetOk = false;
  token.ackSelfClosing = true;
}

function isHiddenInput(token) {
  var inputType = (0,_common_token_js__WEBPACK_IMPORTED_MODULE_10__.getTokenAttr)(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.ATTRS.TYPE);
  return inputType != null && inputType.toLowerCase() === HIDDEN_INPUT_TYPE;
}

function inputStartTagInBody(p, token) {
  p._reconstructActiveFormattingElements();

  p._appendElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

  if (!isHiddenInput(token)) {
    p.framesetOk = false;
  }

  token.ackSelfClosing = true;
}

function paramStartTagInBody(p, token) {
  p._appendElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

  token.ackSelfClosing = true;
}

function hrStartTagInBody(p, token) {
  if (p.openElements.hasInButtonScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.P)) {
    p._closePElement();
  }

  p._appendElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

  p.framesetOk = false;
  token.ackSelfClosing = true;
}

function imageStartTagInBody(p, token) {
  token.tagName = _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_NAMES.IMG;
  token.tagID = _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.IMG;
  areaStartTagInBody(p, token);
}

function textareaStartTagInBody(p, token) {
  p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML); //NOTE: If the next token is a U+000A LINE FEED (LF) character token, then ignore that token and move
  //on to the next one. (Newlines at the start of textarea elements are ignored as an authoring convenience.)


  p.skipNextNewLine = true;
  p.tokenizer.state = _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_1__.TokenizerMode.RCDATA;
  p.originalInsertionMode = p.insertionMode;
  p.framesetOk = false;
  p.insertionMode = InsertionMode.TEXT;
}

function xmpStartTagInBody(p, token) {
  if (p.openElements.hasInButtonScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.P)) {
    p._closePElement();
  }

  p._reconstructActiveFormattingElements();

  p.framesetOk = false;

  p._switchToTextParsing(token, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_1__.TokenizerMode.RAWTEXT);
}

function iframeStartTagInBody(p, token) {
  p.framesetOk = false;

  p._switchToTextParsing(token, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_1__.TokenizerMode.RAWTEXT);
} //NOTE: here we assume that we always act as an user agent with enabled plugins, so we parse
//<noembed> as rawtext.


function noembedStartTagInBody(p, token) {
  p._switchToTextParsing(token, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_1__.TokenizerMode.RAWTEXT);
}

function selectStartTagInBody(p, token) {
  p._reconstructActiveFormattingElements();

  p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

  p.framesetOk = false;
  p.insertionMode = p.insertionMode === InsertionMode.IN_TABLE || p.insertionMode === InsertionMode.IN_CAPTION || p.insertionMode === InsertionMode.IN_TABLE_BODY || p.insertionMode === InsertionMode.IN_ROW || p.insertionMode === InsertionMode.IN_CELL ? InsertionMode.IN_SELECT_IN_TABLE : InsertionMode.IN_SELECT;
}

function optgroupStartTagInBody(p, token) {
  if (p.openElements.currentTagId === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.OPTION) {
    p.openElements.pop();
  }

  p._reconstructActiveFormattingElements();

  p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);
}

function rbStartTagInBody(p, token) {
  if (p.openElements.hasInScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.RUBY)) {
    p.openElements.generateImpliedEndTags();
  }

  p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);
}

function rtStartTagInBody(p, token) {
  if (p.openElements.hasInScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.RUBY)) {
    p.openElements.generateImpliedEndTagsWithExclusion(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.RTC);
  }

  p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);
}

function mathStartTagInBody(p, token) {
  p._reconstructActiveFormattingElements();

  _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_6__.adjustTokenMathMLAttrs(token);
  _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_6__.adjustTokenXMLAttrs(token);

  if (token.selfClosing) {
    p._appendElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.MATHML);
  } else {
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.MATHML);
  }

  token.ackSelfClosing = true;
}

function svgStartTagInBody(p, token) {
  p._reconstructActiveFormattingElements();

  _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_6__.adjustTokenSVGAttrs(token);
  _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_6__.adjustTokenXMLAttrs(token);

  if (token.selfClosing) {
    p._appendElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.SVG);
  } else {
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.SVG);
  }

  token.ackSelfClosing = true;
}

function genericStartTagInBody(p, token) {
  p._reconstructActiveFormattingElements();

  p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);
}

function startTagInBody(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.I:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.S:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.B:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.U:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.EM:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BIG:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CODE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FONT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SMALL:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.STRIKE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.STRONG:
      {
        bStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.A:
      {
        aStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.H1:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.H2:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.H3:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.H4:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.H5:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.H6:
      {
        numberedHeaderStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.P:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.DL:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.OL:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.UL:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.DIV:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.DIR:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.NAV:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.MAIN:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.MENU:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.ASIDE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CENTER:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FIGURE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FOOTER:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HEADER:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HGROUP:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.DIALOG:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.DETAILS:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.ADDRESS:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.ARTICLE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SECTION:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SUMMARY:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FIELDSET:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BLOCKQUOTE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FIGCAPTION:
      {
        addressStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.LI:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.DD:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.DT:
      {
        listItemStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BR:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.IMG:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.WBR:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.AREA:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.EMBED:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.KEYGEN:
      {
        areaStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HR:
      {
        hrStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.RB:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.RTC:
      {
        rbStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.RT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.RP:
      {
        rtStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.PRE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.LISTING:
      {
        preStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.XMP:
      {
        xmpStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SVG:
      {
        svgStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML:
      {
        htmlStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BASE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.LINK:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.META:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.STYLE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TITLE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SCRIPT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BGSOUND:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BASEFONT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE:
      {
        startTagInHead(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BODY:
      {
        bodyStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FORM:
      {
        formStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.NOBR:
      {
        nobrStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.MATH:
      {
        mathStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TABLE:
      {
        tableStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.INPUT:
      {
        inputStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.PARAM:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TRACK:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SOURCE:
      {
        paramStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.IMAGE:
      {
        imageStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BUTTON:
      {
        buttonStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.APPLET:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.OBJECT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.MARQUEE:
      {
        appletStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.IFRAME:
      {
        iframeStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SELECT:
      {
        selectStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.OPTION:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.OPTGROUP:
      {
        optgroupStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.NOEMBED:
      {
        noembedStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FRAMESET:
      {
        framesetStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEXTAREA:
      {
        textareaStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.NOSCRIPT:
      {
        if (p.options.scriptingEnabled) {
          noembedStartTagInBody(p, token);
        } else {
          genericStartTagInBody(p, token);
        }

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.PLAINTEXT:
      {
        plaintextStartTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COL:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TH:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TD:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TR:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HEAD:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FRAME:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TBODY:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TFOOT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.THEAD:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CAPTION:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COLGROUP:
      {
        // Ignore token
        break;
      }

    default:
      {
        genericStartTagInBody(p, token);
      }
  }
}

function bodyEndTagInBody(p, token) {
  if (p.openElements.hasInScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BODY)) {
    p.insertionMode = InsertionMode.AFTER_BODY; //NOTE: <body> is never popped from the stack, so we need to updated
    //the end location explicitly.

    if (p.options.sourceCodeLocationInfo) {
      var bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();

      if (bodyElement) {
        p._setEndLocation(bodyElement, token);
      }
    }
  }
}

function htmlEndTagInBody(p, token) {
  if (p.openElements.hasInScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BODY)) {
    p.insertionMode = InsertionMode.AFTER_BODY;
    endTagAfterBody(p, token);
  }
}

function addressEndTagInBody(p, token) {
  var tn = token.tagID;

  if (p.openElements.hasInScope(tn)) {
    p.openElements.generateImpliedEndTags();
    p.openElements.popUntilTagNamePopped(tn);
  }
}

function formEndTagInBody(p) {
  var inTemplate = p.openElements.tmplCount > 0;
  var formElement = p.formElement;

  if (!inTemplate) {
    p.formElement = null;
  }

  if ((formElement || inTemplate) && p.openElements.hasInScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FORM)) {
    p.openElements.generateImpliedEndTags();

    if (inTemplate) {
      p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FORM);
    } else if (formElement) {
      p.openElements.remove(formElement);
    }
  }
}

function pEndTagInBody(p) {
  if (!p.openElements.hasInButtonScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.P)) {
    p._insertFakeElement(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_NAMES.P, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.P);
  }

  p._closePElement();
}

function liEndTagInBody(p) {
  if (p.openElements.hasInListItemScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.LI)) {
    p.openElements.generateImpliedEndTagsWithExclusion(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.LI);
    p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.LI);
  }
}

function ddEndTagInBody(p, token) {
  var tn = token.tagID;

  if (p.openElements.hasInScope(tn)) {
    p.openElements.generateImpliedEndTagsWithExclusion(tn);
    p.openElements.popUntilTagNamePopped(tn);
  }
}

function numberedHeaderEndTagInBody(p) {
  if (p.openElements.hasNumberedHeaderInScope()) {
    p.openElements.generateImpliedEndTags();
    p.openElements.popUntilNumberedHeaderPopped();
  }
}

function appletEndTagInBody(p, token) {
  var tn = token.tagID;

  if (p.openElements.hasInScope(tn)) {
    p.openElements.generateImpliedEndTags();
    p.openElements.popUntilTagNamePopped(tn);
    p.activeFormattingElements.clearToLastMarker();
  }
}

function brEndTagInBody(p) {
  p._reconstructActiveFormattingElements();

  p._insertFakeElement(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_NAMES.BR, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BR);

  p.openElements.pop();
  p.framesetOk = false;
}

function genericEndTagInBody(p, token) {
  var tn = token.tagName;
  var tid = token.tagID;

  for (var i = p.openElements.stackTop; i > 0; i--) {
    var element = p.openElements.items[i];
    var elementId = p.openElements.tagIDs[i]; // Compare the tag name here, as the tag might not be a known tag with an ID.

    if (tid === elementId && (tid !== _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.UNKNOWN || p.treeAdapter.getTagName(element) === tn)) {
      p.openElements.generateImpliedEndTagsWithExclusion(tid);
      if (p.openElements.stackTop >= i) p.openElements.shortenToLength(i);
      break;
    }

    if (p._isSpecialElement(element, elementId)) {
      break;
    }
  }
}

function endTagInBody(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.A:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.B:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.I:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.S:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.U:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.EM:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BIG:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CODE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FONT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.NOBR:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SMALL:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.STRIKE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.STRONG:
      {
        callAdoptionAgency(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.P:
      {
        pEndTagInBody(p);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.DL:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.UL:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.OL:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.DIR:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.DIV:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.NAV:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.PRE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.MAIN:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.MENU:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.ASIDE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BUTTON:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CENTER:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FIGURE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FOOTER:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HEADER:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HGROUP:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.DIALOG:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.ADDRESS:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.ARTICLE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.DETAILS:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SECTION:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SUMMARY:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.LISTING:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FIELDSET:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BLOCKQUOTE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FIGCAPTION:
      {
        addressEndTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.LI:
      {
        liEndTagInBody(p);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.DD:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.DT:
      {
        ddEndTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.H1:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.H2:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.H3:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.H4:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.H5:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.H6:
      {
        numberedHeaderEndTagInBody(p);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BR:
      {
        brEndTagInBody(p);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BODY:
      {
        bodyEndTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML:
      {
        htmlEndTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FORM:
      {
        formEndTagInBody(p);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.APPLET:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.OBJECT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.MARQUEE:
      {
        appletEndTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE:
      {
        templateEndTagInHead(p, token);
        break;
      }

    default:
      {
        genericEndTagInBody(p, token);
      }
  }
}

function eofInBody(p, token) {
  if (p.tmplInsertionModeStack.length > 0) {
    eofInTemplate(p, token);
  } else {
    stopParsing(p, token);
  }
} // The "text" insertion mode
//------------------------------------------------------------------


function endTagInText(p, token) {
  var _a;

  if (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SCRIPT) {
    (_a = p.scriptHandler) === null || _a === void 0 ? void 0 : _a.call(p, p.openElements.current);
  }

  p.openElements.pop();
  p.insertionMode = p.originalInsertionMode;
}

function eofInText(p, token) {
  p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_7__.ERR.eofInElementThatCanContainOnlyText);

  p.openElements.pop();
  p.insertionMode = p.originalInsertionMode;
  p.onEof(token);
} // The "in table" insertion mode
//------------------------------------------------------------------


function characterInTable(p, token) {
  if (TABLE_STRUCTURE_TAGS.has(p.openElements.currentTagId)) {
    p.pendingCharacterTokens.length = 0;
    p.hasNonWhitespacePendingCharacterToken = false;
    p.originalInsertionMode = p.insertionMode;
    p.insertionMode = InsertionMode.IN_TABLE_TEXT;

    switch (token.type) {
      case _common_token_js__WEBPACK_IMPORTED_MODULE_10__.TokenType.CHARACTER:
        {
          characterInTableText(p, token);
          break;
        }

      case _common_token_js__WEBPACK_IMPORTED_MODULE_10__.TokenType.WHITESPACE_CHARACTER:
        {
          whitespaceCharacterInTableText(p, token);
          break;
        }
      // Ignore null
    }
  } else {
    tokenInTable(p, token);
  }
}

function captionStartTagInTable(p, token) {
  p.openElements.clearBackToTableContext();
  p.activeFormattingElements.insertMarker();

  p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

  p.insertionMode = InsertionMode.IN_CAPTION;
}

function colgroupStartTagInTable(p, token) {
  p.openElements.clearBackToTableContext();

  p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

  p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
}

function colStartTagInTable(p, token) {
  p.openElements.clearBackToTableContext();

  p._insertFakeElement(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_NAMES.COLGROUP, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COLGROUP);

  p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
  startTagInColumnGroup(p, token);
}

function tbodyStartTagInTable(p, token) {
  p.openElements.clearBackToTableContext();

  p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

  p.insertionMode = InsertionMode.IN_TABLE_BODY;
}

function tdStartTagInTable(p, token) {
  p.openElements.clearBackToTableContext();

  p._insertFakeElement(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_NAMES.TBODY, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TBODY);

  p.insertionMode = InsertionMode.IN_TABLE_BODY;
  startTagInTableBody(p, token);
}

function tableStartTagInTable(p, token) {
  if (p.openElements.hasInTableScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TABLE)) {
    p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TABLE);

    p._resetInsertionMode();

    p._processStartTag(token);
  }
}

function inputStartTagInTable(p, token) {
  if (isHiddenInput(token)) {
    p._appendElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);
  } else {
    tokenInTable(p, token);
  }

  token.ackSelfClosing = true;
}

function formStartTagInTable(p, token) {
  if (!p.formElement && p.openElements.tmplCount === 0) {
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

    p.formElement = p.openElements.current;
    p.openElements.pop();
  }
}

function startTagInTable(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TD:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TH:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TR:
      {
        tdStartTagInTable(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.STYLE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SCRIPT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE:
      {
        startTagInHead(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COL:
      {
        colStartTagInTable(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FORM:
      {
        formStartTagInTable(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TABLE:
      {
        tableStartTagInTable(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TBODY:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TFOOT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.THEAD:
      {
        tbodyStartTagInTable(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.INPUT:
      {
        inputStartTagInTable(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CAPTION:
      {
        captionStartTagInTable(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COLGROUP:
      {
        colgroupStartTagInTable(p, token);
        break;
      }

    default:
      {
        tokenInTable(p, token);
      }
  }
}

function endTagInTable(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TABLE:
      {
        if (p.openElements.hasInTableScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TABLE)) {
          p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TABLE);

          p._resetInsertionMode();
        }

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE:
      {
        templateEndTagInHead(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BODY:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CAPTION:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COL:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COLGROUP:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TBODY:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TD:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TFOOT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TH:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.THEAD:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TR:
      {
        // Ignore token
        break;
      }

    default:
      {
        tokenInTable(p, token);
      }
  }
}

function tokenInTable(p, token) {
  var savedFosterParentingState = p.fosterParentingEnabled;
  p.fosterParentingEnabled = true; // Process token in `In Body` mode

  modeInBody(p, token);
  p.fosterParentingEnabled = savedFosterParentingState;
} // The "in table text" insertion mode
//------------------------------------------------------------------


function whitespaceCharacterInTableText(p, token) {
  p.pendingCharacterTokens.push(token);
}

function characterInTableText(p, token) {
  p.pendingCharacterTokens.push(token);
  p.hasNonWhitespacePendingCharacterToken = true;
}

function tokenInTableText(p, token) {
  var i = 0;

  if (p.hasNonWhitespacePendingCharacterToken) {
    for (; i < p.pendingCharacterTokens.length; i++) {
      tokenInTable(p, p.pendingCharacterTokens[i]);
    }
  } else {
    for (; i < p.pendingCharacterTokens.length; i++) {
      p._insertCharacters(p.pendingCharacterTokens[i]);
    }
  }

  p.insertionMode = p.originalInsertionMode;

  p._processToken(token);
} // The "in caption" insertion mode
//------------------------------------------------------------------


var TABLE_VOID_ELEMENTS = new Set([_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CAPTION, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COL, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COLGROUP, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TBODY, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TD, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TFOOT, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TH, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.THEAD, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TR]);

function startTagInCaption(p, token) {
  var tn = token.tagID;

  if (TABLE_VOID_ELEMENTS.has(tn)) {
    if (p.openElements.hasInTableScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CAPTION)) {
      p.openElements.generateImpliedEndTags();
      p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CAPTION);
      p.activeFormattingElements.clearToLastMarker();
      p.insertionMode = InsertionMode.IN_TABLE;
      startTagInTable(p, token);
    }
  } else {
    startTagInBody(p, token);
  }
}

function endTagInCaption(p, token) {
  var tn = token.tagID;

  switch (tn) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CAPTION:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TABLE:
      {
        if (p.openElements.hasInTableScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CAPTION)) {
          p.openElements.generateImpliedEndTags();
          p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CAPTION);
          p.activeFormattingElements.clearToLastMarker();
          p.insertionMode = InsertionMode.IN_TABLE;

          if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TABLE) {
            endTagInTable(p, token);
          }
        }

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BODY:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COL:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COLGROUP:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TBODY:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TD:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TFOOT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TH:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.THEAD:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TR:
      {
        // Ignore token
        break;
      }

    default:
      {
        endTagInBody(p, token);
      }
  }
} // The "in column group" insertion mode
//------------------------------------------------------------------


function startTagInColumnGroup(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML:
      {
        startTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COL:
      {
        p._appendElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

        token.ackSelfClosing = true;
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE:
      {
        startTagInHead(p, token);
        break;
      }

    default:
      {
        tokenInColumnGroup(p, token);
      }
  }
}

function endTagInColumnGroup(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COLGROUP:
      {
        if (p.openElements.currentTagId === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COLGROUP) {
          p.openElements.pop();
          p.insertionMode = InsertionMode.IN_TABLE;
        }

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE:
      {
        templateEndTagInHead(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COL:
      {
        // Ignore token
        break;
      }

    default:
      {
        tokenInColumnGroup(p, token);
      }
  }
}

function tokenInColumnGroup(p, token) {
  if (p.openElements.currentTagId === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COLGROUP) {
    p.openElements.pop();
    p.insertionMode = InsertionMode.IN_TABLE;

    p._processToken(token);
  }
} // The "in table body" insertion mode
//------------------------------------------------------------------


function startTagInTableBody(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TR:
      {
        p.openElements.clearBackToTableBodyContext();

        p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

        p.insertionMode = InsertionMode.IN_ROW;
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TH:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TD:
      {
        p.openElements.clearBackToTableBodyContext();

        p._insertFakeElement(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_NAMES.TR, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TR);

        p.insertionMode = InsertionMode.IN_ROW;
        startTagInRow(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CAPTION:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COL:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COLGROUP:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TBODY:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TFOOT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.THEAD:
      {
        if (p.openElements.hasTableBodyContextInTableScope()) {
          p.openElements.clearBackToTableBodyContext();
          p.openElements.pop();
          p.insertionMode = InsertionMode.IN_TABLE;
          startTagInTable(p, token);
        }

        break;
      }

    default:
      {
        startTagInTable(p, token);
      }
  }
}

function endTagInTableBody(p, token) {
  var tn = token.tagID;

  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TBODY:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TFOOT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.THEAD:
      {
        if (p.openElements.hasInTableScope(tn)) {
          p.openElements.clearBackToTableBodyContext();
          p.openElements.pop();
          p.insertionMode = InsertionMode.IN_TABLE;
        }

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TABLE:
      {
        if (p.openElements.hasTableBodyContextInTableScope()) {
          p.openElements.clearBackToTableBodyContext();
          p.openElements.pop();
          p.insertionMode = InsertionMode.IN_TABLE;
          endTagInTable(p, token);
        }

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BODY:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CAPTION:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COL:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COLGROUP:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TD:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TH:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TR:
      {
        // Ignore token
        break;
      }

    default:
      {
        endTagInTable(p, token);
      }
  }
} // The "in row" insertion mode
//------------------------------------------------------------------


function startTagInRow(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TH:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TD:
      {
        p.openElements.clearBackToTableRowContext();

        p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

        p.insertionMode = InsertionMode.IN_CELL;
        p.activeFormattingElements.insertMarker();
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CAPTION:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COL:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COLGROUP:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TBODY:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TFOOT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.THEAD:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TR:
      {
        if (p.openElements.hasInTableScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TR)) {
          p.openElements.clearBackToTableRowContext();
          p.openElements.pop();
          p.insertionMode = InsertionMode.IN_TABLE_BODY;
          startTagInTableBody(p, token);
        }

        break;
      }

    default:
      {
        startTagInTable(p, token);
      }
  }
}

function endTagInRow(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TR:
      {
        if (p.openElements.hasInTableScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TR)) {
          p.openElements.clearBackToTableRowContext();
          p.openElements.pop();
          p.insertionMode = InsertionMode.IN_TABLE_BODY;
        }

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TABLE:
      {
        if (p.openElements.hasInTableScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TR)) {
          p.openElements.clearBackToTableRowContext();
          p.openElements.pop();
          p.insertionMode = InsertionMode.IN_TABLE_BODY;
          endTagInTableBody(p, token);
        }

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TBODY:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TFOOT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.THEAD:
      {
        if (p.openElements.hasInTableScope(token.tagID) || p.openElements.hasInTableScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TR)) {
          p.openElements.clearBackToTableRowContext();
          p.openElements.pop();
          p.insertionMode = InsertionMode.IN_TABLE_BODY;
          endTagInTableBody(p, token);
        }

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BODY:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CAPTION:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COL:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COLGROUP:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TD:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TH:
      {
        // Ignore end tag
        break;
      }

    default:
      {
        endTagInTable(p, token);
      }
  }
} // The "in cell" insertion mode
//------------------------------------------------------------------


function startTagInCell(p, token) {
  var tn = token.tagID;

  if (TABLE_VOID_ELEMENTS.has(tn)) {
    if (p.openElements.hasInTableScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TD) || p.openElements.hasInTableScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TH)) {
      p._closeTableCell();

      startTagInRow(p, token);
    }
  } else {
    startTagInBody(p, token);
  }
}

function endTagInCell(p, token) {
  var tn = token.tagID;

  switch (tn) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TD:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TH:
      {
        if (p.openElements.hasInTableScope(tn)) {
          p.openElements.generateImpliedEndTags();
          p.openElements.popUntilTagNamePopped(tn);
          p.activeFormattingElements.clearToLastMarker();
          p.insertionMode = InsertionMode.IN_ROW;
        }

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TABLE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TBODY:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TFOOT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.THEAD:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TR:
      {
        if (p.openElements.hasInTableScope(tn)) {
          p._closeTableCell();

          endTagInRow(p, token);
        }

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BODY:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CAPTION:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COL:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COLGROUP:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML:
      {
        // Ignore token
        break;
      }

    default:
      {
        endTagInBody(p, token);
      }
  }
} // The "in select" insertion mode
//------------------------------------------------------------------


function startTagInSelect(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML:
      {
        startTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.OPTION:
      {
        if (p.openElements.currentTagId === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.OPTION) {
          p.openElements.pop();
        }

        p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.OPTGROUP:
      {
        if (p.openElements.currentTagId === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.OPTION) {
          p.openElements.pop();
        }

        if (p.openElements.currentTagId === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.OPTGROUP) {
          p.openElements.pop();
        }

        p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.INPUT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.KEYGEN:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEXTAREA:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SELECT:
      {
        if (p.openElements.hasInSelectScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SELECT)) {
          p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SELECT);

          p._resetInsertionMode();

          if (token.tagID !== _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SELECT) {
            p._processStartTag(token);
          }
        }

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SCRIPT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE:
      {
        startTagInHead(p, token);
        break;
      }

    default: // Do nothing

  }
}

function endTagInSelect(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.OPTGROUP:
      {
        if (p.openElements.stackTop > 0 && p.openElements.currentTagId === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.OPTION && p.openElements.tagIDs[p.openElements.stackTop - 1] === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.OPTGROUP) {
          p.openElements.pop();
        }

        if (p.openElements.currentTagId === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.OPTGROUP) {
          p.openElements.pop();
        }

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.OPTION:
      {
        if (p.openElements.currentTagId === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.OPTION) {
          p.openElements.pop();
        }

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SELECT:
      {
        if (p.openElements.hasInSelectScope(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SELECT)) {
          p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SELECT);

          p._resetInsertionMode();
        }

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE:
      {
        templateEndTagInHead(p, token);
        break;
      }

    default: // Do nothing

  }
} // The "in select in table" insertion mode
//------------------------------------------------------------------


function startTagInSelectInTable(p, token) {
  var tn = token.tagID;

  if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CAPTION || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TABLE || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TBODY || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TFOOT || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.THEAD || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TR || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TD || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TH) {
    p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SELECT);

    p._resetInsertionMode();

    p._processStartTag(token);
  } else {
    startTagInSelect(p, token);
  }
}

function endTagInSelectInTable(p, token) {
  var tn = token.tagID;

  if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CAPTION || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TABLE || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TBODY || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TFOOT || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.THEAD || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TR || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TD || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TH) {
    if (p.openElements.hasInTableScope(tn)) {
      p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SELECT);

      p._resetInsertionMode();

      p.onEndTag(token);
    }
  } else {
    endTagInSelect(p, token);
  }
} // The "in template" insertion mode
//------------------------------------------------------------------


function startTagInTemplate(p, token) {
  switch (token.tagID) {
    // First, handle tags that can start without a mode change
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BASE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BASEFONT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BGSOUND:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.LINK:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.META:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.NOFRAMES:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.SCRIPT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.STYLE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TITLE:
      {
        startTagInHead(p, token);
        break;
      }
    // Re-process the token in the appropriate mode

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.CAPTION:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COLGROUP:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TBODY:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TFOOT:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.THEAD:
      {
        p.tmplInsertionModeStack[0] = InsertionMode.IN_TABLE;
        p.insertionMode = InsertionMode.IN_TABLE;
        startTagInTable(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.COL:
      {
        p.tmplInsertionModeStack[0] = InsertionMode.IN_COLUMN_GROUP;
        p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
        startTagInColumnGroup(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TR:
      {
        p.tmplInsertionModeStack[0] = InsertionMode.IN_TABLE_BODY;
        p.insertionMode = InsertionMode.IN_TABLE_BODY;
        startTagInTableBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TD:
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TH:
      {
        p.tmplInsertionModeStack[0] = InsertionMode.IN_ROW;
        p.insertionMode = InsertionMode.IN_ROW;
        startTagInRow(p, token);
        break;
      }

    default:
      {
        p.tmplInsertionModeStack[0] = InsertionMode.IN_BODY;
        p.insertionMode = InsertionMode.IN_BODY;
        startTagInBody(p, token);
      }
  }
}

function endTagInTemplate(p, token) {
  if (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE) {
    templateEndTagInHead(p, token);
  }
}

function eofInTemplate(p, token) {
  if (p.openElements.tmplCount > 0) {
    p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.TEMPLATE);
    p.activeFormattingElements.clearToLastMarker();
    p.tmplInsertionModeStack.shift();

    p._resetInsertionMode();

    p.onEof(token);
  } else {
    stopParsing(p, token);
  }
} // The "after body" insertion mode
//------------------------------------------------------------------


function startTagAfterBody(p, token) {
  if (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML) {
    startTagInBody(p, token);
  } else {
    tokenAfterBody(p, token);
  }
}

function endTagAfterBody(p, token) {
  var _a;

  if (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML) {
    if (!p.fragmentContext) {
      p.insertionMode = InsertionMode.AFTER_AFTER_BODY;
    } //NOTE: <html> is never popped from the stack, so we need to updated
    //the end location explicitly.


    if (p.options.sourceCodeLocationInfo && p.openElements.tagIDs[0] === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML) {
      p._setEndLocation(p.openElements.items[0], token); // Update the body element, if it doesn't have an end tag


      var bodyElement = p.openElements.items[1];

      if (bodyElement && !((_a = p.treeAdapter.getNodeSourceCodeLocation(bodyElement)) === null || _a === void 0 ? void 0 : _a.endTag)) {
        p._setEndLocation(bodyElement, token);
      }
    }
  } else {
    tokenAfterBody(p, token);
  }
}

function tokenAfterBody(p, token) {
  p.insertionMode = InsertionMode.IN_BODY;
  modeInBody(p, token);
} // The "in frameset" insertion mode
//------------------------------------------------------------------


function startTagInFrameset(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML:
      {
        startTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FRAMESET:
      {
        p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FRAME:
      {
        p._appendElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML);

        token.ackSelfClosing = true;
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.NOFRAMES:
      {
        startTagInHead(p, token);
        break;
      }

    default: // Do nothing

  }
}

function endTagInFrameset(p, token) {
  if (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FRAMESET && !p.openElements.isRootHtmlElementCurrent()) {
    p.openElements.pop();

    if (!p.fragmentContext && p.openElements.currentTagId !== _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.FRAMESET) {
      p.insertionMode = InsertionMode.AFTER_FRAMESET;
    }
  }
} // The "after frameset" insertion mode
//------------------------------------------------------------------


function startTagAfterFrameset(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML:
      {
        startTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.NOFRAMES:
      {
        startTagInHead(p, token);
        break;
      }

    default: // Do nothing

  }
}

function endTagAfterFrameset(p, token) {
  if (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML) {
    p.insertionMode = InsertionMode.AFTER_AFTER_FRAMESET;
  }
} // The "after after body" insertion mode
//------------------------------------------------------------------


function startTagAfterAfterBody(p, token) {
  if (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML) {
    startTagInBody(p, token);
  } else {
    tokenAfterAfterBody(p, token);
  }
}

function tokenAfterAfterBody(p, token) {
  p.insertionMode = InsertionMode.IN_BODY;
  modeInBody(p, token);
} // The "after after frameset" insertion mode
//------------------------------------------------------------------


function startTagAfterAfterFrameset(p, token) {
  switch (token.tagID) {
    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.HTML:
      {
        startTagInBody(p, token);
        break;
      }

    case _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.NOFRAMES:
      {
        startTagInHead(p, token);
        break;
      }

    default: // Do nothing

  }
} // The rules for parsing tokens in foreign content
//------------------------------------------------------------------


function nullCharacterInForeignContent(p, token) {
  token.chars = _common_unicode_js__WEBPACK_IMPORTED_MODULE_8__.REPLACEMENT_CHARACTER;

  p._insertCharacters(token);
}

function characterInForeignContent(p, token) {
  p._insertCharacters(token);

  p.framesetOk = false;
}

function popUntilHtmlOrIntegrationPoint(p) {
  while (p.treeAdapter.getNamespaceURI(p.openElements.current) !== _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML && !p._isIntegrationPoint(p.openElements.currentTagId, p.openElements.current)) {
    p.openElements.pop();
  }
}

function startTagInForeignContent(p, token) {
  if (_common_foreign_content_js__WEBPACK_IMPORTED_MODULE_6__.causesExit(token)) {
    popUntilHtmlOrIntegrationPoint(p);

    p._startTagOutsideForeignContent(token);
  } else {
    var current = p._getAdjustedCurrentElement();

    var currentNs = p.treeAdapter.getNamespaceURI(current);

    if (currentNs === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.MATHML) {
      _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_6__.adjustTokenMathMLAttrs(token);
    } else if (currentNs === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.SVG) {
      _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_6__.adjustTokenSVGTagName(token);
      _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_6__.adjustTokenSVGAttrs(token);
    }

    _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_6__.adjustTokenXMLAttrs(token);

    if (token.selfClosing) {
      p._appendElement(token, currentNs);
    } else {
      p._insertElement(token, currentNs);
    }

    token.ackSelfClosing = true;
  }
}

function endTagInForeignContent(p, token) {
  if (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.P || token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.TAG_ID.BR) {
    popUntilHtmlOrIntegrationPoint(p);

    p._endTagOutsideForeignContent(token);

    return;
  }

  for (var i = p.openElements.stackTop; i > 0; i--) {
    var element = p.openElements.items[i];

    if (p.treeAdapter.getNamespaceURI(element) === _common_html_js__WEBPACK_IMPORTED_MODULE_9__.NS.HTML) {
      p._endTagOutsideForeignContent(token);

      break;
    }

    var tagName = p.treeAdapter.getTagName(element);

    if (tagName.toLowerCase() === token.tagName) {
      //NOTE: update the token tag name for `_setEndLocation`.
      token.tagName = tagName;
      p.openElements.shortenToLength(i);
      break;
    }
  }
}

/***/ }),

/***/ "./node_modules/parse5/dist/parser/open-element-stack.js":
/*!***************************************************************!*\
  !*** ./node_modules/parse5/dist/parser/open-element-stack.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OpenElementStack": () => (/* binding */ OpenElementStack)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _common_html_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/html.js */ "./node_modules/parse5/dist/common/html.js");

 //Element utils

var IMPLICIT_END_TAG_REQUIRED = new Set([_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.DD, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.DT, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.LI, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.OPTGROUP, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.OPTION, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.P, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.RB, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.RP, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.RT, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.RTC]);
var IMPLICIT_END_TAG_REQUIRED_THOROUGHLY = new Set([].concat(IMPLICIT_END_TAG_REQUIRED, [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.CAPTION, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.COLGROUP, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TBODY, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TD, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TFOOT, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TH, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.THEAD, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TR]));
var SCOPING_ELEMENT_NS = new Map([[_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.APPLET, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML], [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.CAPTION, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML], [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.HTML, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML], [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.MARQUEE, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML], [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.OBJECT, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML], [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TABLE, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML], [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TD, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML], [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TEMPLATE, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML], [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TH, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML], [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.ANNOTATION_XML, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.MATHML], [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.MI, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.MATHML], [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.MN, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.MATHML], [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.MO, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.MATHML], [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.MS, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.MATHML], [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.MTEXT, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.MATHML], [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.DESC, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.SVG], [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.FOREIGN_OBJECT, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.SVG], [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TITLE, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.SVG]]);
var NAMED_HEADERS = [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.H1, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.H2, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.H3, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.H4, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.H5, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.H6];
var TABLE_ROW_CONTEXT = [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TR, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TEMPLATE, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.HTML];
var TABLE_BODY_CONTEXT = [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TBODY, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TFOOT, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.THEAD, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TEMPLATE, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.HTML];
var TABLE_CONTEXT = [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TABLE, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TEMPLATE, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.HTML];
var TABLE_CELLS = [_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TD, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TH]; //Stack of open elements

var OpenElementStack = /*#__PURE__*/function () {
  function OpenElementStack(document, treeAdapter, handler) {
    this.treeAdapter = treeAdapter;
    this.handler = handler;
    this.items = [];
    this.tagIDs = [];
    this.stackTop = -1;
    this.tmplCount = 0;
    this.currentTagId = _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.UNKNOWN;
    this.current = document;
  } //Index of element


  var _proto = OpenElementStack.prototype;

  _proto._indexOf = function _indexOf(element) {
    return this.items.lastIndexOf(element, this.stackTop);
  } //Update current element
  ;

  _proto._isInTemplate = function _isInTemplate() {
    return this.currentTagId === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TEMPLATE && this.treeAdapter.getNamespaceURI(this.current) === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML;
  };

  _proto._updateCurrentElement = function _updateCurrentElement() {
    this.current = this.items[this.stackTop];
    this.currentTagId = this.tagIDs[this.stackTop];
  } //Mutations
  ;

  _proto.push = function push(element, tagID) {
    this.stackTop++;
    this.items[this.stackTop] = element;
    this.current = element;
    this.tagIDs[this.stackTop] = tagID;
    this.currentTagId = tagID;

    if (this._isInTemplate()) {
      this.tmplCount++;
    }

    this.handler.onItemPush(element, tagID, true);
  };

  _proto.pop = function pop() {
    var popped = this.current;

    if (this.tmplCount > 0 && this._isInTemplate()) {
      this.tmplCount--;
    }

    this.stackTop--;

    this._updateCurrentElement();

    this.handler.onItemPop(popped, true);
  };

  _proto.replace = function replace(oldElement, newElement) {
    var idx = this._indexOf(oldElement);

    this.items[idx] = newElement;

    if (idx === this.stackTop) {
      this.current = newElement;
    }
  };

  _proto.insertAfter = function insertAfter(referenceElement, newElement, newElementID) {
    var insertionIdx = this._indexOf(referenceElement) + 1;
    this.items.splice(insertionIdx, 0, newElement);
    this.tagIDs.splice(insertionIdx, 0, newElementID);
    this.stackTop++;

    if (insertionIdx === this.stackTop) {
      this._updateCurrentElement();
    }

    this.handler.onItemPush(this.current, this.currentTagId, insertionIdx === this.stackTop);
  };

  _proto.popUntilTagNamePopped = function popUntilTagNamePopped(tagName) {
    var targetIdx = this.stackTop + 1;

    do {
      targetIdx = this.tagIDs.lastIndexOf(tagName, targetIdx - 1);
    } while (targetIdx > 0 && this.treeAdapter.getNamespaceURI(this.items[targetIdx]) !== _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML);

    this.shortenToLength(targetIdx < 0 ? 0 : targetIdx);
  };

  _proto.shortenToLength = function shortenToLength(idx) {
    while (this.stackTop >= idx) {
      var popped = this.current;

      if (this.tmplCount > 0 && this._isInTemplate()) {
        this.tmplCount -= 1;
      }

      this.stackTop--;

      this._updateCurrentElement();

      this.handler.onItemPop(popped, this.stackTop < idx);
    }
  };

  _proto.popUntilElementPopped = function popUntilElementPopped(element) {
    var idx = this._indexOf(element);

    this.shortenToLength(idx < 0 ? 0 : idx);
  };

  _proto.popUntilPopped = function popUntilPopped(tagNames, targetNS) {
    var idx = this._indexOfTagNames(tagNames, targetNS);

    this.shortenToLength(idx < 0 ? 0 : idx);
  };

  _proto.popUntilNumberedHeaderPopped = function popUntilNumberedHeaderPopped() {
    this.popUntilPopped(NAMED_HEADERS, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML);
  };

  _proto.popUntilTableCellPopped = function popUntilTableCellPopped() {
    this.popUntilPopped(TABLE_CELLS, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML);
  };

  _proto.popAllUpToHtmlElement = function popAllUpToHtmlElement() {
    //NOTE: here we assume that the root <html> element is always first in the open element stack, so
    //we perform this fast stack clean up.
    this.tmplCount = 0;
    this.shortenToLength(1);
  };

  _proto._indexOfTagNames = function _indexOfTagNames(tagNames, namespace) {
    for (var i = this.stackTop; i >= 0; i--) {
      if (tagNames.includes(this.tagIDs[i]) && this.treeAdapter.getNamespaceURI(this.items[i]) === namespace) {
        return i;
      }
    }

    return -1;
  };

  _proto.clearBackTo = function clearBackTo(tagNames, targetNS) {
    var idx = this._indexOfTagNames(tagNames, targetNS);

    this.shortenToLength(idx + 1);
  };

  _proto.clearBackToTableContext = function clearBackToTableContext() {
    this.clearBackTo(TABLE_CONTEXT, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML);
  };

  _proto.clearBackToTableBodyContext = function clearBackToTableBodyContext() {
    this.clearBackTo(TABLE_BODY_CONTEXT, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML);
  };

  _proto.clearBackToTableRowContext = function clearBackToTableRowContext() {
    this.clearBackTo(TABLE_ROW_CONTEXT, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML);
  };

  _proto.remove = function remove(element) {
    var idx = this._indexOf(element);

    if (idx >= 0) {
      if (idx === this.stackTop) {
        this.pop();
      } else {
        this.items.splice(idx, 1);
        this.tagIDs.splice(idx, 1);
        this.stackTop--;

        this._updateCurrentElement();

        this.handler.onItemPop(element, false);
      }
    }
  } //Search
  ;

  _proto.tryPeekProperlyNestedBodyElement = function tryPeekProperlyNestedBodyElement() {
    //Properly nested <body> element (should be second element in stack).
    return this.stackTop >= 1 && this.tagIDs[1] === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.BODY ? this.items[1] : null;
  };

  _proto.contains = function contains(element) {
    return this._indexOf(element) > -1;
  };

  _proto.getCommonAncestor = function getCommonAncestor(element) {
    var elementIdx = this._indexOf(element) - 1;
    return elementIdx >= 0 ? this.items[elementIdx] : null;
  };

  _proto.isRootHtmlElementCurrent = function isRootHtmlElementCurrent() {
    return this.stackTop === 0 && this.tagIDs[0] === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.HTML;
  } //Element in scope
  ;

  _proto.hasInScope = function hasInScope(tagName) {
    for (var i = this.stackTop; i >= 0; i--) {
      var tn = this.tagIDs[i];
      var ns = this.treeAdapter.getNamespaceURI(this.items[i]);

      if (tn === tagName && ns === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML) {
        return true;
      }

      if (SCOPING_ELEMENT_NS.get(tn) === ns) {
        return false;
      }
    }

    return true;
  };

  _proto.hasNumberedHeaderInScope = function hasNumberedHeaderInScope() {
    for (var i = this.stackTop; i >= 0; i--) {
      var tn = this.tagIDs[i];
      var ns = this.treeAdapter.getNamespaceURI(this.items[i]);

      if ((0,_common_html_js__WEBPACK_IMPORTED_MODULE_1__.isNumberedHeader)(tn) && ns === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML) {
        return true;
      }

      if (SCOPING_ELEMENT_NS.get(tn) === ns) {
        return false;
      }
    }

    return true;
  };

  _proto.hasInListItemScope = function hasInListItemScope(tagName) {
    for (var i = this.stackTop; i >= 0; i--) {
      var tn = this.tagIDs[i];
      var ns = this.treeAdapter.getNamespaceURI(this.items[i]);

      if (tn === tagName && ns === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML) {
        return true;
      }

      if ((tn === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.UL || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.OL) && ns === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML || SCOPING_ELEMENT_NS.get(tn) === ns) {
        return false;
      }
    }

    return true;
  };

  _proto.hasInButtonScope = function hasInButtonScope(tagName) {
    for (var i = this.stackTop; i >= 0; i--) {
      var tn = this.tagIDs[i];
      var ns = this.treeAdapter.getNamespaceURI(this.items[i]);

      if (tn === tagName && ns === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML) {
        return true;
      }

      if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.BUTTON && ns === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML || SCOPING_ELEMENT_NS.get(tn) === ns) {
        return false;
      }
    }

    return true;
  };

  _proto.hasInTableScope = function hasInTableScope(tagName) {
    for (var i = this.stackTop; i >= 0; i--) {
      var tn = this.tagIDs[i];
      var ns = this.treeAdapter.getNamespaceURI(this.items[i]);

      if (ns !== _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML) {
        continue;
      }

      if (tn === tagName) {
        return true;
      }

      if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TABLE || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TEMPLATE || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.HTML) {
        return false;
      }
    }

    return true;
  };

  _proto.hasTableBodyContextInTableScope = function hasTableBodyContextInTableScope() {
    for (var i = this.stackTop; i >= 0; i--) {
      var tn = this.tagIDs[i];
      var ns = this.treeAdapter.getNamespaceURI(this.items[i]);

      if (ns !== _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML) {
        continue;
      }

      if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TBODY || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.THEAD || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TFOOT) {
        return true;
      }

      if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.TABLE || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.HTML) {
        return false;
      }
    }

    return true;
  };

  _proto.hasInSelectScope = function hasInSelectScope(tagName) {
    for (var i = this.stackTop; i >= 0; i--) {
      var tn = this.tagIDs[i];
      var ns = this.treeAdapter.getNamespaceURI(this.items[i]);

      if (ns !== _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML) {
        continue;
      }

      if (tn === tagName) {
        return true;
      }

      if (tn !== _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.OPTION && tn !== _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_ID.OPTGROUP) {
        return false;
      }
    }

    return true;
  } //Implied end tags
  ;

  _proto.generateImpliedEndTags = function generateImpliedEndTags() {
    while (IMPLICIT_END_TAG_REQUIRED.has(this.currentTagId)) {
      this.pop();
    }
  };

  _proto.generateImpliedEndTagsThoroughly = function generateImpliedEndTagsThoroughly() {
    while (IMPLICIT_END_TAG_REQUIRED_THOROUGHLY.has(this.currentTagId)) {
      this.pop();
    }
  };

  _proto.generateImpliedEndTagsWithExclusion = function generateImpliedEndTagsWithExclusion(exclusionId) {
    while (this.currentTagId !== exclusionId && IMPLICIT_END_TAG_REQUIRED_THOROUGHLY.has(this.currentTagId)) {
      this.pop();
    }
  };

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_0__["default"])(OpenElementStack, [{
    key: "currentTmplContentOrNode",
    get: function get() {
      return this._isInTemplate() ? this.treeAdapter.getTemplateContent(this.current) : this.current;
    }
  }]);

  return OpenElementStack;
}();

/***/ }),

/***/ "./node_modules/parse5/dist/serializer/index.js":
/*!******************************************************!*\
  !*** ./node_modules/parse5/dist/serializer/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "serialize": () => (/* binding */ serialize),
/* harmony export */   "serializeOuter": () => (/* binding */ serializeOuter)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _common_html_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/html.js */ "./node_modules/parse5/dist/common/html.js");
/* harmony import */ var entities_lib_escape_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! entities/lib/escape.js */ "./node_modules/entities/lib/esm/escape.js");
/* harmony import */ var _tree_adapters_default_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../tree-adapters/default.js */ "./node_modules/parse5/dist/tree-adapters/default.js");


function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



 // Sets

var VOID_ELEMENTS = new Set([_common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_NAMES.AREA, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_NAMES.BASE, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_NAMES.BASEFONT, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_NAMES.BGSOUND, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_NAMES.BR, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_NAMES.COL, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_NAMES.EMBED, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_NAMES.FRAME, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_NAMES.HR, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_NAMES.IMG, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_NAMES.INPUT, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_NAMES.KEYGEN, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_NAMES.LINK, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_NAMES.META, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_NAMES.PARAM, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_NAMES.SOURCE, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_NAMES.TRACK, _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_NAMES.WBR]);

function isVoidElement(node, options) {
  return options.treeAdapter.isElementNode(node) && options.treeAdapter.getNamespaceURI(node) === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML && VOID_ELEMENTS.has(options.treeAdapter.getTagName(node));
}

var defaultOpts = {
  treeAdapter: _tree_adapters_default_js__WEBPACK_IMPORTED_MODULE_3__.defaultTreeAdapter,
  scriptingEnabled: true
};
/**
 * Serializes an AST node to an HTML string.
 *
 * @example
 *
 * ```js
 * const parse5 = require('parse5');
 *
 * const document = parse5.parse('<!DOCTYPE html><html><head></head><body>Hi there!</body></html>');
 *
 * // Serializes a document.
 * const html = parse5.serialize(document);
 *
 * // Serializes the <html> element content.
 * const str = parse5.serialize(document.childNodes[1]);
 *
 * console.log(str); //> '<head></head><body>Hi there!</body>'
 * ```
 *
 * @param node Node to serialize.
 * @param options Serialization options.
 */

function serialize(node, options) {
  var opts = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, defaultOpts, options);

  if (isVoidElement(node, opts)) {
    return '';
  }

  return serializeChildNodes(node, opts);
}
/**
 * Serializes an AST element node to an HTML string, including the element node.
 *
 * @example
 *
 * ```js
 * const parse5 = require('parse5');
 *
 * const document = parse5.parseFragment('<div>Hello, <b>world</b>!</div>');
 *
 * // Serializes the <div> element.
 * const html = parse5.serializeOuter(document.childNodes[0]);
 *
 * console.log(str); //> '<div>Hello, <b>world</b>!</div>'
 * ```
 *
 * @param node Node to serialize.
 * @param options Serialization options.
 */

function serializeOuter(node, options) {
  var opts = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, defaultOpts, options);

  return serializeNode(node, opts);
}

function serializeChildNodes(parentNode, options) {
  var html = ''; // Get container of the child nodes

  var container = options.treeAdapter.isElementNode(parentNode) && options.treeAdapter.getTagName(parentNode) === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.TAG_NAMES.TEMPLATE && options.treeAdapter.getNamespaceURI(parentNode) === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML ? options.treeAdapter.getTemplateContent(parentNode) : parentNode;
  var childNodes = options.treeAdapter.getChildNodes(container);

  if (childNodes) {
    for (var _iterator = _createForOfIteratorHelperLoose(childNodes), _step; !(_step = _iterator()).done;) {
      var currentNode = _step.value;
      html += serializeNode(currentNode, options);
    }
  }

  return html;
}

function serializeNode(node, options) {
  if (options.treeAdapter.isElementNode(node)) {
    return serializeElement(node, options);
  }

  if (options.treeAdapter.isTextNode(node)) {
    return serializeTextNode(node, options);
  }

  if (options.treeAdapter.isCommentNode(node)) {
    return serializeCommentNode(node, options);
  }

  if (options.treeAdapter.isDocumentTypeNode(node)) {
    return serializeDocumentTypeNode(node, options);
  } // Return an empty string for unknown nodes


  return '';
}

function serializeElement(node, options) {
  var tn = options.treeAdapter.getTagName(node);
  return "<" + tn + serializeAttributes(node, options) + ">" + (isVoidElement(node, options) ? '' : serializeChildNodes(node, options) + "</" + tn + ">");
}

function serializeAttributes(node, _ref) {
  var treeAdapter = _ref.treeAdapter;
  var html = '';

  for (var _iterator2 = _createForOfIteratorHelperLoose(treeAdapter.getAttrList(node)), _step2; !(_step2 = _iterator2()).done;) {
    var attr = _step2.value;
    html += ' ';

    if (!attr.namespace) {
      html += attr.name;
    } else switch (attr.namespace) {
      case _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.XML:
        {
          html += "xml:" + attr.name;
          break;
        }

      case _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.XMLNS:
        {
          if (attr.name !== 'xmlns') {
            html += 'xmlns:';
          }

          html += attr.name;
          break;
        }

      case _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.XLINK:
        {
          html += "xlink:" + attr.name;
          break;
        }

      default:
        {
          html += attr.prefix + ":" + attr.name;
        }
    }

    html += "=\"" + (0,entities_lib_escape_js__WEBPACK_IMPORTED_MODULE_2__.escapeAttribute)(attr.value) + "\"";
  }

  return html;
}

function serializeTextNode(node, options) {
  var treeAdapter = options.treeAdapter;
  var content = treeAdapter.getTextNodeContent(node);
  var parent = treeAdapter.getParentNode(node);
  var parentTn = parent && treeAdapter.isElementNode(parent) && treeAdapter.getTagName(parent);
  return parentTn && treeAdapter.getNamespaceURI(parent) === _common_html_js__WEBPACK_IMPORTED_MODULE_1__.NS.HTML && (0,_common_html_js__WEBPACK_IMPORTED_MODULE_1__.hasUnescapedText)(parentTn, options.scriptingEnabled) ? content : (0,entities_lib_escape_js__WEBPACK_IMPORTED_MODULE_2__.escapeText)(content);
}

function serializeCommentNode(node, _ref2) {
  var treeAdapter = _ref2.treeAdapter;
  return "<!--" + treeAdapter.getCommentNodeContent(node) + "-->";
}

function serializeDocumentTypeNode(node, _ref3) {
  var treeAdapter = _ref3.treeAdapter;
  return "<!DOCTYPE " + treeAdapter.getDocumentTypeNodeName(node) + ">";
}

/***/ }),

/***/ "./node_modules/parse5/dist/tokenizer/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/parse5/dist/tokenizer/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Tokenizer": () => (/* binding */ Tokenizer),
/* harmony export */   "TokenizerMode": () => (/* binding */ TokenizerMode)
/* harmony export */ });
/* harmony import */ var _preprocessor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./preprocessor.js */ "./node_modules/parse5/dist/tokenizer/preprocessor.js");
/* harmony import */ var _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/unicode.js */ "./node_modules/parse5/dist/common/unicode.js");
/* harmony import */ var _common_token_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/token.js */ "./node_modules/parse5/dist/common/token.js");
/* harmony import */ var entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! entities/lib/decode.js */ "./node_modules/entities/lib/esm/decode.js");
/* harmony import */ var _common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/error-codes.js */ "./node_modules/parse5/dist/common/error-codes.js");
/* harmony import */ var _common_html_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/html.js */ "./node_modules/parse5/dist/common/html.js");





 //C1 Unicode control character reference replacements

var C1_CONTROLS_REFERENCE_REPLACEMENTS = new Map([[0x80, 8364], [0x82, 8218], [0x83, 402], [0x84, 8222], [0x85, 8230], [0x86, 8224], [0x87, 8225], [0x88, 710], [0x89, 8240], [0x8a, 352], [0x8b, 8249], [0x8c, 338], [0x8e, 381], [0x91, 8216], [0x92, 8217], [0x93, 8220], [0x94, 8221], [0x95, 8226], [0x96, 8211], [0x97, 8212], [0x98, 732], [0x99, 8482], [0x9a, 353], [0x9b, 8250], [0x9c, 339], [0x9e, 382], [0x9f, 376]]); //States

var State;

(function (State) {
  State[State["DATA"] = 0] = "DATA";
  State[State["RCDATA"] = 1] = "RCDATA";
  State[State["RAWTEXT"] = 2] = "RAWTEXT";
  State[State["SCRIPT_DATA"] = 3] = "SCRIPT_DATA";
  State[State["PLAINTEXT"] = 4] = "PLAINTEXT";
  State[State["TAG_OPEN"] = 5] = "TAG_OPEN";
  State[State["END_TAG_OPEN"] = 6] = "END_TAG_OPEN";
  State[State["TAG_NAME"] = 7] = "TAG_NAME";
  State[State["RCDATA_LESS_THAN_SIGN"] = 8] = "RCDATA_LESS_THAN_SIGN";
  State[State["RCDATA_END_TAG_OPEN"] = 9] = "RCDATA_END_TAG_OPEN";
  State[State["RCDATA_END_TAG_NAME"] = 10] = "RCDATA_END_TAG_NAME";
  State[State["RAWTEXT_LESS_THAN_SIGN"] = 11] = "RAWTEXT_LESS_THAN_SIGN";
  State[State["RAWTEXT_END_TAG_OPEN"] = 12] = "RAWTEXT_END_TAG_OPEN";
  State[State["RAWTEXT_END_TAG_NAME"] = 13] = "RAWTEXT_END_TAG_NAME";
  State[State["SCRIPT_DATA_LESS_THAN_SIGN"] = 14] = "SCRIPT_DATA_LESS_THAN_SIGN";
  State[State["SCRIPT_DATA_END_TAG_OPEN"] = 15] = "SCRIPT_DATA_END_TAG_OPEN";
  State[State["SCRIPT_DATA_END_TAG_NAME"] = 16] = "SCRIPT_DATA_END_TAG_NAME";
  State[State["SCRIPT_DATA_ESCAPE_START"] = 17] = "SCRIPT_DATA_ESCAPE_START";
  State[State["SCRIPT_DATA_ESCAPE_START_DASH"] = 18] = "SCRIPT_DATA_ESCAPE_START_DASH";
  State[State["SCRIPT_DATA_ESCAPED"] = 19] = "SCRIPT_DATA_ESCAPED";
  State[State["SCRIPT_DATA_ESCAPED_DASH"] = 20] = "SCRIPT_DATA_ESCAPED_DASH";
  State[State["SCRIPT_DATA_ESCAPED_DASH_DASH"] = 21] = "SCRIPT_DATA_ESCAPED_DASH_DASH";
  State[State["SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN"] = 22] = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN";
  State[State["SCRIPT_DATA_ESCAPED_END_TAG_OPEN"] = 23] = "SCRIPT_DATA_ESCAPED_END_TAG_OPEN";
  State[State["SCRIPT_DATA_ESCAPED_END_TAG_NAME"] = 24] = "SCRIPT_DATA_ESCAPED_END_TAG_NAME";
  State[State["SCRIPT_DATA_DOUBLE_ESCAPE_START"] = 25] = "SCRIPT_DATA_DOUBLE_ESCAPE_START";
  State[State["SCRIPT_DATA_DOUBLE_ESCAPED"] = 26] = "SCRIPT_DATA_DOUBLE_ESCAPED";
  State[State["SCRIPT_DATA_DOUBLE_ESCAPED_DASH"] = 27] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH";
  State[State["SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH"] = 28] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH";
  State[State["SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN"] = 29] = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN";
  State[State["SCRIPT_DATA_DOUBLE_ESCAPE_END"] = 30] = "SCRIPT_DATA_DOUBLE_ESCAPE_END";
  State[State["BEFORE_ATTRIBUTE_NAME"] = 31] = "BEFORE_ATTRIBUTE_NAME";
  State[State["ATTRIBUTE_NAME"] = 32] = "ATTRIBUTE_NAME";
  State[State["AFTER_ATTRIBUTE_NAME"] = 33] = "AFTER_ATTRIBUTE_NAME";
  State[State["BEFORE_ATTRIBUTE_VALUE"] = 34] = "BEFORE_ATTRIBUTE_VALUE";
  State[State["ATTRIBUTE_VALUE_DOUBLE_QUOTED"] = 35] = "ATTRIBUTE_VALUE_DOUBLE_QUOTED";
  State[State["ATTRIBUTE_VALUE_SINGLE_QUOTED"] = 36] = "ATTRIBUTE_VALUE_SINGLE_QUOTED";
  State[State["ATTRIBUTE_VALUE_UNQUOTED"] = 37] = "ATTRIBUTE_VALUE_UNQUOTED";
  State[State["AFTER_ATTRIBUTE_VALUE_QUOTED"] = 38] = "AFTER_ATTRIBUTE_VALUE_QUOTED";
  State[State["SELF_CLOSING_START_TAG"] = 39] = "SELF_CLOSING_START_TAG";
  State[State["BOGUS_COMMENT"] = 40] = "BOGUS_COMMENT";
  State[State["MARKUP_DECLARATION_OPEN"] = 41] = "MARKUP_DECLARATION_OPEN";
  State[State["COMMENT_START"] = 42] = "COMMENT_START";
  State[State["COMMENT_START_DASH"] = 43] = "COMMENT_START_DASH";
  State[State["COMMENT"] = 44] = "COMMENT";
  State[State["COMMENT_LESS_THAN_SIGN"] = 45] = "COMMENT_LESS_THAN_SIGN";
  State[State["COMMENT_LESS_THAN_SIGN_BANG"] = 46] = "COMMENT_LESS_THAN_SIGN_BANG";
  State[State["COMMENT_LESS_THAN_SIGN_BANG_DASH"] = 47] = "COMMENT_LESS_THAN_SIGN_BANG_DASH";
  State[State["COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH"] = 48] = "COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH";
  State[State["COMMENT_END_DASH"] = 49] = "COMMENT_END_DASH";
  State[State["COMMENT_END"] = 50] = "COMMENT_END";
  State[State["COMMENT_END_BANG"] = 51] = "COMMENT_END_BANG";
  State[State["DOCTYPE"] = 52] = "DOCTYPE";
  State[State["BEFORE_DOCTYPE_NAME"] = 53] = "BEFORE_DOCTYPE_NAME";
  State[State["DOCTYPE_NAME"] = 54] = "DOCTYPE_NAME";
  State[State["AFTER_DOCTYPE_NAME"] = 55] = "AFTER_DOCTYPE_NAME";
  State[State["AFTER_DOCTYPE_PUBLIC_KEYWORD"] = 56] = "AFTER_DOCTYPE_PUBLIC_KEYWORD";
  State[State["BEFORE_DOCTYPE_PUBLIC_IDENTIFIER"] = 57] = "BEFORE_DOCTYPE_PUBLIC_IDENTIFIER";
  State[State["DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED"] = 58] = "DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED";
  State[State["DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED"] = 59] = "DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED";
  State[State["AFTER_DOCTYPE_PUBLIC_IDENTIFIER"] = 60] = "AFTER_DOCTYPE_PUBLIC_IDENTIFIER";
  State[State["BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS"] = 61] = "BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS";
  State[State["AFTER_DOCTYPE_SYSTEM_KEYWORD"] = 62] = "AFTER_DOCTYPE_SYSTEM_KEYWORD";
  State[State["BEFORE_DOCTYPE_SYSTEM_IDENTIFIER"] = 63] = "BEFORE_DOCTYPE_SYSTEM_IDENTIFIER";
  State[State["DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED"] = 64] = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED";
  State[State["DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED"] = 65] = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED";
  State[State["AFTER_DOCTYPE_SYSTEM_IDENTIFIER"] = 66] = "AFTER_DOCTYPE_SYSTEM_IDENTIFIER";
  State[State["BOGUS_DOCTYPE"] = 67] = "BOGUS_DOCTYPE";
  State[State["CDATA_SECTION"] = 68] = "CDATA_SECTION";
  State[State["CDATA_SECTION_BRACKET"] = 69] = "CDATA_SECTION_BRACKET";
  State[State["CDATA_SECTION_END"] = 70] = "CDATA_SECTION_END";
  State[State["CHARACTER_REFERENCE"] = 71] = "CHARACTER_REFERENCE";
  State[State["NAMED_CHARACTER_REFERENCE"] = 72] = "NAMED_CHARACTER_REFERENCE";
  State[State["AMBIGUOUS_AMPERSAND"] = 73] = "AMBIGUOUS_AMPERSAND";
  State[State["NUMERIC_CHARACTER_REFERENCE"] = 74] = "NUMERIC_CHARACTER_REFERENCE";
  State[State["HEXADEMICAL_CHARACTER_REFERENCE_START"] = 75] = "HEXADEMICAL_CHARACTER_REFERENCE_START";
  State[State["HEXADEMICAL_CHARACTER_REFERENCE"] = 76] = "HEXADEMICAL_CHARACTER_REFERENCE";
  State[State["DECIMAL_CHARACTER_REFERENCE"] = 77] = "DECIMAL_CHARACTER_REFERENCE";
  State[State["NUMERIC_CHARACTER_REFERENCE_END"] = 78] = "NUMERIC_CHARACTER_REFERENCE_END";
})(State || (State = {})); //Tokenizer initial states for different modes


var TokenizerMode = {
  DATA: State.DATA,
  RCDATA: State.RCDATA,
  RAWTEXT: State.RAWTEXT,
  SCRIPT_DATA: State.SCRIPT_DATA,
  PLAINTEXT: State.PLAINTEXT,
  CDATA_SECTION: State.CDATA_SECTION
}; //Utils
//OPTIMIZATION: these utility functions should not be moved out of this module. V8 Crankshaft will not inline
//this functions if they will be situated in another module due to context switch.
//Always perform inlining check before modifying this functions ('node --trace-inlining').

function isAsciiDigit(cp) {
  return cp >= _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.DIGIT_0 && cp <= _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.DIGIT_9;
}

function isAsciiUpper(cp) {
  return cp >= _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LATIN_CAPITAL_A && cp <= _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LATIN_CAPITAL_Z;
}

function isAsciiLower(cp) {
  return cp >= _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LATIN_SMALL_A && cp <= _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LATIN_SMALL_Z;
}

function isAsciiLetter(cp) {
  return isAsciiLower(cp) || isAsciiUpper(cp);
}

function isAsciiAlphaNumeric(cp) {
  return isAsciiLetter(cp) || isAsciiDigit(cp);
}

function isAsciiUpperHexDigit(cp) {
  return cp >= _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LATIN_CAPITAL_A && cp <= _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LATIN_CAPITAL_F;
}

function isAsciiLowerHexDigit(cp) {
  return cp >= _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LATIN_SMALL_A && cp <= _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LATIN_SMALL_F;
}

function isAsciiHexDigit(cp) {
  return isAsciiDigit(cp) || isAsciiUpperHexDigit(cp) || isAsciiLowerHexDigit(cp);
}

function toAsciiLower(cp) {
  return cp + 32;
}

function isWhitespace(cp) {
  return cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE || cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED || cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION || cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED;
}

function isEntityInAttributeInvalidEnd(nextCp) {
  return nextCp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EQUALS_SIGN || isAsciiAlphaNumeric(nextCp);
}

function isScriptDataDoubleEscapeSequenceEnd(cp) {
  return isWhitespace(cp) || cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS || cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN;
} //Tokenizer


var Tokenizer = /*#__PURE__*/function () {
  function Tokenizer(options, handler) {
    this.options = options;
    this.handler = handler;
    this.paused = false;
    /** Ensures that the parsing loop isn't run multiple times at once. */

    this.inLoop = false;
    /**
     * Indicates that the current adjusted node exists, is not an element in the HTML namespace,
     * and that it is not an integration point for either MathML or HTML.
     *
     * @see {@link https://html.spec.whatwg.org/multipage/parsing.html#tree-construction}
     */

    this.inForeignNode = false;
    this.lastStartTagName = '';
    this.active = false;
    this.state = State.DATA;
    this.returnState = State.DATA;
    this.charRefCode = -1;
    this.consumedAfterSnapshot = -1;
    this.currentCharacterToken = null;
    this.currentToken = null;
    this.currentAttr = {
      name: '',
      value: ''
    };
    this.preprocessor = new _preprocessor_js__WEBPACK_IMPORTED_MODULE_0__.Preprocessor(handler);
    this.currentLocation = this.getCurrentLocation(-1);
  } //Errors


  var _proto = Tokenizer.prototype;

  _proto._err = function _err(code) {
    var _a, _b;

    (_b = (_a = this.handler).onParseError) === null || _b === void 0 ? void 0 : _b.call(_a, this.preprocessor.getError(code));
  } // NOTE: `offset` may never run across line boundaries.
  ;

  _proto.getCurrentLocation = function getCurrentLocation(offset) {
    if (!this.options.sourceCodeLocationInfo) {
      return null;
    }

    return {
      startLine: this.preprocessor.line,
      startCol: this.preprocessor.col - offset,
      startOffset: this.preprocessor.offset - offset,
      endLine: -1,
      endCol: -1,
      endOffset: -1
    };
  };

  _proto._runParsingLoop = function _runParsingLoop() {
    if (this.inLoop) return;
    this.inLoop = true;

    while (this.active && !this.paused) {
      this.consumedAfterSnapshot = 0;

      var cp = this._consume();

      if (!this._ensureHibernation()) {
        this._callState(cp);
      }
    }

    this.inLoop = false;
  } //API
  ;

  _proto.pause = function pause() {
    this.paused = true;
  };

  _proto.resume = function resume(writeCallback) {
    if (!this.paused) {
      throw new Error('Parser was already resumed');
    }

    this.paused = false; // Necessary for synchronous resume.

    if (this.inLoop) return;

    this._runParsingLoop();

    if (!this.paused) {
      writeCallback === null || writeCallback === void 0 ? void 0 : writeCallback();
    }
  };

  _proto.write = function write(chunk, isLastChunk, writeCallback) {
    this.active = true;
    this.preprocessor.write(chunk, isLastChunk);

    this._runParsingLoop();

    if (!this.paused) {
      writeCallback === null || writeCallback === void 0 ? void 0 : writeCallback();
    }
  };

  _proto.insertHtmlAtCurrentPos = function insertHtmlAtCurrentPos(chunk) {
    this.active = true;
    this.preprocessor.insertHtmlAtCurrentPos(chunk);

    this._runParsingLoop();
  } //Hibernation
  ;

  _proto._ensureHibernation = function _ensureHibernation() {
    if (this.preprocessor.endOfChunkHit) {
      this._unconsume(this.consumedAfterSnapshot);

      this.active = false;
      return true;
    }

    return false;
  } //Consumption
  ;

  _proto._consume = function _consume() {
    this.consumedAfterSnapshot++;
    return this.preprocessor.advance();
  };

  _proto._unconsume = function _unconsume(count) {
    this.consumedAfterSnapshot -= count;
    this.preprocessor.retreat(count);
  };

  _proto._reconsumeInState = function _reconsumeInState(state, cp) {
    this.state = state;

    this._callState(cp);
  };

  _proto._advanceBy = function _advanceBy(count) {
    this.consumedAfterSnapshot += count;

    for (var i = 0; i < count; i++) {
      this.preprocessor.advance();
    }
  };

  _proto._consumeSequenceIfMatch = function _consumeSequenceIfMatch(pattern, caseSensitive) {
    if (this.preprocessor.startsWith(pattern, caseSensitive)) {
      // We will already have consumed one character before calling this method.
      this._advanceBy(pattern.length - 1);

      return true;
    }

    return false;
  } //Token creation
  ;

  _proto._createStartTagToken = function _createStartTagToken() {
    this.currentToken = {
      type: _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.START_TAG,
      tagName: '',
      tagID: _common_html_js__WEBPACK_IMPORTED_MODULE_5__.TAG_ID.UNKNOWN,
      selfClosing: false,
      ackSelfClosing: false,
      attrs: [],
      location: this.getCurrentLocation(1)
    };
  };

  _proto._createEndTagToken = function _createEndTagToken() {
    this.currentToken = {
      type: _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.END_TAG,
      tagName: '',
      tagID: _common_html_js__WEBPACK_IMPORTED_MODULE_5__.TAG_ID.UNKNOWN,
      selfClosing: false,
      ackSelfClosing: false,
      attrs: [],
      location: this.getCurrentLocation(2)
    };
  };

  _proto._createCommentToken = function _createCommentToken(offset) {
    this.currentToken = {
      type: _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.COMMENT,
      data: '',
      location: this.getCurrentLocation(offset)
    };
  };

  _proto._createDoctypeToken = function _createDoctypeToken(initialName) {
    this.currentToken = {
      type: _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.DOCTYPE,
      name: initialName,
      forceQuirks: false,
      publicId: null,
      systemId: null,
      location: this.currentLocation
    };
  };

  _proto._createCharacterToken = function _createCharacterToken(type, chars) {
    this.currentCharacterToken = {
      type: type,
      chars: chars,
      location: this.currentLocation
    };
  } //Tag attributes
  ;

  _proto._createAttr = function _createAttr(attrNameFirstCh) {
    this.currentAttr = {
      name: attrNameFirstCh,
      value: ''
    };
    this.currentLocation = this.getCurrentLocation(0);
  };

  _proto._leaveAttrName = function _leaveAttrName() {
    var _a;

    var _b;

    var token = this.currentToken;

    if ((0,_common_token_js__WEBPACK_IMPORTED_MODULE_2__.getTokenAttr)(token, this.currentAttr.name) === null) {
      token.attrs.push(this.currentAttr);

      if (token.location && this.currentLocation) {
        var attrLocations = (_a = (_b = token.location).attrs) !== null && _a !== void 0 ? _a : _b.attrs = Object.create(null);
        attrLocations[this.currentAttr.name] = this.currentLocation; // Set end location

        this._leaveAttrValue();
      }
    } else {
      this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.duplicateAttribute);
    }
  };

  _proto._leaveAttrValue = function _leaveAttrValue() {
    if (this.currentLocation) {
      this.currentLocation.endLine = this.preprocessor.line;
      this.currentLocation.endCol = this.preprocessor.col;
      this.currentLocation.endOffset = this.preprocessor.offset;
    }
  } //Token emission
  ;

  _proto.prepareToken = function prepareToken(ct) {
    this._emitCurrentCharacterToken(ct.location);

    this.currentToken = null;

    if (ct.location) {
      ct.location.endLine = this.preprocessor.line;
      ct.location.endCol = this.preprocessor.col + 1;
      ct.location.endOffset = this.preprocessor.offset + 1;
    }

    this.currentLocation = this.getCurrentLocation(-1);
  };

  _proto.emitCurrentTagToken = function emitCurrentTagToken() {
    var ct = this.currentToken;
    this.prepareToken(ct);
    ct.tagID = (0,_common_html_js__WEBPACK_IMPORTED_MODULE_5__.getTagID)(ct.tagName);

    if (ct.type === _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.START_TAG) {
      this.lastStartTagName = ct.tagName;
      this.handler.onStartTag(ct);
    } else {
      if (ct.attrs.length > 0) {
        this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.endTagWithAttributes);
      }

      if (ct.selfClosing) {
        this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.endTagWithTrailingSolidus);
      }

      this.handler.onEndTag(ct);
    }

    this.preprocessor.dropParsedChunk();
  };

  _proto.emitCurrentComment = function emitCurrentComment(ct) {
    this.prepareToken(ct);
    this.handler.onComment(ct);
    this.preprocessor.dropParsedChunk();
  };

  _proto.emitCurrentDoctype = function emitCurrentDoctype(ct) {
    this.prepareToken(ct);
    this.handler.onDoctype(ct);
    this.preprocessor.dropParsedChunk();
  };

  _proto._emitCurrentCharacterToken = function _emitCurrentCharacterToken(nextLocation) {
    if (this.currentCharacterToken) {
      //NOTE: if we have a pending character token, make it's end location equal to the
      //current token's start location.
      if (nextLocation && this.currentCharacterToken.location) {
        this.currentCharacterToken.location.endLine = nextLocation.startLine;
        this.currentCharacterToken.location.endCol = nextLocation.startCol;
        this.currentCharacterToken.location.endOffset = nextLocation.startOffset;
      }

      switch (this.currentCharacterToken.type) {
        case _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.CHARACTER:
          {
            this.handler.onCharacter(this.currentCharacterToken);
            break;
          }

        case _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.NULL_CHARACTER:
          {
            this.handler.onNullCharacter(this.currentCharacterToken);
            break;
          }

        case _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.WHITESPACE_CHARACTER:
          {
            this.handler.onWhitespaceCharacter(this.currentCharacterToken);
            break;
          }
      }

      this.currentCharacterToken = null;
    }
  };

  _proto._emitEOFToken = function _emitEOFToken() {
    var location = this.getCurrentLocation(0);

    if (location) {
      location.endLine = location.startLine;
      location.endCol = location.startCol;
      location.endOffset = location.startOffset;
    }

    this._emitCurrentCharacterToken(location);

    this.handler.onEof({
      type: _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.EOF,
      location: location
    });
    this.active = false;
  } //Characters emission
  //OPTIMIZATION: specification uses only one type of character tokens (one token per character).
  //This causes a huge memory overhead and a lot of unnecessary parser loops. parse5 uses 3 groups of characters.
  //If we have a sequence of characters that belong to the same group, the parser can process it
  //as a single solid character token.
  //So, there are 3 types of character tokens in parse5:
  //1)TokenType.NULL_CHARACTER - \u0000-character sequences (e.g. '\u0000\u0000\u0000')
  //2)TokenType.WHITESPACE_CHARACTER - any whitespace/new-line character sequences (e.g. '\n  \r\t   \f')
  //3)TokenType.CHARACTER - any character sequence which don't belong to groups 1 and 2 (e.g. 'abcdef1234@@#$%^')
  ;

  _proto._appendCharToCurrentCharacterToken = function _appendCharToCurrentCharacterToken(type, ch) {
    if (this.currentCharacterToken) {
      if (this.currentCharacterToken.type !== type) {
        this.currentLocation = this.getCurrentLocation(0);

        this._emitCurrentCharacterToken(this.currentLocation);

        this.preprocessor.dropParsedChunk();
      } else {
        this.currentCharacterToken.chars += ch;
        return;
      }
    }

    this._createCharacterToken(type, ch);
  };

  _proto._emitCodePoint = function _emitCodePoint(cp) {
    var type = isWhitespace(cp) ? _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.WHITESPACE_CHARACTER : cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL ? _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.NULL_CHARACTER : _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.CHARACTER;

    this._appendCharToCurrentCharacterToken(type, String.fromCodePoint(cp));
  } //NOTE: used when we emit characters explicitly.
  //This is always for non-whitespace and non-null characters, which allows us to avoid additional checks.
  ;

  _proto._emitChars = function _emitChars(ch) {
    this._appendCharToCurrentCharacterToken(_common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.CHARACTER, ch);
  } // Character reference helpers
  ;

  _proto._matchNamedCharacterReference = function _matchNamedCharacterReference(cp) {
    var result = null;
    var excess = 0;
    var withoutSemicolon = false;

    for (var i = 0, current = entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__.htmlDecodeTree[0]; i >= 0; cp = this._consume()) {
      i = (0,entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__.determineBranch)(entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__.htmlDecodeTree, current, i + 1, cp);
      if (i < 0) break;
      excess += 1;
      current = entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__.htmlDecodeTree[i];
      var masked = current & entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__.BinTrieFlags.VALUE_LENGTH; // If the branch is a value, store it and continue

      if (masked) {
        // The mask is the number of bytes of the value, including the current byte.
        var valueLength = (masked >> 14) - 1; // Attribute values that aren't terminated properly aren't parsed, and shouldn't lead to a parser error.
        // See the example in https://html.spec.whatwg.org/multipage/parsing.html#named-character-reference-state

        if (cp !== _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SEMICOLON && this._isCharacterReferenceInAttribute() && isEntityInAttributeInvalidEnd(this.preprocessor.peek(1))) {
          //NOTE: we don't flush all consumed code points here, and instead switch back to the original state after
          //emitting an ampersand. This is fine, as alphanumeric characters won't be parsed differently in attributes.
          result = [_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.AMPERSAND]; // Skip over the value.

          i += valueLength;
        } else {
          // If this is a surrogate pair, consume the next two bytes.
          result = valueLength === 0 ? [entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__.htmlDecodeTree[i] & ~entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__.BinTrieFlags.VALUE_LENGTH] : valueLength === 1 ? [entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__.htmlDecodeTree[++i]] : [entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__.htmlDecodeTree[++i], entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__.htmlDecodeTree[++i]];
          excess = 0;
          withoutSemicolon = cp !== _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SEMICOLON;
        }

        if (valueLength === 0) {
          // If the value is zero-length, we're done.
          this._consume();

          break;
        }
      }
    }

    this._unconsume(excess);

    if (withoutSemicolon && !this.preprocessor.endOfChunkHit) {
      this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingSemicolonAfterCharacterReference);
    } // We want to emit the error above on the code point after the entity.
    // We always consume one code point too many in the loop, and we wait to
    // unconsume it until after the error is emitted.


    this._unconsume(1);

    return result;
  };

  _proto._isCharacterReferenceInAttribute = function _isCharacterReferenceInAttribute() {
    return this.returnState === State.ATTRIBUTE_VALUE_DOUBLE_QUOTED || this.returnState === State.ATTRIBUTE_VALUE_SINGLE_QUOTED || this.returnState === State.ATTRIBUTE_VALUE_UNQUOTED;
  };

  _proto._flushCodePointConsumedAsCharacterReference = function _flushCodePointConsumedAsCharacterReference(cp) {
    if (this._isCharacterReferenceInAttribute()) {
      this.currentAttr.value += String.fromCodePoint(cp);
    } else {
      this._emitCodePoint(cp);
    }
  } // Calling states this way turns out to be much faster than any other approach.
  ;

  _proto._callState = function _callState(cp) {
    switch (this.state) {
      case State.DATA:
        {
          this._stateData(cp);

          break;
        }

      case State.RCDATA:
        {
          this._stateRcdata(cp);

          break;
        }

      case State.RAWTEXT:
        {
          this._stateRawtext(cp);

          break;
        }

      case State.SCRIPT_DATA:
        {
          this._stateScriptData(cp);

          break;
        }

      case State.PLAINTEXT:
        {
          this._statePlaintext(cp);

          break;
        }

      case State.TAG_OPEN:
        {
          this._stateTagOpen(cp);

          break;
        }

      case State.END_TAG_OPEN:
        {
          this._stateEndTagOpen(cp);

          break;
        }

      case State.TAG_NAME:
        {
          this._stateTagName(cp);

          break;
        }

      case State.RCDATA_LESS_THAN_SIGN:
        {
          this._stateRcdataLessThanSign(cp);

          break;
        }

      case State.RCDATA_END_TAG_OPEN:
        {
          this._stateRcdataEndTagOpen(cp);

          break;
        }

      case State.RCDATA_END_TAG_NAME:
        {
          this._stateRcdataEndTagName(cp);

          break;
        }

      case State.RAWTEXT_LESS_THAN_SIGN:
        {
          this._stateRawtextLessThanSign(cp);

          break;
        }

      case State.RAWTEXT_END_TAG_OPEN:
        {
          this._stateRawtextEndTagOpen(cp);

          break;
        }

      case State.RAWTEXT_END_TAG_NAME:
        {
          this._stateRawtextEndTagName(cp);

          break;
        }

      case State.SCRIPT_DATA_LESS_THAN_SIGN:
        {
          this._stateScriptDataLessThanSign(cp);

          break;
        }

      case State.SCRIPT_DATA_END_TAG_OPEN:
        {
          this._stateScriptDataEndTagOpen(cp);

          break;
        }

      case State.SCRIPT_DATA_END_TAG_NAME:
        {
          this._stateScriptDataEndTagName(cp);

          break;
        }

      case State.SCRIPT_DATA_ESCAPE_START:
        {
          this._stateScriptDataEscapeStart(cp);

          break;
        }

      case State.SCRIPT_DATA_ESCAPE_START_DASH:
        {
          this._stateScriptDataEscapeStartDash(cp);

          break;
        }

      case State.SCRIPT_DATA_ESCAPED:
        {
          this._stateScriptDataEscaped(cp);

          break;
        }

      case State.SCRIPT_DATA_ESCAPED_DASH:
        {
          this._stateScriptDataEscapedDash(cp);

          break;
        }

      case State.SCRIPT_DATA_ESCAPED_DASH_DASH:
        {
          this._stateScriptDataEscapedDashDash(cp);

          break;
        }

      case State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN:
        {
          this._stateScriptDataEscapedLessThanSign(cp);

          break;
        }

      case State.SCRIPT_DATA_ESCAPED_END_TAG_OPEN:
        {
          this._stateScriptDataEscapedEndTagOpen(cp);

          break;
        }

      case State.SCRIPT_DATA_ESCAPED_END_TAG_NAME:
        {
          this._stateScriptDataEscapedEndTagName(cp);

          break;
        }

      case State.SCRIPT_DATA_DOUBLE_ESCAPE_START:
        {
          this._stateScriptDataDoubleEscapeStart(cp);

          break;
        }

      case State.SCRIPT_DATA_DOUBLE_ESCAPED:
        {
          this._stateScriptDataDoubleEscaped(cp);

          break;
        }

      case State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH:
        {
          this._stateScriptDataDoubleEscapedDash(cp);

          break;
        }

      case State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH:
        {
          this._stateScriptDataDoubleEscapedDashDash(cp);

          break;
        }

      case State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN:
        {
          this._stateScriptDataDoubleEscapedLessThanSign(cp);

          break;
        }

      case State.SCRIPT_DATA_DOUBLE_ESCAPE_END:
        {
          this._stateScriptDataDoubleEscapeEnd(cp);

          break;
        }

      case State.BEFORE_ATTRIBUTE_NAME:
        {
          this._stateBeforeAttributeName(cp);

          break;
        }

      case State.ATTRIBUTE_NAME:
        {
          this._stateAttributeName(cp);

          break;
        }

      case State.AFTER_ATTRIBUTE_NAME:
        {
          this._stateAfterAttributeName(cp);

          break;
        }

      case State.BEFORE_ATTRIBUTE_VALUE:
        {
          this._stateBeforeAttributeValue(cp);

          break;
        }

      case State.ATTRIBUTE_VALUE_DOUBLE_QUOTED:
        {
          this._stateAttributeValueDoubleQuoted(cp);

          break;
        }

      case State.ATTRIBUTE_VALUE_SINGLE_QUOTED:
        {
          this._stateAttributeValueSingleQuoted(cp);

          break;
        }

      case State.ATTRIBUTE_VALUE_UNQUOTED:
        {
          this._stateAttributeValueUnquoted(cp);

          break;
        }

      case State.AFTER_ATTRIBUTE_VALUE_QUOTED:
        {
          this._stateAfterAttributeValueQuoted(cp);

          break;
        }

      case State.SELF_CLOSING_START_TAG:
        {
          this._stateSelfClosingStartTag(cp);

          break;
        }

      case State.BOGUS_COMMENT:
        {
          this._stateBogusComment(cp);

          break;
        }

      case State.MARKUP_DECLARATION_OPEN:
        {
          this._stateMarkupDeclarationOpen(cp);

          break;
        }

      case State.COMMENT_START:
        {
          this._stateCommentStart(cp);

          break;
        }

      case State.COMMENT_START_DASH:
        {
          this._stateCommentStartDash(cp);

          break;
        }

      case State.COMMENT:
        {
          this._stateComment(cp);

          break;
        }

      case State.COMMENT_LESS_THAN_SIGN:
        {
          this._stateCommentLessThanSign(cp);

          break;
        }

      case State.COMMENT_LESS_THAN_SIGN_BANG:
        {
          this._stateCommentLessThanSignBang(cp);

          break;
        }

      case State.COMMENT_LESS_THAN_SIGN_BANG_DASH:
        {
          this._stateCommentLessThanSignBangDash(cp);

          break;
        }

      case State.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH:
        {
          this._stateCommentLessThanSignBangDashDash(cp);

          break;
        }

      case State.COMMENT_END_DASH:
        {
          this._stateCommentEndDash(cp);

          break;
        }

      case State.COMMENT_END:
        {
          this._stateCommentEnd(cp);

          break;
        }

      case State.COMMENT_END_BANG:
        {
          this._stateCommentEndBang(cp);

          break;
        }

      case State.DOCTYPE:
        {
          this._stateDoctype(cp);

          break;
        }

      case State.BEFORE_DOCTYPE_NAME:
        {
          this._stateBeforeDoctypeName(cp);

          break;
        }

      case State.DOCTYPE_NAME:
        {
          this._stateDoctypeName(cp);

          break;
        }

      case State.AFTER_DOCTYPE_NAME:
        {
          this._stateAfterDoctypeName(cp);

          break;
        }

      case State.AFTER_DOCTYPE_PUBLIC_KEYWORD:
        {
          this._stateAfterDoctypePublicKeyword(cp);

          break;
        }

      case State.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER:
        {
          this._stateBeforeDoctypePublicIdentifier(cp);

          break;
        }

      case State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED:
        {
          this._stateDoctypePublicIdentifierDoubleQuoted(cp);

          break;
        }

      case State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED:
        {
          this._stateDoctypePublicIdentifierSingleQuoted(cp);

          break;
        }

      case State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER:
        {
          this._stateAfterDoctypePublicIdentifier(cp);

          break;
        }

      case State.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS:
        {
          this._stateBetweenDoctypePublicAndSystemIdentifiers(cp);

          break;
        }

      case State.AFTER_DOCTYPE_SYSTEM_KEYWORD:
        {
          this._stateAfterDoctypeSystemKeyword(cp);

          break;
        }

      case State.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER:
        {
          this._stateBeforeDoctypeSystemIdentifier(cp);

          break;
        }

      case State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED:
        {
          this._stateDoctypeSystemIdentifierDoubleQuoted(cp);

          break;
        }

      case State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED:
        {
          this._stateDoctypeSystemIdentifierSingleQuoted(cp);

          break;
        }

      case State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER:
        {
          this._stateAfterDoctypeSystemIdentifier(cp);

          break;
        }

      case State.BOGUS_DOCTYPE:
        {
          this._stateBogusDoctype(cp);

          break;
        }

      case State.CDATA_SECTION:
        {
          this._stateCdataSection(cp);

          break;
        }

      case State.CDATA_SECTION_BRACKET:
        {
          this._stateCdataSectionBracket(cp);

          break;
        }

      case State.CDATA_SECTION_END:
        {
          this._stateCdataSectionEnd(cp);

          break;
        }

      case State.CHARACTER_REFERENCE:
        {
          this._stateCharacterReference(cp);

          break;
        }

      case State.NAMED_CHARACTER_REFERENCE:
        {
          this._stateNamedCharacterReference(cp);

          break;
        }

      case State.AMBIGUOUS_AMPERSAND:
        {
          this._stateAmbiguousAmpersand(cp);

          break;
        }

      case State.NUMERIC_CHARACTER_REFERENCE:
        {
          this._stateNumericCharacterReference(cp);

          break;
        }

      case State.HEXADEMICAL_CHARACTER_REFERENCE_START:
        {
          this._stateHexademicalCharacterReferenceStart(cp);

          break;
        }

      case State.HEXADEMICAL_CHARACTER_REFERENCE:
        {
          this._stateHexademicalCharacterReference(cp);

          break;
        }

      case State.DECIMAL_CHARACTER_REFERENCE:
        {
          this._stateDecimalCharacterReference(cp);

          break;
        }

      case State.NUMERIC_CHARACTER_REFERENCE_END:
        {
          this._stateNumericCharacterReferenceEnd(cp);

          break;
        }

      default:
        {
          throw new Error('Unknown state');
        }
    }
  } // State machine
  // Data state
  //------------------------------------------------------------------
  ;

  _proto._stateData = function _stateData(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN:
        {
          this.state = State.TAG_OPEN;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.AMPERSAND:
        {
          this.returnState = State.DATA;
          this.state = State.CHARACTER_REFERENCE;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          this._emitCodePoint(cp);

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._emitEOFToken();

          break;
        }

      default:
        {
          this._emitCodePoint(cp);
        }
    }
  } //  RCDATA state
  //------------------------------------------------------------------
  ;

  _proto._stateRcdata = function _stateRcdata(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.AMPERSAND:
        {
          this.returnState = State.RCDATA;
          this.state = State.CHARACTER_REFERENCE;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN:
        {
          this.state = State.RCDATA_LESS_THAN_SIGN;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          this._emitChars(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._emitEOFToken();

          break;
        }

      default:
        {
          this._emitCodePoint(cp);
        }
    }
  } // RAWTEXT state
  //------------------------------------------------------------------
  ;

  _proto._stateRawtext = function _stateRawtext(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN:
        {
          this.state = State.RAWTEXT_LESS_THAN_SIGN;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          this._emitChars(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._emitEOFToken();

          break;
        }

      default:
        {
          this._emitCodePoint(cp);
        }
    }
  } // Script data state
  //------------------------------------------------------------------
  ;

  _proto._stateScriptData = function _stateScriptData(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN:
        {
          this.state = State.SCRIPT_DATA_LESS_THAN_SIGN;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          this._emitChars(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._emitEOFToken();

          break;
        }

      default:
        {
          this._emitCodePoint(cp);
        }
    }
  } // PLAINTEXT state
  //------------------------------------------------------------------
  ;

  _proto._statePlaintext = function _statePlaintext(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          this._emitChars(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._emitEOFToken();

          break;
        }

      default:
        {
          this._emitCodePoint(cp);
        }
    }
  } // Tag open state
  //------------------------------------------------------------------
  ;

  _proto._stateTagOpen = function _stateTagOpen(cp) {
    if (isAsciiLetter(cp)) {
      this._createStartTagToken();

      this.state = State.TAG_NAME;

      this._stateTagName(cp);
    } else switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EXCLAMATION_MARK:
        {
          this.state = State.MARKUP_DECLARATION_OPEN;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS:
        {
          this.state = State.END_TAG_OPEN;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUESTION_MARK:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedQuestionMarkInsteadOfTagName);

          this._createCommentToken(1);

          this.state = State.BOGUS_COMMENT;

          this._stateBogusComment(cp);

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofBeforeTagName);

          this._emitChars('<');

          this._emitEOFToken();

          break;
        }

      default:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.invalidFirstCharacterOfTagName);

          this._emitChars('<');

          this.state = State.DATA;

          this._stateData(cp);
        }
    }
  } // End tag open state
  //------------------------------------------------------------------
  ;

  _proto._stateEndTagOpen = function _stateEndTagOpen(cp) {
    if (isAsciiLetter(cp)) {
      this._createEndTagToken();

      this.state = State.TAG_NAME;

      this._stateTagName(cp);
    } else switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingEndTagName);

          this.state = State.DATA;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofBeforeTagName);

          this._emitChars('</');

          this._emitEOFToken();

          break;
        }

      default:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.invalidFirstCharacterOfTagName);

          this._createCommentToken(2);

          this.state = State.BOGUS_COMMENT;

          this._stateBogusComment(cp);
        }
    }
  } // Tag name state
  //------------------------------------------------------------------
  ;

  _proto._stateTagName = function _stateTagName(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED:
        {
          this.state = State.BEFORE_ATTRIBUTE_NAME;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS:
        {
          this.state = State.SELF_CLOSING_START_TAG;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this.state = State.DATA;
          this.emitCurrentTagToken();
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          token.tagName += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInTag);

          this._emitEOFToken();

          break;
        }

      default:
        {
          token.tagName += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
        }
    }
  } // RCDATA less-than sign state
  //------------------------------------------------------------------
  ;

  _proto._stateRcdataLessThanSign = function _stateRcdataLessThanSign(cp) {
    if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS) {
      this.state = State.RCDATA_END_TAG_OPEN;
    } else {
      this._emitChars('<');

      this.state = State.RCDATA;

      this._stateRcdata(cp);
    }
  } // RCDATA end tag open state
  //------------------------------------------------------------------
  ;

  _proto._stateRcdataEndTagOpen = function _stateRcdataEndTagOpen(cp) {
    if (isAsciiLetter(cp)) {
      this.state = State.RCDATA_END_TAG_NAME;

      this._stateRcdataEndTagName(cp);
    } else {
      this._emitChars('</');

      this.state = State.RCDATA;

      this._stateRcdata(cp);
    }
  };

  _proto.handleSpecialEndTag = function handleSpecialEndTag(_cp) {
    if (!this.preprocessor.startsWith(this.lastStartTagName, false)) {
      return !this._ensureHibernation();
    }

    this._createEndTagToken();

    var token = this.currentToken;
    token.tagName = this.lastStartTagName;
    var cp = this.preprocessor.peek(this.lastStartTagName.length);

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED:
        {
          this._advanceBy(this.lastStartTagName.length);

          this.state = State.BEFORE_ATTRIBUTE_NAME;
          return false;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS:
        {
          this._advanceBy(this.lastStartTagName.length);

          this.state = State.SELF_CLOSING_START_TAG;
          return false;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this._advanceBy(this.lastStartTagName.length);

          this.emitCurrentTagToken();
          this.state = State.DATA;
          return false;
        }

      default:
        {
          return !this._ensureHibernation();
        }
    }
  } // RCDATA end tag name state
  //------------------------------------------------------------------
  ;

  _proto._stateRcdataEndTagName = function _stateRcdataEndTagName(cp) {
    if (this.handleSpecialEndTag(cp)) {
      this._emitChars('</');

      this.state = State.RCDATA;

      this._stateRcdata(cp);
    }
  } // RAWTEXT less-than sign state
  //------------------------------------------------------------------
  ;

  _proto._stateRawtextLessThanSign = function _stateRawtextLessThanSign(cp) {
    if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS) {
      this.state = State.RAWTEXT_END_TAG_OPEN;
    } else {
      this._emitChars('<');

      this.state = State.RAWTEXT;

      this._stateRawtext(cp);
    }
  } // RAWTEXT end tag open state
  //------------------------------------------------------------------
  ;

  _proto._stateRawtextEndTagOpen = function _stateRawtextEndTagOpen(cp) {
    if (isAsciiLetter(cp)) {
      this.state = State.RAWTEXT_END_TAG_NAME;

      this._stateRawtextEndTagName(cp);
    } else {
      this._emitChars('</');

      this.state = State.RAWTEXT;

      this._stateRawtext(cp);
    }
  } // RAWTEXT end tag name state
  //------------------------------------------------------------------
  ;

  _proto._stateRawtextEndTagName = function _stateRawtextEndTagName(cp) {
    if (this.handleSpecialEndTag(cp)) {
      this._emitChars('</');

      this.state = State.RAWTEXT;

      this._stateRawtext(cp);
    }
  } // Script data less-than sign state
  //------------------------------------------------------------------
  ;

  _proto._stateScriptDataLessThanSign = function _stateScriptDataLessThanSign(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS:
        {
          this.state = State.SCRIPT_DATA_END_TAG_OPEN;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EXCLAMATION_MARK:
        {
          this.state = State.SCRIPT_DATA_ESCAPE_START;

          this._emitChars('<!');

          break;
        }

      default:
        {
          this._emitChars('<');

          this.state = State.SCRIPT_DATA;

          this._stateScriptData(cp);
        }
    }
  } // Script data end tag open state
  //------------------------------------------------------------------
  ;

  _proto._stateScriptDataEndTagOpen = function _stateScriptDataEndTagOpen(cp) {
    if (isAsciiLetter(cp)) {
      this.state = State.SCRIPT_DATA_END_TAG_NAME;

      this._stateScriptDataEndTagName(cp);
    } else {
      this._emitChars('</');

      this.state = State.SCRIPT_DATA;

      this._stateScriptData(cp);
    }
  } // Script data end tag name state
  //------------------------------------------------------------------
  ;

  _proto._stateScriptDataEndTagName = function _stateScriptDataEndTagName(cp) {
    if (this.handleSpecialEndTag(cp)) {
      this._emitChars('</');

      this.state = State.SCRIPT_DATA;

      this._stateScriptData(cp);
    }
  } // Script data escape start state
  //------------------------------------------------------------------
  ;

  _proto._stateScriptDataEscapeStart = function _stateScriptDataEscapeStart(cp) {
    if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS) {
      this.state = State.SCRIPT_DATA_ESCAPE_START_DASH;

      this._emitChars('-');
    } else {
      this.state = State.SCRIPT_DATA;

      this._stateScriptData(cp);
    }
  } // Script data escape start dash state
  //------------------------------------------------------------------
  ;

  _proto._stateScriptDataEscapeStartDash = function _stateScriptDataEscapeStartDash(cp) {
    if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS) {
      this.state = State.SCRIPT_DATA_ESCAPED_DASH_DASH;

      this._emitChars('-');
    } else {
      this.state = State.SCRIPT_DATA;

      this._stateScriptData(cp);
    }
  } // Script data escaped state
  //------------------------------------------------------------------
  ;

  _proto._stateScriptDataEscaped = function _stateScriptDataEscaped(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS:
        {
          this.state = State.SCRIPT_DATA_ESCAPED_DASH;

          this._emitChars('-');

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN:
        {
          this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          this._emitChars(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInScriptHtmlCommentLikeText);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this._emitCodePoint(cp);
        }
    }
  } // Script data escaped dash state
  //------------------------------------------------------------------
  ;

  _proto._stateScriptDataEscapedDash = function _stateScriptDataEscapedDash(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS:
        {
          this.state = State.SCRIPT_DATA_ESCAPED_DASH_DASH;

          this._emitChars('-');

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN:
        {
          this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          this.state = State.SCRIPT_DATA_ESCAPED;

          this._emitChars(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInScriptHtmlCommentLikeText);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this.state = State.SCRIPT_DATA_ESCAPED;

          this._emitCodePoint(cp);
        }
    }
  } // Script data escaped dash dash state
  //------------------------------------------------------------------
  ;

  _proto._stateScriptDataEscapedDashDash = function _stateScriptDataEscapedDashDash(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS:
        {
          this._emitChars('-');

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN:
        {
          this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this.state = State.SCRIPT_DATA;

          this._emitChars('>');

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          this.state = State.SCRIPT_DATA_ESCAPED;

          this._emitChars(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInScriptHtmlCommentLikeText);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this.state = State.SCRIPT_DATA_ESCAPED;

          this._emitCodePoint(cp);
        }
    }
  } // Script data escaped less-than sign state
  //------------------------------------------------------------------
  ;

  _proto._stateScriptDataEscapedLessThanSign = function _stateScriptDataEscapedLessThanSign(cp) {
    if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS) {
      this.state = State.SCRIPT_DATA_ESCAPED_END_TAG_OPEN;
    } else if (isAsciiLetter(cp)) {
      this._emitChars('<');

      this.state = State.SCRIPT_DATA_DOUBLE_ESCAPE_START;

      this._stateScriptDataDoubleEscapeStart(cp);
    } else {
      this._emitChars('<');

      this.state = State.SCRIPT_DATA_ESCAPED;

      this._stateScriptDataEscaped(cp);
    }
  } // Script data escaped end tag open state
  //------------------------------------------------------------------
  ;

  _proto._stateScriptDataEscapedEndTagOpen = function _stateScriptDataEscapedEndTagOpen(cp) {
    if (isAsciiLetter(cp)) {
      this.state = State.SCRIPT_DATA_ESCAPED_END_TAG_NAME;

      this._stateScriptDataEscapedEndTagName(cp);
    } else {
      this._emitChars('</');

      this.state = State.SCRIPT_DATA_ESCAPED;

      this._stateScriptDataEscaped(cp);
    }
  } // Script data escaped end tag name state
  //------------------------------------------------------------------
  ;

  _proto._stateScriptDataEscapedEndTagName = function _stateScriptDataEscapedEndTagName(cp) {
    if (this.handleSpecialEndTag(cp)) {
      this._emitChars('</');

      this.state = State.SCRIPT_DATA_ESCAPED;

      this._stateScriptDataEscaped(cp);
    }
  } // Script data double escape start state
  //------------------------------------------------------------------
  ;

  _proto._stateScriptDataDoubleEscapeStart = function _stateScriptDataDoubleEscapeStart(cp) {
    if (this.preprocessor.startsWith(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.SCRIPT, false) && isScriptDataDoubleEscapeSequenceEnd(this.preprocessor.peek(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.SCRIPT.length))) {
      this._emitCodePoint(cp);

      for (var i = 0; i < _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.SCRIPT.length; i++) {
        this._emitCodePoint(this._consume());
      }

      this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
    } else if (!this._ensureHibernation()) {
      this.state = State.SCRIPT_DATA_ESCAPED;

      this._stateScriptDataEscaped(cp);
    }
  } // Script data double escaped state
  //------------------------------------------------------------------
  ;

  _proto._stateScriptDataDoubleEscaped = function _stateScriptDataDoubleEscaped(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS:
        {
          this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH;

          this._emitChars('-');

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN:
        {
          this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;

          this._emitChars('<');

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          this._emitChars(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInScriptHtmlCommentLikeText);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this._emitCodePoint(cp);
        }
    }
  } // Script data double escaped dash state
  //------------------------------------------------------------------
  ;

  _proto._stateScriptDataDoubleEscapedDash = function _stateScriptDataDoubleEscapedDash(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS:
        {
          this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH;

          this._emitChars('-');

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN:
        {
          this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;

          this._emitChars('<');

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;

          this._emitChars(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInScriptHtmlCommentLikeText);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;

          this._emitCodePoint(cp);
        }
    }
  } // Script data double escaped dash dash state
  //------------------------------------------------------------------
  ;

  _proto._stateScriptDataDoubleEscapedDashDash = function _stateScriptDataDoubleEscapedDashDash(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS:
        {
          this._emitChars('-');

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN:
        {
          this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;

          this._emitChars('<');

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this.state = State.SCRIPT_DATA;

          this._emitChars('>');

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;

          this._emitChars(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInScriptHtmlCommentLikeText);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;

          this._emitCodePoint(cp);
        }
    }
  } // Script data double escaped less-than sign state
  //------------------------------------------------------------------
  ;

  _proto._stateScriptDataDoubleEscapedLessThanSign = function _stateScriptDataDoubleEscapedLessThanSign(cp) {
    if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS) {
      this.state = State.SCRIPT_DATA_DOUBLE_ESCAPE_END;

      this._emitChars('/');
    } else {
      this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;

      this._stateScriptDataDoubleEscaped(cp);
    }
  } // Script data double escape end state
  //------------------------------------------------------------------
  ;

  _proto._stateScriptDataDoubleEscapeEnd = function _stateScriptDataDoubleEscapeEnd(cp) {
    if (this.preprocessor.startsWith(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.SCRIPT, false) && isScriptDataDoubleEscapeSequenceEnd(this.preprocessor.peek(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.SCRIPT.length))) {
      this._emitCodePoint(cp);

      for (var i = 0; i < _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.SCRIPT.length; i++) {
        this._emitCodePoint(this._consume());
      }

      this.state = State.SCRIPT_DATA_ESCAPED;
    } else if (!this._ensureHibernation()) {
      this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;

      this._stateScriptDataDoubleEscaped(cp);
    }
  } // Before attribute name state
  //------------------------------------------------------------------
  ;

  _proto._stateBeforeAttributeName = function _stateBeforeAttributeName(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED:
        {
          // Ignore whitespace
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this.state = State.AFTER_ATTRIBUTE_NAME;

          this._stateAfterAttributeName(cp);

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EQUALS_SIGN:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedEqualsSignBeforeAttributeName);

          this._createAttr('=');

          this.state = State.ATTRIBUTE_NAME;
          break;
        }

      default:
        {
          this._createAttr('');

          this.state = State.ATTRIBUTE_NAME;

          this._stateAttributeName(cp);
        }
    }
  } // Attribute name state
  //------------------------------------------------------------------
  ;

  _proto._stateAttributeName = function _stateAttributeName(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._leaveAttrName();

          this.state = State.AFTER_ATTRIBUTE_NAME;

          this._stateAfterAttributeName(cp);

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EQUALS_SIGN:
        {
          this._leaveAttrName();

          this.state = State.BEFORE_ATTRIBUTE_VALUE;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedCharacterInAttributeName);

          this.currentAttr.name += String.fromCodePoint(cp);
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          this.currentAttr.name += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
          break;
        }

      default:
        {
          this.currentAttr.name += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
        }
    }
  } // After attribute name state
  //------------------------------------------------------------------
  ;

  _proto._stateAfterAttributeName = function _stateAfterAttributeName(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED:
        {
          // Ignore whitespace
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS:
        {
          this.state = State.SELF_CLOSING_START_TAG;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EQUALS_SIGN:
        {
          this.state = State.BEFORE_ATTRIBUTE_VALUE;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this.state = State.DATA;
          this.emitCurrentTagToken();
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInTag);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this._createAttr('');

          this.state = State.ATTRIBUTE_NAME;

          this._stateAttributeName(cp);
        }
    }
  } // Before attribute value state
  //------------------------------------------------------------------
  ;

  _proto._stateBeforeAttributeValue = function _stateBeforeAttributeValue(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED:
        {
          // Ignore whitespace
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK:
        {
          this.state = State.ATTRIBUTE_VALUE_DOUBLE_QUOTED;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE:
        {
          this.state = State.ATTRIBUTE_VALUE_SINGLE_QUOTED;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingAttributeValue);

          this.state = State.DATA;
          this.emitCurrentTagToken();
          break;
        }

      default:
        {
          this.state = State.ATTRIBUTE_VALUE_UNQUOTED;

          this._stateAttributeValueUnquoted(cp);
        }
    }
  } // Attribute value (double-quoted) state
  //------------------------------------------------------------------
  ;

  _proto._stateAttributeValueDoubleQuoted = function _stateAttributeValueDoubleQuoted(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK:
        {
          this.state = State.AFTER_ATTRIBUTE_VALUE_QUOTED;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.AMPERSAND:
        {
          this.returnState = State.ATTRIBUTE_VALUE_DOUBLE_QUOTED;
          this.state = State.CHARACTER_REFERENCE;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          this.currentAttr.value += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInTag);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this.currentAttr.value += String.fromCodePoint(cp);
        }
    }
  } // Attribute value (single-quoted) state
  //------------------------------------------------------------------
  ;

  _proto._stateAttributeValueSingleQuoted = function _stateAttributeValueSingleQuoted(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE:
        {
          this.state = State.AFTER_ATTRIBUTE_VALUE_QUOTED;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.AMPERSAND:
        {
          this.returnState = State.ATTRIBUTE_VALUE_SINGLE_QUOTED;
          this.state = State.CHARACTER_REFERENCE;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          this.currentAttr.value += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInTag);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this.currentAttr.value += String.fromCodePoint(cp);
        }
    }
  } // Attribute value (unquoted) state
  //------------------------------------------------------------------
  ;

  _proto._stateAttributeValueUnquoted = function _stateAttributeValueUnquoted(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED:
        {
          this._leaveAttrValue();

          this.state = State.BEFORE_ATTRIBUTE_NAME;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.AMPERSAND:
        {
          this.returnState = State.ATTRIBUTE_VALUE_UNQUOTED;
          this.state = State.CHARACTER_REFERENCE;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this._leaveAttrValue();

          this.state = State.DATA;
          this.emitCurrentTagToken();
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          this.currentAttr.value += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EQUALS_SIGN:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GRAVE_ACCENT:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedCharacterInUnquotedAttributeValue);

          this.currentAttr.value += String.fromCodePoint(cp);
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInTag);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this.currentAttr.value += String.fromCodePoint(cp);
        }
    }
  } // After attribute value (quoted) state
  //------------------------------------------------------------------
  ;

  _proto._stateAfterAttributeValueQuoted = function _stateAfterAttributeValueQuoted(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED:
        {
          this._leaveAttrValue();

          this.state = State.BEFORE_ATTRIBUTE_NAME;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS:
        {
          this._leaveAttrValue();

          this.state = State.SELF_CLOSING_START_TAG;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this._leaveAttrValue();

          this.state = State.DATA;
          this.emitCurrentTagToken();
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInTag);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingWhitespaceBetweenAttributes);

          this.state = State.BEFORE_ATTRIBUTE_NAME;

          this._stateBeforeAttributeName(cp);
        }
    }
  } // Self-closing start tag state
  //------------------------------------------------------------------
  ;

  _proto._stateSelfClosingStartTag = function _stateSelfClosingStartTag(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          var token = this.currentToken;
          token.selfClosing = true;
          this.state = State.DATA;
          this.emitCurrentTagToken();
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInTag);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedSolidusInTag);

          this.state = State.BEFORE_ATTRIBUTE_NAME;

          this._stateBeforeAttributeName(cp);
        }
    }
  } // Bogus comment state
  //------------------------------------------------------------------
  ;

  _proto._stateBogusComment = function _stateBogusComment(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this.state = State.DATA;
          this.emitCurrentComment(token);
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this.emitCurrentComment(token);

          this._emitEOFToken();

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          token.data += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
          break;
        }

      default:
        {
          token.data += String.fromCodePoint(cp);
        }
    }
  } // Markup declaration open state
  //------------------------------------------------------------------
  ;

  _proto._stateMarkupDeclarationOpen = function _stateMarkupDeclarationOpen(cp) {
    if (this._consumeSequenceIfMatch(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.DASH_DASH, true)) {
      this._createCommentToken(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.DASH_DASH.length + 1);

      this.state = State.COMMENT_START;
    } else if (this._consumeSequenceIfMatch(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.DOCTYPE, false)) {
      // NOTE: Doctypes tokens are created without fixed offsets. We keep track of the moment a doctype *might* start here.
      this.currentLocation = this.getCurrentLocation(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.DOCTYPE.length + 1);
      this.state = State.DOCTYPE;
    } else if (this._consumeSequenceIfMatch(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.CDATA_START, true)) {
      if (this.inForeignNode) {
        this.state = State.CDATA_SECTION;
      } else {
        this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.cdataInHtmlContent);

        this._createCommentToken(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.CDATA_START.length + 1);

        this.currentToken.data = '[CDATA[';
        this.state = State.BOGUS_COMMENT;
      }
    } //NOTE: Sequence lookups can be abrupted by hibernation. In that case, lookup
    //results are no longer valid and we will need to start over.
    else if (!this._ensureHibernation()) {
      this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.incorrectlyOpenedComment);

      this._createCommentToken(2);

      this.state = State.BOGUS_COMMENT;

      this._stateBogusComment(cp);
    }
  } // Comment start state
  //------------------------------------------------------------------
  ;

  _proto._stateCommentStart = function _stateCommentStart(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS:
        {
          this.state = State.COMMENT_START_DASH;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.abruptClosingOfEmptyComment);

          this.state = State.DATA;
          var token = this.currentToken;
          this.emitCurrentComment(token);
          break;
        }

      default:
        {
          this.state = State.COMMENT;

          this._stateComment(cp);
        }
    }
  } // Comment start dash state
  //------------------------------------------------------------------
  ;

  _proto._stateCommentStartDash = function _stateCommentStartDash(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS:
        {
          this.state = State.COMMENT_END;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.abruptClosingOfEmptyComment);

          this.state = State.DATA;
          this.emitCurrentComment(token);
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInComment);

          this.emitCurrentComment(token);

          this._emitEOFToken();

          break;
        }

      default:
        {
          token.data += '-';
          this.state = State.COMMENT;

          this._stateComment(cp);
        }
    }
  } // Comment state
  //------------------------------------------------------------------
  ;

  _proto._stateComment = function _stateComment(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS:
        {
          this.state = State.COMMENT_END_DASH;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN:
        {
          token.data += '<';
          this.state = State.COMMENT_LESS_THAN_SIGN;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          token.data += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInComment);

          this.emitCurrentComment(token);

          this._emitEOFToken();

          break;
        }

      default:
        {
          token.data += String.fromCodePoint(cp);
        }
    }
  } // Comment less-than sign state
  //------------------------------------------------------------------
  ;

  _proto._stateCommentLessThanSign = function _stateCommentLessThanSign(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EXCLAMATION_MARK:
        {
          token.data += '!';
          this.state = State.COMMENT_LESS_THAN_SIGN_BANG;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN:
        {
          token.data += '<';
          break;
        }

      default:
        {
          this.state = State.COMMENT;

          this._stateComment(cp);
        }
    }
  } // Comment less-than sign bang state
  //------------------------------------------------------------------
  ;

  _proto._stateCommentLessThanSignBang = function _stateCommentLessThanSignBang(cp) {
    if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS) {
      this.state = State.COMMENT_LESS_THAN_SIGN_BANG_DASH;
    } else {
      this.state = State.COMMENT;

      this._stateComment(cp);
    }
  } // Comment less-than sign bang dash state
  //------------------------------------------------------------------
  ;

  _proto._stateCommentLessThanSignBangDash = function _stateCommentLessThanSignBangDash(cp) {
    if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS) {
      this.state = State.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH;
    } else {
      this.state = State.COMMENT_END_DASH;

      this._stateCommentEndDash(cp);
    }
  } // Comment less-than sign bang dash dash state
  //------------------------------------------------------------------
  ;

  _proto._stateCommentLessThanSignBangDashDash = function _stateCommentLessThanSignBangDashDash(cp) {
    if (cp !== _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN && cp !== _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF) {
      this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.nestedComment);
    }

    this.state = State.COMMENT_END;

    this._stateCommentEnd(cp);
  } // Comment end dash state
  //------------------------------------------------------------------
  ;

  _proto._stateCommentEndDash = function _stateCommentEndDash(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS:
        {
          this.state = State.COMMENT_END;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInComment);

          this.emitCurrentComment(token);

          this._emitEOFToken();

          break;
        }

      default:
        {
          token.data += '-';
          this.state = State.COMMENT;

          this._stateComment(cp);
        }
    }
  } // Comment end state
  //------------------------------------------------------------------
  ;

  _proto._stateCommentEnd = function _stateCommentEnd(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this.state = State.DATA;
          this.emitCurrentComment(token);
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EXCLAMATION_MARK:
        {
          this.state = State.COMMENT_END_BANG;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS:
        {
          token.data += '-';
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInComment);

          this.emitCurrentComment(token);

          this._emitEOFToken();

          break;
        }

      default:
        {
          token.data += '--';
          this.state = State.COMMENT;

          this._stateComment(cp);
        }
    }
  } // Comment end bang state
  //------------------------------------------------------------------
  ;

  _proto._stateCommentEndBang = function _stateCommentEndBang(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS:
        {
          token.data += '--!';
          this.state = State.COMMENT_END_DASH;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.incorrectlyClosedComment);

          this.state = State.DATA;
          this.emitCurrentComment(token);
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInComment);

          this.emitCurrentComment(token);

          this._emitEOFToken();

          break;
        }

      default:
        {
          token.data += '--!';
          this.state = State.COMMENT;

          this._stateComment(cp);
        }
    }
  } // DOCTYPE state
  //------------------------------------------------------------------
  ;

  _proto._stateDoctype = function _stateDoctype(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED:
        {
          this.state = State.BEFORE_DOCTYPE_NAME;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this.state = State.BEFORE_DOCTYPE_NAME;

          this._stateBeforeDoctypeName(cp);

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);

          this._createDoctypeToken(null);

          var token = this.currentToken;
          token.forceQuirks = true;
          this.emitCurrentDoctype(token);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingWhitespaceBeforeDoctypeName);

          this.state = State.BEFORE_DOCTYPE_NAME;

          this._stateBeforeDoctypeName(cp);
        }
    }
  } // Before DOCTYPE name state
  //------------------------------------------------------------------
  ;

  _proto._stateBeforeDoctypeName = function _stateBeforeDoctypeName(cp) {
    if (isAsciiUpper(cp)) {
      this._createDoctypeToken(String.fromCharCode(toAsciiLower(cp)));

      this.state = State.DOCTYPE_NAME;
    } else switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED:
        {
          // Ignore whitespace
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          this._createDoctypeToken(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);

          this.state = State.DOCTYPE_NAME;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingDoctypeName);

          this._createDoctypeToken(null);

          var token = this.currentToken;
          token.forceQuirks = true;
          this.emitCurrentDoctype(token);
          this.state = State.DATA;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);

          this._createDoctypeToken(null);

          var _token = this.currentToken;
          _token.forceQuirks = true;
          this.emitCurrentDoctype(_token);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this._createDoctypeToken(String.fromCodePoint(cp));

          this.state = State.DOCTYPE_NAME;
        }
    }
  } // DOCTYPE name state
  //------------------------------------------------------------------
  ;

  _proto._stateDoctypeName = function _stateDoctypeName(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED:
        {
          this.state = State.AFTER_DOCTYPE_NAME;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this.state = State.DATA;
          this.emitCurrentDoctype(token);
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          token.name += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);

          token.forceQuirks = true;
          this.emitCurrentDoctype(token);

          this._emitEOFToken();

          break;
        }

      default:
        {
          token.name += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
        }
    }
  } // After DOCTYPE name state
  //------------------------------------------------------------------
  ;

  _proto._stateAfterDoctypeName = function _stateAfterDoctypeName(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED:
        {
          // Ignore whitespace
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this.state = State.DATA;
          this.emitCurrentDoctype(token);
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);

          token.forceQuirks = true;
          this.emitCurrentDoctype(token);

          this._emitEOFToken();

          break;
        }

      default:
        {
          if (this._consumeSequenceIfMatch(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.PUBLIC, false)) {
            this.state = State.AFTER_DOCTYPE_PUBLIC_KEYWORD;
          } else if (this._consumeSequenceIfMatch(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.SYSTEM, false)) {
            this.state = State.AFTER_DOCTYPE_SYSTEM_KEYWORD;
          } //NOTE: sequence lookup can be abrupted by hibernation. In that case lookup
          //results are no longer valid and we will need to start over.
          else if (!this._ensureHibernation()) {
            this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.invalidCharacterSequenceAfterDoctypeName);

            token.forceQuirks = true;
            this.state = State.BOGUS_DOCTYPE;

            this._stateBogusDoctype(cp);
          }
        }
    }
  } // After DOCTYPE public keyword state
  //------------------------------------------------------------------
  ;

  _proto._stateAfterDoctypePublicKeyword = function _stateAfterDoctypePublicKeyword(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED:
        {
          this.state = State.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingWhitespaceAfterDoctypePublicKeyword);

          token.publicId = '';
          this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingWhitespaceAfterDoctypePublicKeyword);

          token.publicId = '';
          this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingDoctypePublicIdentifier);

          token.forceQuirks = true;
          this.state = State.DATA;
          this.emitCurrentDoctype(token);
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);

          token.forceQuirks = true;
          this.emitCurrentDoctype(token);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingQuoteBeforeDoctypePublicIdentifier);

          token.forceQuirks = true;
          this.state = State.BOGUS_DOCTYPE;

          this._stateBogusDoctype(cp);
        }
    }
  } // Before DOCTYPE public identifier state
  //------------------------------------------------------------------
  ;

  _proto._stateBeforeDoctypePublicIdentifier = function _stateBeforeDoctypePublicIdentifier(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED:
        {
          // Ignore whitespace
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK:
        {
          token.publicId = '';
          this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE:
        {
          token.publicId = '';
          this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingDoctypePublicIdentifier);

          token.forceQuirks = true;
          this.state = State.DATA;
          this.emitCurrentDoctype(token);
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);

          token.forceQuirks = true;
          this.emitCurrentDoctype(token);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingQuoteBeforeDoctypePublicIdentifier);

          token.forceQuirks = true;
          this.state = State.BOGUS_DOCTYPE;

          this._stateBogusDoctype(cp);
        }
    }
  } // DOCTYPE public identifier (double-quoted) state
  //------------------------------------------------------------------
  ;

  _proto._stateDoctypePublicIdentifierDoubleQuoted = function _stateDoctypePublicIdentifierDoubleQuoted(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK:
        {
          this.state = State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          token.publicId += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.abruptDoctypePublicIdentifier);

          token.forceQuirks = true;
          this.emitCurrentDoctype(token);
          this.state = State.DATA;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);

          token.forceQuirks = true;
          this.emitCurrentDoctype(token);

          this._emitEOFToken();

          break;
        }

      default:
        {
          token.publicId += String.fromCodePoint(cp);
        }
    }
  } // DOCTYPE public identifier (single-quoted) state
  //------------------------------------------------------------------
  ;

  _proto._stateDoctypePublicIdentifierSingleQuoted = function _stateDoctypePublicIdentifierSingleQuoted(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE:
        {
          this.state = State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          token.publicId += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.abruptDoctypePublicIdentifier);

          token.forceQuirks = true;
          this.emitCurrentDoctype(token);
          this.state = State.DATA;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);

          token.forceQuirks = true;
          this.emitCurrentDoctype(token);

          this._emitEOFToken();

          break;
        }

      default:
        {
          token.publicId += String.fromCodePoint(cp);
        }
    }
  } // After DOCTYPE public identifier state
  //------------------------------------------------------------------
  ;

  _proto._stateAfterDoctypePublicIdentifier = function _stateAfterDoctypePublicIdentifier(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED:
        {
          this.state = State.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this.state = State.DATA;
          this.emitCurrentDoctype(token);
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers);

          token.systemId = '';
          this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers);

          token.systemId = '';
          this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);

          token.forceQuirks = true;
          this.emitCurrentDoctype(token);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingQuoteBeforeDoctypeSystemIdentifier);

          token.forceQuirks = true;
          this.state = State.BOGUS_DOCTYPE;

          this._stateBogusDoctype(cp);
        }
    }
  } // Between DOCTYPE public and system identifiers state
  //------------------------------------------------------------------
  ;

  _proto._stateBetweenDoctypePublicAndSystemIdentifiers = function _stateBetweenDoctypePublicAndSystemIdentifiers(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED:
        {
          // Ignore whitespace
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this.emitCurrentDoctype(token);
          this.state = State.DATA;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK:
        {
          token.systemId = '';
          this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE:
        {
          token.systemId = '';
          this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);

          token.forceQuirks = true;
          this.emitCurrentDoctype(token);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingQuoteBeforeDoctypeSystemIdentifier);

          token.forceQuirks = true;
          this.state = State.BOGUS_DOCTYPE;

          this._stateBogusDoctype(cp);
        }
    }
  } // After DOCTYPE system keyword state
  //------------------------------------------------------------------
  ;

  _proto._stateAfterDoctypeSystemKeyword = function _stateAfterDoctypeSystemKeyword(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED:
        {
          this.state = State.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingWhitespaceAfterDoctypeSystemKeyword);

          token.systemId = '';
          this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingWhitespaceAfterDoctypeSystemKeyword);

          token.systemId = '';
          this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingDoctypeSystemIdentifier);

          token.forceQuirks = true;
          this.state = State.DATA;
          this.emitCurrentDoctype(token);
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);

          token.forceQuirks = true;
          this.emitCurrentDoctype(token);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingQuoteBeforeDoctypeSystemIdentifier);

          token.forceQuirks = true;
          this.state = State.BOGUS_DOCTYPE;

          this._stateBogusDoctype(cp);
        }
    }
  } // Before DOCTYPE system identifier state
  //------------------------------------------------------------------
  ;

  _proto._stateBeforeDoctypeSystemIdentifier = function _stateBeforeDoctypeSystemIdentifier(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED:
        {
          // Ignore whitespace
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK:
        {
          token.systemId = '';
          this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE:
        {
          token.systemId = '';
          this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingDoctypeSystemIdentifier);

          token.forceQuirks = true;
          this.state = State.DATA;
          this.emitCurrentDoctype(token);
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);

          token.forceQuirks = true;
          this.emitCurrentDoctype(token);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingQuoteBeforeDoctypeSystemIdentifier);

          token.forceQuirks = true;
          this.state = State.BOGUS_DOCTYPE;

          this._stateBogusDoctype(cp);
        }
    }
  } // DOCTYPE system identifier (double-quoted) state
  //------------------------------------------------------------------
  ;

  _proto._stateDoctypeSystemIdentifierDoubleQuoted = function _stateDoctypeSystemIdentifierDoubleQuoted(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK:
        {
          this.state = State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          token.systemId += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.abruptDoctypeSystemIdentifier);

          token.forceQuirks = true;
          this.emitCurrentDoctype(token);
          this.state = State.DATA;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);

          token.forceQuirks = true;
          this.emitCurrentDoctype(token);

          this._emitEOFToken();

          break;
        }

      default:
        {
          token.systemId += String.fromCodePoint(cp);
        }
    }
  } // DOCTYPE system identifier (single-quoted) state
  //------------------------------------------------------------------
  ;

  _proto._stateDoctypeSystemIdentifierSingleQuoted = function _stateDoctypeSystemIdentifierSingleQuoted(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE:
        {
          this.state = State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          token.systemId += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.abruptDoctypeSystemIdentifier);

          token.forceQuirks = true;
          this.emitCurrentDoctype(token);
          this.state = State.DATA;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);

          token.forceQuirks = true;
          this.emitCurrentDoctype(token);

          this._emitEOFToken();

          break;
        }

      default:
        {
          token.systemId += String.fromCodePoint(cp);
        }
    }
  } // After DOCTYPE system identifier state
  //------------------------------------------------------------------
  ;

  _proto._stateAfterDoctypeSystemIdentifier = function _stateAfterDoctypeSystemIdentifier(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED:
        {
          // Ignore whitespace
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this.emitCurrentDoctype(token);
          this.state = State.DATA;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);

          token.forceQuirks = true;
          this.emitCurrentDoctype(token);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedCharacterAfterDoctypeSystemIdentifier);

          this.state = State.BOGUS_DOCTYPE;

          this._stateBogusDoctype(cp);
        }
    }
  } // Bogus DOCTYPE state
  //------------------------------------------------------------------
  ;

  _proto._stateBogusDoctype = function _stateBogusDoctype(cp) {
    var token = this.currentToken;

    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this.emitCurrentDoctype(token);
          this.state = State.DATA;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);

          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this.emitCurrentDoctype(token);

          this._emitEOFToken();

          break;
        }

      default: // Do nothing

    }
  } // CDATA section state
  //------------------------------------------------------------------
  ;

  _proto._stateCdataSection = function _stateCdataSection(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.RIGHT_SQUARE_BRACKET:
        {
          this.state = State.CDATA_SECTION_BRACKET;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF:
        {
          this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInCdata);

          this._emitEOFToken();

          break;
        }

      default:
        {
          this._emitCodePoint(cp);
        }
    }
  } // CDATA section bracket state
  //------------------------------------------------------------------
  ;

  _proto._stateCdataSectionBracket = function _stateCdataSectionBracket(cp) {
    if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.RIGHT_SQUARE_BRACKET) {
      this.state = State.CDATA_SECTION_END;
    } else {
      this._emitChars(']');

      this.state = State.CDATA_SECTION;

      this._stateCdataSection(cp);
    }
  } // CDATA section end state
  //------------------------------------------------------------------
  ;

  _proto._stateCdataSectionEnd = function _stateCdataSectionEnd(cp) {
    switch (cp) {
      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
        {
          this.state = State.DATA;
          break;
        }

      case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.RIGHT_SQUARE_BRACKET:
        {
          this._emitChars(']');

          break;
        }

      default:
        {
          this._emitChars(']]');

          this.state = State.CDATA_SECTION;

          this._stateCdataSection(cp);
        }
    }
  } // Character reference state
  //------------------------------------------------------------------
  ;

  _proto._stateCharacterReference = function _stateCharacterReference(cp) {
    if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NUMBER_SIGN) {
      this.state = State.NUMERIC_CHARACTER_REFERENCE;
    } else if (isAsciiAlphaNumeric(cp)) {
      this.state = State.NAMED_CHARACTER_REFERENCE;

      this._stateNamedCharacterReference(cp);
    } else {
      this._flushCodePointConsumedAsCharacterReference(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.AMPERSAND);

      this._reconsumeInState(this.returnState, cp);
    }
  } // Named character reference state
  //------------------------------------------------------------------
  ;

  _proto._stateNamedCharacterReference = function _stateNamedCharacterReference(cp) {
    var matchResult = this._matchNamedCharacterReference(cp); //NOTE: Matching can be abrupted by hibernation. In that case, match
    //results are no longer valid and we will need to start over.


    if (this._ensureHibernation()) {// Stay in the state, try again.
    } else if (matchResult) {
      for (var i = 0; i < matchResult.length; i++) {
        this._flushCodePointConsumedAsCharacterReference(matchResult[i]);
      }

      this.state = this.returnState;
    } else {
      this._flushCodePointConsumedAsCharacterReference(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.AMPERSAND);

      this.state = State.AMBIGUOUS_AMPERSAND;
    }
  } // Ambiguos ampersand state
  //------------------------------------------------------------------
  ;

  _proto._stateAmbiguousAmpersand = function _stateAmbiguousAmpersand(cp) {
    if (isAsciiAlphaNumeric(cp)) {
      this._flushCodePointConsumedAsCharacterReference(cp);
    } else {
      if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SEMICOLON) {
        this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unknownNamedCharacterReference);
      }

      this._reconsumeInState(this.returnState, cp);
    }
  } // Numeric character reference state
  //------------------------------------------------------------------
  ;

  _proto._stateNumericCharacterReference = function _stateNumericCharacterReference(cp) {
    this.charRefCode = 0;

    if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LATIN_SMALL_X || cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LATIN_CAPITAL_X) {
      this.state = State.HEXADEMICAL_CHARACTER_REFERENCE_START;
    } // Inlined decimal character reference start state
    else if (isAsciiDigit(cp)) {
      this.state = State.DECIMAL_CHARACTER_REFERENCE;

      this._stateDecimalCharacterReference(cp);
    } else {
      this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.absenceOfDigitsInNumericCharacterReference);

      this._flushCodePointConsumedAsCharacterReference(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.AMPERSAND);

      this._flushCodePointConsumedAsCharacterReference(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NUMBER_SIGN);

      this._reconsumeInState(this.returnState, cp);
    }
  } // Hexademical character reference start state
  //------------------------------------------------------------------
  ;

  _proto._stateHexademicalCharacterReferenceStart = function _stateHexademicalCharacterReferenceStart(cp) {
    if (isAsciiHexDigit(cp)) {
      this.state = State.HEXADEMICAL_CHARACTER_REFERENCE;

      this._stateHexademicalCharacterReference(cp);
    } else {
      this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.absenceOfDigitsInNumericCharacterReference);

      this._flushCodePointConsumedAsCharacterReference(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.AMPERSAND);

      this._flushCodePointConsumedAsCharacterReference(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NUMBER_SIGN);

      this._unconsume(2);

      this.state = this.returnState;
    }
  } // Hexademical character reference state
  //------------------------------------------------------------------
  ;

  _proto._stateHexademicalCharacterReference = function _stateHexademicalCharacterReference(cp) {
    if (isAsciiUpperHexDigit(cp)) {
      this.charRefCode = this.charRefCode * 16 + cp - 0x37;
    } else if (isAsciiLowerHexDigit(cp)) {
      this.charRefCode = this.charRefCode * 16 + cp - 0x57;
    } else if (isAsciiDigit(cp)) {
      this.charRefCode = this.charRefCode * 16 + cp - 0x30;
    } else if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SEMICOLON) {
      this.state = State.NUMERIC_CHARACTER_REFERENCE_END;
    } else {
      this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingSemicolonAfterCharacterReference);

      this.state = State.NUMERIC_CHARACTER_REFERENCE_END;

      this._stateNumericCharacterReferenceEnd(cp);
    }
  } // Decimal character reference state
  //------------------------------------------------------------------
  ;

  _proto._stateDecimalCharacterReference = function _stateDecimalCharacterReference(cp) {
    if (isAsciiDigit(cp)) {
      this.charRefCode = this.charRefCode * 10 + cp - 0x30;
    } else if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SEMICOLON) {
      this.state = State.NUMERIC_CHARACTER_REFERENCE_END;
    } else {
      this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingSemicolonAfterCharacterReference);

      this.state = State.NUMERIC_CHARACTER_REFERENCE_END;

      this._stateNumericCharacterReferenceEnd(cp);
    }
  } // Numeric character reference end state
  //------------------------------------------------------------------
  ;

  _proto._stateNumericCharacterReferenceEnd = function _stateNumericCharacterReferenceEnd(cp) {
    if (this.charRefCode === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL) {
      this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.nullCharacterReference);

      this.charRefCode = _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.REPLACEMENT_CHARACTER;
    } else if (this.charRefCode > 1114111) {
      this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.characterReferenceOutsideUnicodeRange);

      this.charRefCode = _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.REPLACEMENT_CHARACTER;
    } else if ((0,_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.isSurrogate)(this.charRefCode)) {
      this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.surrogateCharacterReference);

      this.charRefCode = _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.REPLACEMENT_CHARACTER;
    } else if ((0,_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.isUndefinedCodePoint)(this.charRefCode)) {
      this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.noncharacterCharacterReference);
    } else if ((0,_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.isControlCodePoint)(this.charRefCode) || this.charRefCode === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.CARRIAGE_RETURN) {
      this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.controlCharacterReference);

      var replacement = C1_CONTROLS_REFERENCE_REPLACEMENTS.get(this.charRefCode);

      if (replacement !== undefined) {
        this.charRefCode = replacement;
      }
    }

    this._flushCodePointConsumedAsCharacterReference(this.charRefCode);

    this._reconsumeInState(this.returnState, cp);
  };

  return Tokenizer;
}();

/***/ }),

/***/ "./node_modules/parse5/dist/tokenizer/preprocessor.js":
/*!************************************************************!*\
  !*** ./node_modules/parse5/dist/tokenizer/preprocessor.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Preprocessor": () => (/* binding */ Preprocessor)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/unicode.js */ "./node_modules/parse5/dist/common/unicode.js");
/* harmony import */ var _common_error_codes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/error-codes.js */ "./node_modules/parse5/dist/common/error-codes.js");


 //Const

var DEFAULT_BUFFER_WATERLINE = 1 << 16; //Preprocessor
//NOTE: HTML input preprocessing
//(see: http://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html#preprocessing-the-input-stream)

var Preprocessor = /*#__PURE__*/function () {
  function Preprocessor(handler) {
    this.handler = handler;
    this.html = '';
    this.pos = -1; // NOTE: Initial `lastGapPos` is -2, to ensure `col` on initialisation is 0

    this.lastGapPos = -2;
    this.gapStack = [];
    this.skipNextNewLine = false;
    this.lastChunkWritten = false;
    this.endOfChunkHit = false;
    this.bufferWaterline = DEFAULT_BUFFER_WATERLINE;
    this.isEol = false;
    this.lineStartPos = 0;
    this.droppedBufferSize = 0;
    this.line = 1; //NOTE: avoid reporting errors twice on advance/retreat

    this.lastErrOffset = -1;
  }
  /** The column on the current line. If we just saw a gap (eg. a surrogate pair), return the index before. */


  var _proto = Preprocessor.prototype;

  _proto.getError = function getError(code) {
    var line = this.line,
        col = this.col,
        offset = this.offset;
    return {
      code: code,
      startLine: line,
      endLine: line,
      startCol: col,
      endCol: col,
      startOffset: offset,
      endOffset: offset
    };
  };

  _proto._err = function _err(code) {
    if (this.handler.onParseError && this.lastErrOffset !== this.offset) {
      this.lastErrOffset = this.offset;
      this.handler.onParseError(this.getError(code));
    }
  };

  _proto._addGap = function _addGap() {
    this.gapStack.push(this.lastGapPos);
    this.lastGapPos = this.pos;
  };

  _proto._processSurrogate = function _processSurrogate(cp) {
    //NOTE: try to peek a surrogate pair
    if (this.pos !== this.html.length - 1) {
      var nextCp = this.html.charCodeAt(this.pos + 1);

      if ((0,_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.isSurrogatePair)(nextCp)) {
        //NOTE: we have a surrogate pair. Peek pair character and recalculate code point.
        this.pos++; //NOTE: add a gap that should be avoided during retreat

        this._addGap();

        return (0,_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.getSurrogatePairCodePoint)(cp, nextCp);
      }
    } //NOTE: we are at the end of a chunk, therefore we can't infer the surrogate pair yet.
    else if (!this.lastChunkWritten) {
      this.endOfChunkHit = true;
      return _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF;
    } //NOTE: isolated surrogate


    this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_2__.ERR.surrogateInInputStream);

    return cp;
  };

  _proto.willDropParsedChunk = function willDropParsedChunk() {
    return this.pos > this.bufferWaterline;
  };

  _proto.dropParsedChunk = function dropParsedChunk() {
    if (this.willDropParsedChunk()) {
      this.html = this.html.substring(this.pos);
      this.lineStartPos -= this.pos;
      this.droppedBufferSize += this.pos;
      this.pos = 0;
      this.lastGapPos = -2;
      this.gapStack.length = 0;
    }
  };

  _proto.write = function write(chunk, isLastChunk) {
    if (this.html.length > 0) {
      this.html += chunk;
    } else {
      this.html = chunk;
    }

    this.endOfChunkHit = false;
    this.lastChunkWritten = isLastChunk;
  };

  _proto.insertHtmlAtCurrentPos = function insertHtmlAtCurrentPos(chunk) {
    this.html = this.html.substring(0, this.pos + 1) + chunk + this.html.substring(this.pos + 1);
    this.endOfChunkHit = false;
  };

  _proto.startsWith = function startsWith(pattern, caseSensitive) {
    // Check if our buffer has enough characters
    if (this.pos + pattern.length > this.html.length) {
      this.endOfChunkHit = !this.lastChunkWritten;
      return false;
    }

    if (caseSensitive) {
      return this.html.startsWith(pattern, this.pos);
    }

    for (var i = 0; i < pattern.length; i++) {
      var cp = this.html.charCodeAt(this.pos + i) | 0x20;

      if (cp !== pattern.charCodeAt(i)) {
        return false;
      }
    }

    return true;
  };

  _proto.peek = function peek(offset) {
    var pos = this.pos + offset;

    if (pos >= this.html.length) {
      this.endOfChunkHit = !this.lastChunkWritten;
      return _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF;
    }

    var code = this.html.charCodeAt(pos);
    return code === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.CARRIAGE_RETURN ? _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED : code;
  };

  _proto.advance = function advance() {
    this.pos++; //NOTE: LF should be in the last column of the line

    if (this.isEol) {
      this.isEol = false;
      this.line++;
      this.lineStartPos = this.pos;
    }

    if (this.pos >= this.html.length) {
      this.endOfChunkHit = !this.lastChunkWritten;
      return _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF;
    }

    var cp = this.html.charCodeAt(this.pos); //NOTE: all U+000D CARRIAGE RETURN (CR) characters must be converted to U+000A LINE FEED (LF) characters

    if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.CARRIAGE_RETURN) {
      this.isEol = true;
      this.skipNextNewLine = true;
      return _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED;
    } //NOTE: any U+000A LINE FEED (LF) characters that immediately follow a U+000D CARRIAGE RETURN (CR) character
    //must be ignored.


    if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED) {
      this.isEol = true;

      if (this.skipNextNewLine) {
        // `line` will be bumped again in the recursive call.
        this.line--;
        this.skipNextNewLine = false;

        this._addGap();

        return this.advance();
      }
    }

    this.skipNextNewLine = false;

    if ((0,_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.isSurrogate)(cp)) {
      cp = this._processSurrogate(cp);
    } //OPTIMIZATION: first check if code point is in the common allowed
    //range (ASCII alphanumeric, whitespaces, big chunk of BMP)
    //before going into detailed performance cost validation.


    var isCommonValidRange = this.handler.onParseError === null || cp > 0x1f && cp < 0x7f || cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED || cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.CARRIAGE_RETURN || cp > 0x9f && cp < 64976;

    if (!isCommonValidRange) {
      this._checkForProblematicCharacters(cp);
    }

    return cp;
  };

  _proto._checkForProblematicCharacters = function _checkForProblematicCharacters(cp) {
    if ((0,_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.isControlCodePoint)(cp)) {
      this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_2__.ERR.controlCharacterInInputStream);
    } else if ((0,_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.isUndefinedCodePoint)(cp)) {
      this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_2__.ERR.noncharacterInInputStream);
    }
  };

  _proto.retreat = function retreat(count) {
    this.pos -= count;

    while (this.pos < this.lastGapPos) {
      this.lastGapPos = this.gapStack.pop();
      this.pos--;
    }

    this.isEol = false;
  };

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_0__["default"])(Preprocessor, [{
    key: "col",
    get: function get() {
      return this.pos - this.lineStartPos + Number(this.lastGapPos !== this.pos);
    }
  }, {
    key: "offset",
    get: function get() {
      return this.droppedBufferSize + this.pos;
    }
  }]);

  return Preprocessor;
}();

/***/ }),

/***/ "./node_modules/parse5/dist/tree-adapters/default.js":
/*!***********************************************************!*\
  !*** ./node_modules/parse5/dist/tree-adapters/default.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "defaultTreeAdapter": () => (/* binding */ defaultTreeAdapter)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _common_html_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/html.js */ "./node_modules/parse5/dist/common/html.js");



function createTextNode(value) {
  return {
    nodeName: '#text',
    value: value,
    parentNode: null
  };
}

var defaultTreeAdapter = {
  //Node construction
  createDocument: function createDocument() {
    return {
      nodeName: '#document',
      mode: _common_html_js__WEBPACK_IMPORTED_MODULE_1__.DOCUMENT_MODE.NO_QUIRKS,
      childNodes: []
    };
  },
  createDocumentFragment: function createDocumentFragment() {
    return {
      nodeName: '#document-fragment',
      childNodes: []
    };
  },
  createElement: function createElement(tagName, namespaceURI, attrs) {
    return {
      nodeName: tagName,
      tagName: tagName,
      attrs: attrs,
      namespaceURI: namespaceURI,
      childNodes: [],
      parentNode: null
    };
  },
  createCommentNode: function createCommentNode(data) {
    return {
      nodeName: '#comment',
      data: data,
      parentNode: null
    };
  },
  //Tree mutation
  appendChild: function appendChild(parentNode, newNode) {
    parentNode.childNodes.push(newNode);
    newNode.parentNode = parentNode;
  },
  insertBefore: function insertBefore(parentNode, newNode, referenceNode) {
    var insertionIdx = parentNode.childNodes.indexOf(referenceNode);
    parentNode.childNodes.splice(insertionIdx, 0, newNode);
    newNode.parentNode = parentNode;
  },
  setTemplateContent: function setTemplateContent(templateElement, contentElement) {
    templateElement.content = contentElement;
  },
  getTemplateContent: function getTemplateContent(templateElement) {
    return templateElement.content;
  },
  setDocumentType: function setDocumentType(document, name, publicId, systemId) {
    var doctypeNode = document.childNodes.find(function (node) {
      return node.nodeName === '#documentType';
    });

    if (doctypeNode) {
      doctypeNode.name = name;
      doctypeNode.publicId = publicId;
      doctypeNode.systemId = systemId;
    } else {
      var node = {
        nodeName: '#documentType',
        name: name,
        publicId: publicId,
        systemId: systemId,
        parentNode: null
      };
      defaultTreeAdapter.appendChild(document, node);
    }
  },
  setDocumentMode: function setDocumentMode(document, mode) {
    document.mode = mode;
  },
  getDocumentMode: function getDocumentMode(document) {
    return document.mode;
  },
  detachNode: function detachNode(node) {
    if (node.parentNode) {
      var idx = node.parentNode.childNodes.indexOf(node);
      node.parentNode.childNodes.splice(idx, 1);
      node.parentNode = null;
    }
  },
  insertText: function insertText(parentNode, text) {
    if (parentNode.childNodes.length > 0) {
      var prevNode = parentNode.childNodes[parentNode.childNodes.length - 1];

      if (defaultTreeAdapter.isTextNode(prevNode)) {
        prevNode.value += text;
        return;
      }
    }

    defaultTreeAdapter.appendChild(parentNode, createTextNode(text));
  },
  insertTextBefore: function insertTextBefore(parentNode, text, referenceNode) {
    var prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];

    if (prevNode && defaultTreeAdapter.isTextNode(prevNode)) {
      prevNode.value += text;
    } else {
      defaultTreeAdapter.insertBefore(parentNode, createTextNode(text), referenceNode);
    }
  },
  adoptAttributes: function adoptAttributes(recipient, attrs) {
    var recipientAttrsMap = new Set(recipient.attrs.map(function (attr) {
      return attr.name;
    }));

    for (var j = 0; j < attrs.length; j++) {
      if (!recipientAttrsMap.has(attrs[j].name)) {
        recipient.attrs.push(attrs[j]);
      }
    }
  },
  //Tree traversing
  getFirstChild: function getFirstChild(node) {
    return node.childNodes[0];
  },
  getChildNodes: function getChildNodes(node) {
    return node.childNodes;
  },
  getParentNode: function getParentNode(node) {
    return node.parentNode;
  },
  getAttrList: function getAttrList(element) {
    return element.attrs;
  },
  //Node data
  getTagName: function getTagName(element) {
    return element.tagName;
  },
  getNamespaceURI: function getNamespaceURI(element) {
    return element.namespaceURI;
  },
  getTextNodeContent: function getTextNodeContent(textNode) {
    return textNode.value;
  },
  getCommentNodeContent: function getCommentNodeContent(commentNode) {
    return commentNode.data;
  },
  getDocumentTypeNodeName: function getDocumentTypeNodeName(doctypeNode) {
    return doctypeNode.name;
  },
  getDocumentTypeNodePublicId: function getDocumentTypeNodePublicId(doctypeNode) {
    return doctypeNode.publicId;
  },
  getDocumentTypeNodeSystemId: function getDocumentTypeNodeSystemId(doctypeNode) {
    return doctypeNode.systemId;
  },
  //Node types
  isTextNode: function isTextNode(node) {
    return node.nodeName === '#text';
  },
  isCommentNode: function isCommentNode(node) {
    return node.nodeName === '#comment';
  },
  isDocumentTypeNode: function isDocumentTypeNode(node) {
    return node.nodeName === '#documentType';
  },
  isElementNode: function isElementNode(node) {
    return Object.prototype.hasOwnProperty.call(node, 'tagName');
  },
  // Source code location
  setNodeSourceCodeLocation: function setNodeSourceCodeLocation(node, location) {
    node.sourceCodeLocation = location;
  },
  getNodeSourceCodeLocation: function getNodeSourceCodeLocation(node) {
    return node.sourceCodeLocation;
  },
  updateNodeSourceCodeLocation: function updateNodeSourceCodeLocation(node, endLocation) {
    node.sourceCodeLocation = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, node.sourceCodeLocation, endLocation);
  }
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./forum.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_forum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/forum */ "./src/forum/index.ts");
/* This is part of the ianm/synopsis project.

 * Additional modifications (c)2020 Ian Morland
 *
 * Modified code (c)2019 Jordan Schnaidt
 *
 * Original code (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=forum.js.map