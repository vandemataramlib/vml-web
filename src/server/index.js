import Hapi from 'hapi';
import Inert from 'inert';
import React from 'react';
import { match, RouterContext } from 'react-router';
import { renderToString } from 'react-dom/server';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import routes from '../config/routes';

const server = new Hapi.Server();
server.connection({
    port: 8080
});

server.register(Inert, (err) => {

    if (err) {
        console.error(err);
    }
});

server.route({
    path: '/static/{filename}',
    method: 'GET',
    handler: {
        directory: {
            path: 'public'
        }
    }
});

const renderPage = (appHtml) => {

    return `
        <!doctype html public="storage">
        <html>
        <meta charset=utf-8/>
        <title>My First React Router App</title>
        <div id=app>${appHtml}</div>
        <script src="/static/bundle.js"></script>
   `;
};


server.route({
    path: '/{path*}',
    method: 'GET',
    handler: function (request, reply) {

        const muiTheme = getMuiTheme({
            userAgent: request.raw.req.headers['user-agent'],
            fontFamily: 'Helvetica'
        });

        match({ routes: routes, location: request.url }, (err, redirect, props) => {

            if (err) {
                console.error(err);
                return reply(err);
            }
            else if (redirect) {
                return reply.redirect(redirect.pathname + redirect.search);
            }
            else if (!props) {
                return reply('not found');
            }

            const appHtml = renderToString(<MuiThemeProvider muiTheme={ muiTheme }><RouterContext {...props} /></MuiThemeProvider>);
            reply(renderPage(appHtml));
        });
    }
});

server.start((err) => {

    if (err) {
        console.error(err);
        return;
    }

    console.log('server started at', server.info.uri);
});
