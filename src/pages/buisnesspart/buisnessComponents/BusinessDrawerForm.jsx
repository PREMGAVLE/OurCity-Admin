import React from "react";
import {
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  Stack, Input, Select, Button
} from "@chakra-ui/react";

const BusinessDrawerForm = ({ isOpen, onClose, btnRef, formData, setFormData, handleSubmit, loading, owners, categories }) => (
  <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
    <DrawerOverlay />
    <DrawerContent>
      <DrawerCloseButton />
      <DrawerHeader>Add Business</DrawerHeader>
      <DrawerBody>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Input placeholder="Business Name" value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} required />
            <Select placeholder="Select Owner" value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} required>
              {owners.map((user) => <option key={user._id} value={user._id}>{user.title || user.name}</option>)}
            </Select>
            <Input placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
            <Stack spacing={2}>
              <Input placeholder="Street" value={formData.address.street} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })} />
              <Input placeholder="City" value={formData.address.city} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })} />
              <Input placeholder="State" value={formData.address.state} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })} />
              <Input placeholder="Pincode" value={formData.address.pincode} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, pincode: e.target.value } })} />
            </Stack>
            <Select placeholder="Select Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
              {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </Select>
            <Button type="submit" colorScheme="purple" isLoading={loading}>Add Business</Button>
          </Stack>
        </form>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);

export default BusinessDrawerForm;
