import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { CategoryDistribution, MonthlyTrend, DepartmentUsage } from './types';

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1', '#A4DE6C', '#D0ED57'];

interface AnalyticsChartsProps {
  monthlyTrend: MonthlyTrend[];
  getCategoryDistribution: () => CategoryDistribution[];
  getDepartmentUsage: () => DepartmentUsage[];
}

export const AnalyticsCharts = ({ 
  monthlyTrend,
  getCategoryDistribution,
  getDepartmentUsage
}: AnalyticsChartsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget vs Spending Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Budget vs Spending Trend</CardTitle>
            <CardDescription>Monthly comparison of allocated budget and actual spending</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                <Line type="monotone" dataKey="budget" stroke="#8884d8" strokeWidth={2} name="Budget" />
                <Line type="monotone" dataKey="spent" stroke="#82ca9d" strokeWidth={2} name="Spent" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Distribution by Category</CardTitle>
            <CardDescription>How budget is allocated across different categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={getCategoryDistribution()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getCategoryDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Budget']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Usage Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Department Usage Analysis</CardTitle>
          <CardDescription>Budget utilization and spending patterns by department</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getDepartmentUsage()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
                <Tooltip formatter={(value, name) => [
                name === 'utilization'
                  ? `${typeof value === 'number' ? value.toFixed(1) : value}%`
                  : `$${typeof value === 'number' ? value.toLocaleString() : value}`,
                name === 'allocated' ? 'Allocated' : name === 'spent' ? 'Spent' : 'Utilization'
              ]} />
              <Bar dataKey="allocated" fill="#8884d8" name="Allocated" />
              <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
