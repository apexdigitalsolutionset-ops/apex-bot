const { Telegraf, Markup } = require('telegraf');
const express = require('express');
require('dotenv').config();

const app = express();
app.get('/', (req, res) => res.send('APEX Bot is Live!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const bot = new Telegraf(process.env.BOT_TOKEN);

const I = '➤'; 

// ==========================================
// NEW COMMANDS (/language & /logo)
// ==========================================

// በማንኛውም ሰዓት ቋንቋ ለመቀየር
bot.command('language', async (ctx) => {
    const text = `Please select your preferred language.\nእባክዎ የሚፈልጉትን ቋንቋ ይምረጡ።`;
    await ctx.replyWithHTML(text, {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('English', 'main_en'), Markup.button.callback('አማርኛ', 'main_am')]
        ]).reply_markup
    });
});

// የ Logo ትዕዛዝ
bot.command('logo', async (ctx) => {
    const text = `<b>Professional Logo Design / የሎጎ ዲዛይን</b>\n\n${I} Delivery Time: 3 to 5 Days (በ3 እስከ 5 ቀናት ይደርሳል)\n\n<b>Fixed Price (ቋሚ ዋጋ):</b> 2,500 ETB`;
    await ctx.replyWithHTML(text, {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('💳 Pay (ክፈይ)', 'pay_action')]
        ]).reply_markup
    });
});

// ==========================================
// START MENU
// ==========================================

bot.start(async (ctx) => {
    const welcomeText = `Welcome to APEX Digital Solution. We craft premium digital experiences to elevate your brand's presence. Let's start building your success.\n\nWelcome to APEX Digital Solution. To provide you with the best experience, please select your preferred language.\n\n—\n\nወደ APEX Digital Solution እንኳን ደህና መጡ። የንግድዎን ዝና ከፍ የሚያደርጉ ጥራት ያላቸው የዲጂታል መፍትሄዎችን እናቀርባለን። የስኬት ጉዞዎን አብረን እንጀምር።\n\nወደ APEX Digital Solution እንኳን ደህና መጡ። የተሻለ አገልግሎት ለመስጠት እንዲያመችዎ እባክዎ የሚፈልጉትን ቋንቋ ይምረጡ።`;
    
    await ctx.replyWithHTML(welcomeText, {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('English', 'main_en'), Markup.button.callback('አማርኛ', 'main_am')]
        ]).reply_markup
    });
});

// ==========================================
// ENGLISH SECTION
// ==========================================

// --- Main Menu ---
bot.action('main_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `APEX Digital Solution: Partnering in your digital transformation. Select an option to explore our solutions.`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('Services', 'srv_menu_en')],
            [Markup.button.callback('More...', 'more_en')]
        ]).reply_markup 
    });
});

// --- Services Menu ---
bot.action('srv_menu_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `Strategic Solutions for Your Digital Growth. Please select a service category below to see how we can help you scale.`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('Service Packages', 'pkg_menu_en')],
            [Markup.button.callback('Individual Services', 'indv_srv_en')],
            [Markup.button.callback('Back', 'main_en')]
        ]).reply_markup 
    });
});

// --- Packages Menu ---
bot.action('pkg_menu_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `Curated Excellence. Please select one of our professional service packages to view detailed offerings and pricing.`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('Ascent (The Foundation)', 'pkg_asc_en')],
            [Markup.button.callback('Apex (The Growth Accelerator)', 'pkg_apx_en')],
            [Markup.button.callback('Zenith (The Empire Builder)', 'pkg_zen_en')],
            [Markup.button.callback('Back', 'srv_menu_en')]
        ]).reply_markup 
    });
});

