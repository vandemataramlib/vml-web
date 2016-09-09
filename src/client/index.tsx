import * as React from "react";
import * as ReactTapEventPlugin from "react-tap-event-plugin";
import { render } from "react-dom";
import { useStrict } from "mobx";
import { Constants } from "vml-common";
import "core-js/shim";

import Main from "./main";
import * as Stores from "../stores";
// import { AppState } from "../stores/AppState";
import { Context } from "../shared/interfaces";

ReactTapEventPlugin();

useStrict(true);

declare var module: { hot: any };

interface WindowCustom extends Window {
    __INITIAL_STATE__: Context;
}

declare const window: WindowCustom;

const context: Context = {
    appState: new Stores.AppState(),
    documentStore: new Stores.DocumentStore(window.__INITIAL_STATE__.documentStore),
    documentListStore: new Stores.DocumentListStore(window.__INITIAL_STATE__.documentListStore),
    stanzaStore: new Stores.StanzaStore(window.__INITIAL_STATE__.stanzaStore),
    rootStore: new Stores.RootStore(window.__INITIAL_STATE__.rootStore),
    prefixStore: new Stores.PrefixStore(window.__INITIAL_STATE__.prefixStore),
    suffixStore: new Stores.SuffixStore(window.__INITIAL_STATE__.suffixStore),
    collectionStore: new Stores.CollectionStore(window.__INITIAL_STATE__.collectionStore),
    authStore: Stores.AuthStore.getInstance({ clientId: Constants.AUTH0_CLIENT_ID, domain: Constants.AUTH0_DOMAIN })
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
    render(
        <Main { ...context } />,
        document.getElementById("app")
    );
}
