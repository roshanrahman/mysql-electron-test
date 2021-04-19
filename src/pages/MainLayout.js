import React, { useContext, useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import ConfigContext from '../context/ConfigContext';
import { MdReplay } from 'react-icons/md';
import { REQUEST_HOME_DIR } from '../shared/constants';
const {ipcRenderer} = window.require('electron');

export default function MainLayout() {
    const [configState, setConfigState] = useContext(ConfigContext);
    const [hostVal, setHostVal] = useState('');
    const [dbnameVal, setdbnameVal] = useState('');
    const [usernameVal, setusernameVal] = useState('');
    const [passwordVal, setpasswordVal] = useState('');
    const [portVal, setportVal] = useState('3306');
    const [hello, sethello] = useState('helloworld');

    const isDisabled = () =>{
        return Boolean(hostVal) && Boolean(dbnameVal) && Boolean(usernameVal) && Boolean(passwordVal) && Boolean(portVal);
    }


    useEffect(()=>{
        if(!configState.currentDir) {
            ipcRenderer.invoke(REQUEST_HOME_DIR).then((value)=>{
                localStorage.setItem('currentDir', value);
                setConfigState({...configState, currentDir: value});
            });
        }
    }, [configState]);

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
            <label htmlFor="host" className="text-xs opacity-80">Server/Host (<button className="opacity-100 underline">Localhost</button>)</label>
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
            <div className="h-full right flex-1">
                {
                    configState.connected ? `Connected to ${configState.credentials}` : `Error occurred during connection`
                }
                {JSON.stringify(configState)}
            </div>
        </div>
        )
}
