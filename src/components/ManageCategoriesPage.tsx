import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { ArrowLeft, Pencil } from "lucide-react";
import { UserNav } from "./UserNav";
import { AuthGuard } from "./AuthGuard";
import { toast } from "sonner";
import * as api from "../lib/api";

// لو إنت متأكد إن السمارٹ كونتراكت بتاعك بقى Dynamic IDs (مش cat1/cat2/cat3)
// يبقى بلاش نلمس blockchain categories من هنا دلوقتي.
// لو عايز تفعلها تاني بعدين، ابعتلي blockchain.ts وأنا أظبطه.
// import { addCategoryOnChain, removeCategoryOnChain } from "../lib/blockchain";

const apuLogo = "/apu-logo.png";

interface Category {
  id: string; // UUID من DB
  election_id?: string; // UUID (لو بيرجع)
  slug: string; // president / vice-president / secretary
  category_name: string; // display name
  description?: string;
  max_votes: number;
  is_active: boolean;
  created_at?: string;
}

interface ManageCategoriesPageProps {
  onNavigate: (page: string) => void;
}

export function ManageCategoriesPage({
  onNavigate,
}: ManageCategoriesPageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState<{
    category_name: string;
    description: string;
    max_votes: number;
  }>({
    category_name: "",
    description: "",
    max_votes: 1,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await api.getCategories();

      const dbCats: Category[] = data.categories || [];

      // ترتيب بسيط (حسب created_at إن وجد، وإلا حسب الاسم)
      const sorted = [...dbCats].sort((a, b) => {
        const da = a.created_at ? new Date(a.created_at).getTime() : 0;
        const db = b.created_at ? new Date(b.created_at).getTime() : 0;
        if (da !== db) return da - db;
        return (a.category_name || "").localeCompare(b.category_name || "");
      });

      setCategories(sorted);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to load categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      category_name: category.category_name || "",
      description: category.description || "",
      max_votes: category.max_votes ?? 1,
    });
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const name = formData.category_name.trim();
    if (!name) {
      toast.error("Category name is required.");
      return;
    }

    try {
      // ✅ DB update باستخدام UUID الحقيقي
      await api.updateCategory(editingCategory.id, {
        name,
        description: formData.description || "",
        maxVotes: formData.max_votes,
        isActive: editingCategory.is_active,
      });

      // ⚠️ Blockchain calls مؤقتًا OFF عشان dynamic contract
      // لو انت لسه على نظام cat1/cat2/cat3 قولّي وأنا أرجعهم صح.
      // await addCategoryOnChain(editingCategory.slug, name, formData.description || "", [name]);

      toast.success("Category updated (DB)");
      setDialogOpen(false);
      setEditingCategory(null);
      await fetchCategories();
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err?.reason || err?.message || "Failed to update category");
    }
  };

  const handleToggleStatus = async (category: Category) => {
    const nextActive = !category.is_active;

    try {
      await api.updateCategory(category.id, {
        name: category.category_name,
        description: category.description || "",
        maxVotes: category.max_votes,
        isActive: nextActive,
      });

      // ⚠️ Blockchain calls مؤقتًا OFF
      // if (!nextActive) await removeCategoryOnChain(category.slug);
      // else await addCategoryOnChain(category.slug, category.category_name, category.description || "", [category.category_name]);

      setCategories((prev) =>
        prev.map((c) =>
          c.id === category.id ? { ...c, is_active: nextActive } : c
        )
      );

      toast.success(
        `Category ${nextActive ? "activated" : "deactivated"} (DB)`
      );
    } catch (err: any) {
      console.error("Toggle error:", err);
      toast.error(err?.reason || err?.message || "Failed to update status");
      fetchCategories();
    }
  };

  return (
    <AuthGuard requireAdmin={true} onNavigate={onNavigate}>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={apuLogo} alt="APU Logo" className="h-8 w-8" />
              <span className="text-slate-900 font-bold text-xl">
                Admin Dashboard
              </span>
            </div>
            <UserNav onNavigate={onNavigate} />
          </div>
        </header>

        <main className="flex-1 container mx-auto px-6 py-8">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("admin")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Manage Voting Categories
              </h1>
              <p className="text-slate-600 mt-1">
                Dynamic categories from DB (UUID id + slug). Toggle active
                status and edit details.
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                These categories are tied to the active election in DB.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-slate-500">Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No categories found for the active election.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Max Votes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>
                            <Switch
                              checked={category.is_active}
                              onCheckedChange={() =>
                                handleToggleStatus(category)
                              }
                            />
                          </TableCell>

                          <TableCell className="font-mono text-slate-700">
                            {category.slug}
                          </TableCell>

                          <TableCell className="font-medium text-slate-900">
                            {category.category_name}
                          </TableCell>

                          <TableCell className="text-slate-600 max-w-xs truncate">
                            {category.description || (
                              <span className="text-slate-400">—</span>
                            )}
                          </TableCell>

                          <TableCell>
                            <Badge variant="secondary">
                              {category.max_votes}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEdit(category)}
                            >
                              <Pencil className="h-4 w-4 text-slate-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Editing category details in DB (UUID-based).
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={editingCategory?.slug || ""} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.category_name}
                  onChange={(e) =>
                    setFormData({ ...formData, category_name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxVotes">Max Votes per Voter</Label>
                <Input
                  id="maxVotes"
                  type="number"
                  min={1}
                  max={10}
                  value={formData.max_votes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_votes: parseInt(e.target.value) || 1,
                    })
                  }
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  );
}
