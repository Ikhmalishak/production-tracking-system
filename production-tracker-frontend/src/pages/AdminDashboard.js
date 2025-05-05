import React, { useState } from "react";
import { Box, Flex, Select } from "@chakra-ui/react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { ProjectForm, SKUForm, WIPForm } from "../components/AdminForm"; // adjust import path

function App() {
  const [formType, setFormType] = useState(""); // '', 'project', 'sku', or 'wip'

  const dummySKUs = [
    { id: 1, sku_code: "SKU-001" },
    { id: 2, sku_code: "SKU-002" },
  ];

  const handleFormSubmit = (payload) => {
    console.log("Form submitted with:", payload);
  };

  return (
    <>
      <Header title="Production Tracking System" />
      <Flex>
        <Sidebar />
        <Box flex="1" ml={{ base: 0, md: "240px" }} p={6}>
          {/* Dropdown to select form */}
          <Select
            placeholder="Select form to create"
            mb={4}
            onChange={(e) => setFormType(e.target.value)}
            value={formType}
          >
            <option value="project">Project</option>
            <option value="sku">SKU</option>
            <option value="wip">WIP</option>
          </Select>

          {/* Conditionally render form */}
          {formType === "project" && <ProjectForm onSubmit={handleFormSubmit} />}
          {formType === "sku" && (
            <SKUForm onSubmit={handleFormSubmit} />
          )}
          {formType === "wip" && (
            <WIPForm skus={dummySKUs} onSubmit={handleFormSubmit} />
          )}
        </Box>
      </Flex>
    </>
  );
}

export default App;