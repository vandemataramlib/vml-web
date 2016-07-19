import * as Hapi from "hapi";
import * as Inert from "inert";
import * as React from "react";
import * as Vision from "vision";
import * as Handlebars from "handlebars";
import { readFileSync } from "fs";
import { match, RouterContext } from "react-router";
import { renderToString } from "react-dom/server";
import { orange100, orange500, orange700 } from "material-ui/styles/colors";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Provider } from "mobx-react";

import * as HapiReactSSRWithMaterialUI from "./hapi-react-ssr-mui";
import { AppState } from "../stores/appState";
import { DocumentStore } from "../stores/documents";
import { DocumentListStore } from "../stores/documentList";
import * as StaticFileServer from "./fileServer";
import routes from "../config/routes";
import { Context } from "../interfaces/context";

const server = new Hapi.Server();

server.connection({
    port: 8080
});

const getInitialContext = function (): Context {
    return {
        appState: new AppState(),
        documentStore: new DocumentStore(),
        documentListStore: new DocumentListStore()
    };
};

const muiThemeOptions = {
    fontFamily: "Charlotte Sans, sans-serif, Siddhanta",
    palette: {
        primary1Color: orange500,
        primary2Color: orange700,
        primary3Color: orange100
    }
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

    console.log("server started at", server.info.uri);
});
