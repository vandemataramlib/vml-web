import React, { Component, PropTypes } from 'react';
import PaperCustom from '../shared/PaperCustom';

export default class About extends Component {
    render() {

        return (
            <div className="row">
                <div className="col-xs-offset-2 col-xs-8">
                    <PaperCustom>
                        <div className="row">
                            <div className="col-xs-12">
                                <h1>About</h1>
                            </div>
                        </div>
                    </PaperCustom>
                </div>
            </div>
        );
    }
}
