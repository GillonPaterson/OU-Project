# Custom Type Migrator

## How It Works

1. Pulls all custom type schemas from Prismic using Prismic API
2. Passes Json of page components to `splitPrismicComponents` to separate into an array of elements
3. The Array of Pages is then looped through passing each component into `mapPrismicToKontentElement` where the prismic component type is matched to a KontentAi type and calls the relevenet function to map the json component to prismic
4. Once the Pages Components have been converted to KontentAI objects the Page is sent to the `kontentPageBuilder` where the components are looped through and the config for each component is passed into the relevant component builder function and returned to be sent as a API request and made in KontentAI

## Logging

**Prismic**

The Json Page Schemas from the Prismic API are are logged to `Logs/PrismicJsons` each page will have its own file.

**KontentAI**

The Array of components that will be used to create the page in KontentAI is logged to `Logs/KontentAIJsons` similarly to Prismic each page will have its own file.

## Run Instructions

To Run: `npm run dev`

