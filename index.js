const { Telegraf, session } = require('telegraf');
const admin = require('firebase-admin');
const express = require('express');
require('dotenv').config();

// Firebase Initialization
try {
  const serviceAccount = require("./firebase-key.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Connected Successfully!");
} catch (e) {
  console.error("Firebase Key missing or invalid:", e.message);
}

const db = admin.firestore();
const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

// Session Middleware (ፎርም የሞላ መሆኑን ለማስታወስ)
bot.use(session());
bot.use((ctx, next) => {
  ctx.session ??= { step: 'idle', formStatus: 'incomplete', lang: 'am' };
  return next();
});

// 1. Start Command
bot.start((ctx) => {
  ctx.session = { step: 'idle', formStatus: 'incomplete', lang: 'am' }; // Reset session
  ctx.reply(`እንኳን ወደ APEX Digital Solution በደህና መጡ! \n\nእባክዎ ቋንቋ ይምረጡ / Please select your preferred language:`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🇪🇹 አማርኛ', callback_data: 'lang_am' }, { text: '🇬🇧 English', callback_data: 'lang_en' }]
      ]
    }
  });
});

// 2. Language Selection Logic
bot.action('lang_am', async (ctx) => {
  ctx.session.lang = 'am';
  await ctx.answerCbQuery();
  await sendMainMenu(ctx);
});

bot.action('lang_en', async (ctx) => {
  ctx.session.lang = 'en';
  await ctx.answerCbQuery();
  await sendMainMenu(ctx);
});

// Main Menu Function
async function sendMainMenu(ctx) {
  const isEn = ctx.session.lang === 'en';
  const text = isEn 
    ? "Welcome to APEX Digital Solution. We craft premium digital experiences.\n\nChoose an option below:" 
    : "ወደ APEX Digital Solution እንኳን ደህና መጡ። የንግድዎን ገፅታ ከፍ የሚያደርጉ ጥራት ያላቸው ዲጂታል መፍትሄዎችን እናቀርባለን።\n\nከታች ያለውን አማራጭ ይምረጡ፡";

  const menu = [
    [{ text: isEn ? '📦 Premium Packages' : '📦 ፕሪሚየም ፓኬጆች', callback_data: 'view_packages' }],
    [{ text: isEn ? '📝 Fill Order Form' : '📝 የትዕዛዝ ፎርም ሙላ', callback_data: 'fill_form' }]
  ];

  await ctx.reply(text, { reply_markup: { inline_keyboard: menu } });
}

// 3. View Packages Logic
bot.action('view_packages', async (ctx) => {
  const isEn = ctx.session.lang === 'en';
  await ctx.answerCbQuery();

  const packageText = isEn ? 
    `💎 *Our Premium Packages*\n\n*1. Ascent Package*\n• Basic Website Design\n• Logo & Branding\n• Social Media Setup\n\n*2. Apex Package*\n• Advanced E-commerce Site\n• Premium Glassmorphism UI/UX\n• Dropshipping Setup\n\n*3. Zenith Package*\n• Full Agency Automation\n• Telegram Bot Integrations\n• AI Tools Setup\n\n_Select 'Fill Order Form' to get started._` : 
    `💎 *የእኛ ፕሪሚየም ፓኬጆች*\n\n*1. Ascent Package*\n• መሠረታዊ የዌብሳይት ዲዛይን\n• ሎጎ እና ብራንዲንግ\n• የሶሻል ሚዲያ አዘገጃጀት\n\n*2. Apex Package*\n• የላቀ E-commerce ዌብሳይት\n• ፕሪሚየም (Glassmorphism) UI/UX\n• የ Dropshipping አዘገጃጀት\n\n*3. Zenith Package*\n• ሙሉ የቢዝነስ አውቶሜሽን\n• የቴሌግራም ቦት ትስስር\n• የ AI መሳሪያዎች አጠቃቀም\n\n_ለማዘዝ 'የትዕዛዝ ፎርም ሙላ' የሚለውን ይምረጡ።_`;

  await ctx.replyWithMarkdown(packageText);
});

