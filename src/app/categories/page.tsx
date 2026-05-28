"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import CategoryForm from "@/components/categories/category-form";

import CategoryTable from "@/components/categories/category-table";


interface Category {
  id: string;

  name: string;

  description?: string;
}

export default function CategoriesPage() {

  const router =
    useRouter();

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [unauthorized, setUnauthorized] =
    useState(false);

  const [
    editingCategory,
    setEditingCategory,
  ] = useState<Category | null>(
    null
  );


  async function getCategories() {

    try {

      setLoading(true);

      const res = await fetch(
        "/api/categories",
        {
          credentials:
            "include",
        }
      );

      // =========================
      // PROTECCIÓN REAL
      // =========================

      if (
        res.status === 401
      ) {

        router.push("/login");

        return;
      }

      if (
        res.status === 403
      ) {

        setUnauthorized(
          true
        );

        return;
      }

      const data =
        await res.json();

      // Evita errores si API devuelve objeto
      if (
        !Array.isArray(data)
      ) {

        setCategories([]);

        return;
      }

      setCategories(data);

    } catch (error) {

      console.error(error);

      setCategories([]);

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {

    getCategories();

  }, []);


  // =========================
  // SIN PERMISOS
  // =========================

  if (unauthorized) {

    return (
      <div className="flex h-[60vh] items-center justify-center">

        <div className="rounded-2xl bg-white p-10 shadow">

          <h1 className="mb-3 text-3xl font-bold text-red-600">

            Acceso denegado

          </h1>

          <p className="text-gray-600">

            No tienes permisos para acceder
            a categorías.

          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="space-y-6">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">

          Categorías

        </h1>

        <p className="text-gray-500">

          Gestión de categorías de activos

        </p>

      </div>

      {/* Form */}

      <CategoryForm
        onSaved={
          getCategories
        }
        editingCategory={
          editingCategory
        }
        clearEditing={() =>
          setEditingCategory(
            null
          )
        }
      />

      {/* Tabla */}

      <div className="rounded-2xl bg-white p-6 shadow">

        {loading ? (

          <div className="py-10 text-center">

            <p>
              Cargando categorías...
            </p>

          </div>

        ) : categories.length ===
          0 ? (

          <div className="py-10 text-center">

            <h3 className="text-lg font-semibold">

              No hay categorías

            </h3>

            <p className="text-gray-500">

              Crea una nueva categoría

            </p>

          </div>

        ) : (

          <CategoryTable
            categories={
              categories
            }
            onDeleted={
              getCategories
            }
            onEdit={
              setEditingCategory
            }
          />

        )}

      </div>

    </div>
  );
}