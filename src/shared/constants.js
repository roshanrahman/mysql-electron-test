const LIST_FILES_IN_DIRECTORY = "LIST_FILES_IN_DIRECTORY";

const ACCEPTABLE_FILE_EXTENSIONS = ['md', 'txt', 'js', 'java', 'html'];

const REQUEST_HOME_DIR = "REQUEST_HOME_DIR";

const getTableData = (result) => {
    console.log({result});
    const cleanData = [];
    if(!result) return [];
    result.forEach((table) => {
        if(table.TABLE_TYPE === 'BASE TABLE') {
            cleanData.push({
                tableName: table.TABLE_NAME,
                tableRows: table.TABLE_ROWS 
            });
        }
    });
    console.log({cleanData});
    return cleanData;
}
const handleTableColumnResult = (result, previous) => {
    if(!previous) {
        previous = {};
    }
    if(!result) {
        return {};
    }
    const data = result.map((column) => {
        return {
            columnName: column.COLUMN_NAME, 
            columnType: column.DATA_TYPE, 
        }
    });

    previous[result[0].TABLE_NAME] = data; 
    return previous;  
};

module.exports = {
    LIST_FILES_IN_DIRECTORY,
    ACCEPTABLE_FILE_EXTENSIONS,
    REQUEST_HOME_DIR,
    getTableData,
    handleTableColumnResult
};