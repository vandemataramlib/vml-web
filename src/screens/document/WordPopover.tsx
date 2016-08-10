import * as React from "react";
import { TextField, FlatButton, AutoComplete, IconMenu, MenuItem, IconButton } from "material-ui";
import { ContentAddCircleOutline, ContentClear } from "material-ui/svg-icons";
import { grey500 } from "material-ui/styles/colors";
import { observable, action, toJS, ObservableMap, map } from "mobx";
import { observer, inject } from "mobx-react";
import { Models } from "vml-common";

import { translit, getColour, getLightColour } from "../../shared/utils";
import { AppState, RootStore, PrefixStore, SuffixStore } from "../../stores";

interface WordPopoverProps {
    word: Models.Word;
    onSaveWordAnalysis: any;
    onTouchTapCancel: any;
    appState?: AppState;
    rootStore?: RootStore;
    suffixStore?: SuffixStore;
    prefixStore?: PrefixStore;
}

interface TokenDefinition {
    [tokenId: string]: TextField;
}

interface WordPopoverRefs {
    tokenDefinitions?: TokenDefinition;
    wordDefinition?: TextField;
}

@inject("appState", "rootStore", "prefixStore", "suffixStore")
@observer
export class WordPopover extends React.Component<WordPopoverProps, {}> {
    @observable localWord: string;
    @observable localTokens: Models.Token[];
    @observable localEtymologies: ObservableMap<Models.Etymology[]> = map<Models.Etymology[]>();
    componentRefs: WordPopoverRefs = {};

    constructor(props) {

        super(props);
        this.componentRefs.tokenDefinitions = {};
        this.setLocalWord(this.props.word.analysis ?
            this.props.word.analysis.map(token => token.token).join(" ")
            : this.props.word.word);

        this.updateLocalTokens(this.getTokensFromWord(this.props.word));
    }

    @action
    setLocalWord = (localWord: string) => {

        this.localWord = localWord;
    }

    @action
    updateLocalTokens = (localTokens: Models.Token[]) => {

        this.localTokens = [];
        this.localTokens = localTokens;
    }

    @action
    updateLocalTokenDefinitions = () => {

        this.localTokens.forEach(token => {

            token.definition = this.componentRefs.tokenDefinitions[token.id].getValue();
        });
    }

    @action
    attachLocalEtymologyToTokens = () => {

        const etyEntries = this.localEtymologies.entries();
        for (let [tokenId, localEtymologies] of toJS(etyEntries)) {

            const nonEmptyEtyTokens = (localEtymologies as Models.Etymology[])
                .filter(etymology => etymology.value && etymology.value.trim().length > 0);
            this.localTokens.find(token => token.id === tokenId).ety = nonEmptyEtyTokens;
        }
    }

    @action
    handleAddLocalEtymology = (tokenId: string, type: Models.EtymologyType) => {

        const ety = new Models.Etymology({
            id: null,
            tokenId,
            type,
            value: null,
            senses: [],
            typeId: null
        });

        if (this.localEtymologies.has(tokenId)) {
            const etymologies = this.localEtymologies.get(tokenId);
            ety.id = `${tokenId}.${etymologies.length}`;
            this.localEtymologies.get(tokenId).push(ety);
        }
        else {
            ety.id = `${tokenId}.0`;
            this.localEtymologies.set(tokenId, [ety]);
        }
    }

    @action
    setLocalTokenEtymology = (ety: ObservableMap<Models.Etymology[]>) => {

        this.localEtymologies = ety;
    }

    @action
    setEtymologiesFromTokens(tokens: Models.Token[]) {

        tokens.forEach(token => {

            if (token.ety) {
                this.localEtymologies.set(token.id, token.ety);
            }
        });
    }

    @action
    handleTokenDefinitionEntered = (event: any, tokenId: string) => {

        this.localTokens.find(token => token.id === tokenId).definition = event.target.value.trim();
    }

    @action
    handleEtyRemoved = (event, ety: Models.Etymology) => {

        const tokenEtymologies = this.localEtymologies.get(ety.tokenId);
        const deletedIndex = tokenEtymologies.findIndex(tokenEtymology => tokenEtymology.id === ety.id);
        this.localEtymologies.set(ety.tokenId, [
            ...tokenEtymologies.slice(0, deletedIndex),
            ...tokenEtymologies.slice(deletedIndex + 1)
        ]);
    }

    @action
    handleEtySelected = (request: any, index: number, ety: Models.Etymology) => {

        if (index < 0) {
            return;
        }

        const tokenEtymologies = this.localEtymologies.get(ety.tokenId);
        const tokenEtymology = tokenEtymologies.find(tokenEtymology => tokenEtymology.id === ety.id);
        tokenEtymology.value = request.text;
        if (ety.type === Models.EtymologyType.Root) {
            const root = this.props.rootStore.roots[index];
            tokenEtymology.senses = root.senses;
            tokenEtymology.typeId = root._id;
        }
        else if (ety.type === Models.EtymologyType.Prefix) {
            const prefix = this.props.prefixStore.prefixes[index];
            tokenEtymology.senses = prefix.senses;
            tokenEtymology.typeId = prefix._id;
        }
        else if (ety.type === Models.EtymologyType.Suffix) {
            const suffix = this.props.suffixStore.suffixes[index];
            tokenEtymology.senses = suffix.senses;
            tokenEtymology.typeId = suffix._id;
        }
    }

