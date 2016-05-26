import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import { grey500 } from 'material-ui/styles/colors';

import HeaderSettings from './HeaderSettings';
import { translit } from '../shared/utils';

export default class Header extends Component {
    constructor(props) {

        super(props);
        this.handleSettingsTouchTap = this.handleSettingsTouchTap.bind(this);
        this.handleSettingsRequestClose = this.handleSettingsRequestClose.bind(this);
        this.state = {
            settingsPopoverOpen: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {

        const { documentTitle, annotateMode  } = this.props;
        const { settingsPopoverOpen } = this.state;
        if (documentTitle === nextProps.documentTitle && annotateMode === nextProps.annotateMode && settingsPopoverOpen === nextState.settingsPopoverOpen) {
            return false;
        }

        return true;
    }


    handleSettingsTouchTap(event) {

        event.preventDefault();

        this.setState({
            settingsPopoverOpen: true,
            anchorEl: event.currentTarget
        });
    }

    handleSettingsRequestClose() {

        this.setState({
            settingsPopoverOpen: false
        });
    }

    render() {

        const { documentTitle, annotateMode, encoding, onAnnotateToggle, onEncodingChange } = this.props;

        return (
            <div>
                <div className="row" style={ styles.header }>
                    <div className="col-xs-9">
                        <h1>{ translit(documentTitle) }</h1>
                    </div>
                    <div style={ styles.settingsContainer } className="col-xs-3">
                        <FlatButton
                            label="Settings"
                            labelPosition="after"
                            primary
                            icon={ <ActionSettings /> }
                            onTouchTap={ this.handleSettingsTouchTap }
                            />
                    </div>
                </div>
                <HeaderSettings
                    popoverOpen={ this.state.settingsPopoverOpen }
                    onSettingsRequestClose={ this.handleSettingsRequestClose }
                    onAnnotateToggle={ onAnnotateToggle }
                    annotateMode={ annotateMode }
                    onEncodingChange={ onEncodingChange }
                    encoding={ encoding }
                    anchorEl={ this.state.anchorEl }
                    />
            </div>
        );
    }
}

Header.propTypes = {
    documentTitle: PropTypes.string,
    onAnnotateToggle: PropTypes.func,
    annotateMode: PropTypes.bool,
    onEncodingChange: PropTypes.func,
    encoding: PropTypes.string
};

const styles = {
    header: {
        borderBottom: `1px solid ${grey500}`
    },
    settingsContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
    }
};
