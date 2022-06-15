function parseJwt(jwtParts) {
	iml.logging('parseJwt');
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
}