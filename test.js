let AppData = {

obj: {},

LoadDataFileFR(file, onload) {
	let fr = new FileReader();
	fr.onload = function () {
		try {
			let obj = JSON.parse(fr.result, reviver);
			console.log(obj);
			this.obj = obj;
			onload();
		} catch (error) {
			console.error(error);
			return null;
		}
	}
	fr.readAsText(file);
},

ShowData() {
},

}

window.onload = async function() {
const response = await fetch("./data/list-20230104.tsv");
if (response && response.ok) {
	const json = await response.json();
	console.log(json);
} else {
	console.warn('bleh',response);
}
