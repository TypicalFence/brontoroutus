import {
    ConnInfo,
    Handler,
} from "https://deno.land/std@0.123.0/http/server.ts";

export type Method =
    | "GET"
    | "POST"
    | "PUT"
    | "DELETE"
    | "PATCH"
    | "OPTIONS"
    | "HEAD";

export type MethodMap<V> = Map<Method, V>;

export interface Route {
    path: string;
    method: Method;
    handler: Handler;
    pattern: URLPattern;
}

export interface RouteRegistrar {
    get(path: string, handler: Handler): void;
    post(path: string, handler: Handler): void;
    put(path: string, handler: Handler): void;
    patch(path: string, handler: Handler): void;
    delete(path: string, handler: Handler): void;
    options(path: string, handler: Handler): void;
    head(path: string, handler: Handler): void;
}

export interface RouterLike {
    getRoutes(): Route[];
    extend(path: string, router: RouterLike): void;
}

export interface Routable {
    route(method: Method, path: string): Promise<Route>;
    toHandler(input: ToHandlerInput): Handler;
}

export type ErrorHandler = (
    request: Request,
    connInfo: ConnInfo,
    error: Error | unknown,
) => Response | Promise<Response>;
export type NoMatchHandler = Handler;
export interface ToHandlerInput {
    errorHandler?: ErrorHandler;
    noMatchHandler?: NoMatchHandler;
}
