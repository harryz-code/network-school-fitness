# network school fitness

**contact me:**
- twitter: https://twitter.com/harryzhangs
- linkedin: https://www.linkedin.com/in/harryzhangprofile/
- discord: @harry_hackquest

---

this project was built as part of a vibe coding hackathon on 8/3 at ns - i wanted to dedicate this to everyone who wants to achieve fitness and wellness goals here. hopefully you find it helpful! welcome all contributions.

## why this exists

ns publishes nutrition facts in excel format per component and is hard to estimate. this app makes it easy to track meals, workouts, and water intake specifically tailored for ns residents.

🚀 **live demo**: [https://network-school-fitness.vercel.app/](https://network-school-fitness.vercel.app/)

## features

- **user authentication** - sign in with google, x, or discord to save your data
- **meal logging** - track food from cafe/lunch/dinner menus with real nutrition data
- **workout tracking** - log different exercise types with personalized calorie burn
- **water tracking** - smart hydration goals based on your body weight and activity
- **progress dashboard** - see your daily/weekly progress at a glance
- **dark/light mode** - matches your vibe
- **quick actions** - floating button for fast logging

## getting started

### 1. clone and install
```bash
git clone https://github.com/yourusername/network-school-fitness.git
cd network-school-fitness
npm install
```

### 2. set up supabase
1. create a project at [supabase.com](https://supabase.com)
2. go to project settings > api
3. create a `.env.local` file in your project root:
```bash
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. configure auth providers
in your supabase dashboard:
- go to authentication > providers
- enable google, twitter, and discord oauth
- add redirect urls: `http://localhost:3000` and your live domain

### 4. run the app
```bash
npm start
```

open http://localhost:3000 and you're good to go!

## tech stack

- react 19.1.1
- javascript (es6+)
- supabase for auth and database
- css-in-js for styling
- lucide react for icons
- framer motion for animations
- deployed on vercel

## how it works

1. **onboarding** - enter your basic info (age, weight, height, etc.)
2. **set goals** - the app calculates your bmr/tdee and suggests calorie targets
3. **track daily** - log meals, workouts, and water throughout the day
4. **monitor progress** - dashboard shows real-time progress with color-coded indicators

## key features

### meal tracking
- organized by ns meal periods (breakfast/lunch/dinner)
- actual nutrition data from ns menus
- multi-item ordering for complex meals
- macro breakdown (calories, protein, carbs, fat)

### workout logging
- strength, cardio, flexibility, sports, hiit, yoga
- personalized calorie burn based on your profile
- intensity levels for accurate tracking

### water goals
- calculates daily needs: body weight × 67%
- adjusts for activity level and workouts
- streak counter to keep you motivated

### smart dashboard
- red: over goal (>115%)
- green: on track (85-115%)
- yellow: moderate progress (40-85%)
- gray: needs attention (<40%)

## contributing

1. fork it
2. make your changes
3. submit a pull request

all contributions welcome - this is for the ns community!

## license

mit license - use it however you want.

---

**built with ❤️ for network school**