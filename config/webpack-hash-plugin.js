var fs = require("fs");
var path = require("path");

function WebpackHashPlugin(options) { }

WebpackHashPlugin.prototype.apply = function (compiler) {
    compiler.plugin("done", function (stats) {
        var outputFile = "../build/webpack.hash.json";
        var outputFilePath = path.join(__dirname, outputFile);

        try {
            fs.accessSync(outputFilePath, fs.W_OK);
            var bundleName = JSON.parse(fs.readFileSync(outputFilePath)).main;
            if (bundleName !== stats.toJson().assetsByChunkName.main) {
                fs.unlinkSync(path.join(__dirname, "../public/", bundleName));
            }
        } catch (err) {
            console.error(outputFilePath, "not found\n");
        }

        fs.writeFileSync(
            outputFilePath,
            JSON.stringify(stats.toJson().assetsByChunkName)
        );
    })
}

module.exports = WebpackHashPlugin;
