const { Telegraf, Markup, session } = require('telegraf');
const express = require('express');
const axios = require('axios');
const PDFDocument = require('pdfkit');
require('dotenv').config();

const app = express();
app.get('/', (req, res) => res.send('APEX Bot is Live!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`➢ Server running on port ${PORT}`));

const bot = new Telegraf(process.env.BOT_TOKEN);

// Session ለፎርም እና ለኮንትራት መረጃ ማቆያ
bot.use(session());

// የተፈቀደው አይኮን እና ርዕስ
const I = '➢'; 
const TITLE = '<b><i><code>APEX Digital Solution</code></i></b>';

// ==========================================
// SESSION INITIALIZATION MIDDLEWARE
// ==========================================
bot.use((ctx, next) => {
    ctx.session ??= { form: {}, step: 'idle', pendingContract: null, formStatus: 'incomplete', lang: 'am' };
    return next();
});

// ==========================================
// DATE CALCULATION HELPER
// ==========================================
function getContractDates(durationDays) {
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + parseInt(durationDays));
    
    const formatDate = (d) => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    return { start: formatDate(start), end: formatDate(end) };
}

// ==========================================
// START MENU (Language Selection ONLY)
// ==========================================
bot.start(async (ctx) => {
    ctx.session = { form: {}, step: 'idle', pendingContract: null, formStatus: 'incomplete', lang: 'am' };
    
    const langText = `${TITLE}\n\n${I} To provide you with the best experience, please select your preferred language.\n\n${I} የተሻለ አገልግሎት ለመስጠት እንዲያመችዎ እባክዎ የሚፈልጉትን ቋንቋ ይምረጡ።`;
    
    await ctx.replyWithHTML(langText, {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('English', 'main_en'), Markup.button.callback('አማርኛ', 'main_am')]
        ]).reply_markup
    });
});

bot.action('cmd_back', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `${TITLE}\n\n${I} Please select your preferred language.\n\n${I} እባክዎ የሚፈልጉትን ቋንቋ ይምረጡ።`;
    await ctx.editMessageText(text, {
        parse_mode: 'HTML',
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('English', 'main_en'), Markup.button.callback('አማርኛ', 'main_am')]
        ]).reply_markup
    });
});

// ==========================================
// LANGUAGE MENUS (AMHARIC & ENGLISH)
// ==========================================

// --- AMHARIC MENU ---
bot.action('main_am', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.session.lang = 'am';
    const text = `${TITLE}\n\n${I} የንግድዎን ዲጂታል ሽግግር እናሳልጣለን።\n\n${I} አገልግሎቶቻችንን ለመመልከት ከታች ካሉት አማራጮች አንዱን ይምረጡ።`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('📝 የትዕዛዝ ፎርም (My Form)', 'start_form')],
            [Markup.button.callback('💼 አገልግሎቶች (Services)', 'srv_menu_am')],
            [Markup.button.callback('🌍 ቋንቋ ቀይር', 'cmd_back')]
        ]).reply_markup 
    });
});

bot.action('srv_menu_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `${TITLE}\n\n${I} ለዲጂታል እድገትዎ ስልታዊ መፍትሄዎች።`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('📦 የጥቅል ዝርዝሮች (Packages)', 'pkg_menu_am')],
            [Markup.button.callback('📌 ነጠላ አገልግሎቶች (Individuals)', 'indv_srv_am')],
            [Markup.button.callback('⬅️ ተመለስ', 'main_am')]
        ]).reply_markup 
    });
});

// --- ENGLISH MENU ---
bot.action('main_en', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.session.lang = 'en';
    const text = `${TITLE}\n\n${I} Elevating your digital presence.\n\n${I} Please choose an option below to explore our services.`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('📝 Order Form (My Form)', 'start_form')],
            [Markup.button.callback('💼 Services', 'srv_menu_en')],
            [Markup.button.callback('🌍 Change Language', 'cmd_back')]
        ]).reply_markup 
    });
});

bot.action('srv_menu_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `${TITLE}\n\n${I} Strategic solutions for your digital growth.`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('📦 Premium Packages', 'pkg_menu_en')],
            [Markup.button.callback('📌 Individual Services', 'indv_srv_en')],
            [Markup.button.callback('⬅️ Back', 'main_en')]
        ]).reply_markup 
    });
});

