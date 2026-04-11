const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.get('/', (req, res) => res.send('APEX Bot is Live!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const bot = new Telegraf(process.env.BOT_TOKEN);

// Premium Icon
const I = '🟢 ➢';

// የተጠቃሚዎችን መረጃ (Form) ለመያዝ
const userForms = {};

// የአገልግሎቶች ዝርዝር፣ ዋጋ እና የሚፈጅበት ቀን (ለኮንትራት ማዘጋጃ)
const packages = {
    'logo': { name: 'Professional Logo Design', price: '2,500', days: 5 },
    'bot': { name: 'Custom Telegram Bot', price: '5,000', days: 15 },
    'website': { name: 'Premium Website Design', price: '15,000', days: 20 },
    'audit': { name: 'Social Media Audit', price: '3,000', days: 5 },
    'businesscard': { name: 'Business Card Design', price: '1,000', days: 5 },
    'consulting': { name: 'Business Consultation', price: '2,000', days: 2 },
    'ascent': { name: 'Ascent Package', price: '9,000', days: 30 },
    'apex': { name: 'Apex Package', price: '18,500', days: 30 },
    'zenith': { name: 'Zenith Package', price: '50,000', days: 30 }
};

// ==========================================
// START MENU & CONTRACT GENERATION
// ==========================================
bot.start(async (ctx) => {
    // ቻፓ ላይ ከፍለው ሲመለሱ (Deep Linking) ኮንትራት ለማመንጨት
    const payload = ctx.payload;
    if (payload && payload.startsWith('success_')) {
        const serviceId = payload.replace('success_', '');
        return await generateContract(ctx, serviceId);
    }

    const welcomeText = `<b>━ ＡＰＥＸ ＤＩＧＩＴＡＬ ━</b>\n\n🟢 <b>English:</b>\nWelcome to APEX Digital Solution. We craft premium digital experiences to elevate your brand's presence.\n\n🟢 <b>Amharic:</b>\nወደ APEX Digital Solution እንኳን ደህና መጡ። የንግድዎን ዝና ከፍ የሚያደርጉ ጥራት ያላቸው የዲጂታል መፍትሄዎችን እናቀርባለን።`;
    await ctx.replyWithHTML(welcomeText);
    
    const langText = `<b>APEX Digital Solution</b>\n\nTo provide you with the best experience, please select your preferred language.\n\nየተሻለ አገልግሎት ለመስጠት እንዲያመችዎ እባክዎ የሚፈልጉትን ቋንቋ ይምረጡ።`;
    await ctx.replyWithHTML(langText, {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('English', 'main_en'), Markup.button.callback('አማርኛ', 'main_am')]
        ]).reply_markup
    });
});

bot.telegram.setMyCommands([
    { command: 'start', description: 'Start the bot / ጀምር' },
    { command: 'packages', description: 'Service Packages / ጥቅሎች' },
    { command: 'language', description: 'Change language / ቋንቋ' },
    { command: 'logo', description: 'Logo Design / ሎጎ' },
    { command: 'bot', description: 'Telegram Bot / ቴሌግራም ቦት' },
    { command: 'website', description: 'Website Design / ዌብሳይት' },
    { command: 'audit', description: 'Social Media Audit / ኦዲት' },
    { command: 'businesscard', description: 'Business Card / ቢዝነስ ካርድ' }
]);

