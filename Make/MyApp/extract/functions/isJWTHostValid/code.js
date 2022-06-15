function isJWTHostValid(payload, host) {
	iml.logging('isJWTHostValid');
	if (payload.host === undefined) {
        throw new Error("Missing host!");
    }

    if (host.includes(payload.host) === false) {
        throw new Error("Host invalid!");
    }
}