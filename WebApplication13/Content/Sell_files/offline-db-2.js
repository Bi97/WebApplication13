var Database = {
    name: "SapoLocalDb",
    version: 16,
    previousVersion: 15,
    dbInstance: null,
    firstOpenDb: function () {
        Database.openDbForAction(function () {
            firstFetchData();
        })
    },
    //openDbOff: function () {
    //    console.log("openDbOf ...");
    //    var req = indexedDB.open(Database.name, Database.version);
    //    req.onsuccess = function (event) {
    //        console.log("openDbOff DONE");
    //        Database.dbInstance = event.target.result;
    //    };
    //    req.onerror = function (event) {
    //        console.error("openDb:", event.target.error);
    //    };

    //    req.onupgradeneeded = function (event) {
    //        Database.dbInstance = event.target.result;
    //        console.log("openDb.onupgradeneeded");
    //    };
    //},
    //openDbForAction: function (action) {
    //    console.log("open Db for action...");
    //    let dbInstanceNull = true;
    //    if (Database.dbInstance != null) {
    //        dbInstanceNull = false;
    //        return action();
    //    }
            

    //    var req = indexedDB.open(Database.name, Database.version);
    //    req.onsuccess = function (event) {
    //        console.log("Done");
    //        Database.dbInstance = event.target.result;
            
    //        return action();
    //    };
    //    req.onerror = function (event) {
    //        console.error("openDb for action", event.target.error);
    //    };
    //    req.onupgradeneeded = function (event) {
    //        Database.dbInstance = event.target.result;
    //        console.log("openDb.onupgradeneeded");
    //        Database.initSchema();
    //    };
    //    req.onabort = function () {
    //        console.log("open transaction has been aborted");
    //    };
    //    req.onblocked = function () {
    //        console.log("open transaction has been blocked");
    //    };
    //    req.onclose = function () {
    //        console.log("open transaction has been closed");
    //    }
    //},
    openDb: function (action) {
        console.log("start opening indexdb");
        let dbInstanceNull = true;
        if (Database.dbInstance != null) {
            dbInstanceNull = false;
            return;
        }


        var req = indexedDB.open(Database.name, Database.version);
        
        req.onblocked = function () {
            console.log("transaction open has been blocked");
        };
        req.onerror = function (event) {
            console.error("openDb for action", event.target.error);
        };
        req.onsuccess = function (event) {
            console.log("transaction open has been successfull");
            Database.dbInstance = event.target.result;
            postMessage({ action: "open index db done" });
        };
        req.onupgradeneeded = function (event) {
            Database.dbInstance = event.target.result;
            console.log("openDb.onupgradeneeded");
            Database.initSchema();
        };
        req.onabort = function () {
            console.log("transaction open has been aborted");
        };
        req.onclose = function () {
            console.log("transaction transaction has been closed");
        }
        req.addEventListener("completed", function (event) {
            console.log("transaction open has been completed");
        });
    },
    initSchema: function () {
        var objectStoreModels = new Array(
            new objectStoreModel("Statistic", "object_type", true, new Array()),
            new objectStoreModel("Tenants", "id", false, new Array()),
            new objectStoreModel("Locations", "id", false, new Array()),
            new objectStoreModel("Accounts", "id", false, new Array()),
            new objectStoreModel("Countries", "id", false, new Array()),
            new objectStoreModel("Cities", "id", false, new Array()),
            new objectStoreModel("Districts", "id", false, new Array()),
            //new objectStoreModel("ManualListVariant", "id", false, new Array()),
            new objectStoreModel("Products", "id", false, new Array()),
            new objectStoreModel("Variants", "id", false, new Array(new dbIndex("name", false), new dbIndex("product_name", false), new dbIndex("sku", false), new dbIndex("barcode", false), new dbIndex("packsize_root_id", false), new dbIndex("packsize", false))),
            //new objectStoreModel("TopSaleVariants", "id", true, new Array()),
            new objectStoreModel("PriceLists", "id", false, new Array()),
            new objectStoreModel("TaxTypes", "id", false, new Array()),
            new objectStoreModel("PaymentMethods", "id", false, new Array()),
            new objectStoreModel("TenantSettings", "tenant_id", false, new Array()),
            new objectStoreModel("PrintForms", "id", true, new Array()),
            new objectStoreModel("Customers", "local_id", true, new Array(new dbIndex("id", false), new dbIndex("name", false), new dbIndex("code", false), new dbIndex("email", false), new dbIndex("phone_number", false))),
            new objectStoreModel("Orders", "local_id", true, new Array(new dbIndex("id", false))),
            new objectStoreModel("CustomerGroups", "id", false, new Array()),
            new objectStoreModel("Categories", "id", false, new Array()),
            new objectStoreModel("Brands", "id", false, new Array())
        );

        objectStoreModels.forEach(function (objectStoreModel) {
            var db = Database.dbInstance;
            if (db.objectStoreNames.contains(objectStoreModel.name)) {
                //db.deleteObjectStore(objectStoreModel.name);
            }
            else {
                var objectStore = db.createObjectStore(objectStoreModel.name, { keyPath: objectStoreModel.key, autoIncrement: objectStoreModel.autoIncrement });
                if (objectStoreModel["indexes"] != null) {
                    objectStoreModel.indexes.forEach(function (index) {
                        objectStore.createIndex(index["name"], index["name"], { unique: index["unique"] });
                    })
                }
            }
           
        })
    },
    updateSchema: function () {

    },
    getObjectStore: function (name, mode) {
        if (Database.dbInstance == null) {
            //Database.openDbForAction(function () {
            //    var tx = Database.dbInstance.transaction(name, mode);
            //    return tx.objectStore(name);
            //})
            var req = indexedDB.open(Database.name, Database.version);
            req.onsuccess = function (event) {
                Database.dbInstance = event.target.result;
                var tx = Database.dbInstance.transaction(name, mode);
                return tx.objectStore(name);
            };
        }
        else {
            var tx = Database.dbInstance.transaction(name, mode);
            return tx.objectStore(name);
        }
    }
}

function sendRequest(method, url, requestModel, onsuccess, onerror) {
    var xmlHttp;
    if (XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
    else if (ActiveXObject) {
        try {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP"); //IE 5.x, 6
        }
        catch (e) {
            console.log(e);
        }
    }
    xmlHttp.open(method, url);
    xmlHttp.onreadystatechange = onCallback;
    xmlHttp.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xmlHttp.setRequestHeader('X-Sapo-Offline', true);
    xmlHttp.setRequestHeader('X-Sapo-ServiceId', 'sapo-offline');
    function onCallback() {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200 || xmlHttp.status == 201) {
                var responseModel = JSON.parse(xmlHttp.responseText);
                onsuccess(responseModel);
            }
            else {
                var err = new Object();
                err.detail = xmlHttp.responseText;
                //var responseModel = JSON.stringify(err);
                if (onerror != undefined)
                    onerror(err);

            }
        }
    }
    xmlHttp.send(JSON.stringify(requestModel));
}