    getTokensFromWord(word: Models.Word): Models.Token[] {

        if (word.analysis) {
            const wordAnalysisClone = word.analysis.slice();
            this.setEtymologiesFromTokens(wordAnalysisClone);
            return wordAnalysisClone;
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
        this.setLocalTokenEtymology(map<Models.Etymology[]>());
        this.updateLocalTokens(this.splitWordIntoTokens(this.localWord, this.props.word.id));
    }

    handleSave = (event) => {

        const { word, appState, onSaveWordAnalysis } = this.props;

        this.updateLocalTokenDefinitions();

        this.attachLocalEtymologyToTokens();

        word.definition = this.componentRefs.wordDefinition.getValue();

        appState.updateEditedStanzaWordAnalysis(word.lineId, word.id, this.localTokens);

        onSaveWordAnalysis(event);
    }

    render() {

        if (!this.props.word) {
            return null;
        }

        const { rootStore, prefixStore, suffixStore } = this.props;

        const etymologies = (ety: Models.Etymology, i) => {

            let dataSource;

            if (ety.type === Models.EtymologyType.Root) {
                dataSource = rootStore.rootsDataSource;
            }
            else if (ety.type === Models.EtymologyType.Prefix) {
                dataSource = prefixStore.prefixesDataSource;
            }
            else if (ety.type === Models.EtymologyType.Suffix) {
                dataSource = suffixStore.suffixesDataSource;
            }

            return (
                <div style={ styles.etymologiesList } key={ i } className="etymology-list">
                    <div style={ styles.etymologyTypeLabel }>
                        { Models.EtymologyType[ety.type]}
                    </div>
                    <AutoComplete
                        openOnFocus={ true }
                        hintText={ `${Models.EtymologyType[ety.type]} (ITRANS)` }
                        dataSource={ dataSource }
                        searchText={ ety.value ? ety.value : "" }
                        filter={ (text, source) => text !== "" && source.startsWith(text) }
                        fullWidth={ true }
                        onNewRequest={ (request, index) => this.handleEtySelected(request, index, ety) }
                        maxSearchResults={ 10 }
                        />
                    <IconButton
                        style={ styles.deleteEtymologyButton }
                        iconStyle={ styles.deleteEtymologyIcon }
                        disableTouchRipple
                        disableFocusRipple
                        onTouchTap={ (event) => this.handleEtyRemoved(event, ety) }
                        >
                        <ContentClear />
                    </IconButton>
                </div>
            );
        };

        return (
            <div style={ styles.popoverStyle }>
                <div style={ styles.heading }>
                    { translit(this.props.word.word) }
                </div>
                <TextField
                    floatingLabelText="Definition"
                    defaultValue={ this.props.word.definition as string }
                    ref={ (wordDefinition) => this.componentRefs.wordDefinition = wordDefinition }
                    inputStyle={ styles.definition }
                    fullWidth
                    />
                <TextField
                    floatingLabelText="Analysis (ITRANS)"
                    defaultValue={ this.localWord }
                    onChange={ this.handleWordChange }
                    inputStyle={ styles.analysis }
                    fullWidth
                    />
                {
                    this.localTokens.map((token, i) => {

                        return (
                            <div key={ i } style={ styles.analysisContainer(i) }>
                                <div style={ styles.tokenContainer }>
                                    <span style={ styles.equalsOrPlusSign }> { i === 0 ? "=" : "+"} </span>
                                    <span style={ Object.assign({ color: getColour(i) }, styles.sandhi) }>{ translit(token.token) }</span>
                                    <span style={ styles.equalsOrPlusSign }> = </span>
                                    <TextField
                                        defaultValue={ token.definition && (token.definition instanceof Array ? (token.definition as string[]).join(", ") : (token.definition as string)) }
                                        ref={ (definition) => this.componentRefs.tokenDefinitions[token.id] = definition }
                                        onKeyDown={ (event) => this.handleTokenDefinitionEntered(event, token.id) }
                                        hintText={ `Definition of ${translit(token.token)}` }
                                        inputStyle={ styles.definition }
                                        fullWidth
                                        />
                                    <IconMenu
                                        iconButtonElement={
                                            <IconButton style={ styles.addEtymologyButton }>
                                                <ContentAddCircleOutline color={ grey500 } />
                                            </IconButton>
                                        }
                                        >
                                        <MenuItem
                                            primaryText="Root"
                                            onTouchTap={ () => this.handleAddLocalEtymology(token.id, Models.EtymologyType.Root) }
                                            />
                                        <MenuItem
                                            primaryText="Prefix"
                                            onTouchTap={ () => this.handleAddLocalEtymology(token.id, Models.EtymologyType.Prefix) }
                                            />
                                        <MenuItem
                                            primaryText="Suffix"
                                            onTouchTap={ () => this.handleAddLocalEtymology(token.id, Models.EtymologyType.Suffix) }
                                            />
                                    </IconMenu>
                                </div>
                                <div style={ styles.etymologyContainer } >
                                    {
                                        this.localEtymologies.has(token.id) &&
                                        this.localEtymologies.get(token.id).map(etymologies)
                                    }
                                </div>
                            </div>
                        );
                    })
                }
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
        minWidth: 450
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
    },
    etymologyContainer: {
        display: "flex",
        flexDirection: "column"
    },
    addEtymologyButton: {
        width: 20,
        height: 20,
        padding: 0
    },
    deleteEtymologyButton: {
        width: "inherit",
        height: "inherit",
        padding: 0
    },
    deleteEtymologyIcon: {
        width: 16,
        height: 16,
        color: grey500
    },
    etymologyTypeLabel: {
        alignSelf: "center",
        paddingRight: 10,
        fontSize: "80%",
        textTransform: "uppercase"
    },
    etymologiesList: {
        display: "flex"
    },
    equalsOrPlusSign: {
        color: grey500,
        marginRight: 5
    },
    analysis: {
        fontFamily: "monospace"
    },
    definition: {
        fontWeight: 500
    },
    analysisContainer: (i: number) => {

        return {
            backgroundColor: getLightColour(i),
            padding: "5px 10px",
            marginBottom: 5
        };
    }
};
