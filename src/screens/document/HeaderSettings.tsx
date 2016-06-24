import * as React from "react";
import Popover from "material-ui/Popover";
import Divider from "material-ui/Divider";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";
import Toggle from "material-ui/Toggle";

const encodingSchemes = [
    {
        value: "devanagari",
        label: "देवनागरी"
    },
    {
        value: "iast",
        label: "Roman"
    }
];

interface HeaderSettingsProps {
    popoverOpen: boolean;
    onSettingsRequestClose: any;
    onAnnotateToggle: Function;
    annotateMode: boolean;
    onEncodingChange: any;
    encoding: string;
    anchorEl: React.Component<any, any>;
};

export default class HeaderSettings extends React.Component<HeaderSettingsProps, any> {
    shouldComponentUpdate(nextProps, nextState) {

        const { annotateMode, popoverOpen } = this.props;

        if (annotateMode === nextProps.annotateMode && popoverOpen === nextProps.popoverOpen) {
            return false;
        }

        return true;
    }

    render() {

        const { anchorEl, annotateMode, encoding, onAnnotateToggle, onEncodingChange, onSettingsRequestClose } = this.props;

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
                    onChange={ onEncodingChange }
                    name="encoding"
                    defaultSelected={ encoding }
                    >
                    {
                        encodingSchemes.map((scheme, i) => {

                            return (
                                <RadioButton
                                    value={ scheme.value }
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
