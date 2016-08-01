import * as Hapi from "hapi";
import * as Inert from "inert";
import * as React from "react";
import * as Vision from "vision";
import * as Handlebars from "handlebars";
import { readFileSync } from "fs";
import { Provider } from "mobx-react";

import * as HapiReactSSRWithMaterialUI from "./plugins/hapi-react-ssr-mui";
import { AppState, DocumentStore, DocumentListStore, StanzaStore } from "../stores";
import * as StaticFileServer from "./plugins/fileServer";
import { routes } from "../shared/routes";
import { Context } from "../shared/interfaces";
import { muiThemeOptions } from "../shared/theme";

const server = new Hapi.Server();

server.connection({
    port: 8080
});

const getInitialContext = function (): Context {

    return {
        appState: new AppState(),
        documentStore: new DocumentStore(),
        documentListStore: new DocumentListStore(),
        stanzaStore: new StanzaStore()
    };
};

const bundleName = JSON.parse(readFileSync("build/webpack.hash.json", "utf-8")).main;

const plugins = [
    Vision,
    Inert,
    StaticFileServer,
    {
        register: HapiReactSSRWithMaterialUI,
        options: {
            routes,
            getInitialContext,
            bootstrapAction: "fetchData",
            rootElement: Provider,
            template: "./index",
            muiThemeOptions,
            renderToStaticMarkup: true,
            params: {
                bundleName
            }
        }
    }
];

server.register(plugins, (err) => {

    if (err) {
        console.error(err);
    }
});

server.views({
    engines: { hbs: Handlebars }
});

server.start((err) => {

    if (err) {
        console.error(err);
        return;
    }

    console.log("Production server started at", server.info.uri);
});
