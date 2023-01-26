import c from 'classnames';
import styles from './viewer.module.less';
import {
    createRef,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import Picture from './picture';
import store, { StoreKeys } from '@/store/store';

interface ViewerRef {
    open: () => void;
    close: () => void;
}

const localWidth = store.get(StoreKeys.PictureWidth) || 60;

const ViewerComponent = forwardRef<ViewerRef>(
    (props: ViewerComponentProps, ref) => {
        const { onClose, onOpen, imgURLs, preloadCount = 5 } = props;

        const [visible, setVisible] = useState<boolean>(false);
        const [width, setWidth] = useState<string>(localWidth + 'vw');
        const [height, setHeight] = useState<string>(localWidth * 1.3 + 'vw');

        const posRef = useRef<number>(0);

        const imagesRef = useRef<HTMLDivElement>(null);

        const [imgStatus, setImgStatus] = useState<
            Record<string, PictureStatus>
        >({});

        // 处理预加载
        useEffect(() => {
            if (preloadCount > 0 && imgURLs && imgURLs.length > 0) {
                setImgStatus((state) => {
                    const newState = Object.assign({}, state);

                    const len = imgURLs.length;

                    const count = preloadCount > len ? len : preloadCount;

                    for (let i = 0; i < count; i++) {
                        newState[imgURLs[i]] = 'Loading';
                    }

                    return newState;
                });
            }
        }, [preloadCount, imgURLs]);

        const close = async () => {
            await onClose?.();

            setVisible(false);
        };

        const open = async () => {
            await onOpen?.();

            setVisible(true);
        };

        useImperativeHandle(ref, () => {
            return {
                close,
                open,
            };
        });

        const handleMouseMove = useCallback((e: MouseEvent) => {
            const move = posRef.current - e.clientX;

            posRef.current = e.clientX;

            const width = document.documentElement.clientWidth;

            setWidth((state) => {
                const vw = (move / width) * 100;

                const number = Number(state.replace('vw', ''));

                setHeight((number - vw) * 1.3 + 'vw');

                const retValue = number - vw;

                store.set(StoreKeys.PictureWidth, retValue);

                return retValue + 'vw';
            });
        }, []);

        const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (
            e
        ) => {
            posRef.current = e.clientX;

            document.addEventListener('mousemove', handleMouseMove);
        };

        useEffect(() => {
            const handler = () => {
                document.removeEventListener('mousemove', handleMouseMove);
            };

            document.addEventListener('mouseup', handler);

            return () => {
                document.removeEventListener('mouseup', handler);
            };
        }, []);

        const handleChangeStatus = (urls: string[], status: PictureStatus) => {
            setImgStatus((state) => {
                const newState = Object.assign({}, state);

                urls.forEach((url) => {
                    if (newState[url] !== 'Display') {
                        newState[url] = status;
                    }
                });

                return newState;
            });
        };

        // 处理懒加载
        useEffect(() => {
            if (!imgURLs || imgURLs.length < 0 || !imagesRef.current) {
                return;
            }

            const elements = [...imagesRef.current.children];

            const len = imgURLs.length;

            // 3. 创建一个图片数量长度的数组，用来存放计数器
            const timerRecord: Record<string, NodeJS.Timeout> = {};

            // 5. 创建 观察者
            const io = new IntersectionObserver((entries) => {
                // const lastI = getIndex(entries[entries.length - 1]);
                entries.forEach((pic) => {
                    const { target } = pic;

                    if (!(target instanceof HTMLDivElement)) {
                        return;
                    }

                    const curURL = target.dataset['src'];

                    if (!curURL) {
                        return;
                    }

                    if (pic.intersectionRatio > 0) {
                        timerRecord[curURL] = setTimeout(() => {
                            const willLoadURLs: string[] = [];

                            const curIdx = imgURLs.indexOf(curURL);
                            const endIdx = curIdx + 3 > len ? len : curIdx + 3;

                            for (let i = curIdx; i < endIdx; i++) {
                                const willLoadURL = imgURLs[i];

                                willLoadURLs.push(willLoadURL);
                            }

                            handleChangeStatus(willLoadURLs, 'Loading');
                        }, 500);
                    } else {
                        clearTimeout(timerRecord[curURL]); // else 如果 pic 进入 不可视，清除 计时器
                    }
                });
            });

            // 检测对象
            elements.forEach((el) => {
                io.observe(el);
            });

            return () => {
                io.disconnect();
            };
        }, [imgURLs]);

        useEffect(() => {
            const handler = () => {
                if (!document.hidden) {
                    setWidth((store.get(StoreKeys.PictureWidth) || 60) + 'vw');
                }
            };

            document.addEventListener('visibilitychange', handler);

            return () => {
                document.removeEventListener('visibilitychange', handler);
            };
        }, []);

        return (
            <div
                className={c(styles.wrapper, {
                    [styles.visible]: visible,
                })}
                onDoubleClick={close}
            >
                <div className={c(styles.scrollBox)}>
                    <div className={c(styles.imagesWrapper)}>
                        <div
                            className={c(styles.resizeBar)}
                            onMouseDown={handleMouseDown}
                        />
                        <div className={c(styles.images)} ref={imagesRef}>
                            {imgURLs?.map((url, i) => {
                                return (
                                    <div
                                        className={c(styles.picWrapper)}
                                        key={i}
                                        data-src={url}
                                    >
                                        <Picture
                                            onChangeStatus={(status) =>
                                                handleChangeStatus(
                                                    [url],
                                                    status
                                                )
                                            }
                                            status={imgStatus[url] || 'Pending'}
                                            width={width}
                                            height={height}
                                            url={url}
                                        />
                                        <div className={c(styles.pageIndictor)}>
                                            {i + 1} / {imgURLs.length}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div
                            className={c(styles.resizeBar)}
                            onMouseDown={handleMouseDown}
                        />
                    </div>
                </div>
            </div>
        );
    }
);

const getInstance = (props?: ViewerComponentProps) => {
    const ref = createRef<ViewerRef>();

    const Element = <ViewerComponent ref={ref} {...props} />;

    return { ref, Element };
};

export default ViewerComponent;

export { getInstance, ViewerRef };
