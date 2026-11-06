# Security Policy

## Scope

GenX-DOS is a static, client-side site — no server, no backend, no accounts,
and no personal data is collected. Anything the site keeps (save-states, the
Model 100's battery RAM, emulator settings, one arcade input-config file) lives
only in your own browser and
never leaves your machine — see
[Your Data](https://github.com/Retro-Jack/GenX-DOS/wiki/Your-Data) for the full
list and when each is written. The realistic security surface is:

- client-side issues in the hand-written terminal code under `prompt/` — e.g. a
  way to inject or execute unintended script through the simulated DOS prompt;
- vulnerabilities in the bundled third-party emulators and libraries (listed in
  [ATTRIBUTION.md](ATTRIBUTION.md)).

## No external calls at runtime

Every emulator, core, ROM, font and asset is self-hosted — the site makes no
third-party network requests, and there is no analytics or telemetry of any
kind. This is enforced, not merely intended: every served page carries a strict
**Content-Security-Policy** — `default-src 'self'` and `connect-src 'self'`,
with `blob:` / `data:` allowed only where WebAssembly, Web Workers and audio
worklets require them. Pages that run an emulator may also compile code; where
the engine has been shown to run without it, that is narrowed to WebAssembly
alone (`'wasm-unsafe-eval'`), and the full `'unsafe-eval'` stays only where an
engine builds JavaScript from strings — so the browser blocks any off-site
request at the source. With the policy in place the DevTools Network panel shows
zero external requests. A served page that can reach an external origin is
itself a security issue worth reporting.

## Supported versions

Only the latest GitHub release and the live site
(<https://genx-dos.fun/>) receive fixes. Older tags are not
patched.

## Reporting a vulnerability

Please report privately by email rather than in public:

- **Email:** admin@genx-dos.fun

Include what you found, where, and how to reproduce it. This is a one-person
hobby project, so responses are best-effort — but genuine reports will be
looked at, and credited if you'd like.

## Not a security issue

Game ROMs and system BIOS images served by the site are a copyright/preservation
matter, not a security one. For removal requests, see **Removal upon request**
in [ATTRIBUTION.md](ATTRIBUTION.md), or the page it is published on,
[REMOVAL.md](REMOVAL.md): email admin@genx-dos.fun, or open an issue if you
would rather it were public. Either way the material comes down.
