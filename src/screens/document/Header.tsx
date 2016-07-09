import * as React from "react";
import Paper from "material-ui/Paper";
import IconButton from "material-ui/IconButton";
import ActionSettings from "material-ui/svg-icons/action/settings";
import { orange200 } from "material-ui/styles/colors";
import { observable } from "mobx";
import { observer } from "mobx-react";

import { HeaderSettings } from "./HeaderSettings";
import { translit } from "../../utils";
import { AppState } from "../../stores/appState";
import { DocumentStore } from "../../stores/documents";

interface HeaderProps {
    onAnnotateToggle: Function;
    annotateMode: boolean;
    appState?: AppState;
    documentStore?: DocumentStore;
};

@observer(["appState", "documentStore"])
export class Header extends React.Component<HeaderProps, {}> {
    @observable settingsPopoverOpen: boolean;
    @observable anchorEl: any;

    handleSettingsTouchTap = (event) => {

        event.preventDefault();

        this.settingsPopoverOpen = true;
        this.anchorEl = event.currentTarget;
    }

    handleSettingsRequestClose = () => {

        this.settingsPopoverOpen = false;
    }

    render() {

        const { annotateMode, onAnnotateToggle, appState, documentStore } = this.props;

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
                    onAnnotateToggle={ onAnnotateToggle }
                    annotateMode={ annotateMode }
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
    settingsContainer: (appState) => {
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
