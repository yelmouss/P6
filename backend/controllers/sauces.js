const Sauce = require('../models/Sauce');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.likes = 0;
    sauce.dislikes = 0;
    sauce.save()
        .then(() => res.status(201).json({ message : 'Sauce postée !'}))
        .catch((error) => res.status(400).json({error: error}));
};
//----------------------------------------------------------
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({error: error}));
};
//----------------------------------------------------------
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({error: error}));
};
//----------------------------------------------------------
exports.modifySauce =(req, res, next) => {
    
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
        if (sauce.userId !== req.auth.userId) {
          res.status(403).json({error: 'Requête non authorisée'});
        }
        else {
        Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
            .then(() => res.status(201).json({ message : 'Sauce updated successfully!'}))
            .catch((error) => res.status(400).json({error: error}));
        }
    })
};
//----------------------------------------------------------
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
        if (!sauce) {
          res.status(404).json({error: 'Sauce non existante'});
        }
        if (sauce.userId !== req.auth.userId) {
          res.status(403).json({error: 'Requête non authorisée'});
        }
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`,() =>{
            Sauce.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({ message: 'Deleted!'}))
                .catch((error) => res.status(400).json({error: error}));
        });
    })
    .catch(error => res.status(500).json({ error }))
};
//----------------------------------------------------------
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.like === 1) {
                if (sauce.usersLiked.includes(req.body.userId)) 
                {
                    res.status(401).json({error: 'Sauce déja liké'});
                }
                else
                {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
                        .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
                        .catch(error => res.status(400).json({ error }))
                }

            } 
            else if (req.body.like === -1) {
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    res.status(401).json({error: 'Sauce déja disliké'});
                }
                else
                {   
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
                        .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
                        .catch(error => res.status(400).json({ error }));
                }
            } 
            else 
            {
                if (sauce.usersLiked.includes(req.body.userId)) 
                {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                        .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
                        .catch(error => res.status(400).json({ error }));
                } 
                else if (sauce.usersDisliked.includes(req.body.userId)) 
                {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                            .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                            .catch(error => res.status(400).json({ error }));
                }
            }
        })
        .catch(error => res.status(400).json({ error }));   
}