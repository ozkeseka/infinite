import React from "react";
import axios from "axios";
import "./styles.css";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Paper,
  TextField
} from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroll-component";

export default function App() {
  const [allData, setAllData] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [value, setValue] = React.useState("");
  const count = React.useRef(0);

  const getApiData = React.useCallback(async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos/"
      );
      setAllData((prevAllData) => [
        ...prevAllData,
        ...response.data.slice(0, 10)
      ]);
      setData((prevData) => [...prevData, ...response.data.slice(0, 10)]);
      count.current += 1;
    } catch (error) {
      console.log(error);
    }

    //   .then((response) => {
    //     setData([...data, ...response.data]);
    //   })
    //   .catch((error) => console.log(error));
    // count.current += 1;
  }, []);

  React.useEffect(() => {
    getApiData();
  }, [getApiData]);

  React.useEffect(() => {
    FilterTable();
  }, [value, allData]);

  console.log(data);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const FilterTable = () => {
    if (allData.length > 0) {
      let lastData = allData.filter((x) =>
        x.title.toLowerCase().includes(value)
      );
      if (JSON.stringify(lastData) !== JSON.stringify(data)) {
        setData(lastData);
      }
    }
  };

  return (
    <div className="App">
      <TextField
        id="outlined-basic"
        label="Title Filter"
        variant="outlined"
        value={value}
        onChange={handleChange}
      />
      <TableContainer
        id="test-table"
        component={Paper}
        style={{
          height: "50vh",
          overflowY: "scroll"
        }}
      >
        <InfiniteScroll
          scrollableTarget="test-table"
          dataLength={data.length}
          loader={
            <div
              style={{
                width: "100px",
                height: "100px",
                margin: "auto",
                padding: "50px"
              }}
            >
              <CircularProgress color="secondary" />
            </div>
          }
          hasMore={count.current < 3}
          next={getApiData}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {data[0] &&
                  Object.keys(data[0]).map((cellName) => (
                    <TableCell key={cellName}>{cellName}</TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow>
                  {Object.keys(row).map((cell) => (
                    <TableCell>{row[cell]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </InfiniteScroll>
      </TableContainer>
    </div>
  );
}
