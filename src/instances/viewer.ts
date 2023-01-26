import client from 'react-dom/client';
import { getInstance, ViewerRef } from '@/components/viewer';
import React, { RefObject } from 'react';

export default class Viewer {
    private ref?: RefObject<ViewerRef>;

    private element: React.ReactNode;

    constructor(props?: ViewerComponentProps) {
        const { ref, Element } = getInstance(props);

        this.ref = ref;

        this.element = Element;

        this.init();
    }

    init() {
        const $div = document.createElement('div');
        document.body.append($div);

        const root = client.createRoot($div);
        root.render(this.element);
    }

    async open() {
        const current = this.ref?.current;

        if (!current) {
            return;
        }

        current.open();
    }

    async close() {
        const current = this.ref?.current;

        if (!current) {
            return;
        }

        current.close();
    }
}
