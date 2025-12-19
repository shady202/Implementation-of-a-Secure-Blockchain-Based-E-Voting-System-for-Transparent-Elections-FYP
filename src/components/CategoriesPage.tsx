"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import { createCategory, getAllCategories } from "../lib/blockchain";

const apuLogo = "/apu-logo.png";

interface Category {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

interface CategoriesPageProps {
  onNavigate: (page: string) => void;
}

export function CategoriesPage({ onNavigate }: CategoriesPageProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  /* ================= LOAD ================= */

  const loadCategories = async () => {
    try {
      setLoading(true);
      const cats = await getAllCategories();
      setCategories(cats);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* ================= ADD ================= */

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setSubmitting(true);
      await createCategory(form.name, form.description);
      toast.success("Category created on blockchain");
      setForm({ name: "", description: "" });
      await loadCategories();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4 flex items-center gap-3">
          <img src={apuLogo} className="h-10" />
          <h2>Manage Categories</h2>
        </div>
      </header>

      <div className="container mx-auto px-6 py-10 max-w-4xl">
        <Button variant="ghost" onClick={() => onNavigate("admin")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* ADD CATEGORY */}
        <Card className="my-6">
          <CardHeader>
            <CardTitle>Add Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. President"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Category description"
                />
              </div>

              <Button type="submit" disabled={submitting}>
                <Plus className="h-4 w-4 mr-2" />
                {submitting ? "Adding..." : "Add Category"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* CATEGORY LIST */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-slate-600">No categories created yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.id}</TableCell>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
