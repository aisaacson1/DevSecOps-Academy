import { useEffect, useState } from 'react';
import { Trophy, Award, BookOpen, Flame, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';

export default function Profile() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    completedLessons: 0,
    completedChallenges: 0,
    achievementsCount: 0,
    totalTimeSpent: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, [profile]);

  const loadProfileData = async () => {
    if (!profile) return;

    const [lessonsResult, challengesResult, achievementsResult, recentLessons] = await Promise.all([
      supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', profile.id)
        .eq('status', 'completed'),
      supabase
        .from('user_challenge_attempts')
        .select('*')
        .eq('user_id', profile.id)
        .eq('passed', true),
      supabase.from('user_achievements').select('*').eq('user_id', profile.id),
      supabase
        .from('user_lesson_progress')
        .select('*, lessons(title)')
        .eq('user_id', profile.id)
        .order('completed_at', { ascending: false })
        .limit(5),
    ]);

    const totalTime =
      lessonsResult.data?.reduce((sum, l) => sum + (l.time_spent_minutes || 0), 0) || 0;

    setStats({
      completedLessons: lessonsResult.data?.length || 0,
      completedChallenges: challengesResult.data?.length || 0,
      achievementsCount: achievementsResult.data?.length || 0,
      totalTimeSpent: totalTime,
    });

    setRecentActivity(recentLessons.data || []);
    setLoading(false);
  };

  const getLevelProgress = () => {
    const currentLevelXP = (profile?.level || 1 - 1) * 1000;
    const nextLevelXP = (profile?.level || 1) * 1000;
    const xpInLevel = (profile?.xp || 0) - currentLevelXP;
    const xpNeeded = nextLevelXP - currentLevelXP;
    return (xpInLevel / xpNeeded) * 100;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Loading profile...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center text-4xl font-bold text-white mx-auto mb-4">
                  {profile?.username?.[0]?.toUpperCase()}
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{profile?.username}</h2>
                <p className="text-slate-400">{profile?.bio || 'Learning DevSecOps'}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Level {profile?.level}</span>
                    <span className="text-slate-400 text-sm">
                      {profile?.xp} / {(profile?.level || 1) * 1000} XP
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full h-3 transition-all"
                      style={{ width: `${getLevelProgress()}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center text-slate-400">
                      <Flame className="w-5 h-5 mr-2 text-orange-400" />
                      Current Streak
                    </div>
                    <span className="text-white font-bold">{profile?.current_streak} days</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center text-slate-400">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                      Best Streak
                    </div>
                    <span className="text-white font-bold">{profile?.longest_streak} days</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center text-slate-400">
                      <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                      Member Since
                    </div>
                    <span className="text-white font-bold">
                      {profile?.created_at
                        ? new Date(profile.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Skills</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">Security</span>
                    <span className="text-sm text-white">75%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-red-500 rounded-full h-2" style={{ width: '75%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">Development</span>
                    <span className="text-sm text-white">60%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-blue-500 rounded-full h-2" style={{ width: '60%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">Operations</span>
                    <span className="text-sm text-white">45%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-green-500 rounded-full h-2" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-3xl font-bold text-white">{stats.completedLessons}</span>
                </div>
                <p className="text-slate-400">Lessons Completed</p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-3xl font-bold text-white">{stats.completedChallenges}</span>
                </div>
                <p className="text-slate-400">Challenges Completed</p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-3xl font-bold text-white">{stats.achievementsCount}</span>
                </div>
                <p className="text-slate-400">Achievements Earned</p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-400" />
                  </div>
                  <span className="text-3xl font-bold text-white">{stats.totalTimeSpent}</span>
                </div>
                <p className="text-slate-400">Minutes Learning</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
              {recentActivity.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No recent activity</p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {(activity as any).lessons?.title || 'Lesson'}
                          </p>
                          <p className="text-slate-400 text-sm">
                            {activity.status === 'completed' ? 'Completed' : 'In Progress'}
                          </p>
                        </div>
                      </div>
                      <span className="text-slate-400 text-sm">
                        {activity.completed_at
                          ? new Date(activity.completed_at).toLocaleDateString()
                          : 'Ongoing'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
