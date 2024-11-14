import React, { useContext, useEffect, useState } from "react";

import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  MdOutlineRadioButtonChecked,
  MdOutlineRadioButtonUnchecked,
} from "react-icons/md";
import DeliveryAddressContext from "../context/DeliveryAddProviderContext";
import { useNavigate } from "react-router-dom";

const DeliveryAddress = () => {
  const {
    selectDeliveryAddress,
    updateDeliveryAddress,
    deleteDeliveryAddress,
    addDeliveryAddress,
    setAddress,
    setUpdateAddress,
    selectedAddress,
    updateAddress,
    userAddress,
    address,
    allFieldsFilled,
  } = useContext(DeliveryAddressContext);

  const navigate = useNavigate();

  const handleInput = (e) => {
    if (updateAddress?._id !== undefined) {
      setUpdateAddress({ ...updateAddress, [e.target.name]: e.target.value });
    } else {
      setAddress({ ...address, [e.target.name]: e.target.value });
    }
  };

  const setDeliveryAddressAndNavigate = (data) => {
    selectDeliveryAddress(data);
    navigate("/checkout");
  };

  return (
    <div className="w-full  mt-28 md:mt-20 lg:mt-20 p-4 flex flex-col md:flex-row justify-between">
      <div className="left max-w-md h-[420px] bg-white space-y-4 rounded shadow-md">
        <div className="text-center text-gray-600 text-xl pt-4 font-semibold">
          {updateAddress?._id ? (
            <h1>Update delivery address</h1>
          ) : (
            <h1>Add a new delivery address</h1>
          )}
        </div>

        <div className="p-2 space-y-3">
          <div>
            <input
              type="text"
              name="fullName"
              value={
                updateAddress?._id ? updateAddress?.fullName : address.fullName
              }
              placeholder="Full Name"
              className="w-full px-2 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 rounded"
              onChange={handleInput}
            />
          </div>

          <div>
            <textarea
              type="text"
              name="address"
              value={
                updateAddress?._id ? updateAddress?.address : address.address
              }
              placeholder="Address"
              className="w-full px-2 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 rounded"
              onChange={handleInput}
            />
          </div>

          <div>
            <input
              type="text"
              name="phoneNumber"
              value={
                updateAddress?._id
                  ? updateAddress?.phoneNumber
                  : address.phoneNumber
              }
              placeholder="Phone Number"
              className="w-full px-2 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 rounded"
              onChange={handleInput}
            />
          </div>

          <div className="flex justify-between">
            <input
              type="text"
              name="country"
              value={
                updateAddress?._id ? updateAddress?.country : address.country
              }
              placeholder="Country"
              className="w-[45%] px-2 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 rounded"
              onChange={handleInput}
            />
            <input
              type="text"
              name="state"
              value={updateAddress?._id ? updateAddress?.state : address.state}
              placeholder="State"
              className="w-1/2  px-2 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 rounded"
              onChange={handleInput}
            />
          </div>

          <div className="flex justify-between">
            <input
              type="text"
              name="city"
              value={updateAddress?._id ? updateAddress?.city : address.city}
              placeholder="City"
              className="w-[45%]  px-2 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 rounded"
              onChange={handleInput}
            />
            <input
              type="text"
              name="pincode"
              value={
                updateAddress?._id ? updateAddress?.pincode : address.pincode
              }
              placeholder="Pincode"
              className="w-1/2 px-2 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 rounded"
              onChange={handleInput}
            />
          </div>

          <div>
            {updateAddress?._id !== undefined ? (
              <button
                onClick={() => updateDeliveryAddress()}
                className="w-full border-none rounded font-semibold bg-blue-500 py-2 hover:bg-blue-400 transition-colors duration-700"
              >
                update Address
              </button>
            ) : (
              <button
                onClick={() => addDeliveryAddress()}
                className="w-full border-none font-semibold rounded bg-blue-500 py-2 hover:bg-blue-400 transition-colors duration-700"
              >
                Save Address
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="right flex md:w-2/3 md:p-4 flex-col flex-wrap  gap-4 ">
        <div className="shadow-md p-4 rounded">
          <h1 className="text-center text-gray-600 text-xl font-semibold">
            Select a delivery address
          </h1>
        </div>

        <div className="flex flex-row justify-between gap-4 flex-wrap w-full">
          {userAddress?.map((data, index) => (
            <div
              key={index}
              className="p-4 bg-white shadow-md w-[448px] hover:shadow-lg"
            >
              <div className="flex justify-end space-x-4">
                {selectedAddress?.selectedAddressId === data._id ? (
                  <MdOutlineRadioButtonChecked
                    className="text-lg cursor-pointer text-blue-500"
                    onClick={() => selectDeliveryAddress(data)}
                  />
                ) : (
                  <MdOutlineRadioButtonUnchecked
                    className="text-lg text-blue-500 cursor-pointer"
                    onClick={() => selectDeliveryAddress(data)}
                  />
                )}
                <FaEdit
                  className="text-lg text-green-500 cursor-pointer"
                  onClick={() => setUpdateAddress(data)}
                />
                <MdDelete
                  className="text-lg text-red-500 cursor-pointer"
                  onClick={() => deleteDeliveryAddress(data._id)}
                />
              </div>
              <h1 className="font-semibold">
                Full Name : <span className="font-normal">{data.fullName}</span>
              </h1>
              <h1 className="font-semibold">
                Address : <span className="font-normal">{data.address}</span>
              </h1>
              <h1 className="font-semibold">
                Country : <span className="font-normal">{data.country}</span>
              </h1>
              <h1 className="font-semibold">
                State : <span className="font-normal">{data.state}</span>
              </h1>
              <h1 className="font-semibold">
                City : <span className="font-normal">{data.city}</span>
              </h1>
              <h1 className="font-semibold">
                Pincode : <span className="font-normal">{data.pincode}</span>
              </h1>
              <h1 className="font-semibold">
                Phone Number :{" "}
                <span className="font-normal">{data.phoneNumber}</span>
              </h1>

              <div className="my-4">
                {selectedAddress?.selectedAddressId === data._id ? (
                  <button
                    className="w-full py-2 rounded bg-orange-500 hover:bg-orange-400 transition-colors duration-700"
                    style={{ cursor: "pointer" }}
                    onClick={() => setDeliveryAddressAndNavigate(data)}
                  >
                    Deliver to this address
                  </button>
                ) : (
                  <button
                    className="w-full py-2 rounded bg-orange-500 hover:bg-orange-400 transition-colors duration-700"
                    disabled
                    style={{
                      cursor: "not-allowed",
                      opacity: 0.6,
                    }}
                  >
                    Deliver to this address
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddress;
