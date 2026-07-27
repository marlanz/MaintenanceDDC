# System Design Rules

This section defines the mandatory backend architecture and data model for the project.

All implementations must follow these rules unless explicitly overridden by future requirements.

---

# Technology Stack

## Database

The application **must use MongoDB** as the primary database.

Requirements:

- MongoDB Atlas
- Mongoose ODM
- BSON ObjectId as primary key
- Reference documents using ObjectId
- Avoid unnecessary data duplication
- Design schemas for future scalability

---

## Authentication

The application **must use Better Auth**.

Requirements:

- Better Auth manages authentication and session lifecycle.
- Extend Better Auth's `user` collection with business-related fields.
- Do not create a separate authentication table.
- Use Better Auth adapters for MongoDB.
- Protect all server actions, route handlers, and APIs.
- Authentication and authorization must always be validated on the server.

---

## Authorization

The application follows **Role-Based Access Control (RBAC)**.

Supported Roles:

- WORKER
- TECHNICIAN
- TEAM_LEADER
- ASSET_MANAGER
- MAINTENANCE_MANAGER
- ADMIN

Authorization rules must always be enforced on the server.

Never trust client-side role checks.

---

# Data Modeling Principles

## Object References

Collections should reference each other using `ObjectId`.

Example:

User
→ Workshop

User
→ Team

RepairTicket
→ Machine

RepairTicket
→ User

MaintenanceSchedule
→ Machine

Avoid storing duplicated information such as:

- Machine Name
- User Name
- Workshop Name

These values should be resolved through references.

---

## Common Fields

Every business collection should include:

```ts
{
    _id: ObjectId,
    createdAt: Date,
    updatedAt: Date
}
```

Soft delete can be introduced later if required.

---

# Suggested Collections

The system should contain the following primary collections.

---

## User

Extends Better Auth's default User model.

```ts
User {
    _id: ObjectId

    // Better Auth
    name: string
    email: string
    emailVerified: boolean
    image?: string

    // Business
    employeeCode: string

    role: string

    workshopId: ObjectId

    teamId: ObjectId

    phone?: string

    isActive: boolean

    createdAt: Date
    updatedAt: Date
}
```

---

## Machine

```ts
Machine {
    _id: ObjectId

    machineCode: string

    machineName: string

    serialNumber?: string

    categoryId?: ObjectId

    workshopId: ObjectId

    teamId: ObjectId

    manufacturer?: string

    model?: string

    installDate?: Date

    maintenanceCycle: {
        type: "WEEKLY" | "MONTHLY" | "CUSTOM"
        value: number
    }

    currentStatus?: string

    note?: string

    createdAt: Date
    updatedAt: Date
}
```

---

## RepairTicket

```ts
RepairTicket {

    _id: ObjectId

    ticketType:
        "REPAIR"
        | "MAINTENANCE"

    requesterId: ObjectId

    machineId: ObjectId

    workshopId: ObjectId

    exactLocation?: string

    priority:
        "HIGH"
        | "NORMAL"

    status:
        "PENDING"
        | "ASSIGNED"
        | "IN_MAINTENANCE"
        | "INSPECTION"
        | "CLOSED"

    assignedTechnicianIds: ObjectId[]

    description: string

    repairReport?: string

    incidentImages: string[]

    repairImages: string[]

    inspectionBy?: ObjectId

    inspectionAt?: Date

    closedAt?: Date

    createdAt: Date

    updatedAt: Date
}
```

---

## MaintenanceSchedule

```ts
MaintenanceSchedule {

    _id: ObjectId

    machineId: ObjectId

    createdBy: ObjectId

    technicianIds: ObjectId[]

    cycleType:
        "WEEKLY"
        | "MONTHLY"
        | "CUSTOM"

    interval?: number

    fixedDay?: number

    nextMaintenanceDate: Date

    isActive: boolean

    autoGenerateTicket: boolean

    createdAt: Date

    updatedAt: Date
}
```

---

## Role

```ts
Role {

    _id: ObjectId

    code:
        "WORKER"
        | "TECHNICIAN"
        | "TEAM_LEADER"
        | "ASSET_MANAGER"
        | "MAINTENANCE_MANAGER"
        | "ADMIN"

    name: string

    description?: string
}
```

---

## Workshop

```ts
Workshop {

    _id: ObjectId

    workshopCode: string

    workshopName: string
}
```

---

## Team

```ts
Team {

    _id: ObjectId

    teamCode: string

    teamName: string

    workshopId: ObjectId

    leaderId?: ObjectId

    createdAt: Date
    updatedAt: Date
}
```

---

# Suggested Future Collections

These collections are recommended for future expansion.

- RepairLog
- AuditLog
- Notification
- MachineCategory
- Tool (CCDC)
- FileAttachment

The AI should keep the architecture open for these modules.

---

# Business Rules

- Use MongoDB ObjectId as the primary identifier.
- Never generate custom Ticket IDs.
- A Repair Ticket may be assigned to multiple Technicians.
- Machine history should be derived from Repair Tickets and Maintenance Schedules.
- Maintenance Tickets are automatically generated from active Maintenance Schedules.
- All business entities should support future multi-factory deployments.
- Avoid hardcoded enums outside shared constants.
- Store uploaded image URLs only (Cloudinary), never binary data in MongoDB.

---

# Architecture Guidelines

Business logic should be separated into layers:

Presentation

↓

Application (Server Actions / Services)

↓

Domain Logic

↓

Repository / Database

UI components must never directly communicate with the database.

Database access should always be encapsulated through repositories or service layers.

---

# AI Coding Rules

Before introducing a new schema:

1. Check whether an existing collection can be extended.
2. Prefer references over duplicated data.
3. Keep documents cohesive and reasonably sized.
4. Design schemas with future scalability in mind.
5. Maintain consistency across all collections.