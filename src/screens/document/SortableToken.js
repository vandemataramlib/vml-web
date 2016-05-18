import React from 'react';
import { sortable } from 'react-anything-sortable';

const SortableToken = (props) => {

    return (
        <div {...props }>
            { props.children }
        </div>
    );
};

export default sortable(SortableToken);
