import React from 'react';
import { useSelector } from 'react-redux';
import { selectAllPosts } from '../features/posts/postsSlice';
import { selectAllPlatforms } from '../features/platforms/platformsSlice';
import PlatformIcon from './PlatformIcon';
import { BarChart3, TrendingUp, Heart } from 'lucide-react';

export const AnalyticsChart = ({ activePlatform, onSelectPlatform }) => {
  const posts = useSelector(selectAllPosts);
  const platforms = useSelector(selectAllPlatforms);

  // Compute metrics dynamically from the Redux store
  const stats = platforms.map(platform => {
    const platformPosts = posts.filter(p => p.platformId === platform.id);
    const postCount = platformPosts.length;
    
    // Sum all reactions for this platform
    const totalReactions = platformPosts.reduce((acc, p) => {
      const rx = p.reactions || {};
      return acc + (rx.thumbsUp || 0) + (rx.heart || 0) + (rx.rocket || 0) + (rx.eyes || 0);
    }, 0);

    return {
      ...platform,
      count: postCount,
      reactions: totalReactions
    };
  });

  const maxCount = Math.max(1, ...stats.map(s => s.count));
  const maxReactions = Math.max(1, ...stats.map(s => s.reactions));

  // Chart SVG Coordinates config
  const chartHeight = 120;
  const paddingX = 40;
  const colWidth = 70;
  const gap = 30;

  return (
    <div className="glass-panel p-5 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
            <BarChart3 size={16} className="text-[#d946ef]" />
            Engagement Analytics
          </h3>
          <p className="text-xs text-gray-400">
            Comparing post volume and audience reactions across platforms
          </p>
        </div>
        
        {/* Legends */}
        <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-wider text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
            Post Count
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#d946ef]" />
            Reactions
          </div>
        </div>
      </div>

      {/* Main SVG Chart Container */}
      <div className="relative w-full h-[180px] flex items-center justify-center">
        <svg viewBox="0 0 420 180" className="w-full h-full overflow-visible">
          {/* Grid lines */}
          <line x1="30" y1="20" x2="390" y2="20" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
          <line x1="30" y1="70" x2="390" y2="70" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
          <line x1="30" y1="120" x2="390" y2="120" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
          <line x1="30" y1="145" x2="390" y2="145" stroke="rgba(255,255,255,0.06)" />

          {stats.map((item, index) => {
            const x = paddingX + index * (colWidth + gap);
            
            // Calculate height ratios
            const barHeight = (item.count / maxCount) * 100;
            const barY = 145 - barHeight;
            
            // Reactions line height ratios
            const rxHeight = (item.reactions / maxReactions) * 90;
            const rxY = 145 - rxHeight;
            
            const isActive = activePlatform === item.id;
            
            return (
              <g 
                key={item.id} 
                className="cursor-pointer group"
                onClick={() => onSelectPlatform(isActive ? null : item.id)}
              >
                {/* Interactive hover background column */}
                <rect
                  x={x - 10}
                  y="10"
                  width={colWidth + 20}
                  height="145"
                  fill="transparent"
                  className="group-hover:fill-white/[0.015] transition-colors rounded-lg"
                  rx="8"
                />

                {/* Post Count Bar */}
                <rect
                  x={x}
                  y={barY}
                  width="18"
                  height={barHeight}
                  rx="4"
                  fill={item.color}
                  opacity={activePlatform && !isActive ? 0.25 : 0.85}
                  className="transition-all duration-300 group-hover:opacity-100"
                  style={{ transformOrigin: `${x}px 145px` }}
                />

                {/* Reaction Count Bar (offset slightly) */}
                <rect
                  x={x + 22}
                  y={rxY}
                  width="18"
                  height={rxHeight}
                  rx="4"
                  fill="#d946ef"
                  opacity={activePlatform && !isActive ? 0.15 : 0.65}
                  className="transition-all duration-300 group-hover:opacity-90"
                  style={{ transformOrigin: `${x + 22}px 145px` }}
                />

                {/* Tooltip on Hover */}
                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  {/* Background tooltip */}
                  <rect
                    x={x - 15}
                    y={Math.min(barY, rxY) - 35}
                    width="85"
                    height="28"
                    rx="4"
                    fill="#121626"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                  />
                  <text
                    x={x + 27}
                    y={Math.min(barY, rxY) - 17}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="var(--font-main)"
                  >
                    {item.count} posts • {item.reactions} rx
                  </text>
                </g>

                {/* X-axis labels (Platform abbreviation or icon) */}
                <text
                  x={x + 20}
                  y="165"
                  textAnchor="middle"
                  fill={isActive ? '#fff' : '#64748b'}
                  fontSize="10"
                  fontWeight={isActive ? 'bold' : 'normal'}
                  fontFamily="var(--font-main)"
                  className="transition-colors group-hover:fill-white"
                >
                  {item.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
        <div className="sub-panel flex flex-col gap-1 items-center justify-center text-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">Total Posts</span>
          <span className="text-xl font-bold font-display text-white">{posts.length}</span>
        </div>
        <div className="sub-panel flex flex-col gap-1 items-center justify-center text-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">Total Reach</span>
          <span className="text-xl font-bold font-display text-indigo-400 flex items-center gap-1">
            <TrendingUp size={14} />
            {posts.length * 1250}
          </span>
        </div>
        <div className="sub-panel flex flex-col gap-1 items-center justify-center text-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">Total Reactions</span>
          <span className="text-xl font-bold font-display text-rose-400 flex items-center gap-1">
            <Heart size={14} className="fill-rose-500/20" />
            {posts.reduce((sum, p) => sum + Object.values(p.reactions || {}).reduce((s, v) => s + v, 0), 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;
