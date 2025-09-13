const router = require('express').Router()

router.get('/formulario', (req, res) => {
    const pagesData = {
        title: "formulario",
        description: 'preencha com seu dados '
    };
    res.render('formulario', pageData);
    });

module.exports = router
