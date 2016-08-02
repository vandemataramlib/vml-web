import * as React from "react";
import { AppBar, FlatButton, FloatingActionButton, RefreshIndicator } from "material-ui";
import { ContentAdd } from "material-ui/svg-icons";
import * as ReactRouter from "react-router";
import { Link, withRouter } from "react-router";
import { observable, action } from "mobx";
import { observer, inject } from "mobx-react";

import { DocumentListStore, AppState } from "../../stores";
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
    documentListStore?: DocumentListStore;
    appState?: AppState;
}

@inject("documentListStore", "appState")
@withRouter
@observer
export class App extends React.Component<AppProps, {}> {
    @observable drawerOpen: boolean = false;

    @action setDrawerOpen = (open: boolean) => {

        this.drawerOpen = open;
    }

    handleLeftIconClicked = (event) => {

        this.props.documentListStore.getDocumentList();
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

        const showRefreshIndicator = () => {

            const showRefresh = this.props.appState.pendingAppFetches.length > 0;
            return (
                <RefreshIndicator
                    left={ window.innerWidth / 2 - 25 }
                    size={ 50 }
                    top={ window.innerHeight / 2 - 100 }
                    status={ showRefresh ? "loading" : "hide" }
                    />
            );
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
                { this.props.appState.isClientEnv ? showRefreshIndicator() : null }
            </div>
        );
    }
}
