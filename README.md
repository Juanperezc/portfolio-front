# Portfolio Front

Frontend del portfolio, creado con Next.js 16, React 19, TypeScript, Tailwind CSS 4 y ESLint.

## Requisitos

- Node.js 20.9 o superior.
- npm.

## Desarrollo

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Calidad

```bash
npm run lint
npm run typecheck
npm run check
```

`npm run check` ejecuta lint, typecheck y build.

## Estructura

- `src/app`: rutas, layouts y paginas del App Router.
- `public`: assets estaticos.
- `AGENTS.md`: reglas de desarrollo para agentes y colaboradores.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
