-- Row Level Security Policies para adventure_packs
-- Estas políticas permiten a los usuarios gestionar sus propias aventuras

-- 1. Habilitar RLS en la tabla (si no está habilitado)
ALTER TABLE adventure_packs ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes si las hay (para evitar conflictos)
DROP POLICY IF EXISTS "Users can view their own adventure packs" ON adventure_packs;
DROP POLICY IF EXISTS "Users can insert their own adventure packs" ON adventure_packs;
DROP POLICY IF EXISTS "Users can update their own adventure packs" ON adventure_packs;
DROP POLICY IF EXISTS "Users can delete their own adventure packs" ON adventure_packs;

-- 3. Crear políticas para SELECT (leer)
CREATE POLICY "Users can view their own adventure packs"
  ON adventure_packs
  FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Crear políticas para INSERT (crear)
CREATE POLICY "Users can insert their own adventure packs"
  ON adventure_packs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Crear políticas para UPDATE (actualizar)
CREATE POLICY "Users can update their own adventure packs"
  ON adventure_packs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Crear políticas para DELETE (eliminar) - ESTO ES LO QUE FALTA
CREATE POLICY "Users can delete their own adventure packs"
  ON adventure_packs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Verificar las políticas creadas
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'adventure_packs'
ORDER BY cmd, policyname;
