# Mızrak Çağı — Android'e dönüştürme ve Google Play'de yayınlama

Bu klasör, oyunu bir Android uygulamasına dönüştürmek için gereken her şeyi içeriyor. Oyun internetsiz çalışacak şekilde paketlenir: 3D motoru ve yazı tipleri uygulamanın içine konur.

## Klasörde neler var

| Dosya / klasör | Ne işe yarar |
|---|---|
| `src/game.html` | Oyunun kendisi. Oyunu güncellediğinizde yalnızca bu dosyayı değiştirirsiniz. |
| `scripts/prepare-web.js` | Oyunu internetsiz çalışacak hale getirip `www` klasörüne koyar. |
| `package.json`, `capacitor.config.json` | Proje ayarları. |
| `assets/icon-only.png` | 1024×1024 uygulama simgesi; Android simgeleri bundan üretilir. |
| `store/simge-512.png` | Play Store'a yüklenecek 512×512 simge. |
| `store/tanitim-1024x500.png` | Play Store tanıtım görseli. |
| `store/magaza-metinleri.md` | Uygulama adı, kısa ve uzun açıklama (Türkçe ve İngilizce), form cevapları. |
| `store/gizlilik-politikasi.html` | Gizlilik politikası sayfası. |

## 1. Bilgisayara kurulacaklar (bir kez)

1. **Node.js** (LTS sürümü): https://nodejs.org
2. **Android Studio**: https://developer.android.com/studio — kurulumda önerilen Android SDK'yı da kurun.

## 2. Projeyi hazırlama

Bu klasörde bir terminal (Windows'ta Komut İstemi veya PowerShell) açın ve sırayla çalıştırın:

```
npm install
npx cap add android
npm run icons
npm run build
npm run open
```

- `npx cap add android` yalnızca ilk seferde çalıştırılır; `android` klasörünü oluşturur.
- `npm run icons` simgeleri ve açılış ekranını üretir.
- `npm run build` oyunu hazırlayıp Android projesine kopyalar.
- `npm run open` projeyi Android Studio'da açar.

**Uygulama kimliği:** `capacitor.config.json` içindeki `com.ornek.mizrakcagi` değerini ilk kurulumdan önce kendinize özgü bir adla değiştirin (örneğin `com.adsoyad.mizrakcagi`). Play'e yükledikten sonra bu değiştirilemez.

**Ekranı yatay kilitlemek (önerilir):** `android/app/src/main/AndroidManifest.xml` dosyasında `<activity` satırına `android:screenOrientation="sensorLandscape"` ekleyin.

## 3. Telefonda deneme

Telefonda Geliştirici seçeneklerini ve USB hata ayıklamayı açın, telefonu USB ile bağlayın ve Android Studio'da yeşil ▶ düğmesine basın.

## 4. Yayın dosyasını (AAB) oluşturma

Android Studio'da **Build → Generate Signed App Bundle / APK → Android App Bundle** yolunu izleyin.

- İlk seferde yeni bir **anahtar deposu (keystore)** oluşturmanız istenir.
- **Bu dosyayı ve şifresini mutlaka saklayın.** Kaybederseniz uygulamayı bir daha güncelleyemezsiniz. Birden fazla yere yedekleyin.
- Sonuçta `app-release.aab` dosyası oluşur; Play Console'a bu yüklenir.

## 5. Google Play Console

1. https://play.google.com/console adresinden geliştirici hesabı açın. Tek seferlik ücret ödenir ve kimlik doğrulaması istenir.
2. **Uygulama oluştur** → ad, dil (Türkçe), "Oyun", "Ücretsiz".
3. **Mağaza girişi:** `store/magaza-metinleri.md` içindeki metinleri, `store/simge-512.png` ve `store/tanitim-1024x500.png` görsellerini yükleyin. En az 2 telefon ekran görüntüsü gerekir; oyunu telefonda oynarken ekran görüntüsü alın.
4. **Gizlilik politikası:** `store/gizlilik-politikasi.html` dosyasında iletişim e-postanızı yazın ve sayfayı herkese açık bir adreste yayınlayın (örneğin Google Sites veya GitHub Pages). O adresi Play Console'a girin.
5. **Uygulama içeriği** bölümündeki formları `store/magaza-metinleri.md` sonundaki cevaplarla doldurun.
6. **Test:** 2023 sonrasında açılan yeni kişisel hesaplarda, uygulamayı herkese açmadan önce en az 12 kişiyle 14 gün kapalı test yapmanız zorunlu. Öğretmen arkadaşlarınızı veya ailenizi test kullanıcısı olarak ekleyebilirsiniz.
7. Test bitince **Üretim** sürümünü oluşturup `app-release.aab` dosyasını yükleyin ve incelemeye gönderin.

> Google'ın kuralları ve ücretleri zaman zaman değişir. Yukarıdaki adımları uygularken Play Console'da gördüğünüz güncel yönergeleri esas alın. Play Console "hedef API düzeyi" uyarısı verirse Capacitor paketlerini güncelleyin: `npm install @capacitor/core@latest @capacitor/android@latest @capacitor/cli@latest @capacitor/app@latest` ve ardından `npx cap sync android`.

## 6. Oyunu güncelleme

1. Yeni `game.html` dosyasını `src` klasörüne koyun (eskisinin üzerine).
2. `npm run build`
3. `android/app/build.gradle` içinde `versionCode` sayısını 1 artırın (örneğin 1 → 2) ve `versionName` değerini değiştirin (örneğin "1.1").
4. Yeni AAB oluşturup Play Console'da yeni sürüm olarak yükleyin.

## 7. Google Play Oyunlar: skor tablosu ve başarımlar (isteğe bağlı)

Oyunun içinde Google Play Oyunlar için bir köprü hazır. Eklenti kurulmazsa oyun her zamanki gibi çalışır; bu adımlar yalnızca Google'ın çevrim içi skor tablosunu ve başarımlarını istiyorsanız gerekli. Bu bölümü cihazda deneyemedim; kurarken eklentinin kendi belgelerindeki güncel adımları esas alın.

1. Play Console'da uygulamanızı açın: **Büyüme → Play Oyunlar Hizmetleri → Kurulum ve yönetim**. Yeni bir oyun projesi oluşturun ve Android kimlik bilgisini ekleyin (imza anahtarınızın SHA-1 parmak izi istenir).
2. **Skor tabloları** bölümünde iki tablo oluşturun: "Sonsuz Av" ve "Toplam Puan". **Başarımlar** bölümünde oyundaki 16 başarımı aynı adlarla oluşturun.
3. Play Console'un verdiği kimlikleri `src/game.html` içinde `PLAY_IDS` satırına yazın: `endless` ve `total` skor tablosu kimlikleri, `ach` içinde her başarımın kimliği.
4. Eklentiyi kurun: `npm install @openforge/capacitor-game-connect` ve ardından `npx cap sync android`. Eklentinin istediği Android ayarlarını (oyun projesi kimliği vb.) belgelerine göre ekleyin.
5. `npm run build` ile oyunu yeniden paketleyin. Puan Tablosu ekranında "Google Play skorları" düğmesi görünür.
6. Bu bağlantıyı eklerseniz Play Console'daki **Veri güvenliği** formunu ve gizlilik politikasını güncelleyin, çünkü skorlar Google'a gönderilir.

## Notlar

- Android'in geri tuşu oyunu duraklatır, menülerde bir önceki ekrana döner, ana menüde uygulamayı kapatır.
- Oyun ilerlemesi telefonun kendi hafızasında saklanır; internet ve hesap gerekmez.
