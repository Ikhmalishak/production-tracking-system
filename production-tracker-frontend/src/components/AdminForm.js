import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  Alert,
  AlertIcon,
  Heading,
  useColorModeValue,
  Container,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Stack,
  InputGroup,
  InputLeftElement,
  Icon,
  Badge,
  Text,
  Flex,
  Tooltip
} from '@chakra-ui/react';
import { 
  FiCode, 
  FiFileText, 
  FiPackage, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiHash, 
  FiGrid, 
  FiLayers 
} from 'react-icons/fi';
import axios from 'axios';

// Axios config
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});

// ProjectForm Component
export function ProjectForm({ initialData = {}, onSubmit }) {
  const [projectCode, setProjectCode] = useState(initialData.project_code || '');
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const bg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = { project_code: projectCode, name, description };

    try {
      const { data } = await axiosInstance.post('/projects', payload);
      console.log('Project created:', data);
      setIsSuccess(true);
      setMessage("Project created successfully!");
      onSubmit && onSubmit(data);
      
      // Reset form after successful submission
      if (!initialData.project_code) {
        setProjectCode('');
        setName('');
        setDescription('');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage(error.response?.data?.error || "Error creating project");
      console.error('Error submitting project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      bg={bg}
      borderRadius="lg"
      boxShadow="md"
      borderWidth="1px"
      borderColor={borderColor}
      overflow="hidden"
    >
      <CardHeader pb={0}>
        <Flex align="center">
          <Icon as={FiGrid} mr={2} color="teal.500" boxSize={5} />
          <Heading size="md">Create New Project</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <VStack spacing={5} align="stretch">
            <FormControl id="project_code" isRequired>
              <FormLabel>Project Code</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiCode} color="gray.400" />
                </InputLeftElement>
                <Input 
                  value={projectCode} 
                  onChange={(e) => setProjectCode(e.target.value)}
                  placeholder="Enter project code"
                  borderRadius="md"
                />
              </InputGroup>
            </FormControl>
            
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiFileText} color="gray.400" />
                </InputLeftElement>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter project name"
                  borderRadius="md"
                />
              </InputGroup>
            </FormControl>
            
            <FormControl id="description">
              <FormLabel>Description</FormLabel>
              <Textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a brief description of the project"
                borderRadius="md"
                rows={4}
              />
            </FormControl>
            
            <Button 
              type="submit" 
              colorScheme="teal" 
              size="md" 
              width="full"
              isLoading={isLoading}
              loadingText="Saving"
              leftIcon={<FiCheckCircle />}
              borderRadius="md"
              boxShadow="sm"
              _hover={{ boxShadow: 'md' }}
            >
              Save Project
            </Button>
          </VStack>
        </form>
        
        {message && (
          <Alert status={isSuccess ? "success" : "error"} mt={4} borderRadius="md">
            <AlertIcon />
            {message}
          </Alert>
        )}
      </CardBody>
    </Card>
  );
}

// SKUForm Component
export function SKUForm({ onSubmit }) {
  const [projectId, setProjectId] = useState('');
  const [skuCode, setSkuCode] = useState('');
  const [description, setDescription] = useState('');
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  const bg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const response = await axios.get('http://localhost:8000/api/projects');
        console.log("Successfully fetched", response.data.data.data);
        setProjects(response.data.data.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setMessage("Failed to load projects");
        setIsSuccess(false);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []); // Run only once on component mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = { project_id: projectId, sku_code: skuCode, description };

    try {
      const { data } = await axiosInstance.post('/skus', payload);
      setIsSuccess(true);
      setMessage("SKU created successfully!");
      console.log('SKU created:', data);
      onSubmit && onSubmit(data);
      
      // Reset form after successful submission
      setSkuCode('');
      setDescription('');
    } catch (error) {
      setIsSuccess(false);
      setMessage(error.response?.data?.error || "Error creating SKU");
      console.error('Error submitting SKU:', error.response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      bg={bg}
      borderRadius="lg"
      boxShadow="md"
      borderWidth="1px"
      borderColor={borderColor}
      overflow="hidden"
    >
      <CardHeader pb={0}>
        <Flex align="center">
          <Icon as={FiPackage} mr={2} color="teal.500" boxSize={5} />
          <Heading size="md">Create New SKU</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <VStack spacing={5} align="stretch">
            <FormControl id="project_id" isRequired>
              <FormLabel>Project</FormLabel>
              <Select 
                placeholder={isLoadingProjects ? "Loading projects..." : "Select project"} 
                value={projectId} 
                onChange={(e) => setProjectId(e.target.value)}
                isDisabled={isLoadingProjects}
                icon={<FiGrid />}
                borderRadius="md"
              >
                {projects.length > 0 ? (
                  projects.map((project) =>
                    <option key={project.id} value={project.id}>
                      {project.name} ({project.project_code})
                    </option>
                  )
                ) : (
                  <option disabled>No projects available</option>
                )}
              </Select>
            </FormControl>
            
            <FormControl id="sku_code" isRequired>
              <FormLabel>SKU Code</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiHash} color="gray.400" />
                </InputLeftElement>
                <Input 
                  value={skuCode} 
                  onChange={(e) => setSkuCode(e.target.value)}
                  placeholder="Enter SKU Code"
                  borderRadius="md"
                />
              </InputGroup>
            </FormControl>
            
            <FormControl id="description">
              <FormLabel>Description</FormLabel>
              <Textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a brief description of the SKU"
                borderRadius="md"
                rows={4}
              />
            </FormControl>
            
            <Button 
              type="submit" 
              colorScheme="teal" 
              size="md" 
              width="full"
              isLoading={isLoading}
              loadingText="Saving"
              leftIcon={<FiCheckCircle />}
              borderRadius="md"
              boxShadow="sm"
              _hover={{ boxShadow: 'md' }}
              isDisabled={isLoadingProjects}
            >
              Save SKU
            </Button>
          </VStack>
        </form>
        
        {message && (
          <Alert status={isSuccess ? "success" : "error"} mt={4} borderRadius="md">
            <AlertIcon />
            {message}
          </Alert>
        )}
      </CardBody>
    </Card>
  );
}

