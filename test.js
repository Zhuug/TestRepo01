let TestApp = {

Data: {},

CharacterListFrame: null,

CompileData() {
	let rawLines = TestApp.Data.json.payload.blob.rawLines;
	let lineData = [];

	let fieldNames = rawLines[0].split('\t');
	// console.log(fieldNames);
	this.Data.FieldNames = fieldNames;

	rawLines.forEach(function (line, lineNumber) {
		if (lineNumber > 0) {
			let tokens = line.split('\t');
			let entry = {};
			fieldNames.forEach(function (fName, fIndex) {
				entry[fName] = tokens[fIndex];
			});
			lineData.push(entry);
		}
	});
	// console.log(lineData);
	this.Data.LineData = lineData;

	const CharacterKey = "CH";
	const InitialKey = "INIT";
	const FinalKey = "FINL";
	const ToneKey = "TONE";

	let entry1;

	let InitialIndex = {
		entries: {},
		count: 0,
	};
	try {
		lineData.forEach( (entry) => {
			let initial = entry[InitialKey] || '';
			let final = entry[FinalKey] || '';
			let tone = entry[ToneKey] || '';
			let value = entry[CharacterKey] || '';
			entry1 = [entry, initial, final, value];

			if (!(initial in InitialIndex.entries)) {
				InitialIndex.entries[initial] = {
					entries: {},
					count: 0,
				};
			}
			if (!(final in InitialIndex.entries[initial].entries)) {
				InitialIndex.entries[initial].entries[final] = {
					entries: {},
					count: 0,
				};
			}
			if (!(tone in InitialIndex.entries[initial].entries[final].entries)) {
				InitialIndex.entries[initial].entries[final].entries[tone] = [];
			}
			InitialIndex.entries[initial].entries[final].entries[tone].push(value);
			InitialIndex.count += 1;
			InitialIndex.entries[initial].count += 1;
			InitialIndex.entries[initial].entries[final].count += 1;
		});
	} catch (err) {
		console.warn(entry1);
	}
	// console.log(InitialIndex);
	this.Data.InitialIndex = InitialIndex;

	let FinalIndex = {
		entries: {},
		count: 0,
	};
	try {
		lineData.forEach( (entry) => {
			let initial = entry[InitialKey] || '';
			let final = entry[FinalKey] || '';
			let tone = entry[ToneKey] || '';
			let value = entry[CharacterKey] || '';
			entry1 = [entry, initial, final, value];

			if (!(final in FinalIndex)) {
				FinalIndex.entries[final] = {
					entries: {},
					count: 0,
				};
			}
			if (!(initial in FinalIndex.entries[final].entries)) {
				FinalIndex.entries[final].entries[initial] = {
					entries: {},
					count: 0,
				};
			}
			if (!(tone in FinalIndex.entries[final].entries[initial].entries)) {
				FinalIndex.entries[final].entries[initial].entries[tone] = [];
			}
			FinalIndex.entries[final].entries[initial].entries[tone].push(value);
			FinalIndex.count += 1;
			FinalIndex.entries[final].count += 1;
			FinalIndex.entries[final].entries[initial].count += 1;
		});
	} catch (err) {
		console.warn(entry1);
	}
	// console.log(FinalIndex);
	this.Data.FinalIndex = FinalIndex;

},

DisplayData() {
	let initialKeys = Object.keys(this.Data.InitialIndex.entries).sort();
	let initialGridNames = '[header] auto [' + initialKeys.join('] 1fr [') + '] 1fr';
	let finalKeys = Object.keys(this.Data.FinalIndex.entries).sort();
	let finalNames = '[header] auto [' + finalKeys.join('] 1fr [') + '] 1fr';

	let table = document.createElement('div');
	table.id = 'jp-table';
	table.style.setProperty('grid-template-columns', initialGridNames);
	table.style.setProperty('grid-template-rows', finalNames);
	document.getElementById('content').appendChild(table);

	{
		let tHeader = document.createElement('div');
		tHeader.className = 'jp-table-header-corner';
		// tHeader.textContent = element;
		let tCell = document.createElement('div');
		tCell.className = 'jp-table-cell';
		tCell.style.setProperty('grid-column', 'header');
		tCell.style.setProperty('grid-row', 'header');
		tCell.appendChild(tHeader);
		table.appendChild(tCell);

	}

	initialKeys.forEach(element => {
		let tHeader = document.createElement('div');
		tHeader.className = 'header-initial';
		let tHeaderText = document.createElement('span');
		tHeaderText.className = 'jp-reading';
		tHeaderText.textContent = element;
		tHeader.appendChild(tHeaderText);

		let tCell = document.createElement('div');
		tCell.className = 'jp-table-cell';
		tCell.style.setProperty('grid-column', element);
		tCell.style.setProperty('grid-row', 'header');
		tCell.appendChild(tHeader);
		table.appendChild(tCell);
	});

	finalKeys.forEach(element => {
		let tHeader = document.createElement('div');
		tHeader.className = 'header-final';
		let tHeaderText = document.createElement('span');
		tHeaderText.className = 'jp-reading';
		tHeaderText.textContent = element;
		tHeader.appendChild(tHeaderText);

		let tCell = document.createElement('div');
		tCell.className = 'jp-table-cell';
		tCell.style.setProperty('grid-column', 'header');
		tCell.style.setProperty('grid-row', element);
		tCell.appendChild(tHeader);
		table.appendChild(tCell);
	});

	initialKeys.forEach(initial => {
		finalKeys.forEach(final => {
			let tData = document.createElement('div');
			tData.className = 'jp-table-cell';
			tData.classList.add('jp-table-data-frame');
			tData.style.setProperty('grid-column', initial);
			tData.style.setProperty('grid-row', final);
			tData.addEventListener('click', function(event) {TestApp.GetCharacterListFrame(event, initial,final)});

			if (initial in this.Data.InitialIndex.entries && final in this.Data.InitialIndex.entries[initial].entries) {
				let jpText = document.createElement('span');
				jpText.className = 'jp-table-reading';
				jpText.classList.add('jp-reading');
				jpText.style.setProperty('grid-area', 'jp-reading');
				jpText.textContent = initial + final;
				tData.appendChild(jpText);

				let jpCount = document.createElement('div');
				jpCount.className = 'jp-table-reading-count';
				jpCount.style.setProperty('grid-area', 'jp-reading-count');
				jpCount.textContent = this.Data.InitialIndex.entries[initial].entries[final].count;
				tData.appendChild(jpCount);

				let toneCountFrame = document.createElement('div');
				toneCountFrame.className = 'jp-table-count-grid';
				toneCountFrame.style.setProperty('grid-area', 'count-grid');
				let tones = Object.keys(this.Data.InitialIndex.entries[initial].entries[final].entries).sort();
				tones.forEach(toneNumber => {
					let toneCount = document.createElement('div');
					toneCount.className = 'jp-table-tone-count';
					toneCount.style.setProperty('grid-area', `jp-tone${toneNumber}-count`);
					toneCount.textContent = this.Data.InitialIndex.entries[initial].entries[final].entries[toneNumber].length;
					toneCountFrame.appendChild(toneCount);
				});
				tData.appendChild(toneCountFrame);
			}
			table.appendChild(tData);
		});
	});
},

GetCharacterListFrame(event, initial, final) {
	function copyChar(event) {
		navigator.clipboard.writeText(event.target.textContent);
	};
	let CharacterListFrame = document.getElementById('characterlist-frame');
	CharacterListFrame && document.getElementById('content').removeChild(CharacterListFrame);
	CharacterListFrame && CharacterListFrame.replaceChildren();
	if (initial in this.Data.InitialIndex.entries && final in this.Data.InitialIndex.entries[initial].entries) {
		if (CharacterListFrame === undefined || CharacterListFrame === null) {
			CharacterListFrame = document.createElement('div');
			CharacterListFrame.id = 'characterlist-frame';
			// console.log(event.clientX, event.clientY);
			// CharacterListFrame.addEventListener('click', function(event) {
			// 	CharacterListFrame.style.setProperty('display', 'none');
			// });
		}
		CharacterListFrame.style.setProperty('display', 'grid');

		let charData = this.Data.InitialIndex.entries[initial].entries[final].entries;
		let toneKeys = Object.keys(charData).sort();
		toneKeys.forEach(toneNumber => {
			let readingFrame = document.createElement('div');
			readingFrame.className = 'characterlist-frame-reading';
			let jpReading = document.createElement('span');
			jpReading.className = 'jp-reading';
			jpReading.textContent = initial + final + toneNumber;
			readingFrame.appendChild(jpReading);
			CharacterListFrame.appendChild(readingFrame);

			let charFrame = document.createElement('div');
			charFrame.className = 'characterlist-frame-charlist';
			charData[toneNumber].forEach(character => {
				let textFrame = document.createElement('div');
				textFrame.className = 'character-frame-character';
				textFrame.textContent = character;
				charFrame.addEventListener('click', copyChar);
				charFrame.appendChild(textFrame);
			});
			CharacterListFrame.appendChild(charFrame);
		});

		// CharacterListFrame.style.setProperty('position', 'fixed');
		CharacterListFrame.style.setProperty('position', 'absolute');
		CharacterListFrame.style.setProperty('left', '0px');
		CharacterListFrame.style.setProperty('top', '0px');
		document.getElementById('content').appendChild(CharacterListFrame);

		// fixed positioning
		// let left = event.clientX;
		// if (CharacterListFrame.offsetWidth + event.clientX > document.documentElement.clientWidth) {
		// 	left = document.documentElement.clientWidth - CharacterListFrame.offsetWidth;
		// }
		// let top = event.clientY;
		// if (CharacterListFrame.offsetHeight + event.clientY > document.documentElement.clientHeight) {
		// 	top = document.documentElement.clientHeight - CharacterListFrame.offsetHeight;
		// }
		// CharacterListFrame.style.setProperty('left', left + 'px');
		// CharacterListFrame.style.setProperty('top', top + 'px');

		// absolute positioning
		var pageWidth = Math.max(document.body.scrollWidth, document.body.offsetWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth);
		var pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
		let left = event.pageX;
		if (CharacterListFrame.offsetWidth + event.pageX > pageWidth) {
			left = pageWidth - CharacterListFrame.offsetWidth;
		}
		let top = event.pageY;
		if (CharacterListFrame.offsetHeight + event.pageY > pageHeight) {
			top = pageHeight - CharacterListFrame.offsetHeight;
		}
		CharacterListFrame.style.setProperty('left', left + 'px');
		CharacterListFrame.style.setProperty('top', top + 'px');

		this.CharacterListFrame = CharacterListFrame;
	} else {
		CharacterListFrame && CharacterListFrame.style.setProperty('display', 'none');
	}
},

LoadDataFileFR(event) {
	let fr = new FileReader();
	fr.onload = function () {
		try {
			const json = JSON.parse(fr.result, reviver);
			// console.log(obj);
			TestApp.Data.json = json;
			TestApp.CompileData();
			TestApp.DisplayData();
		} catch (error) {
			console.error(error);
			return null;
		}
	}
	// console.log(event);
	fr.readAsText(event.target.files[0]);

	function reviver(key, value) {
		if (/\r$/.test(value)) {
			return value.replace(/\r$/, '');
		} else {
			return value;
		}
	}
},

}

window.onload = async function() {
	try {
		const response = await fetch("./data/list-20230104.tsv");
		if (response && response.ok) {
			const json = await response.json();
			// console.log(json);
			TestApp.Data.json = json;
			TestApp.CompileData();
			TestApp.DisplayData();
		} else {
			console.warn('bleh',response);
		}
	} catch (e) {
		// console.log("blah");
		let contentFrame = document.getElementById('content');
		let fileButton = document.createElement('input');
		fileButton.type = 'file';
		fileButton.onchange = TestApp.LoadDataFileFR;
		contentFrame.firstChild && contentFrame.insertBefore(fileButton, contentFrame.firstChild) || contentFrame.appendChild(fileButton);

	}
}
