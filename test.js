let AppData = {
	let obj = {};

function LoadDataFileFR(file, onload) {
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
}

function ShowData() {
}
}

window.onload = function() {
  AppData.LoadDocFileFR("./data/list-20230104.tsv", AppData.ShowData)
}
