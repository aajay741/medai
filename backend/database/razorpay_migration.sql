-- Razorpay Integration Migration
-- Run this once on the production database

ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS razorpay_order_id   VARCHAR(100) NULL AFTER payment_status,
    ADD COLUMN IF NOT EXISTS razorpay_payment_id  VARCHAR(100) NULL AFTER razorpay_order_id;

-- Index for fast lookup by payment id
CREATE INDEX IF NOT EXISTS idx_razorpay_payment_id ON bookings (razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_razorpay_order_id   ON bookings (razorpay_order_id);
