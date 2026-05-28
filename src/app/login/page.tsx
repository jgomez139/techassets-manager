"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();

    try {

      setLoading(true);

      setError("");

      const res = await fetch(
        "/api/auth/login",
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        setError(
          data.error ||
            "Error iniciando sesión"
        );

        return;
      }

      router.push(
        "/dashboard"
      );

      router.refresh();

    } catch (error) {

      console.error(error);

      setError(
        "Ocurrió un error"
      );

    } finally {

      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <h1 className="mb-2 text-center text-3xl font-bold">

          Iniciar sesión

        </h1>

        <p className="mb-6 text-center text-gray-500">

          Bienvenido nuevamente

        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          {/* Email */}

          <div>

            <label className="mb-1 block text-sm font-medium">

              Correo

            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              placeholder="correo@email.com"
            />

          </div>

          {/* Password */}

          <div>

            <label className="mb-1 block text-sm font-medium">

              Contraseña

            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              placeholder="********"
            />

          </div>

          {/* Error */}

          {error && (

            <div className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-600">

              {error}

            </div>
          )}

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black py-3 text-white transition hover:bg-gray-800 disabled:opacity-50"
          >

            {loading
              ? "Ingresando..."
              : "Ingresar"}

          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-500">

          ¿No tienes cuenta?{" "}

          <Link
            href="/register"
            className="font-semibold text-black"
          >

            Regístrate

          </Link>

        </p>

      </div>

    </main>
  );
}
