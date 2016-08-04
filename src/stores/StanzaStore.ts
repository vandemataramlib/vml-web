import { ObservableMap, observable, action, map, asMap } from "mobx";
import { Models } from "vml-common";

import { fetchData } from "../shared/utils";

export class StanzaStore {
    @observable private stanzas: ObservableMap<Models.Stanza>;
    private loadingStanzas: Set<string>;

    constructor(initialState?: any) {

        this.stanzas = initialState ? asMap(initialState.stanzas) : map({});
        this.loadingStanzas = new Set("");
    }

    @action
    private addStanzaToStore = (stanzaUrl: string, stanza: Models.Stanza) => {

        this.stanzas.set(stanzaUrl, stanza);
    }

    getStanza = (documentURL: string, runningStanzaId: string) => {

        const stanzaURL = Models.Stanza.URLFromDocURL(documentURL, runningStanzaId);

        return this.getStanzaFromURL(stanzaURL);
    }

    @action
    updateStanza = (documentURL: string, runningStanzaId: string, updatedStanza: Models.Stanza) => {

        const stanzaURL = Models.Stanza.URLFromDocURL(documentURL, runningStanzaId);

        this.stanzas.set(stanzaURL, updatedStanza);
    }

    getStanzaFromURL = (stanzaURL: string) => {

        if (this.stanzas.has(stanzaURL)) {
            return this.stanzas.get(stanzaURL);
        } else if (!this.loadingStanzas.has(stanzaURL)) {
            this.fetchStanza(stanzaURL);
            return null;
        }
    }

    private fetchStanza = (stanzaURL: string) => {

        this.loadingStanzas.add(stanzaURL);

        fetchData(stanzaURL)
            .then(stanza => this.addStanzaToStore(stanzaURL, stanza))
            .then(() => { this.loadingStanzas.delete(stanzaURL); });
    }
}
