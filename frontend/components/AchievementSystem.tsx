"use client";

import { useState } from "react";
import { 
  ACHIEVEMENTS, 
  getCurrentAchievement, 
  getNextAchievement, 
  getProgressToNext,
  getAllUnlockedAchievements 
} from "@/lib/achievements";
import { Trophy, Star, ChevronDown, ChevronUp, Lock, Unlock } from "lucide-react";

interface AchievementSystemProps {
  totalIssued: number;
}

export function AchievementSystem({ totalIssued }: AchievementSystemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const current = getCurrentAchievement(totalIssued);
  const next = getNextAchievement(totalIssued);
  const progress = getProgressToNext(totalIssued);
  const unlockedAchievements = getAllUnlockedAchievements(totalIssued);

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl overflow-hidden">
      {/* Current Achievement Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Trophy className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white text-xl font-bold">Achievement Status</h3>
              <p className="text-purple-300 text-sm">Track your institutional progress</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-purple-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-purple-400" />
            )}
          </button>
        </div>

        {/* Current Tier */}
        <div className="bg-gradient-to-br from-purple-950/50 to-indigo-950/50 border border-purple-500/20 rounded-xl p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{current.icon}</div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className={`text-lg font-bold ${current.color}`}>{current.name}</h4>
                  <span className="px-2 py-0.5 bg-purple-500/30 border border-purple-400/50 rounded-full text-xs font-semibold text-purple-300">
                    Tier {current.tier}
                  </span>
                </div>
                <p className="text-purple-200/70 text-sm">{current.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-white">{totalIssued}</div>
              <div className="text-xs text-purple-400">Issued</div>
            </div>
          </div>

          {/* Benefits */}
          {current.benefits && current.benefits.length > 0 && (
            <div className="mt-3 pt-3 border-t border-purple-500/20">
              <div className="text-xs font-semibold text-purple-300 mb-2">Unlocked Benefits:</div>
              <div className="grid grid-cols-1 gap-1">
                {current.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-purple-200/80">
                    <Unlock className="w-3 h-3 text-green-400" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Progress to Next */}
        {next && (
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-purple-300">Next: {next.name}</span>
                <span className="text-2xl">{next.icon}</span>
              </div>
              <span className="text-xs text-purple-400">
                {totalIssued} / {next.requiredIssued}
              </span>
            </div>
            
            <div className="h-3 bg-slate-900/50 rounded-full overflow-hidden mb-2">
              <div 
                className={`h-full bg-gradient-to-r ${next.gradient} transition-all duration-500 shadow-lg`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <p className="text-xs text-purple-300/70">
              {next.requiredIssued - totalIssued} more certificate{next.requiredIssued - totalIssued !== 1 ? 's' : ''} to unlock
            </p>
          </div>
        )}

        {!next && (
          <div className="bg-gradient-to-r from-yellow-950/50 to-amber-950/50 border border-yellow-500/30 rounded-xl p-4 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-yellow-300 font-bold">Maximum Achievement Unlocked!</p>
            <p className="text-yellow-200/70 text-sm mt-1">You've reached legendary status!</p>
          </div>
        )}
      </div>

      {/* All Achievements (Expanded) */}
      {isExpanded && (
        <div className="border-t border-purple-500/20 p-6 bg-slate-950/30">
          <h4 className="text-white font-bold mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-purple-400" />
            All Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
          </h4>
          
          <div className="grid grid-cols-1 gap-3">
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = totalIssued >= achievement.requiredIssued;
              
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isUnlocked
                      ? `bg-gradient-to-br ${achievement.gradient}/10 border-${achievement.gradient.split('-')[1]}-500/30`
                      : 'bg-slate-800/30 border-slate-700/30 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`text-3xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className={`font-bold ${isUnlocked ? achievement.color : 'text-gray-500'}`}>
                            {achievement.name}
                          </h5>
                          <span className="px-2 py-0.5 bg-slate-700/50 rounded-full text-xs text-slate-400">
                            T{achievement.tier}
                          </span>
                        </div>
                        <p className={`text-xs ${isUnlocked ? 'text-slate-300' : 'text-slate-500'}`}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isUnlocked ? (
                        <div className="flex items-center gap-1 text-green-400">
                          <Unlock className="w-4 h-4" />
                          <span className="text-xs font-semibold">Unlocked</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-500">
                          <Lock className="w-4 h-4" />
                          <span className="text-xs">{achievement.requiredIssued}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Benefits (only show for unlocked) */}
                  {isUnlocked && achievement.benefits && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="flex flex-wrap gap-2">
                        {achievement.benefits.map((benefit, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/5 rounded text-xs text-slate-300"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
