/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.tsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/components/AdvancedAssetElement.tsx":
/*!*************************************************!*\
  !*** ./src/components/AdvancedAssetElement.tsx ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __extends = (this && this.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    };\r\n    return function (d, b) {\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar React = __webpack_require__(/*! react */ \"react\");\r\nvar AdvancedAssetElement = /** @class */ (function (_super) {\r\n    __extends(AdvancedAssetElement, _super);\r\n    function AdvancedAssetElement(props) {\r\n        var _this = _super.call(this, props) || this;\r\n        CustomElement.init(function (element, _context) {\r\n            // Set up the element with initial value\r\n            _this.state = {\r\n                contentManagementAPIKey: element.config.contentManagementAPIKey\r\n            };\r\n        });\r\n        return _this;\r\n    }\r\n    AdvancedAssetElement.prototype.render = function () {\r\n        return (React.createElement(\"div\", { style: { textAlign: 'center' } },\r\n            React.createElement(\"h1\", null, \"Hello Kentico, here are some assets\"),\r\n            React.createElement(\"h2\", null, this.state.contentManagementAPIKey)));\r\n    };\r\n    return AdvancedAssetElement;\r\n}(React.Component));\r\nexports.AdvancedAssetElement = AdvancedAssetElement;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9BZHZhbmNlZEFzc2V0RWxlbWVudC50c3guanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vc3JjL2NvbXBvbmVudHMvQWR2YW5jZWRBc3NldEVsZW1lbnQudHN4PzMxNzIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IElFbGVtZW50IH0gZnJvbSBcIi4va2VudGljby9JRWxlbWVudFwiO1xyXG5pbXBvcnQgeyBJQ29udGV4dCB9IGZyb20gXCIuL2tlbnRpY28vSUNvbnRleHRcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUVsZW1lbnRQcm9wcyB7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUVsZW1lbnRTdGF0ZSB7XHJcbiAgICBjb250ZW50TWFuYWdlbWVudEFQSUtleTogc3RyaW5nO1xyXG59XHJcblxyXG5kZWNsYXJlIHZhciBDdXN0b21FbGVtZW50OiBhbnk7XHJcblxyXG5leHBvcnQgY2xhc3MgQWR2YW5jZWRBc3NldEVsZW1lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8SUVsZW1lbnRQcm9wcywgSUVsZW1lbnRTdGF0ZT4ge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IFJlYWRvbmx5PElFbGVtZW50UHJvcHM+KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICBDdXN0b21FbGVtZW50LmluaXQoKGVsZW1lbnQ6IElFbGVtZW50LCBfY29udGV4dDogSUNvbnRleHQpID0+IHtcclxuICAgICAgICAgICAgLy8gU2V0IHVwIHRoZSBlbGVtZW50IHdpdGggaW5pdGlhbCB2YWx1ZVxyXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgY29udGVudE1hbmFnZW1lbnRBUElLZXk6IGVsZW1lbnQuY29uZmlnLmNvbnRlbnRNYW5hZ2VtZW50QVBJS2V5XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgdGV4dEFsaWduOiAnY2VudGVyJyB9fT5cclxuICAgICAgICAgICAgICAgIDxoMT5IZWxsbyBLZW50aWNvLCBoZXJlIGFyZSBzb21lIGFzc2V0czwvaDE+XHJcbiAgICAgICAgICAgICAgICA8aDI+e3RoaXMuc3RhdGUuY29udGVudE1hbmFnZW1lbnRBUElLZXl9PC9oMj5cclxuICAgICAgICAgICAgPC9kaXY+KTtcclxuICAgIH1cclxufSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFhQTtBQUFBO0FBQ0E7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBbkJBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/components/AdvancedAssetElement.tsx\n");

/***/ }),

/***/ "./src/index.tsx":
/*!***********************!*\
  !*** ./src/index.tsx ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar React = __webpack_require__(/*! react */ \"react\");\r\nvar ReactDOM = __webpack_require__(/*! react-dom */ \"react-dom\");\r\nvar AdvancedAssetElement_1 = __webpack_require__(/*! ./components/AdvancedAssetElement */ \"./src/components/AdvancedAssetElement.tsx\");\r\nReactDOM.render(React.createElement(AdvancedAssetElement_1.AdvancedAssetElement, null), document.getElementById('root'));\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvaW5kZXgudHN4LmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3NyYy9pbmRleC50c3g/MjJkNCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0ICogYXMgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiO1xyXG5cclxuaW1wb3J0IHsgQWR2YW5jZWRBc3NldEVsZW1lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL0FkdmFuY2VkQXNzZXRFbGVtZW50XCI7XHJcblxyXG5SZWFjdERPTS5yZW5kZXIoPEFkdmFuY2VkQXNzZXRFbGVtZW50IC8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpKTsiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUVBO0FBRUE7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/index.tsx\n");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = React;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJSZWFjdFwiP2M0ODEiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBSZWFjdDsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///react\n");

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = ReactDOM;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QtZG9tLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiUmVhY3RET01cIj80YjJkIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gUmVhY3RET007Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///react-dom\n");

/***/ })

/******/ });