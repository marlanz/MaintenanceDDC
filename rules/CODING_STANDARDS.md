# CODING_STANDARDS.md

# MAINTENANCE-DDC WEB

Version: 1.0

---

# Purpose

This document defines the coding standards for the project.

Every contributor (human or AI) MUST follow these standards.

When conflicts exist, this document has higher priority than personal coding preferences.

---

# General Principles

- Write readable code before clever code.
- Keep functions small and focused.
- Avoid unnecessary abstractions.
- Prefer composition over inheritance.
- Follow SOLID principles whenever appropriate.
- Follow DRY but avoid premature abstraction.
- Optimize for maintainability instead of short code.

---

# Tech Stack

Framework

- Next.js 15
- React 19
- App Router
- TypeScript

UI

- TailwindCSS
- shadcn/ui
- Lucide React

Authentication

- Better Auth

Database

- MongoDB
- Mongoose

State Management

- TanStack Query

Forms

- React Hook Form
- Zod

---

# TypeScript

TypeScript Strict Mode is required.

Never use

```ts
any
```

Avoid

```ts
as unknown as
```

Prefer

```ts
interface
```

for object contracts.

Use

```ts
type
```

for unions and utility types.

Always define return types for exported functions.

---

# Naming Convention

## Components

PascalCase

```
MachineCard
TicketTable
MaintenanceCalendar
```

---

## Hooks

```
useCurrentUser

useMachine

useTicketList
```

---

## Server Actions

```
createTicketAction

updateMachineAction

assignTechnicianAction
```

---

## Services

```
ticket.service.ts

machine.service.ts
```

---

## Repository

```
ticket.repository.ts

machine.repository.ts
```

---

## Constants

```
ticket-status.ts

roles.ts

routes.ts
```

---

## Types

```
ticket.types.ts

user.types.ts
```

---

# Folder Structure

```
src/

app/

actions/

components/

features/

hooks/

lib/

models/

repositories/

schemas/

services/

types/

utils/

constants/
```

Feature modules should encapsulate their own components whenever possible.

---

# Component Rules

Prefer Server Components.

Only use Client Components when necessary.

Examples:

- Forms
- Dialogs
- Drag & Drop
- React Query
- Browser APIs

Every Client Component must begin with

```tsx
"use client";
```

---

# UI Rules

Always use shadcn/ui components.

Never recreate existing shadcn components.

Examples

✅

Button

Dialog

Sheet

DropdownMenu

Popover

Table

Badge

Card

Skeleton

AlertDialog

Tabs

Accordion

❌

Custom Button

Custom Modal

Custom Sidebar

Custom Select

---

# Styling

Use TailwindCSS only.

Never write inline styles unless absolutely necessary.

Bad

```tsx
style={{ marginTop: 12 }}
```

Good

```tsx
mt-3
```

---

# Responsive Design

Mobile First.

Default

Mobile

Then

md

lg

xl

Never use JavaScript for responsive layouts unless absolutely necessary.

Prefer

```
hidden lg:block

lg:hidden

grid-cols-1 lg:grid-cols-3
```

---

# Icons

Only use

Lucide React

Never mix icon libraries.

---

# Forms

Use

React Hook Form

+

Zod

Every form must validate both:

Client

Server

Never trust client validation.

---

# Data Fetching

Prefer

Server Components

↓

Server Actions

↓

Repository

↓

MongoDB

Avoid unnecessary REST APIs.

---

# Server Actions

Server Actions are preferred over API Routes.

Only use API Routes when:

- Webhooks
- Third-party integrations
- Mobile Apps
- External clients

---

# Authentication

Authentication is handled exclusively by Better Auth.

Never implement custom authentication.

Never store passwords manually.

Always validate session server-side.

---

# Authorization

Never trust client-side role checks.

Every protected action must verify

- Authentication
- Role
- Resource ownership
- Workshop scope
- Team scope

Follow RBAC_MATRIX.md.

---

# Database

Use Mongoose.

Never use raw MongoDB queries unless necessary.

Always use ObjectId references.

Prefer normalized schemas.

Avoid deep nesting.

Always use timestamps.

Create indexes for

- employeeCode
- machineCode
- email
- workshopId
- teamId
- status

---

# Business Logic

Business logic belongs in Services.

Repositories only access the database.

Server Actions orchestrate the request.

Example

```
Server Action

↓

Service

↓

Repository

↓

Database
```

Never place business logic inside React components.

---

# Error Handling

Never swallow errors.

Always return meaningful errors.

Use typed errors whenever possible.

---

# Logging

Use

console.error()

only during development.

Production logging should be centralized.

---

# Constants

Never hardcode

Roles

Statuses

Routes

Colors

Magic Numbers

Use shared constants.

---

# Enums

Store enums in constants.

Example

```
roles.ts

ticket-status.ts

priority.ts
```

---

# Images

Store images in Cloudinary.

Never store binary images inside MongoDB.

Database stores URLs only.

---

# File Upload

Maximum

2 images

Accepted formats

- png
- jpeg
- jpg

Validation required.

---

# React Query

React Query is only for Client Components.

Server Components should fetch directly.

Avoid duplicate fetching.

---

# Loading

Every async page must have

loading.tsx

Use Skeleton components.

---

# Empty States

Every table/list requires

Empty State

instead of blank pages.

---

# Accessibility

Every interactive element must have

- aria-label
- keyboard support
- visible focus

---

# Performance

Prefer Server Components.

Lazy load large components.

Avoid unnecessary re-renders.

Memoize expensive computations only when profiling indicates a benefit.

---

# Imports

Order

1.

React

2.

Next.js

3.

Third-party

4.

Internal modules

5.

Relative imports

---

# Comments

Explain WHY.

Do not explain WHAT.

Bad

```ts
// increment counter
counter++
```

Good

```ts
// Required because ticket numbers must remain sequential
```

---

# Testing

Every Service should be testable.

Avoid tightly coupling business logic with UI.

---

# Git

Commit messages

feat:

fix:

refactor:

docs:

style:

test:

chore:

Examples

```
feat(ticket): implement technician assignment

fix(auth): validate organization login

refactor(machine): simplify repository queries
```

---

# AI Coding Rules

AI must never:

- invent requirements
- invent database fields
- invent business rules
- ignore project documents

Before implementing any feature, AI must read:

- README.md
- SYSTEM_DESIGN.md
- UI_DESIGN.md
- BUSINESS_RULES.md
- RBAC_MATRIX.md
- CODING_STANDARDS.md

If requirements are ambiguous,

STOP

and explain the ambiguity instead of making assumptions.

---

# Definition of Done

A feature is complete only if:

- Business rules are satisfied
- Responsive on mobile and desktop
- Uses shadcn/ui
- Type-safe
- Validated with Zod
- Server-side authorization implemented
- No TypeScript errors
- No ESLint errors
- Follows project architecture
- Reusable and maintainable