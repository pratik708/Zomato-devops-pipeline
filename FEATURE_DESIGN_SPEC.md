═══════════════════════════════════════════════════════════════════════════════
                     FOODHUB BUTTON IMPLEMENTATION GUIDE
                   Search • Offers • Help - Complete Design Spec
═══════════════════════════════════════════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. SEARCH BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 LOCATION: Header navigation, always visible
🎯 PURPOSE: Help users discover restaurants and dishes quickly
⚙️ STATE: Works for both logged-in and logged-out users

USER FLOW:
┌─────────────────────────────────────────────────────────────────┐
│ User clicks "🔍 Search" button                                  │
├─────────────────────────────────────────────────────────────────┤
│ Modal opens with search input field (autofocused)               │
├─────────────────────────────────────────────────────────────────┤
│ User types (minimum 3 chars)                                    │
├─────────────────────────────────────────────────────────────────┤
│ Real-time suggestions appear:                                   │
│  • Cuisines: "Pizza", "Chinese", "Biryani"                      │
│  • Dishes: "Butter Chicken", "Margherita"                       │
│  • Categories: "Fast Food", "Desserts"                          │
├─────────────────────────────────────────────────────────────────┤
│ User can:                                                       │
│  a) Click a suggestion to search                                │
│  b) Adjust filters (rating, delivery time)                      │
│  c) Press Enter or click "Search" button                        │
├─────────────────────────────────────────────────────────────────┤
│ Results displayed with:                                         │
│  • Restaurant image, name, cuisine, rating                      │
│  • Delivery time badge                                          │
│  • Clickable to view restaurant                                 │
├─────────────────────────────────────────────────────────────────┤
│ Empty state: "😕 No restaurants found - Try different terms"    │
└─────────────────────────────────────────────────────────────────┘

SMART SEARCH BEHAVIORS:
✓ Fuzzy matching on restaurant names & cuisines
✓ Dish-level search (finds "Biryani" even if user types "biyani")
✓ Location-aware (shows restaurants near selected location)
✓ Intelligent ranking: Popular cuisines → Highly rated → Delivery time
✓ Type-as-you-search with instant suggestions (debounced)

FILTERS AVAILABLE:
• ⭐ Minimum Rating: 0-5 (defaults to all)
• ⏱️ Max Delivery Time: 0-60 minutes (defaults to all)
• 🏷️ Category: Cuisines from selected restaurants
• 📍 Location: Current selected delivery location

API ENDPOINTS:

GET /api/search
├─ Query Parameters:
│  ├─ q (string): Search query
│  ├─ category (string): Cuisine/dish category
│  ├─ location (string): Delivery location
│  ├─ minRating (number): Minimum restaurant rating
│  └─ maxDeliveryTime (number): Max delivery minutes
└─ Response:
   {
     "results": [
       {
         "id": 1,
         "name": "Burger Palace",
         "cuisine": "Fast Food",
         "rating": 4.5,
         "location": "Bangalore, India",
         "image": "url",
         "deliveryTime": 25,
         "MenuItems": [
           { "id": 1, "name": "Veggie Burger", "price": 200, "category": "Burgers" }
         ]
       }
     ],
     "count": 15,
     "query": "burger",
     "filters": { "category": null, "location": "Bangalore", "minRating": null }
   }

GET /api/search/suggestions
├─ Query Parameters:
│  └─ q (string): Partial search query
└─ Response:
   {
     "suggestions": {
       "cuisines": ["Italian", "North Indian", "Fast Food"],
       "dishes": ["Margherita Pizza", "Butter Chicken", "Veggie Burger"],
       "categories": ["Pizza", "Biryanis", "Burgers"]
     }
   }

ERROR HANDLING:
• Network error: "🔌 Connection failed. Please try again."
• Empty results: "😕 No restaurants found. Try a different search term."
• Invalid filter: Reset filters automatically, show warning
• Slow search: Show loading spinner, allow cancellation

