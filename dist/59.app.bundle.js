(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[59],{

/***/ "./node_modules/antd/es/col/index.js":
/*!*******************************************!*\
  !*** ./node_modules/antd/es/col/index.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _grid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../grid */ \"./node_modules/antd/es/grid/index.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_grid__WEBPACK_IMPORTED_MODULE_0__[\"Col\"]);\n\n//# sourceURL=webpack:///./node_modules/antd/es/col/index.js?");

/***/ }),

/***/ "./node_modules/jsrmvi/index.js":
/*!**************************************!*\
  !*** ./node_modules/jsrmvi/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./lib */ \"./node_modules/jsrmvi/lib/index.js\");\n\n\n//# sourceURL=webpack:///./node_modules/jsrmvi/index.js?");

/***/ }),

/***/ "./node_modules/jsrmvi/lib/index.js":
/*!******************************************!*\
  !*** ./node_modules/jsrmvi/lib/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * Author: <Ha Huynh> https://github.com/huynhsamha\n * Github: https://github.com/huynhsamha/jsrmvi\n * NPM Package: https://www.npmjs.com/package/jsrmvi\n */\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.DefaultOption = exports.removeVI = void 0;\nvar PartternLowercase = [\n    { char: 'a', regex: /à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g },\n    { char: 'e', regex: /è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g },\n    { char: 'i', regex: /ì|í|ị|ỉ|ĩ/g },\n    { char: 'o', regex: /ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g },\n    { char: 'u', regex: /ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g },\n    { char: 'y', regex: /ỳ|ý|ỵ|ỷ|ỹ/g },\n    { char: 'd', regex: /đ/g },\n];\nvar PartternUppercase = [\n    { char: 'A', regex: /À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g },\n    { char: 'E', regex: /È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g },\n    { char: 'I', regex: /Ì|Í|Ị|Ỉ|Ĩ/g },\n    { char: 'O', regex: /Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g },\n    { char: 'U', regex: /Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g },\n    { char: 'Y', regex: /Ỳ|Ý|Ỵ|Ỷ|Ỹ/g },\n    { char: 'D', regex: /Đ/g },\n];\nvar specialCharRegex = /!|@|%|\\^|\\*|\\(|\\)|\\+|\\-|\\=|\\<|\\>|\\?|\\/|,|\\.|\\:|\\;|\\'| |\\\"|\\&|\\#|\\[|\\]|~|$|_|\\|/g;\nvar DefaultOption = {\n    ignoreCase: true,\n    replaceSpecialCharacters: true,\n    concatBy: '-',\n};\nexports.DefaultOption = DefaultOption;\nexports.removeVI = function (text, options) {\n    if (text === void 0) { text = ''; }\n    if (options === void 0) { options = DefaultOption; }\n    var _a = options.ignoreCase, ignoreCase = _a === void 0 ? DefaultOption.ignoreCase : _a, _b = options.replaceSpecialCharacters, replaceSpecialCharacters = _b === void 0 ? DefaultOption.replaceSpecialCharacters : _b, _c = options.concatBy, concatBy = _c === void 0 ? DefaultOption.concatBy : _c;\n    var res = text || '';\n    if (ignoreCase) {\n        res = res.toLowerCase();\n    }\n    PartternLowercase.forEach(function (t) {\n        res = res.replace(t.regex, t.char);\n    });\n    if (!ignoreCase) {\n        PartternUppercase.forEach(function (t) {\n            res = res.replace(t.regex, t.char);\n        });\n    }\n    if (replaceSpecialCharacters) {\n        var c = concatBy;\n        res = res\n            .replace(specialCharRegex, c) // replace special characters to c\n            .replace(new RegExp(\"\\\\\" + c + \"+\\\\\" + c, 'g'), c) // replace repeated c to single c (e.g. `a---b` to `a-b`)\n            .replace(new RegExp(\"^\\\\\" + c + \"+|\\\\\" + c + \"+$\", 'g'), ''); // remove begin and end characters with c\n    }\n    return res;\n};\nvar jsrmvi = {\n    removeVI: exports.removeVI,\n    DefaultOption: DefaultOption,\n};\nexports.default = jsrmvi;\n\n\n//# sourceURL=webpack:///./node_modules/jsrmvi/lib/index.js?");

/***/ }),

/***/ "./src/views/ProductView/AllVariantView.js":
/*!*************************************************!*\
  !*** ./src/views/ProductView/AllVariantView.js ***!
  \*************************************************/
