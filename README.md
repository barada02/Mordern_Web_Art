# shanshui 山水

Procedurally generated Chinese ink landscapes for the web: seeded, animated, dependency-free SVG, as a JS API or a `<shan-shui>` web component.

**→ Usage docs: [packages/core/README.md](packages/core/README.md)**

```html
<script src="https://cdn.jsdelivr.net/npm/shanshui@0.1/dist/shanshui.iife.js"></script>
<shan-shui seed="hello" space="left" animate>
  <h1>Your headline</h1>
</shan-shui>
```

Inspired by Lingdong Huang's [{Shan, Shui}\*](https://github.com/LingDong-/shan-shui-inf).

## Repo layout

```
packages/core      → the `shanshui` npm library (published)
apps/playground    → Vite app that consumes the library exactly like a user would
                     (index.html: options playground, element.html: web component demos)
```

## Develop

```sh
npm install
npm run dev        # builds the library in watch mode + starts the playground
npm run build      # builds everything
npm run typecheck
```

## Release

```sh
npm run build
npm publish -w shanshui
```

## License

MIT
