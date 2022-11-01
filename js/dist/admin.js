/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "./src/admin/extendEditTagModal.tsx":
/*!******************************************!*\
  !*** ./src/admin/extendEditTagModal.tsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_tags_components_EditTagModal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/tags/components/EditTagModal */ "flarum/tags/components/EditTagModal");
/* harmony import */ var flarum_tags_components_EditTagModal__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_tags_components_EditTagModal__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_tags_models_Tag__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/tags/models/Tag */ "flarum/tags/models/Tag");
/* harmony import */ var flarum_tags_models_Tag__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_tags_models_Tag__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/Model */ "flarum/common/Model");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Model__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/utils/Stream */ "flarum/common/utils/Stream");
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_5__);






/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  if (flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.has('flarum-tags')) {
    (flarum_tags_models_Tag__WEBPACK_IMPORTED_MODULE_3___default().prototype.richExcerpts) = flarum_common_Model__WEBPACK_IMPORTED_MODULE_4___default().attribute('richExcerpts');
    (flarum_tags_models_Tag__WEBPACK_IMPORTED_MODULE_3___default().prototype.excerptLength) = flarum_common_Model__WEBPACK_IMPORTED_MODULE_4___default().attribute('excerptLength');
    (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_2__.extend)((flarum_tags_components_EditTagModal__WEBPACK_IMPORTED_MODULE_1___default().prototype), 'oninit', function () {
      this.richExcerpts = new (flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_5___default())(this.tag.richExcerpts());
      this.excerptLength = new (flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_5___default())(this.tag.excerptLength());
    });
    (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_2__.extend)((flarum_tags_components_EditTagModal__WEBPACK_IMPORTED_MODULE_1___default().prototype), 'submitData', function (data) {
      data.richExcerpts = this.richExcerpts();
      data.excerptLength = this.excerptLength();
      return data;
    });
    (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_2__.extend)((flarum_tags_components_EditTagModal__WEBPACK_IMPORTED_MODULE_1___default().prototype), 'fields', function (items) {
      items.add('synopsis-excerpt-length', m("div", {
        className: "Form-group"
      }, m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-synopsis.admin.settings.excerpt-length.label')), m("input", {
        className: "FormControl",
        type: "number",
        min: "0",
        bidi: this.excerptLength
      }), m("div", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-synopsis.admin.settings.excerpt-length.help'))), 5);
      items.add('synopsis-rich-excerpts', m("div", {
        className: "Form-group"
      }, m("div", null, m("label", {
        className: "checkbox"
      }, m("input", {
        type: "checkbox",
        bidi: this.richExcerpts
      }), flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-synopsis.admin.settings.rich-excerpts.label'))), m("div", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-synopsis.admin.settings.rich-excerpts.help'))), 5);
    });
  }
}

/***/ }),

/***/ "./src/admin/index.tsx":
/*!*****************************!*\
  !*** ./src/admin/index.tsx ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _extendEditTagModal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extendEditTagModal */ "./src/admin/extendEditTagModal.tsx");
/* harmony import */ var _util_typeOptions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util/typeOptions */ "./src/admin/util/typeOptions.js");



flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('ianm-synopsis', function () {
  flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().extensionData["for"]('ianm-synopsis').registerSetting(function () {
    if (!('flarum-tags' in flarum.extensions)) return;
    return m("div", {
      className: "Form-group"
    }, m("p", {
      className: "helpText"
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-synopsis.admin.settings.tags-enabled')));
  }).registerSetting({
    label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-synopsis.admin.settings.excerpt-length.label'),
    help: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-synopsis.admin.settings.excerpt-length.help'),
    setting: 'ianm-synopsis.excerpt_length',
    type: 'number'
  }).registerSetting({
    label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-synopsis.admin.settings.rich-excerpts.label'),
    help: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-synopsis.admin.settings.rich-excerpts.help'),
    setting: 'ianm-synopsis.rich-excerpts',
    type: 'boolean'
  }).registerSetting({
    label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-synopsis.admin.settings.excerpt-type.label'),
    help: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-synopsis.admin.settings.excerpt-type.help'),
    setting: 'ianm-synopsis.excerpt-type',
    options: (0,_util_typeOptions__WEBPACK_IMPORTED_MODULE_2__["default"])(),
    type: 'select'
  });
  (0,_extendEditTagModal__WEBPACK_IMPORTED_MODULE_1__["default"])();
});

/***/ }),

/***/ "./src/admin/util/typeOptions.js":
/*!***************************************!*\
  !*** ./src/admin/util/typeOptions.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  var opts;
  opts = ['first', 'last'].reduce(function (o, key) {
    o[key] = flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans("ianm-synopsis.admin.settings." + key + "-label");
    return o;
  }, {});
  return opts;
}

/***/ }),

/***/ "flarum/admin/app":
/*!**************************************************!*\
  !*** external "flarum.core.compat['admin/app']" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['admin/app'];

/***/ }),

/***/ "flarum/common/Model":
/*!*****************************************************!*\
  !*** external "flarum.core.compat['common/Model']" ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/Model'];

/***/ }),

/***/ "flarum/common/extend":
/*!******************************************************!*\
  !*** external "flarum.core.compat['common/extend']" ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/extend'];

/***/ }),

/***/ "flarum/common/utils/Stream":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/utils/Stream']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/Stream'];

/***/ }),

/***/ "flarum/tags/components/EditTagModal":
/*!*********************************************************************!*\
  !*** external "flarum.core.compat['tags/components/EditTagModal']" ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['tags/components/EditTagModal'];

/***/ }),

/***/ "flarum/tags/models/Tag":
/*!********************************************************!*\
  !*** external "flarum.core.compat['tags/models/Tag']" ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['tags/models/Tag'];

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
  !*** ./admin.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/admin */ "./src/admin/index.tsx");
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
//# sourceMappingURL=admin.js.map