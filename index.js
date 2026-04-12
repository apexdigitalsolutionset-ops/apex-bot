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

bot.use(session());

const I = '➢'; 
const TITLE = '<b><i><code>APEX Digital Solution</code></i></b>';

bot.use((ctx, next) => {
    ctx.session ??= { form: {}, step: 'idle', pendingContract: null, formStatus: 'incomplete', lang: 'am' };
    return next();
});

function getContractDates(durationDays) {
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + parseInt(durationDays));
    const formatDate = (d) => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    return { start: formatDate(start), end: formatDate(end) };
}

// ==========================================
// 1. START & LANGUAGE
// ==========================================
bot.start(async (ctx) => {
    ctx.session = { form: {}, step: 'idle', pendingContract: null, formStatus: 'incomplete', lang: 'am' };
    const langText = `${TITLE}\n\n${I} To provide you with the best experience, please select your preferred language.\n\n${I} የተሻለ አገልግሎት ለመስጠት እንዲያመችዎ እባክዎ የሚፈልጉትን ቋንቋ ይምረጡ።`;
    await ctx.replyWithHTML(langText, {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('English', 'lang_en'), Markup.button.callback('አማርኛ', 'lang_am')]
        ]).reply_markup
    });
});

bot.action('cmd_lang', async (ctx) => {
    await ctx.answerCbQuery();
    const langText = `${TITLE}\n\n${I} Please select your preferred language.\n\n${I} እባክዎ የሚፈልጉትን ቋንቋ ይምረጡ።`;
    await ctx.editMessageText(langText, {
        parse_mode: 'HTML',
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('English', 'lang_en'), Markup.button.callback('አማርኛ', 'lang_am')]
        ]).reply_markup
    });
});

bot.action('lang_am', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.session.lang = 'am';
    await sendMainMenu(ctx);
});

bot.action('lang_en', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.session.lang = 'en';
    await sendMainMenu(ctx);
});

async function sendMainMenu(ctx) {
    const isEn = ctx.session.lang === 'en';
    const text = isEn 
        ? `${TITLE}\n\n${I} Elevating your digital presence.\n\n${I} Please choose an option below.` 
        : `${TITLE}\n\n${I} የንግድዎን ዲጂታል ሽግግር እናሳልጣለን።\n\n${I} ከታች ካሉት አማራጮች አንዱን ይምረጡ።`;

    const menu = [
        [Markup.button.callback(isEn ? 'Services' : 'አገልግሎቶች (Services)', 'menu_services')],
        [Markup.button.callback(isEn ? 'My Form' : 'የትዕዛዝ ፎርም (My Form)', 'start_form')],
        [Markup.button.callback(isEn ? 'More...' : 'ተጨማሪ (More...)', 'menu_more')],
        [Markup.button.callback(isEn ? 'Change Language' : 'ቋንቋ ቀይር', 'cmd_lang')]
    ];

    if (ctx.updateType === 'callback_query') {
        await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: { inline_keyboard: menu } });
    } else {
        await ctx.replyWithHTML(text, { reply_markup: { inline_keyboard: menu } });
    }
}

bot.action('menu_main', async (ctx) => {
    await ctx.answerCbQuery();
    await sendMainMenu(ctx);
});

// ==========================================
// 2. SERVICES MENU (Packages & Individuals)
// ==========================================
bot.action('menu_services', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn ? `${TITLE}\n\n${I} Strategic solutions for your digital growth.` : `${TITLE}\n\n${I} ለዲጂታል እድገትዎ ስልታዊ መፍትሄዎች።`;
    
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback(isEn ? 'Packages' : 'የጥቅል ዝርዝሮች', 'menu_packages')],
            [Markup.button.callback(isEn ? 'Individuals' : 'ነጠላ አገልግሎቶች', 'menu_individuals')],
            [Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_main')]
        ]).reply_markup 
    });
});

// --- Packages ---
bot.action('menu_packages', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn ? `${TITLE}\n\n${I} Professional Service Packages.` : `${TITLE}\n\n${I} የፕሮፌሽናል የአገልግሎት ጥቅሎች።`;
    
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('Ascent Package', 'pkg_asc')],
            [Markup.button.callback('Apex Package', 'pkg_apx')],
            [Markup.button.callback('Zenith Package', 'pkg_zen')],
            [Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_services')]
        ]).reply_markup 
    });
});