// ==========================================
// FORM FILLING SYSTEM (SMART LOGIC)
// ==========================================
bot.action('start_form', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    
    // ፎርም አስቀድሞ ከሞላ
    if (ctx.session.formStatus === 'completed') {
        const msg = isEn 
            ? `${TITLE}\n\n${I} ✅ <b>You have already filled out the form.</b>\nYour details are saved securely.` 
            : `${TITLE}\n\n${I} ✅ <b>ፎርሙን አስቀድመው ሞልተዋል።</b>\nመረጃዎ በጥንቃቄ ተቀምጧል።`;
            
        const editBtn = isEn ? '✏️ Edit Form' : '✏️ ፎርሙን አስተካክል';
        const backBtn = isEn ? '⬅️ Back to Services' : '⬅️ ወደ አገልግሎቶች ተመለስ';
        const backAction = isEn ? 'srv_menu_en' : 'srv_menu_am';

        return ctx.editMessageText(msg, {
            parse_mode: 'HTML',
            reply_markup: Markup.inlineKeyboard([
                [Markup.button.callback(editBtn, 'edit_form')],
                [Markup.button.callback(backBtn, backAction)]
            ]).reply_markup
        });
    }

    // አዲስ ፎርም ሲሆን
    ctx.session.step = 'name';
    const warningText = isEn 
        ? `${TITLE}\n\n${I} <b>WARNING</b>\nPlease provide accurate information. This is required for the legal contract.\n\n${I} 1. Enter your Full Name:`
        : `${TITLE}\n\n${I} <b>ማሳሰቢያ (WARNING)</b>\nእባክዎ ትክክለኛ መረጃዎችን ብቻ ያስገቡ! ይህ መረጃ ህጋዊ ውል ለመዋዋል ግዴታ ነው።\n\n${I} 1. ሙሉ ስምዎን ያስገቡ:`;
        
    await ctx.editMessageText(warningText, { parse_mode: 'HTML' });
});

bot.action('edit_form', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    ctx.session.form = {};
    ctx.session.formStatus = 'incomplete';
    ctx.session.step = 'name';
    
    const text = isEn 
        ? `${TITLE}\n\n${I} Starting over.\n\n${I} 1. Enter your Full Name:`
        : `${TITLE}\n\n${I} ፎርሙን እንደ አዲስ እየሞሉ ነው።\n\n${I} 1. ሙሉ ስምዎን ያስገቡ:`;
        
    await ctx.editMessageText(text, { parse_mode: 'HTML' });
});

bot.on('text', async (ctx, next) => {
    const step = ctx.session.step;
    const text = ctx.message.text;
    const isEn = ctx.session.lang === 'en';

    if (text.startsWith('/')) return next();

    if (step === 'name') {
        ctx.session.form.name = text;
        ctx.session.step = 'phone';
        await ctx.replyWithHTML(isEn ? `${I} 2. Enter Phone Number:` : `${I} 2. ስልክ ቁጥርዎን ያስገቡ:`);
    } else if (step === 'phone') {
        ctx.session.form.phone = text;
        ctx.session.step = 'company';
        await ctx.replyWithHTML(isEn ? `${I} 3. Enter Company/Brand Name:` : `${I} 3. የድርጅትዎን/ብራንድዎን ስም ያስገቡ:`);
    } else if (step === 'company') {
        ctx.session.form.company = text;
        ctx.session.step = 'email';
        await ctx.replyWithHTML(isEn ? `${I} 4. Enter Email (Optional, type 'skip' to pass):` : `${I} 4. ኢሜይል ያስገቡ (ከሌለዎት 'skip' ብለው ይፃፉ):`);
    } else if (step === 'email') {
        ctx.session.form.email = text.toLowerCase() === 'skip' ? 'N/A' : text;
        ctx.session.step = 'address';
        await ctx.replyWithHTML(isEn ? `${I} 5. Enter your Address:` : `${I} 5. አድራሻዎን ያስገቡ:`);
    } else if (step === 'address') {
        ctx.session.form.address = text;
        ctx.session.step = 'idle';
        ctx.session.formStatus = 'completed'; // ፎርም መሞላቱን ማረጋገጫ
        
        const summary = isEn 
            ? `${TITLE}\n\n${I} <b>Form Saved Successfully!</b>\n\n${I} Name: ${ctx.session.form.name}\n${I} Phone: ${ctx.session.form.phone}\n${I} Company: ${ctx.session.form.company}\n${I} Email: ${ctx.session.form.email}\n${I} Address: ${ctx.session.form.address}`
            : `${TITLE}\n\n${I} <b>መረጃዎ በተሳካ ሁኔታ ተመዝግቧል!</b>\n\n${I} ስም: ${ctx.session.form.name}\n${I} ስልክ: ${ctx.session.form.phone}\n${I} ድርጅት: ${ctx.session.form.company}\n${I} ኢሜይል: ${ctx.session.form.email}\n${I} አድራሻ: ${ctx.session.form.address}`;
        
        await ctx.replyWithHTML(summary, {
            reply_markup: Markup.inlineKeyboard([
                [Markup.button.callback(isEn ? '✏️ Edit Form' : '✏️ ፎርሙን አስተካክል', 'edit_form')],
                [Markup.button.callback(isEn ? '💼 Go to Services' : '💼 ወደ አገልግሎቶች', isEn ? 'srv_menu_en' : 'srv_menu_am')]
            ]).reply_markup
        });
    } else {
        return next();
    }
});

