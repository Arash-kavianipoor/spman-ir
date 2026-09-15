# Agent Directives & Cloudflare Deployment Rules

These rules are persistent instructions for the AI Coding Agent across all future sessions and tasks on this project.

## Mandatory Cloudflare Build & Deployment Standards

1. **Lockfile Strict Integrity (`npm ci` compatibility):**
   - The project MUST strictly build with `npm clean-install` / `npm ci`.
   - Never add or modify dependencies in `package.json` without keeping `package-lock.json` completely aligned and committed.
   - Never introduce foreign lockfiles like `bun.lock`, `bun.lockb`, or `yarn.lock`.
   - Keep Node version compatible with Node.js 20 LTS (using `.node-version` / `.nvmrc` set to `20.20.2`).

2. **SPA Routing & Redirect Loop Prevention:**
   - NEVER create a `public/_redirects` file with `/* /index.html 200` because Cloudflare Pages / Workers already manages SPA routing and this causes error `100324: Infinite loop detected in this rule`.
   - Use `wrangler.jsonc` with `"not_found_handling": "single-page-application"`.

3. **Vite Build & Chunk Optimization:**
   - Maintain `manualChunks` in `vite.config.ts` for heavy third-party vendor libraries (`leaflet`, `lucide-react`, `motion`, `react-dom`, etc.) to keep chunks under 500kB and maximize Cloudflare edge caching.

4. **Production Output Directory:**
   - The build output MUST always target `dist/`.
   - Verify every build using `npm run build` or `compile_applet`.

For complete technical specifications, refer to `CLOUDFLARE_BUILD_GUIDELINES.md`.