// Package: Ascent
bot.action('pkg_asc_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>[ Ascent - The Foundation ]</b>\nIdeal for new businesses looking to establish a professional digital presence.\n\n${I} Branding Foundation: Custom Logo Design, Brand Color Palette, and Typography.\n${I} Page Authority: Setup and Optimization of Facebook, Instagram, and TikTok profiles.\n${I} Strategic Content: 10 High-quality Professional Posts per month.\n${I} Community Engagement: Basic Comment and DM management.\n${I} Growth Consultation: Monthly expert advice.\n\n<b>Fixed Price:</b> 9,000 ETB`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('💳 Pay', 'pay_action')],
            [Markup.button.callback('Back', 'pkg_menu_en')]
        ]).reply_markup 
    });
});

// Package: Apex
bot.action('pkg_apx_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>[ Apex - The Growth Accelerator ]</b>\nDesigned for businesses ready to scale and generate consistent leads.\n\n${I} Conversion Copywriting: Compelling Hooks, Stories, and CTAs.\n${I} Vantage Ad Management: 5 Targeted Ad Campaigns.\n${I} Google Authority (GMB): Full Google Maps setup.\n${I} Daily Dominance: Daily Story updates.\n${I} Performance Tracking: Monthly reports.\n${I} Growth Consultation: Strategy sessions included.\n\n<b>Fixed Price:</b> 18,500 ETB`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('💳 Pay', 'pay_action')],
            [Markup.button.callback('Back', 'pkg_menu_en')]
        ]).reply_markup 
    });
});

// Package: Zenith
bot.action('pkg_zen_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>[ Zenith - The Empire Builder ]</b>\nThe ultimate all-in-one digital takeover for established brands.\n\n${I} Full-Spectrum Content: 20+ Posts/Reels per month.\n${I} Automated Sales Funnel: Custom Business Website + Telegram Bot.\n${I} Data Intelligence: Meta Pixel setup & Retargeting.\n${I} SEO & Digital PR: Search Engine Optimization.\n${I} SOP Development: Standardized Operating Procedures.\n${I} Apex Founder Support: Direct 1-on-1 strategic consulting.\n\n<b>Fixed Price:</b> 50,000 ETB`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('💳 Pay', 'pay_action')],
            [Markup.button.callback('Back', 'pkg_menu_en')]
        ]).reply_markup 
    });
});

// Individual Services
bot.action('indv_srv_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>Individual Services</b>\n\n${I} Professional Logo Design - <b>Fixed Price: 2,500 ETB</b>\n${I} Custom Telegram Bot Development - <b>Fixed Price: 5,000 ETB</b>\n${I} Premium Website Design - <b>Fixed Price: 15,000 ETB</b>\n${I} Social Media Audit & Setup - <b>Fixed Price: 3,000 ETB</b>\n${I} Modern Business Card Design - <b>Fixed Price: 1,000 ETB</b>\n${I} Strategic Business Consultation - <b>Fixed Price: 2,000 ETB</b>`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('Back', 'srv_menu_en')]]).reply_markup });
});

// --- More Menu ---
bot.action('more_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `Company Insights & Support. Access our background, FAQ, and direct communication channels below.`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('About Us', 'abt_en'), Markup.button.callback('FAQ', 'faq_en')],
            [Markup.button.callback('Contact Us', 'cnt_en'), Markup.button.url('Support', 'https://t.me/Farisman72')],
            [Markup.button.callback('Contract', 'contract_en')],
            [Markup.button.callback('Back', 'main_en')]
        ]).reply_markup 
    });
});

bot.action('abt_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>About Us</b>\n\nWe are APEX Digital Solution, a high-end digital agency dedicated to transforming businesses through premium UI/UX design, cutting-edge web development, and intelligent automation. We specialize in modern aesthetics like Glassmorphism and Apple-style smoothness, seamlessly integrated with AI tools and robust digital marketing strategies.`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('Back', 'more_en')]]).reply_markup });
});

