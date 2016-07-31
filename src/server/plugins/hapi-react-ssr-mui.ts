import * as Hapi from "hapi";
import * as History from "history";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import * as ReactRouter from "react-router";
import * as Boom from "boom";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

interface Options {
    routes: Array<any>;
    getInitialContext(): Object;
    bootstrapAction: string;
    rootElement: React.ComponentClass<{}> | React.StatelessComponent<{}>;
    template: string;
    visionOptions?: any;
    params?: any;
    renderToStaticMarkup?: boolean;
    muiThemeOptions: any;
}

class HapiReactSSRWithMaterialUI {
    options: Options;

    constructor(server: Hapi.Server, options: Options, next: Function) {

        this.options = options;

        server.route({
            path: "/{path*}",
            method: "GET",
            handler: this.handler
        });

        next();
    }

    handler = (request: Hapi.Request, reply: Hapi.IReply) => {

        const {
            routes,
            bootstrapAction,
            template,
            visionOptions,
            params,
            rootElement,
            getInitialContext,
            renderToStaticMarkup,
            muiThemeOptions
        } = this.options;

        ReactRouter.match({ routes, location: request.url }, (error: Error, redirectLocation: History.Location, renderProps: any) => {

            if (error) {
                return reply(Boom.badImplementation(error.message));
            }
            else if (redirectLocation) {
                return reply.redirect(redirectLocation.pathname + redirectLocation.search);
            }
            else if (!renderProps) {
                return reply(Boom.notFound("Invalid route", { route: request.url.pathname }));
            }

            const context = getInitialContext();

            Promise.all(
                renderProps.components.filter((component: any) => component[bootstrapAction])
                    .map((component: any) => component[bootstrapAction](context, renderProps))
            ).then(response => {

                const muiTheme = getMuiTheme(
                    Object.assign(
                        muiThemeOptions,
                        { userAgent: request.raw.req.headers["user-agent"] }
                    )
                );

                const reactRootElement = React.createElement(
                    rootElement,
                    context,
                    React.createElement(
                        MuiThemeProvider,
                        { muiTheme },
                        React.createElement(ReactRouter.RouterContext, renderProps)
                    )
                );

                const renderContext = Object.assign(
                    params,
                    { context: JSON.stringify(context) },
                    {
                        componentRenderedToString: renderToStaticMarkup ?
                            ReactDOMServer.renderToStaticMarkup(reactRootElement) : ReactDOMServer.renderToString(reactRootElement)
                    }
                );

                return reply.view(template, renderContext, visionOptions);
            }).catch(err => {

                return reply(Boom.badImplementation(err.message));
            });
        });
    }

    static attributes = {
        name: "hapiReactSSRMui",
        dependencies: "vision"
    };
}

export const register = HapiReactSSRWithMaterialUI;
