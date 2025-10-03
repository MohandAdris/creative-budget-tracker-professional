import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calculator, Settings, History, Plus, Edit, Trash2, Download, Save, Package, CheckCircle, FileText, Tag, Search, Filter, RefreshCw, Copy, Eye, EyeOff } from 'lucide-react';
import './App.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const DEFAULT_EXPENSE_BLOCKS = [
  {
    id: 1,
    name: 'Video Shooting',
    description: 'Professional video shooting service',
    category: 'Video Production',
    pricingTiers: [
      { range: '1-3 videos', price: 400, type: 'fixed' },
      { range: '4+ videos each', price: 300, type: 'per_item' }
    ],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Video Editing',
    description: 'Professional video editing and post-production',
    category: 'Post-Production',
    pricingTiers: [
      { range: '1-3 videos', price: 400, type: 'fixed' },
      { range: '4+ videos each', price: 300, type: 'per_item' }
    ],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Social Media Post',
    description: 'Social media content creation',
    category: 'Marketing & Advertising',
    pricingTiers: [
      { range: '1-3 posts', price: 70, type: 'fixed' },
      { range: '4+ posts each', price: 50, type: 'per_item' }
    ],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Branding Package',
    description: 'Complete branding solution',
    category: 'Creative Services',
    pricingTiers: [
      { range: 'Basic Package', price: 2500, type: 'package' },
      { range: 'Standard Package', price: 3500, type: 'package' },
      { range: 'Premium Package', price: 7500, type: 'package' }
    ],
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

const CATEGORIES = [
  'Video Production',
  'Post-Production', 
  'Creative Services',
  'Marketing & Advertising',
  'Equipment Rental',
  'Software & Licenses',
  'Talent & Crew',
  'Location & Studio',
  'Travel & Transportation',
  'Client Entertainment'
];

function App() {
  // Core State
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [projectDuration, setProjectDuration] = useState(1);
  const [expenses, setExpenses] = useState([]);
  const [expenseBlocks, setExpenseBlocks] = useState(DEFAULT_EXPENSE_BLOCKS);
  const [reportHistory, setReportHistory] = useState([]);
  
  // Admin Dashboard State
  const [isCreateBlockOpen, setIsCreateBlockOpen] = useState(false);
  const [isEditBlockOpen, setIsEditBlockOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  
  // Quantity Selection State
  const [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  // Quick Edit State
  const [quickEditPrice, setQuickEditPrice] = useState({ blockId: null, tierIndex: null, isOpen: false });
  const [tempPrice, setTempPrice] = useState('');
  
  // Form State
  const [newBlock, setNewBlock] = useState({
    name: '',
    description: '',
    category: 'Creative Services',
    pricingTiers: [{ range: '', price: 0, type: 'fixed' }],
    isActive: true
  });
  
  const [customExpense, setCustomExpense] = useState({
    name: '',
    amount: '',
    category: 'Creative Services',
    date: new Date().toISOString().split('T')[0]
  });

  // Load data from localStorage
  useEffect(() => {
    const savedBudget = localStorage.getItem('monthlyBudget');
    const savedDuration = localStorage.getItem('projectDuration');
    const savedExpenses = localStorage.getItem('expenses');
    const savedBlocks = localStorage.getItem('expenseBlocks');
    const savedReports = localStorage.getItem('reportHistory');
    
    if (savedBudget) setMonthlyBudget(parseFloat(savedBudget));
    if (savedDuration) setProjectDuration(parseInt(savedDuration));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedBlocks) setExpenseBlocks(JSON.parse(savedBlocks));
    if (savedReports) setReportHistory(JSON.parse(savedReports));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('monthlyBudget', monthlyBudget.toString());
    localStorage.setItem('projectDuration', projectDuration.toString());
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('expenseBlocks', JSON.stringify(expenseBlocks));
    localStorage.setItem('reportHistory', JSON.stringify(reportHistory));
  }, [monthlyBudget, projectDuration, expenses, expenseBlocks, reportHistory]);

  // Calculations
  const totalMonthlyExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyProfit = monthlyBudget - totalMonthlyExpenses;
  const totalProjectBudget = monthlyBudget * projectDuration;
  const totalProjectExpenses = totalMonthlyExpenses * projectDuration;
  const totalProjectProfit = totalProjectBudget - totalProjectExpenses;
  const budgetUsagePercentage = monthlyBudget > 0 ? (totalMonthlyExpenses / monthlyBudget) * 100 : 0;

  // Admin Functions
  const handleCreateBlock = () => {
    const block = {
      ...newBlock,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setExpenseBlocks([...expenseBlocks, block]);
    setNewBlock({
      name: '',
      description: '',
      category: 'Creative Services',
      pricingTiers: [{ range: '', price: 0, type: 'fixed' }],
      isActive: true
    });
    setIsCreateBlockOpen(false);
  };

  const handleEditBlock = (block) => {
    setEditingBlock(block);
    setNewBlock(block);
    setIsEditBlockOpen(true);
  };

  const handleUpdateBlock = () => {
    setExpenseBlocks(expenseBlocks.map(block => 
      block.id === editingBlock.id ? { ...newBlock, id: editingBlock.id } : block
    ));
    setIsEditBlockOpen(false);
    setEditingBlock(null);
    setNewBlock({
      name: '',
      description: '',
      category: 'Creative Services',
      pricingTiers: [{ range: '', price: 0, type: 'fixed' }],
      isActive: true
    });
  };

  const handleDeleteBlock = (blockId) => {
    setExpenseBlocks(expenseBlocks.filter(block => block.id !== blockId));
  };

  const handleToggleBlockStatus = (blockId) => {
    setExpenseBlocks(expenseBlocks.map(block => 
      block.id === blockId ? { ...block, isActive: !block.isActive } : block
    ));
  };

  const handleQuickEditPrice = (blockId, tierIndex) => {
    const block = expenseBlocks.find(b => b.id === blockId);
    const currentPrice = block.pricingTiers[tierIndex].price;
    setTempPrice(currentPrice.toString());
    setQuickEditPrice({ blockId, tierIndex, isOpen: true });
  };

  const handleSaveQuickEdit = () => {
    const newPrice = parseFloat(tempPrice);
    if (!isNaN(newPrice) && newPrice >= 0) {
      setExpenseBlocks(expenseBlocks.map(block => {
        if (block.id === quickEditPrice.blockId) {
          const updatedTiers = [...block.pricingTiers];
          updatedTiers[quickEditPrice.tierIndex].price = newPrice;
          return { ...block, pricingTiers: updatedTiers };
        }
        return block;
      }));
    }
    setQuickEditPrice({ blockId: null, tierIndex: null, isOpen: false });
    setTempPrice('');
  };

  const handleCancelQuickEdit = () => {
    setQuickEditPrice({ blockId: null, tierIndex: null, isOpen: false });
    setTempPrice('');
  };

  const addPricingTier = () => {
    setNewBlock({
      ...newBlock,
      pricingTiers: [...newBlock.pricingTiers, { range: '', price: 0, type: 'fixed' }]
    });
  };

  const removePricingTier = (index) => {
    const updatedTiers = newBlock.pricingTiers.filter((_, i) => i !== index);
    setNewBlock({ ...newBlock, pricingTiers: updatedTiers });
  };

  const openQuantityDialog = (block, tier) => {
    setSelectedBlock(block);
    setSelectedTier(tier);
    setQuantity(1);
    setIsQuantityDialogOpen(true);
  };

  const addExpenseFromBlock = (block, tier, quantity = 1) => {
    const expense = {
      id: Date.now(),
      name: `${block.name} - ${tier.range} (x${quantity})`,
      amount: tier.price * quantity,
      category: block.category,
      date: new Date().toISOString().split('T')[0],
      blockId: block.id,
      tier: tier,
      quantity: quantity
    };
    setExpenses([...expenses, expense]);
  };

  const handleAddExpenseWithQuantity = () => {
    if (selectedBlock && selectedTier && quantity > 0) {
      addExpenseFromBlock(selectedBlock, selectedTier, quantity);
      setIsQuantityDialogOpen(false);
      setSelectedBlock(null);
      setSelectedTier(null);
      setQuantity(1);
    }
  };

  const addCustomExpense = () => {
    if (customExpense.name && customExpense.amount) {
      const expense = {
        id: Date.now(),
        name: customExpense.name,
        amount: parseFloat(customExpense.amount),
        category: customExpense.category,
        date: customExpense.date
      };
      setExpenses([...expenses, expense]);
      setCustomExpense({
        name: '',
        amount: '',
        category: 'Creative Services',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const generatePDF = () => {
    const reportContent = `
      <html>
        <head>
          <title>Project Budget Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .expense-table { width: 100%; border-collapse: collapse; }
            .expense-table th, .expense-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .expense-table th { background-color: #f2f2f2; }
            .profit { color: green; }
            .loss { color: red; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Creative Project Budget Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="section">
            <h2>Project Overview</h2>
            <p><strong>Monthly Client Payment:</strong> ₪${monthlyBudget.toFixed(2)}</p>
            <p><strong>Project Duration:</strong> ${projectDuration} months</p>
            <p><strong>Total Project Budget:</strong> ₪${totalProjectBudget.toFixed(2)}</p>
          </div>
          
          <div class="section">
            <h2>Financial Summary</h2>
            <p><strong>Monthly Expenses:</strong> ₪${totalMonthlyExpenses.toFixed(2)}</p>
            <p><strong>Monthly Profit:</strong> <span class="${monthlyProfit >= 0 ? 'profit' : 'loss'}">₪${monthlyProfit.toFixed(2)}</span></p>
            <p><strong>Total Project Expenses:</strong> ₪${totalProjectExpenses.toFixed(2)}</p>
            <p><strong>Total Project Profit:</strong> <span class="${totalProjectProfit >= 0 ? 'profit' : 'loss'}">₪${totalProjectProfit.toFixed(2)}</span></p>
          </div>
          
          <div class="section">
            <h2>Expense Details</h2>
            <table class="expense-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Expense Name</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${expenses.map(expense => `
                  <tr>
                    <td>${expense.date}</td>
                    <td>${expense.name}</td>
                    <td>${expense.category}</td>
                    <td>₪${expense.amount.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportContent);
    printWindow.document.close();
    printWindow.print();
  };

  const saveReport = () => {
    const report = {
      id: Date.now(),
      name: `Project Report - ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString(),
      monthlyBudget,
      projectDuration,
      expenses: [...expenses],
      totalMonthlyExpenses,
      monthlyProfit,
      totalProjectProfit
    };
    setReportHistory([...reportHistory, report]);
  };

  // Filter blocks for admin dashboard
  const filteredBlocks = expenseBlocks.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         block.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || block.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Creative Project Budget Tracker</h1>
          </div>
          <p className="text-gray-600">Manage budgets for marketing campaigns, video productions, and creative projects</p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="budget" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="budget" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Budget Tracker
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Admin Dashboard
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Report History
            </TabsTrigger>
          </TabsList>

          {/* Budget Tracker Tab */}
          <TabsContent value="budget" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Project Settings
                  </CardTitle>
                  <CardDescription>Configure your project parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="budget">Monthly Client Payment (₪)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="budget"
                        type="number"
                        value={monthlyBudget || ''}
                        onChange={(e) => setMonthlyBudget(parseFloat(e.target.value) || 0)}
                        placeholder="What client pays per month"
                      />
                      <Button onClick={() => setMonthlyBudget(monthlyBudget)}>Set Payment</Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="duration">Project Duration (months)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={projectDuration}
                      onChange={(e) => setProjectDuration(parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Financial Summary */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Monthly Client Payment:</p>
                      <p className="text-2xl font-bold">₪{monthlyBudget.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Expenses:</p>
                      <p className="text-2xl font-bold">₪{totalMonthlyExpenses.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Profit:</p>
                      <p className={`text-2xl font-bold ${monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₪{monthlyProfit.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <Progress 
                    value={budgetUsagePercentage} 
                    className={`h-3 ${budgetUsagePercentage >= 50 ? 'bg-red-100' : 'bg-green-100'}`}
                  />
                  <p className="text-sm text-gray-600">
                    Budget Usage: {budgetUsagePercentage.toFixed(1)}%
                  </p>
                  
                  <div className="flex gap-2">
                    <Button onClick={generatePDF} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export PDF
                    </Button>
                    <Button onClick={saveReport} variant="outline" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Expense Blocks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Quick Expense Blocks
                </CardTitle>
                <CardDescription>Add common expenses with predefined pricing tiers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {expenseBlocks.filter(block => block.isActive).map((block) => (
                    <Card key={block.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{block.name}</CardTitle>
                          <Badge variant="secondary">{block.category}</Badge>
                        </div>
                        <CardDescription>{block.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {block.pricingTiers.map((tier, index) => (
                          <div key={index} className="flex justify-between items-center group">
                            <span className="text-sm">{tier.range}:</span>
                            <div className="flex items-center gap-2">
                              {quickEditPrice.isOpen && quickEditPrice.blockId === block.id && quickEditPrice.tierIndex === index ? (
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    value={tempPrice}
                                    onChange={(e) => setTempPrice(e.target.value)}
                                    className="w-20 h-8 text-xs"
                                    placeholder="Price"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleSaveQuickEdit();
                                      if (e.key === 'Escape') handleCancelQuickEdit();
                                    }}
                                  />
                                  <Button
                                    size="sm"
                                    onClick={handleSaveQuickEdit}
                                    className="h-8 px-2 text-xs"
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleCancelQuickEdit}
                                    className="h-8 px-2 text-xs"
                                  >
                                    ×
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => openQuantityDialog(block, tier)}
                                    className="text-xs"
                                  >
                                    ₪{tier.price}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleQuickEditPrice(block.id, index)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs p-1"
                                    title="Edit price"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custom Expense */}
            <Card>
              <CardHeader>
                <CardTitle>Add Custom Expense</CardTitle>
                <CardDescription>Record a custom expense not covered by blocks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Expense name"
                    value={customExpense.name}
                    onChange={(e) => setCustomExpense({...customExpense, name: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="Amount (₪)"
                    value={customExpense.amount}
                    onChange={(e) => setCustomExpense({...customExpense, amount: e.target.value})}
                  />
                  <Select value={customExpense.category} onValueChange={(value) => setCustomExpense({...customExpense, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addCustomExpense}>Add Custom Expense</Button>
                </div>
              </CardContent>
            </Card>

            {/* Expense List */}
            <Card>
              <CardHeader>
                <CardTitle>Expense List</CardTitle>
                <CardDescription>All recorded expenses for this campaign/project</CardDescription>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No expenses recorded yet</p>
                ) : (
                  <div className="space-y-2">
                    {expenses.map((expense) => (
                      <div key={expense.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{expense.name}</p>
                          <p className="text-sm text-gray-600">{expense.category} • {expense.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">₪{expense.amount.toFixed(2)}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setExpenses(expenses.filter(e => e.id !== expense.id))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Dashboard Tab */}
          <TabsContent value="admin" className="space-y-6">
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Blocks</p>
                      <p className="text-2xl font-bold">{expenseBlocks.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Blocks</p>
                      <p className="text-2xl font-bold">{expenseBlocks.filter(b => b.isActive).length}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                      <p className="text-2xl font-bold">{expenses.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Categories</p>
                      <p className="text-2xl font-bold">{new Set(expenseBlocks.map(b => b.category)).size}</p>
                    </div>
                    <Tag className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Block Management Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Block Management System
                </CardTitle>
                <CardDescription>Create, edit, and manage expense blocks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-6">
                  <Dialog open={isCreateBlockOpen} onOpenChange={setIsCreateBlockOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Block
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Expense Block</DialogTitle>
                        <DialogDescription>
                          Add a new expense block with custom pricing tiers
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="blockName">Block Name</Label>
                            <Input
                              id="blockName"
                              value={newBlock.name}
                              onChange={(e) => setNewBlock({...newBlock, name: e.target.value})}
                              placeholder="e.g., Video Shooting"
                            />
                          </div>
                          <div>
                            <Label htmlFor="blockCategory">Category</Label>
                            <Select value={newBlock.category} onValueChange={(value) => setNewBlock({...newBlock, category: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CATEGORIES.map(category => (
                                  <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="blockDescription">Description</Label>
                          <Textarea
                            id="blockDescription"
                            value={newBlock.description}
                            onChange={(e) => setNewBlock({...newBlock, description: e.target.value})}
                            placeholder="Describe the service or expense type"
                          />
                        </div>
                        
                        <div>
                          <Label>Pricing Tiers</Label>
                          <div className="space-y-2">
                            {newBlock.pricingTiers.map((tier, index) => (
                              <div key={index} className="grid grid-cols-3 gap-2">
                                <Input
                                  placeholder="Range/Type (e.g., 1-3 videos)"
                                  value={tier.range}
                                  onChange={(e) => {
                                    const updatedTiers = [...newBlock.pricingTiers];
                                    updatedTiers[index].range = e.target.value;
                                    setNewBlock({...newBlock, pricingTiers: updatedTiers});
                                  }}
                                />
                                <Input
                                  type="number"
                                  placeholder="Price (₪)"
                                  value={tier.price}
                                  onChange={(e) => {
                                    const updatedTiers = [...newBlock.pricingTiers];
                                    updatedTiers[index].price = parseFloat(e.target.value) || 0;
                                    setNewBlock({...newBlock, pricingTiers: updatedTiers});
                                  }}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removePricingTier(index)}
                                  disabled={newBlock.pricingTiers.length === 1}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button variant="outline" onClick={addPricingTier}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Pricing Tier
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isActive"
                            checked={newBlock.isActive}
                            onCheckedChange={(checked) => setNewBlock({...newBlock, isActive: checked})}
                          />
                          <Label htmlFor="isActive">Active</Label>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsCreateBlockOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateBlock}>
                            Create Block
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search blocks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Blocks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBlocks.map((block) => (
                    <Card key={block.id} className={`${!block.isActive ? 'opacity-60' : ''}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{block.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant={block.isActive ? "default" : "secondary"}>
                              {block.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleBlockStatus(block.id)}
                            >
                              {block.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <CardDescription>{block.description}</CardDescription>
                        <Badge variant="outline">{block.category}</Badge>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {block.pricingTiers.map((tier, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span>{tier.range}:</span>
                            <span className="font-semibold">₪{tier.price}</span>
                          </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditBlock(block)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBlock(block.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Report History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Report History
                </CardTitle>
                <CardDescription>View and manage saved project reports</CardDescription>
              </CardHeader>
              <CardContent>
                {reportHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No reports saved yet</p>
                ) : (
                  <div className="space-y-4">
                    {reportHistory.map((report) => (
                      <Card key={report.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{report.name}</h3>
                              <p className="text-sm text-gray-600">
                                Generated: {new Date(report.date).toLocaleDateString()}
                              </p>
                              <div className="mt-2 space-y-1">
                                <p className="text-sm">Budget: ₪{report.monthlyBudget.toFixed(2)}</p>
                                <p className="text-sm">Expenses: ₪{report.totalMonthlyExpenses.toFixed(2)}</p>
                                <p className={`text-sm font-semibold ${report.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  Profit: ₪{report.monthlyProfit.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Copy className="h-4 w-4 mr-1" />
                                Load
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setReportHistory(reportHistory.filter(r => r.id !== report.id))}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Block Dialog */}
        <Dialog open={isEditBlockOpen} onOpenChange={setIsEditBlockOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Expense Block</DialogTitle>
              <DialogDescription>
                Modify the expense block details and pricing tiers
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editBlockName">Block Name</Label>
                  <Input
                    id="editBlockName"
                    value={newBlock.name}
                    onChange={(e) => setNewBlock({...newBlock, name: e.target.value})}
                    placeholder="e.g., Video Shooting"
                  />
                </div>
                <div>
                  <Label htmlFor="editBlockCategory">Category</Label>
                  <Select value={newBlock.category} onValueChange={(value) => setNewBlock({...newBlock, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="editBlockDescription">Description</Label>
                <Textarea
                  id="editBlockDescription"
                  value={newBlock.description}
                  onChange={(e) => setNewBlock({...newBlock, description: e.target.value})}
                  placeholder="Describe the service or expense type"
                />
              </div>
              
              <div>
                <Label>Pricing Tiers</Label>
                <div className="space-y-2">
                  {newBlock.pricingTiers.map((tier, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2">
                      <Input
                        placeholder="Range/Type (e.g., 1-3 videos)"
                        value={tier.range}
                        onChange={(e) => {
                          const updatedTiers = [...newBlock.pricingTiers];
                          updatedTiers[index].range = e.target.value;
                          setNewBlock({...newBlock, pricingTiers: updatedTiers});
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Price (₪)"
                        value={tier.price}
                        onChange={(e) => {
                          const updatedTiers = [...newBlock.pricingTiers];
                          updatedTiers[index].price = parseFloat(e.target.value) || 0;
                          setNewBlock({...newBlock, pricingTiers: updatedTiers});
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePricingTier(index)}
                        disabled={newBlock.pricingTiers.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addPricingTier}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Pricing Tier
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="editIsActive"
                  checked={newBlock.isActive}
                  onCheckedChange={(checked) => setNewBlock({...newBlock, isActive: checked})}
                />
                <Label htmlFor="editIsActive">Active</Label>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditBlockOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateBlock}>
                  Update Block
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Quantity Selection Dialog */}
        <Dialog open={isQuantityDialogOpen} onOpenChange={setIsQuantityDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Quantity</DialogTitle>
              <DialogDescription>
                How many {selectedTier?.range} do you want?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold">{selectedBlock?.name}</h4>
                  <p className="text-sm text-gray-600">{selectedTier?.range}</p>
                  <p className="text-sm font-medium">₪{selectedTier?.price} each</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  placeholder="Enter quantity"
                />
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Cost:</span>
                  <span className="text-xl font-bold text-blue-600">
                    ₪{selectedTier ? (selectedTier.price * quantity).toLocaleString() : 0}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {quantity} × ₪{selectedTier?.price} = ₪{selectedTier ? (selectedTier.price * quantity).toLocaleString() : 0}
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsQuantityDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddExpenseWithQuantity}>
                  Add to Expenses
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default App;
