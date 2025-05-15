// Dashboard.js - Dashboard page content
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Container, Heading, Box } from "@chakra-ui/react";

// Sample chart data
const data = [
  { month: 'Jan', value: 400 },
  { month: 'Feb', value: 300 },
  { month: 'Mar', value: 500 },
  { month: 'Apr', value: 200 },
  { month: 'May', value: 700 },
];

function Dashboard() {
  return (
    <Container maxW="container.xl" py={6}>
      <Heading size="lg" mb={4}>
        Dashboard Overview
      </Heading>

      <Box height="300px">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3182CE" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3182CE" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3182CE"
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Container>
  );
}

export default Dashboard; 
