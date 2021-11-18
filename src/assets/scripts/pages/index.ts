import '../../styles/pages/index.scss';
import { add } from '../modules/add';

class Index {
    constructor() {
        console.log(add(1, 2));
    }
}

new Index();
