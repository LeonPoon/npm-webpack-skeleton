
import './vendors.js';

import './app.css';

import $ from "jquery";
import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './components/app.jsx'


$(document).ready(function() {
    const div = document.createElement('div');
    document.body.append(div);
    ReactDOM.render(React.createElement(App), div);
});

