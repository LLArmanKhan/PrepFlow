import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Bot,
  Plus,
  ClipboardCheck,
  X,
  Sparkles,
  Trash2,
  BookOpen,
  FolderPlus,
  AlertCircle,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import Card from '../components/Card';
import { validateProgressForm, validateTopic, validateSubject } from '../utils/validators';

const DEFAULT_SUBJECTS = ['DBMS', 'OS', 'CN', 'OOPS', 'DSA', 'System Design'];

export default function Progress() {
  const { progress, addTopic, deleteTopic, loadingData } = useData();
  const [selectedSubject, setSelectedSubject] = useState('DBMS');
  const [customSubjects, setCustomSubjects] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [topicError, setTopicError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [subjectModalErrors, setSubjectModalErrors] = useState({});
  const [initialTopicName, setInitialTopicName] = useState('');

  const [showAiTestModal, setShowAiTestModal] = useState(false);
  const [aiTestSubject, setAiTestSubject] = useState('DBMS');
  const [aiTestTopic, setAiTestTopic] = useState('');

  const navigate = useNavigate();

  const knownSubjects = Array.from(
    new Set([
      ...DEFAULT_SUBJECTS,
      ...customSubjects,
      ...(progress.map((p) => p.subject) || []),
    ])
  );

  const currentSubjectDoc = progress.find(
    (p) => p.subject?.toUpperCase() === selectedSubject.toUpperCase()
  );

  const currentTopics = currentSubjectDoc?.topics || [];

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setTopicError('');

    const validation = validateProgressForm({
      subject: selectedSubject,
      topic: newTopicName,
    });

    if (!validation.isValid) {
      setTopicError(validation.errors.topic || validation.errors.subject || 'Please enter a valid topic.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addTopic(selectedSubject, newTopicName.trim());
      setNewTopicName('');
      setTopicError('');
      setShowAddModal(false);
    } catch (err) {
      setTopicError('Failed to save topic. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSubjectSubmit = async (e) => {
    e.preventDefault();
    setSubjectModalErrors({});

    const subjErr = validateSubject(newSubjectName);
    if (subjErr) {
      setSubjectModalErrors({ subject: subjErr });
      return;
    }

    if (initialTopicName.trim()) {
      const topErr = validateTopic(initialTopicName);
      if (topErr) {
        setSubjectModalErrors({ topic: topErr });
        return;
      }
    }

    const formattedSubject = newSubjectName.trim().toUpperCase();

    if (!customSubjects.includes(formattedSubject)) {
      setCustomSubjects((prev) => [...prev, formattedSubject]);
    }
    setSelectedSubject(formattedSubject);

    if (initialTopicName.trim()) {
      setIsSubmitting(true);
      try {
        await addTopic(formattedSubject, initialTopicName.trim());
      } catch (err) {
        console.error('Failed to add initial topic:', err);
      } finally {
        setIsSubmitting(false);
      }
    }

    setNewSubjectName('');
    setInitialTopicName('');
    setSubjectModalErrors({});
    setShowAddSubjectModal(false);
  };

  const handleDeleteTopic = async (topicItem) => {
    try {
      const progressId = topicItem?._id || topicItem?.id;
      if (progressId) {
        await deleteTopic(progressId);
      } else {
        await deleteTopic(null, selectedSubject);
      }
    } catch (err) {
      console.error('Failed to delete topic:', err);
    }
  };

  const handleOpenAiTestModal = (topicName = '', subject = selectedSubject) => {
    setAiTestSubject(subject);
    setAiTestTopic(topicName);
    setShowAiTestModal(true);
  };

  const handleStartAiTestSubmit = (e) => {
    e.preventDefault();
    if (!aiTestTopic.trim()) return;

    setShowAiTestModal(false);
    navigate('/assistant', {
      state: {
        startTest: true,
        subject: aiTestSubject,
        topic: aiTestTopic.trim(),
      },
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Progress</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track your completed topics and test your knowledge with AI
        </p>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {knownSubjects.map((subj) => (
          <button
            key={subj}
            onClick={() => setSelectedSubject(subj)}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedSubject.toUpperCase() === subj.toUpperCase()
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {subj}
          </button>
        ))}

        <button
          onClick={() => setShowAddSubjectModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-dashed border-slate-300 dark:border-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 dark:hover:border-blue-800 transition-all whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completed Topics List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{selectedSubject}</h2>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Completed Topics ({currentTopics.length})
            </span>
          </div>

          <div className="space-y-2.5">
            {currentTopics.map((topic, idx) => {
              const topicName = typeof topic === 'string' ? topic : topic.topic || topic.topicName || topic.name;
              const topicId = topic._id || topic.id || idx;
              const isAiTested = topic.completionType === 'Ai_Test' || topic.completionType === 'ai_test';

              return (
                <div
                  key={topicId}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs hover:border-slate-200 dark:hover:border-slate-700 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{topicName}</span>
                    {isAiTested && (
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        AI Tested
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500 text-white" />
                    <button
                      onClick={() => handleDeleteTopic(topic)}
                      className="p-1 text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete Topic"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {currentTopics.length === 0 && !loadingData && (
            <Card className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
              No topics completed for {selectedSubject} yet. Click "+ Add Topic Manually" below to log your study sessions!
            </Card>
          )}
        </div>

        {/* Right Encouragement Graphic Card */}
        <div className="hidden lg:block">
          <Card className="p-6 border-slate-200 dark:border-slate-800 flex flex-col items-center text-center justify-center h-full">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
                <ClipboardCheck className="w-10 h-10 stroke-[1.5]" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-md">
                <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-white" />
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">Great going!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              Every topic you log strengthens your preparation for technical interview rounds.
            </p>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => handleOpenAiTestModal('', selectedSubject)}
          className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-3 group cursor-pointer"
        >
          <div className="p-1.5 rounded-xl bg-white/20 text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="block text-sm font-bold">Take AI Test</span>
            <span className="block text-[11px] font-normal text-blue-100">Select topics & start test</span>
          </div>
        </button>

        <button
          onClick={() => setShowAddModal(true)}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <div className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Plus className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="block text-sm font-bold">Add Topic Manually</span>
            <span className="block text-[11px] font-normal text-slate-500 dark:text-slate-400">Add a topic you've completed</span>
          </div>
        </button>
      </div>

      {/* AI Test Topic Input Modal */}
      {showAiTestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Start AI Test</h3>
              </div>
              <button
                onClick={() => setShowAiTestModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStartAiTestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Subject
                </label>
                <select
                  value={aiTestSubject}
                  onChange={(e) => {
                    setAiTestSubject(e.target.value);
                    setAiTestTopic('');
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {knownSubjects.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Topic Name
                </label>
                <input
                  type="text"
                  required
                  value={aiTestTopic}
                  onChange={(e) => setAiTestTopic(e.target.value)}
                  placeholder="e.g. Normalization & BCNF, Process Synchronization..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Quick Select Chips from Completed Topics */}
              {currentTopics.length > 0 && (
                <div>
                  <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2">
                    Quick select from completed topics:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto no-scrollbar">
                    {currentTopics.map((t, idx) => {
                      const name = typeof t === 'string' ? t : t.topicName || t.name;
                      return (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setAiTestTopic(name)}
                          className={`px-2.5 py-1 rounded-lg text-xs transition-colors border cursor-pointer ${
                            aiTestTopic === name
                              ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAiTestModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!aiTestTopic.trim()}
                  className="px-5 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Bot className="w-4 h-4" />
                  <span>Start Test</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Add New Subject</h3>
              </div>
              <button
                onClick={() => {
                  setShowAddSubjectModal(false);
                  setSubjectModalErrors({});
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubjectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Subject / Track Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => {
                    setNewSubjectName(e.target.value);
                    if (subjectModalErrors.subject) {
                      setSubjectModalErrors((prev) => ({ ...prev, subject: undefined }));
                    }
                  }}
                  placeholder="e.g. COMPUTER NETWORKS, CLOUD COMPUTING..."
                  className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border ${
                    subjectModalErrors.subject
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                  } rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2`}
                />
                {subjectModalErrors.subject && (
                  <p className="text-[11px] text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                    <span>•</span> {subjectModalErrors.subject}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Initial Topic (Optional)
                </label>
                <input
                  type="text"
                  value={initialTopicName}
                  onChange={(e) => {
                    setInitialTopicName(e.target.value);
                    if (subjectModalErrors.topic) {
                      setSubjectModalErrors((prev) => ({ ...prev, topic: undefined }));
                    }
                  }}
                  placeholder="e.g. OSI Model & TCP/IP Architecture"
                  className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border ${
                    subjectModalErrors.topic
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                  } rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2`}
                />
                {subjectModalErrors.topic && (
                  <p className="text-[11px] text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                    <span>•</span> {subjectModalErrors.topic}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddSubjectModal(false);
                    setSubjectModalErrors({});
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Topic Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Add Topic to {selectedSubject}</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setTopicError('');
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Topic Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTopicName}
                  onChange={(e) => {
                    setNewTopicName(e.target.value);
                    if (topicError) setTopicError('');
                  }}
                  placeholder="e.g. B-Trees & B+ Trees Indexing"
                  className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border ${
                    topicError
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                  } rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2`}
                />
                {topicError && (
                  <p className="text-[11px] text-red-500 dark:text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{topicError}</span>
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setTopicError('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
