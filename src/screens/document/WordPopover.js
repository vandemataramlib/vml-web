import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { grey500 } from 'material-ui/styles/colors';
import { assign } from 'lodash';

import { translit, getColour } from '../shared/utils';

export default class WordPopover extends Component {
    constructor(props) {

        super(props);
        this.handleWordChange = this.handleWordChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.state = {
            localWord: this.props.word ? this.props.word.word : null
        };
    }

    handleWordChange(event, value) {

        this.setState({
            localWord: value
        });
    }

    handleSave(event) {

        const originalWord = this.props.word;

        const wordAnalysis = this.state.localWord.split(' ').map((word, wordIndex) => {

            return {
                id: originalWord.id + '.' + (wordIndex + 1),
                token: word
            };
        });
        this.props.onSaveWordAnalysis(event, { wordId: originalWord.id, analysis: wordAnalysis });
    }

    render() {

        if (!this.props.word) {
            return null;
        }

        return (
            <div style={ styles.popoverStyle }>
                <div style={ styles.heading }>{ translit(this.props.word.word) }</div>
                <div>
                    {
                        this.state.localWord.split(' ').map((w, i) => {
                            return React.Children.toArray([
                                <span style={ { color: grey500 } }> { i === 0 ? '=' : '+'} </span>,
                                <span style={ assign({ color: getColour(i) }, styles.sandhi) }>{ translit(w) }</span>
                            ]);
                        })
                    }
                </div>
                <TextField id="itrans-word" defaultValue={ this.props.word.word } onChange={ this.handleWordChange } fullWidth />
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
        padding: '10px 20px',
        minWidth: 400
    },
    createButton: {
        textAlign: 'right'
    },
    heading: {
        fontWeight: 'bold',
        fontSize: '1.17em',
        marginBottom: 10
    },
    sandhi: {
        fontWeight: 'bold',
        fontSize: '1.25em'
    }
};
