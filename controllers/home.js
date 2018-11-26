/**
 * GET /
 * Home page.
 */
exports.index = (req, res, error) => {
    if(error){
        console.log(error);
    }
    res.render('home', {
      title: 'Home'
    });
  };
  