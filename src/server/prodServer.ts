import * as Hapi from "hapi";
import * as Inert from "inert";
import * as React from "react";
import * as Vision from "vision";
import * as Handlebars from "handlebars";
import { readFileSync } from "fs";
import { Provider } from "mobx-react";

import * as HapiReactSSRWithMaterialUI from "./plugins/hapi-react-ssr-mui";
import * as Stores from "../stores";
import * as StaticFileServer from "./plugins/fileServer";
import { routes } from "../shared/routes";
import { Context } from "../shared/interfaces";
import { muiThemeOptions } from "../shared/constants";

const server = new Hapi.Server();

server.connection({
    port: 8080
});

const getInitialContext = function (): Context {

    return {
        appState: new Stores.AppState(),
        documentStore: new Stores.DocumentStore(),
        documentListStore: new Stores.DocumentListStore(),
        stanzaStore: new Stores.StanzaStore(),
        rootStore: new Stores.RootStore(),
        prefixStore: new Stores.PrefixStore(),
        suffixStore: new Stores.SuffixStore(),
        collectionStore: new Stores.CollectionStore()
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
