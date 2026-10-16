# Mukhtar Codez Monorepo

A full-stack agency website with an Angular 21 single-page application and a separate Express 4 backend. The frontend includes server-side rendering (SSR); the backend serves the legacy Handlebars site and exposes the contact-form API.

## Repository Layout

```text
backend/                         Express API and Handlebars site
  api/                           API routes and controllers
  public/                        Backend static assets
  utils/mailer.js                Gmail SMTP mail delivery
  views/                         Handlebars page templates
  app.js                         Express middleware and route setup
  bin/www                        Backend HTTP server entry point
frontend/agency-frontend/        Angular SSR application
  public/                        Static frontend assets
  src/app/                       Angular application, routes, and services
  src/server.ts                  Angular SSR Express server
```

The backend and frontend are independently installed and run. Each has its own `package.json` and lockfile; install dependencies from the corresponding project directory.

## Requirements

- Node.js 20.19 or newer (use a currently supported Node.js LTS release compatible with Angular 21).
- npm 10 or newer; the frontend lockfile was generated with npm 11.6.2.
- Gmail SMTP credentials for real contact-form email delivery.

Confirm your local runtime before installing dependencies:

```bash
node --version
npm --version
```

## Local Development

### 1. Install dependencies

In one terminal:

```bash
cd backend
npm ci
```

In a second terminal:

```bash
cd frontend/agency-frontend
npm ci
```

### 2. Configure backend email

Create `backend/.env` and supply credentials without committing the file:

```dotenv
EMAIL_USER=your-sending-address@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_TO=your-inbox@example.com
PORT=3000
```

Use a Gmail app password when two-step verification is enabled. `EMAIL_USER` authenticates with Gmail and is also used as the sender; `EMAIL_TO` receives new inquiries. Keep real credentials in a secret manager or deployment environment in production.

### 3. Start both applications

Start the backend from `backend/`:

```bash
npm start
```

It listens on `http://localhost:3000` by default. Start the Angular development server from `frontend/agency-frontend/` in another terminal:

```bash
npm start
```

Open `http://localhost:4200`. The Angular contact form posts JSON to `POST http://localhost:3000/api/contact`; a successful submission sends an owner notification and a customer acknowledgement email.

## Build and Run for Production

Create the optimized Angular browser and server bundles from `frontend/agency-frontend/`:

```bash
npm ci
npm run build
```

The build output is written under `frontend/agency-frontend/dist/agency-frontend/`. To run the generated SSR server:

```bash
npm run serve:ssr:agency-frontend
```

The SSR server listens on `PORT`, defaulting to `4000`. The backend is built with Node.js and does not have a separate compile step. Install and start it from `backend/`:

```bash
npm ci --omit=dev
npm start
```

Deploy the Angular SSR app and backend as separate services or configure a reverse proxy to route frontend requests and `/api` requests to their respective servers. Configure health checks, TLS termination, log collection, process restarts, and backups/retention policies for operational data in your hosting platform.

## Configuration and Deployment Notes

The repository is configured for local development today. Before public deployment, address all of the following:

- `frontend/agency-frontend/src/app/app.constants.ts` hardcodes the API URL to `http://localhost:3000/api/contact`. Change it to the deployed API URL or introduce build-time environment configuration.
- `backend/app.js` allows CORS only from `http://localhost:4200`. Set an explicit allowlist of deployed frontend origins; do not leave local-only or unrestricted CORS settings in production.
- The backend currently logs the email password length at startup, and `backend/utils/mailer.js` logs the SMTP username and password during verification. Remove those credential logs before deploying and rotate any credentials that may have been exposed.
- The SMTP transporter disables certificate verification (`rejectUnauthorized: false`). Restore certificate verification for production SMTP connections.
- Validate and length-limit contact input on the server, escape user-provided content before inserting it into email HTML, and add rate limiting/spam protection. Do not return internal mail errors or stack details to public clients.
- Use the actual WhatsApp phone destination by changing the contact link from `https://wa.me` to `https://wa.me/<country-code-and-number>`.
- Replace the generic social network destinations in `frontend/agency-frontend/src/index.html` with verified profile URLs.
- Configure production email secrets (`EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`) in the hosting provider's secret store. Do not commit `.env` files.
- The repository currently has no automated test or lint scripts configured. Add CI checks for the Angular production build and backend behavior before release.

## API Reference

### `POST /api/contact`

Accepts a JSON request body:

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "topic": "Full-Stack Web App (MEAN Stack)",
  "message": "I would like to discuss a new project."
}
```

`name`, `email`, and `message` are required. `topic` is optional and defaults to `General Inquiry`. A successful delivery returns HTTP 200 with `{ "success": true }`; invalid fields return HTTP 400, while mail delivery failures return HTTP 500.

## Useful Commands

Run these from `frontend/agency-frontend/`:

```bash
npm start                         # Angular development server
npm run build                     # Production SSR build
npm run watch                     # Rebuild on source changes
npm run serve:ssr:agency-frontend # Serve the built SSR app
```

Run these from `backend/`:

```bash
npm start                         # Start Express on PORT or 3000
```

## License

The backend package declares the ISC license. No repository-wide license has been defined; confirm ownership and licensing requirements before redistributing this project.

## 👤 Author
* **Mukhtar Sogunro** 
* **GitHub:** [@MukhTech10](https://github.com/MukhTech10)

---
⭐ If you like this project, feel free to give it a star!