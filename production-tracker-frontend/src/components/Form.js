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
  useToast,
  Flex,
  Text,
  Icon,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import axiosInstance from "../utils/api"; // Adjust the import path as necessary

function Form({ onSubmitSuccess, project, skuId, wipId }) {
  const { id: projectId, name: projectName } = project || {};
  const { id: selectedSkuId, code: selectedSkuCode } = skuId || {};
  const { id: selectedWipId, code: selectedWipCode } = wipId || {};
  const toast = useToast();
  const successAudio = useRef(typeof window !== 'undefined' ? new Audio('/success.mp3') : null);
  const errorAudio = useRef(typeof window !== 'undefined' ? new Audio('/error.mp3') : null);

  const [formData, setFormData] = useState({
    wip_id: selectedWipId || "",
    sku_id: selectedSkuId || "",
    projectId: projectId || "",
    projectName: projectName || "",
    serial_id: "",
  });

  const [scanStatus, setScanStatus] = useState(null); // null, 'success', or 'error'
  const [message, setMessage] = useState("");
  const inputRef = useRef();

  // Update form data when props change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      projectId: projectId || "",
      projectName: projectName || "",
      sku_id: selectedSkuId || "",
      wip_id: selectedWipId || "",
    }));
  }, [projectId, projectName, selectedSkuId, selectedWipId]);

  // Clear status after 5 seconds
  useEffect(() => {
    if (scanStatus) {
      const timer = setTimeout(() => {
        setScanStatus(null);
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [scanStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setScanStatus(null);
    setMessage("");
  };

  const playSound = (status) => {
    try {
      if (status === 'success' && successAudio.current) {
        successAudio.current.currentTime = 0;
        successAudio.current.play();
      } else if (status === 'error' && errorAudio.current) {
        errorAudio.current.currentTime = 0;
        errorAudio.current.play();
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.serial_id || !formData.sku_id || !formData.wip_id) {
      setScanStatus('error');
      setMessage("Please fill all required fields");
      playSound('error');
      return;
    }

    console.log("Submitting data:", formData);

    try {
      const res = await axiosInstance.post("/scans", {
        ...formData,
        scanned_at: new Date().toISOString(),
      });

      setScanStatus('success');
      setMessage("Scan successful");
      playSound('success');
      
      setFormData((prev) => ({ ...prev, serial_id: "" }));
      inputRef.current?.focus();

      if (onSubmitSuccess) onSubmitSuccess(formData.sku_id);
    } catch (error) {
      const errMsg = error.response?.data?.error || "An unexpected error occurred";
      
      setScanStatus('error');
      setMessage(errMsg);
      playSound('error');

      setFormData((prev) => ({ ...prev, serial_id: "" }));
      inputRef.current?.focus();
    }
  };

  const StatusBox = () => {
    if (!scanStatus) return (
      <Box width="100px" height="60px" backgroundColor="gray.100" borderRadius="md" />
    );
    
    return (
      <Box 
        width="100px" 
        height="60px" 
        backgroundColor={scanStatus === 'success' ? "green.100" : "red.100"}
        borderRadius="md"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        p={2}
      >
        <Icon 
          as={scanStatus === 'success' ? CheckCircleIcon : WarningIcon} 
          color={scanStatus === 'success' ? "green.500" : "red.500"}
          boxSize={6}
          mb={1}
        />
        <Text 
          fontSize="xs" 
          fontWeight="bold"
          color={scanStatus === 'success' ? "green.700" : "red.700"}
          textAlign="center"
        >
          {scanStatus === 'success' ? 'SUCCESS' : 'ERROR'}
        </Text>
      </Box>
    );
  };

  return (
    <Box
      flex="1"
      p={4}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
      minW={{ base: "100%", md: "50%" }}
      maxW={{ base: "100%", lg: "50%" }}
    >
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="md">
          Scan Item
        </Heading>
        <StatusBox />
      </Flex>

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
        <Alert
          status={scanStatus === 'success' ? "success" : "error"}
          mt={4}
          borderRadius="md"
        >
          <AlertIcon />
          {message}
        </Alert>
      )}
    </Box>
  );
}

export default Form;