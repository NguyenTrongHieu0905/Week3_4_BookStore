import React, {useMemo, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {books, cart as initialCart, categories} from './data';

type Book = (typeof books)[number];
type CartItem = {id: number; quantity: number};
type Page = 'home' | 'categories' | 'detail' | 'cart' | 'account';

const colors = {
  navy: '#17223B',
  indigo: '#4353A4',
  sky: '#EAF0FF',
  ink: '#1F2937',
  muted: '#6B7280',
  line: '#E5EAF3',
  danger: '#E84D42',
  surface: '#FFFFFF',
  appBg: '#F5F7FB',
};

const money = (value: number) => value.toLocaleString('vi-VN') + ' đ';

function getTotalQuantity(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function Cover({book, compact = false}: {book: Book; compact?: boolean}) {
  return (
    <View
      style={[
        styles.cover,
        {backgroundColor: book.color},
        compact && styles.coverCompact,
      ]}>
      <Text style={[styles.coverIcon, compact && styles.coverIconCompact]}>
        {book.emoji}
      </Text>
      <Text
        numberOfLines={2}
        style={[styles.coverText, compact && styles.coverTextCompact]}>
        {book.title}
      </Text>
    </View>
  );
}

function Header({cartCount, onCart}: {cartCount: number; onCart: () => void}) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.brand}>BookStore</Text>
        <Text style={styles.headerCaption}>Online bookstore</Text>
      </View>

      <View style={styles.headerActions}>
        <Pressable style={styles.iconButton}>
          <Text style={styles.headerIcon}>⌕</Text>
        </Pressable>
        <Pressable onPress={onCart} style={styles.iconButton}>
          <Text style={styles.headerIcon}>🛒</Text>
          {cartCount > 0 ? (
            <View style={styles.headerBadge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}

function SectionTitle({title, action}: {title: string; action?: string}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

function CategoryChips({
  selected,
  onSelect,
}: {
  selected?: string;
  onSelect?: (category: string) => void;
}) {
  return (
    <View style={styles.chips}>
      {categories.map(category => {
        const active = selected === category;

        return (
          <Pressable
            key={category}
            onPress={() => onSelect?.(category)}
            style={[styles.chip, active && styles.chipActive]}>
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {category}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function DiscountBadge({book}: {book: Book}) {
  if (book.discount > 0) {
    return (
      <View style={styles.discountBadge}>
        <Text style={styles.badgeText}>-{book.discount}%</Text>
      </View>
    );
  }

  if (book.isNew) {
    return (
      <View style={styles.newBadge}>
        <Text style={styles.badgeText}>Mới</Text>
      </View>
    );
  }

  return null;
}

function RowBookCard({book, onPress}: {book: Book; onPress: () => void}) {
  return (
    <Pressable onPress={onPress} style={styles.rowCard}>
      <View style={styles.rowCoverWrap}>
        <Cover book={book} compact />
        <DiscountBadge book={book} />
      </View>
      <View style={styles.rowInfo}>
        <View>
          <Text numberOfLines={2} style={styles.rowTitle}>
            {book.title}
          </Text>
          <Text numberOfLines={1} style={styles.metaText}>
            {book.author}
          </Text>
          <Text numberOfLines={1} style={styles.tagText}>
            {book.category} · {book.rating.toFixed(1)}★
          </Text>
        </View>
        <Text style={styles.price}>{money(book.price)}</Text>
      </View>
    </Pressable>
  );
}

function GridCard({book, onPress}: {book: Book; onPress: () => void}) {
  return (
    <Pressable onPress={onPress} style={styles.gridItem}>
      <View style={styles.gridCoverWrap}>
        <Cover book={book} />
        <DiscountBadge book={book} />
      </View>
      <Text numberOfLines={2} style={styles.gridTitle}>
        {book.title}
      </Text>
      <Text numberOfLines={1} style={styles.metaText}>
        {book.author}
      </Text>
      <View style={styles.gridFooter}>
        <Text style={styles.price}>{money(book.price)}</Text>
        <Text style={styles.rating}>{book.rating.toFixed(1)}★</Text>
      </View>
    </Pressable>
  );
}

function FloatingCart({
  count,
  onPress,
}: {
  count: number;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.floatingCart}>
      <Text style={styles.floatingIcon}>🛒</Text>
      {count > 0 ? (
        <View style={styles.cartCount}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

function Home({
  cartCount,
  openBook,
  openCart,
}: {
  cartCount: number;
  openBook: (book: Book) => void;
  openCart: () => void;
}) {
  const featuredBooks = books.slice(0, 3);

  return (
    <View style={styles.contentLayer}>
      <ScrollView
        style={styles.fill}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.homeContent}>
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroKicker}>Bộ sưu tập tuần này</Text>
            <Text style={styles.heroTitle}>Đọc một cuốn hay, mở thêm một ngày mới</Text>
            <Text style={styles.heroText}>
              Gợi ý sách nổi bật, danh mục linh hoạt và lưới sản phẩm 2 cột.
            </Text>
          </View>
          <View style={styles.heroCover}>
            <Cover book={books[0]} />
          </View>
        </View>

        <SectionTitle title="Danh mục nổi bật" />
        <CategoryChips />

        <SectionTitle title="Sách nổi bật" action="Dạng row card" />
        {featuredBooks.map(book => (
          <RowBookCard key={book.id} book={book} onPress={() => openBook(book)} />
        ))}

        <SectionTitle title="Sách dành cho bạn" action="Lưới 2 cột" />
        <View style={styles.grid}>
          {books.map(book => (
            <GridCard key={book.id} book={book} onPress={() => openBook(book)} />
          ))}
        </View>
      </ScrollView>

      <FloatingCart count={cartCount} onPress={openCart} />
    </View>
  );
}

function Categories({
  selectedCategory,
  setSelectedCategory,
  openBook,
}: {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  openBook: (book: Book) => void;
}) {
  const visibleBooks = books.filter(book => book.category === selectedCategory);

  return (
    <ScrollView
      style={styles.fill}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}>
      <Text style={styles.screenTitle}>Danh mục sách</Text>
      <CategoryChips selected={selectedCategory} onSelect={setSelectedCategory} />

      <SectionTitle title={selectedCategory} action={`${visibleBooks.length} sách`} />
      {visibleBooks.map(book => (
        <RowBookCard key={book.id} book={book} onPress={() => openBook(book)} />
      ))}
    </ScrollView>
  );
}

function Detail({
  book,
  onBack,
  onAddToCart,
}: {
  book: Book;
  onBack: () => void;
  onAddToCart: () => void;
}) {
  return (
    <View style={styles.fill}>
      <View style={styles.detailTop}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹ Quay lại</Text>
        </Pressable>
        <View style={styles.detailCover}>
          <Cover book={book} />
          <DiscountBadge book={book} />
        </View>
      </View>

      <ScrollView
        style={styles.fill}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.detailContent}>
        <Text style={styles.detailTitle}>{book.title}</Text>
        <Text style={styles.metaText}>Tác giả: {book.author}</Text>
        <View style={styles.detailMetaRow}>
          <Text style={styles.detailPill}>{book.category}</Text>
          <Text style={styles.detailPill}>{book.rating.toFixed(1)}★ đánh giá</Text>
        </View>
        <Text style={styles.detailPrice}>{money(book.price)}</Text>

        <SectionTitle title="Mô tả sản phẩm" />
        <Text style={styles.description}>{book.description}</Text>
        <Text style={styles.description}>
          Bố cục màn hình này đặt ảnh bìa và nút điều hướng ở phần cố định phía
          trên, phần mô tả dài trong ScrollView, còn thanh hành động nằm ngoài
          vùng cuộn để luôn dễ thao tác.
        </Text>
      </ScrollView>

      <View style={styles.bottomAction}>
        <View>
          <Text style={styles.metaText}>Giá bán</Text>
          <Text style={styles.priceLarge}>{money(book.price)}</Text>
        </View>
        <Pressable onPress={onAddToCart} style={styles.primaryButton}>
          <Text style={styles.primaryText}>＋ Thêm vào giỏ</Text>
        </Pressable>
      </View>
    </View>
  );
}

function CartScreen({cart}: {cart: CartItem[]}) {
  const lines = cart
    .map(item => {
      const book = books.find(value => value.id === item.id);
      return book ? {...item, book} : null;
    })
    .filter(Boolean) as Array<CartItem & {book: Book}>;

  const total = lines.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0,
  );

  return (
    <View style={styles.fill}>
      <ScrollView
        style={styles.fill}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.cartContent}>
        <Text style={styles.screenTitle}>Giỏ hàng</Text>
        {lines.map(item => (
          <View key={item.id} style={styles.cartRow}>
            <Cover book={item.book} compact />
            <View style={styles.cartInfo}>
              <Text numberOfLines={2} style={styles.rowTitle}>
                {item.book.title}
              </Text>
              <Text style={styles.metaText}>Số lượng: {item.quantity}</Text>
            </View>
            <View style={styles.cartPriceBox}>
              <Text style={styles.price}>{money(item.book.price * item.quantity)}</Text>
              <Text style={styles.metaText}>{money(item.book.price)} / cuốn</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.checkout}>
        <View>
          <Text style={styles.metaText}>Tổng thanh toán</Text>
          <Text style={styles.priceLarge}>{money(total)}</Text>
        </View>
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryText}>Thanh toán</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Account() {
  return (
    <View style={styles.account}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>H</Text>
      </View>
      <Text style={styles.screenTitle}>Nguyễn Trọng Hiếu</Text>
      <Text style={styles.metaText}>22002985 · BookStore Online</Text>
      <View style={styles.accountPanel}>
        <Text style={styles.panelTitle}>Bài thực hành Week 3-4</Text>
        <Text style={styles.description}>
          Màn hình tài khoản là layout tĩnh dùng flexbox, giữ đúng yêu cầu
          không dùng thư viện navigation hoặc API ngoài.
        </Text>
      </View>
    </View>
  );
}

function Tabs({page, setPage}: {page: Page; setPage: (page: Page) => void}) {
  const tabs: Array<{key: Page; icon: string; label: string}> = [
    {key: 'home', icon: '⌂', label: 'Trang chủ'},
    {key: 'categories', icon: '▦', label: 'Danh mục'},
    {key: 'cart', icon: '🛒', label: 'Giỏ hàng'},
    {key: 'account', icon: '♙', label: 'Tài khoản'},
  ];

  return (
    <View style={styles.tabs}>
      {tabs.map(tab => {
        const active = page === tab.key || (page === 'detail' && tab.key === 'home');

        return (
          <Pressable
            key={tab.key}
            onPress={() => setPage(tab.key)}
            style={styles.tab}>
            <Text style={[styles.tabIcon, active && styles.tabActive]}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, active && styles.tabActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function AppContent() {
  const [page, setPage] = useState<Page>('home');
  const [selectedBook, setSelectedBook] = useState<Book>(books[0]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [cart, setCart] = useState<CartItem[]>(initialCart);

  const cartCount = useMemo(() => getTotalQuantity(cart), [cart]);

  const openBook = (book: Book) => {
    setSelectedBook(book);
    setPage('detail');
  };

  const addToCart = (book: Book) => {
    setCart(current => {
      const found = current.find(item => item.id === book.id);

      if (found) {
        return current.map(item =>
          item.id === book.id ? {...item, quantity: item.quantity + 1} : item,
        );
      }

      return [...current, {id: book.id, quantity: 1}];
    });
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navy} />
      <Header cartCount={cartCount} onCart={() => setPage('cart')} />

      <View style={styles.appBody}>
        {page === 'home' ? (
          <Home
            cartCount={cartCount}
            openBook={openBook}
            openCart={() => setPage('cart')}
          />
        ) : null}
        {page === 'categories' ? (
          <Categories
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            openBook={openBook}
          />
        ) : null}
        {page === 'detail' ? (
          <Detail
            book={selectedBook}
            onBack={() => setPage('home')}
            onAddToCart={() => addToCart(selectedBook)}
          />
        ) : null}
        {page === 'cart' ? <CartScreen cart={cart} /> : null}
        {page === 'account' ? <Account /> : null}
      </View>

      <Tabs page={page} setPage={setPage} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.appBg,
  },
  fill: {
    flex: 1,
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: colors.navy,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: '800',
  },
  headerCaption: {
    color: '#BCC7E8',
    fontSize: 11,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerIcon: {
    color: colors.surface,
    fontSize: 24,
  },
  headerBadge: {
    position: 'absolute',
    top: 3,
    right: 1,
    minWidth: 19,
    height: 19,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appBody: {
    flex: 1,
    position: 'relative',
  },
  contentLayer: {
    flex: 1,
    position: 'relative',
  },
  homeContent: {
    padding: 16,
    paddingBottom: 104,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 104,
    flexGrow: 1,
  },
  hero: {
    backgroundColor: colors.navy,
    borderRadius: 8,
    minHeight: 168,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroCopy: {
    flex: 1,
  },
  heroKicker: {
    color: '#BFD0FF',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  heroTitle: {
    color: colors.surface,
    fontSize: 21,
    lineHeight: 28,
    fontWeight: '800',
  },
  heroText: {
    color: '#DEE6FF',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  heroCover: {
    width: 104,
  },
  sectionHeader: {
    marginTop: 22,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: colors.navy,
    fontSize: 18,
    fontWeight: '800',
  },
  sectionAction: {
    color: colors.indigo,
    fontSize: 12,
    fontWeight: '700',
  },
  screenTitle: {
    color: colors.navy,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 14,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignContent: 'flex-start',
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.indigo,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.indigo,
  },
  chipText: {
    color: colors.indigo,
    fontWeight: '700',
    fontSize: 13,
  },
  chipTextActive: {
    color: colors.surface,
  },
  cover: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 9,
  },
  coverCompact: {
    width: 78,
    height: 104,
    aspectRatio: undefined,
  },
  coverIcon: {
    color: colors.navy,
    fontSize: 43,
    lineHeight: 48,
  },
  coverIconCompact: {
    fontSize: 27,
    lineHeight: 31,
  },
  coverText: {
    color: colors.navy,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 8,
  },
  coverTextCompact: {
    fontSize: 9,
    lineHeight: 12,
  },
  rowCard: {
    minHeight: 126,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  rowCoverWrap: {
    width: 78,
    position: 'relative',
  },
  rowInfo: {
    flex: 1,
    minHeight: 104,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  rowTitle: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
  },
  metaText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
  tagText: {
    color: colors.indigo,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    fontWeight: '700',
  },
  price: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '800',
  },
  priceLarge: {
    color: colors.danger,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 4,
  },
  detailPrice: {
    color: colors.danger,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
    padding: 10,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  gridCoverWrap: {
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.danger,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  newBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.indigo,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.surface,
    fontSize: 11,
    fontWeight: '900',
  },
  gridTitle: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800',
    minHeight: 38,
    marginTop: 10,
  },
  gridFooter: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    color: colors.indigo,
    fontSize: 12,
    fontWeight: '800',
  },
  floatingCart: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.indigo,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
  },
  floatingIcon: {
    fontSize: 25,
  },
  cartCount: {
    position: 'absolute',
    top: -5,
    right: -3,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 5,
    borderRadius: 11,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTop: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: colors.sky,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
  },
  backText: {
    color: colors.indigo,
    fontSize: 16,
    fontWeight: '800',
  },
  detailCover: {
    width: 178,
    alignSelf: 'center',
    marginTop: 4,
    position: 'relative',
  },
  detailContent: {
    padding: 18,
    paddingBottom: 30,
  },
  detailTitle: {
    color: colors.navy,
    fontSize: 24,
    lineHeight: 31,
    fontWeight: '900',
  },
  detailMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  detailPill: {
    color: colors.indigo,
    backgroundColor: colors.sky,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: '800',
  },
  description: {
    color: '#3F4A60',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
  },
  bottomAction: {
    minHeight: 74,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  primaryButton: {
    backgroundColor: colors.indigo,
    borderRadius: 8,
    paddingHorizontal: 17,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '800',
  },
  cartContent: {
    padding: 16,
    paddingBottom: 22,
    flexGrow: 1,
  },
  cartRow: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartInfo: {
    flex: 1,
  },
  cartPriceBox: {
    width: 104,
    alignItems: 'flex-end',
  },
  checkout: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  account: {
    flex: 1,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.indigo,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: colors.surface,
    fontSize: 36,
    fontWeight: '900',
  },
  accountPanel: {
    marginTop: 22,
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
  },
  panelTitle: {
    color: colors.navy,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  tabs: {
    height: 66,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    color: colors.muted,
    fontSize: 22,
  },
  tabLabel: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 3,
    fontWeight: '700',
  },
  tabActive: {
    color: colors.indigo,
    fontWeight: '900',
  },
});
