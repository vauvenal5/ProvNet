import _ from 'lodash';

const colors = [
    'red',
    'orange',
    'yellow',
    'olive',
    'green',
    'teal',
    'blue',
    'violet',
    'purple',
    'pink',
    'brown',
    'grey',
    'black',
];

export default class Tag {
    constructor(id, title) {
        this.id = id;
        this.title = title;
    }

    getColor() {
        return colors[(this.id-1)%colors.length];
    }

    getTitle() {
        return _.capitalize(this.title);
    }
}