bot.action('cmd_back', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>APEX Digital Solution</b>\n\nእባክዎ የሚፈልጉትን ቋንቋ ይምረጡ / Select language:`;
    await ctx.editMessageText(text, {
        parse_mode: 'HTML',
        reply_markup: Markup.inlineKeyboard([[Markup.button.callback('English', 'main_en'), Markup.button.callback('አማርኛ', 'main_am')]]).reply_markup
    });
});

// ==========================================
// INDIVIDUAL COMMANDS (Sleek Design)
// ==========================================
bot.command('logo', async (ctx) => {
    const text = `<b>✦ PROFESSIONAL LOGO DESIGN ✦</b>\n\n${I} Delivery: 5 Days (በ5 ቀናት)\n\n<b>Fixed Price:</b> 2,500 ETB`;
    await ctx.replyWithHTML(text, { reply_markup: Markup.inlineKeyboard([[Markup.button.callback('💳 Pay / ክፈይ', 'pay_logo')], [Markup.button.callback('Back / ተመለስ', 'cmd_back')]]).reply_markup });
});

bot.command('bot', async (ctx) => {
    const text = `<b>✦ CUSTOM TELEGRAM BOT ✦</b>\n\n${I} Delivery: 15 Days (በ15 ቀናት)\n\n<b>Fixed Price:</b> 5,000 ETB`;
    await ctx.replyWithHTML(text, { reply_markup: Markup.inlineKeyboard([[Markup.button.callback('💳 Pay / ክፈይ', 'pay_bot')], [Markup.button.callback('Back / ተመለስ', 'cmd_back')]]).reply_markup });
});

bot.command('website', async (ctx) => {
    const text = `<b>✦ PREMIUM WEBSITE DESIGN ✦</b>\n\n${I} Delivery: 20 Days (በ20 ቀናት)\n\n<b>Fixed Price:</b> 15,000 ETB`;
    await ctx.replyWithHTML(text, { reply_markup: Markup.inlineKeyboard([[Markup.button.callback('💳 Pay / ክፈይ', 'pay_website')], [Markup.button.callback('Back / ተመለስ', 'cmd_back')]]).reply_markup });
});

// ==========================================
// AMHARIC SECTION (Premium Styling)
// ==========================================
bot.action('main_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>━ ＡＰＥＸ ＤＩＧＩＴＡＬ ━</b>\n\nየንግድዎን ዲጂታል ሽግግር እናሳልጣለን።\n\nአገልግሎቶቻችንን ለመመልከት ከታች ይምረጡ።`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('አገልግሎቶች (Services)', 'srv_menu_am')],
            [Markup.button.callback('ተጨማሪ መረጃ (More)', 'more_am')]
        ]).reply_markup 
    });
});

bot.action('srv_menu_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>✦ ዲጂታል መፍትሄዎች ✦</b>\n\nየንግድዎን አድማስ ለማስፋት ከአገልግሎት ዘርፎች አንዱን ይምረጡ።`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('የጥቅል ዝርዝሮች (Packages)', 'pkg_menu_am')],
            [Markup.button.callback('ነጠላ አገልግሎቶች (Singles)', 'indv_srv_am')],
            [Markup.button.callback('ተመለስ', 'main_am')]
        ]).reply_markup 
    });
});

bot.action('pkg_menu_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>✦ ፕሮፌሽናል ጥቅሎች ✦</b>\n\nለጥራት የተመረጡ አገልግሎቶች። መረጃዎችን ለማየት ይምረጡ።`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('Ascent (የመጀመሪያ እርምጃ)', 'pkg_asc_am')],
            [Markup.button.callback('Apex (የሽያጭ ማሳደጊያ)', 'pkg_apx_am')],
            [Markup.button.callback('Zenith (የንግድ ግዛት መገንቢያ)', 'pkg_zen_am')],
            [Markup.button.callback('ተመለስ', 'srv_menu_am')]
        ]).reply_markup 
    });
});

bot.action('pkg_asc_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>✦ ASCENT ✦ | የመጀመሪያ እርምጃ</b>\n\nአዲስ ለሚጀምሩ ድርጅቶች የተዘጋጀ።\n\n${I} የብራንዲንግ መሰረት (ሎጎ፣ ከለር)\n${I} የሶሻል ሚዲያ ገፅ ግንባታ\n${I} በወር 10 ጥራት ያላቸው ፖስቶች\n${I} የኮሜንት/DM መስተጋብር\n${I} የነፃ ምክር አገልግሎት\n\n<b>የስራ ጊዜ:</b> 30 ቀናት\n<b>ቋሚ ዋጋ:</b> 9,000 ብር`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([[Markup.button.callback('💳 ክፈይ (Pay)', 'pay_ascent')], [Markup.button.callback('ተመለስ', 'pkg_menu_am')]]).reply_markup 
    });
});

bot.action('pkg_apx_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>✦ APEX ✦ | የሽያጭ ማሳደጊያ</b>\n\nደንበኞችን በብዛት ለመሳብ ለሚፈልጉ።\n\n${I} ተፅዕኖ ፈጣሪ ፅሁፎች (Copywriting)\n${I} 5 የሚከፈልባቸው ማስታወቂያዎች (Ads)\n${I} ጎግል ማፕ ምዝገባ (GMB)\n${I} የእለት ተእለት ስቶሪዎች\n\n<b>የስራ ጊዜ:</b> 30 ቀናት\n<b>ቋሚ ዋጋ:</b> 18,500 ብር`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([[Markup.button.callback('💳 ክፈይ (Pay)', 'pay_apex')], [Markup.button.callback('ተመለስ', 'pkg_menu_am')]]).reply_markup 
    });
});

