export enum StoreKeys {
    PictureWidth = 'comic-viewer-width',
}

const store = {
    setPictureWidth(width: string) {
        localStorage.setItem('comic-viewer-width', width);
    },
    set(key: StoreKeys, value: any) {
        localStorage.setItem(key, value);
    },
    get(key: StoreKeys): any {
        return localStorage.getItem(key);
    },
};

export default store;