bot.action('pkg_asc', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn 
        ? `${TITLE}\n\n<b>[ Ascent Package ]</b>\n\n${I} Branding Basics (Logo & Identity)\n${I} Basic Web Setup\n${I} 10 Social Media Posts/Month\n\n<b>Fixed Price:</b> 9,000 ETB`
        : `${TITLE}\n\n<b>[ Ascent Package ]</b>\n\n${I} የብራንዲንግ መሰረት (Logo & Identity)\n${I} መሠረታዊ የገፅ ግንባታ\n${I} በወር 10 የሶሻል ሚዲያ ፖስቶች\n\n<b>ቋሚ ዋጋ:</b> 9,000 ብር`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(isEn ? 'Pay Now' : 'ክፈይ (Pay)', 'pay_Ascent_9000_30')], [Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_packages')]]).reply_markup });
});

bot.action('pkg_apx', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn 
        ? `${TITLE}\n\n<b>[ Apex Package ]</b>\n\n${I} Glassmorphism UI/UX Website\n${I} Advanced Ad Management\n${I} Google Dominance (SEO)\n\n<b>Fixed Price:</b> 18,500 ETB`
        : `${TITLE}\n\n<b>[ Apex Package ]</b>\n\n${I} Glassmorphism UI/UX ዌብሳይት\n${I} የላቀ የማስታወቂያ አስተዳደር\n${I} የጎግል የበላይነት (SEO)\n\n<b>ቋሚ ዋጋ:</b> 18,500 ብር`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(isEn ? 'Pay Now' : 'ክፈይ (Pay)', 'pay_Apex_18500_30')], [Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_packages')]]).reply_markup });
});

bot.action('pkg_zen', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn 
        ? `${TITLE}\n\n<b>[ Zenith Package ]</b>\n\n${I} Full Agency Automation\n${I} Telegram Bot Integrations\n${I} AI Tools & Dropshipping Setup\n\n<b>Fixed Price:</b> 50,000 ETB`
        : `${TITLE}\n\n<b>[ Zenith Package ]</b>\n\n${I} ሙሉ የኤጀንሲ አውቶሜሽን\n${I} ቴሌግራም ቦት ትስስር\n${I} AI Tools እና Dropshipping አዘገጃጀት\n\n<b>ቋሚ ዋጋ:</b> 50,000 ብር`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(isEn ? 'Pay Now' : 'ክፈይ (Pay)', 'pay_Zenith_50000_30')], [Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_packages')]]).reply_markup });
});

// --- Individuals ---
bot.action('menu_individuals', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn 
        ? `${TITLE}\n\n<b>Individual Services</b>\n\n${I} Select a service below to order.`
        : `${TITLE}\n\n<b>ነጠላ አገልግሎቶች</b>\n\n${I} ለማዘዝ ከታች አንዱን ይምረጡ።`;
        
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('Logo Design (2,500 ETB)', 'pay_Logo_2500_5')],
            [Markup.button.callback('Website Dev (15,000 ETB)', 'pay_Website_15000_20')],
            [Markup.button.callback('Telegram Bot (5,000 ETB)', 'pay_Bot_5000_15')],
            [Markup.button.callback('Social Audit (3,000 ETB)', 'pay_Audit_3000_5')],
            [Markup.button.callback('Business Card (1,000 ETB)', 'pay_Card_1000_5')],
            [Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_services')]
        ]).reply_markup 
    });
});

// ==========================================
// 3. MORE MENU (About, Contact, FAQ, Support)
// ==========================================
bot.action('menu_more', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn ? `${TITLE}\n\n${I} More Information:` : `${TITLE}\n\n${I} ተጨማሪ መረጃዎች፡`;
    
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('About Us', 'more_about'), Markup.button.callback('Contact Us', 'more_contact')],
            [Markup.button.callback('FAQ', 'more_faq'), Markup.button.callback('Support', 'more_support')],
            [Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_main')]
        ]).reply_markup 
    });
});

bot.action('more_about', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn 
        ? `${TITLE}\n\n<b>About Us</b>\n\n${I} APEX Digital Solution (Est. 2026) is a premier digital agency based in Addis Ababa, Ethiopia.\n${I} We specialize in Website Design, Digital Marketing, Social Media Management, Branding, and Business Automation.`
        : `${TITLE}\n\n<b>ስለ እኛ (About Us)</b>\n\n${I} APEX Digital Solution አዲስ አበባ፣ ኢትዮጵያ ውስጥ የሚገኝ ዘመናዊ ዲጂታል ኤጀንሲ ነው።\n${I} በዌብሳይት ዲዛይን፣ ዲጂታል ማርኬቲንግ፣ ብራንዲንግ እና ቢዝነስ አውቶሜሽን ላይ ትልቅ ልምድ አለን።`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_more')]]).reply_markup });
});

