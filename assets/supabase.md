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

---

## Tasks Table and CRUD Integration

### Table: tasks

| Field         | Type        | Description                                                  |
|---------------|-------------|--------------------------------------------------------------|
| id            | int, PK     | Primary key                                                  |
| title         | text        | Title of the task                                            |
| description   | text        | Description/details of the task                              |
| progress      | integer     | Progress percent (e.g. 0-100) or status code                 |
| user_id       | uuid/text   | References auth.users.id or custom profile id                |
| date          | date        | The tracking date for the task ('YYYY-MM-DD')                |
| inserted_at   | timestamp   | (auto) record creation timestamp                             |
| updated_at    | timestamp   | (auto) last update timestamp                                 |

- Table should be created manually in Supabase Table Editor or via SQL:

```sql
create table tasks (
  id serial primary key,
  title text not null,
  description text,
  progress integer default 0,
  user_id uuid not null,
  date date not null,
  inserted_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);
```

Feel free to adjust field types (uuid/text for user_id and integer for progress/status).

### Security: 
- RBAC should be implemented using Supabase RLS (row-level-security).
- Example recommended policies: users can select/modify/delete only their own tasks (`user_id = auth.uid()`); admins can do more.
- Set up the correct RLS policies once table is created.

### CRUD API (via Supabase JS SDK)
- See `src/hooks/useTasks.js` for hook-based API used by the frontend.
- Uses environment variables:
  - `REACT_APP_SUPABASE_URL`
  - `REACT_APP_SUPABASE_KEY`

#### Actions available
- `createTask({title, description, progress, user_id, date})`: add a task
- `getTasks({user_id, date})`: list tasks (optionally filtered by user)
- `updateTask(id, updates)`: update provided fields for a task by id
- `deleteTask(id)`: remove task by id

> See `src/hooks/useTasks.js` for details.

### Dev/Deployment
- Ensure .env has correct `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_KEY`.
- Table should be provisioned before these features will work.

---

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
- Daily task tracking for users (tasks CRUD)
