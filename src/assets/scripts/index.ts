import '../styles/pages/index.scss';
import add from './module/add';

class Index {
    constructor() {
        console.log(add(1, 2));
    }
}

new Index();