// ==========================================
// PACKAGE DETAILS (AMHARIC & ENGLISH)
// ==========================================

// --- AMHARIC PACKAGES ---
bot.action('pkg_menu_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `${TITLE}\n\n${I} የፕሮፌሽናል የአገልግሎት ጥቅሎች።`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('🚀 Ascent (የመጀመሪያው እርምጃ)', 'pkg_asc_am')],
            [Markup.button.callback('⚡ Apex (የሽያጭ ማሳደጊያ)', 'pkg_apx_am')],
            [Markup.button.callback('👑 Zenith (የንግድ ግዛት መገንቢያ)', 'pkg_zen_am')],
            [Markup.button.callback('⬅️ ተመለስ', 'srv_menu_am')]
        ]).reply_markup 
    });
});

bot.action('pkg_asc_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `${TITLE}\n\n<b>[ 🚀 Ascent - የመጀመሪያው እርምጃ ]</b>\n\n${I} የብራንዲንግ መሰረት (Logo & Identity)\n${I} መሠረታዊ የገፅ ግንባታ\n${I} በወር 10 የሶሻል ሚዲያ ፖስቶች\n\n<b>ቋሚ ዋጋ:</b> 9,000 ብር`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('💳 ክፈይ (Pay)', 'pay_Ascent_9000_30')], [Markup.button.callback('⬅️ ተመለስ', 'pkg_menu_am')]]).reply_markup });
});

bot.action('pkg_apx_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `${TITLE}\n\n<b>[ ⚡ Apex - የሽያጭ ማሳደጊያ ]</b>\n\n${I} Glassmorphism UI/UX ዌብሳይት\n${I} የላቀ የማስታወቂያ አስተዳደር\n${I} የጎግል የበላይነት (SEO)\n\n<b>ቋሚ ዋጋ:</b> 18,500 ብር`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('💳 ክፈይ (Pay)', 'pay_Apex_18500_30')], [Markup.button.callback('⬅️ ተመለስ', 'pkg_menu_am')]]).reply_markup });
});

bot.action('pkg_zen_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `${TITLE}\n\n<b>[ 👑 Zenith - የንግድ ግዛት መገንቢያ ]</b>\n\n${I} ሙሉ የኤጀንሲ አውቶሜሽን\n${I} ቴሌግራም ቦት ትስስር\n${I} AI Tools እና Dropshipping አዘገጃጀት\n\n<b>ቋሚ ዋጋ:</b> 50,000 ብር`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('💳 ክፈይ (Pay)', 'pay_Zenith_50000_30')], [Markup.button.callback('⬅️ ተመለስ', 'pkg_menu_am')]]).reply_markup });
});

bot.action('indv_srv_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `${TITLE}\n\n<b>📌 ነጠላ አገልግሎቶች</b>\n\n${I} ሎጎ (5 ቀን) - 2,500 ብር\n${I} ዌብሳይት (20 ቀን) - 15,000 ብር\n${I} ቴሌግራም ቦት (15 ቀን) - 5,000 ብር\n${I} ሶሻል ኦዲት (5 ቀን) - 3,000 ብር\n${I} ቢዝነስ ካርድ (5 ቀን) - 1,000 ብር`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('💳 ሎጎ ክፈይ', 'pay_Logo_2500_5'), Markup.button.callback('💳 ዌብሳይት ክፈይ', 'pay_Website_15000_20')],
            [Markup.button.callback('💳 ቦት ክፈይ', 'pay_Bot_5000_15'), Markup.button.callback('💳 ካርድ ክፈይ', 'pay_BusinessCard_1000_5')],
            [Markup.button.callback('⬅️ ተመለስ', 'srv_menu_am')]
        ]).reply_markup 
    });
});

