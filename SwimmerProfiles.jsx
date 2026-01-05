import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, Plus, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Dashboard from '@/components/Dashboard';

const SwimmerProfiles = ({ swimmers, times, onAddSwimmer, onDeleteTime }) => {
  const [selectedSwimmerId, setSelectedSwimmerId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newSwimmer, setNewSwimmer] = useState({ name: '', location: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newSwimmer.name && newSwimmer.location) {
      onAddSwimmer(newSwimmer);
      setNewSwimmer({ name: '', location: '' });
      setIsAdding(false);
    }
  };

  const selectedSwimmer = swimmers.find(s => s.id === selectedSwimmerId);
  const swimmerTimes = selectedSwimmerId ? times.filter(t => t.swimmerId === selectedSwimmerId) : [];

  // Individual Swimmer View
  if (selectedSwimmer) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <Button
          variant="ghost"
          onClick={() => setSelectedSwimmerId(null)}
          className="mb-4 text-gray-600 hover:text-blue-600 pl-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Profiles
        </Button>
        
        <Dashboard 
          times={swimmerTimes} 
          onDeleteTime={onDeleteTime}
          swimmer={selectedSwimmer} 
        />
      </motion.div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      {!isAdding ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4"
        >
           <button
            onClick={() => setIsAdding(true)}
            className="w-full py-4 border-2 border-dashed border-blue-200 rounded-xl text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center justify-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add New Swimmer Profile
          </button>

          {swimmers.map((swimmer) => {
            const swimmerPoints = times
              .filter(t => t.swimmerId === swimmer.id)
              .reduce((sum, t) => sum + (t.points || 0), 0);

            return (
              <motion.div
                key={swimmer.id}
                onClick={() => setSelectedSwimmerId(swimmer.id)}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                      {swimmer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {swimmer.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {swimmer.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-lg font-bold text-gray-900">{swimmerPoints}</p>
                      <p className="text-xs text-gray-500">Points</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md mx-auto"
        >
          <h2 className="text-2xl font-bold mb-6">Create Swimmer Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <input
                id="name"
                required
                value={newSwimmer.name}
                onChange={e => setNewSwimmer({...newSwimmer, name: e.target.value})}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="e.g. Michael Phelps"
              />
            </div>
            <div>
              <Label htmlFor="location">Location / Team</Label>
              <input
                id="location"
                required
                value={newSwimmer.location}
                onChange={e => setNewSwimmer({...newSwimmer, location: e.target.value})}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="e.g. Baltimore, MD"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Create Profile
              </Button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default SwimmerProfiles;
