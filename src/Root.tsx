/* Library */
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql
  } from "@apollo/client";
import { BrowserRouter } from 'react-router-dom';
import { createUploadLink } from 'apollo-upload-client';
/* Component */
import App from './App';
/* things */
import { URI } from "./constant";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    //@ts-ignore
    link: createUploadLink({
        uri: URI,
    }),
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