// --- ENGLISH PACKAGES ---
bot.action('pkg_menu_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `${TITLE}\n\n${I} Professional Service Packages.`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('🚀 Ascent (Foundation)', 'pkg_asc_en')],
            [Markup.button.callback('⚡ Apex (Growth)', 'pkg_apx_en')],
            [Markup.button.callback('👑 Zenith (Empire)', 'pkg_zen_en')],
            [Markup.button.callback('⬅️ Back', 'srv_menu_en')]
        ]).reply_markup 
    });
});

bot.action('pkg_asc_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `${TITLE}\n\n<b>[ 🚀 Ascent - Foundation ]</b>\n\n${I} Branding Basics (Logo & Identity)\n${I} Basic Web Setup\n${I} 10 Social Media Posts/Month\n\n<b>Fixed Price:</b> 9,000 ETB`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('💳 Pay Now', 'pay_Ascent_9000_30')], [Markup.button.callback('⬅️ Back', 'pkg_menu_en')]]).reply_markup });
});

bot.action('pkg_apx_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `${TITLE}\n\n<b>[ ⚡ Apex - Growth ]</b>\n\n${I} Glassmorphism UI/UX Website\n${I} Advanced Ad Management\n${I} Google Dominance (SEO)\n\n<b>Fixed Price:</b> 18,500 ETB`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('💳 Pay Now', 'pay_Apex_18500_30')], [Markup.button.callback('⬅️ Back', 'pkg_menu_en')]]).reply_markup });
});

bot.action('pkg_zen_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `${TITLE}\n\n<b>[ 👑 Zenith - Empire ]</b>\n\n${I} Full Agency Automation\n${I} Telegram Bot Integrations\n${I} AI Tools & Dropshipping Setup\n\n<b>Fixed Price:</b> 50,000 ETB`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('💳 Pay Now', 'pay_Zenith_50000_30')], [Markup.button.callback('⬅️ Back', 'pkg_menu_en')]]).reply_markup });
});

bot.action('indv_srv_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `${TITLE}\n\n<b>📌 Individual Services</b>\n\n${I} Logo (5 Days) - 2,500 ETB\n${I} Website (20 Days) - 15,000 ETB\n${I} Telegram Bot (15 Days) - 5,000 ETB\n${I} Social Audit (5 Days) - 3,000 ETB\n${I} Business Card (5 Days) - 1,000 ETB`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('💳 Pay Logo', 'pay_Logo_2500_5'), Markup.button.callback('💳 Pay Website', 'pay_Website_15000_20')],
            [Markup.button.callback('💳 Pay Bot', 'pay_Bot_5000_15'), Markup.button.callback('💳 Pay Card', 'pay_BusinessCard_1000_5')],
            [Markup.button.callback('⬅️ Back', 'srv_menu_en')]
        ]).reply_markup 
    });
});

// ==========================================
// CHAPA API PAYMENT & CONTRACT GENERATION
// ==========================================
const CHAPA_SECRET = process.env.CHAPA_SECRET || "CHASECK_TEST-ivIbhQprzFcn2DHeO8q75xvZ4X8PXMF6";

