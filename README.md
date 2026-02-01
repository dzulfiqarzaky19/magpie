# Magpie

A fullstack e-commerce dashboard test project.

## 💡 Assignment Highlights

### The "Custom Insight"
Per the requirement to "find a business insight," I chose **Revenue Trends & Order Volume**.
-   **Why**: While **Product Ratings** are important for long-term health, the most critical daily question for a store owner is *"How much representable revenue did we generate this hour?"*. I prioritized **Sales Velocity** to provide this immediate feedback loop.
-   **Implementation**: I built a custom **Sales History Chart** (hourly/daily/monthly) in `src/services/insights.ts`.

### Synthetic Data Generation
The prompt noted that the mock API returns **static data** without timestamps.
-   **Challenge**: A static dashboard is boring and doesn't demonstrate "real-time" capabilities.
-   **Solution**: I implemented a pragmatic utility (`dummyGenerator`) in the trigger job. It adds a "small random variation" (as suggested) to generate synthetic orders and reviews on every sync. This ensures the **Revenue Trends** chart actually shows movement over time.

## 🛠 Tech Stack

### Strict Stack
- **Frontend/Backend**: Next.js (App Router)
- **Job Orchestration**: Trigger.dev
- **Database & ORM**: PostgreSQL with Prisma
- **Language**: TypeScript

