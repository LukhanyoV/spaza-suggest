module.exports = spazaSuggest => {

    // client suggest page
    const clientSuggest = async (req, res) => {
        res.render("clientsuggest", {
            areas: await spazaSuggest.areas()
        });
    }
    const clientSuggestPost = async (req, res) => {
        try {
            const {area, suggestion} = req.body;
            const {id} = req.session?.client;
            if(!area || !suggestion){
                req.flash("info", "Please make sure you select an area and enter a suggestion");
            } else {
                await spazaSuggest.suggestProduct(area, id, suggestion);
                // success message on sending suggestion
                req.flash("success", "Suggestion sent");
            }
        } catch (error) {
            req.flash("error", "An error occured");
        } finally {
            res.redirect("back");
        }
    }

    // client register
    const clientRegister = async (req, res) => {
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
            req.flash("error", "Unknown error has occured");
        } finally {
            res.redirect("back");
        }
    }

    // get past suggestion
    const clientSuggested = async (req, res) => {
        const {id} = req.session?.client
        res.render("clientsuggested", {
            suggestions: await spazaSuggest.suggestions(id)
        });
    }

    /*
    SHOP ROUTES
    */
    // shop home
    const shopHome = async (req, res) => {
        const {area_id} = req.session?.shop;
        res.render("shopsuggestions", {
            suggestions: await spazaSuggest.suggestionsForArea(area_id)
        });
    }
    const shopAccept = async (req, res) => {
        try {
            
        } catch (error) {
            
        } finally {
            res.redirect("back")
        }
    }

    // register a shop
    const shopRegister = async (req, res) => {
        res.render("shopregister", {
            areas: await spazaSuggest.areas()
        });
    }
    const shopRegisterPost = async (req, res) => {
        try {
            let {spazaname, area} = req.body;
            spazaname = spazaname.trim();
            if(!spazaname || !area){
                req.flash("info", "Please make sure you enter a spaza nam and select an area");
            } else {
                const code = await spazaSuggest.registerSpaza(spazaname, area);
                if(code){
                    req.flash("success", `Registration success your code is ${code}`);
                }
            }
        } catch (error) {
            console.log(error.stack);
            req.flash("error", "Unknown error occured");
        } finally {
            res.redirect("back");
        }
    }
    
    // login a user
    const shopLogin = (req, res) => {
        res.render("shoplogin.hbs");
    }
    const shopLoginPost = async (req, res) => {
        try {
            let {shopcode} = req.body;
            shopcode = shopcode.trim();
            if(!shopcode){
                req.flash("info", "Shop code cannot be empty");
            } else {
                const shop = await spazaSuggest.spazaLogin(shopcode);
                if(!shop){
                    req.flash("error", `Shop with code "${shopcode}" not found`);
                } else {
                    // don't save spaza code in session
                    delete shop?.code;
                    req.session.shop = shop;
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
        clientSuggestPost,
        clientRegister,
        clientRegisterPost,
        clientLogin,
        clientLoginPost,
        clientSuggested,

        shopHome,
        shopAccept,
        shopRegister,
        shopRegisterPost,
        shopLogin,
        shopLoginPost
    }
}