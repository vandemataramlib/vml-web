import React, { Component, PropTypes } from 'react';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import Sanscript from 'sanscript';
import { Link } from 'react-router';

const menus = [
    {
        group: 'Admin',
        items: [
            {
                u: '/new',
                t: 'New document'
            },
            {
                u: '/about',
                t: 'About'
            }
        ]
    },
    {
        group: 'Documents',
        items: [
            {
                u: '/documents/IshopaniShad',
                t: Sanscript.t('IshopaniShad', 'itrans', 'devanagari')
            }
        ]
    }
];

export default class SideNav extends Component {
    // constructor(props) {

    //     super(props);
    // }

    render() {

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