### Additional Libraries
- **[date-fns](https://date-fns.org/)**:
  - **Why**: Provides a comprehensive, immutable toolset for date manipulation without the bloat of legacy libraries.
  - **Usage**: Handles complex date logic (e.g., `subYears`, `format`, `startOfHour`) for analytics and charting.
- **[shadcn/ui](https://ui.shadcn.com/)**:
  - **Why**: Accessible, unstyled components that we own and customize directly in code.
  - **Usage**: Powers the design system (`Card`, `Badge`, `Chart`) combined with Tailwind CSS.
- **[tsx](https://github.com/privatenumber/tsx)**:
  - **Why**: Zero-config TypeScript execution environment.
  - **Usage**: Runs Prisma seed scripts instantly without compilation steps. [Recommended by Prisma](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding#integrated-seeding-with-prisma-migrate).

---

## 🏗 Technical Decisions & Architecture

We adopted a **Service-Repository Pattern** adapted for Next.js to ensure long-term maintainability.

### 1. Service Layer Splitting
We split the business logic into 4 distinct domains (`src/services/`):
- **`product.ts`**: Manages inventory, pricing, and category logic.
- **`order.ts`**: Handles transaction lifecycles and status updates.
- **`metrics.ts`**: Aggregates high-level KPIs (Revenue, AOV) for the dashboard.
- **`insights.ts`**: Handles complex time-series data for visualization.

**Why?**
- **Mental Model**: Developers can locate logic instantly based on domain (e.g., "Where is revenue calculated?" -> `metrics.ts`).
- **Scalability**: As the app grows, a single `service.ts` would become unmaintainable. Splitting early prevents "God Objects".
- **Separation of Concerns**: Dashboard metrics change frequency differs from core order processing logic.

### 2. Database Schema Design (PostgreSQL + Prisma)

The assignment required: *"Orders contain product_ids in their items array - design your schema to properly relate orders to products."*

We strictly avoided storing JSON arrays for order items. Instead, we implemented a **3NF (Third Normal Form)** schema:
-   **`Order`**: Stores the transaction header (status, total).
-   **`Product`**: Stores catalog details (price, stock).
-   **`OrderItem`**: Pivot table linking `Order` -> `Product`.
-   **`Review`**: Links `Product` to `User`.
    -   *Rationale*: While not strictly required for a static snapshot, we introduced this to enable **Time-Series Analysis** for the "Average Product Rating" trend (e.g., +2% vs last month), which is impossible with a static `rating` field.

**Why?**
-   **Referential Integrity**: Creates a hard foreign key constraint. You cannot have an order item for a non-existent product.
-   **Analytics**: Allows SQL-level aggregation (e.g., "How many units of Product X were sold across all orders?") without parsing JSON.

### 3. Utilities & "Anti-Patterns"
You might notice `src/lib/utils/dummyGenerator.ts` calls `prisma` directly.

**Is this an Anti-Pattern?**
- **Strictly speaking, yes.** In a pure architecture, it should call `OrderService`.
- **Pragmatically, no.** This utility is a **seed/simulation script**, not core business logic.
- **Why we did it**:
  - **Performance**: Seeding thousands of records often requires batching or bypassing validation layers for speed.
  - **Decoupling**: It prevents circular dependencies where the Service might rely on utilities that rely back on the Service.
  - **Scope**: It is only used by the external Trigger.dev job, never by the user-facing UI.

### 3. Data Processing (`processSalesHistory`)
We moved data transformation logic out of the Service and into `src/lib/utils/processSalesHistory.ts`.
- **Pattern**: **Functional Transformation**.
- **Role**: It takes "Raw Database Rows" and returns "Chart-Ready JSON".
- **Benefit**: The Service purely *fetches* data, and the Utility purely *formats* it. This makes the formatting logic unit-testable without mocking a database.

### 4. Prisma Folder Structure
You will notice two Prisma-related folders. This is intentional:

1.  **`prisma/` (Root)**:
    - Contains `schema.prisma`.
    - **Why**: This is the standard convention for the Prisma CLI to automatically detect the schema for migrations and generation.

2.  **`src/lib/prisma/` (Source)**:
    - Contains `index.ts` (Client Instance) and `seed.ts`.
    - **Why**:
        - **Singleton Pattern**: `index.ts` ensures we don't exhaust database connections during Next.js hot-reloading.
        - **Seeding context**: We place `seed.ts` inside `src/` so it can import **typed constants** (e.g., `src/const/product.ts`) using the same `@/` path aliases as the main app. If it were outside `src/`, configuring TypeScript to resolve these aliases would be painful and error-prone.

### 5. Project Structure
```
src/
├── app/              # Next.js App Router (Pages & Layouts)
├── components/       # Feature-specific & UI components
├── lib/              # Core utilities & Prisma client
├── services/         # Business Logic Layer
└── trigger/          # Background job definitions
```

### 6. Engineering Highlights

-   **Performance (Server Components)**: In `src/app/page.tsx`, we use `Promise.all()` to fetch all dashboard metrics in parallel. This prevents "request waterfalls" (where one request waits for the previous one to finish), significantly reducing the Time To First Byte (TTFB).
-   **Type Safety**: We share strict TypeScript definitions (`src/lib/types.ts`) between our Prisma seed scripts, frontend components, and business logic services. This ensures that if the database schema changes, the entire app (including seed data) catches type errors at compile time.
-   **Client/Server Boundary**: The dashboard needs to refresh every hour, but `page.tsx` is a Server Component. We solved this by creating a lightweight Client Component (`AutoRefresh.tsx`) that triggers `router.refresh()`, keeping the heavy page logic on the server while enabling client-side interactivity.

---

## 🔄 Job Orchestration Integration

The background integration is handled in `src/trigger/ecommerceSync.ts`.

- **Schedule**: This job runs **hourly** (`0 * * * *`).
- **Workflow**:
  1. **Fetch**: Pulls product/order snapshots from a mock API (`fake-store-api`).
  2. **Sync**: Upserts data into PostgreSQL using Prisma.
  3. **Simulate**: Generates **synthetic orders and reviews** to simulate ongoing store activity so the dashboard always has fresh data.

---

## 📸 Demo Walkthrough

Experience the full application lifecycle:

1. **Start the Engine**:
   - Terminal 1: `npm run dev` (Web App)
   - Terminal 2: `npm run trigger` (Background Agent)
2. **View the Dashboard**: Open [http://localhost:3000](http://localhost:3000). You'll see KPIs, Sales Charts, and Recent Orders.
3. **Trigger a Sync**:
   - In the Trigger.dev CLI terminal, press `t` (or use the provided dashboard URL) to manually test the `ecommerce-sync` task.
4. **Observe Updates**:
   - Refresh the dashboard. You will see recent "Last Synced" times and potentially new synthetic orders in the "Recent Orders" table.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)

### Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file with your database connection:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/magpie?schema=public"
   ```

3. **Database Setup & Seeding**
   ```bash
   npx prisma generate
   npx prisma db push
   npx tsx src/lib/prisma/seed.ts
   ```

4. **Run Application**
   ```bash
   npm run dev
   # In a separate terminal:
   npm run trigger
   ```

---

## 🤖 AI Disclosure

This project was built with the assistance of **Google's Gemini 3.0 Flash** model.

**How it was used:**
- **Boilerplate & Scaffolding**: Rapidly generating Prisma schemas and initial UI components.
- **Logic Optimization**: Assisting in the refactoring of time-series data aggregation (`timeMaps.ts`).
- **Documentation**: Drafting and refining this README to ensure clarity and structure.
- **Scripts**: Generating scripts forcing wsl2 to use ip-4 so trigger.dev can access the ecommerceSync job.
