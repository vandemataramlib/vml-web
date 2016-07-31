import * as React from "react";
import AppBar from "material-ui/AppBar";
import FlatButton from "material-ui/FlatButton";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import * as ReactRouter from "react-router";
import { Link, withRouter } from "react-router";
import { observable } from "mobx";
import { observer, inject } from "mobx-react";

import { Context } from "../../interfaces/context";
import { DocumentListStore } from "../../stores/documentList";
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

const doFetchData = (context: Context | AppProps, props: any) => {
    return context.documentListStore.getDocumentList();
};

interface AppProps {
    router?: ReactRouter.IRouter;
    documentListStore?: DocumentListStore;
}

@inject("documentListStore")
@withRouter
@observer
export class App extends React.Component<AppProps, {}> {
    @observable drawerOpen: boolean = false;
    static fetchData(context: Context, props: any) {
        return doFetchData(context, props);
    }

    componentDidMount() {

        doFetchData(this.props, this.props);
    }

    componentWillReceiveProps(nextProps) {

        doFetchData(nextProps, nextProps);
    }

    handleLeftIconClicked= (event) => {

        this.drawerOpen = !this.drawerOpen;
    }

    handleClose = () => {

        this.drawerOpen = false;
    }

    handleTitleTouchTap = () => {

        this.props.router.push("/");
    }

    handleTouchEnded = () => {

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
                <FloatingActionButton onMouseDown={ this.handleTouchEnded } style={ styles.fab }>
                    <ContentAdd />
                </FloatingActionButton>
                <Layout>{ this.props.children }</Layout>
                { showDevTools() }
            </div>
        );
    }
}