bot.action(/pay_([a-zA-Z]+)_(\d+)_(\d+)/, async (ctx) => {
    const isEn = ctx.session.lang === 'en';
    const serviceName = ctx.match[1];
    const amount = ctx.match[2];
    const durationDays = ctx.match[3];
    
    // ፎርም መሞላቱን ማረጋገጥ
    if (ctx.session.formStatus !== 'completed') {
        const alertMsg = isEn ? 'Please fill the form first!' : 'እባክዎ መጀመሪያ ፎርም ይሙሉ!';
        const replyMsg = isEn ? `${TITLE}\n\n${I} You must fill out your details to generate a contract.` : `${TITLE}\n\n${I} ኮንትራት ለማዘጋጀት መጀመሪያ መረጃዎን ማስገባት አለቦት።`;
        
        await ctx.answerCbQuery(alertMsg, { show_alert: true });
        return ctx.replyWithHTML(replyMsg, {
            reply_markup: Markup.inlineKeyboard([[Markup.button.callback(isEn ? '📝 Fill Form' : '📝 ፎርም ሙላ', 'start_form')]]).reply_markup
        });
    }

    await ctx.answerCbQuery('Processing payment...', { show_alert: false });

    ctx.session.pendingContract = { serviceName, amount, durationDays };

    const tx_ref = `APEX-${Date.now()}`;
    const data = {
        amount: amount.toString(),
        currency: "ETB",
        email: ctx.session.form.email !== 'N/A' ? ctx.session.form.email : "client@apexdigital.et",
        first_name: ctx.session.form.name,
        last_name: "Client",
        tx_ref: tx_ref,
        return_url: "https://t.me/ApexDigitalET",
        customization: { title: "APEX Digital Solution", description: `Payment for ${serviceName}` }
    };

    try {
        const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', data, {
            headers: { Authorization: `Bearer ${CHAPA_SECRET}`, "Content-Type": "application/json" }
        });

        if (response.data?.data?.checkout_url) {
            const paymentText = isEn 
                ? `${TITLE}\n\n${I} <b>Payment Generated!</b>\n\n${I} Click the link below to pay <b>${amount} ETB</b>. After payment, click 'Check Payment'.`
                : `${TITLE}\n\n${I} <b>ክፍያ ተዘጋጅቷል!</b>\n\n${I} ከታች ያለውን ሊንክ በመጫን <b>${amount} ብር</b> ይክፈሉ። ከከፈሉ በኋላ 'ክፍያ አጠናቅቄያለሁ' የሚለውን ይጫኑ።`;
            
            await ctx.editMessageText(paymentText, {
                parse_mode: 'HTML',
                reply_markup: Markup.inlineKeyboard([
                    [Markup.button.url(isEn ? '🔗 Pay Now' : '🔗 ይክፈሉ (Pay Now)', response.data.data.checkout_url)],
                    [Markup.button.callback(isEn ? '✅ Check Payment' : '✅ ክፍያ አጠናቅቄያለሁ', 'verify_payment')],
                    [Markup.button.callback(isEn ? '⬅️ Cancel' : '⬅️ ተመለስ', isEn ? 'srv_menu_en' : 'srv_menu_am')]
                ]).reply_markup
            });
        } else {
            await ctx.answerCbQuery('Failed to initialize payment.', { show_alert: true });
        }
    } catch (error) {
        await ctx.answerCbQuery('Payment error. Please try again.', { show_alert: true });
    }
});

