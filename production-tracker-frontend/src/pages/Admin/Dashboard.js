// Dashboard.js - Dashboard page content
import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  useColorModeValue,
  Card,
} from "@chakra-ui/react";
import{  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function Dashboard() {
  // Colors
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const data = [
    { name: "January", users: 400 },
    { name: "February", users: 300 },
    { name: "March", users: 200 },
    { name: "April", users: 278 },
    { name: "May", users: 189 },
    { name: "June", users: 239 },
    { name: "July", users: 349 },
    { name: "January", users: 400 },
    { name: "February", users: 300 },
    { name: "March", users: 200 },
    { name: "April", users: 278 },
    { name: "May", users: 189 },
    { name: "June", users: 239 },
    { name: "July", users: 349 },
  ];
  return (
    <Container maxW="container.xl" py={6}>
      <Card
        borderRadius="lg"
        boxShadow="md"
        borderWidth="1px"
        borderColor={borderColor}
        bg={cardBg}
        overflow="hidden"
      >
        <Heading size="md" mb={4} ml={4} mt={4}>
          Dashboard Overview
        </Heading>

        <Box height="450px">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3182CE" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3182CE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#3182CE"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Card>
    </Container>
  );
}

export default Dashboard;
