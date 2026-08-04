import React from 'react';
import { PDBTypeResult } from '../../types/personalityDatabase';
import { CheckCircle2 } from 'lucide-react';

interface PersonalityVoteBarProps {
  results: PDBTypeResult[];
  totalVotes: number;
  selectedType: string | null;
  onVote: (typeCode: string) => void;
  interactive?: boolean;
}

const BAR_COLORS = ['#395192', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export function PersonalityVoteBar({
  results,
  totalVotes,
  selectedType,
  onVote,
  interactive = true,
}: PersonalityVoteBarProps) {
  if (results.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No votes yet for this system.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((result, index) => {
        const isSelected = selectedType === result.typeCode;
        const color = BAR_COLORS[index % BAR_COLORS.length];
        const className = `w-full text-left rounded-lg border p-3 transition-all ${
          isSelected
            ? 'border-[#395192] bg-[#395192]/5 dark:bg-[#395192]/10'
            : interactive
              ? 'border-transparent hover:border-border hover:bg-muted/50'
              : 'border-transparent bg-muted/20'
        }`;
        const content = (
          <>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold text-sm text-foreground">{result.typeCode}</span>
                {result.typeName ? <span className="text-xs text-muted-foreground truncate">{result.typeName}</span> : null}
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#395192]" />}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                <span>{result.votes.toLocaleString()} votes</span>
                <span className="font-semibold text-foreground">{result.percentage}%</span>
              </div>
            </div>
            <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${result.percentage}%`, backgroundColor: color }}
              />
            </div>
          </>
        );

        return (
          interactive ? (
            <button key={result.typeCode} onClick={() => onVote(result.typeCode)} className={className}>
              {content}
            </button>
          ) : (
            <div key={result.typeCode} className={className}>
              {content}
            </div>
          )
        );
      })}
      <p className="text-xs text-muted-foreground text-center pt-2">
        {totalVotes.toLocaleString()} total votes · {interactive ? 'Click a type to cast your vote' : 'Sign in to vote or comment'}
      </p>
    </div>
  );
}
