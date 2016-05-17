import Sanscript from 'sanscript';
import {
    red500,
    pink500,
    purple500,
    deepPurple500,
    indigo500,
    blue500,
    lightBlue500,
    cyan500,
    teal500,
    green500,
    lightGreen500,
    lime500,
    yellow500,
    amber500,
    orange500,
    deepOrange500,
    brown500,
    blueGrey500
} from 'material-ui/styles/colors';

export const translit = (word, from, to) => {

    if (!from) {
        return Sanscript.t(word, 'itrans', 'devanagari');
    }

    return Sanscript.t(word, from, to);
};

export const getColour = (index) => {

    const colours = [red500, pink500, purple500, deepPurple500, indigo500, blue500,
        lightBlue500, cyan500, teal500, green500, lightGreen500, lime500,
        yellow500, amber500, orange500, deepOrange500, brown500, blueGrey500];
    return colours[index % 18];
};
