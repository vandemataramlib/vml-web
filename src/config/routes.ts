import App from "../screens/app";
import Home from "../screens/home";
import About from "../screens/about";
import Repos from "../screens/repos";
import TextForm from "../screens/newDocument";
import Document from "../screens/document";

export default [{
    path: "/",
    component: App,
    indexRoute: { component: Home },
    childRoutes: [
        {
            path: "/about",
            component: About
        },
        {
            path: "/repos",
            component: Repos
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
