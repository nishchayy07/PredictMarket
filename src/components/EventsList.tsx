import React, { useState } from 'react';
import { Search, Filter, SortDesc } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { EventCard } from './EventCard';
import { LoadingSpinner } from './LoadingSpinner';

interface EventsListProps {
  onEventClick: (eventId: string) => void;
}

export const EventsList: React.FC<EventsListProps> = ({ onEventClick }) => {
  const { events, isLoading } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('volume');

  const categories = ['all', ...Array.from(new Set(events.map(event => event.category)))];

  const filteredEvents = events
    .filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(event => selectedCategory === 'all' || event.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          return b.totalVolume - a.totalVolume;
        case 'endDate':
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        case 'yesPrice':
          return b.yesPrice - a.yesPrice;
        default:
          return 0;
      }
    });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Prediction Markets</h1>
        <p className="text-slate-400">Trade on the outcomes of real-world events</p>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-lg p-4 mb-6 border border-slate-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <SortDesc className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-10 pr-8 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="volume">Volume</option>
              <option value="endDate">End Date</option>
              <option value="yesPrice">Yes Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-slate-400">
          Showing {filteredEvents.length} of {events.length} events
        </div>
        <div className="text-slate-400 text-sm">
          Total Volume: ₹{events.reduce((sum, event) => sum + event.totalVolume, 0).toLocaleString()}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-slate-400 text-lg mb-2">No events found</div>
          <div className="text-slate-500">Try adjusting your search or filters</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onEventClick={onEventClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};