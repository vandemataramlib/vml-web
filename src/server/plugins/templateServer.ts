exports.register = (server, options, next) => {

    const { template, context } = options;

    server.route({
        path: "/{p*}",
        method: "GET",
        handler: (request, reply) => {

            return reply.view(template, context);
        }
    });

    return next();
};

exports.register.attributes = {
    name: "templateServer",
    dependencies: ["vision"]
};
