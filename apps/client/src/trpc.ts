import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../server/src/router";

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:8787/trpc",
    }),
  ],
});

export default trpc;
