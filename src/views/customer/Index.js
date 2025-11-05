import React, { useEffect, useState, useCallback } from "react";
import MyCustomer from "./Customer";
import * as signalR from "@microsoft/signalr";
import config from "config";

const Customer = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenAdmin");
  const signalRUrl = config.signalRUrl;

  const fetchData = useCallback(async () => {
    // Kiểm tra token trước khi gọi API
    if (!token) {
      console.error("Token không tồn tại. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Replace `token` with your actual bearer token
        "Content-Type": "application/json", // Replace with the appropriate content type
      },
    };
    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/accounts/customer?pageNo=1&pageSize=22`,
        requestOptions
      );
      
      // Kiểm tra lỗi 401 - Unauthorized
      if (response.status === 401) {
        console.error("Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
        // Xóa token cũ và redirect về login
        localStorage.removeItem("tokenAdmin");
        localStorage.removeItem("admin");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        // Filter out null/undefined rows và đảm bảo có userId
        const validRows = data.data.filter((row) => row && (row.userId || row.id));
        setRows(validRows);
      } else {
        setRows([]);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    // Kiểm tra token trước khi kết nối SignalR
    if (!token) {
      fetchData(); // Vẫn gọi fetchData để hiển thị lỗi
      return;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${signalRUrl}`, {
        accessTokenFactory: () => token, // Thêm token vào SignalR connection
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .catch((err) => {
        console.error("SignalR Connection Error: ", err);
        // Không block UI nếu SignalR fail
      });

    connection.on("LoadCustomerList", () => {
      fetchData();
    });

    fetchData();

    return () => {
      if (connection.state !== signalR.HubConnectionState.Disconnected) {
        connection.stop();
      }
    };
  }, [fetchData, signalRUrl, token]);
  return <MyCustomer rows={rows} loading={loading} />;
};

export default Customer;
