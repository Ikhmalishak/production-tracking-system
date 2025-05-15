import {
  Box,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  Divider,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Form from "../components/Form";
import OutputList from "../components/Table";
import Header from "../components/Header";
import axiosInstance from "../utils/api"

function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedSkuId, setSelectedSkuId] = useState("");
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [skuLists, setSkuLists] = useState([]);
  const [wipLists, setWipLists] = useState([]);
  const [selectedWipId, setSelectedWipId] = useState("");
  const [selectedSkuCode, setSelectedSkuCode] = useState(""); // State for SKU code
  const [selectedWipCode, setSelectedWipCode] = useState(""); // State for WIP code

  const { isOpen, onOpen, onClose } = useDisclosure();

  const refreshData = (sku_id) => {
    setSelectedSkuId(sku_id || "");
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (!selectedProjectId) return;
    axiosInstance
      .get(`/skus/projects/${selectedProjectId}`)
      .then((res) => setSkuLists(res.data.data || []))
      .catch((err) => console.error("Failed to fetch SKUs:", err.message));
  }, [selectedProjectId]);

  useEffect(() => {
    if (!selectedSkuId) return;
    axiosInstance
      .get(`/wips/skus/${selectedSkuId}`)
      .then((res) => setWipLists(res.data.data || []))
      .catch((err) => {
        console.error("Failed to fetch WIPs:", err.message);
        setWipLists([]);
      });
  }, [selectedSkuId]);

  useEffect(() => {
    axiosInstance
      .get("/projects")
      .then((res) => setProjects(res.data.data.data))
      .catch((err) => console.error("Failed to fetch projects:", err));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      onOpen();
    }, 0);
    return () => clearTimeout(timer);
  }, [onOpen]);

  const handleProjectChange = (e) => {
    const id = e.target.value;
    setSelectedProjectId(id);
    setSelectedSkuId("");
    setSelectedWipId("");
    setSelectedSkuCode(""); // Reset SKU code when project changes
    setSelectedWipCode(""); // Reset WIP code when project changes
    const project = projects.find((p) => p.id.toString() === id);
    setSelectedProjectName(project?.name || "");
  };

  const handleSkuChange = (e) => {
    const id = e.target.value;
    setSelectedSkuId(id);
    const selectedSku = skuLists.find((sku) => sku.id.toString() === id);
    setSelectedSkuCode(selectedSku?.sku_code || ""); // Set SKU code from selected SKU
  };

  const handleWipChange = (e) => {
    const id = e.target.value;
    setSelectedWipId(id);
    const selectedWip = wipLists.find((wip) => wip.id.toString() === id);
    setSelectedWipCode(selectedWip?.wip_code || ""); // Set WIP code from selected WIP
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
        />
      ) : (
        <Box p={2}>
          <Header
            title={selectedProjectName || "Select a Project"}
            rightContent="Action"
          />
          <Divider mb={20}/> {/* Added Divider for better UI separation */}
          <Flex
            p={4}
            gap={4}
            direction={{ base: "column", md: "row" }}
            width="100%"
            justify="space-between"
          >
            <Form
              onSubmitSuccess={refreshData}
              project={{ id: selectedProjectId, name: selectedProjectName }}
              skuId={{ id: selectedSkuId, code: selectedSkuCode }}
              wipId={{ id: selectedWipId, code: selectedWipCode }}
            />
            <OutputList
              refreshTrigger={refreshTrigger}
              skuId={selectedSkuId}
              projectId={selectedProjectId}
            />
          </Flex>

          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
            <ModalContent>
              <ModalHeader>Select Project</ModalHeader>
              <ModalBody>
                <Select
                  placeholder="Select project"
                  onChange={handleProjectChange}
                  value={selectedProjectId}
                  mb={4}
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </Select>

                <Select
                  placeholder="Select SKU"
                  value={selectedSkuId}
                  onChange={handleSkuChange}
                  isDisabled={!skuLists.length}
                >
                  {skuLists.map((sku) => (
                    <option key={sku.id} value={sku.id}>
                      {sku.sku_code}
                    </option>
                  ))}
                </Select>

                <Select
                  placeholder="Select WIP"
                  value={selectedWipId}
                  onChange={handleWipChange}
                  isDisabled={!wipLists.length}
                  mt={4}
                >
                  {wipLists.map((wip) => (
                    <option key={wip.id} value={wip.id}>
                      {wip.wip_code}
                    </option>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose} isDisabled={!selectedProjectId || !selectedSkuId || !selectedWipId}>
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