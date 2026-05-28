"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {

  const router = useRouter();

  async function handleLogout() {

    try {

      await fetch(
        "/api/auth/logout",
        {
          method: "POST",

          credentials: "include",
        }
      );

      router.push("/login");

      router.refresh();

    } catch (error) {

      console.error(error);

      alert(
        "Error cerrando sesión"
      );
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600"
    >

      Cerrar sesión

    </button>
  );
}