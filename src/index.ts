import path from 'path';
import webpack from 'webpack';
import configuration from '@/scripts/webpack.scripts.config';

function start() {
    const complier = webpack(configuration);

    const watchOptions = {
        aggregateTimeout: 20,
        ignored: /node_modules/,
    };

    complier.watch(watchOptions, (err, status) => {
        if (!configuration.output) {
            return;
        }

        const { path: outPath, filename } = configuration.output;

        if (!status || !outPath || !filename) {
            return;
        }

        const info = status.toJson();
        if (status.hasErrors()) {
            info.errors?.forEach((error) => {
                redPrint(error.stack || '');
            });
        } else {
            print(
                path.resolve(outPath, filename as string).replace(/\\/g, '/')
            );
        }
    });
}

function print(url: string) {
    console.log('====== 确保您开启了油猴本地文件访问权限');
    console.log('====== 然后拷贝下面的蓝色的文本到油猴');
    console.log('');
    bluePrint('// ==UserScript==');
    bluePrint('// @name         comic-viewer');
    bluePrint('// @namespace    http://tampermonkey.net/');
    bluePrint('// @version      0.1');
    bluePrint('// @description  try to take over the world!');
    bluePrint('// @author       ahhTou');
    // bluePrint('// @match        https://nhentai.net/*');
    bluePrint('// @match        https://wnacg.com/*');
    bluePrint('// @match        http://localhost/*');
    bluePrint(
        '// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net'
    );
    bluePrint('// @grant        none');
    bluePrint('// @require      file://' + path.resolve(url));
    bluePrint('// ==/UserScript==');
}

function bluePrint(str: string) {
    console.log('\x1B[36m%s\x1B[0m', str);
}

function redPrint(str: string) {
    console.log('\x1B[31m%s\x1B[0m', str);
}

start();