MICROCOPY (UX TEXT):
┌──────────────────────────────────────────────────────────────┐
│ "Search for cuisines, dishes, or restaurants..."             │
│ "Popular Cuisines" (suggestion section header)               │
│ "Trending Dishes" (suggestion section header)                │
│ "Results (15 found)" (when results > 0)                      │
│ "No restaurants found. Try different search terms"           │
│ "💡 Pro tip: Filter by rating for best experiences"          │
└──────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. OFFERS BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 LOCATION: Header navigation, always visible
🎯 PURPOSE: Display and apply promotional offers
⚙️ STATE: Different offers for logged-in vs logged-out users

USER FLOW:
┌─────────────────────────────────────────────────────────────────┐
│ User clicks "🏷️ Offers" button                                  │
├─────────────────────────────────────────────────────────────────┤
│ Modal opens showing:                                            │
│  • Info banner (if not logged in): "Sign in for personalized"  │
│  • Grid of available offer cards                               │
├─────────────────────────────────────────────────────────────────┤
│ Each offer card shows:                                          │
│  ┌──────────────────────────────┐                              │
│  │ [FIRST-ORDER] badge          │                              │
│  │ 50% OFF                       │                              │
│  │ Your first order             │                              │
│  │ ─────────────────────────────│                              │
│  │ Code: FIRST50                │                              │
│  │ Min: ₹150  Max Save: ₹200    │                              │
│  │ ─────────────────────────────│                              │
│  │ 💰 Save up to ₹200          │                              │
│  │ [Copy Code] → [✓ Copied!]   │                              │
│  └──────────────────────────────┘                              │
├─────────────────────────────────────────────────────────────────┤
│ User clicks "Copy Code" → Offer code copied to clipboard       │
│ Success confirmation appears (✓ Copied!)                       │
├─────────────────────────────────────────────────────────────────┤
│ At checkout: Code automatically applied or user pastes         │
├─────────────────────────────────────────────────────────────────┤
│ Modal also shows "How Offers Work" section explaining:         │
│  • First Order: New users get 50% off                           │
│  • Bank Offers: Extra discounts with partner banks              │
│  • Restaurant Specials: Exclusive deals                         │
│  • Seasonal: Limited-time promotions                            │
└─────────────────────────────────────────────────────────────────┘

OFFER TYPES:

1️⃣ FIRST-ORDER OFFERS
   └─ Type: "first-order"
   └─ Code: "FIRST50"
   └─ Discount: 50% off
   └─ Max: ₹200
   └─ Min Order: ₹150
   └─ Applicable: Only new users (0 previous orders)
   └─ Copy: "Get 50% off on your first order"

2️⃣ BANK OFFERS
   └─ Type: "bank"
   └─ Code: "BANK20"
   └─ Discount: 20% off
   └─ Max: ₹500
   └─ Min Order: ₹300
   └─ Partner: HDFC Bank credit cards
   └─ Copy: "20% off with HDFC Bank credit cards"

3️⃣ RESTAURANT SPECIALS
   └─ Type: "restaurant"
   └─ Code: "PIZZA10"
   └─ Discount: 10% off specific items
   └─ Max: ₹100
   └─ Min Order: ₹100
   └─ Copy: "10% off on Pizza items"

4️⃣ SEASONAL OFFERS
   └─ Type: "seasonal"
   └─ Code: "SUMMER30"
   └─ Discount: 30% off
   └─ Max: ₹400
   └─ Min Order: ₹250
   └─ Copy: "Summer special orders get 30% off"

AUTO-APPLICATION LOGIC:
✓ At checkout, system checks eligible offers automatically
✓ Multiple offers can stack (if allowed)
✓ Highest savings applied by default
✓ User can view & manage applied offers before final checkout
✓ Discount clearly shown: "💰 You save ₹X with OFFERCODE"

PERSONALIZED OFFERS (Logged-in Users):
✓ First-order offer hidden after 1st purchase
✓ Bank offers filtered by user's saved card types
✓ Restaurant offers based on favorite cuisines
✓ Seasonal offers always shown (time-based)

API ENDPOINTS:

