# Brontoroutus

# Example

```ts
import { serve } from "https://deno.land/std@0.123.0/http/server.ts";
import { Method, Router } from "$url/brontoroutus.ts";

const router = new Router();

router.get("/", () => {
    return new Response("🦕");
});

router.get("/hello/:name", (_req, _conn, params) => {
    return new Response(`${params.name}`);
});

serve(router.toHandler({
    errorHandler: (_req, _conn, err) => {
        console.error(err);
        return new Response("internal server error", { status: 500 });
    },
    noMatchHandler: () => new Response("404", { status: 404 }),
}));
```
