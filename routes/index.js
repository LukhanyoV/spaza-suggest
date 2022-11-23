module.exports = () => {

    // client suggest page
    const clientSuggest = async (req, res) => {
        res.render("clientsuggest")
    }
    
    return {
        clientSuggest
    }
}