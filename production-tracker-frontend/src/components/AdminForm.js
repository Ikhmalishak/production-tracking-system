import React, { useState,useEffect } from 'react';
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
  AlertIcon
} from '@chakra-ui/react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { project_code: projectCode, name, description };

    try {
      const { data } = await axiosInstance.post('/projects', payload);
      console.log('Project created:', data);
      onSubmit && onSubmit(data);
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  return (
    <Box p={4} bg="white" borderRadius="md" boxShadow="sm">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl id="project_code" isRequired>
            <FormLabel>Project Code</FormLabel>
            <Input value={projectCode} onChange={(e) => setProjectCode(e.target.value)} />
          </FormControl>
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl id="description">
            <FormLabel>Description</FormLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormControl>
          <Button type="submit" colorScheme="teal">Save Project</Button>
        </VStack>
      </form>
    </Box>
  );
}

// SKUForm Component
export function SKUForm({onSubmit }) {
  const [projectId, setProjectId] = useState('');
  const [skuCode, setSkuCode] = useState('');
  const [description, setDescription] = useState('');
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState("")

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/projects');
        console.log("Successfully fetched", response.data.data.data);
        setProjects(response.data.data.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []); // Run only once on component mount

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { project_id: projectId, sku_code: skuCode, description };

    try {
      const { data } = await axiosInstance.post('/skus', payload);
      setIsSuccess(true);
      console.log('SKU created:', data);
      onSubmit && onSubmit(data);
    } catch (error) {
      setIsSuccess(false);
      setMessage(error.response?.data?.error);
      console.error('Error submitting SKU:', error.response?.data?.error);
    }
  };

  return (
    <Box p={4} bg="white" borderRadius="md" boxShadow="sm">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl id="project_id" isRequired>
            <FormLabel>Project</FormLabel>
            <Select placeholder="Select project" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              {projects.length > 0 ? (
                projects.map((project) =>
                <option key={project.id} value={project.id}>{project.name}</option>
                )
              ):(
                <option disabled>Loading projects..............</option>
              )}
            </Select>
          </FormControl>
          <FormControl id="sku_code" isRequired>
            <FormLabel>SKU Code</FormLabel>
            <Input value={skuCode} onChange={(e) => setSkuCode(e.target.value)} />
          </FormControl>
          <FormControl id="description">
            <FormLabel>Description</FormLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormControl>
          <Button type="submit" colorScheme="teal">Save SKU</Button>
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

// WIPForm Component
export function WIPForm({ initialData = {}, onSubmit }) {
  const [skuId, setSkuId] = useState(initialData.sku_id || '');
  const [wipCode, setWipCode] = useState(initialData.wip_code || '');
  const [batchSize, setBatchSize] = useState(initialData.batch_size || '');
  const [status, setStatus] = useState(initialData.status || '');
  const [skus, setSkus] = useState([]);

  useEffect(() => {
    //create async function to ensure the api get fully loaded first by using await 
    const fetchSkus = async () => {
      const response = await axios.get(`http://localhost:8000/api/skus`);
      console.log(response.data.data.data);
      setSkus(response.data.data.data)
    }

    console.log(skus);
    //call back the functions
    fetchSkus();
  },[])

  useEffect(() => {
    console.log(skus)
  })

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { sku_id: skuId, wip_code: wipCode, batch_size: batchSize, status };

    console.log(payload);

    try {
      const { data } = await axiosInstance.post('/wips', payload);
      console.log('WIP created:', data);
      onSubmit && onSubmit(data);
    } catch (error) {
      console.error('Error submitting WIP:', error);
    }
  };

  return (
    <Box p={4} bg="white" borderRadius="md" boxShadow="sm">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl id="sku_id" isRequired>
            <FormLabel>SKU</FormLabel>
            <Select placeholder="Select SKU" value={skuId} onChange={(e) => setSkuId(e.target.value)}>
              {skus.map((sku) => (
                <option key={sku.id} value={sku.id}>{sku.sku_code}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl id="wip_code" isRequired>
            <FormLabel>WIP Code</FormLabel>
            <Input value={wipCode} onChange={(e) => setWipCode(e.target.value)} />
          </FormControl>
          <FormControl id="batch_size" isRequired>
            <FormLabel>Batch Size</FormLabel>
            <Input type="number" value={batchSize} onChange={(e) => setBatchSize(e.target.value)} />
          </FormControl>
          <FormControl id="status" isRequired>
            <FormLabel>Status</FormLabel>
            <Input value={status} onChange={(e) => setStatus(e.target.value)} />
          </FormControl>
          <Button type="submit" colorScheme="teal">Save WIP</Button>
        </VStack>
      </form>
    </Box>
  );
}