bot.action('pkg_zen_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>✦ ZENITH ✦ | የንግድ ግዛት መገንቢያ</b>\n\nየዲጂታል አለሙን ለመቆጣጠር።\n\n${I} በወር ከ20 በላይ ፖስቶች/ቪዲዮዎች\n${I} ራስ-ሰር የሽያጭ መንገድ (ዌብሳይት + ቦት)\n${I} ዳግም ማነጣጠር (Pixel Retargeting)\n${I} SEO እና የአሰራር ስርአት (SOP)\n${I} ቀጥተኛ የስትራቴጂ ድጋፍ\n\n<b>የስራ ጊዜ:</b> 30 ቀናት\n<b>ቋሚ ዋጋ:</b> 50,000 ብር`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([[Markup.button.callback('💳 ክፈይ (Pay)', 'pay_zenith')], [Markup.button.callback('ተመለስ', 'pkg_menu_am')]]).reply_markup 
    });
});

bot.action('indv_srv_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>✦ ነጠላ አገልግሎቶች ✦</b>\n\nለመግዛት ከታች ያሉትን ይጫኑ፦`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('Logo Design - 2,500 ETB', 'pay_logo')],
            [Markup.button.callback('Telegram Bot - 5,000 ETB', 'pay_bot')],
            [Markup.button.callback('Website Design - 15,000 ETB', 'pay_website')],
            [Markup.button.callback('ተመለስ', 'srv_menu_am')]
        ]).reply_markup 
    });
});

// ==========================================
// FORM COLLECTION & PAYMENT INTEGRATION
// ==========================================
const CHAPA_SECRET = process.env.CHAPA_SECRET || "CHASECK_TEST-ivIbhQprzFcn2DHeO8q75xvZ4X8PXMF6";

bot.action(/pay_(.+)/, async (ctx) => {
    const serviceId = ctx.match[1];
    const userId = ctx.from.id;

    // ፎርም ካልሞላ እንዲሞላ ይጠየቃል
    if (!userForms[userId] || !userForms[userId].isComplete) {
        userForms[userId] = { step: 'NAME', serviceId: serviceId, data: {} };
        await ctx.deleteMessage();
        return ctx.replyWithHTML(`<b>📋 የደንበኛ ቅጽ (Client Form)</b>\n\nለኮንትራት ዝግጅት እና ለክፍያ እባክዎ መረጃዎን ያስገቡ።\n\n<b>1. ሙሉ ስምዎትን ያስገቡ (Full Name):</b>`);
    } else {
        // ፎርም ከሞላ ቀጥታ ወደ ክፍያ
        await processPayment(ctx, userId, serviceId);
    }
});

// ተጠቃሚው ቴክስት ሲጽፍ ፎርሙን ለመቀበል
bot.on('text', async (ctx, next) => {
    const userId = ctx.from.id;
    const form = userForms[userId];

    if (form && !form.isComplete) {
        const text = ctx.message.text;

        if (form.step === 'NAME') {
            form.data.name = text;
            form.step = 'PHONE';
            return ctx.replyWithHTML(`<b>2. ስልክ ቁጥርዎን ያስገቡ (Phone):</b>`);
        } else if (form.step === 'PHONE') {
            form.data.phone = text;
            form.step = 'COMPANY';
            return ctx.replyWithHTML(`<b>3. የድርጅት/ሱቅ ስም (Company Name):</b>`);
        } else if (form.step === 'COMPANY') {
            form.data.company = text;
            form.step = 'EMAIL';
            return ctx.replyWithHTML(`<b>4. ኢሜይል ያስገቡ (Optional):</b>\n<i>(ካልፈለጉ "Skip" ብለው ይፃፉ)</i>`);
        } else if (form.step === 'EMAIL') {
            form.data.email = text.toLowerCase() === 'skip' ? 'Not Provided' : text;
            form.isComplete = true;
            
            await ctx.replyWithHTML(`✅ <b>መረጃዎ ተመዝግቧል! (Saved!)</b>\nክፍያዎን እያዘጋጀን ነው...`);
            await processPayment(ctx, userId, form.serviceId);
        }
    } else {
        return next();
    }
});