GET /api/offers
├─ Query Parameters:
│  ├─ location (string): Delivery location
│  └─ minOrder (number): Filter by minimum order
└─ Response:
   {
     "offers": [
       {
         "id": 1,
         "type": "first-order",
         "code": "FIRST50",
         "discount": 50,
         "maxDiscount": 200,
         "minOrder": 150,
         "desc": "50% off on your first order",
         "valid": true,
         "applicable": function
       }
     ],
     "total": 4,
     "location": "Bangalore",
     "message": "Browse available offers"
   }

GET /api/offers/personalized (Requires Auth)
├─ Headers:
│  └─ Authorization: Bearer <token>
└─ Response:
   {
     "personalized": [
       { "id": 1, "type": "first-order", "code": "FIRST50", ... }
     ],
     "recommended": [ ... ],
     "saved": [ "FIRST50", "BANK20" ],
     "message": "3 offers available for you"
   }

POST /api/offers/apply
├─ Body:
│  ├─ code (string): Offer code to apply
│  └─ cartTotal (number): Current cart total
└─ Response:
   {
     "success": true,
     "discount": 75,
     "finalTotal": 425,
     "offerDetails": {
       "code": "FIRST50",
       "type": "first-order",
       "desc": "50% off on your first order"
     }
   }

ERROR HANDLING:
• Invalid code: "Invalid offer code. Please check and try again."
• Minimum order not met: "Minimum order ₹150 required. Add more items."
• Expired offer: "This offer has expired. Try another."
• Already used: "You've already used this offer."
• Success: Brief success animation with savings amount

MICROCOPY (UX TEXT):
┌──────────────────────────────────────────────────────────────┐
│ "Sign in to unlock personalized offers & auto-apply savings!"│
│ "Available Offers" (modal header)                            │
│ "First Order  Bank  Restaurant  Seasonal" (category tags)   │
│ "Code: FIRST50" (code display)                              │
│ "Min ₹150" (minimum order requirement)                      │
│ "Copy Code" → "✓ Copied!"                                   │
│ "How Offers Work" (info section)                            │
│ "💡 Pro tip: Use multiple offers for maximum savings"       │
│ "No offers available. Check back soon for new deals!"       │
└──────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. HELP BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 LOCATION: Header navigation, always visible
🎯 PURPOSE: Context-aware customer support with AI-assisted flow
⚙️ STATE: Different features for logged-in vs logged-out users

USER FLOW:
┌─────────────────────────────────────────────────────────────────┐
│ User clicks "❓ Help" button                                    │
├─────────────────────────────────────────────────────────────────┤
│ STEP 1: Select Category                                         │
│   Buttons displayed:                                            │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│   │ 📦 Order     │  │ 💳 Payment   │  │ 🚗 Delivery  │         │
│   │ Issues       │  │ Help         │  │ Issues       │         │
│   └──────────────┘  └──────────────┘  └──────────────┘         │
│   ┌──────────────┐                                              │
│   │ 👤 Account   │                                              │
│   │ & Login      │                                              │
│   └──────────────┘                                              │
├─────────────────────────────────────────────────────────────────┤
│ STEP 2: Select Specific Issue (from category)                  │
│   Example for "Order Issues":                                  │
│   ┌──────────────────────────────┐                            │
│   │ Where is my order?           │                            │
│   ├──────────────────────────────┤                            │
│   │ Order seems wrong            │                            │
│   ├──────────────────────────────┤                            │
│   │ Payment issue                │                            │
│   └──────────────────────────────┘                            │
├─────────────────────────────────────────────────────────────────┤
│ STEP 3: Show Solution (AI-Assisted)                            │
│   ┌─────────────────────────────────────────────────────────┐ │
│   │ ✓ SOLUTION                                              │ │
│   │ ─────────────────────────────────────────────────────── │ │
│   │ "Contact delivery partner using the call button on      │ │
│   │  your active order. Real-time tracking available."      │ │
│   │                                                         │ │
│   │ [Ask Another Question] [Close]                         │ │
│   └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ IF NO SOLUTION FOUND:                                           │
│   User can escalate to human support:                           │
│   • Must be logged in to escalate                              │
│   • Fill issue description form                                │
│   • Submit creates support ticket                              │
│   • Confirmation: "Support Ticket Created!"                    │
│   • Ticket ID & ETA (2 hours) shown                           │
└─────────────────────────────────────────────────────────────────┘

