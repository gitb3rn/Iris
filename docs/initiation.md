### **Project Brief: "Iris" - URL Classification Microservice**

#### **1. Executive Summary**

"Iris" is a high-performance, serverless microservice that acts as an intelligent URL classifier. Its primary function is to accept a URL and, based on a predefined set of rules, determine the most efficient method for fetching data from that URL. It will either identify a corresponding internal API endpoint or instruct the calling service to scrape the webpage directly.

This service is the critical first step in a content ingestion pipeline, ensuring that data is sourced programmatically when possible, which is faster, more reliable, and less resource-intensive than web scraping. The service will be built with Hono on the Cloudflare Workers platform to guarantee minimal latency and infinite scalability.

#### **2. Core Functionality & API Contract**

The service exposes a single, stateless HTTP endpoint.

*   **Endpoint:** `POST /classify`
*   **Request Body (JSON):**
    ```json
    {
      "url": "https://www.your-website.com/projects/downtown-revitalization-phase-2"
    }
    ```*   **Success Response (JSON, Status `200 OK`):**
    The service will return a structured `Action` object.

    *   If a mapping is found:
        ```json
        {
          "method": "API",
          "endpoint": "https://api.your-website.com/v1/projects/downtown-revitalization-phase-2"
        }
        ```
    *   If no mapping is found:
        ```json
        {
          "method": "SCRAPE",
          "reason": "No dedicated API endpoint found for this URL pattern."
        }
        ```
*   **Error Response (JSON, Status `400 Bad Request`):**
    ```json
    {
      "error": "URL is required and must be a valid string."
    }
    ```

#### **3. Technology Stack**

*   **Runtime:** Cloudflare Workers
*   **Framework:** Hono
*   **Language:** TypeScript
*   **Testing:** Vitest (for unit and integration testing)
*   **Deployment:** Cloudflare Wrangler CLI
*   **Version Control:** Git / GitHub
*   **CI/CD:** GitHub Actions

---

### **4. Actionable Development Plan (Step-by-Step)**

#### **Phase 1: Local Environment Setup**

1.  **Install Core Dependencies:**
    *   Install Node.js (latest LTS version) from the official website. This includes `npm`.
    *   Install Git for Windows.
2.  **Configure VS Code:**
    *   Install the `ESLint` and `Prettier` extensions for code quality.
    *   Install the official `Cloudflare Workers` extension for better integration.
3.  **Set up Cloudflare CLI:**
    *   Open your terminal (PowerShell or Git Bash) and run: `npm install -g wrangler`
    *   Authenticate with your Cloudflare account: `wrangler login`

#### **Phase 2: Project Scaffolding**

1.  **Create the Worker Project:**
    *   In your terminal, navigate to your development directory.
    *   Run `wrangler init iris-classifier` (where "iris-classifier" is your project name).
    *   Choose the "Hello World" script template.
    *   Select "yes" to using TypeScript.
    *   Select "yes" to creating a `package.json`.
2.  **Initialize Git:**
    *   `cd iris-classifier`
    *   `git init`
    *   Create a `.gitignore` file and add `node_modules`, `.wrangler`, and `dist`.
    *   Create a new repository on GitHub and push the initial project.

#### **Phase 3: Core Logic Implementation**

1.  **Install Hono:**
    *   In the project directory, run: `npm install hono`
2.  **Define Data Structures (Types):**
    *   Create a file `src/types.ts`.
    *   Define the `Action` object and any other shared types to ensure type safety across the application.
3.  **Create the Mapping Configuration:**
    *   Create a file `src/mappings.ts`.
    *   In this file, define and export an array of `UrlMapping` objects. Each object should contain a regex `pattern` and a `getEndpoint` function that constructs the API URL from the regex match.
4.  **Implement the Hono Server:**
    *   Replace the contents of `src/index.ts`.
    *   Import `Hono`, your types, and the `urlMappings` array.
    *   Create a new Hono app instance.
    *   Define the `POST /classify` route.
    *   Inside the route handler:
        *   Validate the incoming request body to ensure it contains a URL.
        *   Iterate through the `urlMappings` array.
        *   For each mapping, attempt to match its `pattern` against the provided URL.
        *   If a match is found, use the `getEndpoint` function to build the final API endpoint, construct the `Action` object, and return it as a JSON response.
        *   If the loop finishes with no matches, return the fallback "SCRAPE" `Action` object.

#### **Phase 4: Local Development & Deployment**

1.  **Run Locally:**
    *   Start the local development server: `wrangler dev`
    *   Use a tool like the VS Code REST Client, Postman, or `curl` to send `POST` requests to `http://localhost:8787/classify` and verify the logic works.
2.  **First Deployment:**
    *   Configure your `wrangler.toml` file with your account ID and a name for the worker.
    *   Run `wrangler deploy` to deploy the worker to your Cloudflare account. Test the live URL.

---

### **5. Testing Strategy to Implement**

Create a `src/index.test.ts` file and use Vitest to write the following tests:

1.  **Unit Tests for Mappings:**
    *   Test the `getEndpoint` function for each mapping rule directly to ensure it correctly constructs the API URL from a sample regex match.
2.  **Integration Tests for the Hono Endpoint:**
    *   **Success Case (API):** Send a request with a URL that is known to match a specific rule. Assert that the response has a status of `200` and the correct `method: "API"` and `endpoint` value.
    *   **Success Case (SCRAPE):** Send a request with a URL that is known *not* to match any rules. Assert that the response has a status of `200` and the correct `method: "SCRAPE"` object.
    *   **Bad Request Case:** Send a request with a missing `url` field or malformed JSON. Assert that the response has a status of `400` and contains an `error` message.
    *   **Edge Case:** Send a request with an empty string for the `url`.

---

### **6. Key Considerations for Handover**

This project must be easily transferable to another team's ecosystem.

1.  **No Hardcoded Secrets or IDs:**
    *   The `wrangler.toml` file will contain your `account_id`. For CI/CD, this information **must not** be committed to Git.
    *   Use **Cloudflare Secrets** and **GitHub Actions Secrets** for any API keys or environment-specific variables. The `wrangler.toml` file should reference these secrets (e.g., `account_id = "${CF_ACCOUNT_ID}"`).
2.  **Comprehensive Documentation (in `README.md`):**
    *   **API Documentation:** Clearly document the `POST /classify` endpoint, including the request/response structures shown above. Consider generating a simple OpenAPI (Swagger) spec.
    *   **Configuration Guide:** Explain how the `src/mappings.ts` file works, with clear examples of how to add a new URL pattern.
    *   **Deployment Guide:** Provide step-by-step instructions on how the new team can deploy the worker to their own Cloudflare account using `wrangler`, including how to set up the necessary `CF_API_TOKEN` and `CF_ACCOUNT_ID` secrets in their GitHub repository.
3.  **CI/CD Pipeline:**
    *   Create a `.github/workflows/deploy.yml` file.
    *   This workflow should trigger on a push to the `main` branch.
    *   It should install dependencies (`npm ci`), run the tests (`npm test`), and if the tests pass, run `wrangler deploy` to automatically deploy the worker. This ensures that only tested, working code reaches production.
