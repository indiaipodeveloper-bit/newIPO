
ALTER TABLE public.merchant_bankers
  ADD COLUMN total_raised NUMERIC DEFAULT 0,
  ADD COLUMN avg_size NUMERIC DEFAULT 0,
  ADD COLUMN avg_subscription NUMERIC DEFAULT 0;
