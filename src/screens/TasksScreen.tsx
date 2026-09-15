import React, { useState } from 'react';
import { Task, ScreenId } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import { AuraBadge } from '../components/common/AuraBadge';
import {
  Check,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  X,
} from 'lucide-react';

interface TasksScreenProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  onBack?: () => void;
  onNavigate?: (screen: ScreenId) => void;
}

export const TasksScreen: React.FC<TasksScreenProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onBack,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'TODAY' | 'OVERDUE'>('TODAY');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newCategory, setNewCategory] = useState('Khách hàng');
  const [newPriority, setNewPriority] = useState<Task['priority']>('Quan trọng');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle.trim(),
      time: newTime.trim() || 'Hôm nay',
      category: newCategory,
      priority: newPriority,
      dueDate: '2025-04-24',
    });
    setNewTitle('');
    setNewTime('');
    setShowAddModal(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'TODAY') return true;
    if (filter === 'OVERDUE') return !t.completed && t.priority === 'Quan trọng';
    return true;
  });

  return (
    <div className="min-h-full bg-transparent pb-32 text-slate-900 relative">
      {/* Header with Circular Floating Buttons */}
      <MobileHeader
        title="Công việc"
        subtitle="Checklist & Nhiệm vụ hôm nay"
        showBack={false}
        onMenuClick={() => onNavigate?.('more')}
        rightAction={
          <button
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 rounded-full bg-white/95 shadow-sm border border-white/90 text-[#00A3FF] flex items-center justify-center transition-all duration-150 active:scale-90 hover:bg-white"
            title="Thêm việc mới"
          >
            <Plus className="w-4.5 h-4.5 stroke-[2.4]" />
          </button>
        }
      />

      <div className="px-4 pt-2 space-y-3.5">
        {/* Segmented Filter Pills */}
        <div className="flex items-center p-1 bg-white/80 rounded-full border border-white text-xs font-semibold">
          <button
            onClick={() => setFilter('ALL')}
            className={`flex-1 py-1.5 rounded-full text-center transition-all ${
              filter === 'ALL'
                ? 'bg-[#00A3FF] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Tất cả ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('TODAY')}
            className={`flex-1 py-1.5 rounded-full text-center transition-all ${
              filter === 'TODAY'
                ? 'bg-[#00A3FF] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Hôm nay (5)
          </button>
          <button
            onClick={() => setFilter('OVERDUE')}
            className={`flex-1 py-1.5 rounded-full text-center transition-all ${
              filter === 'OVERDUE'
                ? 'bg-[#00A3FF] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Ưu tiên (2)
          </button>
        </div>

        {/* Task Cards List */}
        <div className="space-y-2.5 pt-1">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="card-pastel-interactive p-4 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Round Check Button */}
                <button
                  onClick={() => onToggleTask(task.id)}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                      : 'border-slate-300 hover:border-[#00A3FF] bg-white'
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                <div className="min-w-0 flex-1">
                  <h4
                    className={`text-xs font-bold truncate transition-colors ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-slate-400 stroke-[2.2]" />
                    <span>{task.time}</span>
                  </p>
                </div>
              </div>

              <AuraBadge
                size="xs"
                variant={
                  task.priority === 'Quan trọng'
                    ? 'danger'
                    : task.priority === 'Bình thường'
                    ? 'primary'
                    : 'neutral'
                }
              >
                {task.priority}
              </AuraBadge>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button (+) with Cyan Glow */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-5 w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 to-[#00A3FF] text-white flex items-center justify-center shadow-[0_10px_25px_rgba(0,163,255,0.4)] hover:brightness-105 active:scale-90 transition-all z-20"
        title="Thêm công việc mới"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Add Task Frosted Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="card-pastel p-6 w-full max-w-sm shadow-2xl space-y-4 bg-white/95 border border-white">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Tạo công việc mới</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Tên nhiệm vụ
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Gọi nhắc lịch dặm môi chị Lan"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A3FF]/30"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Thời gian thực hiện
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 14:00 hôm nay"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A3FF]/30"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-gradient-to-r from-sky-500 to-[#00A3FF] text-white text-xs font-bold transition-all shadow-sm"
                >
                  Lưu công việc
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
