"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CameraPosition;
(function (CameraPosition) {
    CameraPosition["FRONT"] = "front";
    CameraPosition["BACK"] = "back";
    CameraPosition["NONE"] = "none";
})(CameraPosition = exports.CameraPosition || (exports.CameraPosition = {}));
var VideoFormat;
(function (VideoFormat) {
    VideoFormat["DEFAULT"] = "default";
    VideoFormat["MP4"] = "mp4";
})(VideoFormat = exports.VideoFormat || (exports.VideoFormat = {}));
var VideoRecorderCommon = (function () {
    function VideoRecorderCommon(options) {
        if (options === void 0) { options = {}; }
        this.options = Object.assign(Object.assign({
            format: VideoFormat.DEFAULT,
            position: CameraPosition.NONE,
            size: 0,
            duration: 0,
            explanation: null
        }, options || {}), {
            saveToGallery: !!options.saveToGallery,
            hd: !!options.hd,
        });
    }
    VideoRecorderCommon.prototype.record = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        options = Object.assign(this.options, options);
        return this.requestPermissions(options).catch(function (err) {
            throw { event: 'denied' };
        }).then(function () {
            return _this._startRecording(options);
        });
    };
    VideoRecorderCommon.prototype.requestPermissions = function (options) {
        if (options === void 0) { options = {}; }
        return Promise.resolve();
    };
    VideoRecorderCommon.isAvailable = function () {
        return false;
    };
    VideoRecorderCommon.prototype._startRecording = function (options) {
        return Promise.reject({ event: 'failed' });
    };
    return VideoRecorderCommon;
}());
exports.VideoRecorderCommon = VideoRecorderCommon;
//# sourceMappingURL=videorecorder.common.js.map