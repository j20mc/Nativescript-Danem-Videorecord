"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var permissions = require("nativescript-permissions");
var app = require("@nativescript/core/application");
var platform = require("@nativescript/core/platform");
var utils = require("@nativescript/core/utils/utils");
require("./async-await");
var videorecorder_common_1 = require("./videorecorder.common");
__export(require("./videorecorder.common"));
var RESULT_CANCELED = 0;
var RESULT_OK = -1;
var REQUEST_VIDEO_CAPTURE = 999;
var VideoRecorder = (function (_super) {
    __extends(VideoRecorder, _super);
    function VideoRecorder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VideoRecorder.prototype.requestPermissions = function (options) {
        return permissions.requestPermissions([
            android.Manifest.permission.CAMERA,
            android.Manifest.permission.RECORD_AUDIO
        ], options.explanation && options.explanation.length > 0
            ? options.explanation
            : '');
    };
    VideoRecorder.isAvailable = function () {
        return app.android.context
            .getPackageManager()
            .hasSystemFeature(android.content.pm.PackageManager.FEATURE_CAMERA);
    };
    VideoRecorder.prototype._startRecording = function (options) {
        if (options === void 0) { options = this.options; }
        return new Promise(function (resolve, reject) {
            var data = null;
            var file;
            var pkgName = utils.ad.getApplication().getPackageName();
            var state = android.os.Environment.getExternalStorageState();
            if (state !== android.os.Environment.MEDIA_MOUNTED) {
                return reject({ event: 'failed' });
            }
            var intent = new android.content.Intent(android.provider.MediaStore.ACTION_VIDEO_CAPTURE);
            intent.putExtra('android.intent.extra.videoQuality', options.hd ? 1 : 0);
            if (options.position !== videorecorder_common_1.CameraPosition.NONE) {
                intent.putExtra('android.intent.extras.CAMERA_FACING', options.position === videorecorder_common_1.CameraPosition.BACK
                    ? android.hardware.Camera.CameraInfo.CAMERA_FACING_FRONT
                    : android.hardware.Camera.CameraInfo.CAMERA_FACING_BACK);
            }
            if (options.size > 0) {
                intent.putExtra(android.provider.MediaStore.EXTRA_SIZE_LIMIT, options.size * 1024 * 1024);
            }
            var fileName = "VID_" + +new Date() + ".mp4";
            var path;
            var tempPictureUri;
            var sdkVersionInt = parseInt(platform.Device.sdkVersion, 10);
            if (options.saveToGallery) {
                path =
                    android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DCIM).getAbsolutePath() + '/Camera';
            }
            else {
                path = app.android.context
                    .getExternalFilesDir(null)
                    .getAbsolutePath();
            }
            file = new java.io.File(path + '/' + fileName);
            if (sdkVersionInt >= 21) {
                var androidSupport = null;
                if (androidx && androidx.core) {
                    androidSupport = androidx.core;
                }
                else if (android.support && android.support.v4) {
                    androidSupport = android.support.v4;
                }
                tempPictureUri = (androidSupport.content).FileProvider.getUriForFile(app.android.foregroundActivity, pkgName + ".provider", file);
            }
            else {
                tempPictureUri = android.net.Uri.fromFile(file);
            }
            intent.putExtra(android.provider.MediaStore.EXTRA_OUTPUT, tempPictureUri);
            if (options.duration > 0) {
                intent.putExtra(android.provider.MediaStore.EXTRA_DURATION_LIMIT, options.duration);
            }
            if (intent.resolveActivity(app.android.context.getPackageManager()) != null) {
                app.android.off('activityResult');
                app.android.on('activityResult', function (args) {
                    if (args.requestCode === REQUEST_VIDEO_CAPTURE &&
                        args.resultCode === RESULT_OK) {
                        var mediaFile = args.intent ? args.intent.getData() : file;
                        if (options.saveToGallery) {
                            resolve({ file: getRealPathFromURI(mediaFile) });
                        }
                        else {
                            resolve({ file: file.toString() });
                        }
                    }
                    else if (args.resultCode === RESULT_CANCELED) {
                        reject({ event: 'cancelled' });
                    }
                    else {
                        reject({ event: 'failed' });
                    }
                });
                app.android.foregroundActivity.startActivityForResult(intent, REQUEST_VIDEO_CAPTURE);
            }
            else {
                reject({ event: 'failed' });
            }
        });
    };
    return VideoRecorder;
}(videorecorder_common_1.VideoRecorderCommon));
exports.VideoRecorder = VideoRecorder;
function getRealPathFromURI(contentUri) {
    var path;
    var activity = app.android.startActivity;
    var proj = [android.provider.MediaStore.MediaColumns.DATA];
    var cursor = activity
        .getApplicationContext()
        .getContentResolver()
        .query(contentUri, proj, null, null, null);
    if (cursor.moveToFirst()) {
        var columnIndex = cursor.getColumnIndexOrThrow(android.provider.MediaStore.MediaColumns.DATA);
        path = cursor.getString(columnIndex);
    }
    cursor.close();
    return path;
}
//# sourceMappingURL=videorecorder.android.js.map