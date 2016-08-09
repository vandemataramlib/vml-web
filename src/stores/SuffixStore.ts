import { observable, action, computed } from "mobx";
import { Models } from "vml-common";
import { MenuItem } from "material-ui";
import * as React from "react";

import { fetchData, translit } from "../shared/utils";
import { EtymologyDataSource } from "../shared/interfaces";

export class SuffixStore {
    @observable suffixes: Models.Suffix[];
    mappedSuffixes: EtymologyDataSource[];

    constructor(initialState?: any) {

        this.suffixes = initialState ? initialState.suffixes : [];
    }

    @action
    setSuffixes = (suffixes: Models.Suffix[]) => {

        this.suffixes = suffixes.map(suffix => {

            suffix._id = suffix["id"];
            delete suffix["id"];
            return suffix;
        });
    }

    findSuffixes = (startsWith: string) => {

        if (this.suffixes.length > 0) {
            return this.suffixes.filter(suffix => suffix.suffix.startsWith(startsWith));
        }

        this.fetchSuffixes();
        return [];
    }

    @computed
    get suffixesDataSource(): EtymologyDataSource[] {

        if (this.suffixes.length === 0) {
            this.fetchSuffixes();
            return [];
        }

        if (this.mappedSuffixes) {
            return this.mappedSuffixes;
        }

        this.mappedSuffixes = this.suffixes.map(suffix => {

            return {
                text: suffix.suffix,
                value: React.createElement(MenuItem, {
                    primaryText: translit(suffix.suffix),
                    secondaryText: suffix.senses.join(", ")
                })
            };
        });

        return this.mappedSuffixes;
    }

    private fetchSuffixes() {

        fetchData<Models.Suffix[]>(Models.Suffix.URL())
            .then(suffixes => this.setSuffixes(suffixes));
    }
}
