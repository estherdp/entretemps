-- supabase-image-cache-setup.sql
-- Configuración de tabla para caché de búsquedas de imágenes (Pexels, etc.)

-- Crear tabla image_cache
CREATE TABLE IF NOT EXISTS image_cache (
  query TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  photographer TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas por fecha (optimiza limpieza de caché expirada)
CREATE INDEX IF NOT EXISTS idx_image_cache_created_at ON image_cache(created_at);

-- Comentarios para documentación
COMMENT ON TABLE image_cache IS 'Caché de búsquedas de imágenes para reducir llamadas a APIs externas';
COMMENT ON COLUMN image_cache.query IS 'Query de búsqueda usada (clave primaria)';
COMMENT ON COLUMN image_cache.url IS 'URL de la imagen encontrada';
COMMENT ON COLUMN image_cache.photographer IS 'Nombre del fotógrafo (para atribución)';
COMMENT ON COLUMN image_cache.source_url IS 'URL de la página original de la foto';
COMMENT ON COLUMN image_cache.created_at IS 'Timestamp de creación (para expiración de caché)';

-- Habilitar Row Level Security (RLS)
ALTER TABLE image_cache ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer (la caché es pública)
CREATE POLICY "image_cache_select_policy" ON image_cache
  FOR SELECT
  USING (true);

-- Política: Solo servicio puede escribir (server-side only)
-- NOTA: Ajustar según tus necesidades de seguridad
CREATE POLICY "image_cache_insert_policy" ON image_cache
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "image_cache_update_policy" ON image_cache
  FOR UPDATE
  USING (true);

CREATE POLICY "image_cache_delete_policy" ON image_cache
  FOR DELETE
  USING (true);
