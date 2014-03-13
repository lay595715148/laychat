//copy from https://gist.github.com/wankdanker/1510680

/*jslint node: true, maxerr: 50, indent: 4 */
 
"use strict";
 
var clusterInstance;
 
var SimpleCluster = module.exports = function () {
    //there should only be one instance of this per process
    if (clusterInstance) {
        return clusterInstance;
    } else {
        clusterInstance = this;
    }
 
    var cluster = require('cluster'),
        os = require('os'),
        self = this;
 
    self.cluster = cluster;
    self.watchedScripts = {};
    self.workers = {};
 
    /*
     * forkWorker()
     * 
     * Fork a new worker and set up the callback for receiving required scripts
     * 
     */
    self.forkWorker = function () {
        var worker = cluster.fork();
 
        self.workers[worker.pid] = worker;
 
        worker.on('message', function (msg) {
            if (msg.cmd && msg.cmd === 'registerScripts') {
 
                (msg.data || []).forEach(function (scriptPath) {
                    self.maybeWatchFile(scriptPath);
                });
            }
        });
    };
 
    /*
     * maybeWatchFile(path)
     * 
     * Conditionally watch a file if we are not already watching it.
     * 
     */
    self.maybeWatchFile = function (path) {
        //check to see if we are already watching this script;
        if (!self.watchedScripts.hasOwnProperty(path)) {
            self.watchFile(path);
        }
    };
 
    /*
     * watchFile(path)
     * 
     * Watch a file and restart workers when it has changed
     * 
     */
    self.watchFile = function (path) {
        self.watchedScripts[path] = true;
 
        require('fs').watchFile(path, function (curr, prev) {
            if (curr.mtime !== prev.mtime) {
                //file has been modified; reload workers
 
                self.restartWorkers();
            }
        });
    };
 
    /*
     * restartWorkers()
     * 
     * Restart all workers
     */
    self.restartWorkers = function () {
        var pid, oldWorkers, worker;
 
        oldWorkers = self.workers;
        self.workers = {};
 
        for (pid in oldWorkers) {
            if (oldWorkers.hasOwnProperty(pid)) {
                worker = oldWorkers[pid];
 
                worker.kill();
                self.forkWorker();
            }
        }
    };
 
    /*
     * start()
     * 
     * Start the cluster
     * 
     */
    self.start = function () {
        if (cluster.isMaster) {
            os.cpus().forEach(function () {
                self.forkWorker();
            });
 
            process.on('death', function (worker) {
                delete self.workers[worker.pid];
 
                self.forkWorker();
            });
        } else {
            setInterval(function () {
                process.send({
                    cmd : 'registerScripts',
                    data : Object.keys(require.cache)
                });
            }, 2000);
        }
    };
};
 
module.exports.start = function () {
    var c = new SimpleCluster();
    c.start();
 
    return c;
};
