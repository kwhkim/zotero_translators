{
	"translatorID": "dee2a4ae-bc05-4737-a3d4-b6da9d1cd28a",
	"label": "RISS",
	"creator": "kwhkim",
	"target": "",
	"minVersion": "5.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2022-10-12 12:09:30"
}

function detectWeb(doc, url) {
	if (url.includes("DetailView.do?p_mat_type=d7345961987b50bf")) {
		return 'book';
	}
	
	Z.monitorDOMChanges(doc.body, { childList: true });
	return false;
}

function doWeb(doc, url) {
	var newItem = new Zotero.Item("book");
	// var title = doc.querySelector("#thesisInfoDiv > div.thesisInfoTop > h3");
	// var title = doc.querySelector("#thesisInfoDiv > div.infoDetail.on > div.infoDetailL > ul > li:nth-child(9) > div > p").textContent;
	// var title = doc.querySelector("#thesisInfoDiv");
	// var title = doc.body.querySelector("head > title");
const elem_h3 = doc.querySelector("#thesisInfoDiv > div.thesisInfoTop > h3");
var title = elem_h3.textContent.trim();

newItem.title = title
newItem.url = url
// console.log(title);

// console.log("===============")

// const elems = doc.querySelectorAll("#thesisInfoDiv > div.infoDetail.on > div.infoDetailL > ul");
// console.log(elems[0])

// // console.log(elems.li[0]) // TypeError: Cannot read properties of undefined (reading '0')
// // console.log(elems)


const elems2 = doc.querySelectorAll("#thesisInfoDiv > div.infoDetail.on > div.infoDetailL > ul > li");
// console.log(elems2)
// console.log(elems2[0])
// console.log(elems2[0].querySelector('span'))
// console.log(elems2[0].querySelector('div'))
// console.log(elems2[0].querySelector('span').innerText)
// console.log(elems2[0].querySelector('div').innerText)

// console.log(elems2[1])
// console.log(elems2[1].querySelector('span'))
// console.log(elems2[1].querySelector('div'))
// console.log(elems2[1].querySelector('span').innerText)
// console.log(elems2[1].querySelector('div').innerText)

// // console.log(elems2[0][0])  // TypeError: Cannot read properties of undefined (reading '0')
// console.log("================")

var extra = ""

for (var i in elems2) {
	try {
		field = elems2[i].querySelector('span').innerText.trim();
		content = elems2[i].querySelector('div').innerText.trim();
	} catch(error) {
		// console.error(error);
		break;
	}
	// console.log(field)
	// console.log(content)

	// 저자, 발행사항, 발행연도, 작성언어, 주제어, ISBN, 
	// 자료형태, 발행국(도시), 서명/저자사항, 원서명, 형태사항, 일반주기명, 소장기관

	if (field == "저자") {
		authors = content.split(';');
		for (var j in authors) {
			author = authors[j].trim();
			// newItem.creators.push({fullName: author2, creatorType: "creator"});
			// https://niche-canada.org/member-projects/zotero-guide/chapter17.html
			newItem.creators.push(Zotero.Utilities.cleanAuthor(author, 'author'));
			// console.log(author)
		}
	} 

	if (field == "발행사항") {
		publisher = content.replace(/.*:/, '').replace(/,.*/, '').trim()
		newItem.publisher = publisher
		// console.log(publisher)
	}

	if (field == "발행연도") {
		newItem.date = content
		// console.log(content)
	}

	if (field == "작성언어") {
		newItem.language = content
		// console.log(content)
	}

	if (field == "주제어") {
		var tags = content.trim().split(/\s*;\s*/);
		for (var i in tags) {
			tag = tags[i]
			newItem.tags.push({tag:tag, type:0});
			// console.log(tag)
			
		}
	}
	
		if (field == "KDC") {
		extra = extra + "[@KDC]\n" + content + "\n\n"
	    }
	    
		if (field == "DDC") {
		extra = extra + "[@DDC]\n" + content + "\n\n"
	    }


	if (field == "ISBN") {
		isbn = content.trim().replace(/\:.*/, '').replace(/.*[(]SET[)]/, '').trim()
		newItem.ISBN = isbn
		// console.log(isbn)
	}

	if (field == "자료형태") {
		// console.log(content)
		extra = extra + "[@자료형태]\n" + content + "\n\n"
	}

	if (field == "발행국(도시)") {
		newItem.place = content
		// console.log(content)
	}

	if (field == "서명/저자사항") {
		// console.log(content)
	}

	// 원서명
	if (field == "원서명") {
		// console.log(content)
		extra = extra + "[@원서명]\n" + content + "\n\n"
	}

	// 판사항
	if (field == "판사항") {
		edition = content

		// console.log("판사항 : " + edition)
		newItem.edition = edition
	}

	// 총 페이지 수
	if (field == "형태사항") {
		numPages = content.match(/\d+\s*p/)
		// console.log(numPages)

		if (numPages.length > 0) {
			numPages2 = numPages[0].trim().replace(/p.*/, '').trim();
			// 결과
			// console.log("총 페이지 : " + numPages2)
			newItem.numPages = numPages2
		}        
	}

	// 일반주기명
	if (field == "일반주기명") {
		extra = extra + "[@일반주기명]\n" + content + "\n\n"

		
	}
}

newItem.extra = extra

// console.log('======')

//// ??!!!??!!!
//// doc.getElementsByClassName('moreView')[0].click()


// function sleep(ms) {
//     const wakeUpTime = Date.now() + ms;
//     while (Date.now() < wakeUpTime) {}
//   }
// sleep(1000)

// additionalInfoDiv > div > div > div:nth-child(2) > ul
//extra2 = doc.querySelector("#additionalInfoDiv > div").textContent
////var extra2 = doc.querySelector("#additionalInfoDiv > div > div > div:nth-child(2) > ul")

	try {
		var extra3 = doc.querySelector("#additionalInfoDiv > div > div > div:nth-child(3)")
		// console.log(extra2)
		//if (extra2) {
			// console.log("<extra2 -> note?>"+extra2.textContent)
		//}
		//var extra3 = extra2.textContent.trim()

		////newItem.notes.push({note: extra2.textContent.trim()})
		newItem.notes.push({note: extra3.innerText});
		newItem.complete();
	} catch(error) {
		newItem.complete();
		// console.error(error);
		// break;
	}

//console.log(elems2)


//console.log(elems2)
	//newItem.complete();
}

