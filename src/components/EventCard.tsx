import React from 'react';
import { Clock, TrendingUp, Users, Tag } from 'lucide-react';
import { Event } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface EventCardProps {
  event: Event;
  onEventClick: (eventId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onEventClick }) => {
  const timeLeft = formatDistanceToNow(event.endDate, { addSuffix: true });
  const yesPercentage = Math.round(event.yesPrice * 100);
  const noPercentage = Math.round(event.noPrice * 100);

  return (
    <div
      className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-slate-700 hover:border-slate-600"
      onClick={() => onEventClick(event.id)}
    >
      {event.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              {event.category}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {event.status === 'active' ? timeLeft : 'Ended'}
            </span>
          </div>
        </div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {event.title}
        </h3>
        
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-slate-400">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              ₹{(event.totalVolume / 1000).toFixed(0)}K
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {((event.yesShares + event.noShares) / 1000).toFixed(0)}K
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-600 bg-opacity-20 border border-emerald-500 rounded-lg p-3 text-center">
            <div className="text-emerald-400 font-semibold text-sm mb-1">YES</div>
            <div className="text-white font-bold">₹{event.yesPrice.toFixed(2)}</div>
            <div className="text-emerald-400 text-xs">{yesPercentage}%</div>
          </div>
          <div className="bg-red-600 bg-opacity-20 border border-red-500 rounded-lg p-3 text-center">
            <div className="text-red-400 font-semibold text-sm mb-1">NO</div>
            <div className="text-white font-bold">₹{event.noPrice.toFixed(2)}</div>
            <div className="text-red-400 text-xs">{noPercentage}%</div>
          </div>
        </div>

        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="flex items-center bg-slate-700 text-slate-300 px-2 py-1 rounded-full text-xs"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};