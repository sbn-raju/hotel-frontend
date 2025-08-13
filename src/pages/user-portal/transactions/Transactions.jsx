import React, { useState } from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Filter, Search, MoreVertical, Calendar, DollarSign } from 'lucide-react';

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample transactions data
  const transactions = [
    {
      id: 1,
      type: 'payment',
      description: 'Cozy Downtown Apartment',
      amount: 245.00,
      date: '2024-07-20',
      status: 'completed',
      category: 'Accommodation'
    },
    {
      id: 2,
      type: 'refund',
      description: 'Beach House Cancellation',
      amount: 180.00,
      date: '2024-07-18',
      status: 'completed',
      category: 'Refund'
    },
    {
      id: 3,
      type: 'payment',
      description: 'Mountain Cabin Weekend',
      amount: 320.00,
      date: '2024-07-15',
      status: 'pending',
      category: 'Accommodation'
    },
    {
      id: 4,
      type: 'payment',
      description: 'City Center Loft',
      amount: 156.00,
      date: '2024-07-12',
      status: 'completed',
      category: 'Accommodation'
    },
    {
      id: 5,
      type: 'payment',
      description: 'Luxury Resort Suite',
      amount: 450.00,
      date: '2024-07-10',
      status: 'completed',
      category: 'Accommodation'
    }
  ];

  const TransactionIcon = ({ type }) => {
    return type === 'payment' ? (
      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-sm">
        <ArrowUpRight className="w-4 h-4 text-white" />
      </div>
    ) : (
      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-sm">
        <ArrowDownLeft className="w-4 h-4 text-white" />
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalAmount = transactions.reduce((sum, t) => {
    return sum + (t.type === 'payment' ? -t.amount : t.amount);
  }, 0);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Transactions</h2>
              <p className="text-sm text-gray-600">Track your recent activity</p>
            </div>
          </div>
          
          {/* Balance Card */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white min-w-0 sm:min-w-48">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-sm font-medium">Balance</p>
                <p className="text-2xl font-bold">
                  ${Math.abs(totalAmount).toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-6 h-6 text-indigo-200" />
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white min-w-0"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
            
            <button className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No transactions found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <div 
                key={transaction.id}
                className="group hover:bg-gray-50 transition-all duration-200 p-4 sm:p-6"
              >
                <div className="flex items-center justify-between">
                  {/* Left side - Icon and Details */}
                  <div className="flex items-center space-x-4 min-w-0 flex-1">
                    <TransactionIcon type={transaction.type} />
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                        <div className="min-w-0">
                          <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                            {transaction.description}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                            <div className="flex items-center text-xs sm:text-sm text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(transaction.date)}
                            </div>
                            <span className="hidden sm:inline text-gray-300">•</span>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium sm:px-0 sm:py-0 sm:bg-transparent w-fit">
                              {transaction.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Amount and Status */}
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <p className={`text-sm sm:text-lg font-bold ${
                      transaction.type === 'payment' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.type === 'payment' ? '-' : '+'}${transaction.amount.toFixed(2)}
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {transaction.status}
                      </span>
                      
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-all">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {filteredTransactions.length > 0 && (
          <div className="border-t border-gray-100 p-4 sm:p-6">
            <button className="w-full py-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700 border-2 border-indigo-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200">
              Load More Transactions
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards - Mobile Optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-lg font-bold text-red-600">
                ${transactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Refunds</p>
              <p className="text-lg font-bold text-green-600">
                ${transactions.filter(t => t.type === 'refund').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
              </p>
            </div>
            <ArrowDownLeft className="w-5 h-5 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-lg font-bold text-amber-600">
                {transactions.filter(t => t.status === 'pending').length}
              </p>
            </div>
            <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;