bot.action('faq_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>FAQ</b>\n\n<b>Q1: What makes APEX different?</b>\nWe focus on high-end, smooth user experiences (Apple-style smoothness) and leverage the latest AI tools and automation.\n\n<b>Q2: Do you support Dropshipping and E-commerce?</b>\nYes, we provide full strategies specifically tailored for dropshipping, e-commerce, and freelance platforms.\n\n<b>Q3: How long does a project take?</b>\nTimelines vary. The Ascent package takes a few weeks, while Zenith requires comprehensive development time.`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('Back', 'more_en')]]).reply_markup });
});

bot.action('cnt_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>Contact Us</b>\n\nEmail: apexsolutions.et@gmail.com\nConnect with us:`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.url('Telegram', 'https://t.me/ApexDigitalET'), Markup.button.url('Instagram', 'https://instagram.com/apexdigital.et')],
            [Markup.button.url('Facebook', 'https://www.facebook.com/share/1BMRntd8DQ/'), Markup.button.url('TikTok', 'https://tiktok.com/@apexdigital.et')],
            [Markup.button.callback('Back', 'more_en')]
        ]).reply_markup 
    });
});

bot.action('contract_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `Contract details will be available soon.`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('Back', 'more_en')]]).reply_markup });
});

// ==========================================
// AMHARIC SECTION
// ==========================================

// --- Main Menu ---
bot.action('main_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `APEX Digital Solution፦ የንግድዎን ዲጂታል ሽግግር እናሳልጣለን። አገልግሎቶቻችንን ለመመልከት ከታች ካሉት አማራጮች አንዱን ይምረጡ።`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('አገልግሎቶች (Services)', 'srv_menu_am')],
            [Markup.button.callback('ተጨማሪ (More...)', 'more_am')]
        ]).reply_markup 
    });
});

// --- Services Menu ---
bot.action('srv_menu_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `ለዲጂታል እድገትዎ ስልታዊ መፍትሄዎች። የንግድዎን አድማስ እንዴት እንደምናሰፋ ለመመልከት እባክዎ ከአገልግሎት ዘርፎች አንዱን ይምረጡ።`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('የጥቅል ዝርዝሮች', 'pkg_menu_am')],
            [Markup.button.callback('ነጠላ አገልግሎቶች', 'indv_srv_am')],
            [Markup.button.callback('ተመለስ', 'main_am')]
        ]).reply_markup 
    });
});

// --- Packages Menu ---
bot.action('pkg_menu_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `ለጥራት የተመረጡ አገልግሎቶች። ዝርዝር መረጃዎችን እና ዋጋዎችን ለመመልከት እባክዎ ከታች ካሉት ፕሮፌሽናል የአገልግሎት ጥቅሎች አንዱን ይምረጡ።`;
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

// Package: Ascent (Amharic)
bot.action('pkg_asc_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>[ Ascent - የመጀመሪያው እርምጃ ]</b>\nአዲስ ለሚጀምሩ ወይም ገና ዲጂታል መገኘት ለሚገነቡ ድርጅቶች።\n\n${I} የብራንዲንግ መሰረት፦ ፕሮፌሽናል ሎጎ፣ የከለር ምርጫ እና የፅሁፍ አይነቶች።\n${I} የገፅ ግንባታ፦ የፌስቡክ፣ ኢንስታግራም እና ቲክቶክ ገጾችን ፕሮፌሽናል በሆነ መልኩ መክፈትና ማስተካከል።\n${I} ስልታዊ ይዘቶች፦ በወር 10 ጥራት ያላቸው ፖስቶች።\n${I} የተከታዮች መስተጋብር፦ ለኮሜንቶች እና ለዲኤም (DM) ፈጣን ምላሽ መስጠት።\n${I} የነፃ ምክር አገልግሎት፦ የንግድዎን እንቅስቃሴ የሚገመግም ምክር።\n\n<b>ቋሚ ዋጋ:</b> 9,000 ብር`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('💳 ክፈይ', 'pay_action_am')],
            [Markup.button.callback('ተመለስ', 'pkg_menu_am')]
        ]).reply_markup 
    });
});

