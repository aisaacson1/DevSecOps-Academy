import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Trophy, Filter } from 'lucide-react';
import { supabase, Lesson, UserLessonProgress } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

type LessonWithProgress = Lesson & {
  progress?: UserLessonProgress;
};

export default function Lessons() {
  const { profile } = useAuth();
  const [lessons, setLessons] = useState<LessonWithProgress[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<LessonWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    loadLessons();
  }, [profile]);

  useEffect(() => {
    filterLessons();
  }, [lessons, selectedCategory, selectedDifficulty]);

  const loadLessons = async () => {
    if (!profile) return;

    const [lessonsResult, progressResult] = await Promise.all([
      supabase.from('lessons').select('*').eq('is_published', true).order('category').order('order_index'),
      supabase.from('user_lesson_progress').select('*').eq('user_id', profile.id),
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
    }

    setLoading(false);
  };

  const filterLessons = () => {
    let filtered = lessons;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((lesson) => lesson.category === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter((lesson) => lesson.difficulty === selectedDifficulty);
    }

    setFilteredLessons(filtered);
  };

  const categories = ['all', ...new Set(lessons.map((l) => l.category))];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

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
          <div className="text-slate-400">Loading lessons...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">All Lessons</h1>
          <p className="text-slate-400">Explore our comprehensive DevSecOps curriculum</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-slate-800">
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty} className="bg-slate-800">
                  {difficulty === 'all' ? 'All Levels' : difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredLessons.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-12 border border-white/10 text-center">
            <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-300 text-lg mb-2">No lessons found</p>
            <p className="text-slate-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
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
