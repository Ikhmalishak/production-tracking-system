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
} from "@chakra-ui/react";
import axios from "axios";

function Form({ onSubmitSuccess, project, skuId, wipId }) {
  const { id: projectId, name: projectName } = project || {};
  const { id: selectedSkuId, code: selectedSkuCode } = skuId || {};
  const { id: selectedWipId, code: selectedWipCode } = wipId || {};

  const [formData, setFormData] = useState({
    wip_id: selectedWipId || "",
    sku_id: selectedSkuId || "",
    projectId: projectId || "",
    projectName: projectName || "",
    serial_id: "",
  });
  
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef();

  // Update form data when props change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      projectId: projectId || "",
      projectName: projectName || "",
      sku_id: selectedSkuId || "",
      wip_id: selectedWipId || "",
    }));
  }, [projectId, projectName, selectedSkuId, selectedWipId]);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.serial_id || !formData.sku_id || !formData.wip_id) {
      setIsSuccess(false);
      setMessage("Please fill all required fields");
      return;
    }
  
    console.log("Submitting data:", formData);
  
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
  
      if (onSubmitSuccess) onSubmitSuccess(formData.sku_id);
    } catch (error) {
      const errMsg = error.response?.data?.error || "An unexpected error occurred";
      console.error("❌ Error:", errMsg);
      setIsSuccess(false);
      setMessage(errMsg);
    }
  };

  return (
    <Box
      flex="1"
      p={4}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
      minW={{ base: "100%", md: "60%" }}
      maxW={{ base: "100%", lg: "65%" }}
    >
      <Heading mb={6} size="md">Scan Item</Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Project</FormLabel>
            <Input value={projectName || ""} isReadOnly />
          </FormControl>
          
          <FormControl>
            <FormLabel>SKU Code</FormLabel>
            <Input value={selectedSkuCode || ""} isReadOnly />
          </FormControl>
          
          <FormControl>
            <FormLabel>WIP Code</FormLabel>
            <Input value={selectedWipCode || ""} isReadOnly />
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>Serial ID</FormLabel>
            <Input
              name="serial_id"
              value={formData.serial_id || ""}
              onChange={handleChange}
              placeholder="Scan item"
              ref={inputRef}
              autoFocus
            />
          </FormControl>
          
          <Button 
            colorScheme="teal" 
            type="submit" 
            width="full" 
            isDisabled={!formData.serial_id || !selectedSkuId || !selectedWipId}
          >
            Submit
          </Button>
        </VStack>
      </form>

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