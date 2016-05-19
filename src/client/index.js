import React from 'react';
import ReactTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { orange100, orange500, orange700 } from 'material-ui/styles/colors';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';

import routes from '../config/routes';
import { bootstrapData } from '../db/bootstrapData';

ReactTapEventPlugin();

const App = () => {

    const muiTheme = getMuiTheme({
        fontFamily: 'Helvetica',
        palette: {
            primary1Color: orange500,
            primary2Color: orange700,
            primary3Color: orange100
        }
    });

    if (!localStorage.getItem('documents')) {
        localStorage.setItem('documents', JSON.stringify(bootstrapData.data));
    }

    return (
        <MuiThemeProvider muiTheme={ muiTheme }>
            <Router routes={ routes } history={ browserHistory } />
        </MuiThemeProvider>
    );
};

render(
    <App />,
    document.getElementById('app')
);
