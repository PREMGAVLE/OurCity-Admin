import React, { useState, useEffect } from 'react';

const RegisterBusinessForm = ({
  categories = [],
  onSubmit,
  initialData = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    facebook: '',
    instagram: '',
  });

  const [responseMsg, setResponseMsg] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || '',
        description: initialData.description || '',
        street: initialData.address?.street || '',
        city: initialData.address?.city || '',
        state: initialData.address?.state || '',
        pincode: initialData.address?.pincode || '',
        phone: initialData.contact?.phone || '',
        email: initialData.contact?.email || '',
        facebook: initialData.socialLinks?.facebook || '',
        instagram: initialData.socialLinks?.instagram || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMsg('');

    const submissionData = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      contact: {
        phone: formData.phone,
        email: formData.email,
      },
      socialLinks: {
        facebook: formData.facebook,
        instagram: formData.instagram,
      },
    };

    try {
      await onSubmit(submissionData);
      setResponseMsg('✅ Operation successful!');
      if (!initialData) {
        setFormData({
          name: '',
          category: '',
          description: '',
          street: '',
          city: '',
          state: '',
          pincode: '',
          phone: '',
          email: '',
          facebook: '',
          instagram: '',
        });
      }
    } catch (error) {
 
    //   setResponseMsg('❌ Operation failed.');
    console.error('API Error:', error); 
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4"
    >
      {[
        { label: 'Business Name', name: 'name' },
        { label: 'Street', name: 'street' },
        { label: 'City', name: 'city' },
        { label: 'State', name: 'state' },
        { label: 'Pincode', name: 'pincode' },
        { label: 'Phone', name: 'phone' },
        { label: 'Email', name: 'email' },
        { label: 'Facebook URL', name: 'facebook' },
        { label: 'Instagram URL', name: 'instagram' },
      ].map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">{field.label}</label>
          <input
            type="text"
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            required
            className="px-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm"
            placeholder={`Enter ${field.label}`}
          />
        </div>
      ))}

      {/* Category Dropdown */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="md:col-span-2 flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="px-4 py-3 rounded-xl border border-gray-300 resize-none h-28 shadow-sm"
        ></textarea>
      </div>

      <div className="md:col-span-2 flex justify-center mt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition duration-300 shadow-md"
        >
          {loading ? 'Submitting...' : initialData ? 'Update Business' : 'Register Business'}
        </button>
      </div>

      {responseMsg && (
        <div className="md:col-span-2 text-center mt-4 text-blue-700 font-medium">
          {responseMsg}
        </div>
      )}
    </form>
  );
};

export default RegisterBusinessForm;
