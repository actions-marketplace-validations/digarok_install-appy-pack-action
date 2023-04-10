import * as os from 'os';
import * as util from 'util';

import * as toolCache from '@actions/tool-cache';
import * as core from '@actions/core';


const versions = {
    merlin : 'v1.1.8d',
    cadius : 'v0.0.2',
    appy : 'v0.1.7'
}

const linuxUrls = {
    merlin : 'https://github.com/digarok/merlin32/releases/download/%s/merlin32-ubuntu-latest-%s.zip',
    cadius : 'https://github.com/digarok/cadius/releases/download/%s/cadius-ubuntu-latest-%s.zip',
    appy : 'https://github.com/digarok/appy/releases/download/%s/appy_%s_Linux_64bit.tar.gz'
}
const windowsUrls = {
    merlin : 'https://github.com/digarok/merlin32/releases/download/%s/merlin32-windows-latest-%s.zip',
    cadius : 'https://github.com/digarok/cadius/releases/download/%s/cadius-ubuntu-latest-%s.zip',
    appy : 'https://github.com/digarok/appy/releases/download/%s/appy_%s_Windows_32bit.zip'
}

const macUrls = {
    merlin : 'https://github.com/digarok/merlin32/releases/download/%s/merlin32-macos-latest-%s.zip',
    cadius : 'https://github.com/digarok/cadius/releases/download/%s/cadius-ubuntu-latest-%s.zip',
    appy : 'https://github.com/digarok/appy/releases/download/%s/appy_%s_MacOS_64bit.zip'
}

// function getDownloadURL(version: string): string {
//     switch (os.type()) {
//         case 'Linux':
//             return util.format('https://github.com/digarok/merlin32/releases/download/%s/merlin32-ubuntu-latest-%s.zip', version, version);
//         case 'Darwin':
//             return util.format('https://github.com/digarok/merlin32/releases/download/%s/merlin32-macos-latest-%s.zip', version, version);
//         case 'Windows_NT':
//         default:
//             return util.format('https://github.com/digarok/merlin32/releases/download/%s/merlin32-windows-latest-%s.zip', version, version);
//     }
// }

function getAppDownloadURL(app: string, version: string): string {
    var re = /^v/gi;
    var binVer = version.replace(re,'')
    switch (os.type()) {
        case 'Linux':
            switch (app) {
                case 'merlin32':
                    return util.format(linuxUrls.merlin, version, version);
                case 'cadius':
                    return util.format(linuxUrls.cadius, version, version);
                case 'appy':
                    return util.format(linuxUrls.appy, version, binVer);
            }
        case 'Darwin':
            switch (app) {
                case 'merlin32':
                    return util.format(macUrls.merlin, version, version);
                case 'cadius':
                    return util.format(macUrls.cadius, version, version);
                case 'appy':
                    return util.format(macUrls.appy, version, binVer);
            }           
        case 'Windows_NT':
            switch (app) {
                case 'merlin32':
                    return util.format(windowsUrls.merlin, version, version);
                case 'cadius':
                    return util.format(windowsUrls.cadius, version, version);
                case 'appy':
                    return util.format(windowsUrls.appy, version, binVer);
            }           
    }
    return "";
}

async function downloadMerlin32(version: string) {
    let cachedToolpath = toolCache.find('merlin32', version);
    if (!cachedToolpath) {
        let downloadPath;
        try {
            downloadPath = await toolCache.downloadTool(getAppDownloadURL("merlin32", version));
        } catch (exception) {
            console.log(exception)
            throw new Error(util.format("Failed to download Merlin32 from location ", getAppDownloadURL("merlin32", version)));
        }
        const extractedPath = await toolCache.extractZip(downloadPath);
        cachedToolpath = await toolCache.cacheDir(extractedPath, 'merlin32', version);
    }
    core.addPath(cachedToolpath)
    return cachedToolpath
}

async function downloadCadius(version: string) {
    let cachedToolpath = toolCache.find('cadius', version);
    if (!cachedToolpath) {
        let downloadPath;
        try {
            downloadPath = await toolCache.downloadTool(getAppDownloadURL("cadius", version));
        } catch (exception) {
            console.log(exception)
            throw new Error(util.format("Failed to download Cadius from location ", getAppDownloadURL("cadius", version)));
        }
        const extractedPath = await toolCache.extractZip(downloadPath);
        cachedToolpath = await toolCache.cacheDir(extractedPath, 'cadius', version);
    }
    core.addPath(cachedToolpath)
    return cachedToolpath
}

async function downloadAppy(version: string) {
    let cachedToolpath = toolCache.find('appy', version);
    if (!cachedToolpath) {
        let downloadPath;
        try {
            downloadPath = await toolCache.downloadTool(getAppDownloadURL("appy", version));
        } catch (exception) {
            console.log(exception)
            throw new Error(util.format("Failed to download Appy from location ", getAppDownloadURL("appy", version)));
        }
        const extractedPath = await toolCache.extractTar(downloadPath);
        cachedToolpath = await toolCache.cacheDir(extractedPath, 'appy', version);
    }
    core.addPath(cachedToolpath)
    return cachedToolpath
}

async function run() {
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
        includeProdos = true;  // default
    }

    console.log(`INPUTS - merlinVersion '${merlinVersion}'`);
    console.log(`INPUTS - cadiusVersion '${cadiusVersion}'`);
    console.log(`INPUTS - appyVersion '${appyVersion}'`);
    console.log(`INPUTS - includeProdos '${includeProdos}'`);

    await downloadMerlin32(merlinVersion);
    console.log(`Merlin32 version: '${merlinVersion}' has been downloaded and added to path`);
    await downloadCadius(cadiusVersion);
    console.log(`Cadius version: '${cadiusVersion}' has been downloaded and added to path`);
    await downloadAppy(appyVersion);
    console.log(`Appy version: '${appyVersion}' has been downloaded and added to path`);
}

run().catch(core.setFailed);