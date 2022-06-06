var express = require('express')
var glob = require('glob')

const app = express();
const port = process.env.NODE_PORT || 3004;
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');

app.use(express.static('public_html'));

let loader = new TwingLoaderFilesystem('./templates');
let twing = new TwingEnvironment(loader, {
    auto_reload: true,
    cache: false,
    debug: true
});

app.get('/', function (req, res) {
    let options = {
        'cwd': './templates'
    }

    glob('*.html.twig', options, function (er, files) {
        var html = '<html><body><h1>Шаблоны:</h1>'

        html += '<ul>'
        for (const file of files) {
            let link = file.replace('.html.twig', '');
            let li = '<li><a href="' + link + '">' + link + '</a></li>';
            html += li
        }
        html += '</ul>'

        html += '</body></html>'

        res.send(html)
    })
});

app.get('/:name', function (req, res) {
    let now = new Date()

    console.log(now + ' -> ' + req.params.name)
    twing.render(req.params.name + '.html.twig', req.params).then((output) => {
        res.end(output);
    });
});

app.listen(port, () => {
    console.log('Node.js Express server listening on port http://localhost:' + port);
});
