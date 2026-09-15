import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  accountApi, budgetApi, netWorthApi, transactionApi, 
  analyticsApi, goalApi, billApi, investmentApi 
} from '../services/api';
import PrimaryUserDashboard from '../components/dashboards/PrimaryUserDashboard';
import FamilyMemberDashboard from '../components/dashboards/FamilyMemberDashboard';
import FinancialAdvisorDashboard from '../components/dashboards/FinancialAdvisorDashboard';
import SupportDashboard from '../components/dashboards/SupportDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  const [netWorth, setNetWorth] = useState(null);
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [upcomingBills, setUpcomingBills] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [nwRes, bRes, tRes, gRes, billRes, aRes, accRes, invRes] = await Promise.allSettled([
        netWorthApi.getSummary(),
        budgetApi.getSummary(),
        transactionApi.getTransactions(),
        goalApi.getGoals(),
        billApi.getUpcoming(),
        analyticsApi.getInsights(),
        accountApi.getAccounts(),
        investmentApi.getInvestments()
      ]);

      if (nwRes.status === 'fulfilled') setNetWorth(nwRes.value.data);
      if (bRes.status === 'fulfilled') setBudgetSummary(bRes.value.data);
      if (tRes.status === 'fulfilled') setTransactions(tRes.value.data.slice(0, 8));
      if (gRes.status === 'fulfilled') setGoals(gRes.value.data.slice(0, 4));
      if (billRes.status === 'fulfilled') setUpcomingBills(billRes.value.data.slice(0, 4));
      if (aRes.status === 'fulfilled') setAnalytics(aRes.value.data);
      if (accRes.status === 'fulfilled') setAccounts(accRes.value.data);
      if (invRes.status === 'fulfilled') setInvestments(invRes.value.data);
    } catch (e) {
      console.error("Failed to load dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
      </div>
    );
  }

  const role = user?.role || 'USER';

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {role === 'FAMILY_MEMBER' && (
          <FamilyMemberDashboard 
            user={user} 
            budgetSummary={budgetSummary} 
            upcomingBills={upcomingBills} 
            transactions={transactions} 
          />
        )}

        {role === 'FINANCIAL_ADVISOR' && (
          <FinancialAdvisorDashboard 
            user={user} 
            netWorth={netWorth} 
            analytics={analytics} 
            investments={investments} 
            goals={goals} 
          />
        )}

        {role === 'SUPPORT' && (
          <SupportDashboard 
            user={user} 
          />
        )}

        {(role === 'USER' || !['FAMILY_MEMBER', 'FINANCIAL_ADVISOR', 'SUPPORT'].includes(role)) && (
          <PrimaryUserDashboard 
            user={user} 
            netWorth={netWorth} 
            budgetSummary={budgetSummary} 
            transactions={transactions} 
            goals={goals} 
            upcomingBills={upcomingBills} 
            analytics={analytics} 
            accounts={accounts} 
            onRefresh={loadDashboardData} 
          />
        )}
      </div>
    </div>
  );
}
