import Header  from "./components/Header";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import ConfigContext from "./context/ConfigContext";
import { useEffect, useState } from "react";
import { LIST_FILES_IN_DIRECTORY } from "./shared/constants";
const {ipcRenderer} = window.require('electron');

const defaultConfig = {
  credentials: null,
  isLoading: false, 
  connected: false,
  result: null,
  lastQuery: '',
}

function App() {

  const [configState, setconfigState] = useState(defaultConfig);

  useEffect(() => {
   ipcRenderer.on('DB_QUERY_RESULT', (event, data) => {
     console.log({data});
     if(!data.error) {
       setconfigState({
         ...configState, 
         result: data.results, 
         lastQuery: data.query,
         error: null,
       });
     }
   });
    ipcRenderer.on('DB_CONNECTION_UPDATE', (event, data) =>{
      console.log({data});
      if(!data.error) {
        document.title = `${document.title} (Connected to ${data.credentials.database})`;
      } else {
        window.alert(data.error);
      }
      setconfigState({...configState, 
        credentials: data.credentials,  
        connected: !data.error,
        isLoading: false});
    });
    return ()=>{
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
          <MainLayout/>
        </Route>
      </Switch>

      </Router>
      </ConfigContext.Provider>
    </div>
  );
}

export default App;
