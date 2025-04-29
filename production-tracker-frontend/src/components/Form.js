import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Input,
  FormControl,
  FormLabel,
  Button,
  VStack,
  Heading,
  Alert,
  AlertIcon,
  Select,
} from "@chakra-ui/react";
import axios from "axios";

function Form({ onSubmitSuccess, project, skuId }) {
  const { id: projectId, name: projectName } = project || {};
  const [formData, setFormData] = useState({
    wip_id: "",
    sku_id: "",
    projectId: projectId,
    projectName: projectName,
  });
  const [projectLocked, setProjectLocked] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [skuLists, setSkuLists] = useState([]);
  const [wipLists, setWipLists] = useState([]);  // Initialize wipLists as an array
  const inputRef = useRef();

  const selectedSku = skuLists.find((sku) => sku.id === Number(formData.sku_id));

  useEffect(() => {
    const fetchSkus = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/skus/projects/${projectId}`);
        setSkuLists(response.data.data || []);
        console.log(response.data.data);
      } catch (error) {
        console.error("Failed to fetch SKUs:", error.message);
      }
    };

    fetchSkus();
  }, [projectId]);

  useEffect(() => {
    if (formData.sku_id) {
      const fetchWipsForSku = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/wips/skus/${formData.sku_id}`);
          console.log(response.data);
  
          // Ensure response.data.data is always an array
          const wips = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
          setWipLists(wips);
          console.log("wipLists", wipLists);
        } catch (error) {
          console.error("Failed to fetch WIPs for SKU:", error.message);
          setWipLists([]);  // Set empty array in case of error
        }
      };
  
      fetchWipsForSku();
    } else {
      setWipLists([]);  // Reset WIP list if SKU is not selected
    }
  }, [formData.sku_id]);
  
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      projectId,
      projectName,
    }));
  }, [projectId, projectName]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChangeWip = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    if (formData.sku_id) {
      setProjectLocked(true);
      onSubmitSuccess(formData.sku_id); // Pass the SKU ID here
    }
  };

  const refreshForm = () => {
    setFormData((prev) => ({
      ...prev,
      sku_id: "",
      wip_id: "",
      serial_id: "",
    }));
    setWipLists([]);
    setProjectLocked(false);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.wip_id.trim()) return;
  
    console.log("Submitting data:", formData); // Log form data before submission
  
    try {
      const res = await axios.post("http://localhost:8000/api/scans", {
        ...formData,
        scanned_at: new Date().toISOString(),
      });
  
      console.log("✅ Scan submitted:", res.data);
      setFormData((prev) => ({ ...prev, serial_id: "" }));
      inputRef.current?.focus();
      setIsSuccess(true);
      setMessage("Item successfully scanned!");
  
      if (onSubmitSuccess) onSubmitSuccess(formData.sku_id); // Send sku_id to parent
    } catch (error) {
      const errMsg = error.response?.data?.error || "An unexpected error occurred";
      console.error("❌ Error:", errMsg);
      setIsSuccess(false);
      setMessage(errMsg);
    }
  };  

  return (
    <Box
      maxW="3xl"
      w={{ base: "90%", md: "500px", lg: "600px" }}
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
      ml={{ base: 0, md: 10 }}
    >
      <Heading mb={6} size="md">Scan Item</Heading>

      {!projectLocked ? (
        <form onSubmit={handleProjectSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Project</FormLabel>
              <Input name="projectId" value={formData.projectName} readOnly />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Select SKU</FormLabel>
              <Select
                name="sku_id"
                value={formData.sku_id}
                onChange={handleChange}
                placeholder="Select SKU"
              >
                {skuLists.map((sku) => (
                  <option key={sku.id} value={sku.id}>
                    {sku.sku_code || `SKU ${sku.id}`}
                  </option>
                ))}
              </Select>
            </FormControl>
            <Button colorScheme="teal" type="submit" width="full">
              Confirm Project
            </Button>
          </VStack>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Project</FormLabel>
              <Input value={formData.projectName} isReadOnly />
            </FormControl>
            <FormControl>
              <FormLabel>SKU Number</FormLabel>
              <Input value={selectedSku?.sku_code || formData.sku_id} isReadOnly />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Select WIP</FormLabel>
              <Select
                name="wip_id"
                value={formData.wip_id}
                onChange={handleChangeWip}
                placeholder="Select WIP"
              >
                {wipLists.length > 0 ? (
                  wipLists.map((wip) => (
                    <option key={wip.id} value={wip.id}>
                      {wip.wip_code || `WIP ${wip.id}`}
                    </option>
                  ))
                ) : (
                  <option>No WIP available</option>
                )}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Serial ID</FormLabel>
              <Input
                name="serial_id"
                value={formData.serial_id}
                onChange={handleChange}
                placeholder="Scan item"
                ref={inputRef}
              />
            </FormControl>
            <Button colorScheme="teal" type="submit" width="full" mb={4}>
              Submit
            </Button>
          </VStack>
          <Button onClick={refreshForm} colorScheme="red" type="button" width="full">
            Refresh            
          </Button>
        </form>
      )}

      {message && (
        <Alert status={isSuccess ? "success" : "error"} mt={4} borderRadius="md">
          <AlertIcon />
          {message}
        </Alert>
      )}
    </Box>
  );
}

export default Form;
