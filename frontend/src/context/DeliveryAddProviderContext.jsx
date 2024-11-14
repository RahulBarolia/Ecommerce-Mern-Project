import { createContext, useState, useEffect, useContext } from "react";
import AuthContext, { apiClient } from "../context/AuthProviderContext";
import { toast } from "react-toastify";

const DeliveryAddressContext = createContext();

export const DeliveryAddressProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [address, setAddress] = useState({
    fullName: "",
    pincode: "",
    address: "",
    phoneNumber: "",
    country: "",
    state: "",
    city: "",
  });

  const allFieldsFilled = Object.values(address).every(
    (field) => field.trim() !== ""
  );

  const [userAddress, setUserAddress] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState([]);

  const [updateAddress, setUpdateAddress] = useState(null);

  const fetchDeliveryAddress = async () => {
    try {
      const response = await apiClient.get("/address/user");
      if (response.data.success) {
        setUserAddress(response.data.address);
        if (response?.data?.address?.length === 0) {
          await deleteAllUserSelectedAddresses();
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const addDeliveryAddress = async () => {
    try {
      if (!allFieldsFilled) {
        toast.error("All fields are required");
      } else {
        const response = await apiClient.post("/address/user", address);
        if (response.data.success) {
          setAddress({
            fullName: "",
            pincode: "",
            address: "",
            phoneNumber: "",
            country: "",
            state: "",
            city: "",
          });

          fetchDeliveryAddress();
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteDeliveryAddress = async (addressId) => {
    try {
      const response = await apiClient.delete(`/address/user/${addressId}`);
      if (response.data.success) {
        setAddress({
          fullName: "",
          pincode: "",
          address: "",
          phoneNumber: "",
          country: "",
          state: "",
          city: "",
        });
        setUpdateAddress(null);
        fetchDeliveryAddress();
        setSelectedAddress(null);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateDeliveryAddress = async () => {
    try {
      const response = await apiClient.put("/address/user", updateAddress);
      if (response.data.success) {
        setUpdateAddress(null);
        await deleteAllUserSelectedAddresses();
        await fetchDeliveryAddress();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // selected address logic

  const fetchSelectedDeliveryAddress = async () => {
    try {
      const response = await apiClient.get("/selectedAddress/user");

      if (response.data.success) {
        setSelectedAddress(response?.data?.address[0]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const addSelectedDeliveryAddress = async (selectedAddress) => {
    try {
      const response = await apiClient.post(
        "/selectedAddress/user",
        selectedAddress
      );
      if (response.data.success) {
        fetchSelectedDeliveryAddress();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteSelectedDeliveryAddress = async () => {
    try {
      const { _id } = selectedAddress;
      const response = await apiClient.delete(
        `/selectedAddress/user/deleted/${_id}`
      );

      if (response.data.success) {
        setSelectedAddress(null);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteAllUserSelectedAddresses = async () => {
    try {
      const response = await apiClient.delete(
        "/selectedAddress/user/deleted/all"
      );
      if (response.data.success) {
        setSelectedAddress(null);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const selectDeliveryAddress = async (selected_address) => {
    try {
      if (selectedAddress && selectedAddress._id === selected_address._id) {
        await deleteSelectedDeliveryAddress();
        setSelectedAddress(null);
      } else {
        if (selectedAddress) {
          await deleteSelectedDeliveryAddress();
          setSelectedAddress(null);
        } else {
          await addSelectedDeliveryAddress(selected_address);
        }
        if (selectedAddress !== null) {
          await addSelectedDeliveryAddress(selected_address);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDeliveryAddress();
      fetchSelectedDeliveryAddress();
    }
  }, [user]);

  const contextValue = {
    selectDeliveryAddress,
    updateDeliveryAddress,
    deleteDeliveryAddress,
    addDeliveryAddress,
    setAddress,
    setSelectedAddress,
    setUpdateAddress,
    selectedAddress,
    updateAddress,
    userAddress,
    address,
    deleteAllUserSelectedAddresses,
    allFieldsFilled,
  };

  return (
    <DeliveryAddressContext.Provider value={contextValue}>
      {children}
    </DeliveryAddressContext.Provider>
  );
};

export default DeliveryAddressContext;
