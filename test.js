let AppData = {};

function loadDataFileFR(file, onload) {
	let fr = new FileReader();
	fr.onload = function () {
		try {
			let obj = JSON.parse(fr.result, reviver);
			console.log(obj);
      AppData.obj = obj;
			onload();
		} catch (error) {
			console.error(error);
			return null;
		}
	}
	fr.readAsText(file);
}

function AppData.ShowData() {
}

window.onload = function() {
  loadDocFileFR("./data/list-20230104.tsv", AppData.ShowData)
}
