function createJWTSignature(header, payload, secret) {
	iml.logging('createJWTSignature');
	const valueForHash = header.base64Url + '.' + payload.base64Url;

    let hashBase64;

    if (header.value.alg === 'HS256') {
		iml.logging('HS256');
        hashBase64 = iml.sha256(valueForHash, 'base64', secret);
    }

    if (header.value.alg === 'HS512') {
		iml.logging('HS512');
        hashBase64 = iml.sha512(valueForHash, 'base64', secret);
    }

    if (hashBase64 === undefined) {
		iml.logging('Unknown hash alorithm!');
        throw new Error('Unknown hash algorithm!');
    }
    iml.logging('## Start replace');
    const hashBase64Url = hashBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
	iml.logging('## End replace');
	
	iml.logging('## Return ' + hashBase64Url);
    return hashBase64Url;
}