import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { ArrowLeft, Plus, Pencil, Trash2, Save, X, RotateCcw } from "lucide-react";
import { UserNav } from "./UserNav";
import { AuthGuard } from "./AuthGuard";
import { toast } from "sonner";
import * as api from "../lib/api";
import { addCategoryOnChain } from "../lib/blockchain";
import { generateCategoryId } from "../lib/utils";

const apuLogo = "/apu-logo.png";

interface Category {
  id: string;
  name: string;
  description: string;
  maxVotes: number;
  isActive: boolean;
}

interface ManageCategoriesPageProps {
  onNavigate: (page: string) => void;
}

export function ManageCategoriesPage({ onNavigate }: ManageCategoriesPageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Omit<Category, "id">>({
    name: "",
    description: "",
    maxVotes: 1,
    isActive: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await api.getCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        maxVotes: category.maxVotes,
        isActive: category.isActive
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        description: "",
        maxVotes: 1,
        isActive: true
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (editingCategory) {
        // Update existing category
        await api.updateCategory(editingCategory.id, formData);
        toast.success("Category updated successfully");
      } else {
        // Create new category
        // CRITICAL: Add to Blockchain FIRST
        try {
          // Generate ID: "Student President" -> "student-president"
          const categoryId = generateCategoryId(formData.name);

          await addCategoryOnChain(
            categoryId,
            formData.name,
            formData.description,
            [] // Positions will be added dynamically when candidates are added
          );
        } catch (chainError: any) {
          console.error("Blockchain error:", chainError);
          
          // Check if it's a "Category ID already exists" error
          if (chainError?.message?.includes("Category ID already exists") || 
              chainError?.reason?.includes("Category ID already exists")) {
            toast.error("A category with this name already exists on the blockchain. Please choose a different name.");
            return; // Stop execution - don't save to DB
          }
          
          // For other blockchain errors, show generic message
          toast.error("Failed to add category to blockchain. Please try again.");
          return; // Stop execution - don't save to DB if blockchain fails
        }

        await api.addCategory(formData);
        toast.success("Category created successfully (Chain & DB)");
      }

      setDialogOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return;
    }

    try {
      await api.deleteCategory(id);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const handleToggleStatus = async (category: Category) => {
    try {
      const updatedCategory = { ...category, isActive: !category.isActive };
      await api.updateCategory(category.id, updatedCategory);

      // Update local state locally for immediate feedback
      setCategories(categories.map(c =>
        c.id === category.id ? updatedCategory : c
      ));

      toast.success(`Category ${updatedCategory.isActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error("Error updating category status:", error);
      toast.error("Failed to update status");
      // Revert on error
      fetchCategories();
    }
  };

  /*
  const handleResetDefaults = async () => {
    if (!confirm("This will reset categories to the default set (Student Council, Faculty Rep, Club President). Continue?")) {
      return;
    }

    try {
      // await api.resetCategories();
      toast.success("Categories reset to defaults");
      fetchCategories();
    } catch (error) {
      console.error("Error resetting categories:", error);
      toast.error("Failed to reset categories");
    }
  };
  */

  return (
    <AuthGuard requireAdmin={true} onNavigate={onNavigate}>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={apuLogo} alt="APU Logo" className="h-8 w-8" />
              <span className="text-slate-900 font-bold text-xl">Admin Dashboard</span>
            </div>
            <UserNav onNavigate={onNavigate} />
          </div>
        </header>

        <main className="flex-1 container mx-auto px-6 py-8">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('admin')}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Manage Voting Categories</h1>
              <p className="text-slate-600 mt-1">Configure the positions available for election</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Categories List</CardTitle>
              <CardDescription>
                Define the positions that candidates can run for.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-slate-500">Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <p className="text-slate-500 mb-4">No categories found.</p>
                  <Button onClick={() => handleOpenDialog()}>Create First Category</Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
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
                              checked={category.isActive}
                              onCheckedChange={() => handleToggleStatus(category)}
                            />
                          </TableCell>
                          <TableCell className="font-medium text-slate-900">
                            {category.name}
                          </TableCell>
                          <TableCell className="text-slate-600 max-w-xs truncate">
                            {category.description}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{category.maxVotes}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(category)}>
                                <Pencil className="h-4 w-4 text-slate-500" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
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
              <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
              <DialogDescription>
                Configure the details for this voting category.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Student Council President"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this role..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxVotes">Max Votes per Voter</Label>
                  <Input
                    id="maxVotes"
                    type="number"
                    min={1}
                    max={10}
                    value={formData.maxVotes}
                    onChange={(e) => setFormData({ ...formData, maxVotes: parseInt(e.target.value) || 1 })}
                    required
                  />
                  <p className="text-xs text-slate-500">How many candidates can a voter select?</p>
                </div>
                <div className="flex items-center justify-between pt-8">
                  <Label htmlFor="isActive" className="cursor-pointer">Active Status</Label>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingCategory ? "Save Changes" : "Create Category"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  );
}