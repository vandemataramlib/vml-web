declare module "react-anything-sortable" {

    import * as React from "react";

    interface ReactAnythingSortableProps {
        onSort(sortedArray: Array<any>, currentDraggingSortData: any, currentDraggingIndex: number): void;
        containment?: boolean;
        dynamic?: boolean;
        sortHandle?: string;
        sortData?: any;
        direction?: string;
    }

    export class Sortable extends React.Component<ReactAnythingSortableProps, any> {}

    export default Sortable;

    export const sortable: any;
}
