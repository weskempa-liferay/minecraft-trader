import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

class MinecraftTraderApp extends HTMLElement {
  connectedCallback() {
    ReactDOM.createRoot(this).render(<App />);
  }
}

const ELEMENT_ID = 'minecraft-trader';

if (!customElements.get(ELEMENT_ID)) {
  customElements.define(ELEMENT_ID, MinecraftTraderApp);
}