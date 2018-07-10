var express = require('express');
// var SolrNode = require('solr-node');
var router = express.Router();

var Client = require('node-rest-client').Client;

var client = new Client();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

router.get('/query/:category/:content', function(req, res, next) {
    console.log("category " + req.params.category);
    var url = '';
    if (req.params.category == 'All') {
        url = 'http://localhost:8983/solr/chainmap/select?fl=title,%20url,%20summary,%20category&q=search_content:'+ encodeURI(req.params.content) +'&wt=json';
    } else {
        url = 'http://localhost:8983/solr/chainmap/select?fl=title,%20url,%20summary,%20category&q=category:'+ encodeURI(req.params.category) + '%20AND%20search_content:'+ encodeURI(req.params.content) +'&wt=json';
    }

    console.log('query is ' + url);
    client.get(url, function (data, response) {
        var obj = JSON.parse(data);
        res.send(obj);
    });
});

router.get('/results/:content', function(req, res, next) {
    //http://localhost:8983/solr/chainmap/select?fl=title&q=content:bitcoin&start=10

    // var url = 'http://localhost:8983/solr/chainmap/select?fl=title,%20summary&q=search_content:'+ encodeURI(req.params.content) +'&wt=json';
    var url = 'http://localhost:8983/solr/chainmap/select?q=company:%20EncryptoTel&wt=json';
    console.log('query is ' + url);
    client.get(url, function (data, response) {
        var obj = JSON.parse(data);

        res.render('search_result', {docs: obj.response.docs});
    });
});

router.get('/resource/company/:name', function(req, res) {
    //http://localhost:8983/solr/chainmap/select?q=Company:%20EncryptoTel
    var url = 'http://localhost:8983/solr/chainmap/select?q=company:%20' + encodeURI(req.params.name) +'&wt=json';
    console.log('query is ' + url);
    client.get(url, function (data, response) {
        var obj = JSON.parse(data);
        // res.send(obj);
        res.render('company', {
            company: obj.response.docs[0].company,
            company_url: obj.response.docs[0].company_url,
            ceo: obj.response.docs[0].ceo,
            company_email: obj.response.docs[0].company_mail,
            company_twitter: obj.response.docs[0].company_twitter,
            CEO_Twitter: obj.response.docs[0].ceo_twitter,
            company_blog: obj.response.docs[0].company_blog,
            url: obj.response.docs[0].url
            // company: req.params.name
        });
    });
    // res.render('company', { title: 'Comapany Info' });
});


router.get('/resource/ico/:name', function(req, res) {
    // http://localhost:8983/solr/chainmap/select?q=ico_name:21%20million
    var url = 'http://localhost:8983/solr/chainmap/select?q=ico_name:%20' + encodeURI(req.params.name) +'&wt=json';
    console.log('query is ' + url);
    client.get(url, function (data, response) {
        var obj = JSON.parse(data);
        // res.send(obj);
        res.render('ico', {
            ico: obj.response.docs[0].ico_name,
            ico_url: obj.response.docs[0].url,
            twitter: obj.response.docs[0].twitter,
            email: obj.response.docs[0].email,
            blog: obj.response.docs[0].blog,
            ceo: obj.response.docs[0].ceo,
            ceo_twitter: obj.response.docs[0].ceo_twitter,
            ceo_mail: obj.response.docs[0].ceo_mail,
            url: obj.response.docs[0].url
            // company: req.params.name
        });
    });
    // res.render('company', { title: 'Comapany Info' });
});

router.get('/resource/event/:name', function(req, res) {
    // http://localhost:8983/solr/chainmap/select?q=event_name:%22Peer%20Summit%22
    var url = 'http://localhost:8983/solr/chainmap/select?q=event_name:%20' + encodeURI(req.params.name) +'&wt=json';
    console.log('query is ' + url);
    client.get(url, function (data, response) {
        var obj = JSON.parse(data);
        // res.send(obj);
        res.render('event', {
            event: obj.response.docs[0].event_name,
            event_url: obj.response.docs[0].event_url,
            event_date: obj.response.docs[0].event_date,
            event_city: obj.response.docs[0].event_city,
            event_country: obj.response.docs[0].event_country,
            event_twitter: obj.response.docs[0].event_twitter,
            contact_url: obj.response.docs[0].event_contact_url,
            email: obj.response.docs[0].event_mail,
            url: obj.response.docs[0].url
            // company: req.params.name
        });
    });
    // res.render('company', { title: 'Comapany Info' });
});

router.get('/resource/white_paper/:name', function (req, res, next) {

    var options = {
        // root: __dirname + '/resources/whitepaper/',
        root: './resources/whitepapers/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    var fileName = req.params.name;
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', fileName);
        }
    });

});

/* GET home page. */
router.get('/search', function(req, res, next) {
    /**ddd
     session = req.session;
     if(!session.email) {
		return res.redirect("/")
	}
     **/

    res.render('search', { title: 'Whitepaper etc' });
});


