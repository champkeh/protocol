const CryptoJS = require('crypto-js')

function encryptBy3Des(message, key) {
    var keyHex = CryptoJS.enc.Base64.parse(key);
    var encrypted = CryptoJS.TripleDES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

const data = "{\"operator\":\"null\",\"operatorDate\":\"20220901\",\"operatorTime\":\"193654\",\"insureSerialNumber\":\"ea0ed8ef3fa34d72aa51c1bd5dd4363c\",\"formerOrderId\":\"1\",\"productCode\":\"7\",\"productSubCode\":\"\",\"insuranceBeginDate\":\"\",\"insuranceEndDate\":\"\",\"passengerName\":\"4\",\"passengerIdType\":\"5\",\"passengerIdNo\":\"6\",\"passengerMobile\":\"\",\"passengerEmail\":\"\",\"eticketNo\":\"\",\"carrier\":\"\",\"flightNo\":\"\",\"originAirport\":\"\",\"destAirport\":\"\",\"flightDate\":\"\",\"flightTime\":\"\",\"ticketFare\":\"\",\"parameter1\":\"P000001\",\"parameter2\":\"P000002\",\"parameter3\":\"P000003\",\"parameter4\":\"P000004\",\"parameter5\":\"P000005\",\"isAuthorization\":\"YES\",\"isRealName\":\"YES\"}"

console.log(encryptBy3Des(data, "e4fd2ffd11054b72ba19e1b62bb1875d"))
