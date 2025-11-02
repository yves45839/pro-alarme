import { withAuth } from 'next-auth/middleware';

export default withAuth(
  () => {
    // No-op: authorization handled via callback below.
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token),
    },
    pages: {
      signIn: '/login',
    },
  },
);

export const config = {
  matcher: ['/dashboard/:path*'],
};
