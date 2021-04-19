import React, { useContext, useEffect } from 'react'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import ConfigContext from '../context/ConfigContext';
import { MdEdit, MdHome } from 'react-icons/md';
import { LIST_FILES_IN_DIRECTORY, REQUEST_HOME_DIR } from '../shared/constants';
import FileListItem from '../components/FileListItem';
const {ipcRenderer} = window.require('electron');
export default function MainLayout() {
    const [configState, setConfigState] = useContext(ConfigContext);

    useEffect(()=>{
        if(!configState.currentDir) {
            ipcRenderer.invoke(REQUEST_HOME_DIR).then((value)=>{
                localStorage.setItem('currentDir', value);
                setConfigState({...configState, currentDir: value});
            });
        }
    });

    return (
        <div className="flex h-screen">
            <div className="left bg-gray-100 h-full flex flex-col">
            {/* LEFT SIDE HEADER  */}
            <div className="w-80 bg-blue-800 p-2 flex h-15 items-center">
                <button 
                title="Change to user's Documents directory"
                className="h-7 w-7 mr-2 btn p-1 bg-white bg-opacity-20 rounded hover:bg-opacity-100 group">
                <MdHome size="20" className="text-white group-hover:text-blue-600"/>
                </button>
                <div className="group cursor-pointer hover:cursor-pointer flex-1 location flex items-center text-white">
                    <div className=" flex-1 flex flex-col">
                        <span className="text-xs opacity-50">
                            WORKSPACE FOLDER 
                        </span>
                <span className="group-hover:underline">
                {configState.currentDir }
                </span>
                    </div>
                    <div className="p-1 group-hover:bg-white rounded">
                <MdEdit size="20" className="rounded group-hover:text-blue-600"/>
                    </div>
                </div>
            </div>
            {/* LEFT SIDEBAR CONTENT - i.e. LIST OF FILES */}
            <div className="h-2"></div>
            <div className="list overflow-y-scroll">
            {
                configState.files.map(file => {
                    return <FileListItem name={file.name} extension={file.extension}/>
                })
            }
            </div>

            </div>
            <div className="h-full right flex-1">
                {/* RIGHT SIDE HEADER */}
                <div className=" bg-gray-200 p-2 flex content-between h-14 items-center">
                <span className="font-bold flex-1">
                    note1.md
                </span>
                <div className="buttons">
                    <button className="rounded bg-white p-2 mr-2">
                        Export to PDF
                    </button>
                    <button disabled={true}  className="rounded bg-blue-600 text-white p-2 disabled:opacity-20">
                        Save Changes
                    </button>
                </div>
                
            </div>
            <Editor

  toolbarClassName="toolbarClassName"
  wrapperClassName="wrapperClassName"
  editorClassName="editorClassName px-6"
//   onEditorStateChange={this.onEditorStateChange}
/>
            </div>
        </div>
        )
}
