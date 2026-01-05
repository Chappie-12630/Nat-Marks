import React from 'react';
import { Helmet } from 'react-helmet';
import SwimmingTracker from '@/components/SwimmingTracker';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <>
      <Helmet>
        <title>Swimming Times Tracker - Log & Track Your Race Performance</title>
        <meta name="description" content="Track your swimming race times across different distances and styles. Log competitions, monitor progress, and view your best times for freestyle, breaststroke, butterfly, and backstroke." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <SwimmingTracker />
        <Toaster />
      </div>
    </>
  );
}

export default App;
