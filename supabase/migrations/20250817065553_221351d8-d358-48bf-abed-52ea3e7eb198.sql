-- Create emergency incidents table
CREATE TABLE public.incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('collision', 'breakdown', 'debris', 'fire', 'medical', 'other')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'responding', 'resolved')),
  location_name TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  description TEXT,
  responders_assigned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create emergency reports table
CREATE TABLE public.emergency_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE,
  reporter_name TEXT,
  reporter_phone TEXT,
  media_urls TEXT[],
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create responders table
CREATE TABLE public.responders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ambulance', 'police', 'fire', 'tow')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'en_route', 'on_scene', 'unavailable')),
  current_location_lat DECIMAL(10, 8),
  current_location_lng DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create control users table for authentication
CREATE TABLE public.control_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'operator' CHECK (role IN ('operator', 'supervisor', 'admin')),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.control_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public emergency reporting
CREATE POLICY "Anyone can view incidents" ON public.incidents FOR SELECT USING (true);
CREATE POLICY "Anyone can create incidents" ON public.incidents FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create emergency reports" ON public.emergency_reports FOR INSERT WITH CHECK (true);

-- Create policies for authenticated control center users
CREATE POLICY "Control users can manage incidents" ON public.incidents 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.control_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Control users can view reports" ON public.emergency_reports 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.control_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Control users can manage responders" ON public.responders 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.control_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Control users can manage their profile" ON public.control_users 
FOR ALL USING (user_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_incidents_updated_at
BEFORE UPDATE ON public.incidents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_responders_updated_at
BEFORE UPDATE ON public.responders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.incidents (type, severity, location_name, latitude, longitude, description, responders_assigned) VALUES
('collision', 'critical', 'Highway 1 Mile 45', 37.7749, -122.4194, 'Multi-vehicle collision blocking traffic', 3),
('breakdown', 'low', 'Highway 101 Mile 23', 37.7849, -122.4094, 'Vehicle breakdown in right lane', 1),
('debris', 'medium', 'Highway 280 Mile 67', 37.7649, -122.4294, 'Large debris in roadway', 2),
('medical', 'high', 'Highway 85 Mile 12', 37.7549, -122.4394, 'Medical emergency on roadside', 2);

INSERT INTO public.responders (name, type, status) VALUES
('Unit 101', 'ambulance', 'available'),
('Unit 102', 'ambulance', 'en_route'),
('Unit 201', 'police', 'on_scene'),
('Unit 202', 'police', 'available'),
('Unit 301', 'fire', 'available'),
('Unit 401', 'tow', 'en_route');

-- Enable realtime for incidents table
ALTER TABLE public.incidents REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.incidents;