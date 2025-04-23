import {httpServer} from './src/http_server/index'
import WSS from './src/ws_server/index'

const HTTP_PORT = 8181;
const WS_PORT = 3000;

httpServer.listen(HTTP_PORT);

const wsServer = new WSS(WS_PORT)

wsServer.start()