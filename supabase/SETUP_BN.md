# Cloud সংযোগ চালু করার বাকি ধাপ

সাইটের বর্তমান Supabase project URL-এর hostname পাওয়া যায়নি। সীমিত read-only API request ব্যর্থ হয়েছে এবং Google DNS-এর আলাদা পরীক্ষায় NXDOMAIN (status 3) এসেছে। তাই কোড ঠিক করার পরও ওই URL দিয়ে আসল login, upload বা order save কাজ করবে না।

নির্ধারিত admin email: **jannah80assad@gmail.com**। Admin PIN-এর বদলে এই অ্যাকাউন্টের Supabase login ব্যবহার হবে।

1. আপনার [Supabase Dashboard](https://supabase.com/dashboard)-এ সঠিক সক্রিয় project খুলুন। পুরোনো project unavailable হলে নতুন project প্রয়োজন।
2. নতুন project হলে সাইটের `schema.sql` SQL Editor-এ চালান। বর্তমান project-এ tables থাকলে এগুলো পুনরায় তৈরি করার দরকার নেই।
3. Project Settings → API থেকে **Project URL** এবং **public anon/publishable key** নিন। `js/config.js`-এ `SUPABASE_URL` ও `SUPABASE_ANON_KEY` আপডেট করতে হবে। `service_role`/secret key browser code-এ দেবেন না।
4. সংশোধিত সাইট থেকে `jannah80assad@gmail.com` দিয়ে signup করুন ও confirmation email থাকলে confirm করুন।
5. SQL Editor-এ [admin setup script](admin-setup.sql) চালান। এটি নির্দিষ্ট account-কে admin করবে এবং customer-এর নিজের role পাল্টানোর অনুমতি বন্ধ করবে। Script নিজে কোনো account/password তৈরি করে না।
6. সাইটে ওই account-এ login করে `admin.html` খুলুন। Cloud catalogue খালি হলে **Publish existing catalogue / বর্তমান পণ্যগুলো প্রকাশ করুন** চাপুন। এটি বর্তমানে থাকা পণ্যগুলো একবার cloud-এ প্রকাশ করবে।
7. একটি পণ্যের নাম/দাম পরিবর্তন করে অন্য browser/device থেকে gallery reload করুন। তারপর একটি বাস্তব ছোট order ও reference file দিয়ে যাচাই করুন; এ পর্যন্ত developer tests কোনো আসল order পাঠায়নি।

এখানে authenticated Supabase project management বা database connection পাওয়া যায়নি, তাই admin SQL live database-এ প্রয়োগ করা হয়নি। Active Project URL ও public key পাওয়া গেলে configuration-এর পরিবর্তন করা যাবে।

ডেলিভারি চার্জ বা payment gateway নতুন করে নির্ধারণ করা হয়নি। Checkout-এ product subtotal দেখানো হয় এবং delivery charge ও payment স্টুডিও পরে নিশ্চিত করবে বলে উল্লেখ থাকে।
