# UI & Responsive Design Rules

This project must follow a **mobile-first, responsive-first design philosophy** while providing an optimized experience for desktop users.

The majority of users are **Workers** and **Technicians**, but **Team Leaders**, **Maintenance Managers**, and **Administrators** will primarily use desktop devices.

The application must provide an excellent experience on both small and large screens.

---

# Component Library

## MUST

Use **shadcn/ui** components whenever possible.

Examples:

- Button
- Card
- Input
- Textarea
- Form
- Table
- Dialog
- Drawer
- Dropdown Menu
- Popover
- Calendar
- Select
- Sheet
- Alert Dialog
- Tabs
- Badge
- Tooltip
- Skeleton
- Toast

## MUST NOT

Do **not** rebuild existing shadcn/ui components from scratch.

If a required component already exists in shadcn/ui, always extend or compose it instead of creating a custom implementation.

Only create custom components when:

- No equivalent exists in shadcn/ui.
- Business requirements cannot be achieved through composition.

---

# Responsive Strategy

The application must be fully responsive.

Supported breakpoints:

- Mobile
- Tablet
- Desktop

Responsive behavior is not limited to resizing elements.

Entire layouts may change between mobile and desktop.

Example:

Desktop

- Data Table

Mobile

- Card List

Do not force desktop layouts onto mobile devices.

---

# Navigation

The application uses a **single navigation pattern** across all screen sizes.

Navigation is hidden by default.

Users open the navigation by clicking the **Hamburger Menu**.

The menu should slide in using the **Sheet** component from shadcn/ui.

```
┌─────────────────────────────┐
│ ☰   Page Title              │
├─────────────────────────────┤
│                             │
│        Page Content         │
│                             │
└─────────────────────────────┘
```

When the Hamburger Menu is clicked:

```
┌──────────────┬──────────────┐
│ Sidebar      │              │
│              │              │
│ Dashboard    │              │
│ Tickets      │   Content    │
│ Machines     │              │
│ Tools        │              │
│ Settings     │              │
└──────────────┴──────────────┘
```

---

# Sidebar

The Sidebar must use the shadcn/ui **Sheet** component.

Requirements:

- Overlay the current page.
- Close when clicking outside.
- Close after navigation on mobile.
- Remember the last opened section when possible.

Do not permanently display the sidebar on small screens.

Desktop implementations may optionally keep the sidebar pinned if required in future versions.

---

# Layout

Preferred layout:

```
Header

↓

Content

↓

Bottom Actions (optional)
```

Avoid deeply nested layouts.

Keep content width readable.

---

# Forms

Forms should follow these rules:

- Single-column layout on mobile.
- Two-column layout only when beneficial on desktop.
- Labels always visible.
- Required fields clearly indicated.
- Validation messages displayed below fields.

---

# Tables

Desktop

Use Data Table.

Mobile

Convert tables into cards.

Never require horizontal scrolling for primary workflows.

---

# Cards

Cards are the preferred component for:

- Repair Tickets
- Maintenance Tasks
- Machine Overview
- Notifications

Each card should display:

- Primary information
- Current status
- Important metadata
- Primary action

---

# Buttons

Primary actions:

- Full width on mobile.
- Standard width on desktop.

Minimum height:

48px

Preferred:

52–56px

---

# Typography

Use the typography provided by the design system.

Avoid excessive font sizes.

Maintain a clear visual hierarchy.

---

# Icons

Use **Lucide React** exclusively.

Do not mix icon libraries.

---

# Colors

Use semantic colors.

Example:

- Success
- Warning
- Error
- Info

Avoid hardcoded colors throughout the application.

Prefer design tokens.

---

# Loading States

Every async page must include:

- Skeleton
- Empty State
- Error State

Avoid displaying blank pages while loading.

---

# Dialogs

Use:

- Dialog
- Alert Dialog
- Drawer
- Sheet

from shadcn/ui.

Do not implement custom modal components.

---

# Toast

All user feedback should use Toast notifications.

Examples:

- Ticket created
- Ticket updated
- Schedule saved
- Error occurred

Avoid using alert().

---

# Accessibility

Every interactive element must:

- Be keyboard accessible.
- Include an accessible label.
- Meet minimum touch target size (48px).

---

# Design Consistency

Reuse existing components whenever possible.

Do not create multiple versions of the same UI pattern.

Maintain consistent:

- Spacing
- Border radius
- Shadows
- Colors
- Typography
- Status badges

---

# AI Implementation Rules

Before creating a new UI component:

1. Check whether shadcn/ui already provides an equivalent component.
2. Reuse existing shared components.
3. Avoid duplicate UI patterns.
4. Prefer composition over customization.
5. Ensure the UI works well on both mobile and desktop.
6. Verify responsive behavior before considering the implementation complete.