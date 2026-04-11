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

// የተፈቀደው አይኮን ብቻ
const I = '➢'; 
const TITLE = '<b><i><code>APEX Digital Solution</code></i></b>';

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
    // ፎርም ሪሴት ማድረግ
    ctx.session = { form: {}, step: 'idle', pendingContract: null };
    
    const langText = `${TITLE}\n\n${I} To provide you with the best experience, please select your preferred language.\n\n${I} የተሻለ አገልግሎት ለመስጠት እንዲያመችዎ እባክዎ የሚፈልጉትን ቋንቋ ይምረጡ።`;
    
    await ctx.replyWithHTML(langText, {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('English', 'main_en'), Markup.button.callback('አማርኛ', 'main_am')]
        ]).reply_markup
    });
});

// ==========================================
// MENU COMMANDS
// ==========================================
bot.telegram.setMyCommands([
    { command: 'start', description: 'Start the bot / ጀምር' },
    { command: 'myform', description: 'Fill Client Form / ፎርም ሙላ' },
    { command: 'packages', description: 'Service Packages / ጥቅሎች' },
    { command: 'language', description: 'Change language / ቋንቋ ቀይር' }
]);

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

bot.command('language', async (ctx) => {
    const text = `${TITLE}\n\n${I} እባክዎ የሚፈልጉትን ቋንቋ ይምረጡ / Select language:`;
    await ctx.replyWithHTML(text, {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('English', 'main_en'), Markup.button.callback('አማርኛ', 'main_am')]
        ]).reply_markup
    });
});

// ==========================================
// FORM FILLING SYSTEM
// ==========================================
bot.command('myform', async (ctx) => {
    ctx.session = ctx.session || { form: {} };
    ctx.session.step = 'name';
    
    const warningText = `${TITLE}\n\n${I} <b>ማሳሰቢያ (WARNING)</b>\nእባክዎ ትክክለኛ መረጃዎችን ብቻ ያስገቡ! ይህ መረጃ ህጋዊ ውል (Contract) ለመዋዋል ግዴታ ነው።\n\n${I} 1. ሙሉ ስምዎን ያስገቡ (Enter your Full Name):`;
    
    await ctx.replyWithHTML(warningText);
});

bot.action('start_form', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.session = ctx.session || { form: {} };
    ctx.session.step = 'name';
    
    const warningText = `${TITLE}\n\n${I} <b>ማሳሰቢያ (WARNING)</b>\nእባክዎ ትክክለኛ መረጃዎችን ብቻ ያስገቡ! ይህ መረጃ ህጋዊ ውል ለመዋዋል ግዴታ ነው።\n\n${I} 1. ሙሉ ስምዎን ያስገቡ (Enter your Full Name):`;
    await ctx.replyWithHTML(warningText);
});

bot.action('edit_form', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.session.form = {};
    ctx.session.step = 'name';
    await ctx.replyWithHTML(`${TITLE}\n\n${I} ፎርሙን እንደ አዲስ እየሞሉ ነው።\n\n${I} 1. ሙሉ ስምዎን ያስገቡ (Enter Full Name):`);
});