/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "about:blank",
		"items": [
			{
				"itemType": "book",
				"title": "Test",
				"creators": [],
				"libraryCatalog": "RISS",
				"attachments": [],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "about:blank",
		"items": [
			{
				"itemType": "book",
				"title": "aaa",
				"creators": [],
				"libraryCatalog": "RISS",
				"attachments": [],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "about:blank",
		"items": [
			{
				"itemType": "book",
				"title": "aaa",
				"creators": [],
				"libraryCatalog": "RISS",
				"attachments": [],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "about:blank",
		"items": [
			{
				"itemType": "book",
				"title": "aaa",
				"libraryCatalog": "RISS",
				"url": "about:blank",
				"attachments": [],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "about:blank",
		"items": [
			{
				"itemType": "book",
				"title": "aaa",
				"libraryCatalog": "RISS",
				"url": "about:blank",
				"attachments": [],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "about:blank",
		"items": [
			{
				"itemType": "book",
				"title": "aaa",
				"libraryCatalog": "RISS",
				"url": "about:blank",
				"attachments": [],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "about:blank",
		"items": [
			{
				"itemType": "book",
				"title": "aaa",
				"libraryCatalog": "RISS",
				"url": "about:blank",
				"attachments": [],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "about:blank",
		"items": [
			{
				"itemType": "book",
				"title": "aaa",
				"creators": [],
				"libraryCatalog": "RISS",
				"url": "about:blank",
				"attachments": [],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "about:blank",
		"items": [
			{
				"itemType": "book",
				"title": "aaa",
				"creators": [],
				"libraryCatalog": "RISS",
				"url": "about:blank",
				"attachments": [],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	}
]
/** END TEST CASES **/