// Package: Apex (Amharic)
bot.action('pkg_apx_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>[ Apex - የሽያጭ ማሳደጊያ ]</b>\nደንበኞችን በብዛት ለመሳብ እና ሽያጭን ለመጨመር ለሚፈልጉ።\n\n${I} ተፅዕኖ ፈጣሪ ፅሁፎች፦ ሰውን የሚስቡ እና ወደ ሽያጭ የሚቀይሩ (Hook, Story & CTA) ፅሁፎች።\n${I} የማስታወቂያ አስተዳደር፦ 5 ውጤታማ የሚከፈልባቸው ማስታወቂያዎች (ለTraffic እና Lead Gen)።\n${I} የጎግል የበላይነት፦ ማፕ ላይ ማስገባት እና Review ማስተዳደር።\n${I} የእለት ተእለት ተደራሽነት፦ በየቀኑ የሚወጡ ስቶሪዎች።\n${I} የነፃ ምክር አገልግሎት ተካቷል።\n\n<b>ቋሚ ዋጋ:</b> 18,500 ብር`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('💳 ክፈይ', 'pay_action_am')],
            [Markup.button.callback('ተመለስ', 'pkg_menu_am')]
        ]).reply_markup 
    });
});

// Package: Zenith (Amharic)
bot.action('pkg_zen_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>[ Zenith - የንግድ ግዛት መገንቢያ ]</b>\nሙሉ በሙሉ የዲጂታል አለሙን ለመቆጣጠር ለሚፈልጉ ትላልቅ ድርጅቶች።\n\n${I} የይዘት ጋጋታ፦ በወር ከ20 በላይ ፖስቶች እና ቪዲዮዎች።\n${I} ራስ-ሰር የሽያጭ መንገድ፦ ዘመናዊ ዌብሳይት እና የቴሌግራም ቦት።\n${I} ዳግም ማነጣጠር (Retargeting)፦ የፒክሰል ቴክኖሎጂን በመጠቀም።\n${I} SEO & Digital PR፦ በጎግል ፍለጋ ላይ ቀዳሚ መሆን።\n${I} የአሰራር ስርአት (SOP)፦ የዲጂታል አሰራር ማንዋል ማዘጋጀት።\n${I} የApex መስራች ድጋፍ፦ ቀጥተኛ የሆነ የስትራቴጂ ድጋፍ።\n\n<b>ቋሚ ዋጋ:</b> 50,000 ብር`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('💳 ክፈይ', 'pay_action_am')],
            [Markup.button.callback('ተመለስ', 'pkg_menu_am')]
        ]).reply_markup 
    });
});

// Individual Services (Amharic)
bot.action('indv_srv_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>ነጠላ አገልግሎቶች</b>\n\n${I} ፕሮፌሽናል የሎጎ ዲዛይን - <b>ቋሚ ዋጋ: 2,500 ብር</b>\n${I} የቴሌግራም ቦት ዝግጅት - <b>ቋሚ ዋጋ: 5,000 ብር</b>\n${I} የዌብሳይት ስራ - <b>ቋሚ ዋጋ: 15,000 ብር</b>\n${I} የሶሻል ሚዲያ ኦዲት - <b>ቋሚ ዋጋ: 3,000 ብር</b>\n${I} የቢዝነስ ካርድ ዲዛይን - <b>ቋሚ ዋጋ: 1,000 ብር</b>\n${I} የስትራቴጂ ምክር - <b>ቋሚ ዋጋ: 2,000 ብር</b>`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('ተመለስ', 'srv_menu_am')]]).reply_markup });
});

