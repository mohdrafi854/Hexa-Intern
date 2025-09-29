const tenantCheck = (req, res, next) => {
    const orgIdFromParams = req.params.organizationId || req.body.organizationId

    if(!orgIdFromParams){
        return res.status(400).json({error:"Organization ID is required"})
    }

    if(req.user.organizationId !== orgIdFromParams){
        return res.status(403).json({error:"Access denied: Wrong Organization"})
    }

    next();
}

module.exports = {tenantCheck}