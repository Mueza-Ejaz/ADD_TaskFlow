import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
    error: "/error", // Optional: A custom error page
  },
});

export const config = {
  matcher: ["/dashboard/:path*"], // Protect dashboard routes
};
