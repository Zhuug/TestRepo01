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

window.onload = function() {
  AppData.LoadDocFileFR("./data/list-20230104.tsv", AppData.ShowData)
}