bot.action('more_contact', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn 
        ? `${TITLE}\n\n<b>Contact Us</b>\n\n${I} Email: info@apexdigital.et\n${I} Location: Addis Ababa, Ethiopia\n${I} Telegram: @ApexDigitalSupport`
        : `${TITLE}\n\n<b>አድራሻ (Contact Us)</b>\n\n${I} ኢሜይል: info@apexdigital.et\n${I} አድራሻ: አዲስ አበባ፣ ኢትዮጵያ\n${I} ቴሌግራም: @ApexDigitalSupport`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_more')]]).reply_markup });
});

bot.action('more_faq', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn 
        ? `${TITLE}\n\n<b>FAQ</b>\n\n${I} Q: How long does a website take?\n${I} A: Typically 20 days.\n\n${I} Q: Do you offer revisions?\n${I} A: Yes, 3 consecutive days of free revisions are included.`
        : `${TITLE}\n\n<b>የሚዘወተሩ ጥያቄዎች (FAQ)</b>\n\n${I} ጥ: ዌብሳይት ለመስራት ስንት ቀን ይፈጃል?\n${I} መ: በአማካይ 20 ቀናት ይፈጃል።\n\n${I} ጥ: ማስተካከያ ማድረግ ይቻላል?\n${I} መ: አዎ፣ ስራው ካለቀ በኋላ ለ 3 ተከታታይ ቀናት ነፃ ማሻሻያ እናደርጋለን።`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_more')]]).reply_markup });
});

bot.action('more_support', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn 
        ? `${TITLE}\n\n<b>Support</b>\n\n${I} For immediate assistance or custom requests, please contact our support team at @ApexDigitalSupport.`
        : `${TITLE}\n\n<b>የደንበኞች ድጋፍ (Support)</b>\n\n${I} ለፈጣን ምላሽ እና ለተጨማሪ ጥያቄዎች እባክዎ @ApexDigitalSupport ላይ ያናግሩን።`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_more')]]).reply_markup });
});

// ==========================================
// 4. FORM FILLING SYSTEM
// ==========================================
bot.action('start_form', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    
    if (ctx.session.formStatus === 'completed') {
        const msg = isEn 
            ? `${TITLE}\n\n${I} <b>You have already filled out the form.</b>` 
            : `${TITLE}\n\n${I} <b>ፎርሙን አስቀድመው ሞልተዋል።</b>`;
            
        return ctx.editMessageText(msg, {
            parse_mode: 'HTML',
            reply_markup: Markup.inlineKeyboard([
                [Markup.button.callback(isEn ? 'Edit Form' : 'ፎርሙን አስተካክል', 'edit_form')],
                [Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_main')]
            ]).reply_markup
        });
    }

    ctx.session.step = 'name';
    const warningText = isEn 
        ? `${TITLE}\n\n${I} <b>WARNING</b>\nPlease provide accurate information.\n\n${I} 1. Enter your Full Name:`
        : `${TITLE}\n\n${I} <b>ማሳሰቢያ (WARNING)</b>\nእባክዎ ትክክለኛ መረጃዎችን ብቻ ያስገቡ!\n\n${I} 1. ሙሉ ስምዎን ያስገቡ:`;
        
    await ctx.editMessageText(warningText, { parse_mode: 'HTML' });
});

bot.action('edit_form', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    ctx.session.form = {};
    ctx.session.formStatus = 'incomplete';
    ctx.session.step = 'name';
    
    const text = isEn ? `${TITLE}\n\n${I} 1. Enter your Full Name:` : `${TITLE}\n\n${I} 1. ሙሉ ስምዎን ያስገቡ:`;
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
        ctx.session.formStatus = 'completed'; 
        
        const summary = isEn 
            ? `${TITLE}\n\n${I} <b>Form Saved Successfully!</b>\n\n${I} Name: ${ctx.session.form.name}\n${I} Phone: ${ctx.session.form.phone}\n${I} Company: ${ctx.session.form.company}`
            : `${TITLE}\n\n${I} <b>መረጃዎ በተሳካ ሁኔታ ተመዝግቧል!</b>\n\n${I} ስም: ${ctx.session.form.name}\n${I} ስልክ: ${ctx.session.form.phone}\n${I} ድርጅት: ${ctx.session.form.company}`;
        
        await ctx.replyWithHTML(summary, {
            reply_markup: Markup.inlineKeyboard([
                [Markup.button.callback(isEn ? 'Edit Form' : 'ፎርሙን አስተካክል', 'edit_form')],
                [Markup.button.callback(isEn ? 'Go to Services' : 'ወደ አገልግሎቶች', 'menu_services')]
            ]).reply_markup
        });
    } else {
        return next();
    }
});

