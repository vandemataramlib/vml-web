import * as React from "react";
import { getMuiTheme, MuiThemeProvider } from "material-ui/styles";
import { orange100, orange500, orange700 } from "material-ui/styles/colors";
import { Router, browserHistory } from "react-router";
import { Provider } from "mobx-react";

import { routes } from "../config/routes";

const muiTheme = getMuiTheme({
    fontFamily: "Charlotte Sans, sans-serif, Siddhanta",
    palette: {
        primary1Color: orange500,
        primary2Color: orange700,
        primary3Color: orange100
    }
});

export default (props) => {

    return (
        <Provider {...props } >
            <MuiThemeProvider muiTheme={ muiTheme }>
                <Router routes={ routes } history={ browserHistory } />
            </MuiThemeProvider>
        </Provider>
    );
};
