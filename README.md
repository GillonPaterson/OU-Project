# Custom Type Migrator

## How It Works

1. Pulls all custom type schemas from Prismic using Prismic API
2. Passes `PrismicResponse` which is an array of all the pages to `splitPrismicComponents` to separate each tabs elements into an array of elements from an object.
3. The Array of PrismicPages is passed to `mapPrismicPageToKontentPage` where each prismic element is passed to the relevant function to return a KontentElement returning multiple KontentPages
4. The multiple Kontent Pages are then looped through to passed each one into the `KontentAIPageBuilder` to construct the request and build the page in KontentAI.

## Logging

**Prismic**

The Json Page Schemas from the Prismic API are are logged to `Logs/PrismicJsons` each page will have its own file.

**KontentAI**

The Array of components that will be used to create the page in KontentAI is logged to `Logs/KontentAIJsons` similarly to Prismic each page will have its own file.

## Run Instructions

To Run: `npm run dev`

