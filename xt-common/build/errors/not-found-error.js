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
exports.NotFoundError = void 0;
var custom_error_1 = require("./custom-error");
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(message) {
        var _this = _super.call(this, message || 'Route not found') || this;
        _this.statusCode = 404;
        Object.setPrototypeOf(_this, NotFoundError.prototype);
        return _this;
    }
    NotFoundError.prototype.serializeErrors = function () {
        return [{ message: this.message || 'Not Found' }];
    };
    return NotFoundError;
}(custom_error_1.CustomError));
exports.NotFoundError = NotFoundError;
