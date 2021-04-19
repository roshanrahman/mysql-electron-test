import React, { useContext, useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import ConfigContext from '../context/ConfigContext';
import { MdReplay } from 'react-icons/md';
import { REQUEST_HOME_DIR } from '../shared/constants';
import {getTableData} from  "../shared/constants";
const {ipcRenderer} = window.require('electron');

export default function MainLayout() {
    const [configState, setConfigState] = useContext(ConfigContext);
    const [hostVal, setHostVal] = useState('');
    const [dbnameVal, setdbnameVal] = useState('');
    const [usernameVal, setusernameVal] = useState('');
    const [passwordVal, setpasswordVal] = useState('');
    const [portVal, setportVal] = useState('3306');
    const [hello, sethello] = useState('helloworld');

  


    return (
        <div className="flex h-screen">

            {/* LEFT SIDE HEADER  */}
            <div className="left bg-gray-100 h-full flex flex-col">
            <div className="w-80 bg-red-800 p-2 flex items-center">

                <div className="group cursor-pointer hover:cursor-pointer flex-1 location flex items-center text-white">
                    <div className=" flex-1 flex flex-col">
                        <span className="text-xs opacity-50">
                            MYSQL ELECTRON EXPLORER 
                        </span>
                    </div>
                    
                    <button 
                    disabled={!configState.credentials && configState.isLoading}
                    onClick={
                        ()=>{
                            ipcRenderer.send('REFRESH_LIST_TABLES_QUERY');
                        }
                    }
                    className="
                    hover:text-red-700
                    hover:bg-red-100
                    disabled:opacity-30
                    flex items-center rounded bg-white text-red-800 text-xs font-bold p-2">
                        <MdReplay className="mr-2"/>
                        REFRESH
                    </button>
                </div>

                
            </div>
            <div className="h-4"></div>
            <div className="flex flex-col p-2 space-y-1 mb-2">
            <label htmlFor="host" className="text-xs opacity-80">Server/Host (<button onClick={
                ()=> {
                    setHostVal('localhost');
                }
            } className="opacity-100 underline">Localhost</button>)</label>
            <input type="text" name="host" id="host" placeholder="Host"
            value={
                hostVal
            }
            onChange={
                (event) =>{
                    setHostVal(event.target.value);
                }
            }
            />    </div>   

            <div className="flex flex-col p-2 space-y-1 mb-2">
            <label htmlFor="host" className="text-xs opacity-80">Database Name</label>
            <input type="text" name="dbname" id="dbname" placeholder="Database Name"
            value={
                dbnameVal
            }
            onChange={
                (event) =>{
                    setdbnameVal(event.target.value);
                }
            }
            />    </div>  

            <div className="flex flex-col p-2 space-y-1 mb-2">
            <label htmlFor="host" className="text-xs opacity-80">Username</label>
            <input type="text" name="username" id="username" placeholder="Username"
            value={
                usernameVal
            }
            onChange={
                (event) =>{
                    setusernameVal(event.target.value);
                }
            }
            />    </div>    

            <div className="flex flex-col p-2 space-y-1 mb-2">
            <label htmlFor="host" className="text-xs opacity-80">Password</label>
            <input type="password" name="password" id="password" placeholder="Password"
            value={
                passwordVal
            }
            onChange={
                (event) =>{
                    setpasswordVal(event.target.value);
                }
            }
            />    </div>  

            <div className="flex flex-col p-2 space-y-1 mb-2">
            <label htmlFor="host" className="text-xs opacity-80">Port</label>
            <input type="number" name="host" id="host" placeholder="Port" 
            value={
                portVal
            }
            onChange={
                (event) =>{
                    setportVal(event.target.value);
                }
            }
            />    </div> 
<div className="flex-1"></div>

            <button
            disabled={configState.isLoading ||
                (Boolean(hostVal) && Boolean(dbnameVal) && Boolean(usernameVal) && Boolean(passwordVal) && Boolean(portVal)) === false
            }
            onClick={
                ()=>{
                    ipcRenderer.send('SET_DB_CREDENTIALS', {
                        host: hostVal, 
                        dbname: dbnameVal, 
                        username: usernameVal, 
                        password: passwordVal, 
                        port: portVal
                    });
                    setConfigState({...configState, isLoading: true});
                }
            }
            className="rounded shadow-md bg-red-800 text-white p-2 m-2 mb-4 disabled:opacity-30">
                {
                    configState.isLoading ? "CONNECTION IN PROGRESS" : "CONNECT TO DB"
                }
            </button>

            </div>
            
                {/* RIGHT SIDE HEADER */}
            {
               !configState.isBlank ? <div className="flex flex-col  h-full w-full overflow-y-scroll right flex-1">
                <div className="bg-gray-800 p-2 m-2 rounded self-stretch">
                   {
                       getTableData(configState.result).length > 0 ? <div className="">
                           <span className="text-white opacity-50 text-xs">TABLES DETECTED</span>
                  <ul className="text-white font-bold">
                  {
                      getTableData(configState.result).map((item) => <li>{item.tableName} <span className="font-normal">(with {item.tableRows} rows)</span></li>)
                   }
                  </ul>
                       </div> : 
                       <div className="">
                           NO TABLES DETECTED
                       </div>
                   }
                </div>
                {
                    Object.entries(configState.tableColumns).map((entries) => {
                    const tableName = entries[0];
                    const columns = entries[1];
                    return <div className="p-2 w-full max-w-sm border-gray-400 rounded border m-2">
                        {tableName}
                        <ul>
                           { columns.map(column => {
                                return <li>
                                    <div className="li p-2 bg-gray-200 bg-opacity-25 rounded m-2 flex justify-between">
                                        <span className="rounded bg-red-800 p-1 text-xs font-bold uppercase text-white">{column.columnType}</span>
                                        <span>{column.columnName}</span>
                                    </div>
                                </li>
                            })}
                        </ul>
                    </div>;
                    })
                }
            </div> : (
                <div className="bg-gray-200 h-full w-full flex items-center justify-center cursor-default">
                    <span className="">Please connect to a database to view details
                    </span>
                </div>
            )
            }
        </div>
        )
}