// WIPForm Component
export function WIPForm({ initialData = {}, onSubmit }) {
  const [skuId, setSkuId] = useState(initialData.sku_id || '');
  const [wipCode, setWipCode] = useState(initialData.wip_code || '');
  const [batchSize, setBatchSize] = useState(initialData.batch_size || '');
  const [status, setStatus] = useState(initialData.status || 'new');
  const [skus, setSkus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSkus, setIsLoadingSkus] = useState(true);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const bg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Status options
  const statusOptions = [
    { value: 'new', label: 'New', color: 'blue' },
    { value: 'in_progress', label: 'In Progress', color: 'orange' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'on_hold', label: 'On Hold', color: 'yellow' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
  ];

  useEffect(() => {
    const fetchSkus = async () => {
      setIsLoadingSkus(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/skus`);
        console.log(response.data.data.data);
        setSkus(response.data.data.data);
      } catch (error) {
        console.error('Error fetching SKUs:', error);
        setMessage("Failed to load SKUs");
        setIsSuccess(false);
      } finally {
        setIsLoadingSkus(false);
      }
    };

    fetchSkus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = { sku_id: skuId, wip_code: wipCode, batch_size: Number(batchSize), status };

    console.log(payload);

    try {
      const { data } = await axiosInstance.post('/wips', payload);
      console.log('WIP created:', data);
      setIsSuccess(true);
      setMessage("WIP created successfully!");
      onSubmit && onSubmit(data);
      
      // Reset form after successful submission
      if (!initialData.sku_id) {
        setWipCode('');
        setBatchSize('');
        setStatus('new');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage(error.response?.data?.error || "Error creating WIP");
      console.error('Error submitting WIP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (statusValue) => {
    const option = statusOptions.find(opt => opt.value === statusValue);
    return option ? (
      <Badge colorScheme={option.color} borderRadius="full" px={2}>
        {option.label}
      </Badge>
    ) : statusValue;
  };

  return (
    <Card
      bg={bg}
      borderRadius="lg"
      boxShadow="md"
      borderWidth="1px"
      borderColor={borderColor}
      overflow="hidden"
    >
      <CardHeader pb={0}>
        <Flex align="center">
          <Icon as={FiLayers} mr={2} color="teal.500" boxSize={5} />
          <Heading size="md">Create Work In Progress (WIP)</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <VStack spacing={5} align="stretch">
            <FormControl id="sku_id" isRequired>
              <FormLabel>SKU</FormLabel>
              <Select 
                placeholder={isLoadingSkus ? "Loading SKUs..." : "Select SKU"} 
                value={skuId} 
                onChange={(e) => setSkuId(e.target.value)}
                isDisabled={isLoadingSkus}
                icon={<FiPackage />}
                borderRadius="md"
              >
                {skus.length > 0 ? (
                  skus.map((sku) => (
                    <option key={sku.id} value={sku.id}>{sku.sku_code}</option>
                  ))
                ) : (
                  <option disabled>No SKUs available</option>
                )}
              </Select>
            </FormControl>
            
            <FormControl id="wip_code" isRequired>
              <FormLabel>WIP Code</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiCode} color="gray.400" />
                </InputLeftElement>
                <Input 
                  value={wipCode} 
                  onChange={(e) => setWipCode(e.target.value)}
                  placeholder="Enter WIP Code"
                  borderRadius="md"
                />
              </InputGroup>
            </FormControl>
            
            <FormControl id="batch_size" isRequired>
              <FormLabel>Batch Size</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiHash} color="gray.400" />
                </InputLeftElement>
                <Input 
                  type="number" 
                  value={batchSize} 
                  onChange={(e) => setBatchSize(e.target.value)}
                  placeholder="Enter batch size"
                  borderRadius="md"
                  min={1}
                />
              </InputGroup>
            </FormControl>
            
            <FormControl id="status" isRequired>
              <FormLabel>Status</FormLabel>
              <Select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                borderRadius="md"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Flex mt={2}>
                <Text fontSize="sm" color="gray.500" mr={2}>Current:</Text>
                {getStatusBadge(status)}
              </Flex>
            </FormControl>
            
            <Button 
              type="submit" 
              colorScheme="teal" 
              size="md" 
              width="full"
              isLoading={isLoading}
              loadingText="Saving"
              leftIcon={<FiCheckCircle />}
              borderRadius="md"
              boxShadow="sm"
              _hover={{ boxShadow: 'md' }}
              isDisabled={isLoadingSkus}
            >
              Save WIP
            </Button>
          </VStack>
        </form>
        
        {message && (
          <Alert status={isSuccess ? "success" : "error"} mt={4} borderRadius="md">
            <AlertIcon />
            {message}
          </Alert>
        )}
      </CardBody>
    </Card>
  );
}