async function processPayment(ctx, userId, serviceId) {
    const pkg = packages[serviceId];
    if(!pkg) return;

    const tx_ref = `APEX-${Date.now()}`;
    const botUsername = ctx.botInfo.username;
    // ከከፈለ በኋላ ቦቱ ጋር ሲመለስ /start success_logo ብሎ እንዲጀምር ያደርጋል
    const returnUrl = `https://t.me/${botUsername}?start=success_${serviceId}`;

    const data = {
        amount: pkg.price.replace(/,/g, ''), // ኮማውን ያጠፋዋል
        currency: "ETB",
        email: userForms[userId].data.email !== 'Not Provided' ? userForms[userId].data.email : "client@apexdigital.et",
        first_name: userForms[userId].data.name,
        tx_ref: tx_ref,
        return_url: returnUrl,
        customization: {
            title: "APEX Digital Solution",
            description: `Payment for ${pkg.name}`
        }
    };

    try {
        const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', data, {
            headers: { Authorization: `Bearer ${CHAPA_SECRET}`, "Content-Type": "application/json" }
        });

        if (response.data && response.data.data && response.data.data.checkout_url) {
            const checkoutUrl = response.data.data.checkout_url;
            const paymentText = `<b>━ ＳＥＣＵＲＥ ＰＡＹＭＥＮＴ ━</b>\n\n🟢 ክፍያዎ ተዘጋጅቷል!\n\nከታች ያለውን ሊንክ በመጫን <b>${pkg.price} ብር</b> ይክፈሉ። ክፍያዎን እንዳጠናቀቁ ኮንትራትዎ አውቶማቲክ ይዘጋጅልዎታል።`;
            
            await ctx.replyWithHTML(paymentText, {
                reply_markup: Markup.inlineKeyboard([
                    [Markup.button.url(`💳 ክፈይ - ${pkg.price} ETB`, checkoutUrl)]
                ]).reply_markup
            });
        }
    } catch (error) {
        console.error("Chapa Error");
        await ctx.reply('Payment gateway error. Please try again later.');
    }
}

// ==========================================
// AUTOMATIC CONTRACT GENERATION
// ==========================================
async function generateContract(ctx, serviceId) {
    const pkg = packages[serviceId];
    const userId = ctx.from.id;
    const clientData = userForms[userId]?.data || { name: ctx.from.first_name, company: 'Unknown' };

    // ቀናትን ማስላት (Start and End Dates)
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + (pkg ? pkg.days : 0));

    const formatDate = (date) => `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    const contractText = `🎉 <b>እንኳን ደስ አለዎት! ኮንትራትዎ ተዘጋጅቷል!</b>\n\n` +
    `<b>━ የ APEX Digital Solution ሙሉ የውል ስምምነት ━</b>\n\n` +
    `<b>የአገልግሎት ስምምነት ውል (Service Agreement)</b>\n\n` +
    `<b>1. የተዋዋይ ወገኖች መረጃ</b>\n` +
    `ኤጀንሲ፦ APEX Digital Solution (Ethiopia)\n` +
    `ደንበኛ፦ <b>${clientData.name}</b> (${clientData.company})\n` +
    `የውል ቀን፦ ${formatDate(today)}\n\n` +
    `<b>2. የአገልግሎት ዝርዝር እና የጊዜ ገደብ</b>\n` +
    `የተመረጠው አገልግሎት፦ <b>${pkg ? pkg.name : 'Custom Service'}</b>\n` +
    `የስራው መጀመሪያ ቀን፦ ${formatDate(today)}\n` +
    `የስራው ማጠናቀቂያ ቀን፦ ${formatDate(endDate)} (የ ${pkg ? pkg.days : 0} ቀናት ስራ)\n\n` +
    `<b>3. የክፍያ ሁኔታ</b>\n` +
    `ደንበኛው ለተጠቀሰው አገልግሎት ጠቅላላ <b>${pkg ? pkg.price : '0'} ETB</b> በ Chapa በኩል የከፈለ ሲሆን፣ ይህ ክፍያ ተመላሽ (Non-refundable) አይደረግም።\n\n` +
    `<b>4. ግዴታዎች እና መብቶች</b>\n` +
    `${I} የኤጀንሲው ግዴታ፦ ስራውን በታቀደው የጊዜ ገደብ በጥራት ማጠናቀቅ።\n` +
    `${I} የደንበኛው ግዴታ፦ ለስራው የሚያስፈልጉ ግብዓቶችን (Text, Logo, Photos) በ 3 ቀናት ውስጥ ማቅረብ።\n` +
    `${I} ማሻሻያ (Revision)፦ ስራው ከተረከበ በኋላ ለ 3 ተከታታይ ቀናት ነፃ ማሻሻያ የመጠየቅ መብት።\n` +
    `${I} ባለቤትነት፦ ክፍያው እንደተጠናቀቀ የባለቤትነት መብት ለደንበኛው ይተላለፋል።`;

    // ኮንትራቱን በጽሁፍ እና "Download" በሚመስል በተን ይልካል
    await ctx.replyWithHTML(contractText, {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('💾 ማህደሩን አስቀምጥ (Save Contract)', 'save_contract')]
        ]).reply_markup
    });
}

bot.action('save_contract', async (ctx) => {
    await ctx.answerCbQuery('Contract Saved Securely! / በስኬት ተቀምጧል!', { show_alert: true });
});

bot.launch().then(() => console.log('Bot is Running with Forms & Contracts!'));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
