import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import GridBackground from './components/ui/GridBackground.jsx'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const client = new ApolloClient({
  // TODO: update the uri on production
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(), // Enables Apollo client to cache the fetched queries
  credentials: "include", // Enables Apollo client to send cookies to server with every request 
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GridBackground>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </GridBackground>
    </BrowserRouter>
  </StrictMode>,
)
