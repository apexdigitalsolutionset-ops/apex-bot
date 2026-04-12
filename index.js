const { Telegraf, Markup, session } = require('telegraf');
const express = require('express');
const axios = require('axios');
const PDFDocument = require('pdfkit');
require('dotenv').config();

const app = express();
app.get('/', (req, res) => res.send('APEX Bot is Live!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

const I = '🟢'; 
const CHAPA_SECRET = process.env.CHAPA_SECRET || "CHASECK_TEST-ivIbhQprzFcn2DHeO8q75xvZ4X8PXMF6";

// Session Initialization
bot.use((ctx, next) => {
    ctx.session ??= { form: {}, step: 'idle', pendingContract: null, formStatus: 'incomplete', lang: 'en' };
    return next();
});

// ==========================================
// 1. START & LANGUAGE SELECTION
// ==========================================
bot.start(async (ctx) => {
    ctx.session = { form: {}, step: 'idle', pendingContract: null, formStatus: 'incomplete', lang: 'en' };
    const welcomeText = `${I} <b>English:</b>\nWelcome to APEX Digital Solution. We craft premium digital experiences to elevate your brand's presence. Let's start building your success.\n\n${I} <b>Amharic:</b>\nወደ APEX Digital Solution እንኳን ደህና መጡ። የንግድዎን ዝና ከፍ የሚያደርጉ ጥራት ያላቸው የዲጂታል መፍትሄዎችን እናቀርባለን። የስኬት ጉዞዎን አብረን እንጀምር።`;
    await ctx.replyWithHTML(welcomeText);
    
    const langText = `<b>APEX Digital Solution</b>\n\nTo provide you with the best experience, please select your preferred language.\n\nየተሻለ አገልግሎት ለመስጠት እንዲያመችዎ እባክዎ የሚፈልጉትን ቋንቋ ይምረጡ።`;
    await ctx.replyWithHTML(langText, {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('English', 'lang_en'), Markup.button.callback('አማርኛ', 'lang_am')]
        ]).reply_markup
    });
});

