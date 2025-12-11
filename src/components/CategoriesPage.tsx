import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { ArrowLeft, Loader2, Plus, Trash2, Pencil, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import * as api from "../lib/api";
import * as blockchain from "../lib/blockchain";
const apuLogo = "/apu-logo.png";

interface Category {
  id: string;
  name: string;
  description: string;
  maxVotes: number;
  isActive: boolean;
}

interface CategoriesPageProps {
  onNavigate: (page: string) => void;
}

const MAX_CATEGORIES = 3;

export function CategoriesPage({ onNavigate }: CategoriesPageProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxVotes: 1,
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.getCategories();
      if (response && response.categories) {
        setCategories(response.categories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Category name is required.";
    }

    if (formData.maxVotes < 1) {
      errors.maxVotes = "Maximum votes must be at least 1.";
    }

    if (!showEditModal && categories.length >= MAX_CATEGORIES) {
      errors.general = "You cannot create more than 3 categories.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Generate a unique ID for the category
      const categoryId = formData.name.toLowerCase().replace(/\s+/g, '-');

      // For positions, use the category name as a single position
      // This can be expanded later to allow multiple positions per category
      const positions = [formData.name];

      // CRITICAL: Add category to BLOCKCHAIN first
      await blockchain.addCategoryOnChain(
        categoryId,
        formData.name,
        formData.description,
        positions
      );

      // Then save to database
      await api.addCategory({
        name: formData.name,
        description: formData.description,
        maxVotes: formData.maxVotes,
        isActive: formData.isActive,
      });

      toast.success("Category added to Blockchain and Database!");
      resetForm();
      setShowAddModal(false);
      fetchCategories(); // Refresh list
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedCategory) return;

    setSubmitting(true);
    try {
      await api.updateCategory(selectedCategory.id, {
        name: formData.name,
        description: formData.description,
        maxVotes: formData.maxVotes,
        isActive: formData.isActive,
      });

      toast.success("Category updated successfully.");
      resetForm();
      setShowEditModal(false);
      fetchCategories(); // Refresh list
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await api.deleteCategory(selectedCategory.id);
      toast.success("Category deleted.");
      setShowDeleteDialog(false);
      setSelectedCategory(null);
      fetchCategories(); // Refresh list
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const handleToggleActive = async (categoryId: string, isActive: boolean) => {
    // Optimistic update
    const previousCategories = [...categories];
    const updated = categories.map(cat =>
      cat.id === categoryId ? { ...cat, isActive } : cat
    );
    setCategories(updated);

    try {
      // Find the category to get other details
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        await api.updateCategory(categoryId, {
          name: category.name,
          description: category.description,
          maxVotes: category.maxVotes,
          isActive: isActive
        });
        toast.success("Changes saved successfully.");
      }
    } catch (error) {
      console.error("Error updating category status:", error);
      toast.error("Failed to update status");
      setCategories(previousCategories); // Revert on error
    }
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      maxVotes: category.maxVotes,
      isActive: category.isActive,
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      maxVotes: 1,
      isActive: true,
    });
    setFormErrors({});
    setSelectedCategory(null);
  };

  const canAddCategory = categories.length < MAX_CATEGORIES;
  const hasActiveCategories = categories.some(c => c.isActive);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <img src={apuLogo} alt="APU Logo" className="h-10 w-10" />
            <h2 className="text-slate-900">APU Vote - Admin Panel</h2>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-12 px-6">
        <div className="flex flex-col max-w-4xl mx-auto">
          <div className="w-full mb-8">
            <div className="mb-4">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1"
                onClick={() => onNavigate('admin')}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Admin
              </Button>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <img src={apuLogo} alt="Asia Pacific University Logo" className="h-10 w-auto" />
              <h1 className="text-slate-900">Voting Categories</h1>
            </div>
            <p className="text-slate-600">Manage voting categories and positions for APU VOTE elections</p>
          </div>

          {/* Main Categories Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Voting Categories</CardTitle>
                  <CardDescription>Manage voting categories and positions</CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button
                    onClick={() => {
                      resetForm();
                      setShowAddModal(true);
                    }}
                    disabled={!canAddCategory}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                  {!canAddCategory && (
                    <p className="text-slate-600 text-right">
                      Limit reached: You can only create up to 3 categories.
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8 text-slate-600">
                  No voting categories found. Add your first category using the button above.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Max Votes Allowed</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="text-slate-900">{category.name}</TableCell>
                        <TableCell className="text-slate-600">{category.description}</TableCell>
                        <TableCell className="text-slate-600">{category.maxVotes}</TableCell>
                        <TableCell>
                          <Badge
                            variant={category.isActive ? "default" : "secondary"}
                            className={category.isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200" : ""}
                          >
                            {category.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(category)}
                            >
                              <Pencil className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteDialog(category)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Current Election Setup */}
          <Card>
            <CardHeader>
              <CardTitle>Current Election Setup</CardTitle>
              <CardDescription>Select which categories are active for the current election</CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="text-center py-8 text-slate-600">
                  No categories available. Please add categories first.
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white">
                        <div className="flex items-center gap-3 flex-1">
                          {category.isActive && (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          )}
                          <div>
                            <p className="text-slate-900">{category.name}</p>
                            <p className="text-slate-600">{category.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-600">
                            {category.isActive ? "Active" : "Inactive"}
                          </span>
                          <Switch
                            checked={category.isActive}
                            onCheckedChange={(checked: boolean) => handleToggleActive(category.id, checked)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {!hasActiveCategories && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-amber-900">You must activate at least one category for the election.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Category Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <form onSubmit={handleAddCategory}>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>Create a new voting position for this election.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {formErrors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
                  {formErrors.general}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., President"
                />
                {formErrors.name && <p className="text-sm text-red-600">{formErrors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this position"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxVotes">Maximum Votes Allowed</Label>
                <Input
                  id="maxVotes"
                  type="number"
                  min="1"
                  value={formData.maxVotes}
                  onChange={(e) => setFormData({ ...formData, maxVotes: parseInt(e.target.value) || 1 })}
                />
                {formErrors.maxVotes && <p className="text-sm text-red-600">{formErrors.maxVotes}</p>}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active in current election</Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <form onSubmit={handleEditCategory}>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Update the category details.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Category Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., President"
                />
                {formErrors.name && <p className="text-sm text-red-600">{formErrors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this position"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-maxVotes">Maximum Votes Allowed</Label>
                <Input
                  id="edit-maxVotes"
                  type="number"
                  min="1"
                  value={formData.maxVotes}
                  onChange={(e) => setFormData({ ...formData, maxVotes: parseInt(e.target.value) || 1 })}
                />
                {formErrors.maxVotes && <p className="text-sm text-red-600">{formErrors.maxVotes}</p>}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-isActive">Active in current election</Label>
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
