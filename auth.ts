import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import User from './server/models/User';
import connectDB from './server/db/mongoose';
import bcrypt from 'bcryptjs';
import { loginSchema } from './lib/validations/auth';

const config: NextAuthConfig = {
  providers: [
    Credentials({
      authorize: async function (credentials) {
        const result = loginSchema.safeParse(credentials);
        if (!result.success) return null;
        const { email, password } = result.data;
        await connectDB();
        const user = await User.findOne({ email });
        if (!user || !user.password) return null;
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
const { handlers, auth, signIn, signOut } = NextAuth(config);

export { handlers, auth, signIn, signOut };