var OfflineUtils = {
    getDateTextForCode: function () {
        var date = new Date();
        var dat = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear().toString();
        var monthText = month.toString();
        var dateText = dat.toString();
        if (dat < 10) {
            dateText = '0' + dat.toString();
        }
        if (month < 10) {
            monthText = '0' + month.toString();
        }

        var result = dateText + monthText + year.substring(2);
        return result;
    },
    getISODate: function (date) {
        date.setHours(date.getHours() - 7);
        return date.toISOString();
    },
    formatDdMmYyyyToBalanceISO: function (date) {
        var splitted = date.split("/");
        var rejoined = splitted[2] + "/" + splitted[1] + "/" + splitted[0];
        var formattedDate = new Date(rejoined);
        formattedDate.setHours(formattedDate.getHours() + 7);
        return formattedDate.toISOString();
    },
    cloneObject: function (obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    existElement: function (array, element) {
        result = false;
        for (i = 0; i < array.length; i++) {
            if (array[i] == element) {
                result = true;
                break;
            }
        }
        return result;
    },
    existElement: function (array, element) {
        result = false;
        for (i = 0; i < array.length; i++) {
            if (array[i] == element) {
                result = true;
                break;
            }
        }
        return result;
    }
}


function objectStoreModel(name, key, autoIncrement, indexes) {
    this.name = name;
    this.key = key;
    this.indexes = indexes;
    this.autoIncrement = autoIncrement;
}
function dbIndex(name, unique) {
    this.name = name;
    this.unique = unique;
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
var BaseSynch = {
    call: function (model, type, url, callbackFunction) {
        $.ajax({
            url: url,
            data: model,
            type: type,
            dataType: "json",
            global: false,
            processData: false,
            success: function (data) {
                callbackFunction(data);
            },
            error: function (er) {
                console.log("Lỗi rồi! " + er.message);
            }
        });
    },

    fetchAllWithPaging: function (objectStoreName, model, url, jsonNodeName, process) {
        console.log("fetch all" + objectStoreName);
        model.limit = 200;
        model.page = 1;
        StatisticDb.dao.getByObjectType(objectStoreName, function (data) {
            var modifiedOnMin = null;
            if (data == null || data == undefined) {
                var newStatistic = new statisticObj(objectStoreName, "first");
                StatisticDb.dao.add(newStatistic, function (addedData) {
                    modifiedOnMin = newStatistic.last_fetch;
                    model.modified_on_min = modifiedOnMin;
                    fetchPage(model);
                }, function (error) {
                    console.log(error);
                })
            }
            else {
                modifiedOnMin = data.last_fetch;
                model.modified_on_min = modifiedOnMin;
                fetchPage(model);
            }
        })
        function fetchPage(filter) {
            sendRequest("POST", url, model, function (data) {
                count = data.metadata.total;
                if (data[jsonNodeName] != null && data[jsonNodeName].length > 0) {
                    var objectStore = Database.getObjectStore(objectStoreName, "readwrite");
                    data[jsonNodeName].forEach(function (item) {
                        process(item);
                    })
                }
                if (count > filter.page * filter.limit) {
                    filter.page = filter.page + 1;

                    setTimeout(function () {
                        console.log('fetch ' + objectStoreName + '')
                        fetchPage(filter)

                    }, 1500);
                }
                else {
                    var newstatistic = new statisticObj(objectStoreName, "now");
                    BaseDao.addOrUpdate(StatisticDb.objectStoreName, newstatistic);
                }
            })
        }
    },
    fetchAllWithPagingApi: function (objectStoreName, model, url, jsonNodeName, process) {
        console.log("fetch all" + objectStoreName);
        model.limit = 200;
        updatePerHtml(objectStoreName, 0, 1);
        
        StatisticDb.dao.getByObjectType(objectStoreName, function (data) {
            var modifiedOnMin = null;
            if (data == null || data == undefined) {
                var newStatistic = new statisticObj(objectStoreName, "first");
                model.page = newStatistic.page = 1;
                StatisticDb.dao.add(newStatistic, function (addedData) {
                    modifiedOnMin = newStatistic.last_fetch;
                    model.modified_on_min = modifiedOnMin;
                    
                    fetchPageApi(model);
                }, function (error) {
                    console.log(error);
                })
            }
            else {
                modifiedOnMin = data.last_fetch;
                model.modified_on_min = modifiedOnMin;
                if (data.page != null && data.page != undefined && data.page > 0) {
                    model.page = data.page;
                    fetchPageApi(model);
                } else {
                    model.page = data.page = 1;
                    StatisticDb.dao.update(data, function () {
                        fetchPageApi(model);
                    }, function (error) {
                        console.log(error);
                    })
                }
               
            }
        })
        function fetchPageApi(filter) {
            var urlget = url + "page=" + model.page + "&limit=" + model.limit + "&modified_on_min=" + model.modified_on_min
            sendRequest("GET", urlget, model, function (data) {
                count = data.metadata.total;
                if (data[jsonNodeName] != null && data[jsonNodeName].length > 0) {
                    var objectStore = Database.getObjectStore(objectStoreName, "readwrite");
                    data[jsonNodeName].forEach(function (item) {
                        process(item);
                    })
                }
                console.log('fetch ' + objectStoreName + ' ' + filter.page);
                var totalPage = Math.ceil(count / model.limit);
                console.log('totalPage' + objectStoreName + ' ' + totalPage);
                updatePerHtml(objectStoreName, filter.page, totalPage);
                if (totalPage > filter.page) {
                    setTimeout(function () {
                        filter.page = filter.page + 1;
                        var statistic = new statisticObj(objectStoreName, "now");
                        statistic.page = filter.page;
                        statistic.totalPage = totalPage;
                        statistic.last_fetch = model.modified_on_min;
                        StatisticDb.dao.update(statistic, function () {
                                fetchPageApi(filter)
                            }, function (error) {
                                fetchPageApi(filter)
                        })

                    }, 1500);
                }
                else {
                    var newstatistic = new statisticObj(objectStoreName, "now");
                    newstatistic.page = 1;
                    BaseDao.addOrUpdate(StatisticDb.objectStoreName, newstatistic);
                }
            })
        }
       
    },
    fetchAllWithOutPaging: function (objectStoreName, model, url, process) {
        console.log("fetch all" + objectStoreName);
        sendRequest("POST", url, model, function (data) {
            var objectStore = Database.getObjectStore(objectStoreName, "readwrite");
            data.forEach(function (item) {
                if (objectStore.autoIncrement == true) {
                    var keyPath = objectStore.keyPath;
                    delete item[keyPath];
                }
                process(item);
            });
        })
    },
    fetchAllWithOutPagingApi: function (objectStoreName, model, url, jsonNodeName, process) {
        console.log("fetch all" + objectStoreName);
        updatePerHtml(objectStoreName, 0, 1)

        sendRequest("GET", url, model, function (data) {
            var dataObject = data[jsonNodeName];

            var objectStore = Database.getObjectStore(objectStoreName, "readwrite");
            if (dataObject != null && dataObject.length > 0) {
                dataObject.forEach(function (item,itemIndex) {
                    if (objectStore.autoIncrement == true) {
                        var keyPath = objectStore.keyPath;
                        delete item[keyPath];
                    }
                    process(item);
                    updatePerHtml(objectStoreName, itemIndex+1, dataObject.length);
                });
            }
        })
    },
    fetch: function (objectStoreName, model, url, process) {
        console.log("fetch " + objectStoreName);
        sendRequest("POST", url, model, function (data) {
            var objectStore = Database.getObjectStore(objectStoreName, "readwrite");
            process(data);
        });
    },
    fetchApi: function (objectStoreName, model, url, jsonNodeName, process) {
        console.log("fetch " + objectStoreName);
        updatePerHtml(objectStoreName,0,1)
        sendRequest("GET", url, model, function (data) {
            var dataObject = data[jsonNodeName];
            if (dataObject != null) {
                var objectStore = Database.getObjectStore(objectStoreName, "readwrite");
                process(dataObject);
                updatePerHtml(objectStoreName, 1, 1);
            }

        });
    }
}
async function updatePerHtml(objectStoreName, page, total) {
    if (total != null && total != undefined && total > 0)
        var per = parseFloat(100 * page / total).toFixed(0) + "%";
    else
        var per = "100%";
    var inputName = "perSync-" + objectStoreName;
    var processName = "progress-sync-" + objectStoreName;
    const document = via.document;
    
    document.getElementById(inputName).value = per;
    document.getElementById(processName + "__progress-bar").classList.add("progress-bar-transition");
    document.getElementById(processName + "__progress-bar").style.width = per;
    document.getElementById(processName + "__progress-percentage").innerHTML = per;
    if (per == "100%") {
        var [lengthElement] = await Promise.all([
            get(document.body.getElementsByClassName('checkCompleteSync').length)
        ]);
        var checkComplete = true;
        for (var i = 0; i < lengthElement; i++) {
            var [element] = await Promise.all([
                get(document.body.getElementsByClassName('checkCompleteSync')[i].value)
            ]);
            if (element != "100%") {
                checkComplete = false;
                break;
            }
        }
        if (checkComplete) {
            document.getElementById("ico-sync-offline").classList.remove("fa-spin");
        } else {
            document.getElementById("ico-sync-offline").classList.add("fa-spin");
        }
    }
    else {
        document.getElementById("ico-sync-offline").classList.add("fa-spin");
    }

    //var checkComplete = true;
    ////var elements = await document.body.getElementsByClassName('checkCompleteSync');
    //getJSONAsync().then(function (elements) {
    //    for (const element of elements) {
    //        if (element.value != "100%") {
    //            checkComplete = false;
    //        }
    //    }
    //    if (checkComplete) {
    //        document.getElementById("ico-sync-offline").classList.remove("fa-spin");
    //    } else {
    //        document.getElementById("ico-sync-offline").classList.add("fa-spin");
    //    }
    //    document.getElementById("ico-sync-offline").classList.remove("fa-spin");
    //});
  
}
async function getJSONAsync() {
    var document = via.document;
    // The await keyword saves us from having to write a .then() block.
    let json = await document.body.getElementsByClassName('checkCompleteSync').get();

    // The result of the GET request is available in the json variable.
    // We return it just like in a regular synchronous function.
    return json;
}
var BaseDao = {
    getByKey: function (objectStoreName, key, onsuccess, onerror) {
        var objectStore = Database.getObjectStore(objectStoreName, "readonly");
        if (objectStore == null || objectStore == undefined) {
            setTimeout(function () {
                objectStore = Database.getObjectStore(objectStoreName, "readonly");
            }, 1500);
        }
        var request = objectStore.get(key);
        request.onerror = function (event) {
            console.log("get " + objectStoreName + "by key: " + key + "lỗi zồi");
            onerror(event.target.error);
        }
        request.onsuccess = function (event) {
            onsuccess(event.target.result);
        }
    },
    count: function (objectStoreName, onsuccess, onerror) {
        var objectStore = Database.getObjectStore(objectStoreName, "readonly");
        var request = objectStore.count();
        request.onsuccess = function () {
            onsuccess(request.result);
        }
    },
    getAll: function (objectStoreName, onsuccess, onerror) {
        var objectStore = Database.getObjectStore(objectStoreName, "readwrite");
        var request = objectStore.getAll();
        request.onerror = function (event) {
            console.log("get all" + objectStoreName + "lỗi rồi");
            onerror(event.target.error);
        }
        request.onsuccess = function (event) {
            onsuccess(event.target.result);
        }
    },
    getByIndex: function (objectStoreName, indexName, indexValue, onsuccess, onerror) {
        var objectStore = Database.getObjectStore(objectStoreName, "readonly");
        var index = objectStore.index(indexName);
        index.get(indexValue).onsuccess = function (event) {
            onsuccess(event.target.result);
        }
        index.get(indexValue).onerror = function (event) {
            onerror(event.target.error);
        }
    },
    getByRangeIndex: function (objectStoreName, indexName, lowerIndexValue, upperIndexValue, onsuccess, onerror) {
        var objectStore = Database.getObjectStore(objectStoreName, "readonly");
        var index = objectStore.index(indexName);
        var req = index.openCursor(IDBKeyRange.bound(lowerIndexValue, upperIndexValue));
        var result = new Array();
        req.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                result.push(cursor.value);
                cursor.continue();
            }
            else {
                onsuccess(result);
            }
        }
        req.onerror = function (event) {

        }
    },
    add: function (objectStoreName, model, onsuccess, onerror) {
        var objectStore = Database.getObjectStore(objectStoreName, "readwrite");
        var request = objectStore.add(model);
        if (onsuccess != undefined)
            request.onsuccess = function (event) {
                console.log("Add" + objectStoreName)
                onsuccess(event.target.result);
            }
        if (onerror != undefined)
            request.onerror = function (event) {
                onerror(event.target.error);
            }
    },
    update: function (objectStoreName, model, onsuccess, onerror) {
        var objectStore = Database.getObjectStore(objectStoreName, "readwrite");
        var request = objectStore.put(model);
        if (onsuccess != undefined)
            request.onsuccess = function (event) {
                onsuccess(event.target.result);
            }
        request.onerror = function (error) {
            console.log("update " + objectStoreName + "_" + model.id + " bị lỗi rồi");
            if (onerror != undefined) {
                onerror()
            }
        }
    },
    addOrUpdate: function (objectStoreName, model, onsuccess, onerror) {
        var objectStore = Database.getObjectStore(objectStoreName, "readwrite");
        var keyPath = objectStore.keyPath;
        if (model[keyPath] == null)
            BaseDao.add(objectStoreName, model,
                function (data) {
                    if (onsuccess != undefined)
                        onsuccess(data)
                },
                function (data) {
                    if (onerror != undefined)
                        onerror(data)
                }
            );
        else
            BaseDao.update(objectStoreName, model,
                function (data) {
                    if (onsuccess != undefined)
                        onsuccess(data)
                },
                function (data) {
                    if (onerror != undefined)
                        onerror(data)
                });
    },
    clear: function (objectStoreName, onsuccess, onerror) {
        var objectStore = Database.getObjectStore(objectStoreName, "readwrite");
        var request = objectStore.clear();
        request.onsuccess = function () {
            onsuccess();
        }
        if (onerror != undefined)
            request.onerror = function () {
                onerror();
            }
    },
    delete: function (objectStoreName, key, onsuccess, onerror) {
        console.log("Xóa order có local_id= " + key);
        var objectStore = Database.getObjectStore(objectStoreName, "readwrite");
        var request = objectStore.delete(key);
        request.onsuccess = function () {
            if (onsuccess != undefined)
                onsuccess();
        }
        request.onerror = function () {
            if (onerror != undefined)
                onerror();
        }
    },
    like: function (objectStoreName, keyPath, term, onsuccess, onerror) {
        var result = [];
        var objectStore = Database.getObjectStore(objectStoreName, "readwrite");
        var index = objectStore.index(keyPath);
        //var keyRange = IDBKeyRange.only("\uffff" + term + "\uffff");
        var request = index.openCursor();
        var reg = new RegExp(term);
        request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (reg.test(cursor.value[keyPath]))
                    result.push(cursor.value);
                cursor.continue();
            }
            else {
                onsuccess(result);
            }
        }
    },
    multiLike: function (objectStoreName, keyPaths, term, onsuccess, onerror) {
        var result = [];
        var reg = new RegExp(term);
        BaseDao.getAll(objectStoreName, function (data) {
            for (i = data.length - 1; i >= 0; i--) {
                var element = data[i];
                var match = false;
                for (j = 0; j < keyPaths.length; j++) {
                    var keyPath = keyPaths[j];
                    var text = element[keyPath];
                    //console.log("match " + text + " with " + term + ": " + reg.test(text));
                    if (reg.test(text)) {
                        match = true;
                        break;
                    }
                }
                if (!match)
                    continue;
                else
                    result.push(element);
            }
            onsuccess(result);
        })
    }
}

