import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Select,
  Flex,
  Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/api"; // Adjust the import path if needed

function OutputList({ refreshTrigger, skuId, projectId }) {
  const [data, setData] = useState([]);
  const [selectedSku, setSelectedSku] = useState("");
  const [skuLists, setSkuLists] = useState([]);
  const [loadingSkus, setLoadingSkus] = useState(false);

  // Fetch SKUs when projectId changes
  useEffect(() => {
    const fetchSkus = async () => {
      if (!projectId) return;

      setLoadingSkus(true);
      try {
        const response = await axiosInstance.get(`/skus/projects/${projectId}`);
        console.log("SKUs response:", response.data.data);
        setSkuLists(response.data.data || []);
      } catch (error) {
        console.error("Error fetching SKUs:", error);
      } finally {
        setLoadingSkus(false);
      }
    };

    fetchSkus();
  }, [projectId]);

  // Fetch scan data when selectedSku or refreshTrigger changes
  useEffect(() => {
    fetchData(selectedSku);
  }, [selectedSku, refreshTrigger]);

  const fetchData = async (sku = "") => {
    try {
      const url = sku ? `/scans?sku_id=${sku}` : `/scans`;
      const response = await axiosInstance.get(url);
      console.log("Scan data:", response.data.data.data);
      setData(response.data.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  };

  // When parent initially sends skuId, set it
  useEffect(() => {
    if (skuId) {
      setSelectedSku(skuId);
    }
  }, [skuId]);

  return (
    <Box
      flex="1"
      p={4}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
      minW={{ base: "100%", md: "35%" }}
      maxW={{ base: "100%", lg: "30%" }}
    >
      <TableContainer width="100%" overflowX="auto">
        <Flex justifyContent="flex-end" align="center" mb="2">
          <Select
            placeholder={loadingSkus ? "Loading SKUs..." : "Filter by SKU"}
            size="xs"
            maxW={80}
            value={selectedSku}
            onChange={(e) => {
              const selected = e.target.value;
              console.log("Selected SKU:", selected);
              setSelectedSku(selected);
            }}
            disabled={loadingSkus}
          >
            {skuLists.map((sku) => (
              <option key={sku.id} value={sku.id}>
                {sku.sku_code || `SKU ${sku.id}`}
              </option>
            ))}
          </Select>
        </Flex>

        <Table variant="striped" colorScheme="teal" size="sm">
          <TableCaption>Scan Records</TableCaption>
          <Thead>
            <Tr>
              <Th>SKU Number</Th>
              <Th>WIP ID</Th>
              <Th>Serial Number</Th>
              <Th>Scan number</Th>
              <Th>Date & Time</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.sku?.sku_code}</Td>
                  <Td>{item.wip?.wip_code}</Td>
                  <Td>{item.serial_id}</Td>
                  <Td>{item.scan_number}</Td>
                  <Td>{new Date(item.created_at).toLocaleString()}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={5}>No data available</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default OutputList;
