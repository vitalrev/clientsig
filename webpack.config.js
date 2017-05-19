var config = {
}
var gethConfig = Object.assign({}, config, {
    name: "geth",
    entry: [
        "./app/js/geth_sig.js"
        ],
    output: {
        path: __dirname + "/build/app/js",
        filename: "geth_sig.js"
    }
});
var clientConfig = Object.assign({}, config, {
    name: "client",
    entry: [
        "./app/js/client_sig.js"
        ],
    output: {
        path: __dirname + "/build/app/js",
        filename: "client_sig.js"
    }
});
module.exports = [
    gethConfig, clientConfig,
];