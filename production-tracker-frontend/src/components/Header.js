// Updated Header.js - Full width across the page
import React from "react";
import {
  Box,
  Heading,
  Flex,
  Spacer,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/api"; // Import your axios instance

function Header({ title }) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const navigate = useNavigate(); // Initialize navigate for redirection

  // Function to handle logout
  const handleLogout = async (e) => {
    // Perform logout logic here (e.g., clear token, redirect to login page)
    e.preventDefault(); // Prevent page reload

    try {
      // Make a logout request to the server
      await axiosInstance.post("/logout");

      // Clear token from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      console.log("Token removed from localStorage");

      //navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Box
      as="header"
      py={4}
      px={6}
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      boxShadow="sm"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="30"
      width="100%"
    >
      <Flex align="center" width="100%">
        <Heading size="lg" color="teal">
          {title}
        </Heading>
        <Spacer />
        <IconButton
          icon={<FiLogOut />}
          aria-label="Refresh"
          onClick={handleLogout}
          colorScheme="teal"
          variant="outline"
        />
      </Flex>
    </Box>
  );
}

export default Header;
