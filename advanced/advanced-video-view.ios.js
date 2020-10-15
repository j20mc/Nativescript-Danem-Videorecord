"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("tns-core-modules/file-system");
var view_1 = require("tns-core-modules/ui/core/view");
require("../async-await");
var advanced_video_view_common_1 = require("./advanced-video-view.common");
__export(require("./advanced-video-view.common"));
var observable_1 = require("tns-core-modules/data/observable");
var NativeOrientation;
(function (NativeOrientation) {
    NativeOrientation[NativeOrientation["Unknown"] = 0] = "Unknown";
    NativeOrientation[NativeOrientation["Portrait"] = 1] = "Portrait";
    NativeOrientation[NativeOrientation["PortraitUpsideDown"] = 2] = "PortraitUpsideDown";
    NativeOrientation[NativeOrientation["LandscapeLeft"] = 3] = "LandscapeLeft";
    NativeOrientation[NativeOrientation["LandscapeRight"] = 4] = "LandscapeRight";
})(NativeOrientation = exports.NativeOrientation || (exports.NativeOrientation = {}));
var AVCaptureFileOutputRecordingDelegateImpl = (function (_super) {
    __extends(AVCaptureFileOutputRecordingDelegateImpl, _super);
    function AVCaptureFileOutputRecordingDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AVCaptureFileOutputRecordingDelegateImpl_1 = AVCaptureFileOutputRecordingDelegateImpl;
    AVCaptureFileOutputRecordingDelegateImpl.initWithOwner = function (owner) {
        var delegate = new AVCaptureFileOutputRecordingDelegateImpl_1();
        delegate._owner = owner;
        return delegate;
    };
    AVCaptureFileOutputRecordingDelegateImpl.prototype.captureOutputDidFinishRecordingToOutputFileAtURLFromConnectionsError = function (captureOutput, outputFileURL, connections, error) {
        var owner = this._owner.get();
        if (!error) {
            owner.notify({
                eventName: 'finished',
                object: observable_1.fromObject({
                    file: outputFileURL.absoluteString
                })
            });
        }
        else {
            owner.notify({
                eventName: 'error',
                object: observable_1.fromObject({
                    message: error.localizedDescription
                })
            });
        }
        owner.startPreview();
    };
    AVCaptureFileOutputRecordingDelegateImpl.prototype.captureOutputDidStartRecordingToOutputFileAtURLFromConnections = function (captureOutput, fileURL, connections) {
        var owner = this._owner.get();
        owner.notify({
            eventName: 'started',
            object: observable_1.fromObject({})
        });
    };
    AVCaptureFileOutputRecordingDelegateImpl = AVCaptureFileOutputRecordingDelegateImpl_1 = __decorate([
        ObjCClass(AVCaptureFileOutputRecordingDelegate)
    ], AVCaptureFileOutputRecordingDelegateImpl);
    return AVCaptureFileOutputRecordingDelegateImpl;
    var AVCaptureFileOutputRecordingDelegateImpl_1;
}(NSObject));
var AdvancedVideoView = (function (_super) {
    __extends(AdvancedVideoView, _super);
    function AdvancedVideoView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AdvancedVideoView.prototype.requestStoragePermission = function () {
        return new Promise(function (resolve, reject) {
            var authStatus = PHPhotoLibrary.authorizationStatus();
            if (authStatus === 0) {
                PHPhotoLibrary.requestAuthorization(function (auth) {
                    if (auth === 3) {
                        resolve();
                    }
                });
            }
            else if (authStatus !== 3) {
                reject();
            }
        });
    };
    AdvancedVideoView.isAvailable = function () {
        return UIImagePickerController.isSourceTypeAvailable(1);
    };
    AdvancedVideoView.prototype.createNativeView = function () {
        return UIView.new();
    };
    AdvancedVideoView.prototype.initNativeView = function () {
    };
    AdvancedVideoView.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this.startPreview();
    };
    AdvancedVideoView.prototype.onUnloaded = function () {
        this.stopPreview();
        _super.prototype.onUnloaded.call(this);
    };
    Object.defineProperty(AdvancedVideoView.prototype, "duration", {
        get: function () {
            if (this._output && this._output.recordedDuration) {
                return Math.floor(Math.round(CMTimeGetSeconds(this._output.recordedDuration)));
            }
            else {
                return 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    AdvancedVideoView.prototype[advanced_video_view_common_1.outputOrientation.getDefault] = function () {
        if (!this._connection)
            return advanced_video_view_common_1.Orientation.Unknown;
        return advanced_video_view_common_1.Orientation[NativeOrientation[this._connection.videoOrientation]];
    };
    AdvancedVideoView.prototype[advanced_video_view_common_1.outputOrientation.setNative] = function (orientation) {
        this._setOutputOrientation(orientation);
    };
    AdvancedVideoView.prototype[advanced_video_view_common_1.saveToGalleryProperty.getDefault] = function () {
        return false;
    };
    AdvancedVideoView.prototype[advanced_video_view_common_1.saveToGalleryProperty.setNative] = function (save) {
        return save;
    };
    AdvancedVideoView.prototype[advanced_video_view_common_1.torchProperty.getDefault] = function () {
        return this._device && this._device.torchMode === 1;
    };
    AdvancedVideoView.prototype[advanced_video_view_common_1.torchProperty.setNative] = function (torch) {
        if (!this.isTorchAvailable)
            return false;
        if (this._device.lockForConfiguration()) {
            if (torch) {
                this._device.setTorchModeOnWithLevelError(AVCaptureMaxAvailableTorchLevel);
            }
            else {
                this._device.torchMode = 0;
            }
            this._device.unlockForConfiguration();
        }
        return torch;
    };
    Object.defineProperty(AdvancedVideoView.prototype, "isTorchAvailable", {
        get: function () {
            return this._device && this._device.hasTorch;
        },
        enumerable: true,
        configurable: true
    });
    AdvancedVideoView.prototype.toggleTorch = function () {
        if (!this.isTorchAvailable)
            return;
        this.torch = !this.torch;
    };
    AdvancedVideoView.prototype._setOutputOrientation = function (orientation) {
        var nativeOrientation;
        switch (orientation) {
            case advanced_video_view_common_1.Orientation.LandscapeLeft:
                nativeOrientation = NativeOrientation.LandscapeLeft;
                break;
            case advanced_video_view_common_1.Orientation.LandscapeRight:
                nativeOrientation = NativeOrientation.LandscapeRight;
                break;
            case advanced_video_view_common_1.Orientation.Portrait:
                nativeOrientation = NativeOrientation.Portrait;
                break;
            case advanced_video_view_common_1.Orientation.PortraitUpsideDown:
                nativeOrientation = NativeOrientation.PortraitUpsideDown;
                break;
            default:
                nativeOrientation = NativeOrientation.Unknown;
                break;
        }
        if (this._connection &&
            this._connection.supportsVideoOrientation &&
            nativeOrientation !== NativeOrientation.Unknown) {
            this._connection.videoOrientation = nativeOrientation;
        }
    };
    AdvancedVideoView.prototype.openCamera = function () {
        var _this = this;
        try {
            this.session = new AVCaptureSession();
            var devices = AVCaptureDevice.devicesWithMediaType(AVMediaTypeVideo);
            var pos = this.cameraPosition === 'front'
                ? 2
                : 1;
            for (var i = 0; i < devices.count; i++) {
                if (devices[i].position === pos) {
                    this._device = devices[i];
                    break;
                }
            }
            var input = AVCaptureDeviceInput
                .deviceInputWithDeviceError(this._device);
            var audioDevice = AVCaptureDevice.defaultDeviceWithMediaType(AVMediaTypeAudio);
            var audioInput = AVCaptureDeviceInput
                .deviceInputWithDeviceError(audioDevice);
            this._output = AVCaptureMovieFileOutput.alloc().init();
            this._output.movieFragmentInterval = kCMTimeInvalid;
            this._connection = this._output.connectionWithMediaType(AVMediaTypeVideo);
            this._setOutputOrientation(this.outputOrientation);
            if (this._output.availableVideoCodecTypes.containsObject(AVVideoCodecTypeH264)) {
                var codec = {};
                codec[AVVideoCodecKey] = AVVideoCodecTypeH264;
                this._output.setOutputSettingsForConnection(codec, this._connection);
            }
            var format = '.mp4';
            this._fileName = "VID_" + +new Date() + format;
            this.folder = fs.knownFolders.temp().getFolder(Date.now().toString());
            var path = fs.path.join(this.folder.path, this._fileName);
            this._file = NSURL.fileURLWithPath(path);
            if (!input) {
                this.notify({
                    eventName: 'error',
                    object: observable_1.fromObject({
                        message: 'Error trying to open camera.'
                    })
                });
            }
            if (!audioInput) {
                this.notify({
                    eventName: 'error',
                    object: observable_1.fromObject({
                        message: 'Error trying to open mic.'
                    })
                });
            }
            this.session.beginConfiguration();
            switch (this.quality) {
                case advanced_video_view_common_1.Quality.MAX_720P:
                    this.session.sessionPreset = AVCaptureSessionPreset1280x720;
                    break;
                case advanced_video_view_common_1.Quality.MAX_1080P:
                    this.session.sessionPreset = AVCaptureSessionPreset1920x1080;
                    break;
                case advanced_video_view_common_1.Quality.MAX_2160P:
                    this.session.sessionPreset = AVCaptureSessionPreset3840x2160;
                    break;
                case advanced_video_view_common_1.Quality.HIGHEST:
                    this.session.sessionPreset = AVCaptureSessionPresetHigh;
                    break;
                case advanced_video_view_common_1.Quality.LOWEST:
                    this.session.sessionPreset = AVCaptureSessionPresetLow;
                    break;
                case advanced_video_view_common_1.Quality.QVGA:
                    this.session.sessionPreset = AVCaptureSessionPreset352x288;
                    break;
                default:
                    this.session.sessionPreset = AVCaptureSessionPreset640x480;
                    break;
            }
            this.session.addInput(input);
            this.session.addInput(audioInput);
            this.session.addOutput(this._output);
            this.session.commitConfiguration();
            var preview_1 = AVCaptureVideoPreviewLayer.alloc().initWithSession(this.session);
            dispatch_async(dispatch_get_current_queue(), function () {
                preview_1.videoGravity = _this.fill ? AVLayerVideoGravityResizeAspectFill : AVLayerVideoGravityResizeAspect;
            });
            if (!this.session.running) {
                this.session.startRunning();
            }
            dispatch_async(dispatch_get_current_queue(), function () {
                preview_1.frame = _this.nativeView.bounds;
                _this.nativeView.layer.addSublayer(preview_1);
            });
        }
        catch (ex) {
            this.notify({
                eventName: 'error',
                object: observable_1.fromObject({
                    message: ex.getMessage()
                })
            });
        }
    };
    AdvancedVideoView.prototype.startRecording = function () {
        var delegate = AVCaptureFileOutputRecordingDelegateImpl.initWithOwner(new WeakRef(this));
        this._output.startRecordingToOutputFileURLRecordingDelegate(this._file, delegate);
    };
    AdvancedVideoView.prototype.stopRecording = function () {
        this.session.stopRunning();
        if (this.thumbnailCount && this.thumbnailCount > 0) {
            this.extractThumbnails();
        }
    };
    AdvancedVideoView.prototype.stopPreview = function () {
        if (this.session.running) {
            this.session.stopRunning();
        }
    };
    AdvancedVideoView.prototype.toggleCamera = function () {
        if (this.cameraPosition === advanced_video_view_common_1.CameraPosition.BACK.toString()) {
            this.cameraPosition = 'front';
        }
        else {
            this.cameraPosition = 'back';
        }
        this.stopPreview();
        this.startPreview();
    };
    AdvancedVideoView.prototype.startPreview = function () {
        this.openCamera();
    };
    AdvancedVideoView.prototype.onLayout = function (left, top, right, bottom) {
        var _this = this;
        if (this.nativeView.layer && this.nativeView.layer.sublayers && this.nativeView.layer.sublayers[0]) {
            dispatch_async(dispatch_get_current_queue(), function () {
                _this.nativeView.layer.sublayers[0].frame = _this.nativeView.bounds;
            });
        }
    };
    AdvancedVideoView.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var width = view_1.layout.getMeasureSpecSize(widthMeasureSpec);
        var height = view_1.layout.getMeasureSpecSize(heightMeasureSpec);
        this.setMeasuredDimension(width, height);
    };
    AdvancedVideoView.prototype.extractThumbnails = function () {
        this.thumbnails = [];
        var asset = AVURLAsset.alloc().initWithURLOptions(this._file, null);
        var assetIG = AVAssetImageGenerator.alloc().initWithAsset(asset);
        assetIG.appliesPreferredTrackTransform = true;
        assetIG.apertureMode = AVAssetImageGeneratorApertureModeEncodedPixels;
        var it = parseInt((asset.duration.value / this.thumbnailCount).toString());
        for (var index_1 = 0; index_1 < this.thumbnailCount; index_1++) {
            var thumbnailImageRef = assetIG.copyCGImageAtTimeActualTimeError(CMTimeMake(it * index_1, asset.duration.timescale), null);
            if (!thumbnailImageRef) {
                console.log("Thumbnail Image Generation Error");
            }
            var image = UIImage.alloc().initWithCGImage(thumbnailImageRef);
            var outputFilePath = this._fileName.substr(0, this._fileName.lastIndexOf(".")) +
                "_thumb_" +
                index_1 +
                ".png";
            var path = fs.path.join(this.folder.path, outputFilePath);
            var ok = UIImagePNGRepresentation(image).writeToFileAtomically(path, true);
            if (!ok) {
                console.log("Could not write thumbnail to file");
            }
            else {
                this.thumbnails.push(path);
            }
        }
    };
    return AdvancedVideoView;
}(advanced_video_view_common_1.AdvancedVideoViewBase));
exports.AdvancedVideoView = AdvancedVideoView;
//# sourceMappingURL=advanced-video-view.ios.js.map