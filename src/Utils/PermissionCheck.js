
export const handleCheckPermission = (collaborators, userId) => {    
    let permission = '';
    collaborators?.forEach(ele => {
        if(ele?.userId=== userId){
            permission = ele?.permission;
        }
    });
    return permission;
}