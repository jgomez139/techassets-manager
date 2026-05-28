"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";

export default function RegisterPage() {

  const router =
    useRouter();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleRegister(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();

    try {

      setLoading(true);

      const res =
        await fetch(
          "/api/auth/register",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name,
              email,
              password,
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        alert(
          data.error ||
            "Error registrando usuario"
        );

        return;
      }

      alert(
        "Usuario registrado correctamente"
      );

      router.push("/login");

    } catch (error) {

      console.error(error);

      alert(
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

          Crear cuenta

        </h1>

        <p className="mb-6 text-center text-gray-500">

          Regístrate en TechAssets Manager

        </p>

        <form
          onSubmit={
            handleRegister
          }
          className="space-y-4"
        >

          <div>

            <label className="mb-1 block text-sm font-medium">

              Nombre

            </label>

            <input
              type="text"
              required
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              placeholder="Tu nombre"
            />

          </div>

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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black py-3 text-white transition hover:bg-gray-800 disabled:opacity-50"
          >

            {loading
              ? "Registrando..."
              : "Registrarse"}

          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-500">

          ¿Ya tienes cuenta?{" "}

          <Link
            href="/login"
            className="font-semibold text-black"
          >

            Inicia sesión

          </Link>

        </p>

      </div>

    </main>
  );
}