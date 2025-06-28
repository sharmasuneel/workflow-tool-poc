import { AnyGridOptions } from "ag-grid-community/dist/types/src/propertyKeys";
import { parseCommentary } from "./dataSubmission";

function toFormData(obj: any, fileNameKey: string): FormData {
    const formData = new FormData();
    const filesUploadType =['withTemplateFile', 'withDataFile']
    for (const key in obj) {
        if (key === 'files') {
            // iterrate through obj.files as object with keys like withTemplateFile, withDataFile
            if (typeof obj.files === 'object') {
                const filesWithTemplate = obj.files['withTemplateFile']
                if(filesWithTemplate) {
                    if (Array.isArray(filesWithTemplate)) {
                            filesWithTemplate.forEach((file: File) => {
                                formData.append('withTemplateFile', file);
                            });
                        }
                } 
                const filesWithData = obj.files['withDataFile']
                if(filesWithData) {
                    if (Array.isArray(filesWithData)) {
                            filesWithData.forEach((file: File) => {
                                formData.append('withDataFile', file);
                            });
                        }
                } 
            } 
            continue;
        }
        if (obj.hasOwnProperty(key)) {
            formData.append(key, obj[key]);
        }
    }
    return formData;
}


function getUniqueUserById(userGroups: any, role: string) {
    const allUsers = userGroups.flatMap((group: any) => group.users);
    const filteredUsers = allUsers.filter((user: any) => user.role === role);
    return filteredUsers.length > 0 ? filteredUsers[0] : null;
}

function getAssignedToUsers(assignedToUsers: any) {
    return assignedToUsers//.flatMap((group: any) => group.users);
}


function getAssignedToUsersById(users: any, role: string) {
    return users[role]
    //.filter((group: any) => group.userGroupId === userId)[0].users;
}


function transformData(data: any[], users: any, role: string) {
    const usersByGroupId = getAssignedToUsersById(users, role)
    const d = data.map(item => {
        const dd = {
            workflowName: item.workflowName,
            workflowId: item.workflowId,
            progress: item.progress + '%',
            status: {
                task: item.status.task || 'in-progress',
                review: item.status.review || 'waiting approval',
                approval: item.status.approval || 'waiting approval'
            },
            assignedToUsers: [users.preparator, users.reviewer, users.approver, users.owner],
            assignedTo: [users.preparator, users.reviewer, users.approver, users.owner].map((user: any) => user.name + ' | ' + user.role).join(', '),
            createdBy: usersByGroupId,
            commentary: item.commentary
        }
        return dd
    });
    return d
}

function filterDataBySelectedTab(selectedTab: string, role: string, data: any, users: any[]) {
    const tData = transformData(data, users, role)
    const dd =  tData
        .map((item: any) => {
            const user = item.assignedToUsers.find((u: any) => {
                return u.role === role
            } 
        );
            return user ? { ...item, myRole: user.role } : null;
        })
        .filter((item: any) => item?.myRole === selectedTab);
        return dd
}

export { toFormData, filterDataBySelectedTab, transformData }