import { useGameStore } from '@/store/gameStore';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getAvailableAvatars } from '@/lib/gameSave';

export default function AccountManager() {
  const { 
    accounts, 
    currentAccount, 
    createNewAccount, 
    removeAccount, 
    switchAccount, 
    modifyAccount,
    setShowAccountManager,
  } = useGameStore();

  const [showCreateForm, setShowCreateForm] = useState(accounts.length === 0);
  const [newAccountName, setNewAccountName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🗡️');
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const avatars = getAvailableAvatars();

  const handleCreateAccount = () => {
    if (!newAccountName.trim()) return;
    createNewAccount(newAccountName, selectedAvatar);
    setNewAccountName('');
    setShowCreateForm(false);
  };

  const handleDeleteAccount = (accountId: string) => {
    if (!confirm('确定要删除此账号吗？所有存档将被清除，此操作不可撤销！')) return;
    removeAccount(accountId);
    setEditingAccount(null);
  };

  const handleStartEdit = () => {
    if (!currentAccount) return;
    setEditingAccount(currentAccount.id);
    setEditName(currentAccount.name);
  };

  const handleSaveEdit = () => {
    if (!editingAccount || !editName.trim()) return;
    modifyAccount({ name: editName.trim() });
    setEditingAccount(null);
  };

  const handleSelectAvatar = (accountId: string, avatar: string) => {
    if (currentAccount?.id === accountId) {
      modifyAccount({ avatar });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 max-w-2xl w-full mx-4 border border-amber-500/30 shadow-2xl shadow-amber-500/10 animate-rise">
        <h2 
          className="text-3xl font-bold text-center mb-6 text-gradient-gold"
          style={{ fontFamily: "'Cinzel Decorative', serif" }}
        >
          👤 账号管理
        </h2>

        {accounts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white/80 mb-3">选择账号</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {accounts.map((account) => {
                const isCurrent = currentAccount?.id === account.id;
                const isEditing = editingAccount === account.id;

                return (
                  <div
                    key={account.id}
                    className={cn(
                      'relative p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer',
                      isCurrent
                        ? 'border-amber-500 bg-gradient-to-br from-amber-500/20 to-orange-500/10 shadow-lg shadow-amber-500/20'
                        : 'border-white/10 bg-slate-800/50 hover:border-amber-500/40 hover:bg-slate-700/50'
                    )}
                    onClick={() => !isEditing && switchAccount(account.id)}
                  >
                    {isCurrent && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                        ✓
                      </div>
                    )}

                    <div className="text-center">
                      <div className="text-5xl mb-2">{account.avatar}</div>

                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 rounded-lg bg-slate-700 text-white text-center border border-amber-500/50 focus:outline-none focus:border-amber-400"
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                      ) : (
                        <div className="font-bold text-white truncate">{account.name}</div>
                      )}

                      <div className="text-xs text-white/40 mt-1">
                        {new Date(account.lastPlayedAt).toLocaleDateString('zh-CN')}
                      </div>

                      {isCurrent && (
                        <div className="text-xs text-amber-400 mt-1">当前账号</div>
                      )}
                    </div>

                    {isCurrent && !isEditing && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit();
                          }}
                          className="flex-1 px-2 py-1 text-xs rounded-lg bg-slate-700/80 hover:bg-slate-600 text-white/80 transition-all"
                        >
                          ✏️ 改名
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAccount(account.id);
                          }}
                          className="flex-1 px-2 py-1 text-xs rounded-lg bg-red-500/30 hover:bg-red-500/50 text-red-300 transition-all"
                        >
                          🗑️ 删除
                        </button>
                      </div>
                    )}

                    {isEditing && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveEdit();
                          }}
                          className="flex-1 px-2 py-1 text-xs rounded-lg bg-emerald-500/50 hover:bg-emerald-500/70 text-white transition-all"
                        >
                          ✓ 保存
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAccount(null);
                          }}
                          className="flex-1 px-2 py-1 text-xs rounded-lg bg-slate-600/60 hover:bg-slate-500/60 text-white/80 transition-all"
                        >
                          ✕ 取消
                        </button>
                      </div>
                    )}

                    {isCurrent && !isEditing && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="text-xs text-white/50 mb-2">选择头像</div>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {avatars.slice(0, 6).map((avatar) => (
                            <button
                              key={avatar}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectAvatar(account.id, avatar);
                              }}
                              className={cn(
                                'w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all',
                                account.avatar === avatar
                                  ? 'bg-amber-500/40 border border-amber-400'
                                  : 'bg-slate-700/50 hover:bg-slate-600/50 border border-transparent'
                              )}
                            >
                              {avatar}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!showCreateForm ? (
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/30"
            >
              ➕ 创建新账号
            </button>
            {currentAccount && (
              <button
                onClick={() => setShowAccountManager(false)}
                className="px-6 py-3 rounded-xl bg-slate-700/60 hover:bg-slate-600/60 text-white/80 font-bold transition-all duration-300 border border-white/10"
              >
                ✓ 确认
              </button>
            )}
          </div>
        ) : (
          <div className="bg-slate-800/50 rounded-2xl p-5 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">创建新账号</h3>

            <div className="mb-4">
              <label className="block text-sm text-white/60 mb-2">账号名称</label>
              <input
                type="text"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                placeholder="请输入玩家名称"
                className="w-full px-4 py-3 rounded-xl bg-slate-700/50 text-white border border-white/20 focus:outline-none focus:border-amber-500/60 transition-all"
                maxLength={16}
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm text-white/60 mb-2">选择头像</label>
              <div className="flex flex-wrap gap-2">
                {avatars.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300',
                      selectedAvatar === avatar
                        ? 'bg-gradient-to-br from-amber-500/40 to-orange-500/30 border-2 border-amber-400 scale-110 shadow-lg shadow-amber-500/30'
                        : 'bg-slate-700/50 border border-white/10 hover:border-white/30 hover:bg-slate-600/50'
                    )}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCreateAccount}
                disabled={!newAccountName.trim()}
                className={cn(
                  'flex-1 px-6 py-3 rounded-xl font-bold transition-all duration-300',
                  newAccountName.trim()
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/30'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                )}
              >
                ✓ 创建账号
              </button>
              {accounts.length > 0 && (
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 rounded-xl bg-slate-700/60 hover:bg-slate-600/60 text-white/80 font-bold transition-all duration-300 border border-white/10"
                >
                  取消
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
