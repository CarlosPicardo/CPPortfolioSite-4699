# Carlos Picardo Portfolio

The source of truth for `carlospicardo.com`.

The website is a Bun monorepo. `packages/web` contains the public React/Vite site, the `/admin` editor, and the Hono API. The production server serves the built frontend and API from one process.

## Local setup

1. Install [Bun](https://bun.sh/).
2. Copy `.env.template` to `.env` and add the required credentials.
3. Install and build:

```sh
bun install --frozen-lockfile
bun run build:web
```

Run the production server:

```sh
bun run start:web
```

The server uses `PORT` and binds to `0.0.0.0`. Check `/api/health` for a deployment health check.

## Runtime services

The site is dynamic and requires:

- Turso/libSQL for published projects, editable site content, custom sections, admin settings, and contact messages.
- S3-compatible storage (currently Cloudflare R2) for media uploaded through `/admin`.
- Resend for contact-form email delivery. Messages are still stored in the database if email delivery is unavailable.
- `BETTER_AUTH_SECRET` for signed admin sessions and `ADMIN_PASSWORD` as the initial admin password. A password saved through `/admin` takes precedence.

Runable-specific analytics, editor feedback, configuration files, and URLs have been removed. No Runable credential is required.

## Deploy on Render

`Dockerfile` and `render.yaml` define a GitHub-driven Render web service. Create the service from the Blueprint, enter each `sync: false` secret when prompted, and verify the generated `onrender.com` URL before changing DNS.

Do not commit `.env`. The Docker build explicitly excludes it.

## Custom domain cutover

Keep the current Runable deployment live while testing the new host. After the replacement passes the checks below, add both `carlospicardo.com` and `www.carlospicardo.com` to the new service, apply only the DNS records supplied by the host, wait for TLS and domain verification, and test again on the custom domain.

Required checks:

- `/` loads on desktop and mobile.
- `/admin` opens and accepts the intended password.
- `/api/health`, `/api/songs`, and `/api/custom-sections` respond successfully.
- Existing uploaded cover art loads through `/api/media/...`.
- The contact form stores a message and sends email.
- `/api/epk` downloads a valid PDF.
- Spotify embeds, navigation anchors, theme switching, project modals, and external links work.

Only after those checks pass should the Runable plan be downgraded.
