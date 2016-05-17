import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { uniqueId } from 'lodash';

import PaperCustom from '../shared/PaperCustom';

const categories = [
    {
        c: 'Shruti',
        id: 1,
        sub: [
            {
                c: 'Veda',
                id: 11
            },
            {
                c: 'Upanishad',
                id: 12
            },
            {
                c: 'Gita',
                id: 11
            }
        ]
    },
    {
        c: 'Smriti',
        id: 2,
        sub: [
            {
                c: 'Purana',
                id: 21
            }
        ]
    },
    {
        c: 'Itihasa',
        id: 3,
        sub: [
            {
                c: 'Ramayana',
                id: 31
            },
            {
                c: 'Mahabharata',
                id: 32
            }
        ]
    },
    {
        c: 'Shastra',
        id: 4
    },
    {
        c: 'Literature',
        id: 5
    },
    {
        c: 'Tantra',
        id: 6
    },
    {
        c: 'Vedanta',
        id: 7
    },
    {
        c: 'Yoga',
        id: 8
    },
    {
        c: 'Science and Technology',
        id: 9
    },
    {
        c: 'Other',
        id: 10
    }
];

export class TextForm extends Component {
    constructor(props) {

        super(props);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleCreateClicked = this.handleCreateClicked.bind(this);
        this.handleCancelClicked = this.handleCancelClicked.bind(this);
        this.state = {
            selectedCategory: ''
        };
    }

    handleCategoryChange(event, index, value) {

        console.log(index, value);
        this.setState({
            selectedCategory: value
        });
    }

    handleCreateClicked(event) {

        const documentTitle = this.documentTitle.getValue();
        const slug = documentTitle.split(' ').join('-');

        const documentTextRaw = this.documentText.getValue();

        let verses = documentTextRaw.split('\n\n');
        const refPattern = /\|{1,2}[\d\s]*\|{0,2}/;
        verses = verses.map((verse, verseIndex) => {

            let lines = verse.split('\n');
            lines = lines.map((line, lineIndex) => {

                line = line.replace(refPattern, '').trim();
                const words = line.split(' ').map((word, wordIndex) => {

                    const wordId = (verseIndex + 1) + '.' + (lineIndex + 1) + '.' + (wordIndex + 1);
                    return { id: wordId, word };
                });
                return { id: (verseIndex + 1) + '.' + (lineIndex + 1), words };
            });
            return { id: verseIndex + 1, lines };
        });

        // debugger;

        const documentObject = {
            id: Date.now(),
            title: documentTitle,
            category: this.documentCategory.props.value,
            subCategory: this.documentSubCategory.getValue(),
            tags: this.documentTags.getValue().split(',').map((tag) => tag.trim()),
            text: verses
        };

        localStorage.setItem(slug, JSON.stringify(documentObject));
        this.props.router.push(`/documents/${slug}`);
    }

    handleCancelClicked() {

        this.props.router.push('/');
    }

    render() {

        return (
            <div className="row">
                <div className="col-xs-offset-2 col-xs-8">
                    <PaperCustom>
                        <div className="row">
                            <div className="col-xs-12">
                                <h1>New Document</h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <TextField
                                    hintText="Document title in ITRANS"
                                    floatingLabelText="Title"
                                    fullWidth
                                    ref={ (c) => this.documentTitle = c }
                                    />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-6">
                                <SelectField
                                    floatingLabelText="Category"
                                    fullWidth
                                    onChange={ this.handleCategoryChange }
                                    value={ this.state.selectedCategory }
                                    ref={ (c) => this.documentCategory = c }
                                    >
                                    { categories.map((category) => <MenuItem value={ category.id } key={ category.id } primaryText={ category.c } />) }
                                </SelectField>
                            </div>
                            <div className="col-xs-6">
                                <TextField
                                    floatingLabelText="Sub-category"
                                    fullWidth
                                    ref={ (c) => this.documentSubCategory = c }
                                    />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <TextField
                                    hintText="Comma-separated"
                                    floatingLabelText="Tags"
                                    fullWidth
                                    ref={ (c) => this.documentTags = c }
                                    />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <TextField
                                    hintText="Main document text in ITRANS"
                                    floatingLabelText="Text"
                                    multiLine
                                    rows={ 20 }
                                    fullWidth
                                    ref={ (c) => this.documentText = c }
                                    />
                            </div>
                        </div>
                        <div className="row" style={ styles.createButton }>
                            <div className="col-xs-12">
                                <FlatButton label="Cancel" secondary onClick={ this.handleCancelClicked } />
                                <FlatButton label="Create" primary onClick={ this.handleCreateClicked } />
                            </div>
                        </div>
                    </PaperCustom>
                </div>
            </div>
        );
    }
}

export default withRouter(TextForm);

const styles = {
    createButton: {
        marginTop: 30,
        textAlign: 'right'
    }
};
