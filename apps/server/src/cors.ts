function corsHeaders(env: Env, request: Request) {
	// This should come from the environment variables
	// const origins = !env.ALLOWED_ORIGINS ? [] : env.ALLOWED_ORIGINS.split('&');
	const origins = ['http://localhost:5173'];

	// get the url from where the request is coming from
	const _origin = request.headers.get('Origin');
	if (!_origin)
		return {
			'Access-Control-Allow-Origin': '',
			'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
			'Access-Control-Max-Age': '86400',
			'Access-Control-Allow-Credentials': 'true',
		};

	const url = new URL(_origin);
	const origin = url.origin;

	const _allowed = origins.includes(origin) ? origin : '';
	return {
		'Access-Control-Allow-Origin': _allowed,
		'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
		'Access-Control-Max-Age': '86400',
		'Access-Control-Allow-Credentials': 'true',
	};
}

export function corsifyResponse(response: Response, request: Request, env: Env): Response {
	let respHeaders = {
		...corsHeaders(env, request),
		// Allow all future content Request headers to go back to browser
		// such as Authorization (Bearer) or X-Client-Name-Version
		'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') ?? '',
	};

	try {
		const newResp = response.clone();

		Object.keys(respHeaders).forEach((key) => {
			const _key = key as keyof typeof respHeaders;

			const val = respHeaders[_key];

			newResp.headers.set(key, val as string);
		});

		return newResp;
	} catch (e) {
		return response;
	}
}
export function handleOptions(request: Request, env: Env) {
	// Make sure the necessary headers are present
	// for this to be a valid pre-flight request
	let headers = request.headers;
	if (
		headers.get('Origin') !== null &&
		headers.get('Access-Control-Request-Method') !== null &&
		headers.get('Access-Control-Request-Headers') !== null
	) {
		// Handle CORS pre-flight request.
		// If you want to check or reject the requested method + headers
		// you can do that here.
		let respHeaders = {
			...corsHeaders(env, request),
			// Allow all future content Request headers to go back to browser
			// such as Authorization (Bearer) or X-Client-Name-Version
			'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') ?? '',
		};

		return new Response(null, {
			headers: respHeaders,
		});
	} else {
		// Handle standard OPTIONS request.
		// If you want to allow other HTTP Methods, you can do that here.
		return new Response(null, {
			headers: {
				Allow: 'GET, HEAD, POST, OPTIONS',
			},
		});
	}
}
