-- Fix function search path by making it immutable
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add missing RLS policies for tables without them
-- First, check what tables need policies by creating policies for public access where appropriate

-- For products table - allow public read access, admin write access
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);

-- For categories table - allow public read access
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);

-- For flash_sales table - allow public read access  
CREATE POLICY "Anyone can view flash sales" ON public.flash_sales FOR SELECT USING (true);

-- For payments table - allow public insert for payment processing
CREATE POLICY "Allow payment insertion" ON public.payments FOR INSERT WITH CHECK (true);

-- For orders table - allow users to insert their own orders
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- For order_items table - allow insert during order creation
CREATE POLICY "Allow order items insertion" ON public.order_items FOR INSERT WITH CHECK (true);