const mongoose = require('mongoose');
const Category = mongoose.model('Category');

class CategoriesController {
    index(req, res) {
        Category.find({}, (err, categories) => {
            if (err) {
                return res.json(err);
            }
            return res.json(categories);
        });
    }
    
    create(req, res) {
        Category.create(req.body, (err, category) => {
            if (err) {
                return res.json(err);
            }
            return res.json(category);
        });
    }

    show(req, res) {
        Category.findById(req.params.id, (err, category) => {
            if (err) {
                return res.json(err);
            }
            return res.json(category);
        });
    }

    update(req, res) {
        Category.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true },
            (err, category) => {
                if (err) {
                    return res.json(err);
                }
                return res.json(category);
            }
        );
    }

    delete(req, res) {
        Category.findByIdAndRemove(req.params.id, (err, category) => {
            if (err) {
                return res.json(err);
            } else {
                return res.json(true);
            }
        })
    }
}

module.exports = new CategoriesController();
