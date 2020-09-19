module.exports = {
    endpoint_name: {
        dir: "/path/to/the/folder",
        secret: "Webhook secret here",
        id: "pm2 id here",
        restart: true //whether you want to pm2 process to restart or not, put false if you don't use pm2 and don't put an id
    }
}