// ==========================================
// 5. CHAPA PAYMENT & CONTRACT
// ==========================================
const CHAPA_SECRET = process.env.CHAPA_SECRET || "CHASECK_TEST-ivIbhQprzFcn2DHeO8q75xvZ4X8PXMF6";

bot.action(/pay_([a-zA-Z]+)_(\d+)_(\d+)/, async (ctx) => {
    const isEn = ctx.session.lang === 'en';
    const serviceName = ctx.match[1];
    const amount = ctx.match[2];
    const durationDays = ctx.match[3];
    
    if (ctx.session.formStatus !== 'completed') {
        await ctx.answerCbQuery(isEn ? 'Please fill the form first!' : 'እባክዎ መጀመሪያ ፎርም ይሙሉ!', { show_alert: true });
        return;
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
                ? `${TITLE}\n\n${I} <b>Payment Generated!</b>\n\n${I} Click the link below to pay <b>${amount} ETB</b>.`
                : `${TITLE}\n\n${I} <b>ክፍያ ተዘጋጅቷል!</b>\n\n${I} ከታች ያለውን ሊንክ በመጫን <b>${amount} ብር</b> ይክፈሉ።`;
            
            await ctx.editMessageText(paymentText, {
                parse_mode: 'HTML',
                reply_markup: Markup.inlineKeyboard([
                    [Markup.button.url(isEn ? 'Pay Now' : 'ይክፈሉ (Pay Now)', response.data.data.checkout_url)],
                    [Markup.button.callback(isEn ? 'Check Payment' : 'ክፍያ አጠናቅቄያለሁ', 'verify_payment')],
                    [Markup.button.callback(isEn ? 'Cancel' : 'ተመለስ', 'menu_services')]
                ]).reply_markup
            });
        }
    } catch (error) {
        await ctx.answerCbQuery('Payment error.', { show_alert: true });
    }
});

bot.action('verify_payment', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    
    if (!ctx.session || !ctx.session.pendingContract) {
        return ctx.replyWithHTML(`${TITLE}\n\n${I} ${isEn ? 'No payment found.' : 'የክፍያ መረጃ አልተገኘም።'}`);
    }

    const { serviceName, amount, durationDays } = ctx.session.pendingContract;
    const clientName = ctx.session.form.name;
    const dates = getContractDates(durationDays);

    const contractText = isEn ? `
${TITLE}
<b>APEX Digital Solution Agreement</b>

<b>Parties Involved</b>
${I} Agency: APEX Digital Solution
${I} Client: <b>${clientName}</b>

<b>Service Details</b>
${I} Selected Service: <b>${serviceName}</b>
${I} Duration: <b>${durationDays}</b> Days

<b>Payment Terms</b>
${I} The Client has paid <b>${amount} ETB</b>.
` : `
${TITLE}
<b>የ APEX Digital Solution ውል ስምምነት</b>

<b>የተዋዋይ ወገኖች መረጃ</b>
${I} ኤጀንሲ፦ APEX Digital Solution
${I} ደንበኛ፦ <b>${clientName}</b>

<b>የአገልግሎት ዝርዝር</b>
${I} የተመረጠው አገልግሎት፦ <b>${serviceName}</b>
${I} የጊዜ ገደብ፦ <b>${durationDays}</b> ቀናት

<b>የክፍያ ሁኔታ</b>
${I} ደንበኛው <b>${amount} ETB</b> ከፍሏል።
`;

    await ctx.replyWithHTML(`${contractText}`, {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('Download PDF Contract', 'download_pdf')]
        ]).reply_markup
    });
});

bot.action('download_pdf', async (ctx) => {
    await ctx.answerCbQuery('Generating PDF...');
    const { serviceName, amount, durationDays } = ctx.session.pendingContract;
    const clientName = ctx.session.form.name;

    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    
    doc.on('end', async () => {
        const pdfData = Buffer.concat(buffers);
        await ctx.replyWithDocument(
            { source: pdfData, filename: `APEX_Contract_${clientName.replace(/\s+/g, '_')}.pdf` },
            { caption: `${I} Contract / የውል ስምምነት` }
        );
    });

    doc.fontSize(20).text('APEX Digital Solution', { align: 'center' }).moveDown();
    doc.fontSize(16).text('Service Agreement Contract', { underline: true, align: 'center' }).moveDown(2);
    
    doc.fontSize(12)
       .text(`Client Name: ${clientName}`)
       .text(`Service: ${serviceName}`)
       .text(`Duration: ${durationDays} Days`)
       .text(`Amount Paid: ${amount} ETB`)
       .moveDown();

    doc.end();
});

bot.launch().then(() => console.log("Bot started successfully!"));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
