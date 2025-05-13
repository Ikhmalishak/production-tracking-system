// layouts/AdminLayout.js - Layout for admin pages with sidebar
import React, { useState } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function AdminLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const bgColor = useColorModeValue("gray.50", "gray.800");
  
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <Box minH="100vh" bg={bgColor}>
      <Header title="Production Tracking System" />
      
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content Area with proper spacing */}
      <Box
        pt="60px" // Space for fixed header
        ml={isSidebarOpen ? "250px" : "80px"}
        transition="margin-left 0.3s ease"
        width={isSidebarOpen ? "calc(100% - 250px)" : "calc(100% - 80px)"}
      >
        {children}
      </Box>
    </Box>
  );
}

export default AdminLayout;