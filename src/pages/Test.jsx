import { useEffect , useState } from "react";
import API from "../api/api";

const TestData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getResumes();
      setData(response.data);
      console.log(response.data, "RESULT");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>
          <p>{item.name} - {item.email}</p>
        </div>
      ))}
    </div>
  );
};


export default TestData;