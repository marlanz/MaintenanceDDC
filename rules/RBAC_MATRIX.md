# RBAC Matrix

> Project: MAINTENANCE-DDC WEB

This document defines the Role-Based Access Control (RBAC) model for the system.

All permissions must be validated **server-side**.

Client-side role checks are for UI purposes only and must never be trusted.

---

# Roles

| Role | Description |
|-------|-------------|
| WORKER | Factory operator who reports machine issues |
| TECHNICIAN | Maintenance technician responsible for repair and preventive maintenance |
| TEAM_LEADER | Team leader responsible for assigning and inspecting tickets within their team |
| ASSET_MANAGER | Asset administrator responsible for machines and tools |
| MAINTENANCE_MANAGER | Maintenance department manager with factory-wide maintenance authority |
| ADMIN | System administrator |

---

# Permission Matrix

| Feature | Worker | Technician | Team Leader | Asset Manager | Maintenance Manager | Admin |
|----------|:------:|:----------:|:-----------:|:-------------:|:-------------------:|:-----:|
| Login | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Update own profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

# Repair Ticket

| Action | Worker | Technician | Team Leader | Asset Manager | Maintenance Manager | Admin |
|----------|:------:|:----------:|:-----------:|:-------------:|:-------------------:|:-----:|
| Create Repair Ticket | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| View own created tickets | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| View assigned tickets | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View all tickets | ❌ | ❌ | Team Only | Factory | Factory | All |
| Edit own ticket before assignment | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Cancel own pending ticket | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Assign Technician | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Assign multiple Technicians | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Change Priority | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Change Status | ❌ | Limited | ✅ | ❌ | ✅ | ✅ |
| Close Ticket | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |

---

# Technician Permissions

| Action | Permission |
|----------|------------|
| Accept assigned ticket | ✅ |
| Start maintenance | ✅ |
| Update repair progress | ✅ |
| Upload repair images | ✅ |
| Submit repair report | ✅ |
| Finish repair | ✅ |
| Reject assignment | ❌ |
| Reassign ticket | ❌ |

---

# Inspection

| Action | Worker | Technician | Team Leader | Asset Manager | Maintenance Manager | Admin |
|----------|:------:|:----------:|:-----------:|:-------------:|:-------------------:|:-----:|
| Perform Inspection | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Approve Inspection | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Return ticket to Technician | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |

---

# Machine Management

| Action | Worker | Technician | Team Leader | Asset Manager | Maintenance Manager | Admin |
|----------|:------:|:----------:|:-----------:|:-------------:|:-------------------:|:-----:|
| View Machine | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Machine | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Update Machine | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Delete Machine | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

---

# Preventive Maintenance

| Action | Worker | Technician | Team Leader | Asset Manager | Maintenance Manager | Admin |
|----------|:------:|:----------:|:-----------:|:-------------:|:-------------------:|:-----:|
| View Schedule | ❌ | Assigned Only | Team | Factory | Factory | All |
| Create Schedule | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Update Schedule | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Delete Schedule | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Dispatch Technician | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |

---

# Tools (CCDC)

| Action | Worker | Technician | Team Leader | Asset Manager | Maintenance Manager | Admin |
|----------|:------:|:----------:|:-----------:|:-------------:|:-------------------:|:-----:|
| View Tools | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Tool | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Update Tool | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Delete Tool | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

---

# User Management

| Action | Worker | Technician | Team Leader | Asset Manager | Maintenance Manager | Admin |
|----------|:------:|:----------:|:-----------:|:-------------:|:-------------------:|:-----:|
| View User | ❌ | ❌ | Team | ❌ | Factory | All |
| Change Workshop | ❌ | ❌ | ✅ (Team Members) | ❌ | ✅ | ✅ |
| Change Team | ❌ | ❌ | ✅ (Team Members) | ❌ | ✅ | ✅ |
| Activate User | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Deactivate User | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Assign Role | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

# Dashboard

## Worker

Can view:

- Own open tickets
- Own maintenance requests
- Own ticket history

---

## Technician

Can view:

- Assigned tickets
- Today's maintenance schedule
- Repair history

---

## Team Leader

Can view:

- Team ticket statistics
- Team maintenance schedule
- Team technician workload
- Team overdue tickets

---

## Maintenance Manager

Can view:

- Factory ticket statistics
- Workshop statistics
- SLA dashboard
- Machine failure ranking
- Technician KPI
- Preventive maintenance completion

---

## Asset Manager

Can view:

- Machine inventory
- Tool inventory
- Maintenance schedules

---

## Admin

Can view everything.

---

# Data Scope Rules

## Worker

May only access:

- Own profile
- Own tickets

---

## Technician

May only access:

- Assigned tickets
- Assigned maintenance schedules

---

## Team Leader

May only access:

- Users within own team
- Tickets within own team
- Machines belonging to own team

---

## Asset Manager

May access:

- All machines
- All tools
- All maintenance schedules

Cannot inspect repair tickets.

---

## Maintenance Manager

May access all maintenance resources within the organization.

---

## Admin

Has unrestricted access.

---

# Business Constraints

## Ticket Status Flow

Only the following transition is valid:

PENDING

↓

ASSIGNED

↓

IN_MAINTENANCE

↓

INSPECTION

↓

CLOSED

Invalid transitions must be rejected.

---

## Technician Assignment

A Repair Ticket may have multiple Technicians.

Only Team Leader, Maintenance Manager and Admin may assign Technicians.

---

## Inspection

Inspection can only be performed by:

- TEAM_LEADER
- MAINTENANCE_MANAGER
- ADMIN

---

## Workshop Isolation

Users cannot access resources belonging to another workshop unless their role explicitly grants cross-workshop access.

---

## Team Isolation

Workers, Technicians and Team Leaders are restricted to their own team by default.

---

# Server Authorization Rules

Every protected endpoint, Server Action, or Route Handler must validate:

1. Authentication
2. User Role
3. Resource Ownership
4. Workshop Scope
5. Team Scope (if applicable)

Client-side permission checks are for UX only and must never replace server-side authorization.