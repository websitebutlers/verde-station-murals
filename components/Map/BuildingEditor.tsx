'use client';

import { useState } from 'react';
import { Building2, Save, X, Undo } from 'lucide-react';

interface BuildingEditorProps {
  isActive: boolean;
  onToggle: () => void;
  currentPoints: [number, number][];
  onUndo: () => void;
  onSave: (height: number) => void;
  onCancel: () => void;
}

export default function BuildingEditor({
  isActive,
  onToggle,
  currentPoints,
  onUndo,
  onSave,
  onCancel
}: BuildingEditorProps) {
  const [height, setHeight] = useState<string>('20');

  const handleSave = () => {
    const heightNum = parseFloat(height);
    if (heightNum > 0) {
      onSave(heightNum);
      setHeight('20'); // Reset for next building
    }
  };

  return (
    <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Building Editor
        </h3>
        <button
          onClick={onToggle}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            isActive
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </button>
      </div>

      {isActive && (
        <>
          <div className="mb-3 p-3 bg-blue-50 rounded text-sm text-blue-900">
            <p className="font-medium mb-1">Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Click on the map to trace building corners</li>
              <li>Click at least 3 points to form a polygon</li>
              <li>Enter the building height in feet</li>
              <li>Click Save to create the 3D building</li>
            </ol>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points: {currentPoints.length}
              </label>
              <div className="text-xs text-gray-500">
                {currentPoints.length < 3
                  ? `Need ${3 - currentPoints.length} more point(s)`
                  : 'Ready to save!'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (feet)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="20"
                min="1"
                step="1"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={onUndo}
                disabled={currentPoints.length === 0}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Undo className="w-4 h-4" />
                Undo
              </button>
              <button
                onClick={handleSave}
                disabled={currentPoints.length < 3 || !height || parseFloat(height) <= 0}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={onCancel}
                disabled={currentPoints.length === 0}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

