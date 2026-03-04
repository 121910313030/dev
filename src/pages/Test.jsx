import { useEffect , useState } from "react";
import API from "../api/api";
import { div } from "framer-motion/client";

const TestData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await API.get("api/test/");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h2>Data from Django</h2>
      {data.map((item) => (
        <div key={item.id}>
          <p>{item.name} - {item.email}</p>
        </div>
      ))}
    </div>
  );
};

export default TestData;