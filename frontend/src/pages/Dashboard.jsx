import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, updateTaskStatus, deleteTask } from '../store/slices/taskSlice';
import TaskForm from '../components/TaskForm';
import { toast } from 'react-toastify'; // Import toast library

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  // Filter, Search, Sort & Pagination State
  const [filter, setFilter] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); 
  const [taskToEdit, setTaskToEdit] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Adjust the number of tasks per page here

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Reset pagination to page 1 whenever filters or search terms change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm, sortBy]);

  const handleTaskSubmit = async (formData) => {
    try {
      if (taskToEdit) {
        await dispatch(updateTask({ id: taskToEdit._id, taskData: formData })).unwrap();
        toast.success('Task details updated successfully!');
        setTaskToEdit(null);
      } else {
        await dispatch(createTask(formData)).unwrap();
        toast.success('New task created successfully!');
      }
    } catch (err) {
      toast.error(err || 'Failed to submit task');
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'pending' ? 'completed' : 'pending';
      await dispatch(updateTaskStatus({ id: task._id, status: newStatus })).unwrap();
      toast.success(newStatus === 'completed' ? 'Task marked as completed!' : 'Task marked as pending');
    } catch (err) {
      toast.error('Failed to update task status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(id)).unwrap();
        toast.info('Task removed.');
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  // Stats Calculations
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Search, Filter, and Sort Logic
  const processedTasks = tasks
    .filter((task) => {
      if (filter === 'pending') return task.status === 'pending';
      if (filter === 'completed') return task.status === 'completed';
      return true;
    })
    .filter((task) => {
      return (
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  // Pagination Math
  const totalPages = Math.ceil(processedTasks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = processedTasks.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-900/90 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-xl shadow-indigo-950/10 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10 flex-1">
            <h2 className="text-xl md:text-2xl font-black">Hello, {user?.name || 'User'}! </h2>
            <p className="text-slate-300 text-sm mt-1.5 max-w-lg leading-relaxed">
              Welcome back. You have completed {completedCount} of {totalCount} tasks. Keep up the great progress!
            </p>
            
            <div className="flex items-center space-x-3 mt-5 max-w-md">
              <div className="flex-grow bg-white/15 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <span className="text-xs font-extrabold text-emerald-400">{progressPercent}%</span>
            </div>
          </div>
          
          <button 
            onClick={() => {
              setTaskToEdit(null);
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }}
            className="md:self-center bg-white text-indigo-900 px-5 py-3 rounded-2xl font-black text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-1.5 shrink-0"
          >
            <span className="text-base">+</span>
            <span>Add New Task</span>
          </button>
        </div>

        {/* Action Panel */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex space-x-1 border border-slate-100 rounded-xl bg-slate-50 p-1 self-start">
            {['all', 'pending', 'completed'].map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-2 text-xs font-bold rounded-lg capitalize transition-all ${
                  filter === option
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                {option} Tasks
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 md:max-w-xl md:justify-end">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 cursor-pointer"
            >
              <option value="newest">Sort: Date Created</option>
              <option value="title">Sort: Alphabetical</option>
              <option value="priority">Sort: Priority Level</option>
            </select>
          </div>
        </div>

        {/* Main Workspace split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 order-2 lg:order-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="text-sm text-slate-500 mt-4">Retrieving database tasks...</p>
              </div>
            ) : currentTasks.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
                <svg className="mx-auto h-16 w-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-3.586-3.586a2 2 0 00-2.828 0L12 14m0 0l-3.586-3.586a2 2 0 00-2.828 0L4 13" />
                </svg>
                <h3 className="mt-4 text-sm font-black text-slate-950">No tasks matched</h3>
                <p className="mt-1 text-xs text-slate-500">Try adjusting your filters or search criteria.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {currentTasks.map((task) => (
                    <div
                      key={task._id}
                      className={`bg-white border p-5 rounded-2xl transition-all hover:shadow-md ${
                        task.status === 'completed' ? 'border-indigo-100 bg-indigo-50/5' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3.5">
                          <input
                            type="checkbox"
                            checked={task.status === 'completed'}
                            onChange={() => handleToggleStatus(task)}
                            className="mt-1.5 h-5 w-5 rounded-full border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4
                                className={`font-black text-base text-slate-900 transition-all ${
                                  task.status === 'completed' ? 'line-through text-slate-400 font-bold' : ''
                                }`}
                              >
                                {task.title}
                              </h4>
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                  task.priority === 'high'
                                    ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                    : task.priority === 'medium'
                                    ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                    : 'bg-slate-150 text-slate-600'
                                }`}
                              >
                                {task.priority}
                              </span>
                            </div>
                            
                            <p className={`text-sm mt-1 leading-relaxed ${task.status === 'completed' ? 'text-slate-400' : 'text-slate-600'}`}>
                              {task.description || 'No description.'}
                            </p>
                            
                            {task.dueDate && (
                              <span className="flex items-center text-xs text-slate-400 mt-4 font-bold">
                                <svg className="w-3.5 h-3.5 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 ml-4">
                          <button
                            onClick={() => setTaskToEdit(task)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PAGINATION CONTROLS */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-1.5 mt-8">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                    >
                      ‹ Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`w-9 h-9 flex items-center justify-center text-xs font-bold rounded-xl transition-all ${
                          currentPage === index + 1
                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-150'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                    >
                      Next ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="sticky top-20">
              <TaskForm
                onSubmit={handleTaskSubmit}
                taskToEdit={taskToEdit}
                onCancel={taskToEdit ? () => setTaskToEdit(null) : null}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;