import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { EventsList } from './components/EventsList';
import { TradingInterface } from './components/TradingInterface';
import { Portfolio } from './components/Portfolio';
import { Wallet } from './components/Wallet';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useAuth } from './hooks/useAuth';
import { useEvents } from './hooks/useEvents';

function App() {
  const { user, isLoading: authLoading } = useAuth();
  const { events } = useEvents();
  const [activeTab, setActiveTab] = useState<'events' | 'portfolio' | 'wallet'>('events');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <LoadingSpinner />
      </div>
    );
  }

  const selectedEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main>
        {selectedEvent ? (
          <TradingInterface
            event={selectedEvent}
            onBack={() => setSelectedEventId(null)}
          />
        ) : activeTab === 'events' ? (
          <EventsList onEventClick={setSelectedEventId} />
        ) : activeTab === 'portfolio' ? (
          <Portfolio />
        ) : activeTab === 'wallet' ? (
          <Wallet />
        ) : null}
      </main>
    </div>
  );
}

export default App;