bot.on('text', async (ctx, next) => {
    if (!ctx.session) ctx.session = { form: {}, step: 'idle' };
    const step = ctx.session.step;
    const text = ctx.message.text;

    if (text.startsWith('/')) return next(); // Ignore commands

    if (step === 'name') {
        ctx.session.form.name = text;
        ctx.session.step = 'phone';
        await ctx.replyWithHTML(`${I} 2. ስልክ ቁጥርዎን ያስገቡ (Enter Phone Number):`);
    } else if (step === 'phone') {
        ctx.session.form.phone = text;
        ctx.session.step = 'company';
        await ctx.replyWithHTML(`${I} 3. የድርጅትዎን/ብራንድዎን ስም ያስገቡ (Enter Company/Brand Name):`);
    } else if (step === 'company') {
        ctx.session.form.company = text;
        ctx.session.step = 'email';
        await ctx.replyWithHTML(`${I} 4. ኢሜይል ያስገቡ (Enter Email - Optional, type 'skip' to pass):`);
    } else if (step === 'email') {
        ctx.session.form.email = text.toLowerCase() === 'skip' ? 'N/A' : text;
        ctx.session.step = 'address';
        await ctx.replyWithHTML(`${I} 5. አድራሻዎን ያስገቡ (Enter your Address):`);
    } else if (step === 'address') {
        ctx.session.form.address = text;
        ctx.session.step = 'idle';
        
        const summary = `${TITLE}\n\n${I} <b>መረጃዎ በተሳካ ሁኔታ ተመዝግቧል! (Form Saved)</b>\n\n${I} ስም: ${ctx.session.form.name}\n${I} ስልክ: ${ctx.session.form.phone}\n${I} ድርጅት: ${ctx.session.form.company}\n${I} ኢሜይል: ${ctx.session.form.email}\n${I} አድራሻ: ${ctx.session.form.address}`;
        
        await ctx.replyWithHTML(summary, {
            reply_markup: Markup.inlineKeyboard([
                [Markup.button.callback('Edit Form / እንደገና ሙላ', 'edit_form')],
                [Markup.button.callback('Go to Services / አገልግሎቶች', 'srv_menu_am')]
            ]).reply_markup
        });
    } else {
        return next();
    }
});

// ==========================================
// AMHARIC SECTION & MENUS
// ==========================================
bot.action('main_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `${TITLE}\n\n${I} የንግድዎን ዲጂታል ሽግግር እናሳልጣለን።\n\n${I} አገልግሎቶቻችንን ለመመልከት ከታች ካሉት አማራጮች አንዱን ይምረጡ።`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('📝 ፎርም መሙያ (My Form)', 'start_form')],
            [Markup.button.callback('አገልግሎቶች (Services)', 'srv_menu_am')],
            [Markup.button.callback('ተጨማሪ (More...)', 'more_am')]
        ]).reply_markup 
    });
});

bot.action('srv_menu_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `${TITLE}\n\n${I} ለዲጂታል እድገትዎ ስልታዊ መፍትሄዎች።`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('የጥቅል ዝርዝሮች (Packages)', 'pkg_menu_am')],
            [Markup.button.callback('ነጠላ አገልግሎቶች (Individuals)', 'indv_srv_am')],
            [Markup.button.callback('ተመለስ', 'main_am')]
        ]).reply_markup 
    });
});

bot.action('pkg_menu_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `${TITLE}\n\n${I} የፕሮፌሽናል የአገልግሎት ጥቅሎች።`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('Ascent (የመጀመሪያው እርምጃ)', 'pkg_asc_am')],
            [Markup.button.callback('Apex (የሽያጭ ማሳደጊያ)', 'pkg_apx_am')],
            [Markup.button.callback('Zenith (የንግድ ግዛት መገንቢያ)', 'pkg_zen_am')],
            [Markup.button.callback('ተመለስ', 'srv_menu_am')]
        ]).reply_markup 
    });
});

// Packages (30 Days)
bot.action('pkg_asc_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `${TITLE}\n\n<b>[ Ascent - የመጀመሪያው እርምጃ ]</b>\n\n${I} የብራንዲንግ መሰረት\n${I} የገፅ ግንባታ\n${I} በወር 10 ፖስቶች\n\n<b>ቋሚ ዋጋ:</b> 9,000 ብር`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('💳 ክፈይ (Pay)', 'pay_Ascent_9000_30')], [Markup.button.callback('ተመለስ', 'pkg_menu_am')]]).reply_markup });
});

