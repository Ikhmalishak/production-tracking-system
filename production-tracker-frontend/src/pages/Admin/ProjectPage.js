// ProjectsPage.js - Projects management page
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  useColorModeValue,
  Button,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Flex,
  Badge,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { FiPlus, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { ModalForm } from "../../components/AdminForm";
import axiosInstance from "../../utils/api";
import { useNavigate } from "react-router-dom";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  // Colors
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      // Replace with your actual API endpoint
      const response = await axiosInstance.get("/projects");
      console.log("Projects fetched:", response.data.data.data);
      setProjects(response.data.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setIsLoading(false);
      // You could add error handling here
    }
  };

  const handleCreateProject = () => {
    navigate("/adminform");
    setCurrentProject(null);
  };

  const handleEditProject = (project) => {
    setCurrentProject(project);
    onOpen();
  };

  const handleFormSubmit = (projectData) => {
    console.log("Project Successfully Updated:", projectData);
    onClose();
    fetchProjects(); // Refresh projects list
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axiosInstance.delete(`/projects/${projectId}`);
        console.log("Project deleted successfully");
        fetchProjects(); // Refresh projects list
      } catch (error) {
        console.error("Error deleting project:", error);
        // Handle error
      }
    }
  };

  return (
    <Container maxW="container.xl" py={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Manage Projects</Heading>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="teal"
          onClick={handleCreateProject}
        >
          Add New Project
        </Button>
      </Flex>

      {isLoading ? (
        <Text>Loading projects...</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {projects.length > 0 ? (
            projects.map((project) => (
              <Card
                key={project.id}
                borderWidth="1px"
                borderColor={borderColor}
                bg={cardBg}
                boxShadow="sm"
              >
                <CardHeader pb={2}>
                  <Flex justify="space-between" align="center">
                    <Heading size="md">{project.name}</Heading>
                    <Badge
                      colorScheme={
                        project.status === "active" ? "green" : "orange"
                      }
                    >
                      {project.status}
                    </Badge>
                  </Flex>
                </CardHeader>
                <CardBody pt={0}>
                  <Text color="gray.600" mb={4}>
                    {project.description}
                  </Text>
                  {/* <Text fontSize="sm" mb={2}>
                    <strong>Client:</strong> {project.client}
                  </Text>
                  <Text fontSize="sm" mb={2}>
                    <strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}
                  </Text>
                  <Text fontSize="sm" mb={4}>
                    <strong>Budget:</strong> ${project.budget}
                  </Text>
                  <Text fontSize="sm" mb={4}>
                    <strong>Quantity:</strong> ${project.quantity}
                  </Text> */}
                  <Flex justify="flex-end" mt={2}>
                    <IconButton
                      icon={<FiEye />}
                      aria-label="View Project"
                      variant="ghost"
                      colorScheme="blue"
                      mr={2}
                    />
                    <IconButton
                      icon={<FiEdit />}
                      aria-label="Edit Project"
                      variant="ghost"
                      colorScheme="teal"
                      mr={2}
                      onClick={() => handleEditProject(project)}
                    />
                    <IconButton
                      icon={<FiTrash2 />}
                      aria-label="Delete Project"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDeleteProject(project.id)}
                    />
                  </Flex>
                </CardBody>
              </Card>
            ))
          ) : (
            <Text>No projects found. Create a new project to get started.</Text>
          )}
        </SimpleGrid>
      )}

      {/* Project Form Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentProject ? "Edit Project" : "Create New Project"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ModalForm
              onSubmit={handleFormSubmit}
              initialData={currentProject}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default ProjectsPage;
