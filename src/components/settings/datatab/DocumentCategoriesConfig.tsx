
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit2, Plus, Trash2 } from "lucide-react";

interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  fileTypes: string[];
  color: string;
}

const DocumentCategoriesConfig = () => {
  const [categories, setCategories] = useState<DocumentCategory[]>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DocumentCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<DocumentCategory | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    fileTypes: ['pdf'],
    color: '#3b82f6'
  });

  const availableFileTypes = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'mp4', 'avi', 'mp3', 'wav'];
  const availableColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  const handleEdit = (category: DocumentCategory) => {
    setEditingCategory({ ...category });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id ? editingCategory : c
      ));
      setIsEditModalOpen(false);
      setEditingCategory(null);
    }
  };

  const handleAdd = () => {
    const id = (categories.length + 1).toString();
    setCategories([...categories, { ...newCategory, id }]);
    setNewCategory({
      name: '',
      description: '',
      fileTypes: ['pdf'],
      color: '#3b82f6'
    });
    setIsAddModalOpen(false);
  };

  const handleDeleteClick = (category: DocumentCategory) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingCategory) {
      setCategories(categories.filter(c => c.id !== deletingCategory.id));
      setIsDeleteModalOpen(false);
      setDeletingCategory(null);
    }
  };

  const handleFileTypeChange = (fileType: string, checked: boolean, isEditing: boolean) => {
    if (isEditing && editingCategory) {
      const updatedFileTypes = checked 
        ? [...editingCategory.fileTypes, fileType]
        : editingCategory.fileTypes.filter(ft => ft !== fileType);
      
      setEditingCategory({ ...editingCategory, fileTypes: updatedFileTypes });
    } else {
      const updatedFileTypes = checked 
        ? [...newCategory.fileTypes, fileType]
        : newCategory.fileTypes.filter(ft => ft !== fileType);
      
      setNewCategory({ ...newCategory, fileTypes: updatedFileTypes });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No document categories configured yet.</p>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-3 border rounded">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <p className="font-medium">{category.name}</p>
                </div>
                <p className="text-sm text-gray-500 mb-2">{category.description}</p>
                <div className="flex flex-wrap gap-1">
                  {category.fileTypes.map((fileType) => (
                    <Badge key={fileType} variant="outline" className="text-xs">
                      {fileType.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(category)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Button onClick={() => setIsAddModalOpen(true)} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Category
      </Button>

      {/* Edit Category Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Document Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-category-name">Category Name</Label>
                <Input
                  id="edit-category-name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="edit-category-description">Description</Label>
                <Textarea
                  id="edit-category-description"
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    description: e.target.value
                  })}
                  rows={3}
                />
              </div>
              <div>
                <Label>Category Color</Label>
                <div className="flex gap-2 mt-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded border-2 ${
                        editingCategory.color === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setEditingCategory({ ...editingCategory, color })}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label>Allowed File Types</Label>
                <div className="grid grid-cols-4 gap-2 mt-2 max-h-48 overflow-y-auto">
                  {availableFileTypes.map((fileType) => (
                    <label key={fileType} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingCategory.fileTypes.includes(fileType)}
                        onChange={(e) => handleFileTypeChange(fileType, e.target.checked, true)}
                        className="rounded"
                      />
                      <span className="text-sm">{fileType.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Category Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Document Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-category-name">Category Name</Label>
              <Input
                id="new-category-name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="new-category-description">Description</Label>
              <Textarea
                id="new-category-description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label>Category Color</Label>
              <div className="flex gap-2 mt-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded border-2 ${
                      newCategory.color === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewCategory({ ...newCategory, color })}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label>Allowed File Types</Label>
              <div className="grid grid-cols-4 gap-2 mt-2 max-h-48 overflow-y-auto">
                {availableFileTypes.map((fileType) => (
                  <label key={fileType} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newCategory.fileTypes.includes(fileType)}
                      onChange={(e) => handleFileTypeChange(fileType, e.target.checked, false)}
                      className="rounded"
                    />
                    <span className="text-sm">{fileType.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Add Category</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete the category "{deletingCategory?.name}"? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentCategoriesConfig;
