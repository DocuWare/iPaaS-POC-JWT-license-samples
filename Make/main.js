const iml = {
    logging: (object) => logging(object),
    ifempty: (object, valueForFalse) => ifempty(object, valueForFalse),
    if: (condition, valueTrue, valueFalse) => imlIf(condition, valueTrue, valueFalse),
    sha256: (text, outputEncoding, key, keyEncoding) => sha256(text, outputEncoding, key, keyEncoding),
    sha512: (text, outputEncoding, key, keyEncoding) => sha512(text, outputEncoding, key, keyEncoding),
    base64: (text) => base64(text),
    toBinary: (value, type) => toBinary(value, type),
    toString: (value) => toString(value),
    checkJWT: (jwtValue, secret, host) => checkJWT(jwtValue, secret, host),
    verifyJWT: (token, secret) => verifyJWT(token, secret),
    checkJWTLengthAndReturnSplitted: (token) => checkJWTLengthAndReturnSplitted(token),
    parseJwt: (jwtParts) => parseJwt(jwtParts),
    createJWTSignature: (header, payload, secret) => createJWTSignature(header, payload, secret),
    isJWTExpired: (payload) => isJWTExpired(payload),
    isJWTHostValid: (payload, host) => isJWTHostValid(payload, host)
}

//#region IML functions
function logging(object) {
    console.log(JSON.stringify(object));
    return object;
}

function imlIf(condition, valueTrue, valueFalse) {
    if(condition) {
        return valueTrue;
    }

    return valueFalse;
}

function ifempty(object, valueForFalse) {
    if (object)
    {
        return object;
    }

    return valueForFalse;
}

function sha256(text, outputEncoding = 'text', key = undefined, keyEncoding = 'text') {
    const hmac = crypto.createHmac('sha256', key);
    const hash = hmac.update(text).digest('hex');
    const hashBuffer = Buffer.from(hash, 'hex');
    const hashOutput = hashBuffer.toString(outputEncoding);

    return hashOutput;
}

function sha512(text, outputEncoding = 'text', key = undefined, keyEncoding = 'text') {
    const hmac = crypto.createHmac('sha512', key);
    const hash = hmac.update(text).digest('hex');
    const hashBuffer = Buffer.from(hash, 'hex');
    const hashOutput = hashBuffer.toString(outputEncoding);

    return hashOutput;
}

function base64(text) {
    const buffer = Buffer.from(text, 'utf-8');
    const base64 = buffer.toString('base64');

    return base64;
}

function toBinary(value, type = 'hex') {
    return Buffer.from(value, type);
}

function toString(value) {
    return value.toString('utf-8');
}
//#endregion IML functions

const jwtValue = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIxNjUzNjc5MDEzIiwiaG9zdCI6InNka2luYy5kb2N1d2FyZS5jbG91ZCJ9.tQq3kzOn4Kt9qlQwn2A1auqPC8SLfg-6aE66TiGj252Dfgd44BhMzylj20i-CjT-0QfZEV-KpjnBkrQ4AYMuwQ";
const secret = "wow-how-secret";
const host = "https://organization.docuware.cloud/some-link";

const crypto = require('crypto');

checkJWT(jwtValue, secret, host);

console.log('The token is valid!');

function checkJWTLengthAndReturnSplitted(token) {
    var jwtParts = token.split('.');
    if (jwtParts.length !== 3) {
        throw new Error("Token length is invalid!");
    }

    return jwtParts;
}

function checkJWT(jwtValue, secret, host) {
    const parsedJWT = iml.verifyJWT(jwtValue, secret);

    iml.isJWTExpired(parsedJWT.payload.value);

    iml.isJWTHostValid(parsedJWT.payload.value, host);
}

function parseJwt (jwtParts) {
    const header64Url = jwtParts[0];
    const header64 = header64Url.replace(/-/g, '+').replace(/_/g, '/');
    const headerBuffer = iml.toBinary(header64, 'base64');
    const headerJSON = iml.toString(headerBuffer);
    const header = JSON.parse(headerJSON);

    const payload64Url = jwtParts[1];
    const payload64 = payload64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payloadBuffer = iml.toBinary(payload64, 'base64');
    const payloadJSON = iml.toString(payloadBuffer);
    const payload = JSON.parse(payloadJSON);
    
    const signature64Url = jwtParts[2];

    return {
        header: {
            base64Url: header64Url,
            base64: header64,
            value: header
        },
        payload: {
            base64Url: payload64Url,
            base64: payload64,
            value: payload
        },
        signature: {
            base64Url: signature64Url
        }
    };
};

function verifyJWT(token, secret) {
    const jwtSplitted = iml.checkJWTLengthAndReturnSplitted(token);
    const parsedJWT = iml.parseJwt(jwtSplitted);
    
    const hashBase64Url = iml.createJWTSignature(parsedJWT.header, parsedJWT.payload, secret);

    if (hashBase64Url !== parsedJWT.signature.base64Url) {
        throw new Error("Signature invalid!");
    }

    return parsedJWT;
}

function createJWTSignature(header, payload, secret) {
    const valueForHash = header.base64Url + '.' + payload.base64Url;

    let hashBase64 = undefined;

    if (header.value.alg === 'HS256') {
        hashBase64 = iml.sha256(valueForHash, 'base64', secret);
    }

    if (header.value.alg === 'HS512') {
        hashBase64 = iml.sha512(valueForHash, 'base64', secret);
    }

    if (hashBase64 === undefined) {
        throw new Error("Unknown hash algorithm!");
    }
    
    const hashBase64Url = hashBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');

    return hashBase64Url;
}

function isJWTExpired(payload) {
    if (payload.exp === undefined) {
        throw new Error("Missing expiration!");
    }

    if (Math.floor(Date.now() / 1000).toString() > payload.exp) {
        throw new Error("Token expired!");
    }
}

function isJWTHostValid(payload, host) {
    if (payload.host === undefined) {
        throw new Error("Missing host!");
    }

    if (host.includes(payload.host) === false) {
        throw new Error("Host invalid!");
    }
}