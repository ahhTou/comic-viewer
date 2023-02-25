export function isImage(filename: string) {
    var regex = /\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|ico|psd|ai)$/i;
    return regex.test(filename);
}

export function isLocalUrl(url: string): boolean {
    const pattern =
        /^((http[s]?|ftp):\/\/)?localhost[:]?[\d]{0,4}\/?.*$|^file:\/\/.*$/i;
    return pattern.test(url);
}
