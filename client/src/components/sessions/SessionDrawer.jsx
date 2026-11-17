import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { History, Plus, Trash2, X, Sparkles, ChevronRight } from 'lucide-react';

export function SessionDrawer({
  isOpen,
  onClose,
  sessions = [],
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-bg-deep/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm h-full bg-surface border-l border-line-subtle shadow-elevated p-5 flex flex-col justify-between space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line-subtle pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-primary-400" />
            <h3 className="font-semibold text-sm text-ink-primary">Past Learning Sessions</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-ink-muted hover:text-ink-primary rounded-lg hover:bg-surface-raised"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New Session CTA */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            onNewSession();
            onClose();
          }}
          className="w-full"
          iconLeft={<Plus className="w-4 h-4" />}
        >
          Start New Adventure
        </Button>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-xs text-ink-muted space-y-2">
              <Sparkles className="w-6 h-6 mx-auto text-primary-400/50" />
              <p>No saved activities yet.</p>
              <p className="text-[11px]">Ask your tutor a question to create your first session!</p>
            </div>
          ) : (
            sessions.map((sess) => (
              <div
                key={sess.id}
                onClick={() => {
                  onSelectSession(sess);
                  onClose();
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                  activeSessionId === sess.id
                    ? 'bg-primary-600/20 border-primary-500/60 shadow-glow'
                    : 'bg-surface-raised/70 hover:bg-surface-raised border-line-subtle'
                }`}
              >
                <div className="space-y-0.5 overflow-hidden pr-2">
                  <p className="text-xs font-semibold text-ink-primary truncate">
                    {sess.title || 'Curiosity Exploration'}
                  </p>
                  <p className="text-[10px] text-ink-muted">
                    {new Date(sess.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(sess.id);
                    }}
                    className="p-1.5 opacity-0 group-hover:opacity-100 hover:text-danger text-ink-muted rounded transition-opacity"
                    title="Delete session"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-primary-400" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-line-subtle text-[11px] text-ink-muted text-center">
          Sessions are saved locally in your browser/app.
        </div>
      </div>
    </div>
  );
}
