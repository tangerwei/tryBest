var wordLibrary = {
		islook: false,
		isEdit: false,
		_wordlist: "",
		worddatames:{},
		setWorddatames:function(__key,value){
			var key = hex_md5((new Date()).getTime() + __key);
			this.worddatames[key] = value;
			return key;
		},
		getWorddatames:function(key){
			return this.worddatames[key];
		},
		setAttributeAuto:function(dom,key,value){
			var _key;
			if(dom.getAttribute(key)){
				_key = dom.getAttribute(key);
				this.worddatames[_key] = value;
			}else{
				_key = this.setWorddatames(key,value);
				dom.setAttribute(key,_key);
			}
		},
		init: function() {
			//绑定按钮
			this.blindbtn();
			//检查图片音频存放目录
			this.wordlist.check_folder();

			//刷新表格数据
			this.wordlist.updateListTable();
		},
		blindbtn: function() {
			var _self = this;
			//导出按钮
			document.getElementById('daochu_container').onclick = function() {
				var btn = document.getElementById("daochu_zhankai_icon");
				if (btn.className == "daochu_zhankai_icon") {
					btn.className = "daochu_guanbi_icon";
					document.getElementById("daochu_detail").style.display = "flex";
				} else {
					btn.className = "daochu_zhankai_icon";
					document.getElementById("daochu_detail").style.display = "none";
				}
			};
			//新增单词页面
			document.getElementById("addWord_container").onclick = function() {
				//显示切换
				document.getElementById("wordLibraryContainer").className = "addWordHide";
				document.getElementById("addWord").className = "addWordShow";
				wordLibrary.createWord.blindbtn();
			};
			document.getElementById("wordsearch_icon").onclick = function() {
				var _list = wordLibrary.wordlist;
				var _keyWord = document.getElementById("wordsearchInput").value;
				if (_keyWord == "") {
					_list._keyWord = null;
				} else {
					_list._keyWord = _keyWord;
				}
				//设置搜索关键字
				_list._listTable.refreshTable();
			};
			//设置搜索框的回车事件
			document.getElementById("wordsearchInput").onkeydown = function(e) {
					if (e.code == "Enter") {
						var _list = wordLibrary.wordlist;
						var _keyWord = this.value;
						if (_keyWord == "") {
							_list._keyWord = null;
						} else {
							_list._keyWord = _keyWord;
						}
						//设置搜索关键字
						_list._listTable.refreshTable()
					}
				}
				//上下线按钮显示切换.初始化默认上下线模式的值
			wordLibrary.wordlist.model = "model_downline";
			//已上线显示
			document.getElementById("wordDisplayModel_up").onclick = function() {
					var _list = wordLibrary.wordlist;
					if (_list.model === "model_upline") {
						return;
					} else {
						_list.model = "model_upline";
					}
					//更新表格数据
					_list._listTable.refreshTable();
					//切换按钮颜色
					document.getElementById("wordDisplayModel_down").className = "wordDisplayBtn_nocheck";
					document.getElementById("wordDisplayModel_up").className = "wordDisplayBtn_check";
				}
				//未上线显示
			document.getElementById("wordDisplayModel_down").onclick = function() {
				var _list = wordLibrary.wordlist;
				if (_list.model === "model_downline") {
					return;
				} else {
					_list.model = "model_downline";
				}
				//更新表格数据
				_list._listTable.refreshTable();
				//切换按钮颜色
				document.getElementById("wordDisplayModel_down").className = "wordDisplayBtn_check";
				document.getElementById("wordDisplayModel_up").className = "wordDisplayBtn_nocheck";
			}
			document.getElementById("daoru_container").onclick = function() {
				_self.importWords();
			}
			document.getElementById("word_Export_csv_btn").onclick = function() {
				_self.dowloadCSV();
				var btn = document.getElementById("daochu_zhankai_icon");
				btn.className = "daochu_zhankai_icon";
				document.getElementById("daochu_detail").style.display = "none";
			}
			document.getElementById("word_Export_pic_btn").onclick = function() {
				_self.getPicMes();
				var btn = document.getElementById("daochu_zhankai_icon");
				btn.className = "daochu_zhankai_icon";
				document.getElementById("daochu_detail").style.display = "none";
			}
			document.getElementById("word_Export_mp3_btn").onclick = function() {
				_self.getAudioMes();
				var btn = document.getElementById("daochu_zhankai_icon");
				btn.className = "daochu_zhankai_icon";
				document.getElementById("daochu_detail").style.display = "none";
			}
		},
		importWords: function() {
			var _self = this;
			var input = document.createElement("input");
			input.type = "file";
			input.style.display = "none";
			input.onchange = function() {
				_self.readCsvFile(this.files[0]);
			}
			input.click();
		},
		readCsvFile: function(file) {
			var _self = this;
			var reader = new FileReader();
			reader.onloadend = function() {
				var _data = reader.result;
				_self.loadWords(_data);
			}
			reader.readAsText(file, 'utf-8');
		},
		//格式化数据，上传
		loadWords: function(wordslist) {
			var data_wordlib = AQUA_SEARCH_DOCTYPE_WORD_LIBRARY;
			var _that = wordLibrary.createWord;
			var _list = wordslist.split("\r\n");
			for (var i = 0; i < _list.length; i++) {
				//解析当前行的数据，上传
				var _data_porperties = [];
				var item = _list[i].split(",");
				if (item.length < 10) {
					var _sure = confirm("第" + i + "行数据的缺失，是否继续?");
					if (!_sure) {
						return;
					} else {
						continue;
					}
				}
				var wordname = item[0].trim();
				_data_porperties.push({
					"key": "wordname",
					"value": wordname
				})
				var wordsource = item[1];
				_data_porperties.push({
					"key": "wordsource",
					"value": wordsource
				});
				var translate_cn = [];
				if (item[2] != "") {
					translate_cn = item[2].split(";");
				}
				_data_porperties.push({
					"key": "translate_cn",
					"value": translate_cn
				});
				var phonetic = [];
				if (item[3] != "") {
					phonetic = item[3].split(";");
				}
				_data_porperties.push({
					"key": "phonetic",
					"value": phonetic
				});
				var pronfile = [];
				if (item[4] != "") {
					pronfile = item[4].split(";");
				}
				_data_porperties.push({
					"key": "pronfile",
					"value": pronfile
				});
				var sentence_en = [];
				if (item[5] != "") {
					sentence_en = item[5].split(";");
				}
				_data_porperties.push({
					"key": "sentence_en",
					"value": sentence_en
				});
				var sentence_encn = [];
				if (item[6] != "") {
					sentence_encn = item[6].split(";");
				}
				_data_porperties.push({
					"key": "sentence_encn",
					"value": sentence_encn
				});
				var sentence_enroot = []
				if (item[7] != "") {
					sentence_enroot = item[7].split(";");
				}
				_data_porperties.push({
					"key": "sentence_enroot",
					"value": sentence_enroot
				});
				var imagefile = [];
				if (item[8] != "") {
					imagefile = item[8].split(";");
				}
				_data_porperties.push({
					"key": "imagefile",
					"value": imagefile
				});
				var tags = [];
				if (item[9] != "") {
					tags = item[9].split(";")
				}
				_data_porperties.push({
					"key": "tags",
					"value": tags
				});
				//添加时间戳
				var date = new Date();
				//格式化时间
				_data_porperties.push({
					"key": "edittime",
					"value": _that.getTime(date)
				});
				var _data = {
					"doc_type": data_wordlib,
					"properties": _data_porperties
				}
				//将单词name换算成单词ID
				var _word_current_id = hex_md5(wordname+ (new Date()).getTime() + i);
				var url = AQUA_SEARCH_HOST + AQUA_SEARCH_GENERAL_SEARCH_PATH + "/" + AQUA_SEARCH_DOCTYPE_WORD_LIBRARY + "/" + _word_current_id;
				//
				//var check_url = AQUA_SEARCH_HOST + AQUA_SEARCH_GENERAL_SEARCH_PATH + "/" + AQUA_SEARCH_DOCTYPE_WORD_LIBRARY + "?id=" + wordname;
				//确认单词是否存在，询问覆盖
				var _exitobj = _that.searhWordExist(wordname);
				if (_exitobj.result) {
					//单词已经存在
					var _sure = confirm(i18n('WORD_LIBRARY_SAVE_WORD_MES_COVER'));
					if (!_sure) {
						continue;
					}else{//覆盖单词
						_word_current_id = _exitobj.resultId;
						url = AQUA_SEARCH_HOST + AQUA_SEARCH_GENERAL_SEARCH_PATH + "/" + AQUA_SEARCH_DOCTYPE_WORD_LIBRARY + "/" + _exitobj.resultId;
					}
				}
				var request = new XMLHttpRequest();
				request.open("PUT", url, false);
				request.onreadystatechange = function() {
					if (this.readyState == 4 && (this.status == 200)) {
						//设置单词下线
						var request_down = new XMLHttpRequest();
						var url_dwn = AQUA_SEARCH_HOST + '/aquapaas/rest/search/general/contents_filter' + "/" + AQUA_SEARCH_DOCTYPE_WORD_LIBRARY + "/invisible" + "?id=" + _word_current_id;
						request_down.open("PUT", url_dwn, false);
						request_down.onreadystatechange = function() {
							if (this.readyState == 4 && this.status == 200) {
								//
							}
						}
						request_down.send();
						console.log("save success");
					}
				}
				request.setRequestHeader("content-type", "application/json");
				request.send(JSON.stringify(_data));
			}
			//上传成功
			console.log("load words success");
			wordLibrary.wordlist.updateListTable();
		},
		getPicMes: function() {
			var _self = this;
			var aquaHost = aqua_host;
			var _restRoot = aquaHost + "/aqua/rest/cdmi";
			var audiolibUrl = AQUA_SEARCH_PICAUDIO_WORD_LIBRARY + "/" + AQUA_SEARCH_PIC_WORD_LIBRARY + "/";
			var url = _restRoot + audiolibUrl;
			var xhr = new XMLHttpRequest();
			xhr.open("GET", url, true);
			xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var resp = JSON.parse(this.responseText);
					_self.downloadFile(resp.parentURI, AQUA_SEARCH_PIC_WORD_LIBRARY);
				} else {

				}
			}
			xhr.send();
		},
		getAudioMes: function() {
			var _self = this;
			var aquaHost = aqua_host;
			var _restRoot = aquaHost + "/aqua/rest/cdmi";
			var audiolibUrl = AQUA_SEARCH_PICAUDIO_WORD_LIBRARY + "/" + AQUA_SEARCH_AUDIO_WORD_LIBRARY + "/";
			var url = _restRoot + audiolibUrl;
			var xhr = new XMLHttpRequest();
			xhr.open("GET", url, true);
			xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var resp = JSON.parse(this.responseText);
					_self.downloadFile(resp.parentURI, AQUA_SEARCH_AUDIO_WORD_LIBRARY);
				} else {

				}
			}
			xhr.send();
		},
		downloadFile: function(parentURI, name) {
			//
			var contentType = "application/cdmi-object";
			var nowDateTime = new Date().getTime();
			var url = parentURI + name;
			var urlPath = "/aqua/rest/compressed/" + url;
			var uriprefix = urlPath;
			var expires = nowDateTime + 1209600000;
			var StringToSign = "GET" + "\n" + expires + "\n" + uriprefix;
			var aquatoken = my.aqua.accessKeyId + ":" + my.base64Encode(str_hmac_sha1(my.aqua.secretAccessKey, StringToSign));
			var downCWURL = urlPath + "?aquatoken=" + encodeURIComponent(aquatoken) + "&expires=" + expires + "&uriprefix=" + uriprefix;
			window.open(downCWURL, "_blank");
		},
		//分批读取数据，然后写入网盘，下载
		dowloadCSV: function() {
			//先处理未上线的单词
			var _self = this;
			_self._wordlist = "";
			_self.readWord(0, 999, "false");
			_self.readWord(0, 999, "true");
			//写入csv
			var aquaHost = aqua_host;
			var _restRoot = aquaHost + "/aqua/rest/cdmi";
			var piclibUrl = AQUA_SEARCH_PICAUDIO_WORD_LIBRARY + "/" + "wordlist.csv";
			var url = _restRoot + piclibUrl;
			var xhr = new XMLHttpRequest();
			xhr.open("PUT", url, true);
			xhr.onreadystatechange = function() {
				if (this.readyState == 4 && (this.status == 200 || this.status == 204)) {
					//下载csv
					window.open(url, "_blank");
				}
			}
			my.aqua.addXHRHeaderRequest(xhr, 'PUT', url, "text/csv");
			xhr.setRequestHeader("x-aqua-file-truncate", "0");
			xhr.send(_self._wordlist);
		},
		readWord: function(start, end, visible) {
			var _self = this;
			var url = AQUA_SEARCH_HOST + AQUA_SEARCH_GENERAL_SEARCH_PATH + "/" + AQUA_SEARCH_DOCTYPE_WORD_LIBRARY + "?sort_by=edittime&sort_mode=d&" + "&visible=" + visible + "&start=" + start + "&end=" + end;
			var xhr = new XMLHttpRequest();
			xhr.open("GET", url, false);
			xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var res = JSON.parse(this.responseText);
					var totalCount = this.getResponseHeader("x-aqua-total-count");
					_self.formatWord(res);
					if (end < totalCount) {
						_self.readWord(end, end + 999);
					}
				}
			}
			xhr.send();
		},
		formatWord: function(res) {
			var _self = this;
			var _that = wordLibrary.wordlist;
			var _datalist = res.list_of_properties;
			for (var i = 0; i < _datalist.length; i++) {
				var item = _datalist[i].properties;
				var _data_porperties = [];

				var wordname = _that.getProperty(item, "wordname");
				_data_porperties.push(wordname);
				var wordsource = _that.getProperty(item, "wordsource");
				_data_porperties.push(wordsource);
				var translate_cn = _that.getProperty(item, "translate_cn");
				if (translate_cn.length > 0) {
					_data_porperties.push(translate_cn.join(";"));
				} else {
					_data_porperties.push("");
				}
				var phonetic = _that.getProperty(item, "phonetic");
				if (phonetic.length > 0) {
					_data_porperties.push(phonetic.join(";"));
				} else {
					_data_porperties.push("");
				}
				var pronfile = _that.getProperty(item, "pronfile");
				if (pronfile.length > 0) {
					_data_porperties.push(pronfile.join(";"));
				} else {
					_data_porperties.push("");
				}

				var sentence_en = _that.getProperty(item, "sentence_en");
				if (sentence_en.length > 0) {
					_data_porperties.push(sentence_en.join(";"));
				} else {
					_data_porperties.push("");
				}
				var sentence_encn = _that.getProperty(item, "sentence_encn");
				if (sentence_encn.length > 0) {
					_data_porperties.push(sentence_encn.join(";"));
				} else {
					_data_porperties.push("");
				}
				var sentence_enroot = _that.getProperty(item, "sentence_enroot");
				if (sentence_enroot.length > 0) {
					_data_porperties.push(sentence_enroot.join(";"));
				} else {
					_data_porperties.push("");
				}
				var imagefile = _that.getProperty(item, "imagefile");
				if (imagefile && imagefile.length > 0) {
					_data_porperties.push(imagefile.join(";"));
				} else {
					_data_porperties.push("");
				}
				var tags = _that.getProperty(item, "tags");
				if (tags && tags.length > 0) {
					_data_porperties.push(tags.join(";"));
				} else {
					_data_porperties.push("");
				}
				if (_data_porperties.length > 0) {
					if (_self._wordlist != "") {
						_self._wordlist = _self._wordlist + "\r\n" + _data_porperties.join(",");
					} else {
						_self._wordlist = _data_porperties.join(",");
					}
				}
			}
		}
	}
	//单词列表
