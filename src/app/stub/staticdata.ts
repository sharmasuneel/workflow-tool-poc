
const usersData = [
    {
        "userGroupId": 1,
        "type": "preparator",
        "name": "Preparator 1",
        "users": [
            { "userId": 1, "name": "Preparator 1", "role": "preparator" },
        ]
    },
    {
        "userGroupId": 2,
        "name": "Reviewer 2",
        "type": "reviewer",
        "users": [
            { "userId": 2, "name": "Reviewer 1", "role": "reviewer" },
        ]
    },
    {
        "userGroupId": 3,
        "name": "Owner 2",
        "type": "owner",
        "users": [
            { "userId": 3, "name": "Owner 1", "role": "owner" },
        ]
    },
    {
        "userGroupId": 4,
        "name": "Approver 1",
        "type": "approver",
        "users": [
            { "userId": 4, "name": "Approver 1", "role": "approver" },
        ]
    }
]


import workflowsData from './workflows.json';

export { workflowsData, usersData}