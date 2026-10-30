# Vendored: Z80.js

Z80 CPU interpreter by Molly Howell — https://github.com/DrGoldfire/Z80.js
MIT licence, full text in `Z80.LICENSE.md`. Copied, not package-managed.

Two changes, both mechanical, so the same file runs under Node (for the test
suite) and in the browser. No emulation behaviour is touched.

1. **`window` guard.** The constructor rejected being called without `new` by
   testing `this === window`, which throws `ReferenceError: window is not
   defined` under Node before the check can even run:

   ```js
   -   if (this === window)
   +   if (typeof window !== "undefined" && this === window)
   ```

2. **ES module export.** The file declared a bare global `function Z80`, with
   no export of any kind. Appended:

   ```js
   export { Z80 };
   ```

To update: re-download upstream and reapply both. Nothing else was altered.
