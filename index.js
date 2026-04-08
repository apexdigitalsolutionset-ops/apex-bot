const { Telegraf, Markup } = require('telegraf');

// የቦትህን ቶክን እዚህ ታስገባለህ
const bot = new Telegraf('8755961488:AAEX7ydFlWfA59KhsosMTIp9A-DFvkOaeKc');

// 1. የ Start ትዕዛዝ (Welcome & Main Menu)
bot.start((ctx) => {
    const welcomeMsg = `
🌟 <b>Welcome to APEX Digital Solution</b> 🌟

<i>"Elevating Your Digital Presence to the Peak."</i>
<i>"የዲጂታል መገኘትዎን ወደ ላቀ ደረጃ እናደርሳለን።"</i>

ሰላም ${ctx.from.first_name}! የ APEX ቦትን ስለተጠቀሙ እናመሰግናለን። እባክዎ ከታች ካሉት አማራጮች ይምረጡ፡
`;
    ctx.replyWithHTML(welcomeMsg, Markup.inlineKeyboard([
        [Markup.button.callback('📦 Our Packages (ጥቅሎቻችን)', 'packages')],
        [Markup.button.callback('💼 Portfolio (ስራዎቻችን)', 'portfolio')],
        // ይህ ነው የ APEXን Color እና Font በ Glassmorphism የሚያሳየው ዌብሳይት የሚከፍተው!
        [Markup.button.webApp('🌐 Open APEX Premium App', 'https://ያንተ-ድረገፅ-ሊንክ.com')], 
        [Markup.button.callback('📞 Contact Us (ያግኙን)', 'contact')]
    ]));
});

// 2. የጥቅሎች ዝርዝር (Packages Breakdown)
bot.action('packages', (ctx) => {
    const packageInfo = `
💎 <b>APEX Premium Packages</b> 💎

<b>1. ASCENT PACKAGE 🚀</b>
• Starter Digital Marketing & Social Media Setup
• Perfect for launching your brand.

<b>2. APEX PACKAGE ⚡️</b>
• Advanced Web Development & SEO
• Full Social Media Automation
• Ideal for rapid business growth.

<b>3. ZENITH PACKAGE 👑</b>
• High-end Glassmorphism Web Design
• Complete Branding, E-commerce & AI Integration
• For premium market dominance.

የትኛውን ማዘዝ ይፈልጋሉ?
`;
    ctx.replyWithHTML(packageInfo, Markup.inlineKeyboard([
        [Markup.button.callback('Order Ascent', 'order_ascent'), Markup.button.callback('Order Apex', 'order_apex')],
        [Markup.button.callback('Order Zenith (Premium)', 'order_zenith')],
        [Markup.button.callback('⬅️ Back to Menu', 'back_home')]
    ]));
});

// 3. ፖርትፎሊዮ እና አድራሻ (Portfolio & Contact)
bot.action('portfolio', (ctx) => {
    ctx.reply('እነሆ የተመረጡ የ APEX High-end የዲዛይን ስራዎች... [ሊንክ ወይም ምስሎች እዚህ ይገባሉ]', 
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Back', 'back_home')]]));
});

bot.action('contact', (ctx) => {
    ctx.replyWithHTML(`
📞 <b>Contact APEX Digital Solution</b>

📧 Email: info@apex.com
📍 Location: Addis Ababa, Ethiopia
📱 Phone: +251 9...

ወይም በቀጥታ የድጋፍ ቡድናችንን ለማነጋገር ይህንን ይጫኑ፡
`, Markup.inlineKeyboard([[Markup.button.url('💬 Chat with Admin', 'https://t.me/ያንተ_ዩዘርኔም')]]));
});

// 4. ወደ ዋናው ገፅ መመለሻ
bot.action('back_home', (ctx) => {
    ctx.reply('ወደ ዋናው ማውጫ ተመልሰዋል! 👇', Markup.inlineKeyboard([
        [Markup.button.callback('📦 Packages', 'packages'), Markup.button.callback('💼 Portfolio', 'portfolio')],
        [Markup.button.webApp('🌐 Open APEX Premium App', 'https://ያንተ-ድረገፅ-ሊንክ.com')],
        [Markup.button.callback('📞 Contact Us', 'contact')]
    ]));
});

// ቦቱን ማስጀመር
bot.launch();
console.log("APEX Bot is fully running...");
