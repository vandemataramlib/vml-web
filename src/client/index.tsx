import * as React from "react";
import * as ReactTapEventPlugin from "react-tap-event-plugin";
import { render } from "react-dom";
import "core-js/shim";

import Main from "./main";
import { AppState } from "../stores/appState";
import { DocumentStore } from "../stores/documents";
import { DocumentListStore } from "../stores/documentList";
import { Context } from "../interfaces/context";

ReactTapEventPlugin();

declare var module: { hot: any };

interface WindowCustom extends Window {
    __INITIAL_STATE__: Context;
}

declare const window: WindowCustom;

const context: Context = {
    appState: new AppState(window.__INITIAL_STATE__.appState),
    documentStore: new DocumentStore(window.__INITIAL_STATE__.documentStore),
    documentListStore: new DocumentListStore(window.__INITIAL_STATE__.documentListStore)
};

if (process.env.NODE_ENV !== "production") {
    const { AppContainer } = require("react-hot-loader");

    render(
        <AppContainer>
            <Main { ...context } />
        </AppContainer>,
        document.getElementById("app")
    );

    if (module.hot) {
        module.hot.accept("./main", () => {

            const NextApp = require("./main").default;

            render(
                <AppContainer>
                    <NextApp { ...context } />
                </AppContainer>,
                document.getElementById("app")
            );
        });
    }
}
else {
    render (
        <Main { ...context } />,
        document.getElementById("app")
    );
}
