import React, { useState } from "react";
import {
  Box,
  Flex,
  Container,
  Heading,
  Text,
  useColorModeValue,
  HStack,
  Icon,
  Button,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import {
  FiGrid,
  FiPackage,
  FiLayers,
  FiPlusCircle,
} from "react-icons/fi";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { ProjectForm, SKUForm, WIPForm } from "../../components/AdminForm";

function AdminForm() {
  const [activeTab, setActiveTab] = useState(0);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Colors
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const highlightColor = "teal.500";

  const handleFormSubmit = (payload) => {
    console.log("Form submitted with:", payload);
    // You could add a success notification here
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const tabItems = [
    { name: "Projects", icon: FiGrid },
    { name: "SKUs", icon: FiPackage },
    { name: "WIPs", icon: FiLayers },
  ];

  return (
    <Box minH="100vh" bg={bgColor}>
      <Header title="Production Tracking System" isSidebarOpen={isSidebarOpen} />
      <Flex>
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Box
          ml={isSidebarOpen ? "270px" : "100px"}
          transition="margin 0.3s ease"
          w="100%"
        >
          {/* Main Content with Tabs */}
          <Container maxW="container.xl" w="100%" py={6}>
            <Card
              borderRadius="lg"
              boxShadow="md"
              borderWidth="1px"
              borderColor={borderColor}
              bg={cardBg}
              overflow="hidden"
            >
              <CardHeader bg={useColorModeValue("gray.50", "gray.700")} p={0}>
                <Flex width="100%">
                  {tabItems.map((tab, index) => (
                    <Box
                      key={index}
                      px={5}
                      py={4}
                      fontWeight={activeTab === index ? "semibold" : "medium"}
                      color={activeTab === index ? highlightColor : textColor}
                      borderBottom="2px solid"
                      borderBottomColor={
                        activeTab === index ? highlightColor : "transparent"
                      }
                      cursor="pointer"
                      onClick={() => setActiveTab(index)}
                      transition="all 0.2s"
                      _hover={{
                        color: highlightColor,
                      }}
                      display="flex"
                      alignItems="center"
                    >
                      <Icon as={tab.icon} mr={2} />
                      {tab.name}
                    </Box>
                  ))}
                </Flex>
              </CardHeader>

              <CardBody>
                {activeTab === 0 && (
                  <Box mb={4}>
                    <Text fontSize="lg" fontWeight="medium" mb={4}>
                      Create a New Project
                    </Text>
                    <ProjectForm onSubmit={handleFormSubmit} />
                  </Box>
                )}

                {activeTab === 1 && (
                  <Box mb={4}>
                    <Text fontSize="lg" fontWeight="medium" mb={4}>
                      Create a New SKU
                    </Text>
                    <SKUForm onSubmit={handleFormSubmit} />
                  </Box>
                )}

                {activeTab === 2 && (
                  <Box mb={4}>
                    <Text fontSize="lg" fontWeight="medium" mb={4}>
                      Create a New Work In Progress
                    </Text>
                    <WIPForm onSubmit={handleFormSubmit} />
                  </Box>
                )}
              </CardBody>
            </Card>

            {/* Quick Info Section */}
            <Card mt={6} bg={cardBg} borderRadius="lg" boxShadow="md">
              <CardHeader pb={2}>
                <Heading size="md">Quick Access</Heading>
              </CardHeader>
              <CardBody>
                <HStack spacing={4} wrap="wrap">
                  {tabItems.map((item, index) => (
                    <Button
                      key={index}
                      leftIcon={<Icon as={item.icon} />}
                      rightIcon={<Icon as={FiPlusCircle} />}
                      onClick={() => setActiveTab(index)}
                      variant="outline"
                      colorScheme="teal"
                      size="md"
                      mb={2}
                    >
                      New {item.name.slice(0, -1)}
                    </Button>
                  ))}
                </HStack>
              </CardBody>
            </Card>
          </Container>
        </Box>
      </Flex>
    </Box>
  );
}

export default AdminForm;
