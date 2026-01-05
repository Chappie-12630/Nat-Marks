import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Filter, User, Waves } from 'lucide-react';

const DISTANCES = [
  '50m', '100m', '200m', '400m', '500m', '800m', '1500m', 
  '1km', '1.5km', '2km', '3km', '5km'
];
const STYLES = ['Freestyle', 'Breaststroke', 'Butterfly', 'Backstroke', 'Medley'];
const POOL_SIZES = ['25m', '50m', 'Open Water'];

const RecordsView = ({ times, swimmers }) => {
  const [selectedDistance, setSelectedDistance] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [selectedPoolSize, setSelectedPoolSize] = useState('all');

  const filteredTimes = useMemo(() => {
    let filtered = [...times];
    
    if (selectedDistance !== 'all') {
      filtered = filtered.filter(time => time.distance === selectedDistance);
    }
    
    if (selectedStyle !== 'all') {
      filtered = filtered.filter(time => time.style === selectedStyle);
    }

    if (selectedPoolSize !== 'all') {
       filtered = filtered.filter(time => (time.poolSize || '50m') === selectedPoolSize);
    }
    
    return filtered.sort((a, b) => a.totalSeconds - b.totalSeconds);
  }, [times, selectedDistance, selectedStyle, selectedPoolSize]);

  const groupedRecords = useMemo(() => {
    const grouped = {};
    
    filteredTimes.forEach(time => {
      // Group now includes pool size
      const key = `${time.distance}-${time.style}-${time.poolSize || '50m'}`;
      if (!grouped[key]) {
        grouped[key] = {
          distance: time.distance,
          style: time.style,
          poolSize: time.poolSize || '50m',
          times: []
        };
      }
      grouped[key].times.push(time);
    });
    
    Object.keys(grouped).forEach(key => {
      grouped[key].times.sort((a, b) => a.totalSeconds - b.totalSeconds);
    });
    
    return grouped;
  }, [filteredTimes]);

  const getSwimmerName = (id) => {
    const swimmer = swimmers.find(s => s.id === id);
    return swimmer ? swimmer.name : 'Unknown Swimmer';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Filter className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Filter Records</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Distance
            </label>
            <select
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-900"
            >
              <option value="all">All Distances</option>
              {DISTANCES.map(distance => (
                <option key={distance} value={distance}>{distance}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Style
            </label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-900"
            >
              <option value="all">All Styles</option>
              {STYLES.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>

          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pool Size
             </label>
             <select
                value={selectedPoolSize}
                onChange={(e) => setSelectedPoolSize(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-900"
             >
                <option value="all">All Pool Sizes</option>
                {POOL_SIZES.map(size => (
                   <option key={size} value={size}>{size}</option>
                ))}
             </select>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {Object.keys(groupedRecords).length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No records found for the selected filters</p>
          </motion.div>
        ) : (
          <motion.div
            key="records"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {Object.entries(groupedRecords).map(([key, record], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{record.distance}</h3>
                      <div className="flex items-center gap-3 text-blue-100">
                         <span>{record.style}</span>
                         <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                         <span>{record.poolSize}</span>
                      </div>
                    </div>
                    <Trophy className="w-8 h-8 text-yellow-300" />
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3">
                    {record.times.map((time, timeIndex) => (
                      <motion.div
                        key={time.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: timeIndex * 0.05 }}
                        className={`flex items-center justify-between p-4 rounded-xl ${
                          timeIndex === 0 
                            ? 'bg-yellow-50 border-2 border-yellow-300' 
                            : 'bg-gray-50 border-2 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`text-2xl font-bold ${
                            timeIndex === 0 ? 'text-yellow-600' : 'text-gray-400'
                          }`}>
                            #{timeIndex + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                               <p className="text-3xl font-bold text-blue-600">{time.time}</p>
                               <div className="flex items-center gap-1 text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                  <User className="w-3 h-3" />
                                  <span className="font-semibold">{getSwimmerName(time.swimmerId)}</span>
                               </div>
                            </div>
                            <p className="text-sm text-gray-600">{time.competition}</p>
                            <p className="text-xs text-gray-500">{formatDate(time.date)}</p>
                          </div>
                        </div>
                        {timeIndex === 0 && (
                          <div className="flex flex-col items-center">
                            <Trophy className="w-6 h-6 text-yellow-600 mb-1" />
                            <span className="text-xs font-semibold text-yellow-600">BEST</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecordsView;
