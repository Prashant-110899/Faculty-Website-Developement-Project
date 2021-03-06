
module.exports = function(values){
  const router = values.router;
  const gfs = values.gfs;

  router.get('/getCardImages', (req, res) => {
    gfs.files.find().toArray().then(images => {
      //check if images
      if (!images || images.length === 0) {
        return res.json({
          err: 'No images found'
        });
      }
      //image exists
      res.json(images);
    }).catch(err => {
      console.error(err);
      console.log(err);
    })
  });
}
