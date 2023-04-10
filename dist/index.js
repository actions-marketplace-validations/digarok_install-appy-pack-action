"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(require("os"));
const util = __importStar(require("util"));
const toolCache = __importStar(require("@actions/tool-cache"));
const core = __importStar(require("@actions/core"));
const versions = {
    merlin: 'v1.1.8d',
    cadius: 'v0.0.0',
    appy: 'v0.1.7'
};
const linuxUrls = {
    merlin: 'https://github.com/digarok/merlin32/releases/download/%s/merlin32-ubuntu-latest-%s.zip',
    cadius: 'https://github.com/digarok/cadius/releases/download/%s/cadius-ubuntu-latest-%s.zip',
    appy: 'https://github.com/digarok/appy/releases/download/%s/appy_%s_Linux_64bit.tar.gz'
};
const windowsUrls = {
    merlin: 'https://github.com/digarok/merlin32/releases/download/%s/merlin32-windows-latest-%s.zip',
    cadius: 'https://github.com/digarok/cadius/releases/download/%s/cadius-ubuntu-latest-%s.zip',
    appy: 'https://github.com/digarok/appy/releases/download/%s/appy_%s_Windows_32bit.zip'
};
const macUrls = {
    merlin: 'https://github.com/digarok/merlin32/releases/download/%s/merlin32-macos-latest-%s.zip',
    cadius: 'https://github.com/digarok/cadius/releases/download/%s/cadius-ubuntu-latest-%s.zip',
    appy: 'https://github.com/digarok/appy/releases/download/%s/appy_%s_MacOS_64bit.zip'
};
function getAppDownloadURL(app, version) {
    switch (os.type()) {
        case 'Linux':
            switch (app) {
                case 'merlin32':
                    return util.format(linuxUrls.merlin, version, version);
                case 'cadius':
                    return util.format(linuxUrls.cadius, version, version);
                case 'appy':
                    return util.format(linuxUrls.appy, version, version);
            }
        case 'Darwin':
            switch (app) {
                case 'merlin32':
                    return util.format(macUrls.merlin, version, version);
                case 'cadius':
                    return util.format(macUrls.cadius, version, version);
                case 'appy':
                    return util.format(macUrls.appy, version, version);
            }
        case 'Windows_NT':
            switch (app) {
                case 'merlin32':
                    return util.format(windowsUrls.merlin, version, version);
                case 'cadius':
                    return util.format(windowsUrls.cadius, version, version);
                case 'appy':
                    return util.format(windowsUrls.appy, version, version);
            }
    }
    return "";
}
function downloadMerlin32(version) {
    return __awaiter(this, void 0, void 0, function* () {
        let cachedToolpath = toolCache.find('merlin32', version);
        if (!cachedToolpath) {
            let downloadPath;
            try {
                downloadPath = yield toolCache.downloadTool(getAppDownloadURL("merlin32", version));
            }
            catch (exception) {
                console.log(exception);
                throw new Error(util.format("Failed to download Merlin32 from location ", getAppDownloadURL("merlin32", version)));
            }
            const extractedPath = yield toolCache.extractZip(downloadPath);
            cachedToolpath = yield toolCache.cacheDir(extractedPath, 'merlin32', version);
        }
        core.addPath(cachedToolpath);
        return cachedToolpath;
    });
}
function downloadCadius(version) {
    return __awaiter(this, void 0, void 0, function* () {
        let cachedToolpath = toolCache.find('cadius', version);
        if (!cachedToolpath) {
            let downloadPath;
            try {
                downloadPath = yield toolCache.downloadTool(getAppDownloadURL("cadius", version));
            }
            catch (exception) {
                console.log(exception);
                throw new Error(util.format("Failed to download Cadius from location ", getAppDownloadURL("cadius", version)));
            }
            const extractedPath = yield toolCache.extractZip(downloadPath);
            cachedToolpath = yield toolCache.cacheDir(extractedPath, 'cadius', version);
        }
        core.addPath(cachedToolpath);
        return cachedToolpath;
    });
}
function downloadAppy(version) {
    return __awaiter(this, void 0, void 0, function* () {
        let cachedToolpath = toolCache.find('appy', version);
        if (!cachedToolpath) {
            let downloadPath;
            try {
                downloadPath = yield toolCache.downloadTool(getAppDownloadURL("appy", version));
            }
            catch (exception) {
                console.log(exception);
                throw new Error(util.format("Failed to download Appy from location ", getAppDownloadURL("appy", version)));
            }
            const extractedPath = yield toolCache.extractTar(downloadPath);
            cachedToolpath = yield toolCache.cacheDir(extractedPath, 'appy', version);
        }
        core.addPath(cachedToolpath);
        return cachedToolpath;
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let merlinVersion = core.getInput('merlin_version');
        if (!merlinVersion) {
            merlinVersion = versions.merlin;
        }
        let cadiusVersion = core.getInput('cadius_version');
        if (!cadiusVersion) {
            cadiusVersion = versions.cadius;
        }
        let appyVersion = core.getInput('appy_version');
        if (!appyVersion) {
            appyVersion = versions.appy;
        }
        let includeProdos = false;
        let inputIncludeProdos = core.getInput('include_prodos');
        if (inputIncludeProdos.toLowerCase() == "true" || inputIncludeProdos == "") {
            includeProdos = true;
        }
        console.log(`INPUTS - merlinVersion '${merlinVersion}'`);
        console.log(`INPUTS - cadiusVersion '${cadiusVersion}'`);
        console.log(`INPUTS - appyVersion '${appyVersion}'`);
        console.log(`INPUTS - includeProdos '${includeProdos}'`);
        yield downloadMerlin32(merlinVersion);
        console.log(`Merlin32 version: '${merlinVersion}' has been downloaded and added to path`);
        yield downloadCadius(cadiusVersion);
        console.log(`Cadius version: '${cadiusVersion}' has been downloaded and added to path`);
        yield downloadAppy(appyVersion);
        console.log(`Appy version: '${appyVersion}' has been downloaded and added to path`);
    });
}
run().catch(core.setFailed);