wordLibrary.wordlist = {
	_data: [],
	_listData: [],
	_data_ext: [],
	_listTitles: [{
		label: i18n('WORD_LIBRARY_TABLE_HEADER_WORD')
	}, {
		label: i18n('WORD_LIBRARY_TABLE_HEADER_TRANS')
	}, {
		label: i18n('WORD_LIBRARY_TABLE_HEADER_PRONS_A')
	}, {
		label: i18n('WORD_LIBRARY_TABLE_HEADER_PRONS_B')
	}, {
		label: i18n('WORD_LIBRARY_TABLE_HEADER_EN')
	}, {
		label: i18n('WORD_LIBRARY_TABLE_HEADER_CN')
	}, {
		label: i18n('WORD_LIBRARY_TABLE_HEADER_PIC')
	}, {
		label: i18n('WORD_LIBRARY_TABLE_HEADER_EDIT_TIME')
	}, {
		label: i18n('WORD_LIBRARY_TABLE_HEADER_TAGS')
	}, {
		label: i18n('WORD_LIBRARY_TABLE_HEADER_STATES')
	}, {
		label: i18n('WORD_LIBRARY_TABLE_HEADER_OPTIONS')
	}],
	_listColumns: 11,
	_listRows: 15,
	_listStyles: {
		borderColor: "#E2E2E2",
		borderWidth: 1,
		titleBg: "#45D1F4",
		titleColor: "#FFFFFF",
		titleHeight: 31,
		cellBg: "white",
		evenBg: "#F5FDFF",
		cellColor: "#797979",
		footBg: "#FFFFFF",
		footColor: "#494B58",
		inputBg: "#FFFFFF",
		inputBorder: "1px solid #E2E2E2",
		iconColor: "#0099CB",
		columnsWidth: [0.07938, 0.0496, 0.0496, 0.0496, 0.0496, 0.0496, 0.0496, 0.1438, 0.162, 0.07438, 0.18466]
	},
	_keyWord: null,
	updateListTable: function() {
		var _self = this;
		this._listTable = new StyledList({
			containerId: "wordLibraryList",
			rows: this._listRows,
			columns: this._listColumns,
			titles: this._listTitles,
			styles: this._listStyles,
		});
		//分页
		this._listTable.getPageData = this.queryData;
		//取得首页数据
		this._listTable.create();
		//表格宽高自适应
		window.onresize = function() {
			setTimeout(function() {
				_self._listTable.resize();
			}, 100);
		}
	},
	queryData: function(pageNumber) {
		var _self = wordLibrary.wordlist;
		var request = new XMLHttpRequest();
		//确定显示模式
		var visible;
		if (_self.model == "model_upline") {
			visible = "true";
		} else {
			visible = "false";
		}
		//根据页码计算当前页的数据起始
		var _start = 15 * (pageNumber - 1);
		var _end = 15 * pageNumber;
		var url;
		//url
		if (_self._keyWord !== null) {
			url = AQUA_SEARCH_HOST + AQUA_SEARCH_GENERAL_SEARCH_PATH + "/" + AQUA_SEARCH_DOCTYPE_WORD_LIBRARY + "?sort_by=edittime&sort_mode=d&wordname=" + _self._keyWord + "&wordname_op=lk&visible=" + visible + "&start=" + _start + "&end=" + _end;
		} else {
			url = AQUA_SEARCH_HOST + AQUA_SEARCH_GENERAL_SEARCH_PATH + "/" + AQUA_SEARCH_DOCTYPE_WORD_LIBRARY + "?sort_by=edittime&sort_mode=d&visible=" + visible + "&start=" + _start + "&end=" + _end;
		}
		request.open("GET", url, false);
		request.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var response = JSON.parse(this.responseText);
				//解析数据
				var res = response.list_of_properties;
				if (_self._keyWord !== null && res.length < 1) {
					alert(i18n('WORD_LIBRARY_TABLE_SEARCH_MES'));
					//清空搜索条件
					document.getElementById("wordsearchInput").value = "";
					_self._keyWord = null;
					return;
				}
				wordLibrary.wordlist._data_ext = res;
				_self._listTable.data = _self.queryCallback(res);
				//init初始化页数
				_self._listTable.init(parseInt(this.getResponseHeader("x-aqua-total-count")));
			}
		}
		request.send();
	},
	//格式化数据
	queryCallback: function(response) {
		var _self = this;
		var results = response || [];
		_self._data = [];
		_self._listData = [];
		for (var i = 0; i < results.length; i++) {
			var result_item = results[i].properties;
			var item = {
				trans: "&#10005",
				pho: "&#10005",
				pro: "&#10005",
				en: "&#10005",
				zh: "&#10005",
				pic: "&#10005"
			}
			if (_self.getProperty(result_item, "translate_cn") && _self.getProperty(result_item, "translate_cn").length > 0) {
				item.trans = "&#10003";
			}
			if (_self.getProperty(result_item, "phonetic") && _self.getProperty(result_item, "phonetic").length > 0) {
				item.pho = "&#10003";
			}
			if (_self.getProperty(result_item, "pronfile") && _self.getProperty(result_item, "pronfile").length > 0) {
				item.pro = "&#10003";
			}
			if (_self.getProperty(result_item, "sentence_en") && _self.getProperty(result_item, "sentence_en").length > 0) {
				item.en = "&#10003";
			}
			if (_self.getProperty(result_item, "imagefile") && _self.getProperty(result_item, "imagefile").length > 0) {
				item.pic = "&#10003";
			}
			if (_self.getProperty(result_item, "sentence_encn") && _self.getProperty(result_item, "sentence_encn").length > 0) {
				item.zh = "&#10003";
			}
			var operation = "";
			var model_line = "";
			//判断上线下线
			if (_self.model === "model_upline") {
				model_line = i18n('WORD_LIBRARY_TABLE_OPTIONS_UPLINE');
				operation = operation + "<label class='wordlist_op_label' onclick='wordLibrary.wordlist.downWord(this)'>" + i18n('WORD_LIBRARY_TABLE_OPTIONS_DOWNLINE') + "</label>";
			} else {
				model_line = i18n('WORD_LIBRARY_TABLE_OPTIONS_DOWNLINE');
				operation = operation + "<label class='wordlist_op_label' onclick='wordLibrary.wordlist.upWord(this)'>" + i18n('WORD_LIBRARY_TABLE_OPTIONS_UPLINE') + "</label>";
			}
			operation = operation + "<label class='wordlist_op_label' onclick='wordLibrary.wordlist.word_look(this)'>" + i18n('WORD_LIBRARY_TABLE_OPTIONS_LOOK') + "</label>";
			operation = operation + "<label class='wordlist_op_label' onclick='wordLibrary.wordlist.word_edit(this)'>" + i18n('WORD_LIBRARY_TABLE_OPTIONS_EDIT') + "</label>";
			operation = operation + "<label class='wordlist_op_label' onclick='wordLibrary.wordlist.word_del(this)'>" + i18n('WORD_LIBRARY_TABLE_OPTIONS_DEL') + "</label>";
			operation = operation + "";
			_self._listData.push([{
				label: "<div title='" + _self.getProperty(result_item, "wordname") + "'>" + _self.getProperty(result_item, "wordname") + "</div>"
			}, {
				label: "<div>" + item.trans + "</div>"
			}, {
				label: "<div>" + item.pho + "</div>"
			}, {
				label: "<div>" + item.pro + "</div>"
			}, {
				label: "<div>" + item.en + "</div>"
			}, {
				label: "<div>" + item.zh + "</div>"
			}, {
				label: "<div>" + item.pic + "</div>"
			}, {
				label: "<div>" + _self.getProperty(result_item, "edittime") + "</div>"
			}, {
				label: "<div>" + _self.getProperty(result_item, "tags") + "</div>"
			}, {
				label: "<div>" + model_line + "</div>"
			}, {
				label: "<div data-docid='" + results[i].doc_id + "' data-docName='" + _self.getProperty(result_item, "wordname") + "'>" + operation + "</div>"
			}]);
		}
		return _self._listData;
	},
	getProperty: function(arr, key) {
		//针对返回是key value对象数组
		var _arry = arr ? arr : [];
		var _key = key;
		if (_arry.length > 1) {
			for (var i = 0; i < _arry.length; i++) {
				var item = _arry[i];
				if (item.key == _key) {
					return item.value;
				}
			}
		}
		return null;
	},
	downWord: function(e) {
		//下线窗口
		var _self = this;
		this.downWordDialog = new PopupDialog({
			url: 'content/wordLibrary/downWordDialog.html',
			width: 545,
			height: 319,
			context: _self,
			callback: function() {
				//绑定按钮
				document.getElementById("word_close_btn").onclick = function() {
					_self.downWordDialog.close();
				}
				document.getElementById("wordDialog_footer_btn_cancel").onclick = function() {
					_self.downWordDialog.close();
				}
				document.getElementById("wordDialog_footer_btn_ok").onclick = function() {
					//下线单词
					var id = e.parentNode.getAttribute("data-docid");
					var request = new XMLHttpRequest();
					var url = AQUA_SEARCH_HOST + '/aquapaas/rest/search/general/contents_filter' + "/" + AQUA_SEARCH_DOCTYPE_WORD_LIBRARY + "/invisible?id=" + id;
					request.open("PUT", url, false);
					request.onreadystatechange = function() {
						if (this.readyState == 4 && this.status == 200) {
							console.log("下线 success");
							_self._listTable.delRefreshTable();
							//关闭下线单词窗口
							_self.downWordDialog.close();
						} else {
							console.log("下线 fail");
						}
					}
					request.send();
				}
			}
		});
		this.downWordDialog.create();
	},
	upWord: function(e) {
		//上线窗口
		var _self = this;
		this.upWordDialog = new PopupDialog({
			url: 'content/wordLibrary/upWordDialog.html',
			width: 545,
			height: 319,
			context: _self,
			callback: function() {
				//绑定按钮
				document.getElementById("word_close_btn").onclick = function() {
					_self.upWordDialog.close();
				}
				document.getElementById("wordDialog_footer_btn_cancel").onclick = function() {
					_self.upWordDialog.close();
				}
				document.getElementById("wordDialog_footer_btn_ok").onclick = function() {
					//上线单词
					var id = e.parentNode.getAttribute("data-docid");
					var request = new XMLHttpRequest();
					var url = AQUA_SEARCH_HOST + '/aquapaas/rest/search/general/contents_filter' + "/" + AQUA_SEARCH_DOCTYPE_WORD_LIBRARY + "/visible?id=" + id;
					request.open("PUT", url, false);
					request.onreadystatechange = function() {
						if (this.readyState == 4 && this.status == 200) {
							console.log("上线 success");
							//_self.updateListTable();
							_self._listTable.delRefreshTable();
							//关闭上线单词窗口
							_self.upWordDialog.close();
						} else {
							console.log("上线 fail");
						}
					}
					request.send();
				}
			}
		});
		this.upWordDialog.create();
	},
	word_look: function(e) {
		wordLibrary.islook = true;
		this.word_edit(e);
		//禁用输入和下拉
		document.getElementById("wordName").disabled = true;
		document.getElementById("wordsrc").disabled = true;
		document.getElementById("word_en_src").disabled = true;
		document.getElementById("word_key_input").disabled = true;
	},
	word_edit: function(e) {
		//获取单词信息
		wordLibrary.isEdit = true;
		document.getElementById("wordName").disabled = true;
		var _self = this;
		var _that = wordLibrary.createWord;
		var visible;
		if (_self.model == "model_upline") {
			visible = "true";
		} else {
			visible = "false";
		}
		var wordId = e.parentNode.getAttribute("data-docid");
		var _datalist = wordLibrary.wordlist._data_ext;
		var res;
		for (var i = 0; i < _datalist.length; i++) {
			if(_datalist[i].doc_id == wordId){
				res = _datalist[i];
			}
		}
		//清除数据
		_that.clearAddWrodPart();
		//载入数据
		_that.loadWordforEdit(res);
		_that.blindbtn();
		document.getElementById("addWord").className = "addWordShow";
		document.getElementById("wordLibraryContainer").className = "addWordHide";
	},
	word_del: function(e) {
		//打开确认删除窗口
		var _self = this;
		this.deleteDialog = new PopupDialog({
			url: 'content/wordLibrary/deleteWordDialog.html',
			width: 545,
			height: 319,
			context: _self,
			callback: function() {
				//绑定按钮
				document.getElementById("word_close_btn").onclick = function() {
					_self.deleteDialog.close();
				}
				document.getElementById("wordDialog_footer_btn_cancel").onclick = function() {
					_self.deleteDialog.close();
				}
				document.getElementById("wordDialog_footer_btn_ok").onclick = function() {
					//删除单词
					var id = e.parentNode.getAttribute("data-docid");
					var url = AQUA_SEARCH_HOST + AQUA_SEARCH_GENERAL_SEARCH_PATH + "/" + AQUA_SEARCH_DOCTYPE_WORD_LIBRARY + "/" + id;
					var request = new XMLHttpRequest();
					request.open("DELETE", url, true);
					request.onreadystatechange = function() {
						if (this.readyState == 4 && this.status == 200) {
							//关闭窗口
							_self.deleteDialog.close();
							//刷新列表
							_self._listTable.delRefreshTable();
						}
						if (this.readyState == 4 && this.status != 200) {
							alert(i18n('WORD_LIBRARY_TABLE_OPTIONS_DEL_MES'));
						}
					}
					request.send();
				}
			}
		});
		this.deleteDialog.create();
	},
	check_folder: function() {
		var _self = this;
		var wordlibUrl = AQUA_SEARCH_PICAUDIO_WORD_LIBRARY + "/";
		_self.create_folder(wordlibUrl, "0");
		var piclibUrl = AQUA_SEARCH_PICAUDIO_WORD_LIBRARY + "/" + AQUA_SEARCH_PIC_WORD_LIBRARY + "/";
		_self.create_folder(piclibUrl, "1");
		var audiolibUrl = AQUA_SEARCH_PICAUDIO_WORD_LIBRARY + "/" + AQUA_SEARCH_AUDIO_WORD_LIBRARY + "/";
		_self.create_folder(audiolibUrl, "2");
	},
	check_folder_auth: function(isauth) {
		var authenticated_1 = false;
		var authenticated_2 = false;
		//授权
		if (isauth === "1") {
			//设置pic授权
			var domains = "/cdmi_domains" + AQUA_SEARCH_WORD_LIBRARY_LIB + "/";
			var _root = AQUA_SEARCH_PICAUDIO_WORD_LIBRARY + "/" + AQUA_SEARCH_PIC_WORD_LIBRARY + "/";
			ManageOfAcl.setKey(my.aqua.accessKeyId, my.aqua.secretAccessKey, domains, _root);
			var testPath = AQUA_SEARCH_PICAUDIO_WORD_LIBRARY + "/";
			var testName = AQUA_SEARCH_PIC_WORD_LIBRARY;
			//授权
			var array = [];
			array.push({
				identifier: "everyone",
				acemask: "readonly"
			});
			array.push({
				identifier: "authenticated",
				acemask: "readwriteall"
			});
			ManageOfAcl.setACL(testPath, testName, array);
		}
		if (isauth === "2") {
			//设置audio授权
			var domains_2 = "/cdmi_domains" + AQUA_SEARCH_WORD_LIBRARY_LIB + "/";
			var _root_2 = AQUA_SEARCH_PICAUDIO_WORD_LIBRARY + "/" + AQUA_SEARCH_AUDIO_WORD_LIBRARY + "/";
			ManageOfAcl.setKey(my.aqua.accessKeyId, my.aqua.secretAccessKey, domains_2, _root_2);
			var testPath_2 = AQUA_SEARCH_PICAUDIO_WORD_LIBRARY + "/";
			var testName_2 = AQUA_SEARCH_AUDIO_WORD_LIBRARY;
			//检查授权
			var array_2 = [];
			array_2.push({
				identifier: "everyone",
				acemask: "readonly"
			});
			array_2.push({
				identifier: "authenticated",
				acemask: "readwriteall"
			});
			ManageOfAcl.setACL(testPath_2, testName_2, array_2);
		}
	},
	create_folder: function(url, isauth) {
		var _self = this;
		var aquaHost = aqua_host;
		var _restRoot = aquaHost + "/aqua/rest/cdmi";
		url = _restRoot + url;
		var request = new XMLHttpRequest();
		request.open("GET", url, false);
		request.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				//目录已经创建
			}
			if (this.readyState == 4 && this.status != 200) {
				//目录未创建创建目录
				var _request = new XMLHttpRequest();
				_request.open("PUT", url, false);
				_request.send();
				_request.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						//创建成功，授权
						_self.check_folder_auth(isauth);
					}
				}
			}
		}
		request.send();
	}
}
wordLibrary.createWord = {
	//创建单词页面按钮绑定事件
	blindbtn: function() {
		var _self = this;
		document.getElementById("word_trans_add_btn").onclick = function() {
			//打开弹出窗口，添加词性
			if (wordLibrary.islook) {
				return;
			}
			_self.openAddTransDialog();
		}
		document.getElementById("word_pro_add_btn").onclick = function() {
			//打开弹出窗口，添加音标
			if (wordLibrary.islook) {
				return;
			}
			_self.openAddPronsDialog();
		}
		document.getElementById("addWord_example_btn").onclick = function() {
			//打开弹出窗口，添加英文例句
			if (wordLibrary.islook) {
				return;
			}
			_self.openAddExpDialog();
		}
		document.getElementById("word_pic_upload_btn").onclick = function() {
			//上传图片
			if (wordLibrary.islook) {
				return;
			}
			_self.uploadPicture();
		}
		document.getElementById("addWord_save_btn").onclick = function() {
			if (wordLibrary.islook) {
				return;
			}
			_self.saveWord();
			if (wordLibrary.isEdit) {
				document.getElementById("wordName").disabled = false;
				wordLibrary.isEdit = false;
			}
		}
		document.getElementById("addWord_save_upline_btn").onclick = function() {
			//
			if (wordLibrary.islook) {
				return;
			}
			_self.saveWord(true);
			if (wordLibrary.isEdit) {
				document.getElementById("wordName").disabled = false;
				wordLibrary.isEdit = false;
			}
		}
		document.getElementById("addWord_cancel_btn").onclick = function() {
			if (wordLibrary.islook) {
				//移除输入框的disabled
				document.getElementById("wordName").disabled = false;
				document.getElementById("wordsrc").disabled = false;
				document.getElementById("word_en_src").disabled = false;
				document.getElementById("word_key_input").disabled = false;
				wordLibrary.islook = false;
			}
			if (wordLibrary.isEdit) {
				document.getElementById("wordName").disabled = false;
				wordLibrary.isEdit = false;
			}
			//wordLibraryContainer
			document.getElementById("addWord").className = "addWordHide";
			document.getElementById("wordLibraryContainer").className = "addWordShow";
			_self.clearAddWrodPart();
		}
	},
	openAddTransDialog: function() {
		var url = "content/wordLibrary/addWordDialog/addTransDialog.html";
		var _self = this;
		this.transDialog = this.createDialog(url, function() {
			//绑定词性窗口内按钮事件
			//关闭按钮
			document.getElementById("addTransDialog_close_icon").onclick = function() {
					_self.transDialog.close();
				}
				//取消按钮
			document.getElementById("addTransDialog_cancel_btn").onclick = function() {
					_self.transDialog.close();
				}
				//确定按钮
			document.getElementById("addTransDialog_ok_btn").onclick = function() {
					//
					var datalist = document.getElementsByClassName("word_new_trans_conponents");
					var p = document.getElementById("word_trans");
					for (var i = 0; i < datalist.length; i++) {
						var item_element = datalist[i];
						var selectValue = item_element.getElementsByTagName("select")[0].value;
						var inputValue = item_element.getElementsByTagName("input")[0].value;
						//判断是否为空
						if (selectValue === "none") {
							continue;
						}
						var div_input = document.createElement("div");
						div_input.className = "word_trans_list";
						div_input.innerHTML = "<div style='display:flex;'><div style='flex:1;'>" + selectValue + "&nbsp;" + inputValue + "</div>" + "<span class='word_trans_del_icon' onclick='wordLibrary.createWord.removeResult(this)'></span>" + "</div>";
						p.appendChild(div_input);
					}
					_self.transDialog.close();
				}
				//添加词性选择和input的按钮
			document.getElementById("addTransDialog_body_btn").onclick = function() {
				_self.transDialog.transLength = _self.transDialog.transLength + 1;
				var o = document.getElementById("addTransDialog_body_line");
				var p = document.getElementById("addTransDialog_body_btn");
				var div = document.createElement("div");
				div.className = "word_new_trans_conponents";
				div.id = "word_new_trans_conponents_" + _self.transDialog.transLength;
				var div_select = document.createElement("select");
				div_select.className = "word_new_trans_select";
				div_select.id = "word_new_trans_select_" + _self.transDialog.transLength;
				div.appendChild(div_select);
				var div_input = document.createElement("input");
				div_input.placeholder = i18n('WORD_LIBRARY_DIALOG_ADDTRANS_INPUT_PLACEHOLDER');
				div_input.className = "word_new_trans_input";
				div.appendChild(div_input);
				o.insertBefore(div, p);
				//添加下拉option
				_self.create_select_conponents(div_select.id);
			}
		});
		this.transDialog.create();
		//创建词性填写框的个数
		this.transDialog.transLength = 1;
	},
	removeResult: function(e) {
		if (wordLibrary.islook) {
			return;
		}
		var p = e.parentNode.parentNode;
		var o = p.parentNode;
		o.removeChild(p);
	},
	create_trans_result: function() {

	},
	create_select_conponents: function(id) {
		//词性创建下拉框
		var states = [{
			label: "名词",
			value: 'n.'
		}, {
			label: "代词",
			value: 'pron.'
		}, {
			label: "动词",
			value: 'v.'
		}, {
			label: "形容词",
			value: 'adj.'
		}, {
			label: "副词",
			value: 'adv.'
		}, {
			label: "数词",
			value: 'num.'
		}, {
			label: "冠词",
			value: 'art.'
		}, {
			label: "介词",
			value: 'prep.'
		}, {
			label: "连词",
			value: 'conj.'
		}, {
			label: "感叹词",
			value: 'interj.'
		}];
		var p = document.getElementById(id);
		var option_list = "<option selected class='word_trans_option_placeholder' value='none'>" + i18n('WORD_LIBRARY_DIALOG_ADDTRANS_SELECT_PLACEHOLDER') + "</option>";
		for (var i = 0; i < states.length; i++) {
			var item = states[i];
			option_list = option_list + "<option value='" + item.value + "'>" + item.value + "</option>";
		}
		p.innerHTML = option_list;
	},
	openAddPronsDialog: function() {
		var url = "content/wordLibrary/addWordDialog/addProDialog.html";
		var _self = this;
		this.proDialog = this.createDialog(url, function() {
			//取消按钮
			document.getElementById("addProDialog_cancel_btn").onclick = function() {
					_self.proDialog.close();
				}
				//确定按钮
			document.getElementById("addProDialog_ok_btn").onclick = function() {
					var p = document.getElementById("word_pro");
					var inputValue = document.getElementById("addProDialog_input").value;
					var voice = document.getElementById("addTransDialog_voice").src;
					var voicename = wordLibrary.getWorddatames(document.getElementById("addTransDialog_voice").getAttribute("data-voiceName"));
					var div_input = document.createElement("div");
					var div_voice = "";
					if (inputValue.trim() === "") {
						inputValue = "";
					}
					if (voicename != null) {
						div_voice = "<span class='word_pro_div_voice_btn' onclick='wordLibrary.createWord.playWordVoice(this)'></span>";
						wordLibrary.setAttributeAuto(div_input,"data-voiceURL",voice);
						wordLibrary.setAttributeAuto(div_input,"data-voiceName",voicename);
					}
					if (inputValue === "" && voice === "#") {
						_self.proDialog.close();
						return;
					}
					div_input.className = "word_pro_list_container";
					div_input.innerHTML = "<div class='word_pro_list'>" + "<div>" + inputValue + "</div>" + div_voice + "<div style='flex:1;'></div>" + "<span class='word_pro_list_del_icon' onclick='wordLibrary.createWord.removeResult(this)'></span>" + "</div>";
					p.appendChild(div_input);
					_self.proDialog.close();
				}
				//关闭窗口按钮
			document.getElementById("addProDialog_close_icon").onclick = function() {
					_self.proDialog.close();
				}
				//上传按钮
			document.getElementById("addProDialog_btn_upload").onclick = function() {
				var uploadfile = document.createElement("input");
				uploadfile.type = "file";
				uploadfile.accept = "audio/mp3";
				uploadfile.style.display = "none";
				uploadfile.onchange = function() {
					var _file = this.files[0];
					_self.uploadAudio(_file);
				}
				uploadfile.click();
			}
		});
		this.proDialog.create();
	},
	playWordVoice: function(e) {
		var p = e.parentNode.parentNode;
		var o = document.getElementById("word_pro_audio");
		o.src = wordLibrary.getWorddatames(p.getAttribute("data-voiceURL"));
		o.play();
	},
	uploadAudio: function(file) {
		var _self = this;
		//验证是否为MP3
		var name = file.name;
		name = name.toLowerCase();
		var _arry = name.split(".");
		if (_arry.length > 1 && _arry[_arry.length - 1] == "mp3") {
			//上传语音
			var reader = new FileReader();
			reader.onloadend = function() {
				var file_data = reader.result;
				_self.xhrUpload(file_data, file.name);
			}
			reader.readAsArrayBuffer(file);
		} else {
			alert(i18n('WORD_LIBRARY_DIALOG_UPLOAD_MP3_MES'));
		}
	},
	xhrUpload: function(file_data, name) {
		var aquaHost = aqua_host;
		var _restRoot = aquaHost + "/aqua/rest/cdmi";
		var audiolibUrl = AQUA_SEARCH_PICAUDIO_WORD_LIBRARY + "/" + AQUA_SEARCH_AUDIO_WORD_LIBRARY + "/";
		var url = _restRoot + audiolibUrl + name;
		var audio_url = aquaHost + "/aqua/rest/cdmi" + audiolibUrl + name;
		//检查重名
		if (this.chechExsit(url)) {
			var sure = confirm(i18n('WORD_LIBRARY_DIALOG_UPLOAD_MP3_MES_CHECK'));
			if (!sure) {
				return;
			}
		}
		var xhr = new XMLHttpRequest();
		var xp = document.getElementById("addProDialog_upload_progress");
		var percentageDiv = document.getElementById("addProDialog_upload_percentageDiv");
		xhr.upload.onprogress = function(e) {
			if (e.lengthComputable) {
				xp.max = e.total;
				xp.value = e.loaded;
			}
		}
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 201 || this.status == 204) {
				var playBtn = document.getElementById("addProDialog_btn_play");
				var playsrc = document.getElementById("addTransDialog_voice");
				wordLibrary.setAttributeAuto(playsrc,"data-voiceName",name);
				playsrc.src = audio_url;
				playBtn.className = "addProDialog_btn_play_ok";
				playBtn.onclick = function() {
					playsrc.play();
				}
			}
		}
		var fileMIME = "audio/mp3";
		xhr.open('PUT', url, true);
		my.aqua.addXHRHeaderRequest(xhr, 'PUT', url, fileMIME);
		//覆盖文件
		xhr.setRequestHeader("x-aqua-file-truncate", "0");
		xhr.send(file_data);
	},
	chechExsit: function(url) {
		var _return = false;
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, false);
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				_return = true;
			} else if (this.readyState == 4 && this.status == 404) {
				_return = false;
			}
		}
		xhr.send();
		return _return;
	},
	openAddExpDialog: function() {
		var url = "content/wordLibrary/addWordDialog/addExpDialog.html"
		var _self = this;
		this.exampleDialog = this.createDialog(url, function() {
			//绑定例句窗口内按钮事件
			document.getElementById("addExpDialog_close_icon").onclick = function() {
				_self.exampleDialog.close();
			}
			document.getElementById("addExpDialog_cancel_btn").onclick = function() {
				_self.exampleDialog.close();
			}
			document.getElementById("addExpDialog_ok_btn").onclick = function() {
				var text_en = document.getElementById("addExpDialog_EN").value.trim();
				var text_cn = document.getElementById("addExpDialog_CN").value.trim();
				var p = document.getElementById("word_en_example");
				var eg_en, eg_cn;
				if (text_en !== "") {
					eg_en = "<div class='word_exp_en'>" + text_en + "</div>";
				} else {
					alert(i18n('WORD_LIBRARY_DIALOG_EN_NEEDED_MES'));
					return;
				}
				if (text_cn !== "") {
					eg_cn = "<div class='word_exp_cn'>" + text_cn + "</div>";
				} else {
					alert(i18n('WORD_LIBRARY_DIALOG_CN_NEEDED_MES'));
					return;
				}
				var div = "<div style='display:flex;'><div class='word_exp_contianer'>" + eg_en + eg_cn + "</div>" + "<span class='word_pro_list_del_icon' onclick='wordLibrary.createWord.removeResult(this)'></span></div>";
				var div_el = document.createElement("div");
				div_el.className = "word_exp_list";
				div_el.innerHTML = div;
				p.appendChild(div_el);
				_self.exampleDialog.close();
			}
		});
		this.exampleDialog.create();
	},
	createDialog: function(url, callback) {
		var _self = this;
		//创建dialog弹窗 url表示dialog位置，callback绑定事件
		var dialog = new PopupDialog({
			url: url,
			width: 668,
			height: 386,
			context: _self,
			callback: callback
		});
		return dialog;
	},
	uploadPicture: function() {
		var _self = this;
		var uploadfile = document.createElement("input");
		uploadfile.type = "file";
		uploadfile.multiple = "multiple";
		uploadfile.style.display = "none";
		uploadfile.onchange = function() {
			var files = this.files;
			_self.readonline(files, 0);

		}
		uploadfile.click();
	},
	readonline: function(filearr, index) {
		var _self = this;
		var aquaHost = aqua_host;
		var _restRoot = aquaHost + "/aqua/rest/cdmi";
		var piclibUrl = AQUA_SEARCH_PICAUDIO_WORD_LIBRARY + "/" + AQUA_SEARCH_PIC_WORD_LIBRARY + "/";
		//顺序读取本地文件
		if (index > filearr.length - 1) {
			return;
		}
		var file_item = filearr[index];
		//对文件名使用唯一编码
		var url = _restRoot + piclibUrl + file_item.name;
		if (_self.chechExsit(url)) {
			var sure = confirm(i18n('WORD_LIBRARY_DIALOG_UPLOAD_PIC_MES_CHECK'));
			if (!sure) {
				_self.readonline(filearr, index + 1)
				return;
			}
		}
		//确定fileMIME
		var name_str = file_item.name;
		var name_arr = name_str.split(".");
		var _arr = name_arr[name_arr.length - 1].toLowerCase();
		var fileMIME = "none";
		if (name_arr.length > 1) {
			if (_arr === "jpg") {
				fileMIME = "image/jpeg";
			}
			if (_arr === "png") {
				fileMIME = "image/png";
			}
			if (_arr === "gif") {
				fileMIME = "image/gif";
			}
		} else {
			alert("请选择图片");
			return;
		}
		//开始上传
		var reader = new FileReader();
		reader.onloadend = function() {
			var file_data = reader.result;
			_self.xhrUpload_pic(file_data, url, fileMIME, file_item.name, index, filearr);
		}
		reader.readAsArrayBuffer(file_item);
	},
	xhrUpload_pic: function(data, url, fileMIME, name, index, filelist) {
		var _self = this;
		var xhr = new XMLHttpRequest();
		//check
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && (this.status == 201 || this.status == 204)) {
				var p = document.getElementById('word_pic');
				//
				if (!wordLibrary.isEdit) {
					var pt = wordLibrary.getWorddatames(p.getAttribute("data-picname"));
					if (pt !== undefined && pt !== null && pt !== "") {
						var _oldAttr = pt.split("&");
						_oldAttr.push(name);
						wordLibrary.setAttributeAuto(p,"data-picname",_oldAttr.join("&"));
					} else {
						wordLibrary.setAttributeAuto(p,"data-picname",name);
					}
				}
				if (wordLibrary.isEdit) {
					//针对编辑状态
					var pt_e = wordLibrary.getWorddatames(p.getAttribute("data-picname_edit"));
					if (pt_e !== undefined && pt_e !== null && pt_e !== "") {
						var _oldAttrEdit = pt_e.split("&");
						_oldAttrEdit.push(name);
						wordLibrary.setAttributeAuto(p,"data-picname_edit",_oldAttrEdit.join("&"));
					} else {
						wordLibrary.setAttributeAuto(p,"data-picname_edit",name);
					}
				}
				var o = document.getElementsByClassName("word_pic_img_obj");
				if (o.length < 1) {
					//只有当前单词没有第一张图片的时候，才显示上传的图片
					//var img = "<img class='word_pic_img_obj' style='width:100%;height:100%;' src='" + url + "'/>";
					var img = document.createElement("img");
					img.className = "word_pic_img_obj";
					img.style.height = "100%";
					img.style.width = "100%";
					img.src = url;
					p.innerHTML = "";
					p.appendChild(img);
				}
				//上传下一张图片
				_self.readonline(filelist, index + 1);
			} else {

			}
		}
		xhr.open('PUT', url, true);
		my.aqua.addXHRHeaderRequest(xhr, 'PUT', url, fileMIME);
		//覆盖文件
		xhr.setRequestHeader("x-aqua-file-truncate", "0");
		xhr.send(data);
	},
	saveWord: function(isuplineword) {
		var isupline = isuplineword ? isuplineword : false;
		var _self = this;
		var _that = wordLibrary.wordlist;
		//_data输入的数据集合
		var _data_porperties = [];
		//保存数据
		var data_wordlib = AQUA_SEARCH_DOCTYPE_WORD_LIBRARY;
		var data_wordname = document.getElementById("wordName").value.trim();

		//确认单词是否存在，询问覆盖
		// if (_self.searhWordExist(data_wordname)) {
		// 	//单词已经存在
		// 	var _sure = confirm(i18n('WORD_LIBRARY_SAVE_WORD_MES_COVER'));
		// 	if (!_sure) {
		// 		return;
		// 	}
		// }
		_data_porperties.push({
			"key": "wordname",
			"value": data_wordname
		});
		var data_wordsrc = document.getElementById("wordsrc").value;
		_data_porperties.push({
			"key": "wordsource",
			"value": data_wordsrc
		});
		var word_trans_list = document.getElementsByClassName("word_trans_list");
		var data_word_trans_list = [];
		if (word_trans_list.length > 0) {
			//输入词性和翻译，结果是数组
			for (var i = 0; i < word_trans_list.length; i++) {
				var word_trans_list_div = word_trans_list[i].childNodes[0];
				var word_trans_list_div_div = word_trans_list_div.childNodes[0].innerText;
				if (!word_trans_list_div_div) {
					//低版本火狐不支持innerText
					word_trans_list_div_div = word_trans_list_div.childNodes[0].textContent;
				}
				//音标
				data_word_trans_list.push(word_trans_list_div_div);
			}
		}
		_data_porperties.push({
			"key": "translate_cn",
			"value": data_word_trans_list
		});
		var word_pros_list = document.getElementsByClassName("word_pro_list_container");
		var data_word_pros_list_phonetic = [];
		var data_word_pros_list_pronfile = [];
		if (word_pros_list.length > 0) {
			for (var i = 0; i < word_pros_list.length; i++) {
				//输入音标和MP3文件
				var word_pros_list_div = word_pros_list[i].childNodes[0];
				var word_pros_list_div_div = word_pros_list_div.childNodes[0].innerText;
				if (!word_pros_list_div_div) {
					//低版本火狐不支持innerText
					word_pros_list_div_div = word_pros_list_div.childNodes[0].textContent;
				}
				var voicename = wordLibrary.getWorddatames(word_pros_list[i].getAttribute("data-voiceName"));
				var item_pros;
				if (voicename === null || voicename === undefined) {
					data_word_pros_list_phonetic.push(word_pros_list_div_div);
					data_word_pros_list_pronfile.push("");
				} else {
					data_word_pros_list_phonetic.push(word_pros_list_div_div);
					data_word_pros_list_pronfile.push(voicename);
				}
			}
		}
		_data_porperties.push({
			"key": "phonetic",
			"value": data_word_pros_list_phonetic
		});
		_data_porperties.push({
			"key": "pronfile",
			"value": data_word_pros_list_pronfile
		});
		//例句
		var word_en_example = document.getElementsByClassName("word_exp_list");
		var data_word_en_example_en = [];
		var data_word_en_example_encn = [];
		if (word_en_example.length > 0) {
			for (var i = 0; i < word_en_example.length; i++) {
				var word_en_example_div = word_en_example[i].childNodes[0];
				var word_en_example_div_div = word_en_example_div.childNodes[0];
				var word_en_example_div_div_en = word_en_example_div_div.childNodes[0].innerText;
				var word_en_example_div_div_cn = word_en_example_div_div.childNodes[1].innerText;
				if (!word_en_example_div_div_en && !word_en_example_div_div_cn) {
					//低版本火狐不支持innerText
					word_en_example_div_div_en = word_en_example_div_div.childNodes[0].textContent;
					word_en_example_div_div_cn = word_en_example_div_div.childNodes[1].textContent;
				}
				data_word_en_example_en.push(word_en_example_div_div_en);
				data_word_en_example_encn.push(word_en_example_div_div_cn);
			}

		}
		_data_porperties.push({
			"key": "sentence_en",
			"value": data_word_en_example_en
		});
		_data_porperties.push({
			"key": "sentence_encn",
			"value": data_word_en_example_encn
		});
		var data_word_en_example_src = document.getElementById("wordsrc").value;
		var data_src_arr = [];
		data_src_arr.push(data_word_en_example_src);
		_data_porperties.push({
			"key": "sentence_enroot",
			"value": data_src_arr
		});
		var data_word_pic = wordLibrary.getWorddatames(document.getElementById("word_pic").getAttribute("data-picname"));
		if (wordLibrary.isEdit) {
			var data_word_pic_edit = wordLibrary.getWorddatames(document.getElementById("word_pic").getAttribute("data-picname_edit"));
			//判断编辑的过程中是否有上传
			if (data_word_pic_edit != "") {
				data_word_pic = data_word_pic_edit;
			}
		}
		if (data_word_pic != null && data_word_pic != undefined) {
			var data_word_pic_array = data_word_pic.split("&");
			if (data_word_pic_array.length > 0 && data_word_pic_array[0] !== "") {
				_data_porperties.push({
					"key": "imagefile",
					"value": data_word_pic_array
				});
			} else {
				_data_porperties.push({
					"key": "imagefile",
					"value": []
				});
			}
		}
		var data_word_tags = document.getElementById("word_key_input").value.split(";");
		if (data_word_tags.length > 0 && data_word_tags[0] !== "") {
			_data_porperties.push({
				"key": "tags",
				"value": data_word_tags
			});
		} else {
			_data_porperties.push({
				"key": "tags",
				"value": []
			});
		}
		//添加时间戳
		var date = new Date();
		//格式化时间
		_data_porperties.push({
			"key": "edittime",
			"value": _self.getTime(date)
		});
		var _data = {
			"doc_type": data_wordlib,
			"properties": _data_porperties
		}
		//判断word是否有原docId
		var _docId = document.getElementById("addWord").getAttribute('data-wordId');
		if(_docId === '_wrdNoTS'){
			var _strDtasw = (new Date()).getTime();
			_docId = hex_md5(data_wordname + _strDtasw);
		}
		var n_url = AQUA_SEARCH_HOST + AQUA_SEARCH_GENERAL_SEARCH_PATH + "/" + AQUA_SEARCH_DOCTYPE_WORD_LIBRARY + "/" + _docId;
		var request = new XMLHttpRequest();
		request.open("PUT", n_url, false);
		request.onreadystatechange = function() {
			if (this.readyState == 4 && (this.status == 200)) {
				//关闭add页面
				document.getElementById("addWord").className = "addWordHide";
				document.getElementById("wordLibraryContainer").className = "addWordShow";
				//清空数据
				_self.clearAddWrodPart();
				//设置上下线
				var isvisi;
				if (!isuplineword) {
					isvisi = "invisible";
				} else {
					isvisi = "visible";
				}
				var request_down = new XMLHttpRequest();
				var url_dwn = AQUA_SEARCH_HOST + '/aquapaas/rest/search/general/contents_filter' + "/" + AQUA_SEARCH_DOCTYPE_WORD_LIBRARY + "/" + isvisi + "?id=" + _docId;
				request_down.open("PUT", url_dwn, false);
				request_down.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						console.log(isvisi + "  success");
						//关闭下线单词窗口
					} else {
						console.log("fail");
					}
				}
				request_down.send();
				console.log("save success");
				//刷新table 还是当前页
				_that._listTable.delRefreshTable();
			}
		}
		request.setRequestHeader("content-type", "application/json");
		request.send(JSON.stringify(_data));
	},
	getTime: function(date) {
		var _year = date.getFullYear().toString();
		var _month = (date.getMonth() + 1).toString();
		if (_month.split("").length < 2) {
			_month = "0" + _month;
		}
		var _day = date.getDate().toString();
		if (_day.split("").length < 2) {
			_day = "0" + _day;
		}
		var _hour = date.getHours().toString();
		if (_hour.split("").length < 2) {
			_hour = "0" + _hour;
		}
		var _minutes = date.getMinutes().toString();
		if (_minutes.split("").length < 2) {
			_minutes = "0" + _minutes;
		}
		var _seconds = date.getSeconds().toString();
		if (_seconds.split("").length < 2) {
			_seconds = "0" + _seconds;
		}
		return _year + "-" + _month + "-" + _day + "T" + _hour + ":" + _minutes + ":" + _seconds + "+0800";
	},
	clearAddWrodPart: function() {
		//clear data on the add word page
		document.getElementById("addWord").setAttribute('data-wordId', '_wrdNoTS');
		document.getElementById("wordName").value = "";
		var options_wordsrc = document.getElementById("wordsrc").childNodes;
		for (var i = 0; i < options_wordsrc.length; i++) {
			var item = options_wordsrc[i];
			if (item.value == "SBS1") {
				item.selected = true;
			} else {
				item.selected = false;
			}
		}
		document.getElementById("word_trans").innerHTML = "";
		document.getElementById("word_pro").innerHTML = "";
		document.getElementById("word_en_example").innerHTML = "";
		var _word_pic = document.getElementById("word_pic");
		_word_pic.innerHTML = "";
		wordLibrary.setAttributeAuto(_word_pic,"data-picname","");
		wordLibrary.setAttributeAuto(_word_pic,"data-picname_edit","");

		var options_wordsrc = document.getElementById("word_en_src").childNodes;
		for (var i = 0; i < options_wordsrc.length; i++) {
			var item = options_wordsrc[i];
			if (item.value == "SBS1") {
				item.selected = true;
			} else {
				item.selected = false;
			}
		}
		document.getElementById("word_key_input").value = "";
	},
	loadWordforEdit: function(word) {

		var _self = this;
		var _that = wordLibrary.wordlist;
		var word_data = word;
		var word_properties = word_data.properties;

		//set word id
		document.getElementById("addWord").setAttribute('data-wordId',word_data.doc_id);
		document.getElementById("wordName").value = _that.getProperty(word_properties, "wordname");
		var options_wordsrc = document.getElementById("wordsrc").childNodes;
		for (var i = 0; i < options_wordsrc.length; i++) {
			var item = options_wordsrc[i];
			if (item.value == _that.getProperty(word_properties, "wordsource")) {
				item.selected = true;
			} else {
				item.selected = false;
			}
		}
		//写入词性解释
		var transp = document.getElementById("word_trans");
		var word_trans = _that.getProperty(word_properties, "translate_cn");
		for (var i = 0; i < word_trans.length; i++) {
			var div_input = document.createElement("div");
			div_input.className = "word_trans_list";
			div_input.innerHTML = "<div style='display:flex;'><div style='flex:1;'>" + word_trans[i] + "</div>" + "<span class='word_trans_del_icon' onclick='wordLibrary.createWord.removeResult(this)'></span>" + "</div>";
			transp.appendChild(div_input);
		}
		//写入读音
		var prosp = document.getElementById("word_pro");
		var word_props_phonetic = _that.getProperty(word_properties, "phonetic");
		var word_props_pronfile = _that.getProperty(word_properties, "pronfile");
		for (var i = 0; i < word_props_phonetic.length; i++) {
			var div_input_props = document.createElement("div");
			var inputValue = word_props_phonetic[i];
			var div_voice = "";
			if (word_props_pronfile[i] != "") {
				div_voice = "<span class='word_pro_div_voice_btn' onclick='wordLibrary.createWord.playWordVoice(this)'></span>";
				wordLibrary.setAttributeAuto(div_input_props,"data-voiceName",word_props_pronfile[i]);
				// 设置播放url
				var voice = aqua_host + "/aqua/rest/cdmi" + AQUA_SEARCH_PICAUDIO_WORD_LIBRARY + "/" + AQUA_SEARCH_AUDIO_WORD_LIBRARY + "/" + word_props_pronfile[i];
				wordLibrary.setAttributeAuto(div_input_props,"data-voiceURL",voice);
			}

			div_input_props.className = "word_pro_list_container";
			div_input_props.innerHTML = "<div class='word_pro_list'>" + "<div>" + inputValue + "</div>" + div_voice + "<div style='flex:1;'></div>" + "<span class='word_pro_list_del_icon' onclick='wordLibrary.createWord.removeResult(this)'></span>" + "</div>";
			prosp.appendChild(div_input_props);
		}
		//写入例句
		var example = document.getElementById("word_en_example");
		var word_sentence_en = _that.getProperty(word_properties, "sentence_en");
		var word_sentence_encn = _that.getProperty(word_properties, "sentence_encn");
		for (var i = 0; i < word_sentence_en.length; i++) {
			var eg_en = "<div class='word_exp_en'>" + word_sentence_en[i] + "</div>";
			var eg_cn = "<div class='word_exp_cn'>" + word_sentence_encn[i] + "</div>";
			var div = "<div style='display:flex;'><div class='word_exp_contianer'>" + eg_en + eg_cn + "</div>" + "<span class='word_pro_list_del_icon' onclick='wordLibrary.createWord.removeResult(this)'></span></div>";
			var div_el = document.createElement("div");
			div_el.className = "word_exp_list";
			div_el.innerHTML = div;
			example.appendChild(div_el);
		}

		var sentence_source = _that.getProperty(word_properties, "sentence_enroot");
		var options_wordsrc = document.getElementById("word_en_src").childNodes;
		for (var i = 0; i < options_wordsrc.length; i++) {
			var item = options_wordsrc[i];
			if (item.value == sentence_source) {
				item.selected = true;
			} else {
				item.selected = false;
			}
		}

		//写入图片
		var picname = _that.getProperty(word_properties, "imagefile");
		if (picname && picname.length > 0) {
			var picp = document.getElementById('word_pic');
			//写入当前单词所有图片信息

			//picp.setAttribute("data-picname", picname.join("&"));
			wordLibrary.setAttributeAuto(picp,"data-picname",picname.join("&"));
			//picp.setAttribute("data-picname_edit", "");
			wordLibrary.setAttributeAuto(picp,"data-picname_edit","");
			var picurl = aqua_host + "/aqua/rest/cdmi" + AQUA_SEARCH_PICAUDIO_WORD_LIBRARY + "/" + AQUA_SEARCH_PIC_WORD_LIBRARY + "/" + picname[0];
			var img = document.createElement("img");
			img.style.width = "100%";
			img.style.height = "100%";
			img.src = picurl;
			picp.innerHTML = "";
			picp.appendChild(img);
		}
		//关键词
		var keywords = _that.getProperty(word_properties, "tags");
		if (keywords !== null) {
			document.getElementById("word_key_input").value = keywords.join(";");
		}
	},
	searhWordExist: function(wordname) {
		var _self = this;
		var _that = wordLibrary.createWord;
		var visible;
		var _result = false;
		var _resultId = "";
		var xhr = new XMLHttpRequest();
		var url = AQUA_SEARCH_HOST + AQUA_SEARCH_GENERAL_SEARCH_PATH + "/" + AQUA_SEARCH_DOCTYPE_WORD_LIBRARY + "?wordname=" + wordname + "&wordname_op=in&visible=true";
		xhr.open("GET", url, false);
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var res = JSON.parse(this.responseText);
				//载入数据
				if (res.list_of_properties.length > 0) {
					_result = true;
					_resultId = res.list_of_properties[0].doc_id;
				}
			}
		}
		xhr.send();
		if (!_result) {
			var xhr2 = new XMLHttpRequest();
			var url2 = AQUA_SEARCH_HOST + AQUA_SEARCH_GENERAL_SEARCH_PATH + "/" + AQUA_SEARCH_DOCTYPE_WORD_LIBRARY + "?wordname=" + wordname + "&wordname_op=in&visible=false";
			xhr2.open("GET", url2, false);
			xhr2.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var res2 = JSON.parse(this.responseText);
					//载入数据
					if (res2.list_of_properties.length > 0) {
						_result = true;
						_resultId = res2.list_of_properties[0].doc_id;
					}
				}
			}
			xhr2.send();
		}
		return {
			result: _result,
			resultId: _resultId
		};
	}
}