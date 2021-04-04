import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import "./framework/setup_firebase.js";
import "./framework/i18n_setup.js";

import common from "stickfigurecommon";
common.Painter.init((imageSrc, callback) => {
  const image = new Image();
  image.onload = function () {
    callback(image);
  };
  image.src = imageSrc;
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
