-- ============================================================
-- Bodega SC — Migración de base de datos (Supabase)
-- ============================================================
-- Cómo aplicarla:
--   1. Entrá a tu proyecto en https://supabase.com
--   2. Menú lateral → "SQL Editor" → "New query"
--   3. Pegá TODO este archivo y presioná "Run"
--
-- Es segura de ejecutar más de una vez (usa IF NOT EXISTS).
-- ============================================================

-- 1) Congelar los importes de cada pedido al momento de la compra.
--    Antes el total se recalculaba con el costo de envío ACTUAL, así que
--    cambiar el envío alteraba los totales históricos de los reportes.
--    Con estas columnas, cada pedido guarda su subtotal/envío/total reales.
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS subtotal numeric;
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS envio    numeric;
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS total    numeric;

-- 2) Asegurar que la fecha del pedido se complete sola si la app no la envía.
--    (La app ya manda 'ts', esto es solo un respaldo a nivel de base.)
ALTER TABLE public.pedidos ALTER COLUMN ts SET DEFAULT now();

-- ============================================================
-- Nota: la app funciona aunque NO corras esta migración (hace un
-- reintento compatible). Pero hasta aplicarla, los pedidos nuevos
-- no guardarán subtotal/envío/total y los reportes los recalcularán.
-- ============================================================
