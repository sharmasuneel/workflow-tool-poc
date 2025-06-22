function toFormData(obj: any): FormData {

    const formData = new FormData();
    for (const key in obj) {
        if (key === 'files') {
            if (Array.isArray(obj.files)) {
                obj.files.forEach((file: File, index: number) => {
                    formData.append('file', file);
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

function transformData(data: any[]) {
    return data.map(item => ({
      workflow: item.workflow,
      workflowId: item.workflowId,
      progress: item.progress + '%',
      status: {
        task: item.status.task,
        review: item.status.review || 'waiting approval',
        approval: item.status.approval || 'waiting approval'
      },
      createdBy: item.createdBy,
      assignedTo: item.assignedTo.map((user: any) => user.name + ' | ' + user.role).join(', '),
      assignedToUsers: item.assignedTo.map((user: any) => user),
      commentary: item.commentary || 'No comments'
    }));
  }

function filterDataBySelectedTab(selectedTab: string, userId: string, data: any) {
    const tData = transformData(data)
    return tData
        .map((item: any) => {
            const user = item.assignedToUsers.find((u: any) => u.id === userId);
            return user ? { ...item, myRole: user.role } : null;
        })
        .filter((item: any) => item?.myRole === selectedTab);
}

export { toFormData, filterDataBySelectedTab, transformData }