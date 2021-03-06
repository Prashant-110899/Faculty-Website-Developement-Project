const multer = require('multer');
module.exports = function(values){
  const Item = values.Item;
  const uploadCardImages = values.uploadCardImages;
  const gfs = values.gfs;
  const router = values.router;
  const collectionName = values.collectionName;

  var uploadImageName = "";


  io.on('connection', (socket) => {
    socket.on('ImageName', (data) =>{
      uploadImageName = data.uploadCardImageName;
      // postData(uploadImageName);
    })
  })

  const upload = uploadCardImages.single('image');

  router.post('/uploadCardData',(req,res) => {

        if(uploadImageName === ""){
          req.flash('error',"No image Selected");
          res.redirect('back');
        }
        else{
        upload(req,res,function (err) {
          if (err instanceof multer.MulterError) {
             // A Multer error occurred when uploading.
             console.log(err);
             req.flash('error',err.message);
             res.redirect('back');

           } else if (err) {
             // An unknown error occurred when uploading.
             console.log(err);
             if(err.message === "Only jpg/png/webp/tif file formats are allowed")
             {
               req.flash('error',err.message);
             }
             else if(err.message === 'Image with same name already exists in database. Upload with different name')
             {
               req.flash('error',err.message);
             }
             else{
               req.flash('error','Some Network error appeared! Please try again in some time');
             }
             // req.flash('error',err.message);
             res.redirect('back');
           }
           else{
             gfs.files.find().toArray().then(images => {
                   //check if images
                  if(!images || images.length === 0)
                  {
                      return res.status(404).json({
                        err: 'No images found'
                      });
                  }
                  //image exists
                  req.flash('success_msg',"Images added");
                 }).catch(err =>{
                   console.log(err);
                 });

                 const itemTitle = req.body.newCardItemTitle;
                 const itemInfo = req.body.newCardItemDetails;

                 Item.countDocuments({}).then(val =>{
                       const item = new Item({
                         title: itemTitle,
                         details: itemInfo,
                         image: uploadImageName,
                         timeStamp: Date.now(),
                         pos: val
                       });

                       item.save().then(() =>{
                        req.flash('success_msg',"Details added");
                        res.redirect("back");
                       });

                 }).catch(err =>{
                     if(err){
                       console.log(err);
                    }
                 })

           }
        });
      }

  });

}