var StatisticDb = {
    objectStoreName: "Statistic",
    dao: {
        add: function (model, onsuccess, onerror) {
            BaseDao.add(StatisticDb.objectStoreName, model, onsuccess, onerror);
        },
        update: function (model, onsuccess, onerror) {
            BaseDao.update(StatisticDb.objectStoreName, model, onsuccess, onerror);
        },
        getByObjectType: function (objectType, onsuccess, onerror) {
            BaseDao.getByKey(StatisticDb.objectStoreName, objectType, onsuccess, onerror);
        },
        getAll: function (onsuccess) {
            BaseDao.getAll(StatisticDb.objectStoreName, function (data) { onsuccess(data) });
        },
    }
}


var Tenant = {
    objectStoreName: "Tenants",
    synch: {
        fetch: function () {
            BaseSynch.fetchApi(Tenant.objectStoreName, null, "/admin/tenant.json", "tenant", Tenant.dao.addOrUpdate)
            //BaseSynch.fetch(Tenant.objectStoreName, null, "/admin/offline_orders/GetTenant?", Tenant.dao.addOrUpdate)
        },
        firstFetch: function () {
            BaseDao.count(Tenant.objectStoreName, function (count) {
                if (count == 0)
                    Tenant.synch.fetch();
            })
        }
    },
    dao: {
        getById: function (id, onsuccess) {
            BaseDao.getByKey(Tenant.objectStoreName, key, function (data) { onsuccess(data) });
        },
        addOrUpdate: function (model, onsuccess, onerror) {
            BaseDao.addOrUpdate(Tenant.objectStoreName, model, onsuccess);
        }
    }
}

var TenantSetting = {
    objectStoreName: "TenantSettings",
    synch: {
        fetch: function () {
            BaseSynch.fetchApi(TenantSetting.objectStoreName, null, "/admin/settings.json?", "tenant_setting", TenantSetting.dao.addOrUpdate)
            //BaseSynch.fetch(TenantSetting.objectStoreName, null, "/admin/offline_orders/GetTenantSetting?", TenantSetting.dao.addOrUpdate)
        },
        firstFetch: function () {
            BaseDao.count(TenantSetting.objectStoreName, function (count) {
                if (count == 0)
                    TenantSetting.synch.fetch();
            })
        }
    },
    dao: {
        getByTenantId: function (tenantId, onsuccess) {
            BaseDao.getByIndex(TenantSetting.objectStoreName, "tenant_id", tenantId, function (data) { onsuccess(data) });
        },
        addOrUpdate: function (model, onsuccess, onerror) {
            BaseDao.addOrUpdate(TenantSetting.objectStoreName, model, onsuccess, onerror);
        }
    }
}

var Country = {
    objectStoreName: "Countries",
    synch: {
        fetch: function () {
            BaseDao.count(Country.objectStoreName, function (total) {
                if (total == 206) {
                    updatePerHtml(Country.objectStoreName, 1, 1);
                }
                else {
                    BaseSynch.fetchAllWithOutPagingApi(Country.objectStoreName, null, "/admin/countries.json?", "countries", Country.dao.add)
                    //BaseSynch.fetchAllWithOutPaging(Country.objectStoreName, null, "/admin/offline_orders/GetCountries?", Country.dao.add)
                }
            })
        }
    },
    dao: {
        getById: function (id, onsuccess) {
            BaseDao.getByKey(Country.objectStoreName, key, function (data) { onsuccess(data) });
        },
        getAll: function (onsuccess) {
            BaseDao.getAll(Country.objectStoreName, function (data) { onsuccess(data) });
        },
        addOrUpdate: function (model, onsuccess, onerror) {
            BaseDao.addOrUpdate(Country.objectStoreName, model, onsuccess, onerror);
        },
        add: function (model, onsuccess, onerror) {
            BaseDao.add(Country.objectStoreName, model, onsuccess, onerror);
        }
    }
}

var City = {
    objectStoreName: "Cities",
    synch: {
        fetch: function () {
            BaseDao.count(City.objectStoreName, function (total) {
                if (total == 63) {
                    updatePerHtml(City.objectStoreName, 1, 1);
                }
                else
                    BaseSynch.fetchAllWithOutPagingApi(City.objectStoreName, null, "/admin/cities.json?", "cities", City.dao.add);
                //BaseSynch.fetchAllWithOutPaging(City.objectStoreName, null, "/admin/offline_orders/GetCities?", City.dao.add);
            })

        }
    },
    dao: {
        getById: function (id, onsuccess) {
            BaseDao.getByKey(City.objectStoreName, key, function (data) { onsuccess(data) });
        },
        getAll: function (onsuccess) {
            BaseDao.getAll(City.objectStoreName, function (data) { onsuccess(data) });
        },
        getByCountryId: function (countryId, onsuccess) {
            BaseDao.getByIndex(City.objectStoreName, "country_id", countryId, function (data) { onsuccess(data) });
        },
        addOrUpdate: function (model, onsuccess, onerror) {
            BaseDao.addOrUpdate(City.objectStoreName, model, onsuccess, onerror);
        },
        add: function (model, onsuccess, onerror) {
            BaseDao.add(City.objectStoreName, model, onsuccess, onerror);
        }
    }

}

