import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  AccountBalance as BalanceIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker as MuiDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { financeAPI } from '../services/api';

const IncomeExpenseManager = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('income'); // 'income' or 'expense'
  const [editingItem, setEditingItem] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    date: new Date(),
    paymentMethod: 'Cash'
  });

  const incomeCategories = [
    'Membership Fees',
    'Personal Training',
    'Equipment Rental',
    'Supplements Sales',
    'Merchandise',
    'Events/Classes',
    'Other'
  ];

  const expenseCategories = [
    'Equipment Purchase',
    'Maintenance & Repair',
    'Utilities (Electricity, Water)',
    'Rent/Mortgage',
    'Staff Salaries',
    'Insurance',
    'Marketing',
    'Supplies',
    'Cleaning',
    'Other'
  ];

  const paymentMethods = ['Cash', 'Bank Transfer', 'UPI', 'Credit Card', 'Debit Card'];

  const fetchIncomeData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await financeAPI.getIncome();
      setIncomeData(response);
    } catch (error) {
      showAlert('error', 'Failed to fetch income data');
      // Fallback to mock data on error
      setIncomeData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchExpenseData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await financeAPI.getExpenses();
      setExpenseData(response);
    } catch (error) {
      showAlert('error', 'Failed to fetch expense data');
      // Fallback to mock data on error
      setExpenseData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncomeData();
    fetchExpenseData();
  }, [fetchIncomeData, fetchExpenseData]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setEditingItem(item);
    
    if (item) {
      setFormData({
        title: item.title,
        amount: item.amount.toString(),
        category: item.category,
        description: item.description,
        date: new Date(item.date),
        paymentMethod: item.paymentMethod
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: '',
        description: '',
        date: new Date(),
        paymentMethod: 'Cash'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setFormData({
      title: '',
      amount: '',
      category: '',
      description: '',
      date: new Date(),
      paymentMethod: 'Cash'
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const dataToSubmit = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: formData.date.toISOString()
      };

      if (editingItem) {
        // Update existing item
        if (dialogType === 'income') {
          await financeAPI.updateIncome(editingItem._id || editingItem.id, dataToSubmit);
        } else {
          await financeAPI.updateExpense(editingItem._id || editingItem.id, dataToSubmit);
        }
        showAlert('success', `${dialogType === 'income' ? 'Income' : 'Expense'} updated successfully`);
      } else {
        // Create new item
        if (dialogType === 'income') {
          await financeAPI.createIncome(dataToSubmit);
        } else {
          await financeAPI.createExpense(dataToSubmit);
        }
        showAlert('success', `${dialogType === 'income' ? 'Income' : 'Expense'} added successfully`);
      }
      
      // Refresh data
      await fetchIncomeData();
      await fetchExpenseData();
      handleCloseDialog();
    } catch (error) {
      showAlert('error', `Failed to ${editingItem ? 'update' : 'add'} ${dialogType}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        if (type === 'income') {
          await financeAPI.deleteIncome(id);
        } else {
          await financeAPI.deleteExpense(id);
        }
        showAlert('success', `${type === 'income' ? 'Income' : 'Expense'} deleted successfully`);
        
        // Refresh data
        await fetchIncomeData();
        await fetchExpenseData();
      } catch (error) {
        showAlert('error', `Failed to delete ${type}`);
      }
    }
  };

  const calculateTotals = () => {
    const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    
    return { totalIncome, totalExpenses, netProfit };
  };

  const { totalIncome, totalExpenses, netProfit } = calculateTotals();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const StatCard = ({ title, amount, icon, color, isProfit = false }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}20, ${color}10)` }}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <Box sx={{ color: color, mb: 2 }}>
            {icon}
          </Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            color={isProfit ? (amount >= 0 ? 'success.main' : 'error.main') : color}
          >
            {formatCurrency(amount)}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  const DataTable = ({ data, type }) => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item._id || item.id}>
              <TableCell>
                <Typography variant="subtitle2">{item.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.description}
                </Typography>
              </TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell align="right">
                <Typography 
                  variant="h6" 
                  color={type === 'income' ? 'success.main' : 'error.main'}
                >
                  {formatCurrency(item.amount)}
                </Typography>
              </TableCell>
              <TableCell>{item.paymentMethod}</TableCell>
              <TableCell>
                {format(new Date(item.date), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <Chip
                  label={item.isAutoGenerated ? 'Auto' : 'Manual'}
                  size="small"
                  color={item.isAutoGenerated ? 'primary' : 'default'}
                />
              </TableCell>
              <TableCell align="center">
                {!item.isAutoGenerated && (
                  <>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(type, item)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(type, item._id || item.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          💰 Income & Expense Management
        </Typography>

        {alert.show && (
          <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert({ show: false })}>
            {alert.message}
          </Alert>
        )}

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Income"
              amount={totalIncome}
              icon={<IncomeIcon sx={{ fontSize: 40 }} />}
              color="#4caf50"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Expenses"
              amount={totalExpenses}
              icon={<ExpenseIcon sx={{ fontSize: 40 }} />}
              color="#f44336"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Net Profit"
              amount={netProfit}
              icon={<BalanceIcon sx={{ fontSize: 40 }} />}
              color="#2196f3"
              isProfit={true}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="This Month"
              amount={totalIncome * 0.3} // Mock monthly data
              icon={<PaymentIcon sx={{ fontSize: 40 }} />}
              color="#ff9800"
            />
          </Grid>
        </Grid>

        {/* Tabs for Income and Expenses */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Income Management" />
            <Tab label="Expense Management" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {currentTab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Income Records</Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog('income')}
                    color="success"
                  >
                    Add Income
                  </Button>
                </Box>
                <DataTable data={incomeData} type="income" />
              </Box>
            )}

            {currentTab === 1 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Expense Records</Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog('expense')}
                    color="error"
                  >
                    Add Expense
                  </Button>
                </Box>
                <DataTable data={expenseData} type="expense" />
              </Box>
            )}
          </Box>
        </Paper>

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingItem ? 'Edit' : 'Add'} {dialogType === 'income' ? 'Income' : 'Expense'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount (₹)"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    {(dialogType === 'income' ? incomeCategories : expenseCategories).map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  >
                    {paymentMethods.map((method) => (
                      <MenuItem key={method} value={method}>
                        {method}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MuiDatePicker
                  label="Date"
                  value={formData.date}
                  onChange={(date) => setFormData({ ...formData, date })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading || !formData.title || !formData.amount || !formData.category}
            >
              {loading ? 'Saving...' : (editingItem ? 'Update' : 'Add')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default IncomeExpenseManager;