import { Method, BrontoHandler, Route } from "./types.ts";

export class FancyRoute implements Route {
    path: string;
    method: Method;
    handler: BrontoHandler;
    pattern: URLPattern;

    constructor({ path, method, handler }: Omit<Route, "pattern">) {
        this.method = method;
        this.handler = handler;
        this.path = path;
        this.pattern = new URLPattern({ pathname: path });
    }
}