bot.action('pkg_apx_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `${TITLE}\n\n<b>[ Apex - የሽያጭ ማሳደጊያ ]</b>\n\n${I} ተፅዕኖ ፈጣሪ ፅሁፎች\n${I} የማስታወቂያ አስተዳደር\n${I} የጎግል የበላይነት\n\n<b>ቋሚ ዋጋ:</b> 18,500 ብር`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('💳 ክፈይ (Pay)', 'pay_Apex_18500_30')], [Markup.button.callback('ተመለስ', 'pkg_menu_am')]]).reply_markup });
});

bot.action('pkg_zen_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `${TITLE}\n\n<b>[ Zenith - የንግድ ግዛት መገንቢያ ]</b>\n\n${I} የይዘት ጋጋታ\n${I} ዌብሳይት እና ቦት\n${I} SEO እና Retargeting\n\n<b>ቋሚ ዋጋ:</b> 50,000 ብር`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('💳 ክፈይ (Pay)', 'pay_Zenith_50000_30')], [Markup.button.callback('ተመለስ', 'pkg_menu_am')]]).reply_markup });
});

// Individual Services (Custom Days)
bot.action('indv_srv_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `${TITLE}\n\n<b>ነጠላ አገልግሎቶች</b>\n\n${I} ሎጎ (5 ቀን) - 2,500 ብር\n${I} ዌብሳይት (20 ቀን) - 15,000 ብር\n${I} ቴሌግራም ቦት (15 ቀን) - 5,000 ብር\n${I} ሶሻል ኦዲት (5 ቀን) - 3,000 ብር\n${I} ቢዝነስ ካርድ (5 ቀን) - 1,000 ብር`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('💳 ሎጎ ክፈይ', 'pay_Logo_2500_5'), Markup.button.callback('💳 ዌብሳይት ክፈይ', 'pay_Website_15000_20')],
            [Markup.button.callback('💳 ቦት ክፈይ', 'pay_Bot_5000_15'), Markup.button.callback('💳 ካርድ ክፈይ', 'pay_BusinessCard_1000_5')],
            [Markup.button.callback('ተመለስ', 'srv_menu_am')]
        ]).reply_markup 
    });
});

// ==========================================
// CHAPA API PAYMENT & CONTRACT GENERATION
// ==========================================
const CHAPA_SECRET = "CHASECK_TEST-ivIbhQprzFcn2DHeO8q75xvZ4X8PXMF6";