var District = {
    objectStoreName: "Districts",
    synch: {
        fetch: function () {
            BaseDao.count(District.objectStoreName, function (total) {
                if (total == 714) {
                    updatePerHtml(District.objectStoreName, 1, 1);
                }
                else
                    BaseSynch.fetchAllWithOutPagingApi(District.objectStoreName, null, "/admin/districts.json?", "districts", District.dao.add);
                //BaseSynch.fetchAllWithOutPaging(District.objectStoreName, null, "/admin/offline_orders/GetDistricts?", District.dao.add);
            })
        }
    },
    dao: {
        getById: function (id, onsuccess) {
            BaseDao.getByKey(District.objectStoreName, key, function (data) { onsuccess(data) });
        },
        getAll: function (onsuccess) {
            BaseDao.getAll(District.objectStoreName, function (data) { onsuccess(data) });
        },
        getByCityId: function (cityId, onsuccess) {
            BaseDao.getByIndex(District.objectStoreName, "city_id", cityId, function (data) { onsuccess(data) });
        },
        addOrUpdate: function (model, onsuccess, onerror) {
            BaseDao.addOrUpdate(District.objectStoreName, model, onsuccess, onerror);
        },
        add: function (model, onsuccess, onerror) {
            BaseDao.add(District.objectStoreName, model, onsuccess, onerror);
        }
    }
}

var Location = {
    objectStoreName: "Locations",
    synch: {
        fetch: function () {
            BaseSynch.fetchAllWithOutPagingApi(Location.objectStoreName, null, "/admin/locations.json?", "locations", Location.dao.addOrUpdate)
            //BaseSynch.fetchAllWithOutPaging(Location.objectStoreName, null, "/admin/offline_orders/GetLocations?", Location.dao.addOrUpdate)
        },
        firstFetch: function () {
            BaseDao.count(Location.objectStoreName, function (count) {
                if (count == 0)
                    Location.synch.fetch();
            })
        }
    },
    dao: {
        getById: function (id, onsuccess) {
            BaseDao.getByKey(Location.objectStoreName, key, function (data) { onsuccess(data) });
        },
        getAll: function (onsuccess) {
            BaseDao.getAll(Location.objectStoreName, function (data) { onsuccess(data) });
        },
        addOrUpdate: function (model, onsuccess, onerror) {
            BaseDao.addOrUpdate(Location.objectStoreName, model, onsuccess, onerror);
        }
    }
}

var PrintForm = {
    objectStoreName: "PrintForms",
    synch: {
        fetch: function () {
            BaseDao.clear(PrintForm.objectStoreName, function () {
                BaseSynch.fetchAllWithOutPagingApi(PrintForm.objectStoreName, null, "/admin/print_forms/all.json?", "print_forms", PrintForm.dao.add);
                //BaseSynch.fetchAllWithOutPaging(PrintForm.objectStoreName, null, "/admin/offline_orders/GetPrintForms?", PrintForm.dao.add);
            })
            //sendRequest("POST", "/admin/offline_orders/GetPrintForms?", null,
            //    function (printForms) {
            //        if (printForms == null || !(printForms instanceof Array)) {

            //        }
            //        else {
            //            PrintForm.dao.getAll(function (existPrintforms) {
            //                var matchIndex = new Array();
            //                for (j = 0; j < existPrintforms.length; j++) {
            //                    var existPrintform = existPrintforms[j];
            //                    var match = false;
            //                    var matchPrintForm;

            //                    for (i = 0; i < printForms.length; i++) {
            //                        var printForm = printForms[i];
            //                        if(printForm.location_id == existPrintform.location_id
            //                            && printForm.type == existPrintform.type
            //                            && printForm.size == existPrintform.size) {
            //                            match = true;
            //                            matchIndex.push(i);
            //                            printForm.id = existPrintform.id;
            //                            matchPrintForm = printForm;
            //                        }
            //                    }
            //                    if (match) {
            //                        BaseDao.update(PrintForm.objectStoreName, matchPrintForm);
            //                    }
            //                }
            //                for (i = 0; i < printForms.length; i++) {
            //                    if (!OfflineUtils.existElement(matchIndex, i))
            //                        BaseDao.add(PrintForm.objectStoreName, printForms[i]);
            //                }
            //})

            //        }
            //    },
            //    function (error) {
            //        console.log("fetch printforms from server, error: ");
            //        console.log(error);
            //    }                   
            //)
        },
        firstFetch: function () {
            BaseDao.count(PrintForm.objectStoreName, function (count) {
                if (count == 0)
                    PrintForm.synch.fetch();
            })
        }
    },
    dao: {
        add: function (model, onsuccess, onerror) {
            BaseDao.add(PrintForm.objectStoreName, model, onsuccess, onerror);
        },
        getAll: function (onsuccess) {
            BaseDao.getAll(PrintForm.objectStoreName, function (data) { onsuccess(data) });
        }
    }

}


var Account = {
    objectStoreName: "Accounts",
    synch: {
        fetch: function (tenantId) {
            BaseSynch.fetchAllWithPagingApi(Account.objectStoreName, new Object(), "/admin/accounts.json?", "accounts", Account.dao.addOrUpdate)
            //BaseSynch.fetchAllWithPaging(Account.objectStoreName, new Object(), "/admin/offline_orders/GetAccounts?", "accounts", Account.dao.addOrUpdate)
        },
        firstFetch: function () {
            BaseDao.count(Account.objectStoreName, function (count) {
                if (count == 0)
                    Account.synch.fetch();
            })
        }
    },
    dao: {
        getById: function (id, onsuccess) {
            BaseDao.getByKey(Account.objectStoreName, key, function (data) { onsuccess(data) });
        },
        getAll: function (onsuccess) {
            BaseDao.getAll(Account.objectStoreName, function (data) { onsuccess(data) });
        },
        addOrUpdate: function (model, onsuccess, onerror) {
            BaseDao.addOrUpdate(Account.objectStoreName, model, onsuccess, onerror);
        }
    }
}

function statisticObj(object_type, last_fetch) {
    this.object_type = object_type;
    if (last_fetch == "now") {
        var now = new Date();
        //now.setHours(now.getHours() + 7);
        now.setHours(now.getHours());
        now.setMinutes(0, 0, 0);
        if (object_type == "Accounts" || object_type == "PaymentMethods"
            || object_type == "PriceLists" || object_type == "TaxTypes") {
            now.setDate(now.getDate())
        }
        this.last_fetch = now.toISOString();
    }
    else {
        this.last_fetch = new Date(1990, 1, 1).toISOString();
    }
}

var Product = {
    objectStoreName: "Products",
    synch: {
        fetch: function () {
            BaseSynch.fetchAllWithPagingApi(Product.objectStoreName, new Object(), "/admin/products.json?", "products", Product.dao.addOrUpdate)
            //BaseSynch.fetchAllWithPaging(Product.objectStoreName, new Object(), "/admin/offline_orders/GetProducts?", "products", Product.dao.addOrUpdate)
        },
        firstFetch: function () {
            BaseDao.count(Product.objectStoreName, function (count) {
                if (count == 0)
                    Product.synch.fetch();
            })
        }
    },
    dao: {
        getById: function (id, onsuccess) {
            BaseDao.getByKey(Product.objectStoreName, key, function (data) { onsuccess(data) });
        },
        getAll: function (onsuccess) {
            BaseDao.getAll(Product.objectStoreName, function (data) { onsuccess(data) });
        },
        addOrUpdate: function (model, onsuccess, onerror) {
            BaseDao.addOrUpdate(Product.objectStoreName, model, onsuccess, onerror);
        }
    }
}

