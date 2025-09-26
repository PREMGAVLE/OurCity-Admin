import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, Text, Box, VStack, HStack, Badge } from '@chakra-ui/react';

const NotificationModal = ({ 
  isOpen, 
  onClose, 
  notifications, 
  onApprove, 
  onDeny, 
  loading = false 
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="80vh">
        <ModalHeader>
          <HStack justify="space-between" align="center">
            <Text fontSize="lg" fontWeight="bold">
              Pending Business Approvals
            </Text>
            <Badge colorScheme="red" variant="solid">
              {notifications.length} pending
            </Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {notifications.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Text color="gray.500" fontSize="lg">
                No pending businesses to review
              </Text>
            </Box>
          ) : (
            <VStack spacing={4} align="stretch">
              {notifications.map((notification, index) => (
                <Box
                  key={notification._id || index}
                  p={4}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  bg="white"
                  _hover={{ bg: "gray.50" }}
                >
                  <VStack align="stretch" spacing={3}>
                    <HStack justify="space-between" align="start">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold" fontSize="md">
                          {notification.name}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Category: {typeof notification.category === 'object' 
                            ? notification.category.name 
                            : notification.category || 'N/A'}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Owner: {notification.owner?.name || 'Unknown'}
                        </Text>
                        {notification.description && (
                          <Text fontSize="sm" color="gray.500" noOfLines={2}>
                            {notification.description}
                          </Text>
                        )}
                      </VStack>
                      <Badge 
                        colorScheme="orange" 
                        variant="solid"
                        fontSize="xs"
                      >
                        Pending
                      </Badge>
                    </HStack>
                    
                    <HStack justify="flex-end" spacing={2}>
                      <Button
                        size="sm"
                        colorScheme="green"
                        onClick={() => onApprove(notification._id)}
                        isLoading={loading}
                        loadingText="Approving..."
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => onDeny(notification._id)}
                        isLoading={loading}
                        loadingText="Rejecting..."
                      >
                        Deny
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NotificationModal;
