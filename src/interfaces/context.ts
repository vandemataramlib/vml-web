import { AppState } from "../stores/appState";
import { DocumentStore } from "../stores/documents";

export interface Context {
    appState: AppState;
    documentStore: DocumentStore;
}
