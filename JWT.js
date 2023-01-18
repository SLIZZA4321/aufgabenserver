const {sign, verify} = require('jsonwebtoken')

const createTokens = (user) => {
    const accessToken = sign(
        { id: user.id }, 
        "iajwhuAAJGFAGPHireherheurtiosjagawgwegwjzrtujejetjetjetawrgaiozuwrgZUßÜöawrfaäawfaöfwapßZaiowiuiuhuoioäü+ijhuzuazguwtfzafasbhdbZTTWZTAVGDSAVGVG!Uhhuiaf#a,faw",
    )
    return accessToken
}

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"]

    if(!accessToken) return res.json({auth: false})

    try{
        const validToken = verify(accessToken, "iajwhuAAJGFAGPHireherheurtiosjagawgwegwjzrtujejetjetjetawrgaiozuwrgZUßÜöawrfaäawfaöfwapßZaiowiuiuhuoioäü+ijhuzuazguwtfzafasbhdbZTTWZTAVGDSAVGVG!Uhhuiaf#a,faw")
        if(validToken) {
            res.json({auth: true})
            return next()
        }
    } catch(err) {
        return res.json({auth: false})
    }
}

module.exports = { createTokens, validateToken }