HELP CATEGORIES & ISSUES:

📦 ORDER ISSUES
├─ Where is my order? 
│  → "Contact delivery partner (📞 call button on order)"
├─ Order seems wrong
│  → "We will refund the difference"
└─ Payment issue
   → "Your payment is being processed"

💳 PAYMENT HELP
├─ Payment failed
│  → "Try another card or payment method"
├─ Refund pending
│  → "Refund processes within 5-7 business days"
└─ Card not accepted
   → "Try Debit Card or UPI"

🚗 DELIVERY ISSUES
├─ Delivery charge high
│  → "Delivery charges based on distance & time"
├─ No delivery available
│  → "Try different restaurants in your area"
└─ Delivery delayed
   → "Live track your delivery"

👤 ACCOUNT & LOGIN
├─ Can't login
│  → "Check email/password, try reset option"
├─ Password reset
│  → "Reset link sent to your email"
└─ Account suspended
   → "Contact support team"

ESCALATION FLOW (When AI Can't Help):
┌─────────────────────────────────────────────────────────────────┐
│ No automatic solution available                                 │
├─────────────────────────────────────────────────────────────────┤
│ Show escalation form:                                           │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ 📞 Escalate to Support                                      ││
│ │ Our team will contact you within 2 hours                   ││
│ │                                                             ││
│ │ [Text Area]                                                 ││
│ │ Describe your issue in detail...                            ││
│ │                                                             ││
│ │ [Create Support Ticket]                                     ││
│ └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│ On submission:                                                  │
│ • Generate unique ticket ID                                     │
│ • Store in database with user info                             │
│ • Send confirmation email                                       │
│ • Show success message with ticket ID                          │
│ • Set SLA: 2-hour response target                              │
└─────────────────────────────────────────────────────────────────┘

API ENDPOINTS:

GET /api/help/topics
└─ Response:
   {
     "topics": ["order", "payment", "delivery", "account"],
     "message": "Select your issue category"
   }

GET /api/help/issues/:category
├─ Path Parameters:
│  └─ category (string): "order", "payment", "delivery", "account"
└─ Response:
   {
     "category": "order",
     "issues": [
       "Where is my order?",
       "Order seems wrong",
       "Payment issue"
     ],
     "message": "Common order issues"
   }

GET /api/help/solution/:category/:issue
├─ Path Parameters:
│  ├─ category (string): Issue category
│  └─ issue (string): Specific issue
└─ Response:
   {
     "category": "order",
     "issue": "Where is my order?",
     "solution": "Contact delivery partner using call button...",
     "escalate": false
   }

POST /api/help/escalate (Requires Auth)
├─ Headers:
│  └─ Authorization: Bearer <token>
├─ Body:
│  ├─ category (string): Issue category
│  ├─ issue (string): Issue description
│  └─ description (string): Detailed explanation
└─ Response:
   {
     "ticket": {
       "id": "TKT123456",
       "userId": 42,
       "category": "order",
       "issue": "Where is my order?",
       "description": "Order placed 2 hours ago, no updates",
       "status": "open",
       "createdAt": "2025-12-22T10:00:00Z"
     },
     "message": "Support ticket created. Our team will reach out within 2 hours."
   }

ERROR HANDLING:
• Invalid category: Auto-redirect to category selection
• Network error: "Connection failed. Please try again."
• Escalation auth fail: "Please sign in to create support ticket"
• Empty description: Prevent form submission with validation
• Escalation success: Clear confirmation with ticket ID

MICROCOPY (UX TEXT):
┌──────────────────────────────────────────────────────────────┐
│ "What can we help you with?" (main intro)                   │
│ "What's the issue?" (category selection intro)              │
│ "✓ SOLUTION" (success state heading)                        │
│ "📞 Escalate to Support" (escalation form heading)          │
│ "Our team will contact you within 2 hours"                  │
│ "Describe your issue in detail..."                          │
│ "Support Ticket Created!" (success heading)                 │
│ "Reference ID will be sent to your email"                   │
│ "📞 Can't wait? Call us 24/7" (footer micro-copy)           │
│ "🔐 Please sign in to escalate"                             │
└──────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. CROSS-FUNCTIONAL DESIGN PATTERNS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MODAL BEHAVIOR (All Three Modals)
├─ Opening: Smooth fade-in + slide-up animation
├─ Closing: Fade-out animation
├─ Backdrop: Dark overlay with click-to-close
├─ Keyboard: ESC to close, Enter for actions
├─ Focus: Auto-focus first input (search, description)
├─ Scroll: Body scroll locked while modal open
├─ Responsive: 90% width on mobile, max 600px desktop
└─ Z-Index: Above all content (z-index: 300)

EMPTY STATES
├─ Search: "😕 No restaurants found. Try different terms."
├─ Offers: "😢 No offers available. Check back soon!"
├─ Help: N/A (always has categories)
├─ Style: Centered, emoji + text, sub-text suggestion
├─ Action: Suggestion to refine or try alternatives
└─ Animation: Fade-in to draw attention

LOADING STATES
├─ Search suggestions: Debounced 300ms, no loader
├─ Search results: Spinner + "Searching..." button state
├─ Offers: Spinner + "Loading offers..." text
├─ Help: Instant (no network call for topics)
└─ Timeout: 10s max before error message

SUCCESS STATES
├─ Search: Results grid animates in
├─ Offers: "✓ Copied!" badge on code copy
├─ Help: Green background solution box + checkmark
├─ Animation: All 200-400ms ease transitions
└─ Auto-hide: Offer success toast disappears after 3s

ERROR HANDLING
├─ User-friendly: No technical jargon or error codes
├─ Actionable: Suggest next steps
├─ Tone: Helpful, not alarmist
├─ Examples:
│  ├─ Search: "Try different search terms or adjust filters"
│  ├─ Offers: "Please check offer code"
│  └─ Help: "Our support team will help"
└─ Recovery: Always allow retry or alternative action

LOCATION CONTEXT
├─ Available in: Search filters, Offer location filter
├─ Current location: From Header's location selector
├─ Sticky: Persists during session
├─ Changes: Update all results when location changes
├─ Delivery: All content location-aware for availability
└─ APIs: Include location in query for relevance

AUTHENTICATION CONTEXT
├─ Logged Out:
│  ├─ Search: Works fully, no personalization
│  ├─ Offers: All offers visible, no saved offers
│  └─ Help: All help visible, can't escalate
├─ Logged In:
│  ├─ Search: Same, plus order history context
│  ├─ Offers: Personalized recommendations visible
│  └─ Help: Can escalate to support
└─ Auth Fail: Clear login prompt, not errors

MICROCOPY CONSISTENCY
├─ Tone: Friendly, helpful, not corporate
├─ Icons: Used consistently (📦 order, 💳 payment, etc.)
├─ Calls-to-Action: Action-oriented verbs
├─ Confirmations: Positive & encouraging
├─ Errors: Sympathetic & solution-focused
└─ Examples:
   ├─ ✓ "Save up to ₹200 with FIRST50"
   ├─ ✓ "Our team will reach out within 2 hours"
   ├─ ✗ "Error 404: Not Found"

PERFORMANCE OPTIMIZATION
├─ Search:
│  ├─ Debounce suggestion typing: 300ms
│  ├─ Limit results: 20 per page
│  ├─ Cache popular searches: Browser localStorage
│  └─ Lazy load images in results
├─ Offers:
│  ├─ Cache offer list: 5 minutes
│  ├─ Client-side filtering for faster updates
│  └─ Pre-load offer images
├─ Help:
│  ├─ Topics hardcoded (no network call)
│  ├─ Solutions in-memory lookup
│  └─ Escalation queued (can proceed offline)
└─ Modals:
   ├─ Code-split for lazy loading
   ├─ Virtual scrolling for large lists
   └─ Single instance per modal type

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. EXAMPLE USER JOURNEYS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JOURNEY 1: First-Time User (Logged Out) → Hungry
┌─────────────────────────────────────────────────────────────────┐
│ 1. Opens app, doesn't know what to eat                          │
│ 2. Clicks "🔍 Search" button                                    │
│ 3. Types "biryani"                                              │
│ 4. Sees suggestions: Biryani restaurants, dishes, cuisines      │
│ 5. Clicks "Hyderabadi Biryani" suggestion                       │
│ 6. Results show 8 biryani restaurants                           │
│ 7. Filters by ⭐4.5+ rating → 3 restaurants                      │
│ 8. Clicks restaurant → Sees menu                                │
│ 9. Adds items to cart                                           │
│ 10. Goes to checkout                                            │
│ 11. Sees "🏷️ Offers" banner showing FIRST50 (50% off)           │
│ 12. Clicks to apply → Saves ₹150                                │
│ 13. Places order                                                │
│ └─ TIME TO CONVERSION: ~3 minutes                               │

JOURNEY 2: User Has Problem → Help Escalation
┌─────────────────────────────────────────────────────────────────┐
│ 1. User placed order, no update for 30 minutes                  │
│ 2. Clicks "❓ Help" button                                       │
│ 3. Selects "📦 Order Issues" category                            │
│ 4. Selects "Where is my order?" issue                           │
│ 5. Gets auto-solution: "Call delivery partner"                  │
│ 6. But user still confused, needs human help                    │
│ 7. Manual escalation triggered                                  │
│ 8. Fills form: "Order tracking is not updating in app"         │
│ 9. Creates support ticket TKT-78934                             │
│ 10. Gets confirmation with 2-hour SLA                           │
│ 11. Support team calls within 1.5 hours                         │
│ 12. Issue resolved (delivery stuck in traffic)                  │
│ └─ RESOLUTION TIME: ~90 minutes                                 │

JOURNEY 3: Repeat User → Looking for Deals
┌─────────────────────────────────────────────────────────────────┐
│ 1. User logs in, wants lunch but budget-conscious              │
│ 2. Clicks "🏷️ Offers" button                                    │
│ 3. Sees personalized offers (logged-in specific)                │
│ 4. 3 relevant offers: BANK20 (20% off), SEASONAL30 (30% off)   │
│ 5. SEASONAL30 has better savings, applies code                 │
│ 6. Navigates to restaurants via Search                          │
│ 7. Filters by min ₹4.0 rating in north Indian cuisine          │
│ 8. Selects "Taj Express"                                        │
│ 9. Adds butter chicken & naan to cart                           │
│ 10. At checkout: SEASONAL30 auto-applied                        │
│ 11. Sees savings: "💰 You save ₹120 with SEASONAL30"            │
│ 12. Total: ₹400 - ₹120 = ₹280 (28% actual savings)             │
│ 13. Completes order                                             │
│ └─ SATISFACTION METRIC: 4.8/5 (perceived value)                │

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. TESTING CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SEARCH BUTTON
□ Modal opens on click
□ Input auto-focuses
□ Suggestions appear after 3 chars
□ Clicking suggestion performs search
□ Filters apply correctly
□ Empty results show proper message
□ Results clickable to navigate
□ Mobile responsive (single column)
□ Keyboard Enter triggers search
□ ESC closes modal

OFFERS BUTTON
□ Modal opens on click
□ All offers display correctly
□ Copy-to-clipboard works
□ Success toast appears
□ Info section explains offers
□ Logged-out vs logged-in differences
□ Offer codes valid for apply endpoint
□ Mobile responsive (single column offers)
□ ESC closes modal

HELP BUTTON
□ Modal opens on click
□ Category buttons clickable
□ Issues list shows for category
□ Solution displays with auto-solution
□ Solution display is readable
□ Escalation form appears for unsolvable
□ Escalation requires login (redirects)
□ Ticket creation successful
□ Success confirmation shows ticket ID
□ Back button returns to categories
□ Mobile responsive

SHARED (ALL MODALS)
□ Animations smooth (150-400ms)
□ Backdrop click closes modal
□ Multiple modals can't open simultaneously
□ Scroll lock active while modal open
□ Z-index correct (above header, below others)
□ No content leakage outside modal
□ Loading states show correctly
□ Error messages display properly
□ Network latency handled gracefully
□ Mobile viewport fits content

═══════════════════════════════════════════════════════════════════════════════
END OF SPECIFICATION
═══════════════════════════════════════════════════════════════════════════════
