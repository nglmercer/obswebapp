// show modal and qr code
import socketManager , { socketurl } from "./src/server/socketManager";
socketManager.onMessage("QRCode", (data) => {
    console.log("QRCode", data,socketurl.constructSocketUrl(8090));
    const localip = socketurl.constructSocketUrl(8090);
    console.log("localip",localip);
});
