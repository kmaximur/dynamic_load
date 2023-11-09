import * as fs from 'fs'
import * as path from 'path'
import {strategy} from "./interfaces";

const strategies:strategy[] = []

const dir = path.resolve(__dirname, 'strategies')

function execShellCommand(cmd) {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
        exec(cmd, { cwd: require!.main!.path }, (error, stdout, stderr) => {
            if (error) console.warn(error);
            resolve(stdout? stdout : stderr);
        });
    });
}

async function refreshStrategies(){
    if(!fs.existsSync(dir)) fs.mkdirSync(dir)
    await execShellCommand('tsc')
    const files= fs.readdirSync(dir);
    if(files.length){
        strategies.splice(0,strategies.length)
        for (let i =0; i<files.length; i++){
            const name = dir + '/' + files[i];
            if (!fs.statSync(name).isDirectory()){
                try {
                    let a = await import(name);
                    strategies.push(a.def)
                } catch (e){
                    console.log('error load strategy')
                }
            }
        }
    }
    strategies[0].onBar()
}

refreshStrategies()
