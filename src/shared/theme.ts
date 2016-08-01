import { getMuiTheme } from "material-ui/styles";
import { orange100, orange500, orange700 } from "material-ui/styles/colors";

export const muiThemeOptions = getMuiTheme({
    fontFamily: "Charlotte Sans, sans-serif, Siddhanta",
    palette: {
        primary1Color: orange500,
        primary2Color: orange700,
        primary3Color: orange100
    }
});
