module.exports = function(model) {
    var module = {};

    module.email = async function(req, res, next){
        if(req.body.email) {
            var email = req.body.email;
        
            let condition = {email:email,is_deleted:"0"};
            var mlmDetail = await model.MLM.findOne({where:condition});
            
            if(mlmDetail){
                req.flash('error',"email already exist");
               return res.redirect('/');
            }else{
                 next();
            }
        } else {
            next();
        }
    };

    module.login = function(req, res, next){
        if(req.session.user) {
            next();
        } else {
            req.flash('error',"Please login");
            return res.redirect('/');
        }
    };

   

    module.isLogin = function(req, res, next){
        if (req.session.user) {
            console.log("Already login");
           res.redirect('/dashboard');            
        } else {
            next();
        }
    };

    

    return module;
}    