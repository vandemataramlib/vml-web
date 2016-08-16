import * as React from "react";
import { Models } from "vml-common";
import { observer, inject } from "mobx-react";

import { AppState } from "../../stores";
import { translit } from "../../shared/utils";
import { Encoding } from "../../shared/interfaces";
import { defaultEncoding } from "../../shared/constants";

interface StanzaWordTokenProps {
    token: Models.Token;
    appState?: AppState;
    onWordClick: any;
}

@inject("appState")
@observer
export class StanzaWordToken extends React.Component<StanzaWordTokenProps, {}> {
    render() {

        const { token, appState } = this.props;
        const styles = getStyles(this);

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
                    style={ styles.token(etymologies) }
                    onClick={ (event) => { return etymologies && this.props.onWordClick(event, token); } }
                    >
                    { translit(token.token, Encoding[defaultEncoding], Encoding[appState.encodingScheme.value]) }
                </span>&nbsp;
                { token.definition }{ token.definition && "\u00a0" }
            </span>
        );
    }
}

const getStyles = (context: StanzaWordToken) => {

    const styles = {
        token: (etymologies: string) => {

            let style = {
                fontWeight: "bold"
            };

            if (etymologies) {
                style = Object.assign(style, { cursor: "pointer" });
            }

            return style;
        }
    };

    return styles;
};
