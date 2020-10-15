import './async-await';
import { Options, RecordResult, VideoRecorderCommon } from './videorecorder.common';
export * from './videorecorder.common';
export declare class VideoRecorder extends VideoRecorderCommon {
    requestPermissions(options?: Options): Promise<any>;
    static isAvailable(): boolean;
    protected _startRecording(options?: Options): Promise<RecordResult>;
}
