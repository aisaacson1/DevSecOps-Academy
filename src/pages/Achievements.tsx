import { useEffect, useState } from 'react';
import { Trophy, Lock, Award, Star } from 'lucide-react';
import { supabase, Achievement, UserAchievement } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

type AchievementWithEarned = Achievement & {
  earned?: UserAchievement;
};

export default function Achievements() {
  const { profile } = useAuth();
  const [achievements, setAchievements] = useState<AchievementWithEarned[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, [profile]);

  const loadAchievements = async () => {
    if (!profile) return;

    const [achievementsResult, userAchievementsResult] = await Promise.all([
      supabase.from('achievements').select('*').order('rarity'),
      supabase.from('user_achievements').select('*').eq('user_id', profile.id),
    ]);

    if (achievementsResult.data) {
      const earnedMap = new Map(
        (userAchievementsResult.data || []).map((ua) => [ua.achievement_id, ua])
      );

      const achievementsWithEarned = achievementsResult.data.map((achievement) => ({
        ...achievement,
        earned: earnedMap.get(achievement.id),
      }));

      setAchievements(achievementsWithEarned);
    }

    setLoading(false);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-slate-500 to-slate-600 border-slate-400';
      case 'rare':
        return 'from-blue-500 to-blue-600 border-blue-400';
      case 'epic':
        return 'from-purple-500 to-purple-600 border-purple-400';
      case 'legendary':
        return 'from-orange-500 to-orange-600 border-orange-400';
      default:
        return 'from-slate-500 to-slate-600 border-slate-400';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return <Star className="w-5 h-5" />;
      case 'epic':
        return <Trophy className="w-5 h-5" />;
      case 'rare':
        return <Award className="w-5 h-5" />;
      default:
        return <Trophy className="w-5 h-5" />;
    }
  };

  const earnedCount = achievements.filter((a) => a.earned).length;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Loading achievements...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Achievements</h1>
          <p className="text-slate-400">
            {earnedCount} of {achievements.length} achievements unlocked
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Progress</p>
              <p className="text-2xl font-bold text-white">
                {achievements.length > 0
                  ? Math.round((earnedCount / achievements.length) * 100)
                  : 0}
                % Complete
              </p>
            </div>
            <div className="w-32 h-32 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-white/10"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 56 * (1 - earnedCount / (achievements.length || 1))
                  }`}
                  className="text-blue-500 transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {achievements.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-12 border border-white/10 text-center">
            <Trophy className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-300 text-lg mb-2">No achievements available yet</p>
            <p className="text-slate-400">Check back soon for new achievements!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => {
              const isEarned = !!achievement.earned;

              return (
                <div
                  key={achievement.id}
                  className={`rounded-xl p-6 border transition-all ${
                    isEarned
                      ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} shadow-lg`
                      : 'bg-white/5 border-white/10 opacity-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        isEarned
                          ? 'bg-white/20 text-white'
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {isEarned ? (
                        getRarityIcon(achievement.rarity)
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isEarned ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {achievement.rarity}
                    </span>
                  </div>

                  <h3 className={`text-lg font-bold mb-2 ${isEarned ? 'text-white' : 'text-slate-400'}`}>
                    {achievement.name}
                  </h3>
                  <p className={`text-sm mb-4 ${isEarned ? 'text-white/80' : 'text-slate-500'}`}>
                    {achievement.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className={isEarned ? 'text-white/80' : 'text-slate-500'}>
                      {achievement.category}
                    </span>
                    <span className={`font-semibold ${isEarned ? 'text-white' : 'text-slate-400'}`}>
                      +{achievement.xp_bonus} XP
                    </span>
                  </div>

                  {isEarned && achievement.earned && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-xs text-white/70">
                        Earned {new Date(achievement.earned.earned_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