/*! exports provided: AllProductTab, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"AllProductTab\", function() { return AllProductTab; });\n/* harmony import */ var antd_es_row__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! antd/es/row */ \"./node_modules/antd/es/row/index.js\");\n/* harmony import */ var antd_es_col__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! antd/es/col */ \"./node_modules/antd/es/col/index.js\");\n/* harmony import */ var antd_es_table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! antd/es/table */ \"./node_modules/antd/es/table/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-dom */ \"./node_modules/react-router-dom/esm/react-router-dom.js\");\n/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-redux */ \"./node_modules/react-redux/es/index.js\");\n/* harmony import */ var Redux_product__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! Redux/product */ \"./src/redux/product/index.js\");\n/* harmony import */ var jsrmvi__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! jsrmvi */ \"./node_modules/jsrmvi/index.js\");\n/* harmony import */ var jsrmvi__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(jsrmvi__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var _ant_design_icons__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ant-design/icons */ \"./node_modules/@ant-design/icons/es/index.js\");\n\n\n\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\n\nfunction _iterableToArray(iter) { if (typeof Symbol !== \"undefined\" && iter[Symbol.iterator] != null || iter[\"@@iterator\"] != null) return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }\n\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }\n\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== \"undefined\" && arr[Symbol.iterator] || arr[\"@@iterator\"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"] != null) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; }\n\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\n\n\n\n\n\n //\n\n\nvar columns = [{\n  title: '',\n  dataIndex: 'avatar',\n  key: 'avatar',\n  render: function render(value, record) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(\"img\", {\n      src: value && value[0] || \"data:image/png;base64,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\",\n      style: {\n        width: 30,\n        height: 30\n      }\n    });\n  }\n}, {\n  title: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(\"div\", null, \"S\\u1EA3n ph\\u1EA9m\"),\n  dataIndex: 'name',\n  key: 'name',\n  render: function render(text, record) {\n    console.log(record);\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_3___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_4__[\"Link\"], {\n      to: \"/app/product/\".concat(record.parentId, \"/variant/\").concat(record._id)\n    }, record.name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(\"br\", null), record.store_id);\n  },\n  width: 200\n}, {\n  title: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(\"div\", null, \"M\\xE3 sku\"),\n  dataIndex: 'sku',\n  key: 'sku'\n}, {\n  title: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(\"div\", null, \"C\\xF3 th\\u1EC3 b\\xE1n\"),\n  dataIndex: 'status',\n  key: 'status' // render: (value, record) => <Typography.Text type={record.sellable ? \"success\" : \"warning\"}>{record.sellable ? \"Đang giao dịch\" : \"Ngừng giao dịch\"}</Typography.Text>\n\n}, {\n  title: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(\"div\", null, \"Ng\\xE0y kh\\u1EDFi t\\u1EA1o\"),\n  dataIndex: 'createdAt',\n  key: 'createdAt' // render: value => new Date(value).toLocaleString('vi-VN')\n\n}, {\n  title: 'Action',\n  dataIndex: 'action',\n  key: 'action'\n}];\nvar AllProductTab = function AllProductTab(props) {\n  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_3__[\"useState\"])([]),\n      _useState2 = _slicedToArray(_useState, 2),\n      dataSource = _useState2[0],\n      setDataSource = _useState2[1];\n\n  Object(react__WEBPACK_IMPORTED_MODULE_3__[\"useEffect\"])(function () {\n    props.getProductsStart();\n  }, []);\n  Object(react__WEBPACK_IMPORTED_MODULE_3__[\"useEffect\"])(function () {\n    if (props.products.length > 0) {\n      var allVariants = props.products.reduce(function (acc, product) {\n        return acc = [].concat(_toConsumableArray(acc), _toConsumableArray(product.variants.map(function (va) {\n          return _objectSpread(_objectSpread({}, va), {}, {\n            parentId: product._id\n          });\n        })));\n      }, []);\n      setDataSource(allVariants);\n    }\n  }, [props.products]);\n\n  var onExpandRow = function onExpandRow(record) {};\n\n  var onRowSelection = function onRowSelection(selectedRowKeys, selectedRows) {\n    console.log(\"selectedRowKeys: \".concat(selectedRowKeys), 'selectedRows: ', selectedRows);\n  };\n\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(antd_es_row__WEBPACK_IMPORTED_MODULE_0__[\"default\"], {\n    style: {\n      backgroundColor: '#fff',\n      padding: '8px 24px',\n      border: '1px solid #ccc',\n      borderRadius: 5\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(antd_es_col__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n    span: 24\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(antd_es_table__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n    rowSelection: {\n      onChange: onRowSelection\n    },\n    dataSource: dataSource,\n    columns: columns\n  })));\n};\n\nvar mapStateToProps = function mapStateToProps(state) {\n  return {\n    products: state.product.toJS().products\n  };\n};\n\nvar mapDispatchToProps = function mapDispatchToProps(dispatch) {\n  return {\n    getProductsStart: function getProductsStart() {\n      return dispatch(Redux_product__WEBPACK_IMPORTED_MODULE_6__[\"default\"].getProductsStart());\n    }\n  };\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_5__[\"connect\"])(mapStateToProps, mapDispatchToProps)(AllProductTab));\n\n//# sourceURL=webpack:///./src/views/ProductView/AllVariantView.js?");

/***/ })

}]);