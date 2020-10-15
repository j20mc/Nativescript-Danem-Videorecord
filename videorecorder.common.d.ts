export interface Options {
    size?: number;
    hd?: boolean;
    saveToGallery?: boolean;
    duration?: number;
    explanation?: string;
    format?: VideoFormatType;
    position?: CameraPositionType;
}
export interface RecordResult {
    file: string;
}
export declare type CameraPositionType = 'front' | 'back' | 'none';
export declare type VideoFormatType = 'default' | 'mp4';
export declare enum CameraPosition {
    FRONT = "front",
    BACK = "back",
    NONE = "none",
}
export declare enum VideoFormat {
    DEFAULT = "default",
    MP4 = "mp4",
}
export declare abstract class VideoRecorderCommon {
    options: Options;
    constructor(options?: Options);
    record(options?: Options): Promise<RecordResult>;
    requestPermissions(options?: Options): Promise<any>;
    static isAvailable(): boolean;
    protected _startRecording(options?: Options): Promise<RecordResult>;
}
