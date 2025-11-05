import React, { useEffect, useState, useCallback } from "react";
import MyAdmin from "./Admin";
import * as signalR from "@microsoft/signalr";
import config from "config";

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenAdmin");
  const signalRUrl = config.signalRUrl;

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
        `${apiUrl}/staff-account-management?pageNo=1&pageSize=11`,
        requestOptions
      );
      
      // Kiểm tra lỗi 401 - Unauthorized
      if (response.status === 401) {
        localStorage.removeItem("tokenAdmin");
        localStorage.removeItem("admin");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        setRows([]);
        setLoading(false);
        return;
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
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    if (!token || !signalRUrl) {
      fetchData();
      return;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${signalRUrl}`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        // Connection started
      })
      .catch((err) => {
        // Error handling - không block UI
      });

    connection.on("LoadStaffAccounts", () => {
      fetchData();
    });

    fetchData();

    return () => {
      connection.stop().catch(() => {
        // Ignore errors on cleanup
      });
    };
  }, [fetchData, signalRUrl, token]);
  return <MyAdmin rows={rows} loading={loading} />;
};

export default Admin;
