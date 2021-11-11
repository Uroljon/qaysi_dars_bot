const { TOKEN } = require("./config")
const timetable = require("./timetable")
const TelegramBot = require("node-telegram-bot-api")
const bot = new TelegramBot(TOKEN, {
    polling: true
})

bot.on("message", async (data) => {
    userId = data.from.id
    let keyboard = {
        keyboard: [
            [
                { text: "Dars jadvali" },
                { text: "Bugungi darslar" },
            ],
            [
                { text: "Hozir ? dars" },
                { text: "Keyin ? dars" },
            ],
            [
                {text: "Tell me a joke 🤠"}
            ]
        ],
        resize_keyboard: true
    }
    let answer = "";
    let date = new Date()
    let day = date.getDay() - 1;
    const week_days = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma"]

    if (data.text?.match(/(salom)/gi)) {
        answer = `Salom, ${data.from.first_name}. 👋`
    } else if (data.text?.match(/(dars jadvali)/gi)) {
        answer = ""
        timetable.forEach((item, index) => {
            answer += `📌 ${week_days[index]} \n\n`;
            item.forEach((pair) => {
                answer += `${pair.pair}. <b>${pair.class}</b> - [ ${pair.teacher} ] 👉 ${pair.room}\n`
            })
            answer += "\n\n"
        })
    } else if (data.text?.match(/(bugungi darslar)/gi)) {
        if (!timetable[day]) {
            bot.sendMessage(userId, "Bugun quyon dam oladi :)", {
                reply_markup: keyboard,
            })
            return
        }
        answer = `📌 ${week_days[day]} \n\n`;
        timetable[day].forEach((pair) => {
            answer += `${pair.pair}. <b>${pair.class}</b> - [ ${pair.teacher} ] 👉 ${pair.room}\n`
        })
    } else if (data.text?.match(/(hozir \? dars)/gi)) {
        answer = "";
        if (!timetable[day]) {
            bot.sendMessage(userId, "Bugun dars yo'q Rais buva :)", {
                reply_markup: keyboard,
            })
            return
        }
        let hour = date.getHours()
        let minute = date.getMinutes()
        let pair = "";
        if (hour <= 13) {
            answer = day < 3 ? `Mr Shin xafa bo'ladi. Tezro bormasaiz bomaydi 🏃🏻\n` : `Darsiz endi boshlanadi. Bemalol kelavering 🚶🏻‍♂️ \n`;
            answer += `Bugun 📌 ${week_days[day]} : 13:30 da \n`
            pair = timetable[day][0]
        } else if (hour > 13 && hour < 15) {
            pair = timetable[day][0]
        } else if (hour >= 15 && (hour <= 16 && minute <= 20)) {
            pair = timetable[day][1]
        } else if ((hour >= 16 && minute >= 30) && hour < 18) {
            pair = timetable[day][2]
        } else {
            bot.sendMessage(userId, "Bugungi darsiz tugab bo'ldi. Siz darsda uxlab qoluvdizmi deyman🤔", {
                reply_markup: keyboard,
            })
            return
        }
        answer += `${pair.pair}-para: <b>${pair.class}</b> - [ ${pair.teacher} ] 👉 ${pair.room}\n`
    } else if (data.text?.match(/(keyin \? dars)/gi)) {
        if (!timetable[day]) {
            bot.sendMessage(userId, "Bugun dars yo'q Rais buva :)", {
                reply_markup: keyboard,
            })
            return
        }
        answer = "";
        let hour = date.getHours()
        let minute = date.getMinutes()
        let pair = "";
        if (hour <= 13) {
            answer = `1-para endi boshlanadi-ku😧 \n`
            pair = timetable[day][0]
        } else if (hour > 13 && hour < 15) { //1
            pair = timetable[day][1]
        } else if (hour >= 15 && (hour <= 16 && minute <= 20)) {//2
            pair = timetable[day][2]
        } else {
            bot.sendMessage(userId, "Bugungi darsiz tugab bo'ldi. Siz darsda uxlab qoluvdizmi deyman🤔", {
                reply_markup: keyboard,
            })
            return
        }
        answer += `${pair.pair}-para: <b>${pair.class}</b> - [ ${pair.teacher} ] 👉 ${pair.room}\n`
    } else if (data.text?.match(/(dushanba)|(monday)/gi)) {
        answer = `📌 ${week_days[0]} \n\n`;
        timetable[0].forEach((pair) => {
            answer += `${pair.pair}. <b>${pair.class}</b> - [ ${pair.teacher} ] 👉 ${pair.room}\n`
        })
    } else if (data.text?.match(/(seshanba)|(tuesday)/gi)) {
        answer = `📌 ${week_days[1]} \n\n`;
        timetable[1].forEach((pair) => {
            answer += `${pair.pair}. <b>${pair.class}</b> - [ ${pair.teacher} ] 👉 ${pair.room}\n`
        })
    }
    else if (data.text?.match(/(chorshanba)|(wednesday)/gi)) {
        answer = `📌 ${week_days[2]} \n\n`;
        timetable[2].forEach((pair) => {
            answer += `${pair.pair}. <b>${pair.class}</b> - [ ${pair.teacher} ] 👉 ${pair.room}\n`
        })
    } else if (data.text?.match(/(payshanba)|(thursday)/gi)) {
        answer = `📌 ${week_days[3]} \n\n`;
        timetable[3].forEach((pair) => {
            answer += `${pair.pair}. <b>${pair.class}</b> - [ ${pair.teacher} ] 👉 ${pair.room}\n`
        })
    } else if (data.text?.match(/(juma)|(friday)/gi)) {
        answer = `📌 ${week_days[4]} \n\n`;
        timetable[4].forEach((pair) => {
            answer += `${pair.pair}. <b>${pair.class}</b> - [ ${pair.teacher} ] 👉 ${pair.room}\n`
        })
    } else if (data.text?.match(/(joke)|(Tell me a joke 🤠)/gi)) {
        let joke = require("./joke")
        let random = Math.round(Math.random() * (joke.length - 1))
        answer = `📌 Joke № ${random}: \n\n${joke[random].setup}🤔\n${joke[random].punchline}😄🤪`;
    }
    bot.sendMessage(userId, answer, {
        reply_markup: keyboard,
        parse_mode: "html"
    })

})
bot.sendMessage(1296799837, "bot is online !")
// timetable
// 13:30 => 14:50
// 15:00 => 16:20
// 16:30 => 17:50
