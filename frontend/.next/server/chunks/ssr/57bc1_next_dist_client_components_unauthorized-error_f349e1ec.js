module.exports = {

"[project]/src/node_modules/next/dist/client/components/unauthorized-error.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return Unauthorized;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
const _errorfallback = __turbopack_context__.r("[project]/src/node_modules/next/dist/client/components/http-access-fallback/error-fallback.js [app-rsc] (ecmascript)");
function Unauthorized() {
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_errorfallback.HTTPAccessErrorFallback, {
        status: 401,
        message: "You're not authorized to access this page."
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=unauthorized-error.js.map
}}),

};

//# sourceMappingURL=57bc1_next_dist_client_components_unauthorized-error_f349e1ec.js.map