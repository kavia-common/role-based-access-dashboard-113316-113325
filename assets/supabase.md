# Supabase Configuration for RBAC Team Dashboard

## Database Schema Requirements

### Profiles Table
The application requires a `profiles` table to store user role information linked to Supabase auth.users:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'guest')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update user roles
CREATE POLICY "Admins can update user roles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow profile creation on signup (handled by trigger)
CREATE POLICY "Allow profile creation" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Auto-create Profile Trigger
Set up a trigger to automatically create a profile when a user signs up:

```sql
-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Authentication Configuration

### Email Settings
- Enable email confirmation for new signups
- Configure email templates for signup confirmation and password reset
- Set up redirect URLs for authentication callbacks

### Security Settings
- Enable Row Level Security (RLS) on all tables
- Configure appropriate policies for role-based access
- Set session timeout as needed

## Environment Variables Required

The React application expects these environment variables:
- `REACT_APP_SUPABASE_URL`: Your Supabase project URL
- `REACT_APP_SUPABASE_KEY`: Your Supabase anon public key
- `REACT_APP_SITE_URL`: Site URL for email redirects (will be set by deployment)

## Initial Admin User

To create the first admin user:
1. Sign up through the application interface
2. Manually update the role in the profiles table:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = '<user-uuid>';
   ```

## Features Supported

- User registration and login
- Email confirmation workflow
- Password reset functionality
- Role-based access control (admin, user, guest)
- Session management
- Profile management with roles
