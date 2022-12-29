// This worker is created to run the FW Update process in the background when Browser tab is inactive
const workercode = () => {

    self.onmessage = function (e) {
        if ("cancelFirmwareUpdate" == e.data) {
            cancelClicked = true;
        } else {
            var firmwareImageData = e.data.firmwareImageData;
            var binaryData = e.data.binaryData;
            var sid = e.data.sid;
            var counter = e.data.counter;
            var dataURL = e.data.dataURL;
            var header = e.data.authHeader;

            repeat_function(firmwareImageData, binaryData, sid, counter, header, dataURL);
        }
    }

    self.retryCount = 3;
    self.retryAttempt = 0;
    self.cancelClicked = false;

    self.repeat_function = function (firmwareImageData, binaryData, sid, counter, header, dataURL) {
        var totalChunkCount = firmwareImageData.bindata.Data.length;

        if (counter < totalChunkCount) {
            var url = dataURL + firmwareImageData.binXLink;
            var currentChunk = binaryData[0];
            var data = '<DataPUT SessionID="' + sid + '"><ChunkTotal>' + totalChunkCount + '</ChunkTotal><ChunkNumber>'
                + counter + '</ChunkNumber><Data address="' + currentChunk.address + '" size="' + currentChunk.value.length + '">'
                + currentChunk.value + '</Data></DataPUT>';

            var percentageCalc = Math.round((counter / totalChunkCount) * 100);
            self.postMessage({ percentage: percentageCalc, isComplete: false, isWorkerError: false });

            var xhttp = new XMLHttpRequest();
            xhttp.onload = function () {
                if (xhttp.status >= 200 && xhttp.status < 300) {
                    retryAttempt = 0;
                    var formattedValue = parseXML(xhttp.response);
                    if (formattedValue.DataPUT) {
                        var waitTime = parseInt(formattedValue.DataPUT.Wait);
                        binaryData = binaryData.slice(1);
                        setTimeout(() => {
                            repeat_function(firmwareImageData, binaryData, sid, counter + 1, header, dataURL);
                        }, waitTime);
                    }
                } else if (xhttp.status == 420) {
                    if (retryAttempt == retryCount) {
                        self.postMessage({ percentage: percentageCalc, isComplete: false, isWorkerError: true, workerErrMsg: xhttp.statusText });
                    } else {
                        retryAttempt += 1;
                        setTimeout(() => {
                            repeat_function(firmwareImageData, binaryData, sid, counter, header, dataURL);
                        }, 10000);
                    }
                } else {
                    self.postMessage({ percentage: percentageCalc, isComplete: false, isWorkerError: true, workerErrMsg: xhttp.statusText });
                }
            };
            xhttp.onerror = function (errorResponse) {
                if (errorResponse.type == "error" && errorResponse.target.status == 0) {
                    if (retryAttempt == retryCount) {
                        self.postMessage({ percentage: percentageCalc, isComplete: false, isWorkerError: true, workerErrMsg: "device_connection_lost" });
                    } else {
                        retryAttempt += 1;
                        setTimeout(() => {
                            repeat_function(firmwareImageData, binaryData, sid, counter, header, dataURL);
                        }, 10000);
                    }
                }
            };
            xhttp.ontimeout = function (timeoutResponse) {
                if (retryAttempt == retryCount) {
                    self.postMessage({ percentage: percentageCalc, isComplete: false, isWorkerError: true, workerErrMsg: "device_connection_lost" });
                } else {
                    retryAttempt += 1;
                    setTimeout(() => {
                        repeat_function(firmwareImageData, binaryData, sid, counter, header, dataURL);
                    }, 10000);
                }
            };
            xhttp.open("PUT", url, true);
            xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhttp.setRequestHeader("Accept", "application/json, text/plain, */*");
            xhttp.setRequestHeader("Authorization", header);
            xhttp.timeout = 10000;
            xhttp.withCredentials = true;
            if (cancelClicked) {
                xhttp.abort();
                cancelClicked = false;
                self.postMessage({ percentage: percentageCalc, isComplete: false, isWorkerError: true, workerErrMsg: "session_aborted" });
            } else {
                xhttp.send(data);
            }
        } else {
            self.postMessage({ percentage: 100, isComplete: true, isWorkerError: false });
        }
    }

    self.parseXML = function (xml, parent) {
        // RegEx divides proper XML in to three parts:
        // $1 - The node name
        // $2 - Space-separated attributes, or a blank string
        // $3 - The contents of the nod;e, or undefined if self-closing
        var regex = /<(\w+)\s*(.*?)(?:\/>|>([\S\s]*?)<\/\1>)/g
        // Create the basic XML structure
        var ex = regex.exec(xml);
        if (ex === null) {
            // This occurs when "xml" is not XML-formatted.
            //  In this case, apply it to its parent and move on
            if (!parent) {
                parent = xml;
            } else if (xml) {
                parent.value = xml;
            }
            return parent;
        }
        var ret = parent || {};
        while (ex !== null) {
            // Assign each attribute as a property of the value
            var nodeName = ex[1];
            var attributes = ex[2];
            var contents = ex[3];
            var attr = undefined;
            if (attributes) {
                attr = {};
                var attributeList = attributes.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g);
                attributeList.forEach(function (n) {
                    var i = n.indexOf("=");
                    var k = n.substr(0, i);
                    var v = n.substr(i + 1).replace(/^"(.*)"$/, "$1");
                    attr[k] = v;
                });
            }
            // Assign the value to the key
            var value = parseXML(contents, attr);
            var old = ret[nodeName];
            if (old) {
                if (!Array.isArray(old)) {
                    old = ret[nodeName] = [old];
                }
                old.push(value)
            } else {
                ret[nodeName] = value;
            }
            ex = regex.exec(xml);
        }
        return ret;
    }
};


let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const worker_chunks_script = URL.createObjectURL(blob);

module.exports = worker_chunks_script;