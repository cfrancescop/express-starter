import app from "./app";
import log from "./logging";
import { createServer } from "http";
import config from "./config";

const http = createServer(app);
http.listen(config.port, () => {
    log.info("listening on *:" + config.port);
});