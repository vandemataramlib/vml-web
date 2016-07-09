import * as React from "react";
import Divider from "material-ui/Divider";
import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";
import Subheader from "material-ui/Subheader";
import { Link } from "react-router";
import { observer } from "mobx-react";

import { translit } from "../../utils";
import { Context } from "../../interfaces/context";
import { DocumentStore } from "../../stores/documents";

interface SideNavProps {
    documentStore?: DocumentStore;
    open: boolean;
    onClose: any;
}

@observer(["documentStore"])
export default class SideNav extends React.Component<SideNavProps, {}> {
    render() {

        const menus = [
            {
                group: "Documents",
                items: this.props.documentStore.documentsTOC
            }
        ];

        return (
            <Drawer open={ this.props.open } docked={ false } onRequestChange={ this.props.onClose }>
                { menus.map((menu, index) =>

                    <div key={ index }>
                        { index > 0 ? <Divider /> : null }
                        <Subheader>{ menu.group }</Subheader>
                        { menu.items.map((item) => (

                            <MenuItem
                                onTouchTap={ this.props.onClose }
                                key={ item.u }
                                containerElement={ <Link to={ item.u } /> }
                                >
                                { item.t }
                            </MenuItem>
                        )) }
                    </div>
                ) }
            </Drawer>
        );
    }
}
