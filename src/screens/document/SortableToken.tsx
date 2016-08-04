import * as React from "react";
const sortable = require("react-anything-sortable").sortable;
import { observer } from "mobx-react";

@sortable
@observer
export class SortableToken extends React.Component<any, any> {
    render() {
        return (
            <div
                className={ this.props.className }
                style={this.props.style}
                onMouseDown={this.props.onMouseDown}
                onTouchStart={this.props.onTouchStart}
                >
                { this.props.children }
            </div>
        );
    }
}
