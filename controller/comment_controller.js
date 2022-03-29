const {comment_valid} = require('../auth/valid')
const Comment = require('../models/commentmodel')
const User = require('../models/usermodel')


//********************* comment router **************************

//create comment by user
exports.createComment = async (req, res) => {
    try {
        if(!req.user.isAdmin){
            // comment joi validation
            const { error } = comment_valid(req.body)
            if (error) {
                return res.json(error.details[0].message)
            }
            const username = await User.findById(req.user.id)
            console.log(username)
            //doctor data save in  model 
            const commentData = new Comment({
                _id:req.user.id,
                name: username.username,
                email: username.email,
                comment: req.body.comment,
                star: req.body.star,
                profile: username.profile
            })
            try {
                const result = await commentData.save()
                const { ...data } = result._doc
                res.json(data)
            } catch (error) {
                res.json(error)
            }

        }else{
            return res.send('admin not create comment')
        }

    } catch (error) {
        res.json(error)
    }

}


//delete comment by user
exports.deleteComment = async (req, res) => {
    try {
        const id = req.params.id
        const data = await Comment.findByIdAndDelete(id)
        try {
            if (!data) {
                return res.status(400).send('wrong id are given')
            }
            res.send(`data is deleted ${data._id}`)
        } catch (error) {
            return res.send('error in client side')
        }

    } catch (error) {
        res.send(error)
    }
}


//update comment by user
exports.updateComment = async (req, res) => {
    try {
        // checking data validation
        const { error } = comment_valid(req.body)
        if (error) {
            return res.json(error.details[0].message)
        }
        const id = req.params.id
        const data = await Comment.findByIdAndUpdate(id, req.body)
        try {
            if (!data) {
                return res.status(400).send('wrong id are given')
            }
            res.send(`data is updated ${data._id}`)
        } catch (error) {
            return res.send('error in client side')
        }

    } catch (error) {
        res.send(error)
    }
}
