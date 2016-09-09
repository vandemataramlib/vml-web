import { TextField } from "material-ui";

import * as Stores from "../stores";

export interface Context {
    appState: Stores.AppState;
    documentStore: Stores.DocumentStore;
    documentListStore: Stores.DocumentListStore;
    stanzaStore: Stores.StanzaStore;
    rootStore: Stores.RootStore;
    suffixStore: Stores.SuffixStore;
    prefixStore: Stores.PrefixStore;
    collectionStore: Stores.CollectionStore;
    authStore: Stores.AuthStore;
}

export enum Encoding {
    devanagari,
    iast,
    itrans
}

export enum Environment {
    Server,
    Client
}

export enum FetchLevel {
    Local,
    App
}

export interface StanzaData {
    stanzaURL: string;
    runningId: string;
}

export interface SnackbarInfo {
    message: string;
    action?: string;
    onActionTouchTapURL?: string;
    autoHideDuration?: number;
}

export interface EtymologyDataSource {
    text: string;
    value: JSX.Element;
}

export interface SelectedCollection {
    id: string;
    title: string;
}

export interface CollectionDialogRefs {
    collectionName?: TextField;
    collectionDesc?: TextField;
}
