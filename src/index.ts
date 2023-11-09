import {startWebhookServer} from "./gitWebhook";
import {refreshStrategies} from "./refreshStrategy";

startWebhookServer()

// refreshStrategies().then((result)=>{
//     console.log('обновляем стратегии, результат: ' + result)
// })
