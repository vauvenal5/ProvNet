const opn = require('opn');

opn("http://localhost:3000/ProvNet", {
    app: ["chromium", "--remote-debugging-port=9222"]
});