// Regex matches pay_PackageName_Price_Days
bot.action(/pay_([a-zA-Z]+)_(\d+)_(\d+)/, async (ctx) => {
    const serviceName = ctx.match[1];
    const amount = ctx.match[2];
    const durationDays = ctx.match[3];
    
    // ፎርም መሞላቱን ማረጋገጥ
    if (!ctx.session || !ctx.session.form || !ctx.session.form.name) {
        await ctx.answerCbQuery('እባክዎ መጀመሪያ ፎርም ይሙሉ! (Please fill the form first)', { show_alert: true });
        return ctx.replyWithHTML(`${TITLE}\n\n${I} ኮንትራት ለማዘጋጀት መጀመሪያ መረጃዎን ማስገባት አለቦት። ፎርም ለመሙላት /myform ይጫኑ።`);
    }

    await ctx.answerCbQuery('Processing payment...', { show_alert: false });

    // የኮንትራቱን ዳታ በ session መያዝ
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
            const paymentText = `${TITLE}\n\n${I} <b>Payment Generated!</b>\n\n${I} ከታች ያለውን ሊንክ በመጫን <b>${amount} ብር</b> ይክፈሉ። ከከፈሉ በኋላ 'ክፍያ አጠናቅቄያለሁ' የሚለውን ይጫኑ።`;
            
            await ctx.editMessageText(paymentText, {
                parse_mode: 'HTML',
                reply_markup: Markup.inlineKeyboard([
                    [Markup.button.url('🔗 ይክፈሉ (Pay Now)', response.data.data.checkout_url)],
                    [Markup.button.callback('✅ ክፍያ አጠናቅቄያለሁ (Check Payment)', 'verify_payment')],
                    [Markup.button.callback('ተመለስ', 'cmd_back')]
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
    
    if (!ctx.session || !ctx.session.pendingContract) {
        return ctx.replyWithHTML(`${TITLE}\n\n${I} የክፍያ መረጃ አልተገኘም።`);
    }

    const { serviceName, amount, durationDays } = ctx.session.pendingContract;
    const clientName = ctx.session.form.name;
    const dates = getContractDates(durationDays);

    const contractText = `
${TITLE}
<b>የ APEX Digital Solution ሙሉ የውል ስምምነት</b>

${I} ይህ ፎርማት ለጥቅልም ሆነ ለንጥል ስራዎች ይሆናል።
<b>የአገልግሎት ስምምነት ውል (Service Agreement)</b>

<b>የተዋዋይ ወገኖች መረጃ</b>
${I} ኤጀንሲ፦ APEX Digital Solution (Ethiopia)
${I} ደንበኛ፦ <b>${clientName}</b> (ከዚህ በኋላ "ደንበኛ" እየተባለ የሚጠራ)
${I} የውል ቀን፦ ${dates.start} ዓ.ም

<b>የአገልግሎት ዝርዝር እና የጊዜ ገደብ</b>
${I} የተመረጠው አገልግሎት/ጥቅል፦ <b>${serviceName}</b>
${I} የስራው መጀመሪያ ቀን፦ ${dates.start} ዓ.ም
${I} የስራው ማጠናቀቂያ ቀን፦ ${dates.end} ዓ.ም (ጠቅላላ የ <b>${durationDays}</b> ቀናት ስራ)

<b>የክፍያ ሁኔታ</b>
${I} ደንበኛው ለተጠቀሰው አገልግሎት ጠቅላላ <b>${amount} ETB</b> በ Chapa በኩል የከፈለ ሲሆን፣ ይህ ክፍያ ተመላሽ (Non-refundable) አይደረግም።

<b>ግዴታዎች እና መብቶች</b>
${I} የኤጀንሲው ግዴታ፦ ስራውን በታቀደው የጊዜ ገደብ በጥራት ማጠናቀቅ።
${I} የደንበኛው ግዴታ፦ ለስራው የሚያስፈልጉ ግብዓቶችን (Text, Logo, Photos) በ 2 ቀናት ውስጥ ማቅረብ።
${I} ማሻሻያ (Revision)፦ ስራው ከተረከበ በኋላ ለ 3 ተከታታይ ቀናት ነፃ ማሻሻያ የመጠየቅ መብት።
${I} ባለቤትነት፦ ክፍያው እንደተጠናቀቀ የዲዛይኑ/የኮዱ ባለቤትነት ለደንበኛው ይተላለፋል።
`;

    await ctx.replyWithHTML(`${TITLE}\n\n<b>እንኳን ደስ አለዎት! ኮንትራትዎ ተዘጋጅቷል::</b>\n\n${contractText}`, {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('📄 Download PDF', 'download_pdf')]
        ]).reply_markup
    });
});

// Generate and Send PDF
bot.action('download_pdf', async (ctx) => {
    await ctx.answerCbQuery('Generating PDF...', { show_alert: false });
    
    const { serviceName, amount, durationDays } = ctx.session.pendingContract;
    const clientName = ctx.session.form.name;
    const dates = getContractDates(durationDays);

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    
    doc.on('end', async () => {
        const pdfData = Buffer.concat(buffers);
        await ctx.replyWithDocument(
            { source: pdfData, filename: `APEX_Contract_${clientName.replace(/\s+/g, '_')}.pdf` },
            { caption: `${I} የውል ስምምነትዎ ይኸው (Here is your contract).` }
        );
    });

    // Formatting PDF (Using English equivalents inside PDF to avoid Amharic font garbling in standard pdfkit)
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

bot.launch();
