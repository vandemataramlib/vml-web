import * as React from "react";
import { Router, browserHistory } from "react-router";
import { MuiThemeProvider } from "material-ui/styles";
import { Provider } from "mobx-react";

import { routes } from "../shared/routes";
import { muiThemeOptions } from "../shared/constants";

export default (props) => {

    return (
        <Provider {...props } >
            <MuiThemeProvider muiTheme={ muiThemeOptions }>
                <Router routes={ routes } history={ browserHistory } />
            </MuiThemeProvider>
        </Provider>
    );
};
