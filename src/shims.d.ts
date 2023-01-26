declare module '*.js';
declare module '*.less';

declare interface ViewerComponentProps {
    onClose?: () => Promise<any>;
    onOpen?: () => Promise<any>;
    imgURLs?: string[];
    preloadCount?: number;
}

declare type PictureStatus = 'Pending' | 'Error' | 'Loading' | 'Display';
