# Security Policy

## Scope

GenX-DOS is a static, client-side site — no server, no backend, no accounts,
and no personal data is collected. Anything the site keeps (save-states, the
Model 100's battery RAM, emulator settings) lives only in your own browser and
never leaves your machine — see
[Your Data](https://github.com/Retro-Jack/GenX-DOS/wiki/Your-Data) for the full
list and when each is written. The realistic security surface is:

- client-side issues in the hand-written terminal code under `prompt/` — e.g. a
  way to inject or execute unintended script through the simulated DOS prompt;
- vulnerabilities in the bundled third-party emulators and libraries (listed in
  [ATTRIBUTION.md](ATTRIBUTION.md)).

## Supported versions

Only the latest GitHub release and the live site
(<https://retro-jack.github.io/GenX-DOS/>) receive fixes. Older tags are not
patched.

## Reporting a vulnerability

Please report privately rather than opening a public issue:

- **Preferred:** GitHub's private vulnerability reporting — the
  **Report a vulnerability** button on the repository's **Security → Advisories**
  page (<https://github.com/Retro-Jack/GenX-DOS/security/advisories>). It sits
  one level in from the Security tab, not on its landing page.
- **Email:** retrojack68@gmail.com

Include what you found, where, and how to reproduce it. This is a one-person
hobby project, so responses are best-effort — but genuine reports will be
looked at, and credited if you'd like.

## Not a security issue

Bundled game ROMs and system BIOS images are a copyright/preservation matter,
not a security one. For takedown requests, use the issue tracker as described
in [README.md](README.md) and [ATTRIBUTION.md](ATTRIBUTION.md).
