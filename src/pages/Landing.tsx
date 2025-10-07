import { Link } from 'react-router-dom';
import { Shield, Trophy, BookOpen, Target, Users, Zap, Lock, Code, GitBranch } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <nav className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold text-white">DevSecOps Academy</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-slate-300 hover:text-white px-4 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-3xl mb-6 border border-blue-500/30">
              <Shield className="w-10 h-10 text-blue-400" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Master DevSecOps Through
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> Gamification</span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Learn development, security, and operations practices in an engaging, game-like environment.
              From complete beginners to seasoned developers, level up your skills through interactive challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-xl transition-all hover:scale-105"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Learning Free
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-lg font-semibold rounded-xl border border-white/20 transition-all"
              >
                Explore Features
              </a>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-4 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Why Choose DevSecOps Academy?</h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                A comprehensive learning platform designed to make security and DevOps accessible and fun
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all">
                <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Trophy className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Earn Achievements</h3>
                <p className="text-slate-300 leading-relaxed">
                  Unlock badges and achievements as you complete lessons and challenges. Show off your expertise with legendary rare badges.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-green-500/50 transition-all">
                <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Level Up System</h3>
                <p className="text-slate-300 leading-relaxed">
                  Gain experience points and level up as you learn. Each level unlocks new content and advanced topics.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all">
                <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Interactive Lessons</h3>
                <p className="text-slate-300 leading-relaxed">
                  Learn through hands-on coding challenges, quizzes, and real-world security scenarios designed for all skill levels.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-orange-500/50 transition-all">
                <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Lock className="w-7 h-7 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Security Fundamentals</h3>
                <p className="text-slate-300 leading-relaxed">
                  Master secure coding practices, vulnerability assessment, and defensive programming techniques.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-cyan-500/50 transition-all">
                <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                  <GitBranch className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">CI/CD Pipeline Skills</h3>
                <p className="text-slate-300 leading-relaxed">
                  Build expertise in continuous integration, deployment automation, and modern DevOps workflows.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-pink-500/50 transition-all">
                <div className="w-14 h-14 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Track Progress</h3>
                <p className="text-slate-300 leading-relaxed">
                  Monitor your learning journey with detailed statistics, streak tracking, and personalized recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl p-12 border border-blue-500/30 text-center">
              <Code className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Level Up Your Skills?
              </h2>
              <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of learners mastering DevSecOps through our gamified platform. Start your journey today.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-xl transition-all hover:scale-105"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <p>&copy; 2025 DevSecOps Academy. Empowering developers with security knowledge.</p>
        </div>
      </footer>
    </div>
  );
}
