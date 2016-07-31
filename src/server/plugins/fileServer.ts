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

        next();
    }

    static attributes = {
        name: "fileServer"
    };
}

export const register = FileServer;
