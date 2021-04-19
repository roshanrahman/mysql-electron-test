import Header  from "./components/Header";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import ConfigContext from "./context/ConfigContext";
import { useEffect, useState } from "react";
import { LIST_FILES_IN_DIRECTORY } from "./shared/constants";
const {ipcRenderer} = window.require('electron');

const defaultConfig = {
  currentDir: localStorage.getItem('currentDir') || null,
  files: [],
}

function App() {

  const [configState, setconfigState] = useState(defaultConfig);

  useEffect(() => {
    
      if(configState.currentDir) {
        console.log("SENDING");
        ipcRenderer.send(LIST_FILES_IN_DIRECTORY, configState.currentDir);
      }
    ipcRenderer.on(LIST_FILES_IN_DIRECTORY, (event, args) => {
      document.title = 'Received data';
      console.log({args});
      setconfigState({...configState, files: args});
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
