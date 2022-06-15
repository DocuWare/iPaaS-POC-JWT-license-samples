function isJWTExpired(payload) {
	iml.logging('isJWTExpired');
	if (payload.exp === undefined) {
        throw new Error('Missing expiration!');
    }

    if (Math.floor(Date.now() / 1000).toString() > payload.exp) {
        throw new Error('Token expired!');
    }
}