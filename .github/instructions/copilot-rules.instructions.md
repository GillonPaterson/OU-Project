---
applyTo: '**'
---

Copilot should generate new files in the correct directory based on their purpose.

---

## Guidelines

### Language and Tools
- Use **TypeScript** with **strict type checking**.
- Use **Axios** for HTTP communication.
- Prefer `async/await` over promise chains.
- Use **named exports** for clarity and reusability.

### Type Safety
- Define all data structures in `src/types/`.
- Create interfaces for:
  - Prismic API responses
  - KontentAI payloads
  - Migration entities (e.g. `ContentType`, `Field`, `Mapping`)
- Never use `any`; use explicit or generic types.
- Add type guards when parsing unknown data.

### Structure and Readability
- Keep functions small and purposeful.
- Use descriptive names (`fetchPrismicTypes`, `transformToKontentSchema`, `createKontentTypes`).
- Include concise comments for complex logic.
- Maintain consistent formatting (Prettier or ESLint).
- Keep a clear separation between **data retrieval**, **transformation**, and **creation**.

---

## Logging
- All JSON responses from APIs should be written to `src/Logs/` for debugging.
- Use utility functions from `src/Utils/` for consistent logging.
- Each log should include:
  - Timestamp
  - Operation context (e.g., “Fetched content type definitions from Prismic”)
  - Summary of data (count, IDs, or names)
- Logs should be JSON-formatted and human-readable.

---

## Error Handling
- Use `try/catch` for all API operations.
- Throw meaningful errors that include the relevant content type or operation.
- Never silently swallow errors.
- Always log errors via utilities in `src/Utils/`.

---

## Testing
- Store test files under `src/tests/`.
- Unit tests for Prismic API functions go in `src/tests/Prismic/`.
- Use `src/tests/testHelpers/` for reusable data factories and mocks.
- Focus tests on:
  - Data transformation accuracy
  - API interaction correctness
  - Logging behavior

---

## Performance and Safety
- Handle pagination and rate limits properly.
- Support **dry-run mode** to test migration safely.
- Never modify or delete production data unless explicitly configured.
- Use environment variables for all credentials and endpoints.

---

## Prohibited
- Do **not** hardcode credentials or tokens.
- Do **not** commit API responses that include sensitive data.
- Do **not** use `any` or disable type checks.
- Do **not** mix Prismic and KontentAI logic in the same module.

---

## Code Style
- Follow **TypeScript ESLint recommended rules**.
- Use **camelCase** for variables and functions, **PascalCase** for types/interfaces.
- Prefer clarity and explicitness over brevity.
- Maintain consistent import order: built-ins → external → internal.

---

## Project Structure

### Project Structure

```bash
Logs/
    ├─ KontentAIJsons
    ├─ PrismicJsons
src/
  ├─ KontentAI/
  │   ├─ kontentAIPageBuilder.ts
  │   ├─ KontentElementBuilders.ts
  ├─ Prismic/
  │   ├─ prismicParser.ts
  ├─ Utils/
  │   ├─ logging.ts
  ├─ types/
  │   ├─ prismic.ts
  │   ├─ kontent.ts
  ├─ migrateCustomTypes.ts
tests/
  ├─ Prismic/
  ├─ testHelpers/
```
### Directory Descriptions

| Directory | Responsibility |
|------------|----------------|
| **Logs** | JSON logs of API responses and migration status. |
| **KontentAI** | API clients, content creation, and schema definition functions. |
| **Prismic** | API clients and content fetching logic. |
| **Utils** | Logging, error handling, environment helpers, and reusable utilities. |
| **types** | Shared TypeScript types and interfaces for all modules. |
| **tests/Prismic** | Unit tests for Prismic API and data-fetching functions. |
| **tests/testHelpers** | Mock data and reusable testing utilities. |

---

*These rules ensure Copilot generates organized, type-safe, and maintainable migration code that follows your established project structure.*



