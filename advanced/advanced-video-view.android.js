"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("../async-await");
var advanced_video_view_common_1 = require("./advanced-video-view.common");
__export(require("./advanced-video-view.common"));
var observable_1 = require("tns-core-modules/data/observable");
var app = require("tns-core-modules/application");
var permissions = require("nativescript-permissions");
var MediaMetadataRetriever = android.media.MediaMetadataRetriever;
var NativeOrientation;
(function (NativeOrientation) {
    NativeOrientation[NativeOrientation["Unknown"] = 0] = "Unknown";
    NativeOrientation[NativeOrientation["Portrait"] = 1] = "Portrait";
    NativeOrientation[NativeOrientation["PortraitUpsideDown"] = 2] = "PortraitUpsideDown";
    NativeOrientation[NativeOrientation["LandscapeLeft"] = 3] = "LandscapeLeft";
    NativeOrientation[NativeOrientation["LandscapeRight"] = 4] = "LandscapeRight";
})(NativeOrientation = exports.NativeOrientation || (exports.NativeOrientation = {}));
var AdvancedVideoView = (function (_super) {
    __extends(AdvancedVideoView, _super);
    function AdvancedVideoView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(AdvancedVideoView.prototype, "duration", {
        get: function () {
            return this.nativeView && this.nativeView.getDuration()
                ? this.nativeView.getDuration()
                : 0;
        },
        enumerable: true,
        configurable: true
    });
    AdvancedVideoView.requestPermissions = function (explanation) {
        if (explanation === void 0) { explanation = ''; }
        return permissions.requestPermissions([
            android.Manifest.permission.CAMERA,
            android.Manifest.permission.RECORD_AUDIO
        ], explanation && explanation.length > 0 ? explanation : '');
    };
    AdvancedVideoView.isAvailable = function () {
        return app.android.context.getPackageManager().hasSystemFeature(android.content.pm.PackageManager.FEATURE_CAMERA);
    };
    AdvancedVideoView.prototype.createNativeView = function () {
        var _this = this;
        app.android.on(app.AndroidApplication.activityRequestPermissionsEvent, function (args) {
            if (permissions.hasPermission(android.Manifest.permission.CAMERA) && permissions.hasPermission(android.Manifest.permission.RECORD_AUDIO)) {
                _this.startPreview();
                app.android.off(app.AndroidApplication.activityRequestPermissionsEvent);
            }
        });
        return new co.fitcom.fancycamera.FancyCamera(this._context);
    };
    AdvancedVideoView.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var ref = new WeakRef(this);
        var that = this;
        var listener = co.fitcom.fancycamera.CameraEventListenerUI.extend({
            onCameraOpenUI: function () { },
            onCameraCloseUI: function () { },
            onVideoEventUI: function (event) {
                var owner = ref.get();
                if (event.getType() === co.fitcom.fancycamera.EventType.INFO &&
                    event
                        .getMessage()
                        .indexOf(co.fitcom.fancycamera.VideoEvent.EventInfo.RECORDING_FINISHED.toString()) > -1) {
                    if (that.thumbnailCount && that.thumbnailCount > 0) {
                        that.extractThumbnails(event.getFile().getPath());
                    }
                    owner.notify({
                        eventName: 'finished',
                        object: observable_1.fromObject({
                            file: event.getFile().getPath()
                        })
                    });
                }
                else if (event.getType() === co.fitcom.fancycamera.EventType.INFO &&
                    event
                        .getMessage()
                        .indexOf(co.fitcom.fancycamera.VideoEvent.EventInfo.RECORDING_STARTED.toString()) > -1) {
                    owner.notify({
                        eventName: 'started',
                        object: observable_1.fromObject({})
                    });
                }
                else {
                    if (event.getType() === co.fitcom.fancycamera.EventType.ERROR) {
                        owner.notify({
                            eventName: 'error',
                            object: observable_1.fromObject({
                                message: event.getMessage()
                            })
                        });
                    }
                    else {
                        owner.notify({
                            eventName: 'info',
                            object: observable_1.fromObject({
                                message: event.getMessage()
                            })
                        });
                    }
                }
            },
            onPhotoEventUI: function (event) {
            }
        });
        this.nativeView.setListener(new listener());
        this.setQuality(this.quality);
        this.setCameraPosition(this.cameraPosition);
        this.setCameraOrientation(this.outputOrientation);
        this.nativeView.setCameraOrientation(2);
    };
    AdvancedVideoView.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this.startPreview();
    };
    AdvancedVideoView.prototype.onUnloaded = function () {
        if (this.nativeView && this.nativeView.release) {
            this.nativeView.release();
        }
        app.android.off(app.AndroidApplication.activityRequestPermissionsEvent);
        _super.prototype.onUnloaded.call(this);
    };
    AdvancedVideoView.prototype.setCameraPosition = function (position) {
        switch (position) {
            case advanced_video_view_common_1.CameraPosition.FRONT:
                this.nativeView.setCameraPosition(1);
                break;
            default:
                this.nativeView.setCameraPosition(0);
                break;
        }
    };
    AdvancedVideoView.prototype[advanced_video_view_common_1.cameraPositionProperty.getDefault] = function () {
        this.setCameraPosition('back');
        return 'back';
    };
    AdvancedVideoView.prototype[advanced_video_view_common_1.cameraPositionProperty.setNative] = function (position) {
        if (this.nativeView) {
            this.setCameraPosition(position);
        }
        return position;
    };
    AdvancedVideoView.prototype.setCameraOrientation = function (orientation) {
        var nativeOrientation;
        switch (orientation) {
            case advanced_video_view_common_1.Orientation.LandscapeLeft:
                nativeOrientation = co.fitcom.fancycamera.FancyCamera.CameraOrientation.LANDSCAPE_LEFT.getValue();
                break;
            case advanced_video_view_common_1.Orientation.LandscapeRight:
                nativeOrientation = co.fitcom.fancycamera.FancyCamera.CameraOrientation.LANDSCAPE_RIGHT.getValue();
                break;
            case advanced_video_view_common_1.Orientation.Portrait:
                nativeOrientation = co.fitcom.fancycamera.FancyCamera.CameraOrientation.PORTRAIT.getValue();
                break;
            case advanced_video_view_common_1.Orientation.PortraitUpsideDown:
                nativeOrientation = co.fitcom.fancycamera.FancyCamera.CameraOrientation.PORTRAIT_UPSIDE_DOWN.getValue();
                break;
            default:
                nativeOrientation = co.fitcom.fancycamera.FancyCamera.CameraOrientation.UNKNOWN.getValue();
                break;
        }
        if (this.nativeView && nativeOrientation !== NativeOrientation.Unknown) {
            this.nativeView.setCameraOrientation(nativeOrientation);
        }
    };
    AdvancedVideoView.prototype[advanced_video_view_common_1.outputOrientation.getDefault] = function () {
        this.setCameraOrientation(advanced_video_view_common_1.Orientation.Unknown);
        return advanced_video_view_common_1.Orientation.Unknown;
    };
    AdvancedVideoView.prototype[advanced_video_view_common_1.outputOrientation.setNative] = function (orientation) {
        if (this.nativeView) {
            this.setCameraOrientation(orientation);
        }
        return orientation;
    };
    AdvancedVideoView.prototype[advanced_video_view_common_1.saveToGalleryProperty.getDefault] = function () {
        return false;
    };
    AdvancedVideoView.prototype[advanced_video_view_common_1.saveToGalleryProperty.setNative] = function (save) {
        return save;
    };
    AdvancedVideoView.prototype.setQuality = function (quality) {
        var q;
        if (quality && quality.valueof === 'function') {
            q = quality.valueof();
        }
        else {
            q = quality;
        }
        switch (q) {
            case advanced_video_view_common_1.Quality.MAX_720P.toString():
                this.nativeView.setQuality(co.fitcom.fancycamera.FancyCamera.Quality.MAX_720P.getValue());
                break;
            case advanced_video_view_common_1.Quality.MAX_1080P.toString():
                this.nativeView.setQuality(co.fitcom.fancycamera.FancyCamera.Quality.MAX_1080P.getValue());
                break;
            case advanced_video_view_common_1.Quality.MAX_2160P.toString():
                this.nativeView.setQuality(co.fitcom.fancycamera.FancyCamera.Quality.MAX_2160P.getValue());
                break;
            case advanced_video_view_common_1.Quality.HIGHEST.toString():
                this.nativeView.setQuality(co.fitcom.fancycamera.FancyCamera.Quality.HIGHEST.getValue());
                break;
            case advanced_video_view_common_1.Quality.LOWEST.toString():
                this.nativeView.setQuality(co.fitcom.fancycamera.FancyCamera.Quality.LOWEST.getValue());
                break;
            case advanced_video_view_common_1.Quality.QVGA.toString():
                this.nativeView.setQuality(co.fitcom.fancycamera.FancyCamera.Quality.QVGA.getValue());
                break;
            default:
                this.nativeView.setQuality(co.fitcom.fancycamera.FancyCamera.Quality.MAX_480P.getValue());
                break;
        }
    };
    AdvancedVideoView.prototype[advanced_video_view_common_1.qualityProperty.setNative] = function (quality) {
        if (!quality)
            return quality;
        this.setQuality(this.quality);
        return quality;
    };
    AdvancedVideoView.prototype[advanced_video_view_common_1.torchProperty.getDefault] = function () {
        return false;
    };
    AdvancedVideoView.prototype[advanced_video_view_common_1.torchProperty.setNative] = function (torch) {
        if (!this.isTorchAvailable || !this.nativeView)
            return false;
        if (torch && !this.nativeView.flashEnabled) {
            this.nativeView.enableFlash();
        }
        else if (!torch && this.nativeView.flashEnabled) {
            this.nativeView.disableFlash();
        }
        return torch;
    };
    Object.defineProperty(AdvancedVideoView.prototype, "isTorchAvailable", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    AdvancedVideoView.prototype.toggleTorch = function () {
        if (!this.isTorchAvailable)
            return;
        console.log('toggleFlash is called', this.torch);
        this.torch = !this.torch;
    };
    AdvancedVideoView.prototype.toggleCamera = function () {
        this.nativeView.toggleCamera();
    };
    AdvancedVideoView.prototype.startRecording = function () {
        this.nativeView.startRecording();
    };
    AdvancedVideoView.prototype.stopRecording = function () {
        this.nativeView.stopRecording();
    };
    AdvancedVideoView.prototype.startPreview = function () {
        if (this.nativeView) {
            this.nativeView.start();
        }
    };
    AdvancedVideoView.prototype.stopPreview = function () {
        if (this.nativeView) {
            this.nativeView.stop();
        }
    };
    AdvancedVideoView.prototype.extractThumbnails = function (file) {
        this.thumbnails = [];
        console.log("file", file);
        var mediaMetadataRetriever = new MediaMetadataRetriever();
        mediaMetadataRetriever.setDataSource(file);
        var METADATA_KEY_DURATION = mediaMetadataRetriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION);
        var max = parseInt(METADATA_KEY_DURATION.toString());
        var it = parseInt((max / this.thumbnailCount).toString());
        for (var index_1 = 0; index_1 < this.thumbnailCount; index_1++) {
            var bmpOriginal = mediaMetadataRetriever.getFrameAtTime(index_1 * it * 1000, MediaMetadataRetriever.OPTION_CLOSEST);
            var byteCount = bmpOriginal.getWidth() * bmpOriginal.getHeight() * 4;
            var tmpByteBuffer = java.nio.ByteBuffer.allocate(byteCount);
            bmpOriginal.copyPixelsToBuffer(tmpByteBuffer);
            var quality = 100;
            var outputFilePath = file.substr(0, file.lastIndexOf(".")) +
                "_thumbnail_" +
                index_1 +
                ".png";
            var outputFile = new java.io.File(outputFilePath);
            var outputStream = null;
            try {
                outputStream = new java.io.FileOutputStream(outputFile);
            }
            catch (e) {
                console.log(e);
            }
            var bmpScaledSize = android.graphics.Bitmap.createScaledBitmap(bmpOriginal, bmpOriginal.getWidth(), bmpOriginal.getHeight(), false);
            bmpScaledSize.compress(android.graphics.Bitmap.CompressFormat.PNG, quality, outputStream);
            try {
                outputStream.close();
                this.thumbnails.push(outputFilePath);
            }
            catch (e) {
                console.log(e);
            }
        }
        mediaMetadataRetriever.release();
    };
    return AdvancedVideoView;
}(advanced_video_view_common_1.AdvancedVideoViewBase));
exports.AdvancedVideoView = AdvancedVideoView;
//# sourceMappingURL=advanced-video-view.android.js.map