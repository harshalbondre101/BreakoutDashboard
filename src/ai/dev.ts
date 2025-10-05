
import { genkit, googleAI } from 'genkit';
import { configureGenkit } from 'genkit';

// Import flows so that they are registered with Genkit.
import './flows/generate-business-insights';

configureGenkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
