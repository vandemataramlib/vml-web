import { observable, computed, action, transaction } from "mobx";
import * as ExecutionEnvironment from "fbjs/lib/ExecutionEnvironment";

export enum Encoding {
    devanagari,
    iast
}

enum Environment {
    server,
    client
}

export class AppState {
    @observable currentUrl: string;
    @observable encoding: Encoding;
    @observable env: Environment;
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
        transaction(() => {
            this.currentUrl = initialState ? initialState.currentUrl : "/";
            this.env = ExecutionEnvironment.canUseDOM ? Environment.client : Environment.server;
            if (this.isClientEnv && localStorage.getItem("encoding")) {
                this.encoding = parseInt(localStorage.getItem("encoding"));
            } else {
                this.encoding = Encoding.devanagari;
            }
        });
    }

    @computed
    get isClientEnv() {

        return this.env === Environment.client;
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
