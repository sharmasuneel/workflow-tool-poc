import { AnyGridOptions } from "ag-grid-community/dist/types/src/propertyKeys";
import { parseCommentary } from "./dataSubmission";
import { getSignalClass } from "./gridProperties";
import { mapper } from "./functionMapper";
function toFormData(obj: any, fileNameKey: string): FormData {
    const formData = new FormData();
    const filesUploadType = ['withTemplateFile', 'withDataFile']
    for (const key in obj) {
        if (key === 'files') {
            // iterrate through obj.files as object with keys like withTemplateFile, withDataFile
            if (typeof obj.files === 'object') {
                const filesWithTemplate = obj.files['withTemplateFile']
                if (filesWithTemplate) {
                    if (Array.isArray(filesWithTemplate)) {
                        filesWithTemplate.forEach((file: File) => {
                            formData.append('withTemplateFile', file);
                        });
                    }
                }
                const filesWithData = obj.files['withDataFile']
                if (filesWithData) {
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

function flattenObject(obj: any, parentKey = '', result: any = {}) {
    for (let key in obj) {
        const propName = parentKey ? `${parentKey}_${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            flattenObject(obj[key], propName, result);
        } else {
            result[propName] = obj[key] || '';
        }
    }
    return result;
}



export function flattenData(data: any, extraAttributes: any) {
    const addExtras = (item: any) => {
        const flat = flattenObject(item);
       const eas= extraAttributes.map((ea: any) => {
            const { name, params  } = ea.func;
            [ea.attr] = mapper[name](...getParamValues(params, flat));
            return ea;
        });
        return {
            ...flat, ...eas
        };
    };
    if (Array.isArray(data)) {
        return data.map(addExtras);
    } else if (typeof data === 'object' && data !== null) {
        return addExtras(data);
    } else {
        throw new Error("Unsupported data type");
    }
}
function getParamValues(params: any, data: any) {
    return params.map((param: any) => {
        return data[param];
    });
}

function transformData(data: any[], users: any, role: string) {
    const usersByGroupId = getAssignedToUsersById(users, role)
    return data.map(item => {
        const transformedStatus = parseCommentary(item.commentary)
        const totalTasks = Array.isArray(item.tasks) ? item.tasks.length : 0;
        const completedTasks = Array.isArray(item.tasks) ? item.tasks.filter((t: any) => t.status === 'completed').length : 0;
        const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        return {
            workflowName: item.workflowName,
            workflowId: item.workflowId,
            progress: progressPercent + '%',
            status: {
                task: transformedStatus.taskStatus,
                approval: transformedStatus.approveStatus,
                review: transformedStatus.reviewStatus
            },
            assignedToUsers: [users.preparator, users.reviewer, users.approver, users.owner],
            assignedTo: [users.preparator, users.reviewer, users.approver, users.owner].map((user: any) => user.name + ' | ' + user.role).join(', '),
            createdBy: usersByGroupId,
            commentary: item.commentary
        }
    });
}

function filterDataBySelectedTab(selectedTab: string, role: string, data: any, users: any[]) {
    const tData = transformData(data, users, role)
    const dd = tData
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