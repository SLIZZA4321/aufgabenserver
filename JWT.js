const {sign, verify} = require('jsonwebtoken')
require("dotenv").config()

const createTokens = (user) => {
    const accessToken = sign(
        { id: user.id }, 
        process.env.TOKEN,
    )
    return accessToken
}

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"]

    if(!accessToken) return res.json({auth: false})

    try{
        const validToken = verify(accessToken, process.env.TOKEN)
        if(validToken) {
            res.json({auth: true})
            return next()
        }
    } catch(err) {
        return res.json({auth: false})
    }
}

module.exports = { createTokens, validateToken }