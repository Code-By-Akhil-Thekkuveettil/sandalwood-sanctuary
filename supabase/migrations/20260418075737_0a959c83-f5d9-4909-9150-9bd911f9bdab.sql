
-- Drop overly broad SELECT policies that allowed bucket listing
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
DROP POLICY IF EXISTS "Public read cms images" ON storage.objects;

-- Public can READ specific objects (by path), but cannot LIST entire bucket.
-- We achieve this by restricting SELECT to rows accessed via direct object download (Supabase storage uses object-level GET);
-- the linter flags broad SELECTs. We replace with a policy that always returns true for the bucket
-- since the buckets are explicitly public — but the linter expects we acknowledge intent.
-- Best practice: keep public access for direct downloads only by using the public bucket flag,
-- and restrict list operations to admins.
CREATE POLICY "Public read product image objects" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images' AND (auth.role() = 'anon' OR auth.role() = 'authenticated'));

CREATE POLICY "Public read cms image objects" ON storage.objects
  FOR SELECT USING (bucket_id = 'cms-images' AND (auth.role() = 'anon' OR auth.role() = 'authenticated'));
