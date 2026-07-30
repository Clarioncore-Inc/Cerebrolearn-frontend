import React from 'react';
import type { ActivityItem } from '../../types/database';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Loader2, UserPlus, MessageSquare, Star, GraduationCap, BookOpen } from 'lucide-react';

interface ActivityFeedListProps {
  items: ActivityItem[];
  loading?: boolean;
  emptyMessage?: string;
  onNavigateProfile?: (userId: string) => void;
}

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function getIcon(type: ActivityItem['type']) {
  switch (type) {
    case 'follow':
      return UserPlus;
    case 'discussion_post':
      return MessageSquare;
    case 'review':
      return Star;
    case 'enrollment':
      return BookOpen;
    case 'mentoring_listing':
      return GraduationCap;
    default:
      return MessageSquare;
  }
}

function getDescription(item: ActivityItem): React.ReactNode {
  const actorName = item.actor?.full_name || 'Someone';
  switch (item.type) {
    case 'follow':
      return (
        <>
          <span className='font-semibold'>{actorName}</span> started following{' '}
          <span className='font-semibold'>{item.target_user?.full_name || 'a user'}</span>
        </>
      );
    case 'discussion_post':
      return (
        <>
          <span className='font-semibold'>{actorName}</span> posted{' '}
          <span className='font-medium text-primary'>{item.title}</span> in Community Discussions
        </>
      );
    case 'review':
      return (
        <>
          <span className='font-semibold'>{actorName}</span> reviewed{' '}
          <span className='font-medium text-primary'>{item.title || 'a course'}</span>
        </>
      );
    case 'enrollment':
      return (
        <>
          <span className='font-semibold'>{actorName}</span> enrolled in{' '}
          <span className='font-medium text-primary'>{item.title || 'a course'}</span>
        </>
      );
    case 'mentoring_listing':
      return (
        <>
          <span className='font-semibold'>{actorName}</span> started offering{' '}
          <span className='font-medium text-primary'>{item.title}</span> mentoring
        </>
      );
    default:
      return <span className='font-semibold'>{actorName}</span>;
  }
}

export function ActivityFeedList({
  items,
  loading,
  emptyMessage = 'No activity yet.',
  onNavigateProfile,
}: ActivityFeedListProps) {
  if (loading) {
    return (
      <div className='flex justify-center py-12'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (items.length === 0) {
    return <p className='py-4 text-center text-sm text-muted-foreground'>{emptyMessage}</p>;
  }

  return (
    <div className='space-y-3'>
      {items.map((item) => {
        const Icon = getIcon(item.type);
        return (
          <div key={`${item.type}-${item.id}`} className='flex gap-3 rounded-lg border p-3'>
            <button
              type='button'
              onClick={() => onNavigateProfile?.(item.actor.id)}
              className='shrink-0'
            >
              <Avatar className='h-9 w-9'>
                <AvatarImage src={item.actor.avatar || undefined} />
                <AvatarFallback>{item.actor.full_name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
            </button>
            <div className='min-w-0 flex-1 space-y-1'>
              <div className='flex items-center gap-2'>
                <Icon className='h-3.5 w-3.5 text-primary shrink-0' />
                <p className='text-sm leading-5'>{getDescription(item)}</p>
              </div>
              {item.snippet && (
                <p className='line-clamp-2 text-sm text-muted-foreground'>{item.snippet}</p>
              )}
              <div className='flex items-center gap-2'>
                {item.rating != null && (
                  <Badge variant='outline' className='text-xs'>
                    ★ {item.rating}/5
                  </Badge>
                )}
                <span className='text-xs text-muted-foreground'>{timeAgo(item.created_at)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
