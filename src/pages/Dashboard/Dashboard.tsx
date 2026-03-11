import React from 'react';
import { Users, ClipboardList, Wallet, Banknote, CheckCircle } from 'lucide-react';
import DashboardHeader from '../../Modules/Dashboard/DashboardHeader';
import StatCard from '../../Modules/Dashboard/StatCard';
import ActivityLog from '../../Modules/Dashboard/ActivityLog';
import CriticalActions from '../../Modules/Dashboard/CriticalActions';
import TopRatedList from '../../Modules/Dashboard/TopRatedList';

const Dashboard = () => {
  const clients = [
    { id: '1', name: 'Tunde Adewale', count: 27, rating: 4.7, avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', name: 'Tunde Adewale', count: 27, rating: 4.7, avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', name: 'Tunde Adewale', count: 27, rating: 4.7, avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: '4', name: 'Tunde Adewale', count: 27, rating: 4.7, avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: '5', name: 'Tunde Adewale', count: 27, rating: 4.7, avatar: 'https://i.pravatar.cc/150?u=5' },
  ];

  const helpers = [
    { id: '1', name: 'Tunde Adewale', count: 27, rating: 4.7, avatar: 'https://i.pravatar.cc/150?u=6', isVerified: true },
    { id: '2', name: 'Tunde Adewale', count: 27, rating: 4.7, avatar: 'https://i.pravatar.cc/150?u=7', isVerified: true },
    { id: '3', name: 'Tunde Adewale', count: 27, rating: 4.7, avatar: 'https://i.pravatar.cc/150?u=8', isVerified: true },
    { id: '4', name: 'Tunde Adewale', count: 27, rating: 4.7, avatar: 'https://i.pravatar.cc/150?u=9', isVerified: true },
  ];

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard 
          title="Total Users" 
          value="12,842" 
          icon={Users} 
          iconColor="text-green-600" 
          iconBgColor="bg-green-50" 
        />
        <StatCard 
          title="Active Tasks" 
          value="486" 
          icon={ClipboardList} 
          iconColor="text-green-600" 
          iconBgColor="bg-green-50" 
        />
        <StatCard 
          title="Total Escrow Balance" 
          value="#198,900" 
          icon={Wallet} 
          iconColor="text-green-600" 
          iconBgColor="bg-green-50" 
        />
        <StatCard 
          title="Revenue (Platform Fees)" 
          value="#128,750" 
          icon={Banknote} 
          iconColor="text-green-600" 
          iconBgColor="bg-green-50" 
        />
        <StatCard 
          title="Completed Tasks" 
          value="1,204" 
          icon={CheckCircle} 
          iconColor="text-green-600" 
          iconBgColor="bg-green-50" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 flex flex-col gap-0">
          <ActivityLog />
          <CriticalActions />
        </div>
        
        <div className="flex flex-col gap-8">
          <TopRatedList 
            title="Top Rated Clients" 
            items={clients} 
            countLabel="tasks posted" 
          />
          <TopRatedList 
            title="Top Rated Helpers" 
            items={helpers} 
            countLabel="tasks completed" 
            showVerified 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
