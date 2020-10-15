"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("tns-core-modules/ui/core/view");
var CameraPosition;
(function (CameraPosition) {
    CameraPosition["BACK"] = "back";
    CameraPosition["FRONT"] = "front";
})(CameraPosition = exports.CameraPosition || (exports.CameraPosition = {}));
var Quality;
(function (Quality) {
    Quality["MAX_480P"] = "480p";
    Quality["MAX_720P"] = "720p";
    Quality["MAX_1080P"] = "1080p";
    Quality["MAX_2160P"] = "2160p";
    Quality["HIGHEST"] = "highest";
    Quality["LOWEST"] = "lowest";
    Quality["QVGA"] = "qvga";
})(Quality = exports.Quality || (exports.Quality = {}));
var Orientation;
(function (Orientation) {
    Orientation["Unknown"] = "unknown";
    Orientation["Portrait"] = "portrait";
    Orientation["PortraitUpsideDown"] = "portraitUpsideDown";
    Orientation["LandscapeLeft"] = "landscapeLeft";
    Orientation["LandscapeRight"] = "landscapeRight";
})(Orientation = exports.Orientation || (exports.Orientation = {}));
var AdvancedVideoViewBase = (function (_super) {
    __extends(AdvancedVideoViewBase, _super);
    function AdvancedVideoViewBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AdvancedVideoViewBase.isAvailable = function () {
        return false;
    };
    AdvancedVideoViewBase.requestPermissions = function (explanation) {
        return Promise.resolve();
    };
    return AdvancedVideoViewBase;
}(view_1.View));
exports.AdvancedVideoViewBase = AdvancedVideoViewBase;
exports.outputOrientation = new view_1.Property({
    name: 'outputOrientation',
    defaultValue: Orientation.Unknown
});
exports.fillProperty = new view_1.Property({
    name: 'fill',
    defaultValue: false
});
exports.torchProperty = new view_1.Property({
    name: 'torch',
    defaultValue: false
});
exports.thumbnailCountProperty = new view_1.Property({
    name: 'thumbnailCount',
    defaultValue: 1
});
exports.qualityProperty = new view_1.Property({
    name: 'quality',
    defaultValue: Quality.MAX_480P
});
exports.cameraPositionProperty = new view_1.Property({
    name: 'cameraPosition',
    defaultValue: CameraPosition.BACK
});
exports.saveToGalleryProperty = new view_1.Property({
    name: 'saveToGallery',
    defaultValue: false
});
exports.qualityProperty.register(AdvancedVideoViewBase);
exports.cameraPositionProperty.register(AdvancedVideoViewBase);
exports.saveToGalleryProperty.register(AdvancedVideoViewBase);
exports.fillProperty.register(AdvancedVideoViewBase);
exports.thumbnailCountProperty.register(AdvancedVideoViewBase);
exports.outputOrientation.register(AdvancedVideoViewBase);
exports.torchProperty.register(AdvancedVideoViewBase);
//# sourceMappingURL=advanced-video-view.common.js.map