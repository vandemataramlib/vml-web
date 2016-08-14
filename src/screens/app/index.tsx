import * as React from "react";
import { AppBar, FlatButton, FloatingActionButton, RefreshIndicator, Snackbar } from "material-ui";
import { ContentAdd, ActionNoteAdd } from "material-ui/svg-icons";
import * as ReactRouter from "react-router";
import * as History from "history";
import { Link, withRouter, browserHistory } from "react-router";
import { observable, action } from "mobx";
import { observer, inject } from "mobx-react";

import { DocumentListStore, AppState } from "../../stores";
import { SnackbarInfo } from "../../shared/interfaces";
import Layout from "./Layout";
import SideNav from "./SideNav";
import { CollectionDialog } from "./CollectionDialog";

interface AppProps {
    router?: ReactRouter.IRouter;
    documentListStore?: DocumentListStore;
    appState?: AppState;
    location: History.Location;
}

@inject("documentListStore", "appState")
@withRouter
@observer
export class App extends React.Component<AppProps, {}> {
    @observable drawerOpen: boolean = false;
    @observable snackbarShown: SnackbarInfo = null;
    @observable collectionDialogOpen: boolean = false;

    @action setDrawerOpen = (open: boolean) => {

        this.drawerOpen = open;
    }

    @action
    setSnackbar = (snackbar: any) => {

        this.snackbarShown = snackbar;
    }

    @action
    setCollectionDialogOpen = (open: boolean, resetSelection?: boolean) => {

        this.collectionDialogOpen = open;
        if (!open && resetSelection) {
            const { appState, router } = this.props;

            appState.resetStanzaSelection();
            router.replace(appState.currentLocation.pathname + appState.hashFromSelectedStanzas);
        }
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

    handleFABClicked = () => {

        const { appState } = this.props;
        if (!appState.stanzaSelectMode) {
            this.props.router.push("/new");
        }
        else {
            this.setCollectionDialogOpen(true);
        }
    }

    getNextSnackbar = () => {

        this.setSnackbar(null);
        this.props.appState.getNextSnackbar();
    }

    goToLink = () => {

        browserHistory.push(this.snackbarShown.onActionTouchTapURL);
    }

    showDevTools = () => {

        if (process.env.NODE_ENV !== "production") {
            const DevTools = require("mobx-react-devtools").default;
            return <DevTools />;
        } else {
            return null;
        }
    };

    showRefreshIndicator = () => {

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

    render() {

        const { appState, location } = this.props;

        appState.setCurrentLocation(location);

        const appLevelComponents = () => {

            if (!appState.isClientEnv) {
                return null;
            }

            return React.Children.toArray([
                this.showRefreshIndicator(),
                this.showDevTools()
            ]);
        };

        this.setSnackbar(appState.snackbar);

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
                <FloatingActionButton onClick={ this.handleFABClicked } style={ styles.fab }>
                    { !appState.stanzaSelectMode ? <ContentAdd /> : <ActionNoteAdd /> }
                </FloatingActionButton>
                <Layout>{ this.props.children }</Layout>
                { appLevelComponents() }
                <Snackbar
                    open={ this.snackbarShown !== null }
                    onRequestClose={ this.getNextSnackbar }
                    message={ this.snackbarShown ? this.snackbarShown.message : "" }
                    action={ this.snackbarShown ? this.snackbarShown.action : null }
                    onActionTouchTap={
                        this.snackbarShown && this.snackbarShown.onActionTouchTapURL ? this.goToLink : this.getNextSnackbar
                    }
                    autoHideDuration={
                        this.snackbarShown ?
                            (this.snackbarShown.autoHideDuration >= 0 ? this.snackbarShown.autoHideDuration : 2000)
                            : 2000
                    }
                    style={ styles.snackbar }
                    bodyStyle={ styles.snackbarBody }
                    />
                <CollectionDialog
                    open={ this.collectionDialogOpen }
                    onRequestClose={ (event, reset) => this.setCollectionDialogOpen(false, reset) }
                    />
            </div>
        );
    }
}

const styles = {
    title: {
        cursor: "pointer"
    },
    fab: {
        position: "fixed",
        right: 25,
        bottom: 25
    },
    snackbar: {
        // right: "inherit",
        // bottom: 20,
        // left: 0
    },
    snackbarBody: {
        fontFamily: "Charlotte Sans, sans-serif"
    }
};
