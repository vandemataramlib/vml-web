import * as React from "react";
import { TextField, FlatButton } from "material-ui";
import { grey500 } from "material-ui/styles/colors";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { Models } from "vml-common";

import { translit, getColour } from "../../shared/utils";
import { DocumentStore } from "../../stores";

interface WordPopoverProps {
    word: Models.Word;
    onSaveWordAnalysis: any;
    onTouchTapCancel: any;
}

@observer
export class WordPopover extends React.Component<WordPopoverProps, {}> {
    @observable localWord: string;

    @action
    setLocalWord = (localWord: string) => {

        this.localWord = localWord;
    }

    constructor(props) {

        super(props);
        this.setLocalWord(this.props.word.analysis ? this.props.word.analysis.map(token => token.token).join(" ") : this.props.word.word)
    }

    handleWordChange = (event) => {

        this.setLocalWord(event.target.value.trim())
    }

    handleTokenMeaningEntered = (event) => {

        console.log(event.currentTarget.value);
    }

    handleSave = (event) => {

        const { word } = this.props;

        const analysis = this.localWord.split(/\s+/).map((token, tokenIndex): Models.Token => {

            return {
                id: word.id + "." + (tokenIndex + 1),
                token: token
            };
        });

        this.props.onSaveWordAnalysis(event, { id: word.id, word, analysis });
    }

    render() {

        if (!this.props.word) {
            return null;
        }

        return (
            <div style={ styles.popoverStyle }>
                <div style={ styles.heading }>{ translit(this.props.word.word) }</div>
                <TextField
                    floatingLabelText={ `Sandhi vichchheda for ${translit(this.props.word.word)}` }
                    defaultValue={ this.localWord }
                    onChange={ this.handleWordChange }
                    fullWidth
                    />
                <div>
                    {
                        this.localWord.split(/\s+/).map((w, i) => {
                            // return React.Children.toArray([
                            //     <span style={ { color: grey500 } }> { i === 0 ? "=" : "+"} </span>,
                            //     <span style={ Object.assign({ color: getColour(i) }, styles.sandhi) }>{ translit(w) }</span>
                            // ]);
                            return (
                                <div style={ styles.tokenContainer } key={ i }>
                                    <span style={ { color: grey500, marginRight: 5 } }> { i === 0 ? "=" : "+"} </span>
                                    <span style={ Object.assign({ color: getColour(i) }, styles.sandhi) }>{ translit(w) }</span>
                                    <span style={ { color: grey500, marginRight: 5 } }> = </span>
                                    <TextField onChange={ this.handleTokenMeaningEntered } hintText={ `Meaning of ${translit(w)}` } fullWidth />
                                </div>
                            );
                        })
                    }
                </div>
                <div className="row" style={ styles.createButton }>
                    <div className="col-xs-12">
                        <FlatButton label="Cancel" secondary onTouchTap={ this.props.onTouchTapCancel } />
                        <FlatButton label="Save" primary onTouchTap={ this.handleSave } />
                    </div>
                </div>
            </div>
        );
    }
}

const styles = {
    popoverStyle: {
        padding: "10px 20px",
        minWidth: 400
    },
    createButton: {
        textAlign: "right"
    },
    heading: {
        fontWeight: "bold",
        fontSize: "1.17em",
        marginBottom: -10
    },
    sandhi: {
        fontWeight: "bold",
        fontSize: "1.25em",
        marginRight: 5
    },
    tokenContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    }
};
