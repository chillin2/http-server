const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const multer = require('multer');
const fs = require('fs');

const options = {
	key: fs.readFileSync('server.key'),
	cert: fs.readFileSync('server.cert')
};
const make_dir = (dir) => {
	if(!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
}

make_dir('./uploads');

const storage = multer.diskStorage({
	destination : (request, file, callback) => {
		callback(null, './uploads');
	},
	filename: (request, file, callback) => {
		//	console.log("file" , file);
		callback(null, file.originalname)
	}
});

const upload_zibox = multer({ storage: storage }).single('uploadedfile');
const upload_ziphone = multer({ storage: storage }).single('REQ_FILENAME');
const port = 8080;
const port_tls = 8443;

app.use(express.static(__dirname));

app.post('/zibox', function (req, res) {
	upload_zibox(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			// A Multer error occurred when uploading.
			console.log('Multer Error Occured', err);
			res.send(err);
			return;
		} else if (err) {
			// An unknown error occurred when uploading.
			console.log('Error Occured', err);
			res.send(err);
			return;
		}
		// Everything went fine.
		console.log('========================================');
		console.log(req.file);
		res.end('RES_SUCCESS');
		console.log('');
		console.log('==========================ZiBox Uploaded');
	})
})

app.post('/ziphone', function (req, res) {
	upload_ziphone(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			// A Multer error occurred when uploading.
			console.log('Multer Error Occured', err);
			res.send(err);
			return;
		} else if (err) {
			// An unknown error occurred when uploading.
			console.log('Error Occured', err);
			res.send(err);
			return;
		}
		// Everything went fine.
		if(req.file) {
			console.log('========================================');
			console.log(req.file);
			res.end('RES_SUCCESS');
			console.log('');
			console.log('========================ZiPhone Uploaded');
		} else {
			res.end('RES_SUCCESS');
		}
	})
})

http.createServer(app).listen(port, () => {
	console.log("App listening on port "+port)
});
https.createServer(options, app).listen(port_tls, () => {
	console.log("App listening on port "+port_tls)
});
/*
app.listen(port, () => {
	console.log("App listening on port "+port)
});
*/
