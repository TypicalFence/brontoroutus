import { ConnInfo } from "https://deno.land/std@0.123.0/http/server.ts";
import { FancyRoute } from "./route.ts";
import {
    BrontoHandler,
    Method,
    MethodMap,
    Routable,
    Route,
    RouteRegistrar,
    RouterLike,
    ToHandlerInput,
} from "./types.ts";

export class Router implements RouteRegistrar, RouterLike, Routable {
    private routeMap: MethodMap<FancyRoute[]>;

    constructor() {
        this.routeMap = new Map();
        this.routeMap.set("GET", []);
        this.routeMap.set("POST", []);
        this.routeMap.set("PUT", []);
        this.routeMap.set("PATCH", []);
        this.routeMap.set("DELETE", []);
        this.routeMap.set("OPTIONS", []);
        this.routeMap.set("HEAD", []);
    }

    addRoute(method: Method, path: string, handler: BrontoHandler) {
        this.routeMap.get(method)!.push(
            new FancyRoute({ method, path, handler }),
        );
    }

    get(path: string, handler: BrontoHandler): void {
        this.addRoute("GET", path, handler);
    }

    post(path: string, handler: BrontoHandler): void {
        this.addRoute("POST", path, handler);
    }

    put(path: string, handler: BrontoHandler): void {
        this.addRoute("PUT", path, handler);
    }

    patch(path: string, handler: BrontoHandler): void {
        this.addRoute("PATCH", path, handler);
    }

    delete(path: string, handler: BrontoHandler): void {
        this.addRoute("DELETE", path, handler);
    }

    options(path: string, handler: BrontoHandler): void {
        this.addRoute("OPTIONS", path, handler);
    }

    head(path: string, handler: BrontoHandler): void {
        this.addRoute("HEAD", path, handler);
    }

    getRoutes(): Route[] {
        return [...this.routeMap.values()].flat();
    }

    extend(path: string, router: RouterLike): void {
        const routesToAdd = router.getRoutes();
        routesToAdd
            .map((r) => ({ ...r, path: `${path}${r.path}` }))
            .forEach((r) => {
                this.addRoute(r.method, r.path, r.handler);
            });
    }

    route(method: Method, path: string): Promise<Route> {
        const routes = this.routeMap.get(method);
        const route = routes?.find((r) => r.pattern.test({ pathname: path }));

        if (route) {
            return Promise.resolve({ ...route });
        }

        return Promise.reject(
            new Error(`no route found for: ${method} ${path}`),
        );
    }

    toHandler({ errorHandler, noMatchHandler }: ToHandlerInput) {
        return (async (req: Request, conn: ConnInfo) => {
            const url = new URL(req.url);
            const route = await this.route(req.method as Method, url.pathname)
                .catch(() => {
                    if (noMatchHandler) {
                        return {
                            handler: noMatchHandler,
                            pattern: new URLPattern(req.url),
                        };
                    }
                });

            if (route) {
                try {
                    const parameters = route.pattern.exec({
                        pathname: url.pathname,
                    });
                    const record = parameters?.pathname.groups;
                    // await to ensure that the error handler is run
                    const response = await route.handler(req, conn, {
                        parameters: record || {},
                    });
                    return response;
                } catch (err) {
                    if (errorHandler) {
                        try {
                            return errorHandler(req, conn, err);
                        } catch {
                            return new Response("internal server error", {
                                status: 500,
                            });
                        }
                    }
                }
            }

            console.error(
                "could not run error handler, sending fallback response",
            );
            return new Response("internal server error", { status: 500 });
        }).bind(this);
    }
}
