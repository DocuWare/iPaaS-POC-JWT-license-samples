function checkJWT(jwtValue, secret, host) {
	iml.logging('chekJWT(' + jwtValue + ',' + host + ')');
	const parsedJWT = iml.verifyJWT(jwtValue, secret);

    iml.isJWTExpired(parsedJWT.payload.value);

    iml.isJWTHostValid(parsedJWT.payload.value, host);
}