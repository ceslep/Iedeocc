import './app.css'
import 'bootswatch/dist/vapor/bootstrap.min.css';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

export default app
