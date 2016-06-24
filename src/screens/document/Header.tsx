import * as React from "react";
import Paper from "material-ui/Paper";
import IconButton from "material-ui/IconButton";
import ActionSettings from "material-ui/svg-icons/action/settings";
import { orange200 } from "material-ui/styles/colors";

import HeaderSettings from "./HeaderSettings";
import { translit } from "../shared/utils";

interface HeaderProps {
    documentTitle: string;
    onAnnotateToggle: Function;
    annotateMode: boolean;
    onEncodingChange: Function;
    encoding: string;
};

export default class Header extends React.Component<HeaderProps, any> {
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
            <Paper style={ styles.self }>
                <div className="row" style={ styles.header }>
                    <div className="col-xs-9">
                        <h1>{ translit(documentTitle) }</h1>
                    </div>
                    <div style={ styles.settingsContainer } className="col-xs-3">
                        <IconButton
                            onTouchTap={ this.handleSettingsTouchTap }
                            iconStyle={ styles.smallIcon }
                            style={ styles.small }
                            >
                            <ActionSettings />
                        </IconButton>
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
            </Paper>
        );
    }
}

const styles = {
    self: {
        background: `linear-gradient(${orange200}, #fff)`,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        boxShadow: "rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 6px 6px"
    },
    header: {
        // borderBottom: `1px solid ${grey500}`
        padding: "0 20px 20px 20px"
    },
    settingsContainer: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    smallIcon: {
        width: 20,
        height: 20
    },
    small: {
        // width: 38,
        // height: 38,
        // padding: 16
    }
};
