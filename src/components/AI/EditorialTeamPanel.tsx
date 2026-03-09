'use client';

import React, { useState } from 'react';
import {
  EDITORIAL_TEAM,
  TeamMember,
  TeamReview,
  buildReviewPrompt,
} from '@/utils/editorialTeam';
import { generateCompletion } from '@/utils/aiProvider';

interface EditorialTeamPanelProps {
  chapterContent: string;
  chapterTitle?: string;
  genre?: string;
  characters?: string[];
  plotPoints?: string[];
}

const EditorialTeamPanel: React.FC<EditorialTeamPanelProps> = ({
  chapterContent,
  chapterTitle,
  genre,
  characters,
  plotPoints,
}) => {
  const [reviews, setReviews] = useState<Record<string, TeamReview>>({});
  const [activeMember, setActiveMember] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestReview = async (member: TeamMember) => {
    if (!chapterContent.trim()) {
      setError('Write some content first so the team has something to review.');
      return;
    }
    setLoading(member.id);
    setError(null);
    setActiveMember(member.id);

    try {
      const prompt = buildReviewPrompt(member, {
        content: chapterContent.slice(0, 8000),
        chapterTitle,
        genre,
        characters,
        plotPoints,
      });

      const feedback = await generateCompletion(member.systemPrompt, prompt);

      const review: TeamReview = {
        memberId: member.id,
        memberName: member.name,
        memberRole: member.role,
        feedback,
        suggestions: [],
        rating: 0,
        timestamp: new Date(),
      };
      setReviews(prev => ({ ...prev, [member.id]: review }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to get review. Check your AI provider settings.'
      );
    } finally {
      setLoading(null);
    }
  };

  const requestFullTeamReview = async () => {
    for (const member of EDITORIAL_TEAM) {
      await requestReview(member);
    }
  };

  const activeReview = activeMember ? reviews[activeMember] : null;
  const activeMemberData = activeMember
    ? EDITORIAL_TEAM.find(m => m.id === activeMember)
    : null;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Editorial Team</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Your AI-powered review crew. Each member brings a different lens.
            </p>
          </div>
          <button
            onClick={requestFullTeamReview}
            disabled={!!loading || !chapterContent.trim()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Reviewing...' : 'Full Team Review'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Team Roster */}
        <div className="w-72 border-r border-slate-200 overflow-y-auto bg-slate-50/50">
          <div className="p-3 space-y-1">
            {EDITORIAL_TEAM.map(member => {
              const hasReview = !!reviews[member.id];
              const isActive = activeMember === member.id;
              const isLoading = loading === member.id;

              return (
                <button
                  key={member.id}
                  onClick={() => {
                    if (hasReview) {
                      setActiveMember(member.id);
                    } else {
                      requestReview(member);
                    }
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white shadow-sm border border-slate-200'
                      : 'hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                      style={{ backgroundColor: member.color + '18' }}
                    >
                      {member.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-slate-800 truncate">
                          {member.name}
                        </span>
                        {hasReview && (
                          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                        )}
                        {isLoading && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                        )}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: member.color }}>
                        {member.role}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {member.personality}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Review Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading && !activeReview && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
              <div className="w-8 h-8 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-sm">
                {EDITORIAL_TEAM.find(m => m.id === loading)?.name} is reviewing...
              </p>
            </div>
          )}

          {activeReview && activeMemberData && (
            <div>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: activeMemberData.color + '18' }}
                >
                  {activeMemberData.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {activeMemberData.name}
                  </h3>
                  <div className="text-sm" style={{ color: activeMemberData.color }}>
                    {activeMemberData.role}
                  </div>
                </div>
                <div className="ml-auto text-xs text-slate-400">
                  {activeReview.timestamp.toLocaleTimeString()}
                </div>
              </div>

              <div className="prose prose-sm prose-slate max-w-none">
                {activeReview.feedback.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <h4 key={i} className="text-slate-800 mt-4 mb-2 font-semibold">
                        {line.replace(/\*\*/g, '')}
                      </h4>
                    );
                  }
                  if (line.startsWith('**')) {
                    return (
                      <p key={i} className="mb-2">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: line.replace(
                              /\*\*(.*?)\*\*/g,
                              '<strong>$1</strong>'
                            ),
                          }}
                        />
                      </p>
                    );
                  }
                  if (line.trim() === '') return <br key={i} />;
                  return <p key={i} className="mb-1 text-slate-600 leading-relaxed">{line}</p>;
                })}
              </div>
            </div>
          )}

          {!loading && !activeReview && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
              <span className="text-4xl">&#128218;</span>
              <p className="text-sm text-center max-w-xs">
                Select a team member to get their review, or hit{' '}
                <strong>Full Team Review</strong> for everyone at once.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorialTeamPanel;
