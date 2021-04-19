import Header from "./components/Header";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import ConfigContext from "./context/ConfigContext";
import { useEffect, useState } from "react";
import { getTableData, handleTableColumnResult } from "./shared/constants";
const { ipcRenderer } = window.require('electron');

const defaultConfig = {
  isBlank: true,
  credentials: null,
  isLoading: false,
  connected: false,
  result: null,
  lastQuery: '',
  tableColumns: {}
}

function App() {

  const [configState, setconfigState] = useState(defaultConfig);

  useEffect(() => {
    ipcRenderer.on('DB_TABLE_COLUMNS_QUERY_RESULT', (event, data) => {
    
      console.log({ data });
      if (!data.error) {
        const currentTableColumns = handleTableColumnResult(data.results, configState.tableColumns);
        setconfigState((prevState) => {
          return {
            ...prevState, 
            isBlank: false, 
            tableColumns: currentTableColumns
          }
        });
        // setconfigState({ ...configState, isBlank: false, tableColumns: currentTableColumns });
      }
    });
    return () => {
      ipcRenderer.removeAllListeners();
    }
  }
    , []);

  useEffect(() => {
    ipcRenderer.on('DB_LIST_TABLES_QUERY_RESULT', async (event, data) => {
     
      console.log({ data });
      if (!data.error) {
        setconfigState((prevState) => {
          return {
            ...prevState, 
            isBlank: false, 
            result: data.results, 
            lastQuery: data.query, 
            queryName: data.queryName, 
            error: null,
          }
        });
        // setconfigState({
        //   ...configState,
        //   isBlank: false,
        //   result: data.results,
        //   lastQuery: data.query,
        //   queryName: data.queryName,
        //   connected: true,
        //   error: null,
        // });
      }
      const tableNames = getTableData(data.results).map(val => val.tableName);
      console.log({ tableNames });
      tableNames.forEach((name) => {
        ipcRenderer.send('GET_TABLE_COLUMNS_QUERY', {
          tableName: name
        });
      })
    });
    return () => {
      ipcRenderer.removeAllListeners();
    }
  }, []);

  useEffect(() => {
    ipcRenderer.on('DB_CONNECTION_UPDATE', (event, data) => {
      console.log({ data });
      if (!data.error) {
        document.title = `MySQL Electron Test (Connected to ${data.credentials.database})`;
      } else {
        window.alert(data.error);
        document.title = `MySQL Electron Test (Connection error, please retry)`;
      }
      setconfigState((prevState) => {
        return {
          ...prevState, 
          credentials: data.credentials, 
          connected: !data.error,
          isBlank: false, 
          isLoading: false
        }
      });
      // setconfigState({
      //   ...configState,
      //   credentials: data.credentials,
      //   connected: !data.error,
      //   isBlank: false,
      //   isLoading: false
      // });
    });
    return () => {
      ipcRenderer.removeAllListeners();
    }
  }, []);

  return (
    <div className="App">
      <ConfigContext.Provider value={[configState, setconfigState]}>
        <Router>
          <Switch>
            <Route path="/modal">
              <div>This will be rendered in modal</div>
            </Route>
            <Route path="/">
              <MainLayout />
            </Route>
          </Switch>

        </Router>
      </ConfigContext.Provider>
    </div>
  );
}

export default App;
