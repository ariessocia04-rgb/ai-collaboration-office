'use client';

import React from 'react';

interface ConfirmRemoveTenantProps {
  isOpen: boolean;
  tenantName: string;
  roomName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmRemoveTenant({
  isOpen,
  tenantName,
  roomName,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmRemoveTenantProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Remove Tenant?</h2>
        
        <p className="text-gray-600 mb-4">
          Are you sure you want to remove <span className="font-semibold">{tenantName}</span> from <span className="font-semibold">{roomName}</span>? This action will mark the room as vacant.
        </p>

        <div className="bg-red-50 border border-red-200 rounded p-3 mb-6">
          <p className="text-sm text-red-700">
            This action cannot be undone. The tenant will need to be re-added if this was done by mistake.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Removing...' : 'Remove Tenant'}
          </button>
        </div>
      </div>
    </div>
  );
}
