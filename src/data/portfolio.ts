export interface HeroCollageItem {
  src: string;
  alt: string;
  label: string;
  variant?: 'wide' | 'tall';
}

export interface ShowcaseItem {
  src: string;
  alt: string;
  title: string;
  category: string;
  description: string;
  accent?: string;
}

export const heroCollage: HeroCollageItem[] = [
  {
    src: '/media/factura78/lady-dior-white.jpg',
    alt: 'Белая сумка Lady Dior до и после восстановления.',
    label: 'Сумки / фурнитура',
    variant: 'wide',
  },
  {
    src: '/media/factura78/black-leather-jacket-front.jpg',
    alt: 'Черная кожаная куртка до и после восстановления.',
    label: 'Кожа / куртки',
    variant: 'tall',
  },
  {
    src: '/media/factura78/new-balance-blue-raw.jpg',
    alt: 'Голубые New Balance до и после чистки.',
    label: 'Кроссовки / чистка',
  },
  {
    src: '/media/factura78/gucci-white-bag.jpg',
    alt: 'Светлая сумка Gucci до и после чистки.',
    label: 'Светлая кожа',
    variant: 'wide',
  },
  {
    src: '/media/factura78/buckled-black-sneakers.jpg',
    alt: 'Черные кеды с ремешками до и после восстановления.',
    label: 'Ремонт обуви',
  },
  {
    src: '/media/factura78/brown-leather-jacket.jpg',
    alt: 'Коричневая кожаная куртка до и после ухода.',
    label: 'Покраска / уход',
  },
];

export const showcaseGallery: ShowcaseItem[] = [
  {
    src: '/media/factura78/loafers-brown-before-after.jpg',
    alt: 'Замшевые лоферы до и после восстановления цвета.',
    title: 'Замшевые лоферы',
    category: 'Обувь / замша',
    description: 'Выравниваем тон, убираем замятия и возвращаем паре аккуратный, спокойный вид.',
    accent: 'Чистка + освежение цвета',
  },
  {
    src: '/media/factura78/wallabees-sand-before-after.jpg',
    alt: 'Бежевые wallabee до и после глубокой чистки.',
    title: 'Wallabee светлой замши',
    category: 'Обувь / чистка',
    description: 'Работаем с грязью, пятнами и общим серым налетом без грубого вмешательства в материал.',
    accent: 'Глубокая чистка',
  },
  {
    src: '/media/factura78/armani-blue-before-after.jpg',
    alt: 'Синие кроссовки Armani Exchange до и после освежения.',
    title: 'Armani Exchange',
    category: 'Кроссовки / освежение',
    description: 'Собираем пару визуально: верх, кант и подошва снова смотрятся как единое изделие.',
    accent: 'Освежение текстиля и замши',
  },
  {
    src: '/media/factura78/dior-high-top-before-after.jpg',
    alt: 'Высокие кеды Dior до и после чистки.',
    title: 'Dior high-top',
    category: 'Кроссовки / люкс',
    description: 'Убираем загрязнения с пары и возвращаем светлым элементам чистое, читаемое состояние.',
    accent: 'Бережная чистка',
  },
  {
    src: '/media/factura78/nike-pink-before-after.jpg',
    alt: 'Розовые кроссовки Nike до и после чистки.',
    title: 'Розовые Nike',
    category: 'Кроссовки / светлые пары',
    description: 'Когда нужно вернуть цвет, белые панели и общий свежий вид без ощущения перегруза.',
    accent: 'Светлая пара без разводов',
  },
  {
    src: '/media/factura78/new-balance-white-before-after.jpg',
    alt: 'Белые New Balance до и после ухода.',
    title: 'Белые New Balance',
    category: 'Кроссовки / повседневные',
    description: 'Поднимаем общее ощущение чистоты и убираем усталость с пары, которую носят каждый день.',
    accent: 'Белый верх + сетка',
  },
  {
    src: '/media/factura78/timberland-beige-before-after.jpg',
    alt: 'Бежевые Timberland до и после восстановления.',
    title: 'Timberland',
    category: 'Обувь / нубук',
    description: 'Выводим грязь из материала и возвращаем аккуратность, не убивая мягкую фактуру верха.',
    accent: 'Нубук / сезонная профилактика',
  },
  {
    src: '/media/factura78/black-low-sneakers-before-after.jpg',
    alt: 'Черные низкие кеды до и после чистки.',
    title: 'Черные кеды',
    category: 'Обувь / базовые пары',
    description: 'Собираем в одно целое цвет, кант и носы, чтобы пара снова выглядела ухоженно.',
    accent: 'Чистка + выравнивание тона',
  },
  {
    src: '/media/factura78/new-balance-blue-before-after.jpg',
    alt: 'Голубые New Balance до и после чистки.',
    title: 'New Balance blue',
    category: 'Кроссовки / до-после',
    description: 'Контрастный кейс с заметной городской грязью: после работы пара снова выглядит живой и собранной.',
    accent: 'Один из самых наглядных кейсов',
  },
  {
    src: '/media/factura78/sock-boots-black-before-after.jpg',
    alt: 'Черные текстильные ботильоны до и после восстановления.',
    title: 'Текстильные ботильоны',
    category: 'Обувь / деликатная работа',
    description: 'Убираем следы носки и возвращаем плотный черный цвет там, где он особенно заметен.',
    accent: 'Чистка + работа с цветом',
  },
];

export const recentStrip = [
  {
    src: '/media/factura78/saint-laurent-sneakers.jpg',
    alt: 'Кеды Saint Laurent до и после восстановления.',
    title: 'Saint Laurent',
  },
  {
    src: '/media/factura78/vans-old-skool.jpg',
    alt: 'Кеды Vans до и после чистки.',
    title: 'Vans Old Skool',
  },
  {
    src: '/media/factura78/ugg-slippers.jpg',
    alt: 'Тапочки UGG до и после чистки.',
    title: 'UGG',
  },
  {
    src: '/media/factura78/woven-black-bag.jpg',
    alt: 'Черная плетеная сумка до и после ухода.',
    title: 'Плетеная сумка',
  },
  {
    src: '/media/factura78/furla-bag.jpg',
    alt: 'Коричневая сумка Furla до и после восстановления.',
    title: 'Furla',
  },
  {
    src: '/media/factura78/brown-boots.jpg',
    alt: 'Коричневые ботинки до и после восстановления.',
    title: 'Ботинки',
  },
];

export const deliveryVisual = {
  src: '/media/factura78/gucci-white-bag.jpg',
  alt: 'Светлая сумка после восстановления, пример аккуратной выдачи изделия.',
};

export const serviceVisualsBySlug: Record<
  string,
  { src: string; alt: string; label: string }
> = {
  'chistka-i-vosstanovlenie-krossovok-spb': {
    src: '/media/factura78/new-balance-blue-before-after.jpg',
    alt: 'Голубые New Balance до и после чистки.',
    label: 'Кроссовки / чистка',
  },
  'remont-obuvi-spb': {
    src: '/media/factura78/black-low-sneakers-before-after.jpg',
    alt: 'Черные кеды до и после ремонта и чистки.',
    label: 'Подошва / носы / швы',
  },
  'remont-sumok-spb': {
    src: '/media/factura78/lady-dior-white.jpg',
    alt: 'Сумка Lady Dior до и после восстановления.',
    label: 'Сумки / фурнитура',
  },
  'pokraska-i-vosstanovlenie-kozhi-spb': {
    src: '/media/factura78/black-leather-jacket-front.jpg',
    alt: 'Кожаная куртка до и после ухода и восстановления.',
    label: 'Кожа / цвет / уход',
  },
};
