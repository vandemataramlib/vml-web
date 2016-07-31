import * as Hapi from "hapi";
import * as Inert from "inert";
import * as Vision from "vision";

const TemplateServer = require("./plugins/templateServer");
const StaticFileServer = require("./plugins/fileServer");
const webpackConfig = require("../../config/webpack.config.dev");

const server = new Hapi.Server();
server.connection({
    port: 3000
});

const plugins = [
    Inert,
    Vision,
    {
        register: require("hapi-webpack-dev-middleware"),
        options: {
            config: webpackConfig,
            options: {
                noInfo: true,
                publicPath: webpackConfig.output.publicPath
            }
        }
    },
    {
        register: require("hapi-webpack-hot-middleware")
    },
    {
        register: TemplateServer,
        options: {
            template: "index",
            getInitialContext: () => { return { hot: true }; },
            context: {
                context: JSON.stringify({env: process.env.NODE_ENV}),
                bundleName: "bundle.js"
            }
        }
    },
    StaticFileServer
];

server.register(plugins, (err) => {

    if (err) {
        throw err;
    }
});

server.views({
    engines: { hbs: require("handlebars") }
});

server.start(err => {

    if (err) {
        throw err;
    }

    console.log("Development server started at", server.info.uri);
});
