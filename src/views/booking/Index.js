import React, { useState, useEffect, useCallback } from "react";
import DataTable from "./Booking";
import config from "config";

const Booking = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenAdmin");

  const fetchData = useCallback(async () => {
    // Kiểm tra token trước khi gọi API
    if (!token) {
      setLoading(false);
      return;
    }

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/admin/booking-management?pageNo=1&pageSize=300`,
        requestOptions
      );
      
      // Kiểm tra lỗi 401 - Unauthorized
      if (response.status === 401) {
        localStorage.removeItem("tokenAdmin");
        localStorage.removeItem("admin");
        window.location.href = "/login";
        return;
      }

      // Tạm thời bỏ qua lỗi 500 - Internal Server Error
      if (response.status === 500) {
        setRows([]);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setRows([]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        // Filter out null/undefined rows
        const validRows = data.data.filter((row) => row);
        setRows(validRows);
      } else {
        setRows([]);
      }
    } catch (error) {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <DataTable rows={rows} loading={loading} />
    </>
  );
};

export default Booking;
