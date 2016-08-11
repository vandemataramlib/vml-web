import * as React from "react";
import { grey300, grey500, orange500 } from "material-ui/styles/colors";
import { observable, action, toJS } from "mobx";
import { observer, inject } from "mobx-react";
import { Models } from "vml-common";

import { AppState } from "../../stores";
import { Tooltip } from "../shared/Tooltip";
import { translit, getColour, getLightColour } from "../../shared/utils";

interface WordProps {
    word: Models.Word;
    onWordClicked: any;
    appState?: AppState;
}

interface WordRefs {
    word?: HTMLSpanElement;
}

@inject("appState")
@observer
export class Word extends React.Component<WordProps, {}> {
    @observable hovered: boolean;
    componentRefs: WordRefs = {};
    tooltipPosition: ClientRect;

    @action
    setHovered = (hovered: boolean) => {

        this.hovered = hovered;
    }

    handleMouseEnter = () => {

        this.setHovered(true);
        this.tooltipPosition = this.componentRefs.word.getBoundingClientRect();
    }

    handleMouseLeave = () => {

        this.setHovered(false);
    }

    handleTouchTap = (event) => {

        const { appState, onWordClicked, word } = this.props;

        appState.setEditedWord(word);
        onWordClicked(event);
    }

    render() {

        const { word, onWordClicked } = this.props;

        return (
            <span
                style={ styles.wordContainer(this.hovered) }
                onMouseEnter={ this.handleMouseEnter }
                onMouseLeave={ this.handleMouseLeave }
                onTouchTap={ this.handleTouchTap }
                ref={ (word) => this.componentRefs.word = word }
                >
                <span>{ translit(word.word) }</span>
                <span style={ styles.analysedTokens }>
                    {
                        word.analysis ? word.analysis.map((w, i) => {
                            return React.Children.toArray([
                                <span style={ { color: grey500 } }> { i === 0 ? "" : "+" } </span>,
                                <span style={ { color: getColour(i) } }>{ translit(w.token) }</span>
                            ]);
                        }) : null
                    }
                </span>
                {
                    this.hovered &&
                    <Tooltip
                        show={ this.hovered }
                        label={ word.definition }
                        verticalPosition="top"
                        style={ Object.assign(this.tooltipPosition, styles.tooltip) }
                        />
                }
            </span>
        );
    }
}

const styles = {
    wordContainer: (hovered: boolean) => {
        let style = {
            display: "flex",
            flexDirection: "column",
            padding: 5,
            cursor: "pointer"
        };

        if (hovered) {
            Object.assign(style, {
                backgroundColor: grey300
            });
        }
        return style;
    },
    analysedTokens: {
        fontSize: "75%"
    },
    tooltip: {
        fontSize: "0.6em"
    }
};
