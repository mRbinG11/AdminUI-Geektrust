import { useEffect, useState } from "react";
import axios from "axios";

import "./styles.css";
import DataTable from "./DataTable";

export default function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getUsers() {
      const data = await performAPICall();
      setUsers(data);
    }
    getUsers();
  }, []);

  const performAPICall = async () => {
    const api =
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
    try {
      const response = await axios.get(api);
      return response.data;
    } catch (err) {
      return [];
    }
  };

  return (
    <div className="App">
      <DataTable data={users} />
    </div>
  );
}
