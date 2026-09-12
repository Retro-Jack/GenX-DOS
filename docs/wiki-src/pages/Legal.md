# The legal position

Where GenX-DOS stands, and why, in one place. The detail lives in
[[ATTRIBUTION]], [[LICENSE]] and [[REMOVAL]]; this page is the reasoning that
connects them. It is a statement of position, not legal advice.

## What it rests on

GenX-DOS is a one-person, non-commercial preservation project. It is a static
site: no server code, no accounts, no payments, no advertising, no sponsorship,
no analytics and no telemetry. Nothing about it earns money, and there is no
mechanism by which it could without being rebuilt.

Since 11/09/2026 its two public surfaces hold different things:

| Surface | What is there |
|---|---|
| **genx-dos.fun** | The whole site: the emulators, and the games, BIOS and firmware they run |
| **The GitHub repository** | Code, documentation and artwork only — no games, and no firmware we supplied, in the working tree, the history, or the release zip |

That split is deliberate. A concern about content belongs where the content is,
and cannot take the code, the documentation or the project's history with it.

## The two licences on original work

Original material is **CC BY-NC 4.0**, except the emulator-facing glue —
`systems/_shared/genx-*.js`, `systems/_shared-ejs/genx-*.js` and each bundle's
`play.html` — which is **GPL-3.0-or-later**. Fifty files carry an SPDX header
saying which.

The split exists because those glue files drive GPL engines in the same browser
context, so they are best treated as part of a combined work with them. The GPL
forbids further restrictions, and NonCommercial is a further restriction, so the
glue is GPL and the conflict disappears at the one point it arises. Everything
worth protecting — the prompt, the writing, the artwork, the instruction pages —
stays NonCommercial.

One inherited obligation: the DOS terminal derives from the LGR terminal
framework, and a clear credit to LGR must survive in any derivative.

## Third-party code

Every engine, core and library here is someone else's work, under its own terms —
GPL-2.0, GPL-3.0, MIT, BSD-2-Clause, zlib, Artistic-2.0 — and [[ATTRIBUTION]] is
the canonical record. Every binary we ship names its corresponding source, so the
GPL's offer is met by a link rather than a request; our three forks are public,
with their changes described in prose; no upstream code is relicensed, and
vendored code is kept byte-faithful.

Two cores are non-commercial-only: MAME 2003-Plus, under the classic MAME 0.78
terms, and Genesis Plus GX. They suit the project as it is — and they are a hard
constraint on it ever becoming commercial. CC BY-NC draws the same line.

## Games, BIOS and firmware

The site serves several hundred home-computer and console titles, a hundred
arcade romsets, and the manufacturer BIOS and firmware images some machines need
to start. None of it is in the repository, its history, or the release zip, and
we publish no guidance on where to find any of it.

**Where there is permission**, it is named: GCE Vectrex, under Smith
Engineering's standing non-commercial permission; LDOS 5.3.1, under Roy
Soltoff's grant, with the notice retained; *Attack of the PETSCII Robots*, as
its author's shareware release; public-domain and homebrew type-ins, and free
reimplementations such as AltirraOS where those are what we ship.

**Where there is none** — the several hundred commercial titles, the arcade
romsets, the manufacturer firmware — the position is preservation and personal
use: machines 30 to 45 years out of production, software long out of commerce.
That is a justification, not a permission, and we would not pretend otherwise. A
rights holder who objects is within their rights, and the answer is not to argue
but to remove it. Several of the publishers represented here still license their
catalogues actively, and that is understood rather than overlooked.

What that rests on in practice: the project is non-commercial in fact and by
licence; removal is promised on request, at a deliberately low bar, from a link
on every page; and there are no directory listings and no sourcing guidance.

## Sound and artwork

The one sound effect, the arcade coin drop, is licensed for this project — bought
from its vendor — so it is used by right rather than on any preservation basis.

Bezel photography, wallpapers and screen art are not attribution-tracked as a
matter of policy, with one exception that carries a share-alike obligation and is
credited in the page that uses it. That is a known gap rather than a considered
position, and the removal promise covers artwork like everything else.

## Removal upon request

If you hold rights in anything here, or represent someone who does, it comes down
as soon as the request is read — not debated, not defended, not delayed pending a
formal process. A request needs three things: who you are, your standing, and
what and why. No notice format, no legal citations, no documents.

**Email admin@genx-dos.fun.** No account is needed anywhere, and a few sentences
are enough. [[REMOVAL]] is the whole procedure, including what we can and cannot
reach.

## Trade marks and naming

Machine, publisher and game names are used descriptively, to identify the
software a page is about. No endorsement, affiliation or authorisation is claimed
or implied, and no logo is used as a badge of origin for this project. The
project's own name is GenX-DOS; the terminal it derives from is credited to LGR.

## Personal data

None is collected. No accounts, no cookies, no analytics, no telemetry, and every
served page carries a Content-Security-Policy that blocks off-site requests at
source. What the site stores lives only in your own browser — save states, the
Model 100's battery RAM, emulator settings, in-game cartridge saves, and one
20-byte arcade input config — and [[Your-Data]] is the complete list of each and
when it is written. The web host keeps its own access logs, which we neither read
nor use.

## Known gaps

Stated because a position that only lists its strengths is not a position.

- Nothing tells search engines to stay out of the game directories, and nothing
  invites them in either.
- Graphics attribution is policy-free apart from the one share-alike item above.
- No lawyer has read any of this. For a hobby project that is a reasonable place
  to stop; it is worth saying that it is where we have stopped.