var Variant = {
    objectStoreName: "Variants",
    synch: {
        fetch: function (tenantId) {
            //BaseSynch.fetchAllWithPaging(Variant.objectStoreName, new Object(), "/admin/offline_orders/GetVariants?", "variants", Variant.dao.addOrUpdate)
            BaseSynch.fetchAllWithPagingApi(Variant.objectStoreName, new Object(), "/admin/variants.json?status=deleted,active,inactive&", "variants", Variant.dao.addOrUpdate)
        },
        firstFetch: function () {
            BaseDao.count(Variant.objectStoreName, function (count) {
                if (count == 0)
                    Variant.synch.fetch();
            })
        }
    },
    dao: {
        getById: function (id, onsuccess) {
            BaseDao.getByKey(Variant.objectStoreName, id, function (data) { onsuccess(data) });
        },
        getAll: function (onsuccess) {
            BaseDao.getAll(Variant.objectStoreName, function (data) { onsuccess(data) });
        },
        getByFilter: function (filter, onsuccess, onerror) {
            //BaseDao.getAll(Variant.objectStoreName, function (data) {
            //    var result = data.filter(function (element) {
            //        return (
            //            (element.name != null && element.name.indexOf(filter.term) >= 0)
            //            || (element.product_name != null && element.product_name.indexOf(filter.term) >= 0)
            //            || (element.sku != null && element.sku.indexOf(filter.term) >= 0)
            //            || (element.barcode != null && element.barcode.indexOf(filter.term) >= 0)
            //        );
            //    });
            //    onsuccess(result);
            //});
            if (filter.term == undefined || filter.term == null || filter.term == "") {
                BaseDao.getAll(Variant.objectStoreName, function (data) {
                    var preResult = data.map(function (element) {
                        if (element.status == "active" && element.sellable == true)
                            return element;
                    })

                    preResult = preResult.filter(item => item !== undefined && item != null);
                    var result = new Array();
                    for (var i = preResult.length - 1; i >= 0; i--) { result.push(preResult[i]) }
                    onsuccess(result);
                })

            }
            else {
                BaseDao.multiLike(Variant.objectStoreName, ["name", "product_name", "barcode", "sku"], filter.term, function (data) {
                    var result = data.map(function (element) {
                        if (element.status == "active" && element.sellable == true)
                            return element;
                    })
                    result = result.filter(item => item !== undefined && item != null);
                    onsuccess(result);
                })
            }
        },
        getByBarcode: function (filter, onsuccess, onerror) {
            BaseDao.getAll(Variant.objectStoreName, function (data) {
                var result = data.filter(function (element) {
                    return (
                        (element.barcode != null && element.barcode == filter.term)
                    );
                });
                onsuccess(result);
            });
        },
        getByPacksizeRootId: function (id, onsuccess, onerror) {
            BaseDao.getAll(Variant.objectStoreName, function (data) {
                var result = data.filter(function (element) {
                    return (
                        (element.packsize_root_id != null && element.packsize_root_id == id && element.packsize == true)
                    );
                });
                onsuccess(result);
            });
        },
        getByCategoryIdsTopSale: function (filter, onsuccess, onerror) {
            if (filter.page == undefined)
                filter.page = 1;
            if (filter.limit == undefined)
                filter.limit = 10;
            if (filter.categoryIds != "" && filter.categoryIds != null) {

            }
            BaseDao.getAll(Variant.objectStoreName, function (data) {
                var preResult = new Array();
                if (filter.checktop == "true") {
                    BaseDao.getAll(TopSaleVariants.objectStoreName, function (dataTopSale) {
                        var curResult = new Array();
                        if (data != null && data.length > 0) {
                            for (i = data.length - 1; i >= 0; i--) {
                                var element = data[i];
                                if (filter.categoryIds == null || filter.categoryIds == ""
                                    || (filter.categoryIds != "" && filter.categoryIds == null && CheckIsCategory(element)))
                                    curResult.push(element);
                            }
                        }
                        if (curResult != null && curResult.length > 0
                            && dataTopSale != null && dataTopSale.length > 0) {
                            for (var i = 0; i < curResult.length; i++) {
                                for (var j = 0; j < dataTopSale.length; j++) {
                                    if (CheckIsCategory(dataTopSale[j])) {
                                        if (dataTopSale[j].variant_id == curResult[i].id) preResult.push(curResult[i]);
                                    }
                                }
                            }
                        }

                        var variants = preResult.slice((filter.page - 1) * filter.limit, (filter.page + 1) * filter.limit)
                        var result = { variants: variants, count: preResult.length }
                        onsuccess(result);
                    });
                } else {
                    if (data != null && data.length > 0) {
                        for (i = data.length - 1; i >= 0; i--) {
                            var element = data[i];
                            if (filter.categoryIds == null || filter.categoryIds == ""
                                || (filter.categoryIds != "" && filter.categoryIds == null && CheckIsCategory(element)))
                                preResult.push(element);
                        }
                    }
                    var variants = preResult.slice((filter.page - 1) * filter.limit, (filter.page + 1) * filter.limit)
                    var result = { variants: variants, count: preResult.length }
                    onsuccess(result);
                }
            });
        },
        addOrUpdate: function (model, onsuccess, onerror) {
            BaseDao.addOrUpdate(Variant.objectStoreName, model, onsuccess, onerror);
        }
    }
}

function CheckIsCategory(ids, variant) {
    return true;
}

//var TopSaleVariants = {
//    objectStoreName: "TopSaleVariants",
//    synch: {
//        fetch: function (tenantId) {
//            BaseDao.clear(TopSaleVariants.objectStoreName, function () {
//                BaseSynch.fetchAllWithPaging(TopSaleVariants.objectStoreName, new Object(), "/admin/offline_orders/GetTopSaleVariants?", "items", TopSaleVariants.dao.add)
//            })
//        },
//        firstFetch: function () {
//            BaseDao.count(TopSaleVariants.objectStoreName, function (count) {
//                if (count == 0)
//                    TopSaleVariants.synch.fetch();
//            })
//        }
//    },
//    dao: {
//        getById: function (id, onsuccess) {
//            BaseDao.getByKey(Variant.objectStoreName, key, function (data) { onsuccess(data) });
//        },
//        count: function (onsuccess) {
//            BaseDao.count(TopSaleVariants.objectStoreName, onsuccess);
//        },
//        getByFilter: function (filter, onsuccess, onerror) {
//            BaseDao.getAll(Variant.objectStoreName, function (data) {
//                var preResult = new Array();
//                if (data != null && data.length > 0) {
//                    for (i = 0; i < data.length; i++) {
//                        var element = data[i];
//                        if (
//                            (element.name != null && element.name.indexOf(filter.term) >= 0)
//                            || (element.product_name != null && element.product_name.indexOf(filter.term) >= 0)
//                            || (element.sku != null && element.sku.indexOf(filter.term) >= 0)
//                            || (element.barcode != null && element.barcode.indexOf(filter.term) >= 0)
//                        )
//                            preResult.push(element);
//                    }
//                }
//                var result = preResult.slice((filter.page - 1) * filter.limit, filter.page * filter.limit - 1)

//                onsuccess(result);
//            });
//        },
//        add: function (model, onsuccess, onerror) {
//            BaseDao.add(TopSaleVariants.objectStoreName, model, onsuccess, onerror);
//        }
//    }
//}

var PriceList = {
    objectStoreName: "PriceLists",
    synch: {
        fetch: function (tenantId) {
            BaseSynch.fetchAllWithPagingApi(PriceList.objectStoreName, new Object(), "/admin/price_lists.json?", "price_lists", PriceList.dao.addOrUpdate)
            //BaseSynch.fetchAllWithPaging(PriceList.objectStoreName, new Object(), "/admin/offline_orders/GetPriceLists?", "price_lists", PriceList.dao.addOrUpdate)
        },
        firstFetch: function () {
            BaseDao.count(PriceList.objectStoreName, function (count) {
                if (count == 0)
                    PriceList.synch.fetch();
            })
        }
    },
    dao: {
        getById: function (id, onsuccess) {
            BaseDao.getByKey(PriceList.objectStoreName, key, function (data) { onsuccess(data) });
        },
        getAll: function (onsuccess) {
            BaseDao.getAll(PriceList.objectStoreName, function (data) { onsuccess(data) });
        },
        addOrUpdate: function (model, onsuccess, onerror) {
            BaseDao.addOrUpdate(PriceList.objectStoreName, model, onsuccess, onerror);
        }
    }
}

var TaxType = {
    objectStoreName: "TaxTypes",
    synch: {
        fetch: function (tenantId) {
            BaseSynch.fetchAllWithPagingApi(TaxType.objectStoreName, new Object(), "/admin/tax_types.json?", "tax_types", TaxType.dao.addOrUpdate)
            //BaseSynch.fetchAllWithPaging(TaxType.objectStoreName, new Object(), "/admin/offline_orders/GetTaxTypes?", "tax_types", TaxType.dao.addOrUpdate)
        },
        firstFetch: function () {
            BaseDao.count(TaxType.objectStoreName, function (count) {
                if (count == 0)
                    TaxType.synch.fetch();
            })
        }
    },
    dao: {
        getById: function (id, onsuccess) {
            BaseDao.getByKey(TaxType.objectStoreName, key, function (data) { onsuccess(data) });
        },
        getAll: function (onsuccess) {
            BaseDao.getAll(TaxType.objectStoreName, function (data) { onsuccess(data) });
        },
        addOrUpdate: function (model, onsuccess, onerror) {
            BaseDao.addOrUpdate(TaxType.objectStoreName, model, onsuccess, onerror);
        }
    }
}

var PaymentMethod = {
    objectStoreName: "PaymentMethods",
    synch: {
        fetch: function (tenantId) {
            BaseSynch.fetchAllWithPagingApi(PaymentMethod.objectStoreName, new Object(), "/admin/payment_methods.json?", "payment_methods", PaymentMethod.dao.addOrUpdate)
            //BaseSynch.fetchAllWithPaging(PaymentMethod.objectStoreName, new Object(), "/admin/offline_orders/GetPaymentMethods?", "payment_methods", PaymentMethod.dao.addOrUpdate)
        },
        firstFetch: function () {
            BaseDao.count(PaymentMethod.objectStoreName, function (count) {
                if (count == 0)
                    PaymentMethod.synch.fetch();
            })
        }

    },
    dao: {
        getById: function (id, onsuccess) {
            BaseDao.getByKey(PaymentMethod.objectStoreName, id, function (data) { onsuccess(data) });
        },
        getAll: function (onsuccess) {
            BaseDao.getAll(PaymentMethod.objectStoreName, function (data) { onsuccess(data) });
        },
        addOrUpdate: function (model, onsuccess, onerror) {
            BaseDao.addOrUpdate(PaymentMethod.objectStoreName, model, onsuccess, onerror);
        }
    }
}
var Category = {
    objectStoreName: "Categories",
    synch: {
        fetch: function (tenantId) {
            BaseSynch.fetchAllWithPagingApi(Category.objectStoreName, new Object(), "/admin/categories.json?", "categories", Category.dao.addOrUpdate)
        },
        firstFetch: function () {
            BaseDao.count(Category.objectStoreName, function (count) {
                if (count == 0)
                    Category.synch.fetch();
            })
        }

    },
    dao: {
        getById: function (id, onsuccess) {
            BaseDao.getByKey(Category.objectStoreName, id, function (data) { onsuccess(data) });
        },
        getAll: function (onsuccess) {
            BaseDao.getAll(Category.objectStoreName, function (data) { onsuccess(data) });
        },
        addOrUpdate: function (model, onsuccess, onerror) {
            BaseDao.addOrUpdate(Category.objectStoreName, model, onsuccess, onerror);
        }
    }
}
var Brand = {
    objectStoreName: "Brands",
    synch: {
        fetch: function (tenantId) {
            BaseSynch.fetchAllWithPagingApi(Brand.objectStoreName, new Object(), "/admin/brands.json?", "brands", Brand.dao.addOrUpdate)
        },
        firstFetch: function () {
            BaseDao.count(Brand.objectStoreName, function (count) {
                if (count == 0)
                    Brand.synch.fetch();
            })
        }

    },
    dao: {
        getById: function (id, onsuccess) {
            BaseDao.getByKey(Brand.objectStoreName, id, function (data) { onsuccess(data) });
        },
        getAll: function (onsuccess) {
            BaseDao.getAll(Brand.objectStoreName, function (data) { onsuccess(data) });
        },
        addOrUpdate: function (model, onsuccess, onerror) {
            BaseDao.addOrUpdate(Brand.objectStoreName, model, onsuccess, onerror);
        }
    }
}
//var ManualListVariant = {
//    objectStoreName: "ManualListVariant",
//    synch: {
//        fetch: function (tenantId) {
//            BaseSynch.fetchAllWithPaging(ManualListVariant.objectStoreName, new Object(), "/admin/offline_orders/GetManualListVariant?", "variants", ManualListVariant.dao.addOrUpdate)
//        },
//        firstFetch: function () {
//            BaseDao.count(ManualListVariant.objectStoreName, function (count) {
//                if (count == 0)
//                    ManualListVariant.synch.fetch();
//            })
//        }

