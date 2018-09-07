var restify = require('restify');

const path = "/toddy";

var fakeId = 0;
var toddynhos = [];

// handlers
function insert(req, res, next) {
    // POST /inserir -> receberá os 3 parâmetros e fará inserção no BD. Retornando
    // um objeto completo (com id).

    res.setHeader('content-type', 'application/json');

    let Toddy = {
        id: fakeId,
        lot: req.body.lot,
        content: req.body.content,
        expirationDate: req.body.expirationDate
    };
    toddynhos.push(Toddy);
    fakeId += 1;

    res.send(Toddy);
    next();
}

function update(req, res, next) {
    // – POST /atualizar -> receberá os 4 parâmetros e fará atualização no BD
    // (baseado no id passado). Retornando um objeto completo (com id).

    res.setHeader('content-type', 'application/json');

    let toddy = toddynhos.find((element, index) => {
        let condition = element.id === req.body.id;
        if (condition) {
            toddynhos[index].lot = req.body.lot;
            toddynhos[index].content = req.body.content;
            toddynhos[index].expirationDate = req.body.expirationDate;
        }
        res.send(toddy);
        return condition
    });
    if (toddy == undefined) {
        res.send({"message": "Toddynho não encontrado"})
    }
    next();
}

function list(req, res, next) {
    // – GET /listar -> listará todos os elementos na tabela do BD.
    
    res.send(toddynhos);
    next();
}

function remove(req, res, next) {
    // – POST /excluir -> receberá o id do elemento a ser excluído.

    res.setHeader('content-type', 'application/json');

    let toddy = toddynhos.find((element, index) => {
        let condition = element.id === req.body.id;
        if (condition) {
            toddynhos.splice(index)
            res.send({"message": "Toddynho #" + element.id + " removido com sucesso!"})
        }
        return condition
    });
    if (toddy == undefined) {
        res.send({"message": "Toddynho não encontrado"})
    }
    next();
}

// configure server
var server = restify.createServer();
server.use(restify.plugins.bodyParser());

var port = process.env.PORT || 5000;

// routes
server.post(path + '/inserir', insert);
server.post(path + '/atualizar', update);
server.get(path + '/listar', list);
server.post(path + '/excluir', remove);

server.listen(port, function() {
  console.log('%s listening at %s', server.name, server.url);
});