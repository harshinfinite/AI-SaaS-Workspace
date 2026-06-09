import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';

const config: NextAuthConfig = {
  providers: [],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {},
};
const { handlers, auth, signIn, signOut } = NextAuth(config);

export { handlers, auth, signIn, signOut };
