import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from './router';

import { sharedString } from '@repo/utils';
import { corsifyResponse } from './cors';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		if (request.url.includes('trpc')) {
			return corsifyResponse(
				await fetchRequestHandler({
					endpoint: '/trpc',
					req: request,
					router: appRouter,
				}),
				request,
				env,
			);
		} else {
			return corsifyResponse(
				new Response(
					JSON.stringify({
						message: 'Hello from Cloudflare Worker!',
						shared: sharedString,
					}),
					{
						headers: {
							'Content-Type': 'application/json',
						},
					},
				),
				request,
				env,
			);
		}
	},
} satisfies ExportedHandler<Env>;
