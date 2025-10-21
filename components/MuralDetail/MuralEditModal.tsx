'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Star } from 'lucide-react';
import { Mural, MuralImage } from '@/types/mural';

interface MuralEditModalProps {
  mural: Mural;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMural: Mural) => void;
}

export default function MuralEditModal({ mural, isOpen, onClose, onSave }: MuralEditModalProps) {
  const [artistBio, setArtistBio] = useState(mural.artist.bio || '');
  const [images, setImages] = useState<MuralImage[]>(mural.images || []);

  useEffect(() => {
    setArtistBio(mural.artist.bio || '');
    setImages(mural.images || []);
  }, [mural]);

  const handleAddImage = () => {
    if (images.length >= 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    setImages([...images, { url: '', description: '', isPrimary: false }]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleImageChange = (index: number, field: keyof MuralImage, value: string | boolean) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    setImages(newImages);
  };

  const handleSetPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    setImages(newImages);
  };

  const handleSave = () => {
    const updatedMural: Mural = {
      ...mural,
      artist: {
        ...mural.artist,
        bio: artistBio
      },
      images: images.filter(img => img.url.trim() !== '')
    };
    onSave(updatedMural);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Mural</h2>
            <p className="text-sm text-gray-600 mt-1">{mural.name} by {mural.artist.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Artist Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Artist Bio
            </label>
            <textarea
              value={artistBio}
              onChange={(e) => setArtistBio(e.target.value)}
              placeholder="Enter artist biography..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          {/* Images */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-900">
                Images ({images.length}/5)
              </label>
              <button
                onClick={handleAddImage}
                disabled={images.length >= 5}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Image
              </button>
            </div>

            <div className="space-y-4">
              {images.map((image, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      {/* Image URL */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Image URL
                        </label>
                        <input
                          type="text"
                          value={image.url}
                          onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                          placeholder="https://yourwebsite.com/image.jpg"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={image.description}
                          onChange={(e) => handleImageChange(index, 'description', e.target.value)}
                          placeholder="Describe this image..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Primary Image Toggle */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSetPrimary(index)}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-colors ${
                            image.isPrimary
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          <Star className={`w-3 h-3 ${image.isPrimary ? 'fill-yellow-500' : ''}`} />
                          {image.isPrimary ? 'Primary Image' : 'Set as Primary'}
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Image Preview */}
                  {image.url && (
                    <div className="mt-3">
                      <img
                        src={image.url}
                        alt={image.description || 'Preview'}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EInvalid URL%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}

              {images.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No images added yet. Click "Add Image" to get started.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