// Verify Payment and Generate Contract
bot.action('verify_payment', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    
    if (!ctx.session || !ctx.session.pendingContract) {
        return ctx.replyWithHTML(`${TITLE}\n\n${I} ${isEn ? 'No pending payment found.' : 'የክፍያ መረጃ አልተገኘም።'}`);
    }

    const { serviceName, amount, durationDays } = ctx.session.pendingContract;
    const clientName = ctx.session.form.name;
    const dates = getContractDates(durationDays);

    const contractText = isEn ? `
${TITLE}
<b>APEX Digital Solution Full Agreement</b>

${I} Valid for both Package and Individual Services.
<b>Service Agreement Contract</b>

<b>Parties Involved</b>
${I} Agency: APEX Digital Solution (Ethiopia)
${I} Client: <b>${clientName}</b> (Hereinafter referred to as "Client")
${I} Date: ${dates.start}

<b>Service Details & Timeline</b>
${I} Selected Service/Package: <b>${serviceName}</b>
${I} Start Date: ${dates.start}
${I} End Date: ${dates.end} (Total <b>${durationDays}</b> Days of work)

<b>Payment Terms</b>
${I} The Client has paid a total of <b>${amount} ETB</b> via Chapa. This payment is non-refundable.

<b>Obligations & Rights</b>
${I} Agency: Deliver high-quality work within the deadline.
${I} Client: Provide required assets within 2 days.
${I} Revisions: 3 consecutive days of free revisions after delivery.
${I} Ownership: Full ownership transfers upon completion.
` : `
${TITLE}
<b>የ APEX Digital Solution ሙሉ የውል ስምምነት</b>

${I} ይህ ፎርማት ለጥቅልም ሆነ ለንጥል ስራዎች ይሆናል።
<b>የአገልግሎት ስምምነት ውል (Service Agreement)</b>

<b>የተዋዋይ ወገኖች መረጃ</b>
${I} ኤጀንሲ፦ APEX Digital Solution (Ethiopia)
${I} ደንበኛ፦ <b>${clientName}</b> (ከዚህ በኋላ "ደንበኛ" እየተባለ የሚጠራ)
${I} የውል ቀን፦ ${dates.start}

<b>የአገልግሎት ዝርዝር እና የጊዜ ገደብ</b>
${I} የተመረጠው አገልግሎት/ጥቅል፦ <b>${serviceName}</b>
${I} የስራው መጀመሪያ ቀን፦ ${dates.start}
${I} የስራው ማጠናቀቂያ ቀን፦ ${dates.end} (ጠቅላላ የ <b>${durationDays}</b> ቀናት ስራ)

<b>የክፍያ ሁኔታ</b>
${I} ደንበኛው ለተጠቀሰው አገልግሎት ጠቅላላ <b>${amount} ETB</b> በ Chapa በኩል የከፈለ ሲሆን፣ ይህ ክፍያ ተመላሽ (Non-refundable) አይደረግም።

<b>ግዴታዎች እና መብቶች</b>
${I} የኤጀንሲው ግዴታ፦ ስራውን በታቀደው የጊዜ ገደብ በጥራት ማጠናቀቅ።
${I} የደንበኛው ግዴታ፦ ለስራው የሚያስፈልጉ ግብዓቶችን በ 2 ቀናት ውስጥ ማቅረብ።
${I} ማሻሻያ፦ ስራው ከተረከበ በኋላ ለ 3 ቀናት ነፃ ማሻሻያ የመጠየቅ መብት።
${I} ባለቤትነት፦ ክፍያው እንደተጠናቀቀ የዲዛይኑ ባለቤትነት ለደንበኛው ይተላለፋል።
`;

    const successMsg = isEn ? `<b>Congratulations! Your contract is ready.</b>` : `<b>እንኳን ደስ አለዎት! ኮንትራትዎ ተዘጋጅቷል::</b>`;

    await ctx.replyWithHTML(`${TITLE}\n\n${successMsg}\n\n${contractText}`, {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('📄 Download PDF Contract', 'download_pdf')]
        ]).reply_markup
    });
});

// Generate and Send PDF
bot.action('download_pdf', async (ctx) => {
    await ctx.answerCbQuery('Generating PDF...', { show_alert: false });
    const isEn = ctx.session.lang === 'en';
    
    const { serviceName, amount, durationDays } = ctx.session.pendingContract;
    const clientName = ctx.session.form.name;
    const dates = getContractDates(durationDays);

    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    
    doc.on('end', async () => {
        const pdfData = Buffer.concat(buffers);
        await ctx.replyWithDocument(
            { source: pdfData, filename: `APEX_Contract_${clientName.replace(/\s+/g, '_')}.pdf` },
            { caption: isEn ? `${I} Here is your official contract.` : `${I} የውል ስምምነትዎ ይኸው (Here is your contract).` }
        );
    });

    doc.fontSize(20).text('APEX Digital Solution', { align: 'center' }).moveDown();
    doc.fontSize(16).text('Service Agreement Contract', { underline: true, align: 'center' }).moveDown(2);
    
    doc.fontSize(12)
       .text(`Agency: APEX Digital Solution (Ethiopia)`)
       .text(`Client Name: ${clientName}`)
       .text(`Contract Date: ${dates.start}`)
       .moveDown();
       
    doc.text(`Selected Service/Package: ${serviceName}`)
       .text(`Start Date: ${dates.start}`)
       .text(`End Date: ${dates.end} (Total ${durationDays} Days)`)
       .moveDown();

    doc.text(`Payment Terms:`)
       .text(`The client has paid a total of ${amount} ETB via Chapa. This payment is non-refundable.`)
       .moveDown();

    doc.text(`Obligations & Rights:`)
       .text(`- Agency: Deliver high-quality work within the deadline.`)
       .text(`- Client: Provide required assets (Text, Logo, Photos) within 2 days.`)
       .text(`- Revisions: 3 consecutive days of free revisions after delivery.`)
       .text(`- Ownership: Full ownership transfers to the client upon completion.`);

    doc.end();
});

bot.launch().then(() => console.log("Bot started successfully!"));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
