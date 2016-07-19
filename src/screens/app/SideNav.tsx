import * as React from "react";
import Divider from "material-ui/Divider";
import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";
import Subheader from "material-ui/Subheader";
import { Link } from "react-router";
import { observer, inject } from "mobx-react";

import { translit } from "../../utils";
import { Context } from "../../interfaces/context";
import { DocumentListStore } from "../../stores/documentList";

interface SideNavProps {
    documentListStore?: DocumentListStore;
    open: boolean;
    onClose: any;
}

@inject("documentListStore")
@observer
export default class SideNav extends React.Component<SideNavProps, {}> {
    render() {

        // const menus = [
        //     {
        //         group: "Documents",
        //         items: this.props.documentListStore.documentsTOC
        //     }
        // ];

        const { documentListStore } = this.props;

        return (
            <Drawer open={ this.props.open } docked={ false } onRequestChange={ this.props.onClose }>
                { documentListStore.documentListGroups.map((docListGroup, index) =>

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
                ) }
            </Drawer>
        );
    }
}
