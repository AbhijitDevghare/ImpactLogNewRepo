function isCommunityOrOrg(role)
{
    console.log(role)
    if(role == 'NGO'|| role=='GOVERNMENT' || role== 'ADMIN' || role== 'COMMUNITY')
    {
        return true;
    }
    
    return false;
    
}

export default isCommunityOrOrg