import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Trash2, Award, MapPin, Gauge, Medal, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Dashboard = ({ times, onDeleteTime, swimmer }) => {
  const bestTimes = useMemo(() => {
    const best = {};
    times.forEach(time => {
      // Key now includes pool size to differentiate PBs between Short Course and Long Course
      const key = `${time.distance}-${time.style}-${time.poolSize || '50m'}`;
      if (!best[key] || time.totalSeconds < best[key].totalSeconds) {
        best[key] = time;
      }
    });
    return best;
  }, [times]);

  const recentTimes = useMemo(() => {
    return [...times]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  }, [times]);

  const totalPoints = useMemo(() => {
    return times.reduce((sum, time) => sum + (time.points || 0), 0);
  }, [times]);

  const competitionStats = useMemo(() => {
    const stats = {};
    times.forEach(time => {
      if (!stats[time.competition]) {
        stats[time.competition] = {
          name: time.competition,
          location: time.competitionLocation,
          date: time.date,
          points: 0,
          events: 0
        };
      }
      stats[time.competition].points += (time.points || 0);
      stats[time.competition].events += 1;
      // Keep the most recent date/location if multiple (though likely same)
      if (new Date(time.date) > new Date(stats[time.competition].date)) {
        stats[time.competition].date = time.date;
        stats[time.competition].location = time.competitionLocation;
      }
    });
    
    return Object.values(stats)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [times]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Swimmer Header Component
  const SwimmerHeader = () => {
    if (!swimmer) return null;
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-100">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {swimmer.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{swimmer.name}</h2>
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{swimmer.location}</span>
            </div>
          </div>
        </div>
        <div className="text-center bg-blue-50 px-8 py-4 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-600 uppercase font-bold tracking-wider mb-1">Total Points</p>
          <p className="text-4xl font-bold text-blue-900">{totalPoints}</p>
        </div>
      </div>
    );
  };

  if (!swimmer && times.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No times logged yet</h3>
          <p className="text-gray-600">Start tracking your swimming progress by logging your first race time!</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {swimmer && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <SwimmerHeader />
        </motion.div>
      )}

      {/* Personal Bests Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Personal Bests</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(bestTimes).length > 0 ? (
              Object.entries(bestTimes).map(([key, time]) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm">{time.distance}</p>
                      <p className="text-xs opacity-90">{time.style}</p>
                    </div>
                    <Trophy className="w-5 h-5 text-yellow-300" />
                  </div>
                  <p className="text-3xl font-bold mb-1">{time.time}</p>
                  <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                    <p className="text-xs opacity-75">{time.competition}</p>
                    <div className="flex items-center gap-2">
                        {time.poolSize && (
                           <span className="text-[10px] font-bold bg-black/20 px-1.5 py-0.5 rounded text-white/90 uppercase tracking-wide">
                              {time.poolSize}
                           </span>
                        )}
                        {time.finaPoints > 0 && (
                        <div className="flex items-center gap-1 bg-white/30 px-2 py-0.5 rounded-full" title="FINA Points">
                            <Gauge className="w-3 h-3" />
                            <span className="text-xs font-bold">{time.finaPoints}</span>
                        </div>
                        )}
                    </div>
                  </div>
                  <p className="text-xs opacity-75 mt-1">{formatDate(time.date)}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-white/80 col-span-full">No personal bests yet</p>
            )}
          </div>
        </div>
      </motion.section>

      {/* Competition Summary Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Medal className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Competition Performance</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competitionStats.map((comp, index) => (
              <div key={`${comp.name}-${index}`} className="p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 transition-colors bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{comp.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                    {comp.points} pts
                  </span>
                </div>
                {comp.location && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{comp.location}</span>
                  </div>
                )}
                <div className="flex justify-between items-end mt-2 text-xs text-gray-500">
                  <span>{formatDate(comp.date)}</span>
                  <span>{comp.events} event{comp.events !== 1 ? 's' : ''}</span>
                </div>
              </div>
            ))}
            {competitionStats.length === 0 && (
              <p className="text-gray-500 col-span-full py-4 text-center">No competitions recorded yet.</p>
            )}
          </div>
        </div>
      </motion.section>

      {/* Recent Times Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Recent Times</h2>
          </div>
          
          <div className="space-y-3">
            {recentTimes.map((time, index) => {
              const isBest = bestTimes[`${time.distance}-${time.style}-${time.poolSize || '50m'}`]?.id === time.id;
              return (
                <motion.div
                  key={time.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isBest 
                      ? 'bg-yellow-50 border-yellow-300' 
                      : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 text-lg">
                          {time.distance} {time.style}
                        </span>
                        {isBest && (
                          <Trophy className="w-4 h-4 text-yellow-600" />
                        )}
                        {time.poolSize && (
                           <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                              <Waves className="w-3 h-3" />
                              {time.poolSize}
                           </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-4">
                        <p className="text-2xl font-bold text-blue-600 mb-1">{time.time}</p>
                        {time.placement && (
                           <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                             {time.placement}{time.placement === 1 ? 'st' : time.placement === 2 ? 'nd' : time.placement === 3 ? 'rd' : 'th'} Place ({time.points} pts)
                           </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                        <span>{time.competition}</span>
                        {time.competitionLocation && (
                          <span className="flex items-center gap-1 text-gray-500">
                            <MapPin className="w-3 h-3" />
                            {time.competitionLocation}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(time.date)}</p>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this time?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the time {time.time} for {time.distance} {time.style} from {time.competition}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteTime(time.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Dashboard;
