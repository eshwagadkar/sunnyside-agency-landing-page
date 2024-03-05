import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './scripts/App';

import './styles/main.scss';

if( process.env.NODE_ENV === 'production' ) {
   console.log('Production Mode');
} else if ( process.env.NODE_ENV === 'development' ) {
   console.log('Development Mode');
}

const domNode = document.querySelector("#root")
const root = createRoot(domNode)
root.render(
   <React.StrictMode>
     <App />
   </React.StrictMode>
 );


// if(module.hot) { module.hot.accept() }