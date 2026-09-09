-- Fresh-project bootstrap for Pantry to Store.
-- Combined from the current app's migration set + the M3 favorites-cap trigger.
-- Apply ONCE in the new project via Dashboard > SQL Editor > Run.

-- =========================================================
-- 1. profiles
-- =========================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_pro BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- =========================================================
-- 2. favorites
-- =========================================================
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id INTEGER NOT NULL,
  recipe JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, recipe_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own favorites" ON public.favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own favorites" ON public.favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete own favorites" ON public.favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =========================================================
-- 3. auto-create profile on signup
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- =========================================================
-- 4. is_pro is admin-only (a user cannot self-promote)
-- =========================================================
CREATE OR REPLACE FUNCTION public.prevent_is_pro_self_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_pro IS DISTINCT FROM OLD.is_pro THEN
    NEW.is_pro := OLD.is_pro;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER prevent_is_pro_self_update_trg
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_is_pro_self_update();
REVOKE EXECUTE ON FUNCTION public.prevent_is_pro_self_update() FROM PUBLIC, anon, authenticated;
REVOKE UPDATE (is_pro) ON public.profiles FROM authenticated, anon;
REVOKE UPDATE (is_pro) ON public.profiles FROM service_role;

-- =========================================================
-- 5. food log (content-tracking parity with current app)
-- =========================================================
CREATE TABLE public.food_log_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  recipe_id integer,
  recipe_title text NOT NULL,
  recipe_image text,
  eaten_on date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  amount numeric NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'servings',
  servings_multiplier numeric NOT NULL DEFAULT 1,
  calories numeric NOT NULL DEFAULT 0,
  protein numeric NOT NULL DEFAULT 0,
  carbs numeric NOT NULL DEFAULT 0,
  fat numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.food_log_entries TO authenticated;
GRANT ALL ON public.food_log_entries TO service_role;
ALTER TABLE public.food_log_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own log entries"
  ON public.food_log_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "insert own log entries"
  ON public.food_log_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own log entries"
  ON public.food_log_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete own log entries"
  ON public.food_log_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
CREATE INDEX food_log_entries_user_date_idx
  ON public.food_log_entries (user_id, eaten_on DESC);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER update_food_log_entries_updated_at
  BEFORE UPDATE ON public.food_log_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- 6. favorites cap: free tier = 10 (M3, DB-enforced)
-- =========================================================
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
CREATE TRIGGER enforce_favorites_cap
BEFORE INSERT ON public.favorites
FOR EACH ROW EXECUTE FUNCTION public.enforce_favorites_cap();