exports.session

exports.getSession(sessionId){
    const session = sessions(sessionId)
    return session && session.valid ?session :null
}

exports.invalidateSession(sessionId){
    const session = sessions(sessionId)
    if(session){
        sessions[sessionId].valid = false
    }
}