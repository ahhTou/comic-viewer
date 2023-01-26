import Viewer from '@/instances/viewer';

function getComicID() {
    const arr = /https:\/\/wnacg.com\/photos-index-.*?-(\d+).html/.exec(
        location.href
    );

    if (arr?.length === 2) {
        return arr[1];
    }

    return 0;
}

function isComicInfoPage() {
    const flag = /https:\/\/wnacg.com\/photos-index-(.*)?.html/.test(
        location.href
    );

    console.log('* is wnacg comic info page: ', flag);

    return flag;
}

export default class Wnacg {
    viewer: Viewer | null = null;

    constructor() {
        this.init();
    }

    async init() {
        const imgURLs = await this.getImageURLs();

        // 插入 open button
        if (isComicInfoPage()) {
            this.insertOpenButton();

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
        }
    }

    insertOpenButton() {
        const parent = document.querySelector('.asTBcell.uwthumb');

        const child = parent?.querySelectorAll('a.btn');

        const newLink = document.createElement<'a'>('a');

        newLink.className = 'btn';
        newLink.innerText = '全览阅读';
        newLink.style.width = '130px';

        newLink.onclick = () => {
            if (this.viewer) {
                this.viewer.open();
            }
        };

        if (parent && child && child?.length > 2) {
            parent.removeChild(child[1]);
            parent.insertBefore(newLink, child[0]);
        }
    }

    async getImageURLs() {
        const res = await fetch(
            `https://wnacg.com/photos-gallery-aid-${getComicID()}.html`,
            {
                method: 'GET',
            }
        );

        const rb = res.body;
        if (!rb) {
            return;
        }

        const reader = rb.getReader();

        const stream = new ReadableStream({
            start(controller) {
                function push() {
                    reader.read().then(({ done, value }) => {
                        if (done) {
                            controller.close();
                            return;
                        }
                        controller.enqueue(value);
                        push();
                    });
                }
                push();
            },
        });

        const result = new Response(stream, {
            headers: { 'Content-Type': 'text/html' },
        }).text();

        const str = await result;

        const arr = str.matchAll(/\/\/(.*?\..*?)\\/g);

        const list: string[] = [];

        let cur = arr.next();

        while (cur.value) {
            if (cur.done) {
                break;
            }

            if (cur.value.length >= 2 && typeof cur.value[1] === 'string') {
                list.push(`https://${cur.value[1]}`);
            }

            cur = arr.next();
        }

        return list;
    }
}
