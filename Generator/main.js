const crypto = require('crypto');

// Edit below here
const lifetime = {
    days: 0,
    hours: 0,
    minutes: 1, // One minute only for test reasons
    seconds: 0
}
const host = "organization.docuware.cloud";
const secret = "wow-how-secret";
// Don't edit below here, only if you are sure what you are doing!

const JWT = createJWT(lifetime, host, secret);

console.log("JWT: " + JWT);

function createJWT(lifetime, host, secret) {
    const headerObj = {
        "alg": "HS512",
        "typ": "JWT"
    };

    const lifetimeInSeconds = (lifetime.hours * 24 * 60 * 60) + (lifetime.hours * 60 * 60) + (lifetime.minutes * 60) + lifetime.seconds;

    const payloadObj = {
        "exp": (Math.floor(Date.now() / 1000) + lifetimeInSeconds).toString(),
        "host": host
    }

    const header = createJWTData(headerObj);
    const payload = createJWTData(payloadObj);
    const signature = createSignature(header, payload, secret);

    const JWT = header.base64Url + "." + payload.base64Url + "." + signature;

    return JWT;
}

function createJWTData(value) {
    const valueJSON = JSON.stringify(value);
    const valueBuffer = Buffer.from(valueJSON, 'utf-8');
    const valueBase64 = valueBuffer.toString('base64');
    const valueBase64Url = valueBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');

    return {
        base64Url: valueBase64Url,
        base64: valueBase64,
        value: value
    }
}

function createSignature(header, payload, secret) {
    const valueForHash = header.base64Url + '.' + payload.base64Url;

    const hmac = chooseHmac(header.value.alg, secret);
    const hash = hmac.update(valueForHash).digest('hex');
    const hashBuffer = Buffer.from(hash, 'hex');
    const hashBase64 = hashBuffer.toString('base64');
    const hashBase64Url = hashBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');

    return hashBase64Url;
}

function chooseHmac(alg, secret) {
    if(alg === 'HS384') {
        return crypto.createHmac('sha384', secret);
    }

    if(alg === 'HS512') {
        return crypto.createHmac('sha512', secret);
    }

    return crypto.createHmac('sha256', secret);
}