import { App } from "../screens/app";
import { Home } from "../screens/home";
import { About } from "../screens/about";
import { TextForm } from "../screens/newDocument";
import { Document } from "../screens/document";

const routes = [{
    path: "/",
    component: App,
    indexRoute: { component: Home },
    childRoutes: [
        {
            path: "/about",
            component: About
        },
        {
            path: "/new",
            component: TextForm
        },
        {
            path: "/:slug",
            component: Document
        },
        {
            path: "/:slug/:subdocId",
            component: Document
        },
        {
            path: "/:slug/:subdocId/:recordId",
            component: Document
        }
    ]
}];

export { routes };
