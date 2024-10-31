import { render } from 'solid-js/web';
import App from './App';
import './index.css';

// Sentry error logging
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: import.meta.env.VITE_PUBLIC_SENTRY_DSN,
  environment: import.meta.env.VITE_PUBLIC_APP_ENV,
  integrations: [Sentry.browserTracingIntegration()],
  initialScope: {
    tags: {
      type: 'frontend',
      projectId: import.meta.env.VITE_PUBLIC_APP_ID
    }
  }
});

// Add PWA support to the app
window.progressierAppRuntimeSettings = {
  uid: import.meta.env.VITE_PUBLIC_APP_ID,
  icon512: "https://example.com/path-to-your-icon.png",
  name: "تطبيق الراديو العالمي للمكفوفين",
  shortName: "راديو المكفوفين"
};

let script = document.createElement('script');
script.setAttribute('src', 'https://progressier.app/z8yY3IKmfpDIw3mSncPh/script.js');
script.setAttribute('defer', 'true');
document.querySelector('head').appendChild(script);

render(() => <App />, document.getElementById('root'));