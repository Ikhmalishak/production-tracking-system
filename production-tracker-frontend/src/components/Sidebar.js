// Updated Sidebar.js - Positioned below header
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
  FiChevronRight 
} from "react-icons/fi";

function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const itemHoverBg = useColorModeValue("gray.100", "gray.700");
  const activeItemBg = useColorModeValue("teal.500", "teal.400");

  const menuItems = [
    { label: "Dashboard", icon: FiHome, isActive: false },
    { label: "Customers", icon: FiUsers },
    { label: "Products", icon: FiPackage },
    { label: "Orders", icon: FiFileText },
    { label: "Analytics", icon: FiFileText },
    { label: "Settings", icon: FiSettings },
  ];
  
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
        bg='teal.300'
        borderWidth="1px"
        borderColor={borderColor}
        zIndex={30}
        onClick={toggleSidebar}
      />
      
      <VStack spacing={3} align="stretch" mt={6}>
        {menuItems.map((item, index) => {
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
                bg={item.isActive ? activeItemBg : "transparent"}
                color={item.isActive ? "white" : "inherit"}
                _hover={{
                  bg: item.isActive ? activeItemBg : itemHoverBg,
                  color: item.isActive ? "white" : "teal.500",
                }}
                cursor="pointer"
                transition="all 0.2s"
              >
                <Flex align="center" gap={3}>
                  <Box 
                    as={item.icon} 
                    fontSize="20px" 
                    color={item.isActive ? "white" : "inherit"}
                  />
                  {isSidebarOpen && (
                    <Text 
                      fontWeight={item.isActive ? "medium" : "normal"}
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
          >
            {isSidebarOpen && "Logout"}
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
}

export default Sidebar;