import { observable, computed, action, ObservableMap, map } from "mobx";
import * as ExecutionEnvironment from "fbjs/lib/ExecutionEnvironment";

export enum Encoding {
    devanagari,
    iast,
    itrans
}

enum Environment {
    Server,
    Client
}

export enum FetchLevel {
    Local,
    App
}

let instance: AppState = null;

export class AppState {
    @observable currentUrl: string;
    @observable encoding: Encoding;
    defaultEncoding: Encoding = Encoding.itrans;
    @observable env: Environment;
    @observable dataFetchStore: ObservableMap<FetchLevel>;

    encodingSchemes = [
        {
            label: "देवनागरी",
            value: Encoding.devanagari
        },
        {
            label: "Roman",
            value: Encoding.iast
        }
    ];

    constructor(initialState?: AppState) {

        if (!instance) {
            instance = this;
        }

        this.currentUrl = initialState ? initialState.currentUrl : "/";
        this.env = ExecutionEnvironment.canUseDOM ? Environment.Client : Environment.Server;
        if (this.isClientEnv && localStorage.getItem("encoding")) {
            this.encoding = parseInt(localStorage.getItem("encoding"));
            this.dataFetchStore = map({});
        } else {
            this.encoding = Encoding.devanagari;
        }

        return instance;
    }

    @action
    addFetch = (url: string, level: FetchLevel) => {

        this.dataFetchStore.set(url, level);
    }

    @action
    deleteFetch = (url: string) => {

        this.dataFetchStore.delete(url);
    }

    @computed
    get pendingAppFetches() {

        return this.dataFetchStore.values().filter(url => url === FetchLevel.App);
    }

    @computed
    get isClientEnv() {

        return this.env === Environment.Client;
    }

    @computed
    get encodingScheme() {

        return this.encodingSchemes.filter(scheme => scheme.value === this.encoding)[0];
    }

    @action
    setCurrentUrl(url) {

        this.currentUrl = url;
    }

    @action
    changeEncoding(encoding: Encoding) {

        this.encoding = encoding;
        if (ExecutionEnvironment.canUseDOM) {
            localStorage.setItem("encoding", encoding.toString());
        }
    }
}
