module.exports = (req,res,next)=>{

    if(!req.isAuthenticated()){
        
        req.session.returnTo = req.originalUrl;
        req.flash('error','please first signin')
        res.redirect('/login')       
    }
    else{
        next()
    }
}