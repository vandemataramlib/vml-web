import * as React from "react";
import { Router, browserHistory } from "react-router";
const applyRouterMiddleware = require("react-router").applyRouterMiddleware;
const useScroll = require("react-router-scroll").useScroll;
import { MuiThemeProvider } from "material-ui/styles";
import { Provider } from "mobx-react";

import { routes } from "../shared/routes";
import { muiThemeOptions } from "../shared/constants";

export default (props) => {

    return (
        <Provider {...props } >
            <MuiThemeProvider muiTheme={ muiThemeOptions }>
                <Router
                    routes={ routes }
                    history={ browserHistory }
                    render={
                        applyRouterMiddleware(useScroll((prevRouterProps: any, routerProps: any) => {

                            if (!prevRouterProps) {
                                return true;
                            }
                            return prevRouterProps.location.pathname === routerProps.location.pathname
                                && prevRouterProps.location.hash !== routerProps.location.hash ? false : true;
                        }))
                    }
                    />
            </MuiThemeProvider>
        </Provider>
    );
};
