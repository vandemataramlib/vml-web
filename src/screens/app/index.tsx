import * as React from "react";
import AppBar from "material-ui/AppBar";
import FlatButton from "material-ui/FlatButton";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";
// import Radium, { StyleRoot } from 'radium';
import { Link, withRouter } from "react-router";
// import { Grid, Cell } from 'radium-grid';

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

export class App extends React.Component<any, any> {
    constructor(props) {

        super(props);
        this.handleLeftIconClicked = this.handleLeftIconClicked.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleTitleTouchTap = this.handleTitleTouchTap.bind(this);
        this.handleTouchEnded = this.handleTouchEnded.bind(this);
        this.state = {
            drawerOpen: false
        };
    }

    handleLeftIconClicked(event) {

        this.setState({
            drawerOpen: !this.state.drawerOpen
        });
    }

    handleClose() {

        this.setState({
            drawerOpen: false
        });
    }

    handleTitleTouchTap() {

        this.props.router.push("/");
    }

    handleTouchEnded() {

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
                    open={ this.state.drawerOpen }
                    onClose={ this.handleClose }
                    />
                <FloatingActionButton onMouseDown={ this.handleTouchEnded } style={ styles.fab }>
                    <ContentAdd />
                </FloatingActionButton>
                <Layout>{ this.props.children }</Layout>
            </div>
        );
    }
}

export default withRouter(App);
