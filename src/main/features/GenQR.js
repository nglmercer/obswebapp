import os from "os";
import QRCode from "qrcode";
function QRModalsave(qrCode, urlToQR) {
    localStorage.setItem("qrCode", qrCode);
    localStorage.setItem("urlToQR", urlToQR);
}
  
const getLocalIPAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const addresses = interfaces[interfaceName];
    for (const address of addresses) {
      if (address.family === "IPv4" && !address.internal) {
        return address.address;
      }
    }
  }
  return "IP address not found";
};

const injectQRCode = (mainWindow, port) => {
  const localIP = getLocalIPAddress();
  const urlToQR = `https://${localIP}:${port}`;

  QRCode.toDataURL(urlToQR, (err, qrCode) => {
    if (err) {
      console.error("Error generating QR code:", err);
      return;
    }

    mainWindow.webContents.executeJavaScript(`
      (${QRModalsave.toString()})("${qrCode}", "${urlToQR}");
    `);
    return { qrCode, urlToQR };
  });
};
const socketemitQRCode = (socket, port) => {
    const localIP = getLocalIPAddress();
    //https and http
    const urlToQRs = `https://${localIP}:${port}`;
    const urlToQR = `http://${localIP}:${port}`;
    const Qrlist = [urlToQR,urlToQRs]
    Qrlist.forEach((urlToQR) => {
        QRCode.toDataURL(urlToQR, (err, qrCode) => {
            if (err) {
                console.error("Error generating QR code:", err);
                return;
            }
            socket.emit("QRCode", { qrCode, urlToQR });
        });
    })
    
};
export {injectQRCode, socketemitQRCode, getLocalIPAddress};
