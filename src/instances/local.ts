import Viewer from '@/instances/viewer';
import { isImage } from '@/utils/helper';

export default class Local {
    viewer: Viewer;

    constructor() {
        const imgURLs: string[] = this.getImgURLS();

        let overflow = '';

        this.viewer = new Viewer({
            async onOpen() {
                overflow = document.body.style.overflow;

                document.body.style.overflow = 'hidden';
            },
            async onClose() {
                document.body.style.overflow = overflow;
            },
            imgURLs,
        });

        if (imgURLs.length > 0) {
            this.insertButton();

            setTimeout(() => {
                this.viewer.open();
            }, 1);
        }
    }

    insertButton() {
        const button = document.createElement<'div'>('div');

        Object.assign(button.style, {
            height: '66px',
            width: '66px',
            borderRadius: '33px',
            position: 'fixed',
            right: '30px',
            top: '30px',
            display: 'flex',
            cursor: 'pointer',
            background: '#4EACE7',
            color: '#fff',
            'justify-content': 'center',
            'align-items': 'center',
        });

        button.innerText = '全览';

        button.onclick = () => {
            this.viewer.open();
        };

        document.body.prepend(button);
    }

    getImgURLS() {
        const imgs = [
            ...document.querySelectorAll<HTMLLinkElement>(
                'table .display-name a'
            ),
        ]
            .map((a) => a.href)
            .filter((str) => isImage(str));

        return imgs;
    }
}
