import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, BookOpen, Target, Flame, Clock, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Lesson, UserLessonProgress } from '../lib/supabase';
import Layout from '../components/Layout';

type LessonWithProgress = Lesson & {
  progress?: UserLessonProgress;
};

export default function Dashboard() {
  const { profile } = useAuth();
  const [lessons, setLessons] = useState<LessonWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completedLessons: 0,
    totalXP: 0,
    achievementsCount: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, [profile]);

  const loadDashboardData = async () => {
    if (!profile) return;

    const [lessonsResult, progressResult, achievementsResult] = await Promise.all([
      supabase.from('lessons').select('*').eq('is_published', true).order('order_index'),
      supabase.from('user_lesson_progress').select('*').eq('user_id', profile.id),
      supabase.from('user_achievements').select('*').eq('user_id', profile.id),
    ]);

    if (lessonsResult.data) {
      const progressMap = new Map(
        (progressResult.data || []).map((p) => [p.lesson_id, p])
      );

      const lessonsWithProgress = lessonsResult.data.map((lesson) => ({
        ...lesson,
        progress: progressMap.get(lesson.id),
      }));

      setLessons(lessonsWithProgress);

      const completed = progressResult.data?.filter((p) => p.status === 'completed').length || 0;
      setStats({
        completedLessons: completed,
        totalXP: profile.xp,
        achievementsCount: achievementsResult.data?.length || 0,
      });
    }

    setLoading(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'intermediate':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'advanced':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      security: 'bg-red-500/10 text-red-400',
      development: 'bg-blue-500/10 text-blue-400',
      operations: 'bg-green-500/10 text-green-400',
      cicd: 'bg-purple-500/10 text-purple-400',
      automation: 'bg-cyan-500/10 text-cyan-400',
    };
    return colors[category] || 'bg-slate-500/10 text-slate-400';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {profile?.username}!
          </h1>
          <p className="text-slate-400">Continue your DevSecOps learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-white">Lvl {profile?.level}</span>
            </div>
            <p className="text-sm text-slate-400">Current Level</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.totalXP}</span>
            </div>
            <p className="text-sm text-slate-400">Total XP</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.completedLessons}</span>
            </div>
            <p className="text-sm text-slate-400">Lessons Completed</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-orange-400" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.achievementsCount}</span>
            </div>
            <p className="text-sm text-slate-400">Achievements</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-500/30 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-500/30 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">{profile?.current_streak} Day Streak!</p>
                <p className="text-slate-300 text-sm">Keep learning to maintain your streak</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-orange-400 font-bold text-xl">{profile?.longest_streak}</p>
              <p className="text-slate-400 text-sm">Best Streak</p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Available Lessons</h2>
          <Link to="/lessons" className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
            View All →
          </Link>
        </div>

        {lessons.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-12 border border-white/10 text-center">
            <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-300 text-lg mb-2">No lessons available yet</p>
            <p className="text-slate-400">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.slice(0, 6).map((lesson) => (
              <Link
                key={lesson.id}
                to={`/lessons/${lesson.id}`}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(lesson.category)}`}>
                    {lesson.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(lesson.difficulty)}`}>
                    {lesson.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{lesson.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-slate-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {lesson.estimated_minutes} min
                  </div>
                  <div className="flex items-center text-green-400 font-semibold">
                    <Trophy className="w-4 h-4 mr-1" />
                    +{lesson.xp_reward} XP
                  </div>
                </div>

                {lesson.progress && (
                  <div className="mt-4">
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-blue-500 rounded-full h-2 transition-all"
                        style={{ width: `${lesson.progress.progress_percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {lesson.progress.status === 'completed' ? 'Completed' : `${lesson.progress.progress_percentage}% complete`}
                    </p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
