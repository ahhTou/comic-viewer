import c from 'classnames';
import styles from './picture.module.less';
import { useState } from 'react';

type IProps = {
    url: string;
    width?: string;
    height?: string;
    status?: PictureStatus;
    onChangeStatus?: (status: PictureStatus) => void;
};

export default function Picture(props: IProps) {
    const { url, width, height, status = 'Error', onChangeStatus } = props;

    const [key, setKey] = useState<number>(0);

    const reload = () => {
        setKey((state) => ++state);
    };

    const handleClick = () => {
        if (status === 'Error') {
            reload();
        }
    };

    const domFlag = status === 'Display' || status === 'Loading';

    const showFlag = status === 'Display';

    const style = width
        ? {
              width,
              height: showFlag ? 'unset' : height,
          }
        : {};

    const handleLoad = () => {
        onChangeStatus?.('Display');
    };

    return (
        <div className={c(styles.wrapper)} style={style}>
            <div
                className={c(styles.status, {
                    [styles.pending]: status === 'Pending',
                    [styles.loading]: status === 'Loading',
                    [styles.display]: status === 'Display',
                    [styles.error]: status === 'Error',
                })}
                onClick={handleClick}
            >
                {status}
            </div>

            {domFlag && (
                <img
                    style={{
                        display: showFlag ? 'unset' : 'none',
                        width,
                    }}
                    onLoad={handleLoad}
                    key={key}
                    src={url}
                    alt=""
                />
            )}
        </div>
    );
}
