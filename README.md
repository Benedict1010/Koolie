# KOOLIE – Local Service Marketplace

KOOLIE is a full-stack service marketplace designed to connect customers looking for local services with professionals who can provide them.

The platform aims to simplify service discovery, service requests, and communication between customers and service providers through a role-based application experience.

## Project Overview

KOOLIE provides two primary user experiences:

* **Client:** Discover services and create service requests.
* **Professional:** Explore available jobs and provide services.

The application is designed to support location-aware service discovery and communication between clients and professionals.

## Key Features

* Client and professional user roles.
* Role-based dashboards and navigation.
* Firebase Authentication.
* Google Sign-In and email verification.
* User registration and profile management.
* Service request management.
* Provider job discovery workflows.
* District-based location matching.
* Real-time client-provider messaging using Firestore listeners.
* Admin monitoring interface.

*Feature availability may vary depending on the current implementation.*

## Technology Stack

| Category        | Technologies            |
| --------------- | ----------------------- |
| Frontend        | React.js, Vite          |
| Backend / BaaS  | Firebase                |
| Authentication  | Firebase Authentication |
| Database        | Cloud Firestore         |
| Routing         | React Router            |
| Version Control | Git, GitHub             |

## Application Architecture

The application is organized around separate client and professional workflows.

```text
KOOLIE
│
├── Client Dashboard
│   ├── Service Discovery
│   ├── Request a Service
│   └── Messaging
│
├── Professional Dashboard
│   ├── Browse Jobs
│   ├── Manage Service Opportunities
│   └── Messaging
│
├── Authentication
│   ├── Email Authentication
│   ├── Google Sign-In
│   └── Profile Management
│
└── Firebase
    ├── Authentication
    └── Cloud Firestore
```


## Getting Started

Clone the repository:

```bash
git clone https://github.com/Benedict1010/Koolie.git
```

Navigate to the client application:

```bash
cd Koolie/Koolie0/client
```

Install dependencies:

```bash
npm install
```

Configure your Firebase environment variables using your own Firebase project credentials.

Start the development server:

```bash
npm run dev
```

Check the client `package.json` for available scripts.

## Future Improvements

* Expand automated testing.
* Improve application performance.
* Enhance service-provider discovery.
* Improve error handling and validation.
* Add comprehensive deployment documentation.

## Repository

https://github.com/Benedict1010/Koolie

---

Developed as a collaborative full-stack software engineering project.
