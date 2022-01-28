import { Handler } from "https://deno.land/std@0.123.0/http/server.ts";
import { Method, Route } from "./types.ts";

export class FancyRoute implements Route {
    path: string;
    method: Method;
    handler: Handler;
    pattern: URLPattern;

    constructor({ path, method, handler }: Omit<Route, "pattern">) {
        this.method = method;
        this.handler = handler;
        this.path = path;
        this.pattern = new URLPattern({ pathname: path });
    }
}
