# AGENTS.md

## Proyecto

Frontend del portfolio personal/profesional. Debe priorizar claridad, performance, accesibilidad, SEO y una experiencia visual cuidada sin sacrificar mantenibilidad.

## Stack

- Next.js 16 con App Router en `src/app`.
- React 19 y TypeScript.
- Tailwind CSS 4.
- ESLint 9 con `eslint-config-next`.

## Comandos

- Instalar dependencias: `npm install`.
- Desarrollo: `npm run dev`.
- Lint: `npm run lint`.
- Typecheck: `npm run typecheck`.
- Build/verificacion completa: `npm run check`.

## Reglas de codigo

- Usar TypeScript estricto y evitar `any`; preferir tipos explicitos en contratos publicos.
- Mantener componentes pequenos, semanticos y faciles de probar.
- Usar Server Components por defecto; marcar `use client` solo cuando haya estado, efectos o APIs del navegador.
- Centralizar datos editables del portfolio (proyectos, experiencia, skills, links) en estructuras tipadas.
- Evitar copiar texto, colores o layout en multiples lugares; extraer constantes cuando reduzca duplicacion real.
- No introducir librerias grandes sin una razon clara de producto o DX.

## UI y UX

- El primer viewport debe mostrar identidad, rol/oferta y una accion clara.
- Priorizar contenido real del portfolio: proyectos, impacto, tecnologias, casos y contacto.
- Usar HTML semantico, orden correcto de headings y labels accesibles.
- Mantener contraste suficiente, focus visible y navegacion por teclado.
- Optimizar imagenes con `next/image` cuando aplique y siempre definir `alt` util.
- Disenar mobile-first; evitar layouts que dependan de ancho fijo.

## SEO y performance

- Definir metadata por pagina desde App Router.
- Cuidar Core Web Vitals: imagenes optimizadas, CSS liviano y JS minimo en cliente.
- No cargar trackers, fuentes o scripts externos sin necesidad.
- Mantener `canonical` + `alternates.languages` (hreflang es/en/x-default), `sitemap.ts`, `robots.ts` y JSON-LD al agregar paginas o secciones nuevas.

## Blog / Strapi (CMS)

- El blog se nutre de Strapi (template oficial v5: coleccion `articles` con `cover`, `author`, `category` y dynamic zone `blocks`).
- Toda la integracion vive en `src/lib/strapi.ts`. El token va en `STRAPI_API_TOKEN` (server-only, sin prefijo `NEXT_PUBLIC`); nunca exponerlo al cliente ni importar `strapi.ts` desde un Client Component (pasar datos ya resueltos como props).
- Mostrar **solo articulos publicados** por defecto. `STRAPI_DRAFTS=true` es un modo preview opcional; en produccion debe quedar en `false`/vacio. No pasar `status=draft` salvo preview explicito.
- Fetch con `next: { revalidate: 300 }` (ISR) y resiliente: si Strapi falla, devolver vacio sin romper el build.
- URLs de media de Strapi Cloud son absolutas; igualmente normalizar con un helper y declarar el host en `images.remotePatterns` de `next.config.ts`.
- El contenido `rich-text` viene en markdown: renderizar en servidor con `marked` y estilos `.article-body`.

## Listas y keys (React)

- Nunca usar como `key` un id que no sea unico en todo el array. En dynamic zones de Strapi los `id` de cada componente NO son unicos entre tipos distintos: usar una key compuesta (`${block.__component}-${index}`).
- Evitar `key={index}` salvo listas estaticas sin reordenamiento.

## Calidad

- Antes de entregar cambios, correr `npm run lint` y `npm run typecheck`; si toca comportamiento o build, correr `npm run check`.
- Corregir warnings relevantes en lugar de silenciarlos.
- Mantener el repo limpio: no commitear `.env`, builds, caches ni secretos.
