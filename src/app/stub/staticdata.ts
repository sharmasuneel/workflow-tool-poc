
const usersData = [
    {
        "userGroupId": 1,
        "type": "preparator",
        "name": "Preparator 1",
        "users": [
            { "userId": 1, "name": "Bob Prep", "role": "preparator" },
            { "userId": 2, "name": "Charlie Prep", "role": "preparator" },
            { "userId": 3, "name": "Alice Prep", "role": "preparator" }
        ]
    },
    {
        "userGroupId": 2,
        "type": "preparator",
        "name": "Preparator 2",
        "users": [
            { "userId": 4, "name": "David Prep", "role": "preparator" },
            { "userId": 5, "name": "Eve Prep", "role": "preparator" },
            { "userId": 6, "name": "Frank Prep", "role": "preparator" }
        ]
    },
    {
        "userGroupId": 3,
        "type": "preparator",
        "name": "Preparator 3",
        "users": [
            { "userId": 7, "name": "Grace Prep", "role": "preparator" },
            { "userId": 8, "name": "Heidi Prep", "role": "preparator" },
            { "userId": 9, "name": "Ivan Prep", "role": "preparator" }
        ]
    },
    {
        "userGroupId": 4,
        "type": "reviewer",
        "name": "Reviewer 1",
        "users": [
            { "userId": 10, "name": "Alice Rev", "role": "reviewer" },
            { "userId": 11, "name": "Bob Rev", "role": "reviewer" },
            { "userId": 12, "name": "Charlie Rev", "role": "reviewer" }
        ]
    },
    {
        "userGroupId": 5,
        "name": "Reviewer 2",
        "type": "reviewer",
        "users": [
            { "userId": 13, "name": "David Rev", "role": "reviewer" },
            { "userId": 14, "name": "Eve Rev", "role": "reviewer" },
            { "userId": 15, "name": "Frank Rev", "role": "reviewer" }
        ]
    },
    {
        "userGroupId": 6,
        "name": "Reviewer 3",
        "type": "reviewer",
        "users": [
            { "userId": 16, "name": "Grace Rev", "role": "reviewer" },
            { "userId": 17, "name": "Heidi Rev", "role": "reviewer" },
            { "userId": 18, "name": "Ivan Rev", "role": "reviewer" }
        ]
    },
    {
        "userGroupId": 7,
        "name": "Owner 1",
        "type": "owner",
        "users": [
            { "userId": 19, "name": "Alice Own", "role": "owner" },
            { "userId": 20, "name": "Bob Own", "role": "owner" },
            { "userId": 21, "name": "Charlie Own", "role": "owner" }
        ]
    },
    {
        "userGroupId": 8,
        "name": "Owner 2",
        "type": "owner",
        "users": [
            { "userId": 22, "name": "David Own", "role": "owner" },
            { "userId": 23, "name": "Eve Own", "role": "owner" },
            { "userId": 24, "name": "Frank Own", "role": "owner" }
        ]
    },
    {
        "userGroupId": 9,
        "name": "Owner 3",
        "type": "owner",
        "users": [
            { "userId": 25, "name": "Grace Own", "role": "owner" },
            { "userId": 26, "name": "Heidi Own", "role": "owner" },
            { "userId": 27, "name": "Ivan Own", "role": "owner" }
        ]
    },
    {
        "userGroupId": 10,
        "name": "Approver 1",
        "type": "approver",
        "users": [
            { "userId": 28, "name": "Alice App", "role": "approver" },
            { "userId": 29, "name": "Bob App", "role": "approver" },
            { "userId": 30, "name": "Charlie App", "role": "approver" }
        ]
    },
    {
        "userGroupId": 11,
        "name": "Approver 2",
        "type": "approver",
        "users": [
            { "userId": 31, "name": "David App", "role": "approver" },
            { "userId": 32, "name": "Eve App", "role": "approver" },
            { "userId": 33, "name": "Frank App", "role": "approver" }
        ]
    },
    {
        "userGroupId": 12,
        "name": "Approver 3",
        "type": "approver",
        "users": [
            { "userId": 34, "name": "Grace App", "role": "approver" },
            { "userId": 35, "name": "Heidi App", "role": "approver" },
            { "userId": 36, "name": "Ivan App", "role": "approver" }
        ]
    }
]

const workflowsData = [
    {
        "workflowId": 1,
        "workflow": "Quarterly Promotions",
        "progress": 80,
        "status": { "task": "In Progress", "review": "", "approval": "" },
        "assignedTo": [
            { "name": "Bob Prep", "id": 1, "role": "owner" },
            { "name": "Charlie Prep", "id": 2, "role": "reviewer" },
            { "name": "Alice Prep", "id": 3, "role": "approver" }
        ],
        "commentary": "",
        "createdBy": { "name": "Bob Prep", "id": 1, "role": "owner" }
    },
    {
        "workflowId": 2,
        "workflow": "Annual Salary Review",
        "progress": 60,
        "status": { "task": "", "review": "Waiting", "approval": "" },
        "assignedTo": [
            { "name": "Bob Prep", "id": 1, "role": "reviewer" },
            { "name": "Charlie Prep", "id": 2, "role": "owner" },
            { "name": "Alice Prep", "id": 3, "role": "reviewer" }
        ],
        "commentary": "",
        "createdBy": { "name": "Charlie Prep", "id": 2, "role": "owner" }
    },
    {
        "workflowId": 3,
        "workflow": "Project Kickoff",
        "progress": 40,
        "status": { "task": "", "review": "", "approval": "Waiting" },
        "assignedTo": [
            { "name": "Bob Prep", "id": 1, "role": "approver" },
            { "name": "Charlie Prep", "id": 2, "role": "reviewer" },
            { "name": "Alice Prep", "id": 3, "role": "owner" }
        ],
        "commentary": "",
        "createdBy": { "name": "Charlie Prep", "id": 3, "role": "owner" }
    },
    {
        "workflowId": 4,
        "workflow": "Product Launch",
        "progress": 90,
        "status": { "task": "In Progress", "review": "", "approval": "" },
        "assignedTo": [
            { "name": "Bob Prep", "id": 1, "role": "owner" },
            { "name": "Charlie Prep", "id": 2, "role": "reviewer" },
            { "name": "Alice Prep", "id": 3, "role": "preparator" }
        ],
        "commentary": "",
        "createdBy": { "name": "Bob Prep", "id": 1, "role": "owner" }
    }
];

export { workflowsData, usersData}