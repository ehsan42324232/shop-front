export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000',
  platformDomain: 'localhost:4200',
  supportedLanguages: ['fa', 'en'],
  defaultLanguage: 'fa',
  storeDomains: {
    // Example store domains for local development
    'shop1.localhost:4200': 'shop1',
    'shop2.localhost:4200': 'shop2',
    'test.localhost:4200': 'test'
  },
  features: {
    enableAnalytics: false,
    enablePWA: false,
    enableOffline: false
  }
};
