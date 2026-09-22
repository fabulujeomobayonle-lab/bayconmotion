import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const isAdmin = localStorage.getItem("baycon_admin") === "authenticated";
    if (!isAdmin) {
      throw redirect({ to: "/auth" });
    }
  },
  component: () => <Outlet />,
});