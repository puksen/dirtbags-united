CREATE extension IF NOT EXISTS moddatetime WITH schema extensions;

CREATE TABLE IF NOT EXISTS crags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    parking_latitude DOUBLE PRECISION,
    parking_longitude DOUBLE PRECISION,
    approach_time INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT crags_lat_range CHECK (latitude BETWEEN -90 AND 90),
    CONSTRAINT crags_lng_range CHECK (longitude BETWEEN -180 AND 180),
    CONSTRAINT crags_parking_lat_range CHECK (parking_latitude IS NULL OR (parking_latitude BETWEEN -90 AND 90)),
    CONSTRAINT crags_parking_lng_range CHECK (parking_longitude IS NULL OR (parking_longitude BETWEEN -180 AND 180)),
    CONSTRAINT crags_approach_time_non_negative CHECK (approach_time IS NULL OR approach_time >= 0)
);

CREATE trigger crags_set_updated_at
  BEFORE UPDATE ON public.crags
  for each ROW
  EXECUTE FUNCTION extensions.moddatetime (updated_at);

CREATE index crags_lat_lng_idx ON public.crags (latitude, longitude);

ALTER TABLE public.crags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crags are viewable by everyone"
  ON public.crags
  FOR SELECT
  TO anon, authenticated
  USING (true);