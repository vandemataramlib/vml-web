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

        const analysed = word.analysis &&
            (
                (word.analysis.length > 1) // has more than one token
                || (word.analysis.length === 1 && word.analysis[0].token !== word.word) // is visarga sandhi
            );

        const tooltipText = analysed && word.analysis.map(token => {

            return translit(token.token, Encoding[defaultEncoding], Encoding[appState.encodingScheme.value]);
        }).join(" + ");

        const wordEl = (
            <span>
                <span
                    className={ tooltipText && "hint--top"}
                    aria-label={ tooltipText }
                    >
                    { transliteratedWord }
                </span>&nbsp;
                {
                    punctuation && <span>{ translit(punctuation, Encoding[defaultEncoding], Encoding[appState.encodingScheme.value]) }</span>
                }
            </span>
        );

        return wordEl;
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
                        <div className="stanza-analysis">
                            { stanza.analysis.map(token => {

                                const etymologies = token.ety && token.ety.map(ety => {

                                    let text = translit(ety.value, Encoding[defaultEncoding], Encoding[appState.encodingScheme.value]);
                                    if (ety.type === Models.EtymologyType.Root) {
                                        text = "√" + text;
                                    }
                                    return text;
                                }).join(" + ");

                                return (
                                    <span
                                        key={ token.id }>
                                        <span
                                            className={ etymologies && "hint--top"}
                                            aria-label={ etymologies }
                                            style={ styles.token }
                                            >
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
