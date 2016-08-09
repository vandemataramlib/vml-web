import { observable, action, computed } from "mobx";
import { Models } from "vml-common";
import { MenuItem } from "material-ui";
import * as React from "react";

import { fetchData, translit } from "../shared/utils";
import { EtymologyDataSource } from "../shared/interfaces";

export class PrefixStore {
    @observable prefixes: Models.Prefix[];
    mappedPrefixes: EtymologyDataSource[];

    constructor(initialState?: any) {

        this.prefixes = initialState ? initialState.prefixes : [];
    }

    @action
    setPrefixes = (prefixes: Models.Prefix[]) => {

        this.prefixes = prefixes;
    }

    findPrefixes = (startsWith: string) => {

        if (this.prefixes.length > 0) {
            return this.prefixes.filter(prefix => prefix.prefix.startsWith(startsWith));
        }

        this.fetchPrefixes();
        return [];
    }

    @computed
    get prefixesDataSource(): EtymologyDataSource[] {

        if (this.prefixes.length === 0) {
            this.fetchPrefixes();
            return [];
        }

        if (this.mappedPrefixes) {
            return this.mappedPrefixes;
        }

        this.mappedPrefixes = this.prefixes.map(prefix => {

            return {
                text: prefix.prefix,
                value: React.createElement(MenuItem, {
                    primaryText: translit(prefix.prefix),
                    secondaryText: prefix.senses.join(", ")
                })
            };
        });

        return this.mappedPrefixes;
    }

    private fetchPrefixes() {

        fetchData<Models.Prefix[]>(Models.Prefix.URL())
            .then(prefixes => this.setPrefixes(prefixes));
    }
}
