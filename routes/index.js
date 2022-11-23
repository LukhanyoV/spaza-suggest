module.exports = spazaSuggest => {

    // client suggest page
    const clientSuggest = async (req, res) => {
        res.render("clientsuggest");
    }

    // client register
    const clientRegister = (req, res) => {
        res.render("clientregister");
    }
    const clientRegisterPost = async (req, res) => {
        try {
            let {username} = req.body;
            username = username.trim().toLowerCase().replace(/./, c => c.toUpperCase());
            if(!username){
                req.flash("info", "Username cannot be empty");
            } else {
                const code = await spazaSuggest.registerClient(username);
                if(code){
                    req.flash("success", `Registration success your code is ${code}`);
                }
            }
        } catch (error) {
            console.log(error.stack);
            req.flash("error", "Unknown error has occured");
        } finally {
            res.redirect("back");
        }
    }

    // client login
    const clientLogin = (req, res) => {
        res.render("clientlogin");
    }
    const clientLoginPost = async (req, res) => {
        try {
            let {clientcode} = req.body;
            clientcode = clientcode.trim();
            if(!clientcode){
                req.flash("info", "Client code cannot be empty");
            } else {
                const client = await spazaSuggest.clientLogin(clientcode);
                if(!client){
                    req.flash("error", `Client with code "${clientcode}" not found`);
                } else {
                    // don't save client code in session
                    delete client?.code;
                    req.session.client = client;
                }
            }
        } catch (error) {
            console.log(error.stack);
            req.flash("error", "Unknown error has occured");
        } finally {
            res.redirect("back");
        }
    }
    
    return {
        clientSuggest,
        clientRegister,
        clientRegisterPost,
        clientLogin,
        clientLoginPost
    }
}