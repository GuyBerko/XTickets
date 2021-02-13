"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAuthorizedError = void 0;
var custom_error_1 = require("./custom-error");
var NotAuthorizedError = /** @class */ (function (_super) {
    __extends(NotAuthorizedError, _super);
    function NotAuthorizedError(message) {
        var _this = _super.call(this, message || 'Not authorized') || this;
        _this.statusCode = 401;
        Object.setPrototypeOf(_this, NotAuthorizedError.prototype);
        return _this;
    }
    NotAuthorizedError.prototype.serializeErrors = function () {
        return [{ message: this.message || 'Not authorized' }];
    };
    return NotAuthorizedError;
}(custom_error_1.CustomError));
exports.NotAuthorizedError = NotAuthorizedError;
