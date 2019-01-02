// var langSheet = require('./shit.json');
var fs = require('fs');
var config = require('./config/config.json')
var request = require("request")

var i
var row = 00
var stringRes = {}
var objLangArray = []

request({
    url: config.link_json,
    json: true
}, function (error, response, body) {
    if (!error && response.statusCode === 200) {

        convertJsonToObject(body)
    }
})

function convertJsonToObject(langSheet) {
    var count = 1
    for (i = 0; i < langSheet.feed.entry.length; i++) {
        console.log("Loading >>> "+convertToPercent(count, langSheet.feed.entry.length)+" %")
        var rowJSON = langSheet.feed.entry[i].gs$cell.row
        var collumJson = langSheet.feed.entry[i].gs$cell.col
        if (row == rowJSON) {
        } else if (langSheet.feed.entry[i].gs$cell.col < 4) {
            stringRes = {
                'key': langSheet.feed.entry[i].gs$cell.inputValue,
                'en': langSheet.feed.entry[i + 1].gs$cell.inputValue,
                'de': langSheet.feed.entry[i + 2].gs$cell.inputValue
            }
            objLangArray.push(stringRes)
            row = rowJSON
        }
        count++
    }
    // createFile
    console.log("=============================================")
    createStringFile(config.path, false)
    createStringFile(config.translate_path, true)
}

//for create string file for android 
function createStringFile(path, isTranslate) {
    var count = 1
    var langData = "<resources>\n"
    for (i = 0; i < objLangArray.length; i++) {
        if (isTranslate) {
            console.log("Creating en sheet >>> "+convertToPercent(count, objLangArray.length)+" %")
            langData = langData + "<string name=\"" + objLangArray[i].key + "\">" + objLangArray[i].de + "</string>\n"
        } else {
            console.log("Creating de sheet >>> "+convertToPercent(count, objLangArray.length)+" %")
            langData = langData + "<string name=\"" + objLangArray[i].key + "\">" + objLangArray[i].en + "</string>\n"
        }
        count++
    }
    langData += "</resources>"

    fs.writeFileSync(path, langData, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    console.log("=============================================")
}

function convertToPercent(current, max){
    return parseInt(((current / max) * 100))
}