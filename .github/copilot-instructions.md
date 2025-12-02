# Copilot Instructions for spareparts-webapp

## Project Overview
- This is a Next.js app using the `/app` directory structure, bootstrapped with `create-next-app`.
- Backend API routes are implemented in `app/api/`, following RESTful conventions for resources: `brands`, `items`, `models`, and `admin`.
- Prisma is used for database access, with schema and migrations in `/prisma` and generated client code in `lib/generated/prisma/`.
- UI components are modularized under `components/` and `components/ui/`.

## Key Architectural Patterns
- **App Routing:** Pages and layouts are organized by resource and role (e.g., `app/admin/`, `app/items/`, etc.).
- **API Layer:** Each resource has its own API route folder, with `[id]/route.ts` for item-specific operations.
- **Database:** Prisma ORM is configured via `prisma/schema.prisma` and accessed in `lib/prisma.ts`.
- **Modals & Forms:** Common modals (e.g., `brand-modal.tsx`, `item-modal.tsx`) and forms (e.g., `login-form.tsx`) are reused across pages.

## Developer Workflows
- **Start Dev Server:** `npm run dev` (or `yarn dev`, `pnpm dev`, `bun dev`).
- **Database Migrations:** Use Prisma CLI (`npx prisma migrate dev`) with schema in `/prisma/schema.prisma`.
- **Seeding:** Run `lib/seed-admin.ts` for initial admin data.
- **TypeScript:** All code is TypeScript; types are generated for Prisma models.
- **Linting:** Configured via `eslint.config.mjs`.

## Project-Specific Conventions
- **File Naming:** API routes use `route.ts`; page components use `page.tsx`; layouts use `layout.tsx`.
- **Component Structure:** UI primitives are in `components/ui/`; higher-level modals/forms in `components/`.
- **Resource Organization:** Each resource (brand, item, model) has parallel structure in both UI and API.
- **Admin Features:** Admin pages and APIs are under `app/admin/` and `app/api/admin/`.

## Integration Points
- **Prisma:** All DB access via `lib/prisma.ts` and generated client in `lib/generated/prisma/`.
- **Authentication:** Admin login handled via `app/api/admin/login/route.ts` and `components/login-form.tsx`.
- **Static Assets:** Served from `/public`.

## Examples
- To add a new resource, create both a UI page in `app/[resource]/` and an API route in `app/api/[resource]/`.
- To update DB schema, edit `prisma/schema.prisma` and run migrations.
- To add a new modal, place it in `components/` and import in relevant page/layout.

---

For questions or unclear conventions, review `README.md` or ask for clarification.
