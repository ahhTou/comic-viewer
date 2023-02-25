import Wnacg from '@/instances/wnacg';
import Local from '@/instances/local';

async function launch() {
    new Wnacg();

    new Local();
}

launch();
