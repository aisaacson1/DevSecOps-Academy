import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, CheckCircle, Clock } from 'lucide-react';
import { supabase, Lesson, Challenge } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>();
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    loadLesson();
  }, [id, profile]);

  const loadLesson = async () => {
    if (!id || !profile) return;

    const [lessonResult, challengesResult, progressResult] = await Promise.all([
      supabase.from('lessons').select('*').eq('id', id).maybeSingle(),
      supabase.from('challenges').select('*').eq('lesson_id', id),
      supabase.from('user_lesson_progress').select('*').eq('user_id', profile.id).eq('lesson_id', id).maybeSingle(),
    ]);

    if (lessonResult.data) {
      setLesson(lessonResult.data);
    }

    if (challengesResult.data) {
      setChallenges(challengesResult.data);
    }

    setProgress(progressResult.data);
    setLoading(false);
  };

  const handleComplete = async () => {
    if (!lesson || !profile || completing) return;

    setCompleting(true);

    try {
      if (progress) {
        await supabase
          .from('user_lesson_progress')
          .update({
            status: 'completed',
            progress_percentage: 100,
            completed_at: new Date().toISOString(),
          })
          .eq('id', progress.id);
      } else {
        await supabase.from('user_lesson_progress').insert({
          user_id: profile.id,
          lesson_id: lesson.id,
          status: 'completed',
          progress_percentage: 100,
          completed_at: new Date().toISOString(),
        });
      }

      await supabase
        .from('profiles')
        .update({
          xp: profile.xp + lesson.xp_reward,
          level: Math.floor((profile.xp + lesson.xp_reward) / 1000) + 1,
        })
        .eq('id', profile.id);

      await refreshProfile();
      await loadLesson();
    } catch (error) {
      console.error('Error completing lesson:', error);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Loading lesson...</div>
        </div>
      </Layout>
    );
  }

  if (!lesson) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/5 rounded-xl p-12 text-center">
            <p className="text-slate-300">Lesson not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  const isCompleted = progress?.status === 'completed';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                  {lesson.category}
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                  {lesson.difficulty}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
              <p className="text-slate-300 text-lg">{lesson.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center text-slate-400">
              <Clock className="w-4 h-4 mr-2" />
              {lesson.estimated_minutes} minutes
            </div>
            <div className="flex items-center text-green-400 font-semibold">
              <Trophy className="w-4 h-4 mr-2" />
              +{lesson.xp_reward} XP
            </div>
            {isCompleted && (
              <div className="flex items-center text-blue-400 font-semibold">
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Lesson Content</h2>

          <div className="prose prose-invert max-w-none">
            {Array.isArray(lesson.content) && lesson.content.length > 0 ? (
              lesson.content.map((section: any, index: number) => (
                <div key={index} className="mb-6">
                  {section.type === 'text' && (
                    <p className="text-slate-300 leading-relaxed">{section.content}</p>
                  )}
                  {section.type === 'heading' && (
                    <h3 className="text-xl font-bold text-white mt-6 mb-3">{section.content}</h3>
                  )}
                  {section.type === 'code' && (
                    <pre className="bg-slate-950 rounded-lg p-4 overflow-x-auto border border-white/10">
                      <code className="text-sm text-slate-300">{section.content}</code>
                    </pre>
                  )}
                  {section.type === 'list' && (
                    <ul className="list-disc list-inside text-slate-300 space-y-2">
                      {section.items.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            ) : (
              <p className="text-slate-300 leading-relaxed">
                This lesson content will guide you through the fundamentals of this topic.
                Complete this lesson to earn XP and unlock more advanced content.
              </p>
            )}
          </div>
        </div>

        {challenges.length > 0 && (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Practice Challenges</h2>
            <p className="text-slate-400 mb-6">Test your knowledge with these hands-on challenges</p>
            <div className="space-y-3">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">{challenge.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">{challenge.description}</p>
                    </div>
                    <span className="text-green-400 font-semibold text-sm">
                      +{challenge.xp_reward} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isCompleted && (
          <button
            onClick={handleComplete}
            disabled={completing}
            className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {completing ? (
              'Completing...'
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Complete Lesson & Earn {lesson.xp_reward} XP
              </>
            )}
          </button>
        )}

        {isCompleted && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-green-400 font-semibold text-lg">Lesson Completed!</p>
            <p className="text-slate-300 text-sm mt-1">You've earned {lesson.xp_reward} XP</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
