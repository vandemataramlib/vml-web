import * as React from "react";
import * as ReactTapEventPlugin from "react-tap-event-plugin";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { orange100, orange500, orange700 } from "material-ui/styles/colors";
import { render } from "react-dom";
import { Router, browserHistory } from "react-router";
import { Provider } from "mobx-react";
import "core-js/shim";

import routes from "../config/routes";
import { AppState } from "../stores/appState";
import { DocumentStore } from "../stores/documents";
import { DocumentListStore } from "../stores/documentList";
import { Context } from "../interfaces/context";

ReactTapEventPlugin();

const App = () => {

    const muiTheme = getMuiTheme({
        fontFamily: "Charlotte Sans, sans-serif, Siddhanta",
        palette: {
            primary1Color: orange500,
            primary2Color: orange700,
            primary3Color: orange100
        }
    });

    return (
        <MuiThemeProvider muiTheme={ muiTheme }>
            <Router routes={ routes } history={ browserHistory } />
        </MuiThemeProvider>
    );
};

interface WindowCustom extends Window {
    __INITIAL_STATE__: Context;
}

declare const window: WindowCustom;

const context: Context = {
    appState: new AppState(window.__INITIAL_STATE__.appState),
    documentStore: new DocumentStore(window.__INITIAL_STATE__.documentStore),
    documentListStore: new DocumentListStore(window.__INITIAL_STATE__.documentListStore)
};

render(
    <Provider { ...context }>
        <App />
    </Provider>,
    document.getElementById("app")
);
