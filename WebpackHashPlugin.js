var fs = require("fs");
var path = require("path");

function WebpackHashPlugin(options) { }

WebpackHashPlugin.prototype.apply = function (compiler) {
    compiler.plugin("done", function (stats) {
        var outputFile = "build/webpack.hash.json";
        try {
            fs.accessSync(outputFile, fs.W_OK);
            var bundleName = JSON.parse(fs.readFileSync(outputFile)).main;
            if (bundleName !== stats.toJson().assetsByChunkName.main) {
                fs.unlinkSync("public/" + bundleName);
            }
        } catch (err) {
            console.log(outputFile, "not found");
        }
        fs.writeFileSync(
            path.join(__dirname, outputFile),
            JSON.stringify(stats.toJson().assetsByChunkName)
        );
    })
}

module.exports = WebpackHashPlugin;
