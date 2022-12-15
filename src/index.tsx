import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './Style/media-770.css';
import './Style/media-1200.css';
import {App} from './App';
import {Provider} from "react-redux";
import store from "./Redux/redux-store";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>
);
