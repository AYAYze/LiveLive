/* Library */
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql
  } from "@apollo/client";
import { BrowserRouter } from 'react-router-dom';

/* Component */
import App from './App';

/* things */
import { URI } from "./constant";

const client = new ApolloClient({
    uri: URI,
    cache: new InMemoryCache()
})

function Root() {
    return (
        <BrowserRouter>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
        </BrowserRouter>
    )
}

export default Root;