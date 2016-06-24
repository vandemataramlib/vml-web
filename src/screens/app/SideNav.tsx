import * as React from "react";
import Divider from "material-ui/Divider";
import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";
import Subheader from "material-ui/Subheader";
import * as ExecutionEnvironment from "fbjs/lib/ExecutionEnvironment";
import { Link } from "react-router";

import { translit } from "../shared/utils";

export default class SideNav extends React.Component<any, any> {
    render() {

        // const menus = [
        //     {
        //         group: 'Admin',
        //         items: [
        //             {
        //                 u: '/new',
        //                 t: 'New document'
        //             },
        //             {
        //                 u: '/about',
        //                 t: 'About'
        //             }
        //         ]
        //     }
        // ];

        const menus = [];

        if (ExecutionEnvironment.canUseDOM) {

            const documents = localStorage.getItem("documents");

            if (documents) {
                const documentsObj = JSON.parse(documents);
                const documentMenuItems = documentsObj.map((doc) => { return { u: `/documents/${doc.slug}`, t: translit(doc.title) }; });
                menus.push({ group: "Documents", items: documentMenuItems });
            }
        }

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
