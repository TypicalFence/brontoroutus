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

export interface ParameterContext {
    parameters: Record<string, string>;
}

export type ParameterHandler = (
    request: Request,
    connInfo: ConnInfo,
    ctx?: ParameterContext,
) => Response | Promise<Response>;

export type BrontoHandler = Handler | ParameterHandler;

export interface Route {
    path: string;
    method: Method;
    handler: BrontoHandler;
    pattern: URLPattern;
}

export interface RouteRegistrar {
    get(path: string, handler: BrontoHandler): void;
    post(path: string, handler: BrontoHandler): void;
    put(path: string, handler: BrontoHandler): void;
    patch(path: string, handler: BrontoHandler): void;
    delete(path: string, handler: BrontoHandler): void;
    options(path: string, handler: BrontoHandler): void;
    head(path: string, handler: BrontoHandler): void;
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
