import React from 'react'
import PropTypes from 'prop-types'

function FileListItem(props) {
    if(props.selected) {
        return (
            <div className="bg-white ml-3 p-2 my-1 rounded-l-lg">
                <div className=" ">
                    <span className="bg-blue-600 rounded p-1 text-xs text-white font-bold mr-2">{props.extension}</span>
                    <span>{props.name}</span>
                </div>
            </div>
        )
    }
    return (
        <div className="bg-blue-200 bg-opacity-50 mx-3 p-2 my-1 rounded cursor-pointer group">
                <div className=" ">
                    <span className="bg-blue-600 bg-opacity-10 rounded p-1 text-xs text-blue-600 font-bold mr-2 uppercase">{props.extension}</span>
                    <span className="group-hover:text-blue-600">{props.name}</span>

                </div>
            </div>
    )
}

FileListItem.propTypes = {
    selected: PropTypes.bool, 
    name: PropTypes.string, 
    fullPath: PropTypes.string, 
    extension: PropTypes.string 
}

export default FileListItem;

