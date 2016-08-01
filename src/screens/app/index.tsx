import * as React from "react";
import { AppBar, FlatButton, FloatingActionButton } from "material-ui";
import { ContentAdd } from "material-ui/svg-icons";
import * as ReactRouter from "react-router";
import { Link, withRouter } from "react-router";
import { observable, action } from "mobx";
import { observer, inject } from "mobx-react";

import Layout from "./Layout";
import SideNav from "./SideNav";

const styles = {
    title: {
        cursor: "pointer"
    },
    fab: {
        position: "fixed",
        right: 25,
        bottom: 25
    }
};

interface AppProps {
    router?: ReactRouter.IRouter;
}

@withRouter
@observer
export class App extends React.Component<AppProps, {}> {
    @observable drawerOpen: boolean = false;

    @action setDrawerOpen = (open: boolean) => {

        this.drawerOpen = open;
    }

    handleLeftIconClicked= (event) => {

        this.setDrawerOpen(!this.drawerOpen);
    }

    handleClose = () => {

        this.setDrawerOpen(false);
    }

    handleTitleTouchTap = () => {

        this.props.router.push("/");
    }

    handleCreateNew = () => {

        this.props.router.push("/new");
    }

    render() {

        const showDevTools = () => {

            if (process.env.NODE_ENV !== "production") {
                const DevTools = require("mobx-react-devtools").default;
                return <DevTools />;
            } else {
                return null;
            }
        };

        return (
            <div>
                <AppBar
                    title={ <span style={ styles.title }>Vande Mataram Library</span> }
                    onLeftIconButtonTouchTap={ this.handleLeftIconClicked }
                    onTitleTouchTap={ this.handleTitleTouchTap }
                    iconElementRight={ <FlatButton label="About" containerElement={ <Link to="/about" /> } /> }
                    />
                <SideNav
                    open={ this.drawerOpen }
                    onClose={ this.handleClose }
                    />
                <FloatingActionButton onMouseDown={ this.handleCreateNew } style={ styles.fab }>
                    <ContentAdd />
                </FloatingActionButton>
                <Layout>{ this.props.children }</Layout>
                { showDevTools() }
            </div>
        );
    }
}
