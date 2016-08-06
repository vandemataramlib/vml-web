import { AppState, DocumentStore, DocumentListStore, StanzaStore } from "../stores";

export interface Context {
    appState: AppState;
    documentStore: DocumentStore;
    documentListStore: DocumentListStore;
    stanzaStore: StanzaStore;
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
