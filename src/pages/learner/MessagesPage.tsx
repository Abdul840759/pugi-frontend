import { useEffect, useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { progressService } from '@/services/progressService';
import type { Conversation } from '@/types';
import { cn } from '@/utils/cn';

function ConversationList({
  conversations,
  activeId,
  onSelect,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <div className="border-b border-slate-200 p-4 dark:border-slate-700">
        <h3 className="font-semibold">Conversations</h3>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={cn(
              'flex w-full items-center gap-3 border-b border-slate-100 p-4 text-left transition-colors dark:border-slate-800',
              activeId === conv.id ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800',
            )}
          >
            <img
              src={conv.participantAvatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.participantName}`}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium">{conv.participantName}</p>
                {conv.unreadCount > 0 && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs text-white">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-slate-500">{conv.lastMessage}</p>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

export function LearnerMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressService.getConversations().then((convos) => {
      setConversations(convos);
      if (convos[0]) setActiveId(convos[0].id);
    }).finally(() => setLoading(false));
  }, []);

  const handleSelect = (id: string) => {
    setActiveId(id);
    setShowChat(true);
  };

  if (loading) return <Loader fullScreen />;

  const active = conversations.find((c) => c.id === activeId);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className={cn(showChat && 'hidden md:block')}>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">Messages</h1>
        <p className="text-sm text-slate-500 sm:text-base">Chat with tutors and study groups</p>
      </div>

      <Card className="flex h-[calc(100dvh-9rem)] overflow-hidden p-0 sm:h-[calc(100dvh-12rem)] md:h-[calc(100vh-12rem)]">
        {/* Conversation list — full width on mobile, sidebar on desktop */}
        <div
          className={cn(
            'flex w-full shrink-0 flex-col border-slate-200 dark:border-slate-700',
            'md:w-72 md:border-r lg:w-80',
            showChat ? 'hidden md:flex' : 'flex',
          )}
        >
          <ConversationList
            conversations={conversations}
            activeId={activeId}
            onSelect={handleSelect}
          />
        </div>

        {/* Chat panel */}
        <div
          className={cn(
            'flex min-w-0 flex-1 flex-col',
            showChat ? 'flex' : 'hidden md:flex',
          )}
        >
          {active ? (
            <>
              <div className="flex items-center gap-3 border-b border-slate-200 p-3 sm:p-4 dark:border-slate-700">
                <button
                  onClick={() => setShowChat(false)}
                  className="rounded-lg p-1.5 hover:bg-slate-100 md:hidden dark:hover:bg-slate-800"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <img
                  src={active.participantAvatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${active.participantName}`}
                  alt=""
                  className="h-8 w-8 rounded-full md:hidden"
                />
                <p className="truncate font-semibold">{active.participantName}</p>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-3 scrollbar-thin sm:space-y-4 sm:p-4">
                {active.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'max-w-[85%] rounded-xl px-3 py-2 text-sm sm:max-w-[70%] sm:px-4',
                      msg.senderId === '1'
                        ? 'ml-auto bg-primary-600 text-white'
                        : 'bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white',
                    )}
                  >
                    <p className="break-words">{msg.content}</p>
                    <p className="mt-1 text-xs opacity-60">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 border-t border-slate-200 p-3 sm:p-4 dark:border-slate-700">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-w-0 flex-1"
                />
                <Button size="md" className="shrink-0"><Send className="h-4 w-4" /></Button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-4 text-center text-slate-500">
              Select a conversation
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
