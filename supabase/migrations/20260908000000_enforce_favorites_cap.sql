-- M3: move the free-tier favorites cap into the database.
-- On a static host the client writes favorites directly (RLS-okd), so the old
-- server-side cap (src/lib/favorites.functions.ts in the current app) must be
-- enforced by the DB instead. Non-pro users cannot exceed 10 saved recipes.

CREATE OR REPLACE FUNCTION public.enforce_favorites_cap()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_pro boolean;
  fav_count integer;
BEGIN
  SELECT p.is_pro INTO is_pro FROM public.profiles p WHERE p.id = NEW.user_id;
  IF NOT COALESCE(is_pro, false) THEN
    SELECT count(*) INTO fav_count FROM public.favorites WHERE user_id = NEW.user_id;
    IF fav_count >= 10 THEN
      RAISE EXCEPTION 'Free tier limit reached (10 recipes)'
        USING ERRCODE = 'P0001';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.enforce_favorites_cap() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS enforce_favorites_cap ON public.favorites;
CREATE TRIGGER enforce_favorites_cap
BEFORE INSERT ON public.favorites
FOR EACH ROW EXECUTE FUNCTION public.enforce_favorites_cap();