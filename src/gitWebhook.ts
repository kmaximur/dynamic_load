import * as http from 'http';
import * as crypto from 'crypto';
import * as path from "path";
import {refreshStrategies} from "./refreshStrategy";

const SECRET = process.env['GITHUB_WEBHOOK_SECRET']!;

const GITHUB_REPOSITORIES_TO_DIR = {
    'kmaximur/dynamic_load': path.resolve(require!.main!.path, '..'),
};

export function startWebhookServer(){
    http
        .createServer((req, res) => {
            req.on('data', chunk => {
                const signature = `sha1=${crypto
                    .createHmac('sha1', SECRET)
                    .update(chunk)
                    .digest('hex')}`;
                const isAllowed = req.headers['x-hub-signature'] === signature;
                const body = JSON.parse(chunk);
                const isMaster = body?.ref === 'refs/heads/master';
                const directory = GITHUB_REPOSITORIES_TO_DIR[body?.repository?.full_name];
                if (isAllowed && isMaster && directory) {
                    try {
                        // full refresh (возможно если данный http сервер запущен отдельно)
                        // execShellCommand(`pm2 stop lana & pm2 delete lana & cd ${directory} && git reset --hard origin/master && git pull origin master && npm i && npm update && tsc && pm2 start npm --name lana -- run startEnv`);
                        refreshStrategies().then((result)=>{
                            console.log('получен вебхук github - обновляем стратегии, результат: ' + result)
                        })
                    } catch (error) {
                        console.log(error);
                    }
                }
            });
            res.end();
        })
        .listen(8080);
}
