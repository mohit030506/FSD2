import React from 'react';
import { useSelector } from 'react-redux';
import { selectAllPlatforms } from '../features/platforms/platformsSlice';
import PlatformIcon from './PlatformIcon';

export const PlatformStats = ({ activePlatform, onSelectPlatform }) => {
  const platforms = useSelector(selectAllPlatforms);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {platforms.map((platform) => {
        const isActive = activePlatform === platform.id;
        
        // Define dynamic border and shadow variables depending on platform
        const themeColor = platform.color;
        
        return (
          <div
            key={platform.id}
            onClick={() => onSelectPlatform(isActive ? null : platform.id)}
            className={`glass-panel p-4 cursor-pointer relative overflow-hidden flex flex-col justify-between h-28 ${
              isActive 
                ? 'border-[rgba(255,255,255,0.25)] shadow-lg' 
                : 'opacity-85'
            }`}
            style={{
              borderColor: isActive ? themeColor : '',
              boxShadow: isActive ? `0 0 15px -3px ${themeColor}40` : ''
            }}
          >
            {/* Background platform color glow */}
            <div 
              className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-2xl opacity-20 transition-all duration-300"
              style={{ backgroundColor: themeColor }}
            />
            
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {platform.name}
              </span>
              <PlatformIcon type={platform.id} size={20} />
            </div>
            
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-tight font-display text-white">
                {platform.count || 0}
              </span>
              <span className="text-xs text-gray-400">posts</span>
            </div>
            
            {/* Active highlight indicator */}
            {isActive && (
              <div 
                className="absolute top-0 left-0 w-full h-[3px]"
                style={{ background: `linear-gradient(90deg, ${themeColor}, transparent)` }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PlatformStats;
