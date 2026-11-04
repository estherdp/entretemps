-- Registro de generaciones de IA por usuario (cuota diaria)
-- Ejecutar en Supabase -> SQL Editor

CREATE TABLE IF NOT EXISTS ai_generations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('adventure', 'mission')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_generations_user_kind_created
  ON ai_generations (user_id, kind, created_at DESC);

ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own generations" ON ai_generations;
DROP POLICY IF EXISTS "Users can insert their own generations" ON ai_generations;

-- Solo lectura e inserción propias. Sin UPDATE ni DELETE:
-- un usuario no puede borrar registros para reiniciar su cuota.
CREATE POLICY "Users can view their own generations"
  ON ai_generations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generations"
  ON ai_generations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
