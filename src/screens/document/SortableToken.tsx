import * as React from "react";
import { sortable } from "react-anything-sortable";

@sortable
export default class SortableToken extends React.Component<any, any> {
    render() {
        return (
            <div {...this.props }>
                { this.props.children }
            </div>
        );
    }
}
