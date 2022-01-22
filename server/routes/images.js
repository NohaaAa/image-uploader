const router = require("express").Router();
const Image = require("../models/Image");
const ImageModel = require("../models/Image");
const multer = require('multer');
const {checkUserPassword} = require("./auth");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, file.fieldname + '-' + new Date().toISOString().replace(/:/g, '-') + '.' + file.originalname.split('.')[1])
    }
});
const upload = multer({storage: storage});
//Upload new image
router.post('/upload', upload.single('image'), async (req, res, next) => {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    const newImage = new ImageModel({
        userId: req.body.userId,
        label: req.body.label,
        image: req.file.path
    });
    try {
        let image = newImage.save();
        res.status(200).json("Image is successfully uploaded!");
    } catch (err) {
        res.status(500).json(err);
    }

})

router.get('/', async (req, res) => {
        try {
            const images = await Image.find(req.query.label ? {label: req.query.label, userId: req.body.userId} : {userId: req.body.userId});
            res.status(200).json(images);
        } catch (err) {
            res.status(500).json(err);
        }
    });
router.delete('/delete', async (req, res) => {
        const user = await Image.findById(req.body.userId);
        if (user) {
            if (checkUserPassword(user.password, req.body.password)) {
                try {
                    await Image.findByIdAndDelete(req.body.imageId, async (err) => {
                        if (err) {
                            res.status(500).json(err);
                        } else {
                            const images = await Image.find();
                            res.status(200).json(images);
                        }
                    })
                } catch (err) {
                    res.status(500).json(err);
                }
            } else {
                res.status(200).json("Wrong Password!");
            }
        } else {
            res.status(500).json("no user found!");
        }
    }
)


module.exports = router;
