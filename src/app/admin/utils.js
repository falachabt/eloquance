import { supabseAdmin } from "../../../lib/supabase"

export const createAdmins = async () => {
  const users = [
    { email: 'admin1@comete.com', password: 'CometeAdmin123!' },
    { email: 'admin2@comete.com', password: 'CometeAdmin456!' },
    { email: 'admin3@comete.com', password: 'CometeAdmin789!' },
    { email: 'admin4@comete.com', password: 'CometeAdmin321!' },
    { email: 'admin5@comete.com', password: 'CometeAdmin654!' }
  ];

  for (const user of users) {
    const { user: createdUser, error } = await supabseAdmin.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { role: 'admin', permissions: ['read', 'write', 'delete'] }
    });

    if (error) {
      console.error('Error creating user:', error);
    } else {
      console.log('User created:', createdUser);
    }
  }
};

