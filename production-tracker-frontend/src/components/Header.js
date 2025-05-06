// Updated Header.js - Full width across the page
import React from 'react';
import {
  Box,
  Heading,
  Flex,
  Spacer,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';

function Header({ title }) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      as="header"
      py={4}
      px={6}
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      boxShadow="sm"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="30"
      width="100%"
    >
      <Flex align="center" width="100%">
        <Heading size="lg" color="teal">
          {title}
        </Heading>
        <Spacer />
        <IconButton
          icon={<RepeatIcon />}
          aria-label="Refresh"
          onClick={() => window.location.reload()}
          colorScheme="teal"
          variant="outline"
        />
      </Flex>
    </Box>
  );
}

export default Header;