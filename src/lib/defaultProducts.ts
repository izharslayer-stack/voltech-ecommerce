import { Product } from '@/types';

/**
 * Default seed products for the electronics store.
 * These are loaded once on first run via the products store.
 */
export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    category: 'Headphones',
    price: 349,
    originalPrice: 399,
    description:
      'Industry-leading noise cancellation, 30-hour battery life, and exceptional call quality in a lightweight, premium design.',
    longDescription: `The WH-1000XM5 sets the bar for premium wireless noise-cancelling headphones. With eight microphones and two processors, it delivers unmatched noise cancellation in every environment.

The 30mm carbon-fibre composite driver units produce a sound signature that's both warm and detailed — perfect for long listening sessions. The redesigned earcups use soft-fit leather for hours of fatigue-free comfort.

Multipoint connection lets you pair with two devices simultaneously. Speak-to-Chat automatically pauses playback when you start talking. DSEE Extreme AI upscales compressed audio in real time.`,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
    ],
    stock: 24,
    sku: 'SNY-WH1000XM5-BLK',
    rating: 4.9,
    featured: true,
    status: 'active',
    createdAt: '2024-01-15T08:00:00.000Z',
  },
  {
    id: 'prod_002',
    name: 'Apple MacBook Air M3',
    slug: 'apple-macbook-air-m3',
    category: 'Laptops',
    price: 1299,
    originalPrice: 1499,
    description:
      'Supercharged by M3 chip, 18-hour battery, 15.3-inch Liquid Retina display — our thinnest and lightest notebook.',
    longDescription: `MacBook Air with M3 is engineered for those who demand performance without compromise. The M3 chip, built on 3-nanometre technology, delivers up to 60% faster CPU performance than M1.

The 15.3-inch Liquid Retina display with P3 wide colour and 500 nits brightness makes every image vivid. A six-speaker sound system with spatial audio fills the room.

Up to 24GB unified memory ensures fluid multitasking. With fanless, silent operation and all-day battery life, this is the laptop that goes wherever you do.`,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80',
    ],
    stock: 12,
    sku: 'APL-MBA-M3-15-SLV',
    rating: 4.8,
    featured: true,
    status: 'active',
    createdAt: '2024-01-20T08:00:00.000Z',
  },
  {
    id: 'prod_003',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    category: 'Smartphones',
    price: 1199,
    originalPrice: 1299,
    description:
      'The ultimate Galaxy with a 200MP camera, integrated S Pen, Snapdragon 8 Gen 3, and titanium build.',
    longDescription: `Galaxy S24 Ultra redefines what a smartphone can do. The 200MP adaptive pixel sensor captures breathtaking detail in any light — from sweeping landscapes to intimate portraits.

The integrated S Pen feels more natural than ever for notes, sketches, and precision navigation. Snapdragon 8 Gen 3 for Galaxy, the most powerful mobile chip, ensures everything flies.

Galaxy AI features like Live Translate, Circle to Search, and Chat Assist bring genuinely useful intelligence to everyday tasks. The titanium frame and Corning Gorilla Armor make it as durable as it is beautiful.`,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80',
    ],
    stock: 18,
    sku: 'SAM-S24U-256-TBK',
    rating: 4.7,
    featured: true,
    status: 'active',
    createdAt: '2024-01-25T08:00:00.000Z',
  },
  {
    id: 'prod_004',
    name: 'iPad Pro M4 13"',
    slug: 'ipad-pro-m4-13',
    category: 'Tablets',
    price: 1099,
    originalPrice: 1299,
    description:
      'Impossibly thin at 5.1mm. Ultra Retina XDR OLED display. M4 chip. The most advanced iPad ever.',
    longDescription: `The new iPad Pro is the thinnest Apple product ever made at just 5.1mm — yet it is the most powerful by far. The M4 chip delivers next-level performance for everything from editing 4K video to running demanding creative apps.

The Ultra Retina XDR OLED display with ProMotion technology and 1000 nits brightness makes the visual experience extraordinary. Apple Pencil Pro brings precision and natural feel to every stroke.

With Wi-Fi 6E, Bluetooth 5.3, and an optional 5G connection, you stay connected at the fastest speeds wherever you are.`,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
    ],
    stock: 9,
    sku: 'APL-IPADPRO-M4-13-SLV',
    rating: 4.9,
    featured: false,
    status: 'active',
    createdAt: '2024-02-01T08:00:00.000Z',
  },
  {
    id: 'prod_005',
    name: 'Sony A7 IV Camera',
    slug: 'sony-a7-iv',
    category: 'Cameras',
    price: 2499,
    originalPrice: 2799,
    description:
      '33MP full-frame BSI sensor, 4K 60p video, 10fps burst shooting, and real-time eye-tracking autofocus.',
    longDescription: `The α7 IV is a full-frame mirrorless camera built for creators who refuse to compromise. The 33-megapixel Exmor R CMOS sensor captures rich detail and natural colour in virtually any light.

Real-time Tracking with Eye AF automatically locks onto subjects — human or animal — with extraordinary precision. Shoot at up to 10fps with full AF/AE tracking, or record 4K 60p video with 10-bit 4:2:2 colour.

The Z battery provides approximately 520 shots per charge. Weather sealing, a 3-inch vari-angle touchscreen, and dual card slots round out a camera that keeps pace with every assignment.`,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
    ],
    stock: 6,
    sku: 'SNY-A7IV-BODY',
    rating: 4.8,
    featured: false,
    status: 'active',
    createdAt: '2024-02-05T08:00:00.000Z',
  },
  {
    id: 'prod_006',
    name: 'Apple Watch Ultra 2',
    slug: 'apple-watch-ultra-2',
    category: 'Wearables',
    price: 799,
    originalPrice: 899,
    description:
      'The most rugged Apple Watch. Titanium case, 3000 nits display, dual-frequency GPS, and 60-hour battery.',
    longDescription: `Apple Watch Ultra 2 is engineered for exploration. The 49mm titanium case is precision-machined for strength and lightness. The 3000-nit always-on Retina display remains readable even in harsh midday sun.

Dual-frequency GPS with L1 and L5 bands delivers accurate positioning in dense cities and deep canyons alike. Depth gauge and water temperature sensor serve divers to 100 metres. The international emergency siren reaches 86dB.

Customisable Action button gives instant access to your most important function. Cellular keeps you connected when your iPhone stays behind.`,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    ],
    stock: 15,
    sku: 'APL-AWULTRA2-TIT',
    rating: 4.7,
    featured: true,
    status: 'active',
    createdAt: '2024-02-10T08:00:00.000Z',
  },
  {
    id: 'prod_007',
    name: 'LG C3 OLED 55"',
    slug: 'lg-c3-oled-55',
    category: 'TVs & Displays',
    price: 1299,
    originalPrice: 1799,
    description:
      'Perfect blacks, self-lit pixels, Dolby Vision IQ, 4K 120Hz gaming, and evo panel upgrade.',
    longDescription: `The LG C3 OLED delivers the picture quality that serious viewers have always wanted. Every pixel is individually lit and can be turned completely off for perfect blacks and infinite contrast.

The α9 Gen6 AI processor analyses content in real time to optimise picture and sound. Dolby Vision IQ and Dolby Atmos deliver a cinematic experience at home. Four HDMI 2.1 ports support 4K at 120Hz for next-generation gaming.

webOS 23 with ThinQ AI brings a smart, fast, and intuitive interface. The slim Gallery Stand lets it sit flush to any wall or stand elegantly in any room.`,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=800&q=80',
    ],
    stock: 8,
    sku: 'LG-OLED55C3-BLK',
    rating: 4.9,
    featured: false,
    status: 'active',
    createdAt: '2024-02-15T08:00:00.000Z',
  },
  {
    id: 'prod_008',
    name: 'Bose SoundLink Max',
    slug: 'bose-soundlink-max',
    category: 'Audio',
    price: 399,
    originalPrice: 449,
    description:
      'Our biggest, loudest portable speaker. IP67-rated, 20-hour battery, and full-range stereo sound.',
    longDescription: `SoundLink Max is designed to move the party wherever you go. Bose engineers tuned the transducers and ports for the biggest, most immersive sound we have ever put into a portable speaker.

IP67 waterproof and dustproof rating means it shrugs off rain, splashes, and poolside drops. Up to 20 hours of battery life keeps the music going all day and into the night.

Connect two SoundLink Max speakers in stereo or party mode via the Bose app. The premium woven exterior and anodised aluminium handle give it a look that matches the quality of the sound.`,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
    ],
    stock: 20,
    sku: 'BSE-SNDLNKMAX-BLK',
    rating: 4.6,
    featured: false,
    status: 'active',
    createdAt: '2024-02-20T08:00:00.000Z',
  },
];