//    },
//    dao: {
//        getById: function (id, onsuccess) {
//            BaseDao.getByKey(ManualListVariant.objectStoreName, key, function (data) { onsuccess(data) });
//        },
//        getAll: function (onsuccess) {
//            BaseDao.getAll(ManualListVariant.objectStoreName, function (data) { onsuccess(data) });
//        },
//        addOrUpdate: function (model, onsuccess, onerror) {
//            BaseDao.addOrUpdate(ManualListVariant.objectStoreName, model, onsuccess, onerror);
//        }
//    }
//}


var CustomerGroup = {
    objectStoreName: "CustomerGroups",
    synch: {
        fetch: function () {
            BaseSynch.fetchAllWithPagingApi(CustomerGroup.objectStoreName, new Object(), "/admin/customer_groups.json?", "customer_groups", CustomerGroup.dao.add)
            //BaseSynch.fetchAllWithPaging(CustomerGroup.objectStoreName, new Object(), "/admin/offline_orders/GetCustomerGroups?", "customer_groups", CustomerGroup.dao.add)
        },
        firstFetch: function () {
            BaseDao.count(CustomerGroup.objectStoreName, function (count) {
                if (count == 0)
                    CustomerGroup.synch.fetch();
            })
        }
    },
    dao: {
        add: function (model) {
            BaseDao.add(CustomerGroup.objectStoreName, model)
        },
        getAll: function (onsuccess) {
            BaseDao.getAll(CustomerGroup.objectStoreName, function (data) {
                if (onsuccess != undefined)
                    onsuccess(data);
            })
        }
    }
}

