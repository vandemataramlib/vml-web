import { getMuiTheme } from "material-ui/styles";
import { orange100, orange500, orange700 } from "material-ui/styles/colors";

import { Encoding } from "./interfaces";

export const muiThemeOptions = getMuiTheme({
    fontFamily: "Charlotte Sans, sans-serif, Siddhanta",
    palette: {
        primary1Color: orange500,
        primary2Color: orange700,
        primary3Color: orange100
    }
});

export const encodingSchemes = [
    {
        label: "देवनागरी",
        value: Encoding.devanagari
    },
    {
        label: "Roman",
        value: Encoding.iast
    }
];

export const defaultEncoding = Encoding.itrans;
