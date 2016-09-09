import { App } from "../screens/app";
import { Home } from "../screens/home";
import { About } from "../screens/about";
import { TextForm } from "../screens/newDocument";
import { Document } from "../screens/document";
import { Collection } from "../screens/collection";
import { Login } from "../screens/auth";

import DefaultExport from "./DefaultExport";
// import { AuthStore } from "../stores/AuthStore";

// const auth = new AuthStore({ clientId: process.env.__AUTH0_CLIENT_ID__, domain: process.env.__AUTH0_DOMAIN__ });

// const requireAuth = (nextState, replace) => {
//     if (!auth.loggedIn) {
//         replace({ pathname: "/login" });
//     }
// };

const routes = Object.assign(DefaultExport, {
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
            // onEnter: requireAuth
        },
        {
            path: "/login",
            component: Login
        },
        {
            path: "access_token=:token",
            component: Login
        },
        {
            path: "/collections/:id",
            component: Collection
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
});

export { routes };
