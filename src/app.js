
import './vendors.js';

import './app.css';

import $ from "jquery";
import React from 'react';
import ReactDOM from 'react-dom';

import './app.ts';
import { App } from './components/app.jsx'


$(document).ready(function() {
    ReactDOM.render(React.createElement(App), document.getElementById('react'));
});

