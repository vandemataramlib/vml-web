import * as React from "react";
import { Divider, Drawer, MenuItem, Subheader, CircularProgress } from "material-ui";
import { Link } from "react-router";
import { observer, inject } from "mobx-react";
import { Models } from "vml-common";

import { translit } from "../../shared/utils";
import { DocumentListStore } from "../../stores";

interface SideNavProps {
    documentListStore?: DocumentListStore;
    open: boolean;
    onClose: any;
}

@inject("documentListStore")
@observer
export default class SideNav extends React.Component<SideNavProps, {}> {
    getMenu = (docListGroup: Models.DocumentListGroup, index: number) => {

        return (
            <div key={ index }>
                { index > 0 ? <Divider /> : null }
                <Subheader>{ docListGroup.title }</Subheader>
                { docListGroup.items.map((item) => (

                    <MenuItem
                        onTouchTap={ this.props.onClose }
                        key={ item.url }
                        containerElement={ <Link to={ item.url } /> }
                        >
                        { item.title }
                    </MenuItem>
                )) }
            </div>
        );
    }

    getSpinner() {

        return (
            <div style={ styles.spinner }>
                <CircularProgress />
            </div>
        );
    }

    render() {

        const { documentListStore } = this.props;

        return (
            <Drawer open={ this.props.open } docked={ false } onRequestChange={ this.props.onClose }>
                { documentListStore.documentListGroups.length ?
                    documentListStore.documentListGroups.map(this.getMenu)
                    : this.getSpinner()
                }
            </Drawer>
        );
    }
}

const styles = {
    spinner: {
        display: "flex",
        "justifyContent": "center",
        "paddingTop": 40
    }
};
