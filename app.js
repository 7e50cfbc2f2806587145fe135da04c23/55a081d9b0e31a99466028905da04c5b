const { spawn } = require('child_process');

const children = [];
function runChild(name) {
	const ls = spawn('npm', ['run', 'start:'+name]);
	ls.stdout.on('data', (data) => {
		console.log(`${name}:${data}`);
	});
	ls.stderr.on('data', (data) => {
		console.log(`${name}:${data}`);
	});
	ls.on('close', close);
	children.push(ls);
	return ls;
}

function close() {
	for(let x of children){
		x.kill(9)
	}
}

runChild('mahan');
