# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Privy Production and CSP

Vercel serves an enforced `Content-Security-Policy` header on all routes using
`vercel.json`. The policy follows [Privy's CSP guidance](https://docs.privy.io/security/implementation-guide/content-security-policy)
and preserves the SPA rewrite. This configuration targets production after UAT
validation; run the production checks below after deployment. CSP does not activate Privy production mode or increase user
limits; those are separate Privy Dashboard settings.

### Environment and Dashboard Setup

Keep the existing `VITE_PRIVY_APP_ID` and Google/email login configuration. Confirm
that this App ID belongs to the intended Privy app and that its production access,
billing and user allowance are configured. Add `https://app.nemai.io` and the exact
UAT frontend origin to the allowed origins, and verify Google OAuth and email
login settings. Ensure backend token validation uses the same App ID.

Set these Vercel variables in the Production deployment environment:

| Variable | Production |
| --- | --- |
| `VITE_CUSTOMER_SERVICE_URL` | `https://customer-api.nemai.io` |
| `VITE_CHAT_AI_SERVICE_URL` | `https://chat-ai-api.nemai.io` |
| `VITE_PRIVY_APP_ID` | Existing Privy App ID |

Rebuild after changing `VITE_*` variables: Vite embeds them in browser assets.
Never put a Privy app secret or other server-side credential in a `VITE_*` variable.

### Policy Allowlist

`connect-src` allows only the two production API origins above, the current origin
and Privy's documented auth, RPC and WalletConnect endpoints. UAT API origins are
not allowed. UAT deployments must retain a separate environment-specific policy
that allows `https://customer-api-uat.nemai.io` and `https://chat-ai-api-uat.nemai.io`;
deploying this production policy with UAT API variables will block those requests.
The policy does not use a broad `https:` or `*.nemai.io` allowance.

Privy and WalletConnect iframe origins are allowed in `child-src` and `frame-src`.
Cloudflare Turnstile is allowed in `script-src` and `frame-src`. Confirm the CAPTCHA
provider in the Privy Dashboard: if hCaptcha or a custom Privy auth domain is enabled,
add only the corresponding sources required by Privy's guidance before testing.

`style-src 'unsafe-inline'` supports existing React inline styles, Framer Motion and
injected UI styles. Scripts do not allow `unsafe-inline` or `unsafe-eval`. Images
are limited to the current origin, `data:` and `blob:`; fonts, workers and the
manifest are same-origin. External images in chat replies are therefore blocked
unless their trusted origins are explicitly added. Stripe payment links navigate
to a separate page and do not require embedded Stripe script or frame allowances.
`frame-ancestors 'none'` prevents embedding this app, including in iframe previews.

### Deployment Checks

1. Validate `vercel.json`, then run `npm run build` and `npm run lint`.
2. Deploy production on Vercel after UAT validation. Inspect the actual response
	header for `/` and a nested route such as `/dashboard`, including a direct refresh.
	Open `https://app.nemai.io` in a standalone
	browser tab. Vite dev and preview servers do not apply Vercel headers.
3. Test Google and email login for new and existing users, CAPTCHA, logout and
	relogin. Check customer sync, profile updates, chat send/history/delete, referral
	code retention, dashboard, quests, referrals, fonts, logos, manifest and Stripe
	payment-link navigation/return.
4. Inspect browser Console and Network for CSP violations, first without browser
	extensions. Distinguish blocked resources from CORS, authentication failures,
	backend `403` alpha eligibility and `429` quotas. Add a source only when a
	required flow demonstrates the need; do not broadly relax script restrictions.
5. Confirm production login, customer sync and chat work without CSP violations.
	Repeat CSP testing after Privy SDK updates using the appropriate environment's policy.

For an incident, redeploy the previous working configuration or temporarily change
the header key to `Content-Security-Policy-Report-Only` while investigating. That
mode reports violations to the browser console but does not enforce the policy;
no remote reporting endpoint is configured. Avoid duplicate enforced policies.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
