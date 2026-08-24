import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bot,
  Send,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  Sparkles,
  ChevronRight,
  User,
  History,
  MessageSquare,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Clock,
  Trash2,
  Calendar,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import aiService from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';

export default function AiAssistant() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const testInitiatedRef = useRef(false);

  const [allRawChats, setAllRawChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'Explain deadlock in OS with examples',
    'What is normalization in DBMS (1NF to BCNF)?',
    'Difference between BFS and DFS',
    'Give me a medium level DSA problem to solve',
    'How to optimize my preparation strategy for SDE interviews?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getStarterMessage = () => ({
    id: 'starter-1',
    sender: 'assistant',
    text: `Hello ${user?.username || user?.firstName || 'there'}! 👋 I am your PrepFlow AI Assistant.\n\nI have access to your preparation progress, target role (${user?.targetRole || 'Software Engineer'}), goals, and GeeksforGeeks stats.\n\nAsk me anything about DSA, Operating Systems, DBMS, Computer Networks, System Design, or tailored interview preparation roadmaps!`,
    createdAt: new Date().toISOString(),
  });

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await aiService.getAllChats();
      const chatList = res.chats || res.data?.chats || (Array.isArray(res) ? res : []);

      if (Array.isArray(chatList)) {
        setAllRawChats(chatList);
      }
    } catch (err) {
      console.warn('Failed to load past chats:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    setMessages([getStarterMessage()]);
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (location.state?.startTest && !testInitiatedRef.current) {
      testInitiatedRef.current = true;
      const { subject, topic } = location.state;

      const userDisplayText = `Start AI Test on topic: "${topic}" (${subject || 'General'})`;
      const fullPrompt = `Please generate an interactive AI interview test on the topic "${topic}"${
        subject ? ` in ${subject}` : ''
      }.\n\nInclude:\n1. 3 Multiple Choice Questions (with options A, B, C, D)\n2. 2 Conceptual/Short Answer Interview Questions\n3. Provide explanations or answer hints at the end.`;

      triggerTestPrompt(userDisplayText, fullPrompt);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const triggerTestPrompt = async (displayText, promptText) => {
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: displayText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setActiveChatId(null);
    setLoading(true);

    try {
      const res = await aiService.askQuestion(promptText);
      const assistantText = res.result || res.response || res.answer || res.userResponse || 'Test generated!';
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: assistantText,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Prepend to raw chats in local state
      const newChatObj = {
        _id: `chat-${Date.now()}`,
        prompt: promptText,
        response: assistantText,
        createdAt: new Date().toISOString(),
      };
      setAllRawChats((prev) => [newChatObj, ...prev]);
      setActiveChatId(newChatObj._id);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: err.response?.data?.message || err.response?.data?.error || 'Sorry, I encountered an issue connecting to the AI service. Please make sure the backend is running.',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (textToSend) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: promptText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => {
      const isOnlyStarter = prev.length === 1 && prev[0].id === 'starter-1';
      return isOnlyStarter ? [userMsg] : [...prev, userMsg];
    });

    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await aiService.askQuestion(promptText);
      const assistantText = res.result || res.response || res.answer || res.userResponse || 'Here is your response.';
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: assistantText,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      const newChatObj = {
        _id: res.chat?._id || `chat-${Date.now()}`,
        prompt: promptText,
        response: assistantText,
        createdAt: new Date().toISOString(),
      };
      setAllRawChats((prev) => [newChatObj, ...prev.filter((c) => c._id !== newChatObj._id)]);
      setActiveChatId(newChatObj._id);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: err.response?.data?.message || err.response?.data?.error || 'Sorry, I could not generate a response. Please check your backend connection.',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([
      {
        id: Date.now(),
        sender: 'assistant',
        text: `Chat cleared! How can I assist you with your prep today, ${user?.username || 'there'}?`,
        createdAt: new Date().toISOString(),
      },
    ]);
    if (window.innerWidth < 1024) {
      setIsMobileSidebarOpen(false);
    }
  };

  const handleSelectRecentChat = (chat) => {
    setActiveChatId(chat._id);
    setMessages([
      {
        id: `${chat._id}-user`,
        sender: 'user',
        text: chat.prompt || 'Previous Question',
        createdAt: chat.createdAt,
      },
      {
        id: `${chat._id}-ai`,
        sender: 'assistant',
        text: chat.response || '',
        createdAt: chat.createdAt,
      },
    ]);
    if (window.innerWidth < 1024) {
      setIsMobileSidebarOpen(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const groupedChats = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = allRawChats.filter((c) => {
      const p = (c.prompt || '').toLowerCase();
      const r = (c.response || '').toLowerCase();
      return p.includes(query) || r.includes(query);
    });

    const groups = {
      Today: [],
      Yesterday: [],
      'Previous 7 Days': [],
      Older: [],
    };

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 86400000;
    const startOf7Days = startOfToday - 7 * 86400000;

    filtered.forEach((chat) => {
      const chatTime = chat.createdAt ? new Date(chat.createdAt).getTime() : startOfToday;
      if (chatTime >= startOfToday) {
        groups.Today.push(chat);
      } else if (chatTime >= startOfYesterday) {
        groups.Yesterday.push(chat);
      } else if (chatTime >= startOf7Days) {
        groups['Previous 7 Days'].push(chat);
      } else {
        groups.Older.push(chat);
      }
    });

    return groups;
  }, [allRawChats, searchQuery]);

  const renderFormattedText = (text) => {
    if (!text) return null;

    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index),
        });
      }
      parts.push({
        type: 'code',
        language: match[1] || 'plaintext',
        content: match[2].trim(),
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex),
      });
    }

    const renderTextSegment = (segmentText, segIdx) => {
      const lines = segmentText.split('\n');
      const hasTable = lines.some((l) => l.includes('|'));

      if (!hasTable) {
        return (
          <div key={segIdx} className="space-y-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
            {lines.map((line, lIdx) => {
              if (!line.trim()) return <div key={lIdx} className="h-1.5" />;

              // Headings
              if (line.startsWith('### ')) {
                return (
                  <h4 key={lIdx} className="text-sm font-bold text-slate-900 dark:text-white pt-2 pb-1">
                    {line.replace('### ', '')}
                  </h4>
                );
              }
              if (line.startsWith('## ')) {
                return (
                  <h3 key={lIdx} className="text-base font-bold text-slate-900 dark:text-white pt-3 pb-1 border-b border-slate-200 dark:border-slate-700">
                    {line.replace('## ', '')}
                  </h3>
                );
              }
              if (line.startsWith('# ')) {
                return (
                  <h2 key={lIdx} className="text-lg font-extrabold text-slate-900 dark:text-white pt-3 pb-1">
                    {line.replace('# ', '')}
                  </h2>
                );
              }

              const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ') || /^\d+\.\s/.test(line.trim());

              return (
                <p key={lIdx} className={`${isBullet ? 'pl-3' : ''} whitespace-pre-wrap`}>
                  {line}
                </p>
              );
            })}
          </div>
        );
      }

      const tableLines = [];
      const before = [];
      const after = [];
      let inTable = false;

      lines.forEach((line) => {
        if (line.trim().startsWith('|')) {
          inTable = true;
          tableLines.push(line);
        } else if (!inTable) {
          before.push(line);
        } else {
          after.push(line);
        }
      });

      const rows = tableLines
        .filter((l) => !l.includes(':---') && !l.includes('---'))
        .map((l) =>
          l
            .split('|')
            .filter((cell, i, arr) => i > 0 && i < arr.length - 1)
            .map((c) => c.trim().replace(/\*\*/g, ''))
        );

      const headers = rows[0] || [];
      const bodyRows = rows.slice(1);

      return (
        <div key={segIdx} className="space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100">
          {before.length > 0 && (
            <p className="whitespace-pre-wrap">{before.join('\n')}</p>
          )}

          {headers.length > 0 && (
            <div className="overflow-x-auto my-3 border border-slate-200 dark:border-slate-700 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200">
                  <tr>
                    {headers.map((h, i) => (
                      <th key={i} className="p-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {bodyRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {after.length > 0 && (
            <p className="whitespace-pre-wrap">{after.join('\n')}</p>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-3">
        {parts.map((part, idx) => {
          if (part.type === 'code') {
            return (
              <div key={idx} className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100">
                <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 text-[11px] font-mono text-slate-400 border-b border-slate-800">
                  <span>{part.language || 'code'}</span>
                  <button
                    onClick={() => handleCopy(part.content, `code-${idx}`)}
                    className="hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === `code-${idx}` ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === `code-${idx}` ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed text-emerald-300">
                  <code>{part.content}</code>
                </pre>
              </div>
            );
          }
          return renderTextSegment(part.content, idx);
        })}
      </div>
    );
  };

  const renderSidebarContent = () => {
    const hasAnyChats = Object.values(groupedChats).some((list) => list.length > 0);

    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-200 select-none">
        {/* Sidebar Top: Header & New Chat */}
        <div className="p-3.5 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Recent Chats
              </span>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
              {allRawChats.length}
            </span>
          </div>

          {/* Clear Chat Button */}
          <button
            id="sidebar-clear-chat-btn"
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer group select-none"
            title="Clear Chat and start fresh"
          >
            <Trash2 className="w-4 h-4 text-white shrink-0" />
            <span className="text-white font-bold text-xs">Clear Chat</span>
          </button>

          {/* Search filter for past conversations */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search previous chats..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Chats List Area */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4 no-scrollbar">
          {historyLoading ? (
            <div className="flex flex-col items-center justify-center h-36 text-slate-500 text-xs gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-blue-400" />
              <span>Loading chat history...</span>
            </div>
          ) : !hasAnyChats ? (
            <div className="text-center py-10 px-4 text-slate-400 text-xs">
              <MessageSquare className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-50" />
              <p className="font-semibold text-slate-400 mb-1">
                {searchQuery ? 'No matching chats found' : 'No previous chats yet'}
              </p>
              <p className="text-[11px] text-slate-500">
                {searchQuery
                  ? 'Try searching with another keyword'
                  : 'Start a conversation to see your history saved here.'}
              </p>
            </div>
          ) : (
            Object.entries(groupedChats).map(([groupTitle, list]) => {
              if (list.length === 0) return null;
              return (
                <div key={groupTitle} className="space-y-1">
                  <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                    {groupTitle}
                  </div>
                  {list.map((chat) => {
                    const isActive = activeChatId === chat._id;
                    const promptPreview = chat.prompt || 'Untitled Conversation';

                    return (
                      <button
                        key={chat._id}
                        onClick={() => handleSelectRecentChat(chat)}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer group relative ${
                          isActive
                            ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-xs'
                            : 'hover:bg-slate-800 text-slate-300 border border-transparent'
                        }`}
                      >
                        <MessageSquare
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isActive
                              ? 'text-blue-400'
                              : 'text-slate-500 group-hover:text-slate-300'
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-xs font-medium truncate ${
                              isActive ? 'text-blue-200' : 'text-slate-200 group-hover:text-white'
                            }`}
                          >
                            {promptPreview}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                            <span className="truncate max-w-[130px] opacity-75">
                              {chat.response ? chat.response.slice(0, 30) + '...' : ''}
                            </span>
                            <span className="shrink-0 text-[9px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {formatTimeAgo(chat.createdAt)}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer info */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Synced with Database</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-110px)] max-w-7xl mx-auto flex flex-col pb-2">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between shrink-0 mb-3 px-1">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-1 text-xs font-semibold"
          >
            <History className="w-4 h-4 text-blue-500" />
            <span>Recent Chats</span>
          </button>

          {/* Desktop Sidebar Toggle */}
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            title={isSidebarOpen ? 'Hide Recent Chats' : 'Show Recent Chats'}
          >
            {isSidebarOpen ? (
              <>
                <PanelLeftClose className="w-4 h-4 text-slate-500" />
                <span>Hide Sidebar</span>
              </>
            ) : (
              <>
                <PanelLeftOpen className="w-4 h-4 text-blue-500" />
                <span>Recent Chats ({allRawChats.length})</span>
              </>
            )}
          </button>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <span>PrepFlow AI Assistant</span>
          </h1>
        </div>

        <button
          onClick={handleNewChat}
          className="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Main Content Workspace Layout */}
      <div className="flex-1 flex gap-4 min-h-0 relative overflow-hidden">
        {/* Desktop Collapsible Sidebar */}
        {isSidebarOpen && (
          <div className="hidden lg:flex w-72 shrink-0 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
            {renderSidebarContent()}
          </div>
        )}

        {/* Mobile Slide-in Drawer Sidebar */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            {/* Drawer */}
            <div className="relative w-80 max-w-[85vw] h-full shadow-2xl z-10 flex flex-col">
              <div className="absolute right-3 top-3 z-20">
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
              {renderSidebarContent()}
            </div>
          </div>
        )}

        {/* Chat Conversation Area */}
        <Card className="flex-1 flex flex-col min-h-0 overflow-hidden p-4 sm:p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-1 no-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                {msg.sender === 'user' ? (
                  <div className="max-w-[85%] sm:max-w-[70%] bg-blue-600 text-white p-3.5 px-4 rounded-2xl rounded-tr-xs text-xs sm:text-sm font-medium shadow-xs">
                    {msg.text}
                  </div>
                ) : (
                  <div className="max-w-[95%] sm:max-w-[85%] bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4 sm:p-5 rounded-2xl rounded-tl-xs shadow-xs">
                    {renderFormattedText(msg.text)}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-700/80 text-slate-400 dark:text-slate-500">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="p-1 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 rounded cursor-pointer"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button className="p-1 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 rounded cursor-pointer" title="Helpful">
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 rounded cursor-pointer" title="Not helpful">
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {msg.createdAt && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {formatTimeAgo(msg.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold p-3 bg-blue-50 dark:bg-blue-950/60 rounded-xl w-fit">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>PrepFlow AI is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Pills */}
          <div className="pt-3 pb-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-medium hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-200 dark:hover:border-blue-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <span>{prompt}</span>
                <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              </button>
            ))}
          </div>

          {/* Bottom Input Area */}
          <div className="pt-2 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 relative"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about DSA, DBMS, OS, or System Design..."
                className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2">
              AI responses are generated directly via your PrepFlow backend integration.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

