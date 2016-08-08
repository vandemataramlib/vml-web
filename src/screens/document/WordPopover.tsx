import * as React from "react";
import { TextField, FlatButton, AutoComplete } from "material-ui";
import { grey500 } from "material-ui/styles/colors";
import { observable, action, toJS } from "mobx";
import { observer, inject } from "mobx-react";
import { Models } from "vml-common";

import { translit, getColour } from "../../shared/utils";
import { AppState } from "../../stores";

interface WordPopoverProps {
    word: Models.Word;
    onSaveWordAnalysis: any;
    onTouchTapCancel: any;
    appState?: AppState;
    // rootStore?: RootStore;
}

interface WordPopoverRefs {
    definitions?: {};
}

@inject("appState")
@observer
export class WordPopover extends React.Component<WordPopoverProps, {}> {
    @observable localWord: string;
    @observable localTokens: Models.Token[];
    componentRefs: WordPopoverRefs = [];

    @action
    setLocalWord = (localWord: string) => {

        this.localWord = localWord;
    }

    @action
    updateLocalTokens = (localTokens: Models.Token[]) => {

        this.localTokens = localTokens;
    }

    @action
    updateLocalTokenDefinitions = () => {

        this.localTokens.forEach(token => {

            token.definition = this.componentRefs.definitions[token.id].getValue();
        });
    }

    constructor(props) {

        super(props);
        this.componentRefs.definitions = {};
        this.setLocalWord(this.props.word.analysis ?
            this.props.word.analysis.map(token => token.token).join(" ")
            : this.props.word.word);

        this.updateLocalTokens(this.getTokensFromWord(this.props.word));
    }

    getTokensFromWord(word: Models.Word): Models.Token[] {

        if (word.analysis) {
            return word.analysis;
        }

        return this.splitWordIntoTokens(word.word, word.id);
    }

    splitWordIntoTokens(word: string, wordId: string): Models.Token[] {

        return word.split(/\s+/).map((token, i) => {

            return {
                id: `${wordId}.${i}`,
                token,
                wordId: wordId,
                ety: null,
                definition: null
            };
        });
    }

    handleWordChange = (event: any) => {

        this.setLocalWord(event.target.value.trim());
        this.updateLocalTokens(this.splitWordIntoTokens(event.target.value, this.props.word.id));
    }

    @action
    handleTokenDefinitionEntered = (event: any, tokenId: string) => {

        this.localTokens.find(token => token.id === tokenId).definition = event.target.value;
    }

    handleSave = (event) => {

        const { word, appState, onSaveWordAnalysis } = this.props;

        this.updateLocalTokenDefinitions();

        appState.updateEditedStanzaWordAnalysis(word.lineId, word.id, this.localTokens);

        onSaveWordAnalysis(event);
    }

    // handleRootSelected = (request: string, index: number) => {

    //     console.log(toJS(this.props.rootStore.roots[index]));
    // }

    render() {

        if (!this.props.word) {
            return null;
        }

        // const { rootStore } = this.props;

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
                        this.localTokens.map((token, i) => {

                            return (
                                <div style={ styles.tokenContainer } key={ Math.random() }>
                                    <span style={ { color: grey500, marginRight: 5 } }> { i === 0 ? "=" : "+"} </span>
                                    <span style={ Object.assign({ color: getColour(i) }, styles.sandhi) }>{ translit(token.token) }</span>
                                    <span style={ { color: grey500, marginRight: 5 } }> = </span>
                                    <TextField
                                        defaultValue={ token.definition ? (token.definition instanceof Array ? (token.definition as string[]).join(", ") : (token.definition as string)) : null }
                                        ref={ (definition) => this.componentRefs.definitions[token.id] = definition }
                                        hintText={ `Definition of ${translit(token.token)}` }
                                        fullWidth />
                                    {/*<AutoComplete
                                        dataSource={ rootStore.rootDataSource }
                                        openOnFocus={ false }
                                        hintText="Root"
                                        fullWidth={ true }
                                        filter={ (text, source) => text !== "" && source.startsWith(text) }
                                        onNewRequest={ this.handleRootSelected }
                                        />*/}
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
