# Brontoroutus

Tiny Router for deno. Tries to be as close to [std/hhtp](https://deno.land/std@0.123.0/http) as possible and aims to be easily extendable.

Probably not the fastes right now, but that isn't one of the main goals. Easily fixable along the line.

# Example

```ts
import { serve } from "https://deno.land/std@0.123.0/http/server.ts";
import { Method, Router } from "https://deno.land/x/brontoroutus/mod.ts";

const router = new Router();

router.get("/", () => {
    return new Response("🦕");
});

router.get("/hello/:name", (_req, _conn, ctx) => {
    return new Response(`${ctx?.parameters.name}`);
});

serve(router.toHandler({
    errorHandler: (_req, _conn, err) => {
        console.error(err);
        return new Response("internal server error", { status: 500 });
    },
    noMatchHandler: () => new Response("404", { status: 404 }),
}));
```
