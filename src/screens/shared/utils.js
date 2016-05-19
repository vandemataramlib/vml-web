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
    /*lime500,
    yellow500,
    amber500,
    orange500,*/
    deepOrange500,
    brown500,
    blueGrey500,
    red50,
    pink50,
    purple50,
    deepPurple50,
    indigo50,
    blue50,
    lightBlue50,
    cyan50,
    teal50,
    green50,
    lightGreen50,
    lime50,
    yellow50,
    amber50,
    orange50,
    deepOrange50,
    brown50,
    blueGrey50
} from 'material-ui/styles/colors';

export const translit = (word, from, to) => {

    if (!from) {
        return Sanscript.t(word, 'itrans', 'devanagari');
    }

    return Sanscript.t(word, from, to);
};

export const getColour = (index) => {

    const colours = [red500, pink500, purple500, deepPurple500, indigo500, blue500,
        lightBlue500, cyan500, teal500, green500, lightGreen500, /*lime500,
        yellow500, amber500, orange500,*/ deepOrange500, brown500, blueGrey500];
    return colours[index % colours.length];
};

export const getLightColour = (index) => {

    const colours = [red50, pink50, purple50, deepPurple50, indigo50, blue50,
        lightBlue50, cyan50, teal50, green50, lightGreen50, lime50,
        yellow50, amber50, orange50, deepOrange50, brown50, blueGrey50];
    return colours[index % colours.length];
};
