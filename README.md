# Custom Type Migrator

## How to Run:

-   To run the script use `npm run dev` **THIS WILL READ AND WRITE THINGS FROM PRISMIC TO KONTENTAI**
-   To execute a mock run of the script run `npm run mock` This will just produce json files of what the objects from prismic look like and how they are transformed
-   To run tests run `npm run test`

## How It Works

1. Pulls all custom type schemas from Prismic using Prismic API
2. Passes `PrismicPage` which is json of all the components from Prismic to `ConvertPrismicPageToKontentPage` this parses the Prismic Object converting it to a returns a `KontentPage`.
3. The Array of KontentPages is looped through and passed to `checkIfSnippetsExists` where each page is checked for the element type Snippet. If a snippet exists a call is made to KontentAI to seach for the snippet by codename, If it exists the `snippetID` is added to the snippet object. Else, the snippet is created and the ID is added the page is then returned.
4. The array of content pages is looped through passing each page to the `kontentPageBuilder` that builds it in kontentAi using the management SDK.

## Logging

All logging takes place in the `src/utils/Logging.ts` file

**Prismic**

The Json Page Schemas from the Prismic API are are logged to `Logs/PrismicJsons` each page will have its own file.

**KontentAI**

The Array of components that will be used to create the page in KontentAI is logged to `Logs/KontentAIJsons` similarly to Prismic each page will have its own file.

## What Still Needs done for this to be Operational:

-   Links are not handled From research a 3 step process for migrating links will be needed:
    1. **Web Links:** Can be created with the page content type as they are not dependant on other content types
    2. **Document Links & content relationship links:** Need to be upserted into the content type after the page has been created as they are dependant on another content type
    3. **Media Link:** Need to be inserted after the data migration because they are dependant on data being in Kontent such as a PDF or Image.
-   Some more robust error handling for Kontent Management SDK at the moment it just errors into the terminal.
-   Add a check to see if the Page already exists in Kontent (See `checkIfSnippetsExists` for referance) the axios instance was used because if you use the SDK to search for a snippet and it doesnt exist it errors and I can't see a way to handle that gracefully so I suspect the same approach will be needed for pages.
-   Some kind of output to compare "What was saved to Kontent" vs "What came from Prismic"
