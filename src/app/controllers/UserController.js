module.exports = {

    async registerForm(req, res) {
        try {
            return res.render("users/register")
        } catch (error) {
            
        }
    }
}