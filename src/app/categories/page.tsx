"use client";

import { useEffect, useState } from "react";

import CategoryForm from "@/components/categories/category-form";
import CategoryTable from "@/components/categories/category-table";

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function CategoriesPage() {

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  async function getCategories() {

    const res = await fetch(
      "/api/categories"
    );

    const data = await res.json();

    setCategories(data);
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div>

      <h1 className="mb-6 text-3xl font-bold">
        Categorías
      </h1>

      <CategoryForm
        onSaved={getCategories}
        editingCategory={editingCategory}
        clearEditing={() =>
          setEditingCategory(null)
        }
      />

      <CategoryTable
        categories={categories}
        onDeleted={getCategories}
        onEdit={setEditingCategory}
      />

    </div>
  );
}