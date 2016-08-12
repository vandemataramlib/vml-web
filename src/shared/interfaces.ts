import { AppState, DocumentStore, DocumentListStore, StanzaStore, RootStore, SuffixStore, PrefixStore } from "../stores";

export interface Context {
    appState: AppState;
    documentStore: DocumentStore;
    documentListStore: DocumentListStore;
    stanzaStore: StanzaStore;
    rootStore: RootStore;
    suffixStore: SuffixStore;
    prefixStore: PrefixStore;
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
    onActionTouchTap?: any;
    autoHideDuration?: number;
}

export interface EtymologyDataSource {
    text: string;
    value: JSX.Element;
}
