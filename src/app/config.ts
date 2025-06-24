const node = true
const baseUrl = node ? 'http://localhost:3020/data/' : 'http://localhost:8080/api/'
const config = {
    nodeApiEndpoints: {
        saveWorkflow: baseUrl + 'save-workflows',
        saveWorkflowWithId: baseUrl + 'update',
        users: baseUrl + 'users',
        workflows: baseUrl + 'workflows',
        upload: baseUrl + 'upload',
        st: false
    },
    javaApiEndpoints: {
        saveWorkflow: baseUrl + 'workflows/create',
        saveWorkflowWithId: baseUrl + 'workflows/update',
        users: baseUrl + 'groups',
        workflows: baseUrl + 'workflows',
        upload: baseUrl + 'files/upload',
        st: false
    }
};

const getConfig = () => {
    if (node) {   
        return config.nodeApiEndpoints;
    }
    return config.javaApiEndpoints;
};

export default getConfig;