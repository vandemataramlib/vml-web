import { observable, computed, action } from "mobx";
import * as fetch from "isomorphic-fetch";

import { Store } from "../interfaces/store";
import { API_SERVER_BASE_URL, WEB_SERVER_BASE_URL } from "../config/api";
import { translit } from "../utils";

export interface Token {
    id: string;
    token: string;
}

export interface Word {
    id: string;
    word: string;
    analysis?: Array<Token>;
}

export interface Line {
    id: string;
    line?: string;
    words?: Array<Word>;
}

export interface Text {
    id: string;
    lines: Array<Line>;
    verse: string;
    analysis: Array<Token>;
}

// class Chapter {
//     constructor(public id: string, text: Array<Text>) { }
// }

export class Document {
    slug: string;
    static getSingleDocumentAPIURL(slug: string) {
        return `${API_SERVER_BASE_URL}/documents/${slug}`;
    }

    static getSingleDocumentURL(slug: string) {
        return `/documents/${slug}`;
    }

    static getAllDocumentsAPIURL() {
        return `${API_SERVER_BASE_URL}/documents`;
    }

    static getAllDocumentsURL() {
        return `/documents`;
    }

    constructor(public id: string, public title: string, public text: Array<Text>, slug?: string, category?: number, subCategory?: number, tags?: Array<string>) {
        if (!slug) {
            this.slug = title.split(" ").join("-");
        } else {
            this.slug = slug;
        }
    }
}

type DocumentsCollection = {
    [slug: string]: Document;
}

export class DocumentStore implements Store {
    @observable documentsCollection: DocumentsCollection;
    @observable documents: Array<Document>;
    @observable shownDocument: Document;
    @observable isLoading;

    @computed get documentsTOC() {
        return this.documents.map(document => {
            return {
                u: `${Document.getSingleDocumentURL(document.slug)}`,
                t: translit(document.title)
            };
        });
    }

    constructor(initialState?: DocumentStore) {
        this.documentsCollection = initialState ? initialState.documentsCollection : {};
        this.documents = initialState ? initialState.documents : [];
        this.shownDocument = initialState ? initialState.shownDocument : null;
    }

    @action
    addDocumentToStore = (document: Document) => {
        this.documentsCollection[document.slug] = document;
    }

    @action
    addDocumentsToStore = (documents) => {
        this.documents = documents;
    }

    @action
    showDocument(slug: string): Promise<any> {

        if (this.documentsCollection[slug]) {
            this.shownDocument = this.documentsCollection[slug];
            return;
        } else {
            return Utils.fetchData(Document.getSingleDocumentAPIURL(slug), this.addDocumentToStore)
                .then(() => { this.shownDocument = this.documentsCollection[slug]; });
        }
    }

    @action
    getDocuments() {
        return Utils.fetchData(Document.getAllDocumentsAPIURL(), this.addDocumentsToStore);
    }

    @action
    updateDocumentText(slug: string, updatedText: Text) {
        // const text = this.documentsCollection[slug].text;
        // for (let i = 0; i < text.length; i++) {
        //     if (text[i].id === updatedText.id) {
        //         text[i] = updatedText;
        //         break;
        //     } else {
        //         continue;
        //     }
        // }
        const document = this.documentsCollection[slug];
        document.text = document.text.map(paragraph => {

            if (paragraph.id === updatedText.id) {
                paragraph = updatedText;
            }

            return paragraph;
        });
    }
}

export class Utils {
    static fetchData(url: string, cb: any): Promise<any> {

        return fetch(url)
            .then(response => response.json())
            .then(cb)
            .catch((err: Error) => {
                console.error(err.message);
                return err;
            });
    }
}
