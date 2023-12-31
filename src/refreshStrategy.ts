import {strategy} from "./interfaces";
import * as path from "path";
import * as fs from "fs";

const strategies:strategy[] = []

const dir = path.resolve(require!.main!.path, '..','dist', 'strategies')

export function execShellCommand(cmd) {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
        exec(cmd, { cwd: require!.main!.path }, (error, stdout, stderr) => {
            if (error) reject(error)
            resolve(stdout? stdout : stderr);
        });
    });
}

export async function refreshStrategies():Promise<boolean>{
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
        for (const file of files){
            const name = dir + '/' + file;
            if (!fs.statSync(name).isDirectory() && path.extname(file) == '.js'){
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
    /// TODO сообщить на фронты через фасады новые стратегии
    return true
}
