import React, { useState, useEffect } from 'react';
import { Command, Keyboard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Button } from './button';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  const shortcuts: Shortcut[] = [
    // Navigation
    { keys: ['Cmd/Ctrl', 'K'], description: 'Open global search', category: 'Navigation' },
    { keys: ['Esc'], description: 'Close dialogs/modals', category: 'Navigation' },
    { keys: ['?'], description: 'Show keyboard shortcuts', category: 'Navigation' },
    
    // Admin Actions
    { keys: ['Cmd/Ctrl', 'N'], description: 'Create new item', category: 'Actions' },
    { keys: ['Cmd/Ctrl', 'S'], description: 'Save changes', category: 'Actions' },
    { keys: ['Cmd/Ctrl', 'E'], description: 'Export data', category: 'Actions' },
    
    // Quick Navigation
    { keys: ['G', 'D'], description: 'Go to Dashboard', category: 'Quick Navigation' },
    { keys: ['G', 'U'], description: 'Go to Users', category: 'Quick Navigation' },
    { keys: ['G', 'C'], description: 'Go to Courses', category: 'Quick Navigation' },
    { keys: ['G', 'A'], description: 'Go to Analytics', category: 'Quick Navigation' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show shortcuts with ?
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        // Only if not in input field
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setOpen(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        title="Keyboard Shortcuts (?)"
        className="rounded-full"
      >
        <Keyboard className="h-5 w-5" />
      </Button>

      {/* Shortcuts Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription>
              Use these shortcuts to navigate and perform actions quickly
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <div key={keyIndex} className="flex items-center">
                            {keyIndex > 0 && (
                              <span className="text-muted-foreground text-xs mx-1">+</span>
                            )}
                            <kbd className="px-2 py-1 text-xs font-mono bg-muted border rounded">
                              {key}
                            </kbd>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              Press <kbd className="px-2 py-1 bg-background border rounded mx-1">?</kbd> anytime to open this panel
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}