import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {  HelmetProvider } from 'react-helmet-async';
import 'bootstrap/dist/css/bootstrap.min.css';


const helmetContext = {};

const root = ReactDOMClient.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider context={helmetContext}>
    <App />
  </HelmetProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
