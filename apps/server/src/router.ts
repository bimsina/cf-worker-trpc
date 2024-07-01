import { z } from 'zod';
import { publicProcedure, router } from './trpc';

export const appRouter = router({
	greetUser: publicProcedure
		.input(
			z.object({
				name: z.string(),
			}),
		)
		.query((opts) => {
			const { input } = opts;

			return {
				message: `Hello, ${input.name}!`,
			};
		}),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
