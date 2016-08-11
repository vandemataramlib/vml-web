import * as React from "react";
import { Models } from "vml-common";
import { grey500 } from "material-ui/styles/colors";
import { observer, inject } from "mobx-react";

import { translit } from "../../shared/utils";
import { Encoding } from "../../shared/interfaces";
import { AppState } from "../../stores";
import { defaultEncoding } from "../../shared/constants";

interface StanzaBodyProps {
    stanza: Models.Stanza;
    appState?: AppState;
}

@inject("appState")
@observer
export class StanzaBody extends React.Component<StanzaBodyProps, {}> {
    renderLine = (line: Models.Line, lineIndex: number) => {

        const { stanza } = this.props;

        const wordsLength = line.words.length;
        const words = line.words.map((word, i) => this.renderWord(word, i, wordsLength - 1 === i, stanza.lines.length - 1 === lineIndex));
        return lineIndex === 0 ? words : React.Children.toArray([<br />, words]);
    }

    renderWord = (word: Models.Word, wordIndex: number, isLastWord: boolean, isLastLine: boolean) => {

        const { stanza, appState } = this.props;

        const punctuation = isLastWord ? (isLastLine ? `||${stanza.runningId}||` : "|") : null;
        const transliteratedWord = translit(word.word, Encoding[defaultEncoding], Encoding[appState.encodingScheme.value]);

        const render = punctuation ?
            <span>
                <span>{ transliteratedWord } </span>
                { punctuation && <span>{ translit(punctuation, Encoding[defaultEncoding], Encoding[appState.encodingScheme.value]) }</span>}
            </span>
            : <span>{ transliteratedWord } </span>;

        return render;
    }

    render() {
        const { stanza, appState } = this.props;
        const styles = getStyles();

        return (
            <div>
                <p style={ styles.stanza }>
                    { stanza.lines.map(this.renderLine) }
                </p>
                {
                    stanza.analysis && stanza.analysis.length > 0 &&
                    <div>
                        <div style={ styles.sectionLabel }>ANALYSIS</div>
                        <div>
                            { stanza.analysis.map((token, i) => {

                                return (
                                    <span
                                        key={ i }>
                                        <span style={ styles.token }>
                                            { translit(token.token, Encoding[defaultEncoding], Encoding[appState.encodingScheme.value]) }
                                        </span>&nbsp;
                                        { token.definition }{ token.definition && "\u00a0" }
                                    </span>
                                );
                            }) }
                        </div>
                    </div>
                }
                {
                    stanza.translation && stanza.translation.length > 0 &&
                    <div>
                        <div style={ styles.sectionLabel }>TRANSLATION</div>
                        <div style={ styles.translationBody }>{ `${stanza.runningId}. ${stanza.translation}` }</div>
                    </div>
                }
            </div>
        );
    }
}

const getStyles = () => {

    const styles = {
        stanza: {
            margin: "8px 0",
            fontSize: "1.5em"
        },
        token: {
            fontWeight: "bold"
        },
        sectionLabel: {
            fontSize: "80%",
            margin: "20px 0 10px",
            color: grey500,
            fontFamily: "Charlotte Sans, sans-serif"
        },
        translationBody: {
            fontSize: "1.2em"
        }
    };

    return styles;
};
