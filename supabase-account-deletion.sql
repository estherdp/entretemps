-- Borrado de cuenta por el propio usuario
-- Ejecutar en Supabase -> SQL Editor (después de supabase-ai-generations-setup.sql)
--
-- SECURITY DEFINER permite borrar la fila de auth.users sin exponer la
-- service role key al cliente. La función solo actúa sobre auth.uid(),
-- así que cada usuario únicamente puede borrar su propia cuenta.

CREATE OR REPLACE FUNCTION public.delete_my_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  current_user_id UUID := auth.uid();
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'No autenticado';
  END IF;

  DELETE FROM public.adventure_packs WHERE user_id = current_user_id;
  DELETE FROM public.ai_generations WHERE user_id = current_user_id;
  DELETE FROM auth.users WHERE id = current_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_my_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_my_account() TO authenticated;
