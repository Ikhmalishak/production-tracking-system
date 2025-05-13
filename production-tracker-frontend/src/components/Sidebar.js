// Updated Sidebar.js with working navigation
import {
  Box,
  Button,
  VStack,
  useColorModeValue,
  Flex,
  Text,
  HStack,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiPackage,
  FiFileText,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiLayers,
} from "react-icons/fi";
import axiosInstance from "../utils/api"; // Import your axios instance
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const itemHoverBg = useColorModeValue("gray.100", "gray.700");
  const activeItemBg = useColorModeValue("teal.500", "teal.400");
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle logout
  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      console.log("Token removed from localStorage");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Define menu items with their routes
  const menuItems = [
    { label: "Dashboard", icon: FiHome, path: "/dashboard" },
    { label: "Manage Projects", icon: FiLayers, path: "/projects" },
    // { label: "Products", icon: FiPackage, path: "/products" },
    // { label: "Orders", icon: FiFileText, path: "/orders" },
    // { label: "Analytics", icon: FiFileText, path: "/analytics" },
    { label: "Settings", icon: FiSettings, path: "" },// add settings path later 
  ];

  // Handle navigation when menu item is clicked
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box
      position="fixed"
      top="60px" // Positioned below header
      left="0"
      h="calc(100vh - 60px)" // Full height minus header
      w={isSidebarOpen ? "250px" : "80px"}
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      transition="width 0.3s ease"
      overflow="hidden"
      zIndex="20"
      boxShadow="sm"
    >
      {/* Toggle Button */}
      <IconButton
        aria-label="Toggle Sidebar"
        icon={isSidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
        position="absolute"
        top="10px"
        right="-3"
        size="sm"
        borderRadius="full"
        bg="teal.300"
        borderWidth="1px"
        borderColor={borderColor}
        zIndex={30}
        onClick={toggleSidebar}
      />

      <VStack spacing={3} align="stretch" mt={6}>
        {menuItems.map((item, index) => {
          // Check if this menu item is active based on current path
          const isActive = location.pathname === item.path;
          
          return (
            <Tooltip
              key={index}
              label={!isSidebarOpen ? item.label : ""}
              placement="right"
              openDelay={500}
              hasArrow
            >
              <Box
                px={4}
                py={3}
                mx={4}
                borderRadius="md"
                bg={isActive ? activeItemBg : "transparent"}
                color={isActive ? "white" : "inherit"}
                _hover={{
                  bg: isActive ? activeItemBg : itemHoverBg,
                  color: isActive ? "white" : "teal.500",
                }}
                cursor="pointer"
                transition="all 0.2s"
                onClick={() => handleNavigation(item.path)}
              >
                <Flex align="center" gap={3}>
                  <Box
                    as={item.icon}
                    fontSize="20px"
                    color={isActive ? "white" : "inherit"}
                  />
                  {isSidebarOpen && (
                    <Text
                      fontWeight={isActive ? "medium" : "normal"}
                      opacity={isSidebarOpen ? 1 : 0}
                      transition="opacity 0.3s"
                    >
                      {item.label}
                    </Text>
                  )}
                </Flex>
              </Box>
            </Tooltip>
          );
        })}
      </VStack>

      <Flex
        position="absolute"
        bottom="20px"
        left="0"
        right="0"
        p={4}
        justifyContent="center"
      >
        <HStack spacing={4}>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<FiLogOut />}
            colorScheme="red"
            justifyContent={isSidebarOpen ? "flex-start" : "center"}
            width={isSidebarOpen ? "auto" : "40px"}
            onClick={handleLogout}
          >
            {isSidebarOpen && "Logout"}
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
}

export default Sidebar;