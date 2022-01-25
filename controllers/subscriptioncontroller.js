const Subscription = require('../models/subscription');
module.exports.subscribeTo = async (req,res) =>
{
    console.log('post subs req ->', req.body)
    const { id } = req.params;
    const userId = req.user.id;
    const subscription = new Subscription({userId,itemId:id})
    await subscription.save(async (err, docs) => {


        if (err) {
            throw new HttpError('Please enter valid data', 400)
        }
        else {

            console.log('subscription addded ',subscription)
        }

    })
    req.flash('info','Subscribed!')
    res.redirect('/shop')

}
module.exports.unSubscribeTo = async (req,res) =>
{
    console.log('post unsubs req ->', req.body)
    const { id } = req.params;
    const userId = req.user.id;
    try{
        const res=await Subscription.deleteOne({itemId:id,userId});
        console.log('Sucess unsubed ',res);
    }
    catch(error)
    {
        console.log("error occ when unsubing",error);
        throw new HttpError('error occured while unsubing', 404)
    }
    req.flash('info','UnSubscribed!')
    res.redirect('/shop')

}