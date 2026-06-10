import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ELEMENTS, RARITY_NAMES } from '@/data/gameData';
import { cn } from '@/lib/utils';
import type { CollectedCard, CardTag } from '@/types/game';
import { X, Tag, Plus, Trash2, Edit2, Check, StickyNote } from 'lucide-react';

interface CardNoteModalProps {
  card: CollectedCard;
  onClose: () => void;
}

const PRESET_COLORS = [
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
];

export default function CardNoteModal({ card, onClose }: CardNoteModalProps) {
  const { getCardNote, saveCardNote, deleteCardNote, getCardTags, addCardTag, updateCardTag, deleteCardTag } = useGameStore();
  
  const [noteContent, setNoteContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<CardTag[]>([]);
  const [showTagManager, setShowTagManager] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(PRESET_COLORS[0]);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editTagName, setEditTagName] = useState('');
  const [editTagColor, setEditTagColor] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const note = getCardNote(card.id);
    if (note) {
      setNoteContent(note.content);
      setSelectedTags(note.tags);
    }
    setTags(getCardTags());
  }, [card.id, getCardNote, getCardTags]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  };

  const handleSave = () => {
    const result = saveCardNote(card.id, noteContent, selectedTags);
    if (result) {
      showMessage('备注已保存');
      setTimeout(() => onClose(), 500);
    }
  };

  const handleDelete = () => {
    if (deleteCardNote(card.id)) {
      showMessage('备注已删除');
      setTimeout(() => onClose(), 500);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleAddTag = () => {
    if (!newTagName.trim()) {
      showMessage('请输入标签名称');
      return;
    }
    const newTag = addCardTag(newTagName.trim(), newTagColor);
    if (newTag) {
      setTags(getCardTags());
      setSelectedTags((prev) => [...prev, newTag.id]);
      setNewTagName('');
      showMessage('标签已添加');
    }
  };

  const startEditTag = (tag: CardTag) => {
    setEditingTagId(tag.id);
    setEditTagName(tag.name);
    setEditTagColor(tag.color);
  };

  const saveEditTag = () => {
    if (!editingTagId || !editTagName.trim()) return;
    if (updateCardTag(editingTagId, editTagName.trim(), editTagColor)) {
      setTags(getCardTags());
      setEditingTagId(null);
      showMessage('标签已更新');
    }
  };

  const handleDeleteTag = (tagId: string) => {
    if (deleteCardTag(tagId)) {
      setTags(getCardTags());
      setSelectedTags((prev) => prev.filter((t) => t !== tagId));
      showMessage('标签已删除');
    }
  };

  const element = ELEMENTS[card.element];
  const hasNote = noteContent.trim() || selectedTags.length > 0;

  const rarityColors: Record<string, string> = {
    common: 'text-gray-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-amber-400',
  };

  const rarityBgColors: Record<string, string> = {
    common: 'from-gray-500/20 to-gray-700/20 border-gray-500/30',
    rare: 'from-blue-500/20 to-blue-700/20 border-blue-500/30',
    epic: 'from-purple-500/20 to-purple-700/20 border-purple-500/30',
    legendary: 'from-amber-500/20 to-orange-600/20 border-amber-500/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-3xl border-2 border-emerald-500/30 shadow-2xl overflow-hidden animate-rise">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">📝</div>
              <div>
                <h2
                  className="text-2xl font-bold text-gradient-gold"
                  style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                  卡牌备注
                </h2>
                <p className="text-white/50 text-sm">记录使用心得、组合思路</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-white/70 hover:text-white transition-all flex items-center justify-center border border-white/10 hover:border-white/30"
            >
              <X size={20} />
            </button>
          </div>

          <div className={cn(
            'mb-6 p-4 rounded-xl border bg-slate-800/50',
            rarityBgColors[card.rarity]
          )}>
            <div className="flex items-center gap-4">
              <div className="text-5xl">{element.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">{card.name}</h3>
                <div className={cn('text-sm font-semibold mb-1', rarityColors[card.rarity])}>
                  {RARITY_NAMES[card.rarity]}
                </div>
                <p className="text-white/60 text-sm">{card.description}</p>
              </div>
              <div className="text-right">
                <div className="text-amber-400 font-bold text-lg">⚔️ {card.power}</div>
                <div className="text-white/40 text-xs">持有 ×{card.count}</div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
                <StickyNote size={16} />
                备注内容
              </label>
              <span className="text-xs text-white/40">{noteContent.length} 字</span>
            </div>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="写下这张卡牌的使用心得、组合思路、战术笔记..."
              className="w-full h-40 px-4 py-3 rounded-xl bg-slate-800/70 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 resize-none transition-all"
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
                <Tag size={16} />
                标签分类
              </label>
              <button
                onClick={() => setShowTagManager(!showTagManager)}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
              >
                <Plus size={14} />
                管理标签
              </button>
            </div>

            {tags.length === 0 ? (
              <p className="text-white/40 text-sm py-4 text-center">还没有标签，点击"管理标签"创建</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5',
                      selectedTags.includes(tag.id)
                        ? 'text-white ring-2 ring-offset-2 ring-offset-slate-900 scale-105'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
                    )}
                    style={{
                      backgroundColor: selectedTags.includes(tag.id) ? tag.color : undefined,
                      ringColor: selectedTags.includes(tag.id) ? tag.color : undefined,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </button>
                ))}
              </div>
            )}

            {showTagManager && (
              <div className="mt-4 p-4 rounded-xl bg-slate-800/50 border border-white/10">
                <h4 className="text-sm font-semibold text-white/80 mb-3">标签管理</h4>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="新标签名称"
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <div className="flex gap-1">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewTagColor(color)}
                        className={cn(
                          'w-6 h-6 rounded-full transition-transform',
                          newTagColor === color ? 'scale-125 ring-2 ring-white' : ''
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleAddTag}
                    className="px-3 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 transition-colors"
                  >
                    添加
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-700/30"
                    >
                      {editingTagId === tag.id ? (
                        <>
                          <input
                            type="text"
                            value={editTagName}
                            onChange={(e) => setEditTagName(e.target.value)}
                            className="flex-1 px-2 py-1 rounded bg-slate-600/50 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            onKeyDown={(e) => e.key === 'Enter' && saveEditTag()}
                            autoFocus
                          />
                          <div className="flex gap-1">
                            {PRESET_COLORS.map((color) => (
                              <button
                                key={color}
                                onClick={() => setEditTagColor(color)}
                                className={cn(
                                  'w-4 h-4 rounded-full transition-transform',
                                  editTagColor === color ? 'scale-125 ring-1 ring-white' : ''
                                )}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <button
                            onClick={saveEditTag}
                            className="p-1 text-emerald-400 hover:text-emerald-300"
                          >
                            <Check size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                          <span className="flex-1 text-white/80 text-sm">{tag.name}</span>
                          <button
                            onClick={() => startEditTag(tag)}
                            className="p-1 text-white/40 hover:text-white/60 transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag.id)}
                            className="p-1 text-red-400/60 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {hasNote && (
              <button
                onClick={handleDelete}
                className="px-4 py-3 rounded-xl bg-red-500/20 text-red-400 font-semibold hover:bg-red-500/30 transition-all flex items-center gap-2 border border-red-500/30"
              >
                <Trash2 size={18} />
                删除备注
              </button>
            )}
            <div className="flex-1" />
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-slate-700/50 text-white/70 hover:bg-slate-600/50 font-semibold transition-all"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2"
            >
              <Check size={18} />
              保存备注
            </button>
          </div>
        </div>

        {message && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl bg-slate-900/90 border border-emerald-500/50 text-emerald-400 font-semibold z-20 animate-bounce-in">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
