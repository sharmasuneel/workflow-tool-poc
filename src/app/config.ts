const node = true
const config = {
    nodeApiEndpoints: {
        saveWorkflow: 'http://localhost:3020/data/save-workflows',
        users: 'http://localhost:3020/data/users',
        workflows: 'http://localhost:3020/data/workflows'
    },
    javaApiEndpoints: {
        saveWorkflow: '',
        users: '',
        workflows: ''
    }
};

const getConfig = () => {
    if (node) {   
        return config.nodeApiEndpoints;
    }
    return config.javaApiEndpoints;
};

export default getConfig;