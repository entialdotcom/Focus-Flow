import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, Trash2 } from 'lucide-react';
import { ListeningSession, Mode } from '../types';
import { StorageService } from '../services/storageService';
import { MODE_ACCENT } from '../constants';

interface ListeningHistoryProps {
  onBack: () => void;
  onStartSession: () => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
};

const ListeningHistory: React.FC<ListeningHistoryProps> = ({ onBack, onStartSession }) => {
  const [sessions, setSessions] = useState<ListeningSession[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const history = StorageService.getHistory();
    setSessions(history);
  };

  const handleClearHistory = () => {
    StorageService.clearHistory();
    setSessions([]);
    setShowClearConfirm(false);
  };

  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Listening History</h1>
              <p className="text-gray-400 text-sm">{totalSessions} sessions tracked</p>
            </div>
          </div>
          {sessions.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 size={18} />
              <span className="text-sm">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {sessions.length === 0 ? (
          <div className="bg-slate-800/50 rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">No listening history yet</h2>
            <p className="text-gray-400 mb-8">
              Start a focus session to begin tracking your productivity and see weekly summaries.
            </p>
            <button
              onClick={onStartSession}
              className="px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              Start Focusing
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-xl p-6">
                <div className="text-gray-400 text-sm mb-1">Total Sessions</div>
                <div className="text-3xl font-bold text-white">{totalSessions}</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6">
                <div className="text-gray-400 text-sm mb-1">Total Time</div>
                <div className="text-3xl font-bold text-white">{formatDuration(totalMinutes)}</div>
              </div>
            </div>

            {/* Sessions List */}
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${MODE_ACCENT[session.mode].replace('text-', 'bg-')} bg-opacity-20`}>
                          {session.mode}
                        </span>
                        <span className="text-white/60 text-sm">{session.activityName}</span>
                      </div>
                      {session.trackTitle && (
                        <div className="text-white font-medium mb-1">{session.trackTitle}</div>
                      )}
                      {session.moodName && (
                        <div className="text-white/50 text-sm">Mood: {session.moodName}</div>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-white/50 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{formatDate(session.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{formatDuration(session.duration)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">Clear History?</h3>
            <p className="text-gray-400 mb-6">
              This will permanently delete all your listening history. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeningHistory;

