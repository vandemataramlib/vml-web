import { AppState, DocumentStore, DocumentListStore, StanzaStore } from "../stores";

export interface Context {
    appState: AppState;
    documentStore: DocumentStore;
    documentListStore: DocumentListStore;
    stanzaStore: StanzaStore;
}
