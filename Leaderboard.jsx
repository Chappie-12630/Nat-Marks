import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, MapPin } from 'lucide-react';

const Leaderboard = ({ swimmers, times }) => {
  const ranking = useMemo(() => {
    return swimmers.map(swimmer => {
      const swimmerTimes = times.filter(t => t.swimmerId === swimmer.id);
      const totalPoints = swimmerTimes.reduce((sum, t) => sum + (t.points || 0), 0);
      return {
        ...swimmer,
        totalPoints,
        raceCount: swimmerTimes.length
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints);
  }, [swimmers, times]);

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-gray-400">#{index + 1}</span>;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-300" />
            <h2 className="text-2xl font-bold">Points Leaderboard</h2>
          </div>
          <p className="text-blue-100 mt-2">
            1st place = 20pts, decreasing by 1pt per position
          </p>
        </div>

        <div className="p-0">
          {ranking.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No swimmers registered yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {ranking.map((swimmer, index) => (
                <motion.div
                  key={swimmer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-6 hover:bg-gray-50 transition-colors ${
                    index === 0 ? 'bg-yellow-50/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 flex justify-center">
                      {getRankIcon(index)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{swimmer.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {swimmer.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{swimmer.totalPoints}</p>
                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Points</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
