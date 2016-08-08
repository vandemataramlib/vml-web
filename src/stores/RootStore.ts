import { observable, action, computed } from "mobx";
import { Models } from "vml-common";
import { MenuItem } from "material-ui";
import * as React from "react";

import { fetchData, translit } from "../shared/utils";
import { RootsDataSource } from "../shared/interfaces";

export class RootStore {
    @observable roots: Models.Root[] = [];
    mappedRoots: RootsDataSource[];

    constructor(initialState?: any) {

        Object.assign(this, initialState);
    }

    @action
    setRoots = (roots: Models.Root[]) => {
        this.roots = roots;
    }

    findRoots = (startsWith: string) => {

        if (this.roots.length > 0) {
            return this.roots.filter(root => root.root.startsWith(startsWith));
        }

        this.fetchRoots();
        return [];
    }

    loadRoots = () => {

        if (this.roots.length > 0) {
            return;
        }

        return this.fetchRoots();
    }

    @computed
    get rootDataSource(): RootsDataSource[] {

        if (this.roots.length === 0) {
            this.fetchRoots();
            return [];
        }

        if (this.mappedRoots) {
            return this.mappedRoots;
        }

        this.mappedRoots = this.roots.map(root => {

            return {
                text: root.root,
                value: React.createElement(MenuItem, {
                    primaryText: translit(root.root),
                    secondaryText: root.senses.join(", ")
                })
            };
        });

        return this.mappedRoots;
    }

    private fetchRoots() {

        fetchData<Models.Root[]>(Models.Root.URL())
            .then(roots => this.setRoots(roots));
    }
}
