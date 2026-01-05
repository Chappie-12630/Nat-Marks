import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, Medal, MapPin, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
const DISTANCES = ['50m', '100m', '200m', '400m', '500m', '800m', '1500m', '1km', '1.5km', '2km', '3km', '5km'];
const STYLES = ['Freestyle', 'Breaststroke', 'Butterfly', 'Backstroke', 'Medley'];
const POOL_SIZES = ['25m', '50m', 'Open Water'];

// Approximate World Record Base Times (in seconds) for FINA point calculation (Men's LCM reference)
// Note: FINA points are strictly for pool swimming, Open Water usually uses different scales or doesn't apply standard FINA points in the same way.
// We will apply 0 points or skip calculation for non-standard pool distances if base time missing.
const BASE_TIMES = {
  'Freestyle': {
    '50m': 20.91,
    '100m': 46.80,
    '200m': 102.00,
    '400m': 220.07,
    '800m': 452.12,
    '1500m': 871.02
  },
  'Backstroke': {
    '50m': 23.55,
    '100m': 51.60,
    '200m': 111.92
  },
  'Breaststroke': {
    '50m': 25.95,
    '100m': 56.88,
    '200m': 125.48
  },
  'Butterfly': {
    '50m': 22.27,
    '100m': 49.45,
    '200m': 110.34
  },
  'Medley': {
    '200m': 114.00,
    '400m': 242.50
  }
};
const AddTimeForm = ({
  onAddTime,
  onSuccess,
  swimmers
}) => {
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    swimmerId: swimmers.length === 1 ? swimmers[0].id : '',
    distance: '100m',
    style: 'Freestyle',
    poolSize: '50m',
    minutes: '',
    seconds: '',
    milliseconds: '',
    placement: '1',
    date: new Date().toISOString().split('T')[0],
    competition: '',
    competitionLocation: ''
  });
  const calculatePoints = place => {
    return Math.max(0, 21 - parseInt(place || 21));
  };
  const calculateFinaPoints = (totalSeconds, distance, style, poolSize) => {
    // FINA points are typically for 50m (LCM) or 25m (SCM) pools.
    // If it's Open Water, we skip FINA points for now as the calculation differs significantly.
    if (poolSize === 'Open Water') return 0;

    // Simplification: Using LCM base times. For accurate SCM, different base times are needed.
    // This provides a consistent "score" based on LCM standards for now.
    const baseTime = BASE_TIMES[style]?.[distance];
    if (!baseTime || totalSeconds <= 0) return 0;
    return Math.floor(1000 * Math.pow(baseTime / totalSeconds, 3));
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.swimmerId) {
      toast({
        title: "Swimmer Required",
        description: "Please select a swimmer for this time.",
        variant: "destructive"
      });
      return;
    }
    if (!formData.seconds || !formData.competition) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    const minutes = parseInt(formData.minutes) || 0;
    const seconds = parseInt(formData.seconds) || 0;
    const milliseconds = parseInt(formData.milliseconds) || 0;
    if (seconds < 0 || seconds >= 60 || milliseconds < 0 || milliseconds >= 100) {
      toast({
        title: "Invalid time",
        description: "Please enter valid time values.",
        variant: "destructive"
      });
      return;
    }
    const timeString = `${minutes > 0 ? minutes + ':' : ''}${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    const totalSeconds = minutes * 60 + seconds + milliseconds / 100;
    const points = calculatePoints(formData.placement);
    const finaPoints = calculateFinaPoints(totalSeconds, formData.distance, formData.style, formData.poolSize);
    const newTime = {
      swimmerId: formData.swimmerId,
      distance: formData.distance,
      style: formData.style,
      poolSize: formData.poolSize,
      time: timeString,
      totalSeconds: totalSeconds,
      placement: parseInt(formData.placement),
      points: points,
      finaPoints: finaPoints,
      date: formData.date,
      competition: formData.competition,
      competitionLocation: formData.competitionLocation
    };
    onAddTime(newTime);
    setFormData(prev => ({
      ...prev,
      minutes: '',
      seconds: '',
      milliseconds: '',
      competition: '',
      competitionLocation: ''
    }));
    if (onSuccess) {
      onSuccess();
    }
  };
  if (swimmers.length === 0) {
    return <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
           <h3 className="text-lg font-bold text-yellow-800 mb-2">No Swimmers Found</h3>
           <p className="text-yellow-700">Please create a swimmer profile before adding times.</p>
        </div>;
  }
  return <motion.div initial={{
    opacity: 0,
    scale: 0.95
  }} animate={{
    opacity: 1,
    scale: 1
  }} transition={{
    duration: 0.3
  }} className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Plus className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">New Time</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <Label htmlFor="swimmer" className="text-gray-700 font-semibold mb-2 block">
              Swimmer *
            </Label>
            <select id="swimmer" required value={formData.swimmerId} onChange={e => setFormData({
            ...formData,
            swimmerId: e.target.value
          })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-900">
              <option value="">Select a Swimmer</option>
              {swimmers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="distance" className="text-gray-700 font-semibold mb-2 block">
                Distance
              </Label>
              <select id="distance" value={formData.distance} onChange={e => setFormData({
              ...formData,
              distance: e.target.value
            })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-900">
                {DISTANCES.map(distance => <option key={distance} value={distance}>{distance}</option>)}
              </select>
            </div>

            <div>
              <Label htmlFor="style" className="text-gray-700 font-semibold mb-2 block">
                Style
              </Label>
              <select id="style" value={formData.style} onChange={e => setFormData({
              ...formData,
              style: e.target.value
            })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-900">
                {STYLES.map(style => <option key={style} value={style}>{style}</option>)}
              </select>
            </div>

             <div>
                <Label htmlFor="poolSize" className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                   <Waves className="w-4 h-4" />
                   Pool Size
                </Label>
                <select id="poolSize" value={formData.poolSize} onChange={e => setFormData({
              ...formData,
              poolSize: e.target.value
            })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-900">
                   {POOL_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
                </select>
             </div>
          </div>

          <div>
            <Label className="text-gray-700 font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <input type="number" placeholder="Min" min="0" value={formData.minutes} onChange={e => setFormData({
                ...formData,
                minutes: e.target.value
              })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-center text-gray-900 placeholder-gray-400" />
                <p className="text-xs text-gray-500 mt-1 text-center">Minutes</p>
              </div>
              <div>
                <input type="number" placeholder="Sec" min="0" max="59" required value={formData.seconds} onChange={e => setFormData({
                ...formData,
                seconds: e.target.value
              })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-center text-gray-900 placeholder-gray-400" />
                <p className="text-xs text-gray-500 mt-1 text-center">Seconds*</p>
              </div>
              <div>
                <input type="number" placeholder="Ms" min="0" max="99" value={formData.milliseconds} onChange={e => setFormData({
                ...formData,
                milliseconds: e.target.value
              })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-center text-gray-900 placeholder-gray-400" />
                <p className="text-xs text-gray-500 mt-1 text-center">Centiseconds</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <Label htmlFor="placement" className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                   <Medal className="w-4 h-4" />
                   Placement
                </Label>
                <div className="relative">
                   <input type="number" id="placement" min="1" required value={formData.placement} onChange={e => setFormData({
                ...formData,
                placement: e.target.value
              })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-900" />
                   <div className="absolute right-3 top-3 text-sm font-bold text-blue-600">
                      {calculatePoints(formData.placement)} pts
                   </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">1st = 20pts, 2nd = 19pts...</p>
             </div>
             
             <div>
               <Label htmlFor="date" className="text-gray-700 font-semibold mb-2 block">
                 Date
               </Label>
               <input type="date" id="date" value={formData.date} onChange={e => setFormData({
              ...formData,
              date: e.target.value
            })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-900" />
             </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="competition" className="text-gray-700 font-semibold mb-2 block">
                Competition Name *
              </Label>
              <input type="text" id="competition" placeholder="e.g., State Championships, Club Meet" required value={formData.competition} onChange={e => setFormData({
              ...formData,
              competition: e.target.value
            })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 placeholder-gray-400" />
            </div>
            
            <div>
              <Label htmlFor="competitionLocation" className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </Label>
              <input type="text" id="competitionLocation" placeholder="e.g., Sydney, Australia" value={formData.competitionLocation} onChange={e => setFormData({
              ...formData,
              competitionLocation: e.target.value
            })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 placeholder-gray-400" />
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
            <Plus className="w-5 h-5 mr-2" />
            Log Time
          </Button>
        </form>
      </div>
    </motion.div>;
};
export default AddTimeForm;
