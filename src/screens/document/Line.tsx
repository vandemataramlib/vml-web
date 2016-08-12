import * as React from "react";
import { Models } from "vml-common";
import { observer } from "mobx-react";

import { Word } from "./Word";

interface LineProps {
    line: Models.Line;
    onWordClicked: any;
}

const Line = observer((props: LineProps) => {
    return (
        <span style={ styles.line }>
            {
                props.line.words.map(
                    (word, wordIndex) =>
                        <Word
                            word={ word }
                            onWordClicked={ props.onWordClicked }
                            key={ word.id }
                            />
                )
            }
        </span>
    );
});

export { Line };

const styles = {
    line: {
        display: "flex",
        justifyContent: "center"
    }
};
