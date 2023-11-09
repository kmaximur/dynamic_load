import * as fs from 'fs'
import * as path from 'path'
import {strategy} from "./interfaces";

const strategies:strategy[] = []

const dir = path.resolve(require!.main!.path, '..','dist', 'strategies')

function execShellCommand(cmd) {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
        exec(cmd, { cwd: require!.main!.path }, (error, stdout, stderr) => {
            if (error) reject(error)
            resolve(stdout? stdout : stderr);
        });
    });
}

async function refreshStrategies():Promise<boolean>{
    try {
        await execShellCommand('tsc')
    } catch (e){
        console.log('error tsc build')
        return false
    }
    if(!fs.existsSync(dir)) {
        console.log('strategy folder not exist')
        return false
    }
    const files= fs.readdirSync(dir);
    if(files.length){
        strategies.splice(0,strategies.length)
        for (let i =0; i<files.length; i++){
            const name = dir + '/' + files[i];
            if (!fs.statSync(name).isDirectory() && path.extname(files[i]) == '.js'){
                try {
                    let a = await import(name);
                    strategies.push(a.def)
                } catch (e){
                    console.log('error load strategy')
                }
            }
        }
    }
    // strategies[0].onBar()
    return true
}

refreshStrategies().then((result)=>{
    console.log(result)
})
