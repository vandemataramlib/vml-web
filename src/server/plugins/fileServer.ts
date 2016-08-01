import * as Hapi from "hapi";

class FileServer {
    constructor(server: Hapi.Server, options: any, next: Function) {

        server.route({
            path: "/static/{p*}",
            method: "GET",
            handler: {
                directory: {
                    path: "public"
                }
            }
        });

        server.route({
            path: "/favicon.ico",
            method: "GET",
            handler: {
                file: "public/favicon.ico"
            }
        });

        next();
    }

    static attributes = {
        name: "fileServer"
    };
}

export const register = FileServer;