// --- More Menu ---
bot.action('more_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `የድርጅት መረጃ እና ድጋፍ። ስለ እኛ ለማወቅ፣ ተደጋጋሚ ጥያቄዎችን ለማየት እና እኛን ለማግኘት ከታች ያሉትን አማራጮች ይጠቀሙ።`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('ስለ እኛ', 'abt_am'), Markup.button.callback('ተደጋጋሚ ጥያቄዎች', 'faq_am')],
            [Markup.button.callback('ያግኙን', 'cnt_am'), Markup.button.url('ድጋፍ (Support)', 'https://t.me/Farisman72')],
            [Markup.button.callback('ውል (Contract)', 'contract_am')],
            [Markup.button.callback('ተመለስ', 'main_am')]
        ]).reply_markup 
    });
});

bot.action('abt_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>ስለ እኛ</b>\n\nAPEX Digital Solution የቢዝነስዎን ዲጂታል ገጽታ በከፍተኛ ጥራት (Premium) እና በዘመናዊ ቴክኖሎጂ የሚቀይር ኤጀንሲ ነው። በተለይም እንደ Glassmorphism ባሉ እጅግ ማራኪ የዲዛይን ጥበባቶች፣ በዘመናዊ ዌብሳይት እና አፕሊኬሽን ዴቨሎፕመንት፣ እንዲሁም በ AI እና በቢዝነስ አውቶሜሽን ላይ ትኩረት አድርገን እንሰራለን።`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('ተመለስ', 'more_am')]]).reply_markup });
});

bot.action('faq_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>ተደጋጋሚ ጥያቄዎች (FAQ)</b>\n\n<b>ጥ 1: APEXን የተለየ የሚያደርገው ምንድን ነው?</b>\nትኩረታችን ከፍተኛ ጥራት ባላቸው እና እጅግ ማራኪ (Premium) በሆኑ ዲዛይኖች ላይ ሲሆን፣ የ AI ቴክኖሎጂዎችን እና የቢዝነስ አውቶሜሽንን በመጠቀም ስራዎን እናቀልላለን።\n\n<b>ጥ 2: ለ Dropshipping ድጋፍ ታደርጋላችሁ?</b>\nአዎ፣ ለ dropshipping፣ ለኢ-ኮሜርስ እና ለፍሪላንስ አፕሊኬሽኖች የሚሆኑ የተሟሉ ስትራቴጂዎችን እንሰራለን።\n\n<b>ጥ 3: ፕሮጀክት ለመጨረስ ምን ያህል ጊዜ ይፈጃል?</b>\nእንደየ ጥቅሉ ይለያያል። የ Ascent ጥቅል በጥቂት ሳምንታት ሲጠናቀቅ፣ ከፍተኛው የ Zenith ጥቅል ሰፊ ጊዜ ይፈልጋል።`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('ተመለስ', 'more_am')]]).reply_markup });
});

bot.action('cnt_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>ያግኙን</b>\n\nኢሜይል: apexsolutions.et@gmail.com\nለማናገር ከታች ያሉትን አማራጮች ይጠቀሙ፦`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.url('ቴሌግራም', 'https://t.me/ApexDigitalET'), Markup.button.url('ኢንስታግራም', 'https://instagram.com/apexdigital.et')],
            [Markup.button.url('ፌስቡክ', 'https://www.facebook.com/share/1BMRntd8DQ/'), Markup.button.url('ቲክቶክ', 'https://tiktok.com/@apexdigital.et')],
            [Markup.button.callback('ተመለስ', 'more_am')]
        ]).reply_markup 
    });
});

bot.action('contract_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `የውል መረጃዎች በቅርቡ ይካተታሉ።`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('ተመለስ', 'more_am')]]).reply_markup });
});

// Pay Actions
bot.action('pay_action', async (ctx) => {
    await ctx.answerCbQuery('Payment gateway integration coming soon!', { show_alert: true });
});

bot.action('pay_action_am', async (ctx) => {
    await ctx.answerCbQuery('የክፍያ አማራጮች በቅርቡ ይካተታሉ!', { show_alert: true });
});

bot.launch();
