const config = require("./config");
const app = require('express')();
const crypto = require('crypto');
const exec = require('child_process').exec;
const port = 3001;
app.post("/:id", (req, res) => {
    const item = config[req.params.id];
    if (item) {
        let accepted = false;
        req.on("data", async function (chunk) {
            accepted = await handle(req.headers["x-hub-signature"], item, chunk)
            res.sendStatus(accepted ? 200 : 401)
        })
    }
}).listen(port);
console.log(`The webhook is listening on port ${port}`)
/**
 * 
 * @param {Object} conf The config of the endpoint
 * @param {Buffer} chunk The chunk
 */
async function handle(header, conf, chunk) {
    let sig = "sha1=" + crypto.createHmac('sha1', conf.secret).update(chunk.toString()).digest('hex');
    if (header === sig) {
        console.log("Accepted")
        await exec(`cd ${conf.dir} && git fetch --all && git reset --hard origin/master && git pull ${conf.restart ? `&& pm2 restart ${conf.id}` : ``}`);
        return true; //git reset can be removed unless you want everything to be merged
    }
    console.log("Not accepted");
    return false;
}