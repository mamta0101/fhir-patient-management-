const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    console.log("reached")
    try {
        console.log(req.headers['authorization'])
        let token = req.headers['authorization']
        if (!token) return res.status(400).json({ msg: "Invalid Authentication." })
        console.log(token)
        token = token.slice(7)
        jwt.verify(token, "fhir-secret", (err, user) => {
            if (err) return res.status(400).json({ msg: "Invalid Authentication." })

            req.user = user.id
           
            next()
        })

    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

module.exports = auth