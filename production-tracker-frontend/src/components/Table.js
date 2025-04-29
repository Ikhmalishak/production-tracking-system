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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

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
        const response = await fetch(
          `http://127.0.0.1:8000/api/skus/projects/${projectId}`
        );
        const result = await response.json();
        setSkuLists(result.data || []);
      } catch (error) {
        console.error("Error fetching SKUs:", error);
      } finally {
        setLoadingSkus(false);
      }
    };

    fetchSkus();
  }, [projectId]);

  // Fetch Scan Data whenever selectedSku OR refreshTrigger changes
  useEffect(() => {
    fetchData(selectedSku);
  }, [selectedSku, refreshTrigger]);

  const fetchData = async (sku = "") => {
    try {
      const url = sku
        ? `http://127.0.0.1:8000/api/scans?sku_id=${sku}`
        : `http://127.0.0.1:8000/api/scans`;

      const response = await fetch(url);
      const result = await response.json();
      setData(result.data.data || []);
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
    <TableContainer
      width={{ base: "100%", md: "50%" }}
      ml={{ base: 0, md: 10 }}
      overflowX="auto"
    >
      <Flex justifyContent="flex-end" align="center" mb="2">
        <Select
          placeholder={loadingSkus ? "Loading SKUs..." : "Filter by SKU"}
          size="xs"
          maxW={80}
          value={selectedSku}
          onChange={(e) => {
            const selected = e.target.value;
            console.log("Selected SKU:", selected);
            setSelectedSku(selected); // This will automatically trigger fetching!
          }}
          disabled={loadingSkus}
        >
          {skuLists.map((sku) => (
            <option key={sku.code} value={sku.id}>
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
                <Td>{item.sku.sku_code}</Td>
                <Td>{item.wip.wip_code}</Td>
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
  );
}

export default OutputList;
