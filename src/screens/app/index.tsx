import * as React from "react";
import AppBar from "material-ui/AppBar";
import FlatButton from "material-ui/FlatButton";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import * as ReactRouter from "react-router";
import { Link, withRouter } from "react-router";
import { observable } from "mobx";
import { observer } from "mobx-react";
import DevTools from "mobx-react-devtools";

import { RouterRenderedComponent } from "../../interfaces/component";
import { Context } from "../../interfaces/context";
import { DocumentStore } from "../../stores/documents";
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

const doFetchData = (context: Context, props: any) => {
    return context.documentStore.getDocuments();
};

interface AppProps {
    router: ReactRouter.IRouter;
}

@withRouter
@observer
export class App extends React.Component<AppProps, {}> {
    @observable drawerOpen: boolean = false;
    static fetchData(context: Context, props: any) {
        return doFetchData(context, props);
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
                <DevTools />
            </div>
        );
    }
}

export default App as RouterRenderedComponent;
