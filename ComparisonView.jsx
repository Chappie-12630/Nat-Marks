import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Trophy } from 'lucide-react';
import { Label } from '@/components/ui/label';
const DISTANCES = ['50m', '100m', '200m', '400m', '500m', '800m', '1500m', '1km', '1.5km', '2km', '3km', '5km'];
const STYLES = ['Freestyle', 'Breaststroke', 'Butterfly', 'Backstroke', 'Medley'];
const POOL_SIZES = ['25m', '50m', 'Open Water'];
const ComparisonView = ({
  swimmers,
  times
}) => {
  const [swimmer1Id, setSwimmer1Id] = useState('');
  const [swimmer2Id, setSwimmer2Id] = useState('');
  const getBestTime = (swimmerId, distance, style, poolSize) => {
    const swimmerTimes = times.filter(t => t.swimmerId === swimmerId && t.distance === distance && t.style === style && (t.poolSize || '50m') === poolSize);
    if (swimmerTimes.length === 0) return null;
    return swimmerTimes.reduce((best, curr) => curr.totalSeconds < best.totalSeconds ? curr : best);
  };
  const comparisons = useMemo(() => {
    if (!swimmer1Id || !swimmer2Id) return [];
    const results = [];
    STYLES.forEach(style => {
      DISTANCES.forEach(distance => {
        POOL_SIZES.forEach(poolSize => {
          const time1 = getBestTime(swimmer1Id, distance, style, poolSize);
          const time2 = getBestTime(swimmer2Id, distance, style, poolSize);
          if (time1 || time2) {
            results.push({
              event: `${distance} ${style} (${poolSize})`,
              time1,
              time2,
              winner: !time1 ? 2 : !time2 ? 1 : time1.totalSeconds < time2.totalSeconds ? 1 : 2
            });
          }
        });
      });
    });
    return results;
  }, [swimmer1Id, swimmer2Id, times]);
  return <div className="space-y-6">
      <motion.div initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <ArrowLeftRight className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Head - to - Head</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-2 block">Swimmer 1</Label>
            <select value={swimmer1Id} onChange={e => setSwimmer1Id(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500">
              <option value="">Select Swimmer</option>
              {swimmers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <Label className="mb-2 block">Swimmer 2</Label>
            <select value={swimmer2Id} onChange={e => setSwimmer2Id(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500">
              <option value="">Select Swimmer</option>
              {swimmers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
      </motion.div>

      {swimmer1Id && swimmer2Id && <div className="space-y-4">
          {comparisons.length === 0 ? <div className="text-center p-8 text-gray-500 bg-white rounded-2xl">
              No common events found between these swimmers.
            </div> : comparisons.map((comp, idx) => <motion.div key={comp.event} initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: idx * 0.05
      }} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between border border-gray-100">
                <div className={`flex-1 text-right pr-4 ${comp.winner === 1 ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                  {comp.time1 ? comp.time1.time : '-'}
                  {comp.winner === 1 && <Trophy className="inline w-4 h-4 ml-2 text-yellow-500" />}
                </div>
                
                <div className="px-4 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 min-w-[150px] text-center">
                  {comp.event}
                </div>

                <div className={`flex-1 text-left pl-4 ${comp.winner === 2 ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                  {comp.winner === 2 && <Trophy className="inline w-4 h-4 mr-2 text-yellow-500" />}
                  {comp.time2 ? comp.time2.time : '-'}
                </div>
              </motion.div>)}
        </div>}
    </div>;
};
export default ComparisonView;
