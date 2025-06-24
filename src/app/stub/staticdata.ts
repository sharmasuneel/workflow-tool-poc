
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

const workflowsData = [
    {
        "workflowName": "Quarterly Promotions",
        "workflowId": 1,
        "progress": 80,
        "approverGroupId": 4,
        "reviewerGroupId": 2,
        "preparatorGroupId": 1,
        "createdBy": 1,
        "drawflow": "{\"drawflow\":{\"Home\":{\"data\":{\"1\":{\"id\":1,\"name\":\"start\",\"data\":{},\"class\":\"start\",\"html\":\"<img src=\\\"assets/icons/Start.png\\\" alt=\\\"Start\\\" style=\\\"width: 60px; height: 60px; vertical-align: middle; margin: 12px;\\\"><span>Start</span>\",\"typenode\":false,\"inputs\":{},\"outputs\":{\"output_1\":{\"connections\":[{\"node\":\"2\",\"output\":\"input_1\"}]}},\"pos_x\":-278.2857142857143,\"pos_y\":-152.85714285714286},\"2\":{\"id\":2,\"name\":\"upload\",\"data\":{},\"class\":\"upload\",\"html\":\"<img src=\\\"assets/icons/Upload.png\\\" alt=\\\"Upload\\\" style=\\\"width: 60px; height: 60px; vertical-align: middle; margin: 12px;\\\"><span>Upload</span>\",\"typenode\":false,\"inputs\":{\"input_1\":{\"connections\":[{\"node\":\"1\",\"input\":\"output_1\"}]}},\"outputs\":{\"output_1\":{\"connections\":[{\"node\":\"3\",\"output\":\"input_1\"}]}},\"pos_x\":131,\"pos_y\":-128},\"3\":{\"id\":3,\"name\":\"download\",\"data\":{},\"class\":\"download\",\"html\":\"<img src=\\\"assets/icons/Download.png\\\" alt=\\\"Download\\\" style=\\\"width: 60px; height: 60px; vertical-align: middle; margin: 12px;\\\"><span>Download</span>\",\"typenode\":false,\"inputs\":{\"input_1\":{\"connections\":[{\"node\":\"2\",\"input\":\"output_1\"}]}},\"outputs\":{\"output_1\":{\"connections\":[{\"node\":\"6\",\"output\":\"input_1\"}]}},\"pos_x\":553.5714285714286,\"pos_y\":-76},\"4\":{\"id\":4,\"name\":\"review\",\"data\":{},\"class\":\"review\",\"html\":\"<img src=\\\"assets/icons/Decision.png\\\" alt=\\\"Review\\\" style=\\\"width: 60px; height: 60px; vertical-align: middle; margin: 12px;\\\"><span>Review</span>\",\"typenode\":false,\"inputs\":{\"input_1\":{\"connections\":[{\"node\":\"6\",\"input\":\"output_1\"}]}},\"outputs\":{\"output_1\":{\"connections\":[{\"node\":\"5\",\"output\":\"input_1\"}]}},\"pos_x\":1262.5714285714287,\"pos_y\":154},\"5\":{\"id\":5,\"name\":\"attestation\",\"data\":{},\"class\":\"attestation\",\"html\":\"<img src=\\\"assets/icons/Attest.png\\\" alt=\\\"Attestation\\\" style=\\\"width: 60px; height: 60px; vertical-align: middle; margin: 12px;\\\"><span>Attestation</span>\",\"typenode\":false,\"inputs\":{\"input_1\":{\"connections\":[{\"node\":\"4\",\"input\":\"output_1\"}]}},\"outputs\":{},\"pos_x\":1644,\"pos_y\":11},\"6\":{\"id\":6,\"name\":\"upload\",\"data\":{},\"class\":\"upload\",\"html\":\"<img src=\\\"assets/icons/Upload.png\\\" alt=\\\"Upload\\\" style=\\\"width: 60px; height: 60px; vertical-align: middle; margin: 12px;\\\"><span>Upload</span>\",\"typenode\":false,\"inputs\":{\"input_1\":{\"connections\":[{\"node\":\"3\",\"input\":\"output_1\"}]}},\"outputs\":{\"output_1\":{\"connections\":[{\"node\":\"4\",\"output\":\"input_1\"}]}},\"pos_x\":918,\"pos_y\":-92.57142857142857}}}}}",
        "status": { "task": "In Progress", "review": "", "approval": "" },
        "assignedToX": [
            {
                "userGroupId": 11,
                "type": "approver",
                "name": "Approver 2",
                "users": [
                    { "userId": 31, "name": "David App", "role": "approver" },
                    { "userId": 32, "name": "Eve App", "role": "approver" },
                    { "userId": 33, "name": "Frank App", "role": "approver" }
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
                "userGroupId": 1,
                "type": "preparator",
                "name": "Preparator 1",
                "users": [
                    { "userId": 1, "name": "Bob Prep", "role": "preparator" },
                    { "userId": 2, "name": "Charlie Prep", "role": "preparator" },
                    { "userId": 3, "name": "Alice Prep", "role": "preparator" }
                ]
            }
        ],
        "tasks": [
            {
                "name": "Prepare Document",
                "businessName": "Finance Audit of India",
                "preparator": 2,
                "reviewer": 4,  
                "approver": 12,
                "fileType": "CSV",
                "autoVersioning": false,
                "taskType": "upload",
                "fileNames": []
            }
        ],
        "commentary": "",
        "createdBy": 1
    }
];

export { workflowsData, usersData}