var Customer = {
    objectStoreName: "Customers",
    synch: {
        fetch: function () {
            BaseSynch.fetchAllWithPagingApi(Customer.objectStoreName, new Object(), "/admin/customers.json?statuses=deleted,active,disable&", "customers", Customer.repository.store)
            //BaseSynch.fetchAllWithPaging(Customer.objectStoreName, new Object(), "/admin/offline_orders/GetCustomers?", "customers", Customer.repository.store)
        },
        firstFetch: function () {
            BaseDao.count(Customer.objectStoreName, function (count) {
                if (count == 0)
                    Customer.synch.fetch();
            })
        },
        post: function (model, onsuccess, onerror) {
            sendRequest("POST", "/admin/offline_orders/AddCustomer", model, function (data) {
                if (data.id > 0) {
                    data.local_id = model.local_id;
                    data.synch_status = "completed";
                    //Customer.repository.store(data);
                    //if (onsuccess != undefined)
                    //    onsuccess();
                    BaseDao.update(Customer.objectStoreName,
                        data,
                        function () {
                            if (onsuccess != undefined)
                                onsuccess();
                        })
                }
                else {
                    model.synch_status = "failed";
                    model.error = "Có lỗi xảy ra";
                    //Customer.repository.store(model);
                    //if (onerror != undefined)
                    //    onerror();
                    BaseDao.update(Customer.objectStoreName,
                        model,
                        function () {
                            if (onerror != undefined)
                                onerror();
                        })
                }
            }, function (er) {
                model.synch_status = "failed";
                if (er.detail != null && er.detail != undefined) {
                    model.error = er.detail.replace(/\n/g, '; ').replace(/;|$|{|}|\|"|"/g, '');
                }
                else {
                    model.error = JSON.stringify(er);
                }
                if (model.error.length > 500) {
                    model.error = "Hệ thống đang nâng cấp"
                }
                if (model.error != null && model.error != undefined) {
                    model.error.substring(0, 250)
                }
                
                Customer.repository.store(model);
                if (onerror != undefined)
                    onerror();
            });
        },
        flow: function () {
            loopPushCustomer();
            //BaseDao.getAll(Customer.objectStoreName, function (data) {
            //    var filter = data.filter(item => item.synch_status == "waiting");
            //    if (filter.length > 0) {
            //        loopPushCustomer();
            //    }
            //    //for (i = 0; i < data.length; i++) {
            //    //    var item = data[i];
            //    //    if (item.id == 0 && item.synch_status == "waiting") {
            //    //        item.groupName = item.group_name;
            //    //        item.phoneNumber = item.phone_number;
            //    //       Customer.synch.post(item);
            //    //    }
            //    //}
            //})
        }
    },
    dao: {
        getById: function (id, onsuccess) {
            BaseDao.getByKey(Customer.objectStoreName, id, function (data) {
                if (onsuccess != undefined)
                    onsuccess(data)
            });
        },
        getAll: function (onsuccess) {
            BaseDao.getAll(Customer.objectStoreName, function (data) { onsuccess(data) });
        },
        getByFilter: function (filter, onsuccess, onerror) {
            //BaseDao.getAll(Customer.objectStoreName, function (data) {
            //    console.log("all:" + data.length);
            //    var result = data.filter(function (element) {
            //        return (
            //            (element.name != null && element.name.indexOf(filter.term) >= 0)
            //            || (element.code != null && element.code.indexOf(filter.term) >= 0)
            //            || (element.email != null && element.email.indexOf(filter.term) >= 0)
            //            || (element.phone_number != null && element.phone_number.indexOf(filter.term) >= 0)
            //            || (typeof (element.tags) === "array" && element.tags != null && element.tags.contains(filter.term))
            //        );
            //    });
            //    onsuccess(result);
            //});
            if (filter.term == null || filter.term == undefined || filter.term == "") {
                BaseDao.getAll(Customer.objectStoreName, function (data) {
                    var result = data.map(function (element) {
                        if (element.status == "active" || element.id == undefined || element.id == null || element.id == 0)
                            return element;
                    })
                    result = result.filter(item => item !== undefined && item != null);
                    onsuccess(result);
                })
            }
            else {
                BaseDao.multiLike(Customer.objectStoreName, ["name", "code", "email", "phone_number"], filter.term, function (data) {
                    var result = data.map(function (element) {
                        if (element.status == "active" || element.id == 0)
                            return element;
                    })
                    result = result.filter(item => item !== undefined && item != null);
                    onsuccess(result);
                })
            }

        },
        generateCode: function (onsuccess) {
            BaseDao.count(Customer.objectStoreName, function (data) {
                var result = "CUSF" + OfflineUtils.getDateTextForCode() + data.toString();
                onsuccess(result);
            })
        },
        addOrUpdate: function (model, onsuccess, onerror) {
            BaseDao.addOrUpdate(Customer.objectStoreName, model, onsuccess, onerror);
        },
        add: function (model, onsuccess, onerror) {
            if (model.dob != null && model.dob != undefined && model.dob != "") {
                model.dob = OfflineUtils.formatDdMmYyyyToBalanceISO(model.dob);
            }

            model.synch_status = "waiting";
            BaseDao.add(Customer.objectStoreName, model, onsuccess, onerror);
        },
        getById: function (id, onsuccess, onerror) {
            BaseDao.getByIndex(Customer.objectStoreName, "id", id, onsuccess, onerror);
        },
        update: function (localId, model, onsuccess) {
            model.local_id = localId;
            Customer.repository.store(model);
        }
    },
    repository: {
        store: function (model1, onsuccess, onerror) {
            var model = JSON.parse(JSON.stringify(model1));
            if (model.phone_number != undefined && model.phone_number != null
                && (model.local_id == undefined || model.local_id == null)
                && (model.id == undefined || model.id == null || model.id == 0)) {
                BaseDao.getByIndex(Customer.objectStoreName, "phone_number", model.phone_number, function (data) {
                    if (data != null && data != undefined) {
                        if (onerror != undefined)
                            onerror("Số điện thoại của khách hàng đã tồn tại");
                        else {
                            console.log("Số điện thoại của khách hàng đã tồn tại");
                        }
                    }
                    else {
                        put(model, onsuccess, onerror);
                    }
                }, function (error) {
                    if (onerror != undefined)
                        console.log(error);
                })
            }
            else {
                put(model, onsuccess, onerror);
            }

            function put(model, onsuccess, onerror) {
                if (model.id == 0 && model.local_id == undefined) {
                    Customer.dao.generateCode(function (code) {
                        model.code = code;
                        Customer.dao.add(model, onsuccess, onerror);
                    })

                }
                if (model.id > 0 && model.local_id == undefined) {
                    Customer.dao.getById(model.id,
                        function (data) {
                            if (data != null) {
                                model.local_id = data.local_id;
                                BaseDao.update(Customer.objectStoreName, model, function (data) {
                                    if (onsuccess != undefined)
                                        onsuccess(data);
                                },
                                    function (error) {
                                        if (onerror != undefined)
                                            onerror(error);
                                    });
                            }
                            else
                                BaseDao.add(Customer.objectStoreName, model, onsuccess, onerror)
                        }
                    )
                }
                if (model.local_id > 0) {
                    BaseDao.update(Customer.objectStoreName, model, function (data) {
                        if (onsuccess != undefined)
                            onsuccess(data);
                    })
                }
            }

        }
    }
}
function loopPushCustomer() {
    Customer.dao.getAll(function (data) {
        var listCustomer = data.filter(item => item.synch_status == "waiting");
        if (listCustomer != null && listCustomer.length > 0) {
            var item = listCustomer[0];
            if (item.id == 0) {
                item.groupName = item.group_name;
                item.phoneNumber = item.phone_number;
                Customer.synch.post(item,
                    function () {
                        loopPushCustomer();
                    },
                    function () {
                        loopPushCustomer();
                    }
                )
            }
            else {
                data.synch_status = "completed";
                BaseDao.update(Customer.objectStoreName,
                    data,
                    function () {
                    loopPushCustomer()
                })
                //Customer.repository.store(data);
                //loopPushCustomer();
            }
        }
    });
}
var checkErrMetafield = 0;
function loopPushOrder(countOrder) {

    BaseDao.getByRangeIndex(Order.objectStoreName, "id", 0, 0, function (data) {
        if (data == undefined || data == null)
            return;
        data = data.filter(item => item.id == 0 && item.synch_status == "waiting");
        if (data != null && data.length > 0) {
            var item;
            var checkCount = 0;
            if (countOrder != null && countOrder != undefined && countOrder < data.length) {
                item = data[countOrder];
                checkCount = countOrder;
            }
            else {
                item = data[0]
            }
            var urlMetafield = "/admin/orders/metafields.json?namespace=offline&meta_key=" + "local_id_" + item.local_id + "_" + item.local_created_on;
            //sendRequest("POST", "/admin/offline_orders/GetOrderMetafields?", { namespace: "offline", metaKey: "local_id_" + item.local_id + "_" + item.local_created_on },
            sendRequest("GET", urlMetafield, null,
                function(metafields) {
                    checkErrMetafield = 0;
                    if (metafields == null || metafields == undefined || metafields["metafields"].length == 0) {
                        if (item.local_customer_id != undefined && item.local_customer_id != null) {
                            //check đơn hàng có khách hàng khác vãng lai
                            BaseDao.getByKey(Customer.objectStoreName, item.local_customer_id,
                                function (customer) {
                                    if (customer.id != undefined && customer.id != null && customer.id > 0) {
                                        // check khách hàng đã đc đồng bộ lên
                                        item.customer_id = customer.id;
                                        item.customerId = customer.id;
                                        Order.synch.push(item,
                                            function () {
                                                loopPushOrder();
                                            },
                                            function () {
                                                loopPushOrder();
                                            },
                                            function () {
                                                if (checkCount + 1 < data.length) {
                                                    loopPushOrder(checkCount + 1)
                                                }
                                            }
                                        );
                                    }
                                    else {
                                        if (customer.synch_status == "waiting") {//nếu chưa đồng bộ
                                            if (checkCount + 1 < data.length) {
                                                loopPushOrder(checkCount + 1);//nếu chưa phải đơn cuối cùng thì đồng bộ tiếp
                                            } else {
                                                loopPushOrder();//đồng bộ lại
                                            }
                                        }
                                        else if (customer.synch_status == "failed") {//nếu đồng bộ lỗi cập nhật đơn hàng lỗi đồng bộ khách hàng
                                            item.synch_status = "failed";
                                            item.error = customer.error;
                                            //Order.repository.store(item,
                                            //    function () {
                                            //        loopPushOrder();//đồng bộ lại
                                            //    },
                                            //    function () {
                                            //        loopPushOrder();
                                            //    }
                                            //);
                                            BaseDao.update(Order.objectStoreName,
                                                item,
                                                function () {
                                                    loopPushOrder();//đồng bộ lại
                                                },
                                                function () {
                                                    if (checkCount + 1 < data.length) {
                                                        loopPushOrder(checkCount + 1)
                                                    }
                                                }
                                            );
                                        }

                                    }
                                })
                        } else {
                            if (item.customer_id == null || item.customer_id == undefined || item.customer_id == 0) {//nếu là khách hàng vãng lai
                                Order.synch.push(item,
                                    function () {
                                        loopPushOrder();
                                    },
                                    function () {
                                        loopPushOrder();
                                    },
                                    function () {
                                        if (checkCount + 1 < data.length) {
                                            loopPushOrder(checkCount + 1)
                                        }
                                    }
                                );
                            } else {
                                item.synch_status = "failed";
                                item.error = "Đơn hàng có khách hàng không có trong hệ thống!"
                                //Order.repository.store(item,
                                //    function () {
                                //        loopPushOrder();//đồng bộ lại
                                //    },
                                //    function () {
                                //        loopPushOrder();
                                //    }
                                //);
                                BaseDao.update(Order.objectStoreName,
                                    item,
                                    function () {
                                        loopPushOrder();//đồng bộ lại
                                    },
                                    function () {
                                        if (checkCount + 1 < data.length) {
                                            loopPushOrder(checkCount + 1)
                                        }
                                    }
                                );
                            }
                        }

                    }
                    else {
                        item.synch_status = "completed";
                        //Order.repository.store(item,
                        //    function () {
                        //        loopPushOrder();//đồng bộ lại
                        //    },
                        //    function () {
                        //        loopPushOrder();
                        //    }
                        //);
                        BaseDao.update(Order.objectStoreName,
                            item,
                            function () {
                                loopPushOrder();//đồng bộ lại
                            },
                            function () {
                                if (checkCount + 1 < data.length) {
                                    loopPushOrder(checkCount + 1)
                                }
                            }
                        );
                        console.log("order " + item.local_id + " đã được đồng bộ lên server rồi");
                    }
                },
                function(error) {
                    checkErrMetafield++;
                    if (checkErrMetafield < 10) {
                        if (checkCount + 1 < data.length) {
                            loopPushOrder(checkCount + 1);//nếu chưa phải đơn cuối cùng thì đồng bộ tiếp
                        } else {
                            loopPushOrder();//đồng bộ lại
                        }
                        console.log("Có lỗi xảy ra khi kiểm tra metafield " + checkErrMetafield);
                    }
                    else {
                        console.log("Có lỗi xảy ra khi kiểm tra metafield, không lấy nữa");
                    }
                    
                })
        }
    })
}
var Order = {
    objectStoreName: "Orders",
    synch: {
        push: function (model, onsuccess, onerror, onerrorupdate) {
            var path = "";
            if (model.status == "draft")
                path = "/admin/offline_orders/AddDraftOrder?";
            else {
                model.status = "finalized";
                path = "/admin/offline_orders/AddPosOrder?";
            }

            model.metafields = new Array();
            model.metafields.push({ namespace: "offline", metaKey: "local_id_" + model.local_id + "_" + model.local_created_on, value: "1" })
            console.log("model pos");
            console.log(model)
            sendRequest("POST", path, model, function (data) {
                data.local_id = model.local_id;
                data.synch_status = "completed";
                data.local_code = model.local_code;
                //Order.repository.store(data);
                //if (onsuccess != undefined)
                //    onsuccess(data);
                BaseDao.update(Order.objectStoreName,
                    data,
                    function (data) {
                        if (onsuccess != undefined)
                            onsuccess(data);
                    },
                    function () {
                        if (onerrorupdate != undefined)
                            onerrorupdate();
                    }
                );
            }, function (er) {
                model.synch_status = "failed";
                if (er.detail != null && er.detail != undefined) {
                    model.error = er.detail.replace(/\n/g, '; ').replace(/;|$|{|}|\|"|"/g, '');
                }
                else {
                    model.error = JSON.stringify(er);
                }
                if (model.error.length > 500) {
                    model.error="Hệ thống đang nâng cấp"
                }
                if (model.error != null && model.error != undefined) {
                    model.error.substring(0, 250)
                }
                //Order.repository.store(model);
                //if (onerror != undefined)
                //    onerror(model.error);
                BaseDao.update(Order.objectStoreName,
                    model,
                    function () {
                        if (onerror != undefined)
                            onerror(model.error);
                    },
                    function () {
                        if (onerrorupdate != undefined)
                            onerrorupdate();
                    }
                );
            })
        },
        post: function (item, onsuccess, onerror) {
            var urlMetafield = "/admin/orders/metafields.json?namespace=offline&meta_key=" + "local_id_" + item.local_id + "_" + item.local_created_on;
            //sendRequest("POST", "/admin/offline_orders/GetOrderMetafields?", { namespace: "offline", metaKey: "local_id_" + item.local_id + "_" + item.local_created_on },
            sendRequest("GET", urlMetafield, null,
                function (metafields) {
                    if (metafields == null || metafields == undefined || metafields["metafields"].length == 0) {
                        if (item.local_customer_id != undefined && item.local_customer_id != null) {
                            BaseDao.getByKey(Customer.objectStoreName, item.local_customer_id,
                                function (customer) {
                                    if (customer.id != undefined && customer.id != null && customer.id > 0) {
                                        item.customer_id = customer.id;
                                        item.customerId = customer.id;
                                        if (item.id == 0 && item.synch_status == "failed") {
                                            Order.synch.push(item, onsuccess, onerror);
                                        }
                                    } else if (customer.synch_status == "failed") {
                                        if (onerror != undefined)
                                            onerror("Đơn hàng có khách hàng bị đồng bộ lỗi!");
                                    }
                                })
                        }
                        if ((item.local_customer_id == null || item.local_customer_id == undefined)
                            && (item.customer_id == null || item.customer_id == undefined)) {
                            if (item.id == 0 && item.synch_status == "failed") {
                                Order.synch.push(item, onsuccess, onerror);
                            }
                        }
                    }
                    else {
                        if (onerror != undefined)
                            onerror("Đơn hàng " + item.code + ", id " + metafields[0].object_id + " đã được đồng bộ lên server!");
                    }
                },
                function (error) {
                    console.log("Có lỗi xảy ra khi kiểm tra metafield");
                })
        },
        flow: function () {
            loopPushOrder()
            //BaseDao.getByRangeIndex(Order.objectStoreName, "id", 0, 0, function (data) {
            //    if (data == undefined || data == null)
            //        return;
            //    data = data.filter(item => item.id == 0 && item.synch_status == "waiting");
            //    data.forEach(function (item) {
            //        sendRequest("POST", "/admin/offline_orders/GetOrderMetafields?", { namespace: "offline", metaKey: "local_id_" + item.local_id + "_" + item.local_created_on },
            //        function (metafields) {
            //            if (metafields == null || metafields == undefined || metafields.length == 0) {
            //                if (item.local_customer_id != undefined && item.local_customer_id != null) {
            //                    BaseDao.getByKey(Customer.objectStoreName, item.local_customer_id,
            //                        function (customer) {
            //                            if (customer.id != undefined && customer.id != null && customer.id > 0) {
            //                                item.customer_id = customer.id;
            //                                item.customerId = customer.id;
            //                                Order.synch.push(item);
            //                            }
            //                        })
            //                }
            //                if ((item.local_customer_id == null || item.local_customer_id == undefined)
            //                    && (item.customer_id == null || item.customer_id == undefined)) {
            //                    Order.synch.push(item);
            //                }
            //            }
            //            else {
            //                console.log("order " + item.local_id + " đã được đồng bộ lên server rồi");
            //            }
            //        }, 
            //        function (error) {
            //            console.log("Có lỗi xảy ra khi kiểm tra metafield");
            //        })

            //    })
            //})
        }
    },
    dao: {
        add: function (model, onsuccess, onerror) {
            var now = new Date();
            now.setHours(now.getHours() + 7);
            model.synch_status = "waiting";
            model.tags = new Array("offline");
            model.local_created_on = now.toISOString();
            model.local_modified_on = now.toISOString();
            model.local_code = model.code;
            if (model.shipOn != null && model.shipOn != undefined) {
                var date = new Date(model.shipOn);
                model.shipOn = OfflineUtils.getISODate(date);
            }
            else
                model.shipOn = OfflineUtils.getISODate(new Date());
            BaseDao.add(Order.objectStoreName, model, function (data) {
                if (model.status != 'draft')
                    processInventory(0, model);
                function processInventory(i, model) {
                    if (i < model.orderLineItems.length) {
                        var item = model.orderLineItems[i];
                        if (item.isFreeform == false) {
                            var variantId = item.variantId;
                            var quantity = item.quantity;
                            Variant.dao.getById(variantId, function (variant) {
                                for (j = 0; j < variant.inventories.length; j++) {
                                    var inv = variant.inventories[j];
                                    if (inv.location_id == model.locationId) {
                                        inv.on_hand = inv.on_hand - quantity;
                                        inv.available = inv.available - quantity;
                                    }

                                    if (j == variant.inventories.length - 1)
                                        BaseDao.update(Variant.objectStoreName, variant, function () {
                                            processInventory(i + 1, model);
                                        });
                                }
                            })
                        }
                        else {
                            processInventory(i + 1, model);
                        }

                    }
                }
                onsuccess(data, model)
            });
        },
        update: function (model, onsuccess, onerror) {
            console.log("update order ");
            console.log(model);
            var objectStore = Database.getObjectStore(Order.objectStoreName, "readwrite");
            var request = objectStore.get(model.local_id);
            request.onsuccess = function (event) {
                var data = event.target.result;
                console.log("Get ra để xóa rồi add lại");
                console.log(data);
                model.old_local_id = data.local_id;
                BaseDao.delete(Order.objectStoreName, data.local_id, function () {
                    Order.dao.add(model, function (result) {
                        console.log("Xóa đi rồi, add lại được chú này");
                        console.log(result);
                        Order.dao.getById(model.id, function (order) {
                            console.log("Thằng vừa add lại đây");
                            console.log(order);
                        })
                    },
                        function (error) {
                            console.log(error);
                        });
                })
            }
        },
        generateCode: function (onsuccess) {
            BaseDao.count(Order.objectStoreName, function (data) {
                var result = "SOF" + OfflineUtils.getDateTextForCode() + data.toString();
                onsuccess(result);
            })
        },
        getByFilter: function (filter, onsuccess, onerror) {
            if (filter.page == undefined)
                filter.page = 1;
            if (filter.limit == undefined)
                filter.limit = 1;
            if (filter.synch_status == null || filter.synch_status == undefined)
                filter.synch_status = "";
            BaseDao.getAll(Order.objectStoreName, function (data) {
                var preResult = new Array();
                if (data != null && data.length > 0) {
                    for (i = 0; i < data.length; i++) {
                        var element = data[i];
                        if (element.synch_status == null ||
                            element.synch_status == undefined) {
                            element.synch_status = "";
                        } else {
                            element.synch_status = element.synch_status.trim();
                        }
                        if ((filter.synch_status == "" || (filter.synch_status != "" && element.synch_status == filter.synch_status))
                            && element.synch_status !="completed"
                            && (filter.query == null || element.code.indexOf(filter.query) >= 0
                                || (element.email != null && element.email.indexOf(filter.query) >= 0)
                                || (element.customerName != null && element.customerName != undefined && element.customerName.indexOf(filter.query) >= 0)
                                || (element.phone != null && element.phone != undefined && element.phone.indexOf(filter.query) >= 0))
                            && ((filter.created_on_min != null && element.local_created_on >= filter.created_on_min) || filter.created_on_min == null)
                            && ((filter.created_on_max != null && element.local_created_on <= filter.created_on_max) || filter.created_on_max == null)
                        )
                            preResult.push(element);
                    }
                }
                var orders = preResult.slice((filter.page - 1) * filter.limit, filter.page * filter.limit)
                var result = { orders: orders, count: preResult.length }
                onsuccess(result);
            });
        },
        getById: function (id, onsuccess, onerror) {
            BaseDao.getByIndex(Order.objectStoreName, "id", id, onsuccess, onerror);
        },
        getByLocalId: function (localId, onsuccess, onerror) {
            BaseDao.getByKey(Order.objectStoreName, localId, function (data) {
                onsuccess(data)
            });
        }
    },
    repository: {
        store: function (model1, onsuccess, onerror) {
            var model = JSON.parse(JSON.stringify(model1));
            console.log("id: " + model.id + ", local_id: " + model.local_id);
            if (model.id == 0 && model.local_id == undefined) {
                console.log("id = 0, local_id chưa có -> phải add");
                Order.dao.generateCode(function (code) {
                    model.code = code;
                    Order.dao.add(model, onsuccess, onerror);
                })
            }
            if ((model.id == 0 || model.id == undefined || model.id == null) && model.local_id > 0) {
                console.log("id = 0 và local_id > 0 -> phải update theo local_id thôi");
                BaseDao.update(Order.objectStoreName, model, onsuccess, onerror);
            }
            if (model.id > 0 && model.local_id == undefined) {
                console.log("id > 0, local_id chưa có");
                Order.dao.getById(model.id,
                    function (data) {
                        if (data != null) {
                            console.log("local_id chưa có và db đã tồn tại order có id " + model.id + " -> phải update");
                            model.local_id = data.local_id;
                            BaseDao.update(Order.objectStoreName, model,
                                function (data) {
                                    onsuccess(data);
                                },
                                onerror);
                        }
                        else {
                            console.log("local_id chưa có và id > 0 nhưng chưa tồn tại trong db -> phải add")
                            Order.dao.generateCode(function (code) {
                                model.code = code;
                                Order.dao.add(model, onsuccess, onerror);
                            })
                        }

                    }
                )
            }
            if (model.id > 0 && model.local_id > 0) {
                console.log("id > 0 và local_id > 0 -> phải update theo local_id thôi");
                BaseDao.update(Order.objectStoreName, model, onsuccess, onerror);
            }
        }
    }
}






