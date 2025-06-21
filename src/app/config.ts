const node = true
const config = {
    nodeApiEndpoints: {
        saveWorkflow: 'http://localhost:3020/data/save-workflows',
        saveWorkflowWithId: 'http://localhost:3020/data/update',
        users: 'http://localhost:3020/data/users',
        workflows: 'http://localhost:3020/data/workflows',
        upload: 'http://localhost:3020/data/upload',
    },
    javaApiEndpoints: {
        saveWorkflow: 'http://localhost:8080/api/workflows',
        saveWorkflowWithId: 'http://localhost:8080/api/update',
        users: 'http://localhost:8080/api/groups',
        workflows: 'http://localhost:8080/api/workflows',
        upload: 'http://localhost:8080/api/files/upload'
    }
};

const getConfig = () => {
    if (node) {   
        return config.nodeApiEndpoints;
    }
    return config.javaApiEndpoints;
};

export default getConfig;