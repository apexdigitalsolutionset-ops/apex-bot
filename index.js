const { Telegraf, Markup } = require('telegraf');
const express = require('express');
require('dotenv').config();

const app = express();
app.get('/', (req, res) => res.send('APEX Bot is Live!'));
app.listen(process.env.PORT || 3000);

const bot = new Telegraf(process.env.BOT_TOKEN);

const slogan = `🟩 <b>APEX Digital Solution</b> 🟩\n🌿 <i>"Elevating Your Digital Presence to the Peak."</i> 🌿`;

// 🟢 Start Command - Language Selection
bot.start((ctx) => {
    const welcomeText = `${slogan}\n\n🟢 Please select your language\n🟢 እባክዎ ቋንቋ ይምረጡ`;
    ctx.replyWithHTML(welcomeText, Markup.inlineKeyboard([
        [Markup.button.callback('🟢 English', 'lang_en'), Markup.button.callback('🟢 አማርኛ', 'lang_am')]
    ]));
});

// 🟢 English Main Menu
bot.action('lang_en', (ctx) => {
    ctx.replyWithHTML(`🟩 <b>Main Menu</b>\nHow can we elevate your brand today?`, Markup.inlineKeyboard([
        [Markup.button.callback('🔋 Packages', 'pkg_en'), Markup.button.callback('🈯 Individual Services', 'srv_en')],
        [Markup.button.webApp('🌐 Open APEX App', 'https://apex-agency-4f177.web.app')],
        [Markup.button.callback('📞 Contact Us', 'contact_en')]
    ]));
});

// 🟢 Amharic Main Menu
bot.action('lang_am', (ctx) => {
    ctx.replyWithHTML(`🟩 <b>ዋና ማውጫ</b>\nዛሬ የትኛውን አገልግሎት ይፈልጋሉ?`, Markup.inlineKeyboard([
        [Markup.button.callback('🔋 የጥቅል አገልግሎቶች (Packages)', 'pkg_am')],
        [Markup.button.callback('🈯 የግል አገልግሎቶች (Services)', 'srv_am')],
        [Markup.button.webApp('🌐 የ APEX ዌብ-አፕ ይክፈቱ', 'https://apex-agency-4f177.web.app')],
        [Markup.button.callback('📞 ያግኙን', 'contact_am')]
    ]));
});

// 🟢 English Packages
bot.action('pkg_en', (ctx) => {
    const text = `
🟩 <b>APEX Premium Packages</b> 🟩

🟢 <b>1. ASCENT (Starter)</b> - $500
🌿 Basic Branding, Social Media Setup, Simple Web Page.

🟢 <b>2. APEX (Standard)</b> - $1,500
🌿 Full Brand Identity, Advanced Web Dev, Business Automation, Social Media Management.

🟢 <b>3. ZENITH (High-End)</b> - $3,000+
🌿 Premium Glassmorphism UI/UX, AI Integrations, Full App/Web Dev, Complete Digital Domination.
`;
    ctx.replyWithHTML(text, Markup.inlineKeyboard([
        [Markup.button.callback('🟢 Order Ascent', 'order'), Markup.button.callback('🟢 Order Apex', 'order')],
        [Markup.button.callback('🟢 Order Zenith', 'order')],
        [Markup.button.callback('⬅️ Back to Menu', 'lang_en')]
    ]));
});

// 🟢 Amharic Packages
bot.action('pkg_am', (ctx) => {
    const text = `
🟩 <b>የ APEX ፕሪሚየም ጥቅሎች</b> 🟩

🟢 <b>1. ASCENT (ጀማሪ)</b> - $500
🌿 የብራንድ አጀማመር፣ ሶሻል ሚዲያ አከፋፈት እና ቀላል ዌብሳይት።

🟢 <b>2. APEX (መካከለኛ)</b> - $1,500
🌿 ሙሉ ብራንዲንግ፣ ዘመናዊ ዌብሳይት፣ የቢዝነስ አውቶሜሽን እና ሶሻል ሚዲያ አስተዳደር።

🟢 <b>3. ZENITH (ከፍተኛ)</b> - $3,000+
🌿 ፕሪሚየም (Glassmorphism) ዲዛይን፣ AI ሲስተሞች፣ ሙሉ አፕ/ዌብ ዴቨሎፕመንት።
`;
    ctx.replyWithHTML(text, Markup.inlineKeyboard([
        [Markup.button.callback('🟢 Ascent እዘዝ', 'order'), Markup.button.callback('🟢 Apex እዘዝ', 'order')],
        [Markup.button.callback('🟢 Zenith እዘዝ', 'order')],
        [Markup.button.callback('⬅️ ተመለስ', 'lang_am')]
    ]));
});

// 🟢 English Services
bot.action('srv_en', (ctx) => {
    const text = `
🟩 <b>Individual Services</b> 🟩

🟢 Website & App Development
🟢 High-end UI/UX & Graphic Design
🟢 Digital Marketing & Dropshipping Strategy
🟢 Bot Development & Automation
`;
    ctx.replyWithHTML(text, Markup.inlineKeyboard([
        [Markup.button.callback('🟢 Request Service', 'order')],
        [Markup.button.callback('⬅️ Back to Menu', 'lang_en')]
    ]));
});

// 🟢 Amharic Services
bot.action('srv_am', (ctx) => {
    const text = `
🟩 <b>የግል አገልግሎቶች</b> 🟩

🟢 ዌብሳይት እና አፕሊኬሽን ዴቨሎፕመንት
🟢 ዘመናዊ UI/UX እና ግራፊክስ ዲዛይን
🟢 ዲጂታል ማርኬቲንግ እና የ Dropshipping ስትራቴጂ
🟢 የቦት ዴቨሎፕመንት እና አውቶሜሽን
`;
    ctx.replyWithHTML(text, Markup.inlineKeyboard([
        [Markup.button.callback('🟢 አገልግሎት ጠይቅ', 'order')],
        [Markup.button.callback('⬅️ ተመለስ', 'lang_am')]
    ]));
});

// 🟢 Universal Order & Contact Handlers
bot.action('order', (ctx) => ctx.reply('🟢 Please contact our team at @YourUsername or use the Web App to place an order. / እባክዎ ለማዘዝ በ @YourUsername ያናግሩን ወይንም ዌብ-አፑን ይጠቀሙ።'));
bot.action('contact_en', (ctx) => ctx.reply('🟩 Contact us:\nEmail: apexsolutions.et@gmail.com\nTelegram: @YourUsername'));
bot.action('contact_am', (ctx) => ctx.reply('🟩 ያግኙን፦\nኢሜይል: apexsolutions.et@gmail.com\nቴሌግራም: @YourUsername'));

bot.launch();
