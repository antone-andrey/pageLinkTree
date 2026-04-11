"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Link {
  id: string;
  title: string;
  url: string;
  position: number;
  isActive: boolean;
  clicks: number;
}

interface LinkEditorProps {
  links: Link[];
  onReorder: (links: Link[]) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, data: { title: string; url: string }) => Promise<void>;
}

function SortableLink({
  link,
  onDelete,
  onEdit,
}: {
  link: Link;
  onDelete: (id: string) => void;
  onEdit: (id: string, data: { title: string; url: string }) => Promise<void>;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title);
  const [editUrl, setEditUrl] = useState(link.url);
  const [saving, setSaving] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function startEdit() {
    setEditTitle(link.title);
    setEditUrl(link.url);
    setEditing(true);
    setShowConfirm(false);
  }

  async function saveEdit() {
    if (!editTitle.trim() || !editUrl.trim()) return;
    setSaving(true);
    await onEdit(link.id, { title: editTitle.trim(), url: editUrl.trim() });
    setEditing(false);
    setSaving(false);
  }

  function cancelEdit() {
    setEditing(false);
    setEditTitle(link.title);
    setEditUrl(link.url);
  }

  if (editing) {
    return (
      <div ref={setNodeRef} style={style} className="bg-indigo-50/50 rounded-lg p-3 border border-indigo-200 space-y-2">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Link title"
          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit();
            if (e.key === "Escape") cancelEdit();
          }}
        />
        <input
          type="url"
          value={editUrl}
          onChange={(e) => setEditUrl(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit();
            if (e.key === "Escape") cancelEdit();
          }}
        />
        <div className="flex items-center gap-2">
          <button
            onClick={saveEdit}
            disabled={saving || !editTitle.trim() || !editUrl.trim()}
            className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={cancelEdit}
            className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-gray-50 rounded-lg p-3 flex items-center gap-3 hover:bg-gray-100/70 transition-all duration-200 border-l-2 border-transparent hover:border-indigo-400">
      <button {...attributes} {...listeners} className="cursor-grab text-gray-300 hover:text-indigo-400 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{link.title}</p>
        <p className="text-xs text-gray-400 truncate">{link.url}</p>
      </div>

      <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{link.clicks} clicks</span>

      {showConfirm ? (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDelete(link.id)}
            className="text-xs text-red-600 hover:text-red-700 font-medium"
          >
            Delete
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="text-xs text-gray-400 hover:text-gray-500"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          {/* Edit button */}
          <button
            onClick={startEdit}
            className="text-gray-400 hover:text-indigo-500 transition-colors"
            title="Edit link"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          {/* Delete button */}
          <button
            onClick={() => setShowConfirm(true)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Delete link"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export function LinkEditor({ links, onReorder, onDelete, onEdit }: LinkEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((l) => l.id === active.id);
      const newIndex = links.findIndex((l) => l.id === over.id);
      const reordered = arrayMove(links, oldIndex, newIndex);
      onReorder(reordered);
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {links.map((link) => (
            <SortableLink key={link.id} link={link} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
