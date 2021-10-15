module.exports = (req,res,next)=>{

    if(!req.isAuthenticated()){
        req.flash('error','please first signin')
        res.redirect('/login')       
    }
    else{
        next()
    }
}