bot.action('cmd_lang', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>APEX Digital Solution</b>\n\nPlease select your preferred language.\n\nእባክዎ የሚፈልጉትን ቋንቋ ይምረጡ።`;
    await ctx.editMessageText(text, {
        parse_mode: 'HTML',
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('English', 'lang_en'), Markup.button.callback('አማርኛ', 'lang_am')]
        ]).reply_markup
    });
});

// ==========================================
// 2. MAIN MENU (Services, Form, More)
// ==========================================
bot.action('lang_en', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.session.lang = 'en';
    await sendMainMenu(ctx, 'en');
});

bot.action('lang_am', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.session.lang = 'am';
    await sendMainMenu(ctx, 'am');
});

bot.action('main_menu', async (ctx) => {
    await ctx.answerCbQuery();
    await sendMainMenu(ctx, ctx.session.lang);
});

async function sendMainMenu(ctx, lang) {
    const isEn = lang === 'en';
    const text = isEn 
        ? `<b>APEX Digital Solution</b>\n\nPartnering in your digital transformation.\nSelect an option below.`
        : `<b>APEX Digital Solution</b>\n\nየንግድዎን ዲጂታል ሽግግር እናሳልጣለን።\nከታች ካሉት አማራጮች አንዱን ይምረጡ።`;

    const menu = [
        [Markup.button.callback(isEn ? 'Services' : 'አገልግሎቶች (Services)', 'menu_services')],
        [Markup.button.callback(isEn ? 'My Form' : 'የትዕዛዝ ፎርም (My Form)', 'start_form')],
        [Markup.button.callback(isEn ? 'More...' : 'ተጨማሪ (More...)', 'menu_more')],
        [Markup.button.callback(isEn ? 'Change Language' : 'ቋንቋ ቀይር', 'cmd_lang')]
    ];
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: { inline_keyboard: menu } });
}

// ==========================================
// 3. MORE MENU (Support, About Us, Contact Us, FAQ)
// ==========================================
bot.action('menu_more', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn ? `<b>APEX Digital Solution</b>\n\nMore Information:` : `<b>APEX Digital Solution</b>\n\nተጨማሪ መረጃዎች፡`;
    
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('Support', 'more_sup'), Markup.button.callback('About Us', 'more_abt')],
            [Markup.button.callback('Contact Us', 'more_cnt'), Markup.button.callback('FAQ', 'more_faq')],
            [Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'main_menu')]
        ]).reply_markup 
    });
});

bot.action('more_sup', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn ? `<b>Support</b>\n\n${I} Contact our support team directly at @Farisman72` : `<b>የደንበኞች ድጋፍ</b>\n\n${I} ፈጣን ድጋፍ ለማግኘት @Farisman72 ላይ ያናግሩን።`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.url('Support', 'https://t.me/Farisman72')], [Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_more')]]).reply_markup });
});

bot.action('more_abt', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn ? `<b>About Us</b>\n\nAPEX Digital Solution is a high-end digital agency dedicated to transforming businesses through premium UI/UX design and intelligent automation.` : `<b>ስለ እኛ</b>\n\nAPEX Digital Solution የቢዝነስዎን ዲጂታል ገጽታ በከፍተኛ ጥራት (Premium) እና በዘመናዊ ቴክኖሎጂ የሚቀይር ኤጀንሲ ነው።`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_more')]]).reply_markup });
});

bot.action('more_cnt', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn ? `<b>Contact Us</b>\n\n${I} Email: apexsolutions.et@gmail.com\n${I} Telegram: @ApexDigitalET` : `<b>አድራሻ</b>\n\n${I} ኢሜይል: apexsolutions.et@gmail.com\n${I} ቴሌግራም: @ApexDigitalET`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_more')]]).reply_markup });
});

bot.action('more_faq', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn ? `<b>FAQ</b>\n\n${I} We support Dropshipping, E-commerce, and build premium designs.` : `<b>ተደጋጋሚ ጥያቄዎች (FAQ)</b>\n\n${I} ለ Dropshipping፣ ኢ-ኮሜርስ እና አፕሊኬሽኖች የሚሆኑ ሙሉ ስትራቴጂዎችን እንሰራለን።`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_more')]]).reply_markup });
});

// ==========================================
// 4. SERVICES MENU (Packages & Individuals)
// ==========================================
bot.action('menu_services', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn ? `<b>Services</b>\n\nSelect a category below.` : `<b>አገልግሎቶች</b>\n\nከታች ካሉት ዘርፎች አንዱን ይምረጡ።`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback(isEn ? 'Packages' : 'የጥቅል ዝርዝሮች', 'menu_pkgs')],
            [Markup.button.callback(isEn ? 'Individuals' : 'ነጠላ አገልግሎቶች', 'menu_indv')],
            [Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'main_menu')]
        ]).reply_markup 
    });
});

// --- Packages ---
bot.action('menu_pkgs', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn ? `<b>Service Packages</b>\n\nChoose a package:` : `<b>የአገልግሎት ጥቅሎች</b>\n\nጥቅል ይምረጡ፡`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback(isEn ? 'Ascent (The Foundation)' : 'Ascent (የመጀመሪያው እርምጃ)', 'pkg_asc')],
            [Markup.button.callback(isEn ? 'Apex (The Growth Accelerator)' : 'Apex (የሽያጭ ማሳደጊያ)', 'pkg_apx')],
            [Markup.button.callback(isEn ? 'Zenith (The Empire Builder)' : 'Zenith (የንግድ ግዛት መገንቢያ)', 'pkg_zen')],
            [Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_services')]
        ]).reply_markup 
    });
});

bot.action('pkg_asc', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn ? `<b>[ Ascent ]</b>\n\n${I} Branding Foundation\n${I} Page Authority\n${I} 10 Posts/Month\n\n<b>Fixed Price:</b> 9,000 ETB` : `<b>[ Ascent ]</b>\n\n${I} የብራንዲንግ መሰረት\n${I} የገፅ ግንባታ\n${I} 10 ፖስቶች\n\n<b>ቋሚ ዋጋ:</b> 9,000 ብር`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(isEn ? 'Pay' : 'ክፈይ', 'pay_9000_Ascent')], [Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_pkgs')]]).reply_markup });
});
bot.action('pkg_apx', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn ? `<b>[ Apex ]</b>\n\n${I} Conversion Copywriting\n${I} Vantage Ad Management\n${I} Daily Dominance\n\n<b>Fixed Price:</b> 18,500 ETB` : `<b>[ Apex ]</b>\n\n${I} ተፅዕኖ ፈጣሪ ፅሁፎች\n${I} የማስታወቂያ አስተዳደር\n${I} የዕለት ተዕለት ክትትል\n\n<b>ቋሚ ዋጋ:</b> 18,500 ብር`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(isEn ? 'Pay' : 'ክፈይ', 'pay_18500_Apex')], [Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_pkgs')]]).reply_markup });
});
bot.action('pkg_zen', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn ? `<b>[ Zenith ]</b>\n\n${I} 20+ Posts/Reels\n${I} Automated Sales Funnel\n${I} SEO & Digital PR\n\n<b>Fixed Price:</b> 50,000 ETB` : `<b>[ Zenith ]</b>\n\n${I} 20+ ፖስቶች\n${I} ራስ-ሰር የሽያጭ መንገድ\n${I} SEO & Digital PR\n\n<b>ቋሚ ዋጋ:</b> 50,000 ብር`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(isEn ? 'Pay' : 'ክፈይ', 'pay_50000_Zenith')], [Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_pkgs')]]).reply_markup });
});

// --- Individuals (Integrated into Inline Buttons) ---
bot.action('menu_indv', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = isEn ? `<b>Individual Services</b>\n\nSelect a service below:` : `<b>ነጠላ አገልግሎቶች</b>\n\nከታች አንዱን ይምረጡ፡`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('Logo Design', 'indv_logo'), Markup.button.callback('Telegram Bot', 'indv_bot')],
            [Markup.button.callback('Website Design', 'indv_web'), Markup.button.callback('Social Audit', 'indv_aud')],
            [Markup.button.callback('Business Card', 'indv_card'), Markup.button.callback('Consulting', 'indv_con')],
            [Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_services')]
        ]).reply_markup 
    });
});

const sendIndvDetails = async (ctx, titleEn, titleAm, price, serviceName) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    const text = `<b>APEX Digital Solution</b>\n\n<b>${isEn ? titleEn : titleAm}</b>\n\n${I} ${isEn ? 'Fixed Price:' : 'ቋሚ ዋጋ:'} ${price} ETB`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback(isEn ? 'Pay' : 'ክፈይ', `pay_${price}_${serviceName}`)], 
            [Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'menu_indv')]
        ]).reply_markup 
    });
};

bot.action('indv_logo', (ctx) => sendIndvDetails(ctx, 'Professional Logo Design', 'የሎጎ ዲዛይን', '2500', 'Logo'));
bot.action('indv_bot', (ctx) => sendIndvDetails(ctx, 'Custom Telegram Bot', 'የቴሌግራም ቦት', '5000', 'Bot'));
bot.action('indv_web', (ctx) => sendIndvDetails(ctx, 'Premium Website Design', 'የዌብሳይት ስራ', '15000', 'Website'));
bot.action('indv_aud', (ctx) => sendIndvDetails(ctx, 'Social Media Audit', 'የሶሻል ሚዲያ ኦዲት', '3000', 'Audit'));
bot.action('indv_card', (ctx) => sendIndvDetails(ctx, 'Modern Business Card', 'የቢዝነስ ካርድ ዲዛይን', '1000', 'Card'));
bot.action('indv_con', (ctx) => sendIndvDetails(ctx, 'Strategic Consultation', 'የስትራቴጂ ምክር', '2000', 'Consulting'));

// ==========================================
// 5. FORM FILLING SYSTEM
// ==========================================
bot.action('start_form', async (ctx) => {
    await ctx.answerCbQuery();
    const isEn = ctx.session.lang === 'en';
    
    if (ctx.session.formStatus === 'completed') {
        const msg = isEn ? `<b>You have already filled out the form.</b>` : `<b>ፎርሙን አስቀድመው ሞልተዋል።</b>`;
        return ctx.editMessageText(msg, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(isEn ? 'Edit Form' : 'ፎርሙን አስተካክል', 'edit_form')], [Markup.button.callback(isEn ? 'Back' : 'ተመለስ', 'main_menu')]]).reply_markup });
    }

    ctx.session.step = 'name';
    const warningText = isEn 
        ? `${I} <b>WARNING</b>\nPlease provide accurate information.\n\n${I} 1. Enter your Full Name:`
        : `${I} <b>ማሳሰቢያ (WARNING)</b>\nእባክዎ ትክክለኛ መረጃዎችን ብቻ ያስገቡ!\n\n${I} 1. ሙሉ ስምዎን ያስገቡ:`;
    await ctx.editMessageText(warningText, { parse_mode: 'HTML' });
});

bot.action('edit_form', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.session.form = {};
    ctx.session.formStatus = 'incomplete';
    ctx.session.step = 'name';
    const text = ctx.session.lang === 'en' ? `${I} 1. Enter your Full Name:` : `${I} 1. ሙሉ ስምዎን ያስገቡ:`;
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
        ctx.session.step = 'idle';
        ctx.session.formStatus = 'completed'; 
        
        const summary = isEn 
            ? `${I} <b>Form Saved Successfully!</b>\n\n${I} Name: ${ctx.session.form.name}\n${I} Phone: ${ctx.session.form.phone}\n${I} Company: ${ctx.session.form.company}`
            : `${I} <b>መረጃዎ በተሳካ ሁኔታ ተመዝግቧል!</b>\n\n${I} ስም: ${ctx.session.form.name}\n${I} ስልክ: ${ctx.session.form.phone}\n${I} ድርጅት: ${ctx.session.form.company}`;
        
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
// 6. PAYMENT & CONTRACT SYSTEM
// ==========================================
bot.action(/pay_(\d+)_([a-zA-Z]+)/, async (ctx) => {
    const isEn = ctx.session.lang === 'en';
    const amount = ctx.match[1];
    const serviceName = ctx.match[2];
    
    if (ctx.session.formStatus !== 'completed') {
        await ctx.answerCbQuery(isEn ? 'Please fill the form first!' : 'እባክዎ መጀመሪያ ፎርም ይሙሉ!', { show_alert: true });
        return;
    }

    await ctx.answerCbQuery('Processing payment...', { show_alert: false });
    ctx.session.pendingContract = { serviceName, amount };

    const tx_ref = `APEX-${Date.now()}`;
    const data = {
        amount: amount.toString(),
        currency: "ETB",
        email: "client@apexdigital.et",
        first_name: ctx.session.form.name,
        last_name: "APEX",
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
                ? `<b>Payment Generated!</b>\n\n${I} Click below to pay <b>${amount} ETB</b>.`
                : `<b>ክፍያ ተዘጋጅቷል!</b>\n\n${I} ከታች ያለውን ሊንክ በመጫን <b>${amount} ብር</b> ይክፈሉ።`;
            
            await ctx.editMessageText(paymentText, {
                parse_mode: 'HTML',
                reply_markup: Markup.inlineKeyboard([
                    [Markup.button.url(isEn ? 'Pay Now' : 'ይክፈሉ', response.data.data.checkout_url)],
                    [Markup.button.callback(isEn ? 'Verify Payment & Get Contract' : 'ክፍያ አጠናቅቄያለሁ (ውል ስጠኝ)', 'verify_payment')],
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
        return ctx.replyWithHTML(isEn ? 'No payment found.' : 'የክፍያ መረጃ አልተገኘም።');
    }

    const { serviceName, amount } = ctx.session.pendingContract;
    const clientName = ctx.session.form.name;

    const contractText = isEn ? `
<b>APEX Digital Solution Agreement</b>
${I} Client: <b>${clientName}</b>
${I} Service: <b>${serviceName}</b>
${I} Amount: <b>${amount} ETB</b>
` : `
<b>የ APEX Digital Solution ውል</b>
${I} ደንበኛ፦ <b>${clientName}</b>
${I} አገልግሎት፦ <b>${serviceName}</b>
${I} ክፍያ፦ <b>${amount} ETB</b>
`;

    await ctx.replyWithHTML(contractText, {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('Download PDF Contract', 'download_pdf')]
        ]).reply_markup
    });
});

bot.action('download_pdf', async (ctx) => {
    await ctx.answerCbQuery('Generating PDF...');
    const { serviceName, amount } = ctx.session.pendingContract;
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
    doc.fontSize(16).text('Official Service Agreement', { underline: true, align: 'center' }).moveDown(2);
    doc.fontSize(12).text(`Client Name: ${clientName}`).text(`Service: ${serviceName}`).text(`Amount Paid: ${amount} ETB`).moveDown();
    doc.text('This is an official contract generated by APEX Digital Solution Bot.');
    doc.end();
});

bot.launch();
