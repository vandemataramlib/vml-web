import * as React from "react";
import { Paper, IconButton } from "material-ui";
import { ActionSettings } from "material-ui/svg-icons";
import { orange200 } from "material-ui/styles/colors";
import { observable, action } from "mobx";
import { observer, inject } from "mobx-react";

import { HeaderSettings } from "./HeaderSettings";
import { translit } from "../../shared/utils";
import { AppState, DocumentStore } from "../../stores";

interface HeaderProps {
    appState?: AppState;
    documentStore?: DocumentStore;
};

@inject("appState", "documentStore")
@observer
export class Header extends React.Component<HeaderProps, {}> {
    @observable settingsPopoverOpen: boolean;
    @observable anchorEl: any;

    @action
    setSettingsPopover = (open: boolean) => {

        this.settingsPopoverOpen = open;
    }

    @action
    setAnchorEl = (anchorEl: any) => {

        this.anchorEl = anchorEl;
    }

    handleSettingsTouchTap = (event) => {

        event.preventDefault();

        this.setSettingsPopover(true);
        this.setAnchorEl(event.currentTarget);
    }

    handleSettingsRequestClose = () => {

        this.setSettingsPopover(false);
    }

    handleAnnotateToggle = (event, value) => {

        this.props.appState.setAnnotateMode(value);
    }

    render() {

        const { appState, documentStore } = this.props;

        if (!documentStore.shownDocument) {
            return null;
        }

        return (
            <Paper style={ styles.self }>
                <div className="row" style={ styles.header }>
                    <div className="col-xs-9">
                        <h1>{ translit(documentStore.shownDocument.title) }</h1>
                    </div>
                    <div style={ styles.settingsContainer(appState) } className="col-xs-3">
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
                    popoverOpen={ this.settingsPopoverOpen }
                    onSettingsRequestClose={ this.handleSettingsRequestClose }
                    onAnnotateToggle={ this.handleAnnotateToggle }
                    annotateMode={ appState.annotateMode }
                    anchorEl={ this.anchorEl }
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
    settingsContainer: (appState: AppState) => {
        return {
            display: appState.isClientEnv ? "flex" : "none",
            justifyContent: "flex-end",
            alignItems: "center"
        };
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
