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

## Calidad

- Antes de entregar cambios, correr `npm run lint` y `npm run typecheck`; si toca comportamiento o build, correr `npm run check`.
- Corregir warnings relevantes en lugar de silenciarlos.
- Mantener el repo limpio: no commitear `.env`, builds, caches ni secretos.
