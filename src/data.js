const data = {};
let view = [];
let primary = false;

export async function ping(req, res) {
  res.status(200).send();
};

export async function put(req, res) {
  let found = false;
  if (data[req.params.key]) found = true; 
  data[req.params.key] = req.body.value;
  if (found) res.status(200).send();
  else res.status(201).send();
};

export async function getById(req, res) {
  const value = data[req.params.key];
  if(value) res.status(200).json({value: value});
  else res.status(404).send();
};

export async function remove(req, res) {
  let found = false;
  if (data[req.params.key]) found = true;
  delete data[req.params.key];
  if (found) res.status(200).send();
  else res.status(404).send();
}

export async function get(req, res) {
  res.status(200).json(data);
}

export async function setView(req, res) {
  if (view.length == 0) {
    let min = Infinity;
    for (let i in req.body.view) {
      if (req.body.view[i].id < min) min = req.body.view[i].id; 
    }
    if (min == process.env.NODE_IDENTIFIER) primary = true;
  }
  console.log(primary)
  view = req.body.view;
  res.status(200).send();
}
