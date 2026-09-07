# La Avenida Chicharrón 🐷

App de pedidos en tiempo real para un negocio de chicharrón en La Vega, República Dominicana.

**En vivo:** [la-avenida-chicharron.vercel.app](https://la-avenida-chicharron.vercel.app)

## Qué hace

- **Cliente:** ve el menú (domingos / entre semana), arma su pedido, paga en efectivo o por transferencia (con foto del comprobante), comparte su ubicación GPS, y sigue el estado de su pedido en vivo.
- **Dueño:** entra con correo y contraseña. Ve y gestiona los pedidos activos (aceptar, preparar, asignar repartidor, marcar entregado), confirma pagos por transferencia, edita el menú y las cuentas bancarias, administra los repartidores (cada uno con su propio PIN), y revisa ingresos filtrados por día/semana/mes.
- **Repartidor:** entra con su PIN individual. Ve solo las entregas que tiene asignadas, con mapa y botón directo a WhatsApp.

Todo se actualiza al instante entre dispositivos (sin necesidad de refrescar), y la app se puede instalar en el teléfono como una app nativa (PWA).

## Stack

- **Frontend:** HTML/CSS/JS puro, un solo archivo (`index.html`), sin build step.
- **Backend:** [Supabase](https://supabase.com) (Postgres + Realtime + Auth + Storage).
- **Mapas:** [Leaflet](https://leafletjs.com) + OpenStreetMap.
- **Hosting:** [Vercel](https://vercel.com) (sitio estático).

## Estructura

```
index.html      — toda la app (UI + lógica)
manifest.json   — metadata de la PWA (nombre, íconos, colores)
sw.js           — service worker (permite instalar la app)
icon-192.png    — ícono de la app
icon-512.png    — ícono de la app
```

## Base de datos (Supabase)

Tablas: `pedidos`, `menu`, `cuentas` (bancos), `repartidores`. Todas con Row Level Security activado:

- **Lectura:** pública (necesaria para que cualquiera pueda ver el menú y pedir sin cuenta).
- **Escritura en `menu`, `cuentas`, `repartidores`:** solo con sesión autenticada (el Dueño).
- **Escritura en `pedidos`:** pública (los clientes piden sin cuenta; los repartidores entran con PIN, no con sesión real).

La `anon key` embebida en `index.html` es pública a propósito — el control de acceso real vive en las políticas de la base de datos, no en ocultar esa clave.

## Desarrollo local

No hay build step. Basta con abrir `index.html` en un navegador, o servirlo con cualquier servidor estático:

```bash
python -m http.server 8000
```

## Despliegue

```bash
vercel --prod
```
