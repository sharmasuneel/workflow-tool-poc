function toFormData(obj: any): FormData {
    
    const formData = new FormData();
    for (const key in obj) {
        if(key === 'files') {
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

export { toFormData }