import { AppState } from "../stores/appState";
import { DocumentStore } from "../stores/documents";
import { DocumentListStore } from "../stores/documentList";

export interface Context {
    appState: AppState;
    documentStore: DocumentStore;
    documentListStore: DocumentListStore;
}
