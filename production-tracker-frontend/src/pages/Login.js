import {
    Box,
    Center,
    FormControl,
    FormLabel,
    Input,
    Button,
    Heading,
    useToast,
  } from "@chakra-ui/react";
  import { motion } from "framer-motion";
  import { useState, useEffect } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
  import { setToken, setUserRole } from "../utils/auth"; // Import the setToken function to store the token  

  function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const toast = useToast();
    const navigate = useNavigate(); // Initialize navigate for redirection
  
    // Show the form with a slight delay for better animation
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
  
      return () => clearTimeout(timer);
    }, []);
  
    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent page reload
      console.log("Login form submitted"); // 👈 Add this line
      setIsLoading(true); // Set loading state when form is submitted
  
      try {
        const response = await axios.post("http://localhost:8000/api/login", {
          email,
          password,
        });
        console.log("Response:", response.data);

        // Store token in localStorage
        const token = response.data.token;
        setToken(token);
    
        const role = response.data.user.role;
        setUserRole(role);
        console.log("User role:", role); // Log the user role

        toast({
          title: "Login successful.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
  
        // Redirect to the dashboard after successful login
        if (role === "admin") {
          navigate("/admindashboard");
        } else if (role === "operator") {
          navigate("/operatordashboard");
        } else {
          navigate("/");
        }
          
      } catch (error) {
        toast({
          title: "Login failed.",
          description: error.response?.data?.message || "Check your credentials",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false); // Reset loading state
      }
    };
  
    // Animation variants for smoother form transitions
    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: "easeOut",
        },
      },
    };
  
    return (
      <Center minHeight="100vh">
        <Box
          as={motion.form}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          onSubmit={handleSubmit}
          p={6}
          borderWidth={1}
          borderRadius="md"
          boxShadow="md"
          width="100%"
          maxWidth="400px"
        >
          <Heading
            mb={6}
            as={motion.h2}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Login
          </Heading>
          <Box
            as={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <FormControl id="email" mb={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </FormControl>
          </Box>
  
          <Box
            as={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <FormControl id="password" mb={6}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </FormControl>
          </Box>
          <Box
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              colorScheme="teal"
              type="submit"
              size="md"
              isLoading={isLoading}
              loadingText="Logging in"
              width="100%"
              _hover={{
                transform: "scale(1.02)",
                boxShadow: "lg",
              }}
              transition="all 0.2s"
            >
              Login
            </Button>
          </Box>
        </Box>
      </Center>
    );
  }
  
  export default Login;
  