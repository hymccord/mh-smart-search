# Userscript With Rollup Template

Template repository that allows developing userscripts with code split over multiple files.

See this repo for loading a userscript over localhost: [hymccord/localhostuserscript](https://github.com/hymccord/LocalhostUserscript)

## Developing

First install all dependendencies:

```bash
pnpm install
```

Then run the watch script along with the development server.  
It requires running two terminals at once for optimal experience.  

```bash
pnpm dev
pnpm serve
```

Alternatively, you can just build and copy/paste the output from the `main.js` in `dist/`.

```bash
pnpm build
```
