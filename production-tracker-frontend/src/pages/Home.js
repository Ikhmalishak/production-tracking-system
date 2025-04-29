import {
    Box,
    Flex,
    Spacer,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Select,
  } from "@chakra-ui/react";
  import { useState, useEffect } from "react";
  import Form from "../components/Form"; // Update path
  import OutputList from "../components/Table"; // Update path
  import Header from "../components/Header"; // Update path (if you have Header)
  
  function Home() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedSkuId, setSelectedSkuId] = useState(null);
    const [selectedProjectName, setSelectedProjectName] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [projects, setProjects] = useState([]);
  
    const refreshData = (sku_id) => {
      setSelectedSkuId(sku_id || null);
      setRefreshTrigger((prev) => prev + 1);
    };
  
    useEffect(() => {
      const fetchProjects = async () => {
        try {
          const res = await fetch("http://127.0.0.1:8000/api/projects");
          const result = await res.json();
          setProjects(result.data.data);
        } catch (err) {
          console.error("Failed to fetch projects:", err);
        }
      };
      fetchProjects();
    }, []);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false);
        onOpen();
      }, 0);
  
      return () => clearTimeout(timer);
    }, [onOpen]);
  
    const handleProjectChange = (e) => {
      const selectedId = e.target.value;
      setSelectedProjectId(selectedId);
      const project = projects.find((p) => p.id.toString() === selectedId);
      setSelectedProjectName(project ? project.name : "");
    };
  
    return (
      <Box position="relative" height="100vh" width="100vw">
        {loading ? (
          <Box
            position="fixed"
            top="0"
            left="0"
            width="100%"
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            zIndex="10"
            bg="black"
          >
            {/* <MotionPath /> */}
          </Box>
        ) : (
          <Box p={2}>
            <Header title={selectedProjectName || "Select a Project"} rightContent="Action" />
            <Flex p={4} gap={6} direction={{ base: "column", md: "row" }} align="start">
              <Form
                onSubmitSuccess={refreshData}
                project={{ id: selectedProjectId, name: selectedProjectName }}
                skuId
              />
              <Spacer />
              <OutputList
                refreshTrigger={refreshTrigger}
                flex={1}
                skuId={selectedSkuId}
                projectId={selectedProjectId}
              />
            </Flex>
  
            {/* Modal for selecting project */}
            <Modal isOpen={isOpen} onClose={() => {}}>
              <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
              <ModalContent>
                <ModalHeader>Select Project</ModalHeader>
                <ModalBody>
                  <Select placeholder="Select project" onChange={handleProjectChange}>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </Select>
                </ModalBody>
                <ModalFooter>
                  <Button onClick={onClose} isDisabled={!selectedProjectId}>
                    Confirm
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        )}
      </Box>
    );
  }
  
  export default Home;
  