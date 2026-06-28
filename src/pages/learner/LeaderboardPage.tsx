import { useEffect, useState } from 'react';
import { Trophy, Flame, Star, Medal } from 'lucide-react';
import { Loader } from '@/components/ui/Loader';
import { useAuthContext } from '@/context/AuthContext';

export function LeaderboardPage() {
  const [board,   setBoard]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    fetch('/api/progress/leaderboard', {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
      .then(r => r.json())
      .then(setBoard)
      .finally(() => setLoading(false));
  }, []);

  const rankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-gray-500';
  };

  const rankBg = (rank: number) => {
    if (rank === 1) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    if (rank === 2) return 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600';
    if (rank === 3) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
    return 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700';
  };

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Medal size={18} className="text-yellow-500" />;
    if (rank === 2) return <Medal size={18} className="text-gray-400" />;
    if (rank === 3) return <Medal size={18} className="text-amber-600" />;
    return rank;
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader /></div>;

  const myRank = board.find(u => u.email === user?.email);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Trophy size={24} className="text-yellow-500" /> Weekly Leaderboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Top learners ranked by XP earned</p>
      </div>

      {/* My rank card */}
      {myRank && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            #{myRank.rank}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-blue-900 dark:text-blue-100">Your Ranking</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">{myRank.xp} XP · Level {myRank.level} · <span className="inline-flex items-center gap-0.5">{myRank.streak} day streak <Flame size={12} className="text-orange-500" /></span></p>
          </div>
          <Star size={20} className="text-blue-500" />
        </div>
      )}

      {/* Top 3 podium */}
      {board.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-2">
          {/* 2nd place */}
          <div className="flex flex-col items-center pt-6">
            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-2xl mb-2">
              {board[1]?.name?.[0]?.toUpperCase()}
            </div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center truncate w-full px-1">{board[1]?.name}</p>
            <p className="text-xs text-gray-500">{board[1]?.xp} XP</p>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-t-lg mt-2 h-16 flex items-center justify-center">
              <Medal size={28} className="text-gray-400" />
            </div>
          </div>

          {/* 1st place */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-yellow-200 dark:bg-yellow-800 flex items-center justify-center text-2xl mb-2 ring-4 ring-yellow-400">
              {board[0]?.name?.[0]?.toUpperCase()}
            </div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center truncate w-full px-1">{board[0]?.name}</p>
            <p className="text-xs text-yellow-600 font-bold">{board[0]?.xp} XP</p>
            <div className="w-full bg-yellow-400 rounded-t-lg mt-2 h-24 flex items-center justify-center">
              <Medal size={32} className="text-yellow-700" />
            </div>
          </div>

          {/* 3rd place */}
          <div className="flex flex-col items-center pt-10">
            <div className="w-14 h-14 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-2xl mb-2">
              {board[2]?.name?.[0]?.toUpperCase()}
            </div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center truncate w-full px-1">{board[2]?.name}</p>
            <p className="text-xs text-gray-500">{board[2]?.xp} XP</p>
            <div className="w-full bg-amber-600 rounded-t-lg mt-2 h-10 flex items-center justify-center">
              <Medal size={28} className="text-amber-900" />
            </div>
          </div>
        </div>
      )}

      {/* Full list */}
      <div className="space-y-2">
        {board.map((entry) => (
          <div
            key={entry.id}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${rankBg(entry.rank)} ${entry.email === user?.email ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className={`w-8 text-center font-bold text-lg ${rankColor(entry.rank)}`}>
              {rankIcon(entry.rank)}
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              {entry.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white truncate">
                {entry.name} {entry.email === user?.email && <span className="text-xs text-blue-500 ml-1">(You)</span>}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span>Level {entry.level}</span>
                <span className="flex items-center gap-1"><Flame size={10} className="text-orange-500" /> {entry.streak}d streak</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-gray-900 dark:text-white">{entry.xp.toLocaleString()}</p>
              <p className="text-xs text-gray-500">XP</p>
            </div>
          </div>
        ))}
      </div>

      {board.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Trophy size={48} className="mx-auto mb-4 opacity-30" />
          <p>No learners yet. Be the first!</p>
        </div>
      )}
    </div>
  );
}
