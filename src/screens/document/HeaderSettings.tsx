import * as React from "react";
import Popover from "material-ui/Popover";
import Divider from "material-ui/Divider";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";
import Toggle from "material-ui/Toggle";
import { observer } from "mobx-react";

import { AppState, Encoding } from "../../stores/appState";

interface HeaderSettingsProps {
    popoverOpen: boolean;
    onSettingsRequestClose: any;
    onAnnotateToggle: Function;
    annotateMode: boolean;
    anchorEl: React.Component<any, any>;
    appState?: AppState;
};

@observer(["appState"])
export class HeaderSettings extends React.Component<HeaderSettingsProps, {}> {
    handleEncodingChange = (event) => {

        this.props.appState.changeEncoding(parseInt(event.currentTarget.value));
    }

    render() {

        const { anchorEl, annotateMode, onAnnotateToggle, onSettingsRequestClose, appState } = this.props;

        return (
            <Popover
                open={ this.props.popoverOpen }
                anchorEl={ anchorEl }
                onRequestClose={ onSettingsRequestClose }
                style={ styles.settingsPopover }
                >
                <Toggle
                    label="Annotate"
                    onToggle={ onAnnotateToggle }
                    labelPosition="right"
                    style={ styles.annotate }
                    toggled={ annotateMode }
                    />
                <Divider style={ styles.divider }/>
                <RadioButtonGroup
                    onChange={ this.handleEncodingChange }
                    name="encoding"
                    defaultSelected={ appState.encoding.toString() }
                    >
                    {
                        appState.encodingSchemes.map((scheme, i) => {

                            return (
                                <RadioButton
                                    value={ scheme.value.toString() }
                                    label={ scheme.label }
                                    style={ styles.encodingRadioButton }
                                    labelStyle={ styles.labelStyle }
                                    key={ i }
                                    />
                            );
                        })
                    }
                </RadioButtonGroup>
            </Popover>
        );
    }
}

const styles = {
    settingsPopover: {
        padding: 10,
        fontSize: "85%"
    },
    annotate: {
        marginBottom: 10
    },
    divider: {
        margin: "10px 0"
    },
    encodingRadioButton: {
        marginBottom: 5
    },
    labelStyle: {
        fontFamily: "Monotype Sabon, Auromere, serif, Siddhanta"
    }
};
