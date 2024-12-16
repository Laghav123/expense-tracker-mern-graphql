import https from 'https'
import { CronJob } from 'cron'

const URI = "https://expense-tracker-mern-graphql.onrender.com/";

export const cronJob = new CronJob("*/10 * * * *", ()=>{
    https.get(URL, (res)=>{
        if(res.statusCode===200){
            console.log("CronJob: request successful");
        }else{
            console.log("CronJob: request failed");
        }
    }).on("error", (e)=>{
        console.error("CronJob: Error while sending request", e);
    })
})