// 4. Form Logic (Smart Form Flow)
bot.action('fill_form', async (ctx) => {
  await ctx.answerCbQuery();
  const isEn = ctx.session.lang === 'en';

  // ፎርም ከዚህ በፊት ከሞላ Edit ብቻ ያሳያል
  if (ctx.session.formStatus === 'completed') {
    const msg = isEn ? '✅ You have already filled out the form.' : '✅ ፎርሙን አስቀድመው ሞልተዋል።';
    const editBtn = isEn ? '✏️ Edit Form' : '✏️ ፎርሙን አስተካክል';
    return ctx.reply(msg, {
      reply_markup: {
        inline_keyboard: [[{ text: editBtn, callback_data: 'edit_form' }]]
      }
    });
  }

  // አዲስ ፎርም መሙላት ሲጀምር
  ctx.session.step = 'awaiting_name';
  const askName = isEn ? 'Please enter your full name:' : 'እባክዎ ሙሉ ስምዎን ያስገቡ፡';
  await ctx.reply(askName);
});

bot.action('edit_form', async (ctx) => {
  await ctx.answerCbQuery();
  const isEn = ctx.session.lang === 'en';
  ctx.session.formStatus = 'incomplete';
  ctx.session.step = 'awaiting_name';
  
  const askName = isEn ? 'Let\'s start over. Please enter your full name:' : 'እንደ አዲስ እንጀምር። እባክዎ ሙሉ ስምዎን ያስገቡ፡';
  await ctx.reply(askName);
});

// 5. Text Handler for Form Inputs
bot.on('text', async (ctx) => {
  const isEn = ctx.session.lang === 'en';
  const step = ctx.session.step;

  if (step === 'awaiting_name') {
    ctx.session.userData = { name: ctx.message.text };
    ctx.session.step = 'awaiting_phone';
    const askPhone = isEn ? 'Please enter your phone number:' : 'እባክዎ ስልክ ቁጥርዎን ያስገቡ፡';
    return ctx.reply(askPhone);
  }

  if (step === 'awaiting_phone') {
    ctx.session.userData.phone = ctx.message.text;
    ctx.session.step = 'idle';
    ctx.session.formStatus = 'completed'; // ፎርሙ መጠናቀቁን ማረጋገጫ

    // Save to Firebase securely
    try {
      await db.collection('orders').add({
        name: ctx.session.userData.name,
        phone: ctx.session.userData.phone,
        status: 'Pending Payment',
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (e) {
      console.error("Firebase write error: ", e);
    }

    const successMsg = isEn 
      ? `✅ Thank you, ${ctx.session.userData.name}! Your details have been saved.` 
      : `✅ እናመሰግናለን ${ctx.session.userData.name}! መረጃዎ በተሳካ ሁኔታ ተመዝግቧል።`;

    const nextBtn = isEn ? '💳 Proceed to Payment' : '💳 ወደ ክፍያ ቀጥል';
    
    return ctx.reply(successMsg, {
      reply_markup: {
        inline_keyboard: [[{ text: nextBtn, callback_data: 'proceed_payment' }]]
      }
    });
  }
});

// 6. Payment Trigger (Placeholder for Chapa)
bot.action('proceed_payment', async (ctx) => {
  await ctx.answerCbQuery();
  const isEn = ctx.session.lang === 'en';
  const msg = isEn 
    ? 'Generating your secure Chapa payment link...' 
    : 'የ Chapa ክፍያ ሊንክዎን በማዘጋጀት ላይ ነን...';
  await ctx.reply(msg);
  // እዚህ ላይ የ Chapa API ኮድ ይቀጥላል
});

// Server Initialization
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('APEX Digital Solution Bot is Running Premium Mode...'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

bot.launch().then(() => console.log("Bot started successfully!"));

// Graceful Stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
