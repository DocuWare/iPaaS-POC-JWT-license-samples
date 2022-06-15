function checkJWTLengthAndReturnSplitted(token) {
	iml.logging('checkJWTLengthAndReturnSplitted');
	var jwtParts = token.split('.');
    if (jwtParts.length !== 3) {
        throw new Error("Token length is invalid!");
    }

    return jwtParts;
}