function verifyJWT(token, secret) {
	iml.logging('verifyJWT');
	const jwtSplitted = iml.checkJWTLengthAndReturnSplitted(token);
    const parsedJWT = iml.parseJwt(jwtSplitted);
    
    const hashBase64Url = iml.createJWTSignature(parsedJWT.header, parsedJWT.payload, secret);

    if (hashBase64Url !== parsedJWT.signature.base64Url) {
		iml.logging('Signature invalid!');
        throw new Error('Signature invalid!');
    }

    return parsedJWT;
}