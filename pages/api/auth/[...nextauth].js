import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'

const scopes = ['identify', 'email']
let activeUsersCount = 1;

export const incrementActiveUsersCount = () => {
  activeUsersCount += 1;
};

export const decrementActiveUsersCount = () => {
  if (activeUsersCount > 0) {
    activeUsersCount -= 1;
  }
};

export const getActiveUsersCount = () => {
  return activeUsersCount;
};
export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
      authorization: {params: {scope: scopes.join(' ')}},
    }),
  ],
  callbacks: {
     signIn() {
      incrementActiveUsersCount();
      return true;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
      activeUsersCount: getActiveUsersCount(),
    }),
    signOut() {
      decrementActiveUsersCount();
      return true;
    },
  },
})

