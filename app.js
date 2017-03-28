const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const tmp = require('tmp');
const spawn = require('child_process').spawn;

const app = express();
const port = process.env.PORT || 8080;;
const upload = multer();

app.use(express.static(path.join(__dirname, 'dist')));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.raw());
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.raw({ type: 'audio/wav', limit: '100mb' }));

app.post('/helloworld2', upload.fields([{'name': 'file'}]), function (req, res) {
  const py = spawn('python', [path.join(__dirname, 'dist', 'test2.py')]);
  let result;

  const buffer = req.files.file[0].buffer;
  const tmpobj = tmp.fileSync({postfix: '.wav'});

  fs.writeFileSync(tmpobj.name, buffer);

  // const data = [1,2,3,4,5,6,7,8,9];
  const data = [tmpobj.name];

  py.stdout.on('data', (data) => {
    console.log('data2', data);
    result = data.toString();
    console.log('result2', result);
  });
  py.stdout.on('end', () => {
    console.log('end2 python script');
    res.send(result)
  });
  py.stdin.write(JSON.stringify(data));
  py.stdin.end();
});

app.post('/helloworld', upload.fields([{'name': 'file'}]), (req, res) => {
  // console.log('req', req.files);
  // console.log('req file', req.files.file[0]);
  console.log('req buffer', req.files.file[0].buffer);
  const buffer = req.files.file[0].buffer;
  const tmpobj = tmp.fileSync({postfix: '.wav'});
  console.log('tmpobj name:', tmpobj.name);
  fs.writeFileSync(tmpobj.name, buffer);
  // fs.writeFile('sample.wav', buffer, function(err) {});
  console.log('path:', path.join(__dirname, 'dist', 'test.py'))
  const py = spawn('python', [path.join(__dirname, 'dist', 'test.py')]);
  let result;

  py.stdout.on('data', (data) => {
    console.log('stdout', data);
    result = data.toString();
    console.log('node file result', result);
  });
  py.stdout.on('end', () => {
    console.log('end python script');
    res.send(result)
  });
  // data = [tmpobj.name];
  // py.stdin.write(JSON.stringify(data));
  py.stdin.write(JSON.stringify([tmpobj.name]));
  py.stdin.end();

});

// app.post('/', function (req, res) {
//   res.send('Got a POST request')
// });

app.listen(port, (err) => {
  if (err) {
    return console.log('error: ', err)
  }
  console.log(`server is listening on ${port}`)
});
