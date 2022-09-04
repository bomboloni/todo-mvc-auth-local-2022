const Entry = require('../models/Entry')

module.exports = {
    getEntries: async (req,res)=>{
        console.log(req.user)
        try{
            const entryItems = await Entry.find({userId:req.user.id})
            const entryCount = await Entry.countDocuments({userId:req.user.id})
            const amountSum = await Entry.aggregate([
                { $match: { userId: req.user.id } },
                { $group: { _id: "$expense", total: { $sum: "$amount" }} }
            ])
            res.render('entries.ejs', {entries: entryItems, count: entryCount, sum: amountSum[0].total, user: req.user})
        }catch(err){
            console.log(err)
        }
    },
    createEntry: async (req, res)=>{
        try{
            await Entry.create({
                amount: req.body.entryAmount,
                company: req.body.entryCompany, 
                category: req.body.entryCategory,
                expense: true,
                userId: req.user.id
            })
            console.log('Entry has been added!')
            res.redirect('/entries')
        }catch(err){
            console.log(err)
        }
    },
    // markComplete: async (req, res)=>{
    //     try{
    //         await Entry.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
    //             completed: true
    //         })
    //         console.log('Marked Complete')
    //         res.json('Marked Complete')
    //     }catch(err){
    //         console.log(err)
    //     }
    // },
    // markIncomplete: async (req, res)=>{
    //     try{
    //         await Entry.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
    //             completed: false
    //         })
    //         console.log('Marked Incomplete')
    //         res.json('Marked Incomplete')
    //     }catch(err){
    //         console.log(err)
    //     }
    // },
    deleteEntry: async (req, res)=>{
        console.log(req.body.entryIdFromJSFile)
        try{
            await Entry.findOneAndDelete({_id:req.body.entryIdFromJSFile})
            console.log('Deleted Entry')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    }
}    