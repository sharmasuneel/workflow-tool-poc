import { AnyGridOptions } from "ag-grid-community/dist/types/src/propertyKeys";

function toFormData(obj: any, fileNameKey: string): FormData {
    const formData = new FormData();
    for (const key in obj) {
        if (key === 'files') {
            if (Array.isArray(obj.files)) {
                obj.files.forEach((file: File, index: number) => {
                    formData.append(fileNameKey, file);
                });
            }
            continue;
        }
        if (obj.hasOwnProperty(key)) {
            formData.append(key, obj[key]);
        }
    }
    return formData;
}


function getUniqueUserById(userGroups: any, userId: number) {
    const allUsers = userGroups.flatMap((group: any) => group.users);
    const filteredUsers = allUsers.filter((user: any) => user.userId === userId);
    return filteredUsers.length > 0 ? filteredUsers[0] : null;
}

function getAssignedToUsers(assignedToUsers: any) {
    return assignedToUsers//.flatMap((group: any) => group.users);
}


function getAssignedToUsersById(users: any, userId: number) {
    return users.filter((group: any) => group.userGroupId === userId)[0].users;
}


function transformData(data: any[], users: any[], userId: number) {
    const usersByGroupId = getAssignedToUsersById(users, userId)
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
            createdBy: getUniqueUserById(users, userId),
            assignedTo: getAssignedToUsers(usersByGroupId).map((user: any) => user.name + ' | ' + user.role).join(', '),
            assignedToUsers: getAssignedToUsers(usersByGroupId),
            commentary: item.commentary || 'No comments'
        }
        return dd
    });
    return d
}

function filterDataBySelectedTab(selectedTab: string, userId: number, data: any, users: any[]) {
    const tData = transformData(data, users, userId)
    const dd =  tData
        .map((item: any) => {
            const user = item.assignedToUsers.find((u: any) => {
                return u.userId === userId
            } 
        );
            return user ? { ...item, myRole: user.role } : null;
        })
        .filter((item: any) => item?.myRole === selectedTab);
        return dd
}

export { toFormData, filterDataBySelectedTab, transformData }